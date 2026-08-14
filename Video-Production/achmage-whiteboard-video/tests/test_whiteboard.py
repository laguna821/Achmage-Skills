from __future__ import annotations

import hashlib
import io
import json
import math
import re
import shutil
import subprocess
import struct
import sys
import tempfile
import threading
import unittest
import urllib.request
import wave
import zipfile
from argparse import Namespace
from http.server import ThreadingHTTPServer
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from whiteboard_core import (  # noqa: E402
    apply_visibility,
    build_trace_plan,
    compose_reference,
    default_scene,
    element_visibility,
    inspect_audio,
    inspect_video,
    load_json,
    merge_videos,
    migrate_v1,
    parse_srt,
    parse_sequence_plan,
    render_video,
    retime_scene_for_voiceover,
    save_json,
    mux_voiceover,
    timestamps_are_monotonic,
    PreviewHandler,
    PREVIEW_ROOT,
    validate_scene,
)
from tts_core import (  # noqa: E402
    SubscriptionInfo,
    SynthesisResult,
    TTSProvider,
    TTSRequestError,
    VoiceCandidate,
    assert_budget,
    content_voice_profile,
    load_ledger,
    normalize_alignment,
    recommend_voices,
    resolved_tts_config,
    synthesize_to_cache,
)
from pipeline_core import (  # noqa: E402
    alignment_to_cues,
    burn_ass_subtitles,
    package_skill,
    project_content_hash,
    voice_approval_fingerprint,
    wrap_caption,
    write_ass,
    write_srt,
)
from whiteboard import cmd_autobuild, cmd_export_edit_package, normalize_variant, voiced_output_path  # noqa: E402


def silent_wav_bytes(duration_seconds: float = 1.0, sample_rate: int = 16000) -> bytes:
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        frames = round(duration_seconds * sample_rate)
        output.writeframes(
            b"".join(struct.pack("<h", round(1200 * math.sin(2 * math.pi * 220 * index / sample_rate))) for index in range(frames))
        )
    return buffer.getvalue()


class FakeProvider(TTSProvider):
    name = "fake"
    default_model = "fake-ko"

    def __init__(self, failure_status: int | None = None):
        super().__init__("super-secret-key")
        self.failure_status = failure_status
        self.calls = 0
        self.used = 0

    def subscription(self) -> SubscriptionInfo:
        return SubscriptionInfo("free", self.used, 10000, {"private": "not-written"})

    def list_voices(self, desired_gender: str = "male") -> list:
        return []

    def synthesize(self, text, voice_id, model_id, settings, previous_text="", next_text="") -> SynthesisResult:
        self.calls += 1
        if self.failure_status:
            raise TTSRequestError(
                f"가짜 HTTP {self.failure_status}",
                self.failure_status,
                ambiguous=self.failure_status >= 500,
            )
        self.used += len(text)
        characters = list(text)
        starts = [index * 0.02 for index in range(len(characters))]
        ends = [(index + 1) * 0.02 for index in range(len(characters))]
        return SynthesisResult(
            silent_wav_bytes(),
            "wav",
            {"characters": characters, "characterStartTimesSeconds": starts, "characterEndTimesSeconds": ends},
            "fake-request",
            len(text),
            {},
        )


class WhiteboardTests(unittest.TestCase):
    def test_autobuild_stages_markdown_without_calling_tts_before_scene_design(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-autobuild-") as temp:
            root = Path(temp)
            markdown = root / "강의 원문.md"
            markdown.write_text("# 데이터가 곧 취재다\n\n강의 원문입니다.", encoding="utf-8")
            project_dir = root / "한글 프로젝트"
            result = cmd_autobuild(
                Namespace(
                    markdown=markdown,
                    project=project_dir,
                    purpose="private-preview",
                    scenes="all",
                    provider="elevenlabs",
                    gender="any",
                    target_minutes=60,
                )
            )
            self.assertEqual(result, 0)
            project = load_json(project_dir / "project.json")
            state = load_json(project_dir / "workflow-state.json")
            self.assertEqual(project["workflowMode"], "autoAfterVoiceApproval")
            self.assertEqual(project["outputProfile"], "all-in-one")
            self.assertEqual(project["targetDurationMs"], 3_600_000)
            self.assertEqual(state["state"], "needsSceneDesign")
            self.assertTrue((project_dir / "source.md").exists())

    def test_variant_voiced_paths_are_isolated(self) -> None:
        project = Path("project")
        output = voiced_output_path(project, "preview", "sequence-001", normalize_variant("line-trace-smooth-v2"))
        self.assertEqual(output, project / "variants" / "line-trace-smooth-v2" / "previews-voiced" / "sequence-001.mp4")
        with self.assertRaises(ValueError):
            normalize_variant("../")

    def test_kpf_project_has_54_valid_scenes(self) -> None:
        project_dir = ROOT / "projects" / "kpf-ai-archive"
        if not project_dir.exists():
            self.skipTest("배포 패키지에는 개인 프로젝트를 포함하지 않습니다.")
        project = load_json(project_dir / "project.json")
        self.assertEqual(len(project["scenes"]), 54)
        self.assertEqual(project["anchorScenes"], [1, 44, 46])
        for entry in project["scenes"]:
            path = project_dir / entry["path"]
            self.assertEqual(validate_scene(load_json(path), path), [])

    def test_markdown_table_parser(self) -> None:
        text = "| 01 | 첫 주장 | ① 첫 그림 → ② 둘째 그림 |\n| 02 | 둘째 주장 | 하나의 장면 |"
        rows = parse_sequence_plan(text)
        self.assertEqual([row["number"] for row in rows], [1, 2])
        self.assertEqual(rows[0]["narration"], "첫 주장")

    def test_srt_parser_keeps_korean(self) -> None:
        cues = parse_srt("1\n00:00:00,000 --> 00:00:03,000\n데이터가 곧 취재다.\n")
        self.assertEqual(len(cues), 1)
        self.assertEqual(cues[0]["narration"], "데이터가 곧 취재다.")

    def test_v1_migration_normalizes_regions_and_reveal(self) -> None:
        old = {
            "sceneId": "scene-01",
            "canvas": {"width": 1000, "height": 500},
            "sceneDurationMs": 8000,
            "elements": [{"id": "left", "region": {"x": 100, "y": 50, "width": 400, "height": 300}, "reveal": {"startMs": 300, "durationMs": 2000, "direction": "top_to_bottom"}}],
        }
        new = migrate_v1(old)
        self.assertEqual(new["schemaVersion"], 2)
        self.assertEqual(new["elements"][0]["region"], {"x": 0.1, "y": 0.1, "width": 0.4, "height": 0.6})
        self.assertEqual(new["elements"][0]["events"][0]["action"], "draw")

    def test_draw_erase_replace_states(self) -> None:
        scene = default_scene(46, "테스트", "테스트")
        old = next(element for element in scene["elements"] if element["id"] == "pretty-doc")
        new = next(element for element in scene["elements"] if element["id"] == "machine-doc")
        self.assertGreater(element_visibility(old, 3200, scene)[0], 0.9)
        self.assertLess(element_visibility(old, 5200, scene)[0], 0.01)
        self.assertLess(element_visibility(new, 4400, scene)[0], 0.01)
        self.assertGreater(element_visibility(new, 5900, scene)[0], 0.9)

    def test_line_trace_reveals_raster_strokes_progressively(self) -> None:
        layer = Image.new("RGBA", (320, 180), (0, 0, 0, 0))
        draw = ImageDraw.Draw(layer)
        draw.line((20, 40, 145, 40, 145, 130), fill="#263238", width=9)
        draw.ellipse((190, 45, 285, 140), fill="#2F6BFF", outline="#263238", width=7)
        element = {
            "id": "art",
            "kind": "art",
            "region": {"x": 0, "y": 0, "width": 1, "height": 1},
            "events": [{"action": "draw", "startMs": 0, "durationMs": 1000, "animation": "line-trace"}],
        }
        plan = build_trace_plan(layer)
        early = apply_visibility(layer, element, 0.2, element["events"][0], plan)
        middle = apply_visibility(layer, element, 0.55, element["events"][0], plan)
        complete = apply_visibility(layer, element, 1.0, element["events"][0], plan)
        visible = lambda image: sum(image.getchannel("A").histogram()[1:])
        self.assertLess(visible(early), visible(middle))
        self.assertLess(visible(middle), visible(complete))
        self.assertEqual(visible(complete), visible(layer))
        self.assertEqual(plan.order_map.mode, "I")
        self.assertGreater(len(plan.cursor_positions), 1000)
        self.assertGreater(len(set(plan.cursor_positions)), 20)

    def test_voice_timing_is_frame_aligned_and_does_not_mutate_authored_scene(self) -> None:
        scene = default_scene(1, "원본", "그림")
        before = json.dumps(scene, ensure_ascii=False, sort_keys=True)
        timed, frames = retime_scene_for_voiceover(scene, 10000, 30, 1250, 1750)
        self.assertEqual(frames, 390)
        self.assertEqual(timed["durationMs"], 13000)
        self.assertEqual(timed["resolvedTiming"]["baseDurationMs"], 8000)
        self.assertEqual(json.dumps(scene, ensure_ascii=False, sort_keys=True), before)
        for element in timed["elements"]:
            holds = [event for event in element["events"] if event["action"] == "hold"]
            for event in holds:
                self.assertEqual(event["startMs"] + event["durationMs"], timed["durationMs"])

    def test_tts_cache_budget_and_secret_redaction(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-tts-cache-") as temp:
            project_dir = Path(temp)
            destination = project_dir / "voiceover"
            provider = FakeProvider()
            config = resolved_tts_config({"tts": {"provider": "elevenlabs", "pilotMaxCredits": 1500}})
            config["provider"] = "fake"
            config["modelId"] = "fake-ko"
            manifest1 = synthesize_to_cache(project_dir, destination, "한국어 대본입니다.", provider, config, "voice-1", "voiceover", 50)
            manifest2 = synthesize_to_cache(project_dir, destination, "한국어 대본입니다.", provider, config, "voice-1", "voiceover", 50)
            self.assertEqual(provider.calls, 1)
            self.assertFalse(manifest1["cacheHit"])
            self.assertTrue(manifest2["cacheHit"])
            stored = "\n".join(path.read_text(encoding="utf-8") for path in project_dir.rglob("*.json"))
            self.assertNotIn("super-secret-key", stored)
            self.assertEqual(load_ledger(project_dir)["entries"][0]["actualCredits"], len("한국어 대본입니다."))
            with self.assertRaises(ValueError):
                assert_budget(project_dir, config, SubscriptionInfo("free", 2400, 10000, {}), 200, 200)

    def test_typecast_top_level_character_timestamps_are_normalized(self) -> None:
        result = normalize_alignment(
            {
                "characters": [
                    {"text": "한", "start": 0.1, "end": 0.2},
                    {"text": "글", "start": 0.2, "end": 0.3},
                ],
                "words": [{"text": "한글", "start": 0.1, "end": 0.3}],
            }
        )
        self.assertEqual(result["characters"], ["한", "글"])
        self.assertEqual(result["characterStartTimesSeconds"], [0.1, 0.2])

    def test_original_korean_alignment_is_preferred_to_romanized_alignment(self) -> None:
        result = normalize_alignment(
            {
                "alignment": {
                    "characters": ["한", "글"],
                    "character_start_times_seconds": [0.1, 0.2],
                    "character_end_times_seconds": [0.2, 0.3],
                },
                "normalized_alignment": {
                    "characters": list("hangeul"),
                    "character_start_times_seconds": [0.0] * 7,
                    "character_end_times_seconds": [0.1] * 7,
                },
            }
        )
        self.assertEqual(result["characters"], ["한", "글"])

    def test_caption_cues_fallback_to_korean_script_and_safe_limits(self) -> None:
        script = "AI가 현장 취재를 대신할 수는 없습니다. 기록된 데이터는 다음 질문을 만드는 중요한 단서가 됩니다."
        alignment = {
            "characters": list("AIga hyeonjang chwijaereul daesinhal suneun eopsseumnida."),
            "characterStartTimesSeconds": [index * 0.1 for index in range(54)],
            "characterEndTimesSeconds": [(index + 1) * 0.1 for index in range(54)],
        }
        cues = alignment_to_cues(script, alignment, 5400)
        self.assertGreaterEqual(len(cues), 2)
        self.assertTrue(all("AI" in cue.text or any("가" <= char <= "힣" for char in cue.text) for cue in cues))
        self.assertTrue(all(cue.start_ms < cue.end_ms for cue in cues))
        self.assertTrue(all(cue.text.count("\n") <= 1 for cue in cues))
        self.assertTrue(all(len(line) <= 22 for cue in cues for line in cue.text.splitlines()))
        self.assertEqual(wrap_caption("데이터가 다음 질문과 후속 취재의 중요한 단서가 됩니다", 22).count("\n"), 1)

    def test_voice_recommendation_is_content_aware(self) -> None:
        voices = [
            VoiceCandidate("calm", "Calm News Narrator", 10, {"useCase": "news", "age": "young"}),
            VoiceCandidate("character", "Robot Character", 20, {"useCase": "character"}),
        ]
        profile, ranked = recommend_voices(voices, "AI 데이터 취재 검증 강의", 2)
        self.assertIn("news", profile["tags"])
        self.assertEqual(ranked[0].voice_id, "calm")

    def test_voice_approval_fingerprint_changes_with_script(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-approval-") as temp:
            project_dir = Path(temp)
            scene_dir = project_dir / "scenes" / "sequence-001"
            scene_dir.mkdir(parents=True)
            scene = default_scene(1, "핵심", "그림")
            scene["voiceover"] = {"script": "첫 대본", "status": "approved"}
            save_json(scene_dir / "scene.json", scene)
            project = {"projectId": "approval", "pronunciationOverrides": {}}
            first = project_content_hash(project_dir, [scene_dir / "scene.json"], project)
            fingerprint = voice_approval_fingerprint(first, "fake", "voice", "model", {"speed": 1})
            scene["voiceover"]["script"] = "바뀐 대본"
            save_json(scene_dir / "scene.json", scene)
            second = project_content_hash(project_dir, [scene_dir / "scene.json"], project)
            self.assertNotEqual(first, second)
            self.assertNotEqual(fingerprint, voice_approval_fingerprint(second, "fake", "voice", "model", {"speed": 1}))

    def test_fake_tts_http_failures_are_not_retried(self) -> None:
        for status in (401, 402, 429, 500):
            with self.subTest(status=status), tempfile.TemporaryDirectory(prefix=f"achmage-tts-{status}-") as temp:
                project_dir = Path(temp)
                provider = FakeProvider(status)
                config = resolved_tts_config({"tts": {"provider": "elevenlabs"}})
                config.update({"provider": "fake", "modelId": "fake-ko"})
                with self.assertRaises(TTSRequestError):
                    synthesize_to_cache(project_dir, project_dir / "voice", "실패 테스트", provider, config, "voice", "voiceover", 20)
                self.assertEqual(provider.calls, 1)
                expected = "ambiguous" if status >= 500 else "failed"
                self.assertEqual(load_ledger(project_dir)["entries"][0]["status"], expected)

    def test_compose_keeps_native_source_and_renders_korean(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-한글-") as temp:
            project_dir = Path(temp)
            scene_dir = project_dir / "scenes" / "sequence-001"
            scene_dir.mkdir(parents=True)
            scene = default_scene(1, "데이터가 곧 취재다", "파란 보관함")
            scene["source"]["status"] = "ready"
            save_json(scene_dir / "scene.json", scene)
            save_json(project_dir / "project.json", {"theme": "achmage-newsroom-light", "themeOverrides": {}, "scenes": [{"number": 1, "sceneId": "sequence-001", "path": "scenes/sequence-001/scene.json"}]})
            image = Image.new("RGB", (640, 360), "#EEF4F7")
            draw = ImageDraw.Draw(image)
            draw.ellipse((210, 100, 430, 315), fill="#2F6BFF", outline="#263238", width=8)
            source = scene_dir / "base-art.png"
            image.save(source)
            before = hashlib.sha256(source.read_bytes()).hexdigest()
            output = compose_reference(scene_dir / "scene.json")
            after = hashlib.sha256(source.read_bytes()).hexdigest()
            self.assertEqual(before, after)
            with Image.open(output) as result:
                self.assertEqual(result.size, (640, 360))
            self.assertGreater(output.stat().st_size, 1000)
            updated = load_json(scene_dir / "scene.json")
            self.assertEqual((updated["source"]["nativeWidth"], updated["source"]["nativeHeight"]), (640, 360))

    def test_dark_theme_replaces_light_source_background(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-dark-") as temp:
            project_dir = Path(temp)
            scene_dir = project_dir / "scenes" / "sequence-001"
            scene_dir.mkdir(parents=True)
            scene = default_scene(1, "어두운 테마", "파란 원")
            scene["canvas"]["theme"] = "achmage-newsroom-dark"
            save_json(scene_dir / "scene.json", scene)
            save_json(project_dir / "project.json", {"theme": "achmage-newsroom-dark", "themeOverrides": {}, "scenes": [{"number": 1, "sceneId": "sequence-001", "path": "scenes/sequence-001/scene.json"}]})
            image = Image.new("RGB", (640, 360), "white")
            ImageDraw.Draw(image).ellipse((250, 120, 390, 300), fill="#2F6BFF")
            image.save(scene_dir / "base-art.png")
            output = compose_reference(scene_dir / "scene.json")
            with Image.open(output) as result:
                corner = result.convert("RGB").getpixel((5, 5))
            self.assertLess(sum(corner), 180)

    def test_small_video_and_monotonic_merge(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-video-") as temp:
            project_dir = Path(temp)
            scene_dir = project_dir / "scenes" / "sequence-001"
            scene_dir.mkdir(parents=True)
            scene = default_scene(1, "영상 테스트", "간단한 원")
            scene["durationMs"] = 1000
            for element in scene["elements"]:
                for event in element["events"]:
                    event["startMs"] = min(event["startMs"], 200)
                    event["durationMs"] = min(event["durationMs"], max(0, 1000 - event["startMs"]))
            save_json(scene_dir / "scene.json", scene)
            save_json(project_dir / "project.json", {"theme": "achmage-newsroom-light", "themeOverrides": {}, "previewProfile": {"width": 320, "height": 180, "fps": 10, "crf": 28}, "scenes": [{"number": 1, "sceneId": "sequence-001", "path": "scenes/sequence-001/scene.json"}]})
            image = Image.new("RGB", (640, 360), "#EEF4F7")
            ImageDraw.Draw(image).rectangle((220, 100, 420, 300), fill="#2F6BFF")
            image.save(scene_dir / "base-art.png")
            clip1 = project_dir / "one.mp4"
            clip2 = project_dir / "two.mp4"
            render_video(scene_dir / "scene.json", clip1, "preview")
            render_video(scene_dir / "scene.json", clip2, "preview")
            merged = merge_videos([clip1, clip2], project_dir / "merged.mp4")
            info = inspect_video(merged)
            self.assertEqual((info["width"], info["height"]), (320, 180))
            self.assertEqual(info["frames"], 20)
            self.assertAlmostEqual(info["durationSeconds"], 2.0, places=1)
            self.assertEqual(info["codec"], "h264")
            self.assertEqual(info["pixelFormat"], "yuv420p")
            self.assertFalse(info["hasAudio"])
            ass = write_ass(project_dir / "captions.ass", [alignment_to_cues("한글 자막 테스트", {}, 800, 100)[0]], 320, 180)
            captioned = burn_ass_subtitles(clip1, ass, project_dir / "captioned.mp4", 28, "veryfast")
            captioned_info = inspect_video(captioned)
            self.assertEqual((captioned_info["width"], captioned_info["height"]), (320, 180))
            self.assertEqual(captioned_info["codec"], "h264")

    def test_dynamic_voiced_video_has_padding_aac_and_monotonic_merge(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-유성-") as temp:
            project_dir = Path(temp)
            scene_dir = project_dir / "scenes" / "sequence-001"
            scene_dir.mkdir(parents=True)
            scene = default_scene(1, "음성 테스트", "간단한 원")
            scene["durationMs"] = 1000
            for element in scene["elements"]:
                for event in element["events"]:
                    event["startMs"] = min(event["startMs"], 200)
                    event["durationMs"] = min(event["durationMs"], max(0, 1000 - event["startMs"]))
            save_json(scene_dir / "scene.json", scene)
            save_json(project_dir / "project.json", {"previewProfile": {"width": 320, "height": 180, "fps": 10, "crf": 28}, "scenes": []})
            Image.new("RGB", (640, 360), "#EEF4F7").save(scene_dir / "base-art.png")
            audio = project_dir / "voice.wav"
            audio.write_bytes(silent_wav_bytes(1.0, 16000))
            silent = project_dir / "silent.mp4"
            voiced1 = project_dir / "voiced-1.mp4"
            voiced2 = project_dir / "voiced-2.mp4"
            render_video(
                scene_dir / "scene.json",
                silent,
                "preview",
                voice_timing={"audioDurationMs": 1000, "leadInMs": 250, "leadOutMs": 250, "alignment": {}},
            )
            mux_voiceover(silent, audio, voiced1, 250)
            shutil.copy2(voiced1, voiced2)
            info = inspect_video(voiced1)
            audio_info = inspect_audio(voiced1)
            self.assertTrue(info["hasAudio"])
            self.assertEqual(audio_info["codec"], "aac")
            self.assertEqual(audio_info["sampleRate"], 48000)
            self.assertAlmostEqual(info["durationSeconds"], 1.5, places=1)
            merged = merge_videos([voiced1, voiced2], project_dir / "voiced-merged.mp4")
            merged_info = inspect_video(merged)
            self.assertTrue(merged_info["hasAudio"])
            self.assertAlmostEqual(merged_info["durationSeconds"], 3.0, places=1)
            pts = timestamps_are_monotonic(merged)
            self.assertTrue(pts["videoPtsMonotonic"])
            self.assertTrue(pts["audioPtsMonotonic"])

    def test_edit_package_uses_existing_assets_without_tts_provider(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-edit-package-") as temp:
            project_dir = Path(temp)
            scene_dir = project_dir / "scenes" / "sequence-001"
            voice_dir = scene_dir / "voiceover"
            voice_dir.mkdir(parents=True)
            scene = default_scene(1, "편집 테스트", "간단한 원")
            scene["voiceover"] = {
                "script": "기존 음성과 자막만 사용합니다.",
                "status": "generated",
                "generated": {
                    "alignmentFile": "voiceover/alignment.json",
                    "audioDurationMs": 1000,
                    "commercialUseAllowed": False,
                },
            }
            save_json(scene_dir / "scene.json", scene)
            save_json(voice_dir / "alignment.json", {})
            save_json(
                project_dir / "project.json",
                {
                    "projectId": "edit-test",
                    "title": "편집 테스트",
                    "tts": {"leadInMs": 250, "leadOutMs": 250},
                    "scenes": [{"number": 1, "sceneId": "sequence-001", "path": "scenes/sequence-001/scene.json"}],
                },
            )
            Image.new("RGB", (640, 360), "white").save(scene_dir / "base-art.png")
            silent = project_dir / "silent.mp4"
            audio = project_dir / "voice.wav"
            audio.write_bytes(silent_wav_bytes(1.0, 16000))
            render_video(scene_dir / "scene.json", silent, "preview", voice_timing={"audioDurationMs": 1000, "leadInMs": 250, "leadOutMs": 250, "alignment": {}})
            clip = project_dir / "renders-voiced" / "sequence-001.mp4"
            mux_voiceover(silent, audio, clip, 250)
            output = project_dir / "editable"
            result = cmd_export_edit_package(
                Namespace(project=project_dir, scenes="all", variant=None, input=clip, output=output, purpose="private-preview")
            )
            self.assertEqual(result, 0)
            index = load_json(output / "edit-index.json")
            self.assertEqual(index["ttsApiCalls"], 0)
            self.assertTrue((output / "편집 테스트-4k-clean.mp4").exists())
            self.assertTrue((output / "편집 테스트.srt").exists())

    def test_clean_skill_package_excludes_projects_and_runtimes(self) -> None:
        with tempfile.TemporaryDirectory(prefix="achmage-package-test-") as temp:
            root = Path(temp) / "achmage-test"
            (root / "scripts").mkdir(parents=True)
            (root / "projects" / "private").mkdir(parents=True)
            (root / ".venv").mkdir()
            (root / "SKILL.md").write_text("---\nname: achmage-test\ndescription: 테스트\n---\n", encoding="utf-8")
            (root / "LICENSE").write_text("MIT", encoding="utf-8")
            (root / "scripts" / "tool.py").write_text("print('한글')\n", encoding="utf-8")
            (root / "projects" / "private" / "secret.json").write_text("{}", encoding="utf-8")
            output = Path(temp) / "skill.zip"
            report = package_skill(root, output)
            self.assertGreater(report["files"], 0)
            with zipfile.ZipFile(output) as archive:
                names = archive.namelist()
            self.assertTrue(any(name.endswith("SKILL.md") for name in names))
            self.assertFalse(any("projects/" in name or ".venv/" in name for name in names))

    def test_preview_server_returns_korean_editor(self) -> None:
        handler = lambda *args, **kwargs: PreviewHandler(*args, directory=str(PREVIEW_ROOT), **kwargs)
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{server.server_port}/", timeout=5) as response:
                html = response.read().decode("utf-8")
            self.assertEqual(response.status, 200)
            self.assertIn("Achmage 화이트보드 편집기", html)
            self.assertIn("영역 다시 그리기", html)
            self.assertIn("선 따라 정밀 그리기", html)
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)

    def test_preview_javascript_syntax_when_node_is_available(self) -> None:
        node = shutil.which("node")
        if not node:
            self.skipTest("Node.js가 없어 JavaScript 구문 검사를 건너뜁니다.")
        html = (PREVIEW_ROOT / "index.html").read_text(encoding="utf-8")
        match = re.search(r"<script>([\s\S]*?)</script>", html)
        self.assertIsNotNone(match)
        with tempfile.TemporaryDirectory(prefix="achmage-js-") as temp:
            script = Path(temp) / "preview.js"
            script.write_text(match.group(1), encoding="utf-8")
            result = subprocess.run([node, "--check", str(script)], capture_output=True, text=True, encoding="utf-8", errors="replace")
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_no_han_characters_in_user_facing_text(self) -> None:
        han = re_compile_han()
        excluded = {ROOT / "LICENSE"}
        extensions = {".md", ".py", ".html", ".yaml", ".yml", ".json", ".ps1", ".sh", ".cmd", ".txt"}
        findings: list[str] = []
        for path in ROOT.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in extensions or path in excluded or ".venv" in path.parts or "tmp" in path.parts:
                continue
            text = path.read_text(encoding="utf-8-sig")
            if han.search(text):
                findings.append(str(path.relative_to(ROOT)))
        self.assertEqual(findings, [])


def re_compile_han():
    import re

    return re.compile("[\\u3400-\\u4DBF\\u4E00-\\u9FFF]")


if __name__ == "__main__":
    unittest.main(verbosity=2)
