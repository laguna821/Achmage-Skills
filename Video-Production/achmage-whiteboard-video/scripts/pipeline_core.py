from __future__ import annotations

import hashlib
import json
import math
import re
import shutil
import subprocess
import tempfile
import time
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Iterable

from whiteboard_core import FONT_PATH, ffmpeg_executable, inspect_video, load_json, save_json


@dataclass(frozen=True)
class CaptionCue:
    start_ms: int
    end_ms: int
    text: str
    alignment: str = "bottom"


def stable_hash(value: Any) -> str:
    encoded = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def project_content_hash(project_dir: Path, scene_paths: Iterable[Path], project: dict[str, Any]) -> str:
    scenes: list[dict[str, Any]] = []
    for path in scene_paths:
        scene = load_json(path)
        scenes.append(
            {
                "sceneId": scene.get("sceneId"),
                "narration": scene.get("narration", ""),
                "script": scene.get("voiceover", {}).get("script", ""),
                "visualBrief": scene.get("visualBrief", ""),
            }
        )
    return stable_hash(
        {
            "projectId": project.get("projectId"),
            "sourceHash": project.get("sourceHash"),
            "scenes": scenes,
            "pronunciationOverrides": project.get("pronunciationOverrides", {}),
        }
    )


def voice_approval_fingerprint(content_hash: str, provider: str, voice_id: str, model_id: str, settings: dict[str, Any]) -> str:
    return stable_hash(
        {
            "contentHash": content_hash,
            "provider": provider,
            "voiceId": voice_id,
            "modelId": model_id,
            "settings": settings,
        }
    )


def validate_voice_approval(project_dir: Path, scene_paths: list[Path], project: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    approval = project.get("voiceApproval")
    if not isinstance(approval, dict) or approval.get("status") != "approved":
        raise ValueError("승인된 음성이 없습니다. 먼저 오디션 뒤 approve-voice를 실행하세요.")
    content_hash = project_content_hash(project_dir, scene_paths, project)
    expected = voice_approval_fingerprint(
        content_hash,
        str(config.get("provider")),
        str(config.get("voiceId") or ""),
        str(config.get("modelId") or ""),
        config.get("voiceSettings", {}),
    )
    if approval.get("fingerprint") != expected:
        raise ValueError("대본·화자·모델 또는 음성 설정이 바뀌어 음성 승인이 무효화됐습니다. 새 오디션이 필요합니다.")
    return approval


def apply_pronunciation_overrides(text: str, overrides: dict[str, Any] | None) -> str:
    result = text
    for source, replacement in (overrides or {}).items():
        if source:
            result = result.replace(str(source), str(replacement))
    return result


def _split_long_text(text: str, maximum: int) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    words = text.split(" ")
    chunks: list[str] = []
    current = ""
    for word in words:
        pieces = [word[index : index + maximum] for index in range(0, len(word), maximum)] or [word]
        for piece in pieces:
            candidate = f"{current} {piece}".strip()
            sentence_end = bool(re.search(r"[.!?。！？]$", piece))
            if current and len(candidate) > maximum:
                chunks.append(current)
                current = piece
            else:
                current = candidate
            if sentence_end and len(current) >= 10:
                chunks.append(current)
                current = ""
    if current:
        chunks.append(current)
    return chunks


def wrap_caption(text: str, maximum_per_line: int = 22) -> str:
    if len(text) <= maximum_per_line:
        return text
    candidates = [index for index, char in enumerate(text) if char == " " and 4 <= index <= len(text) - 4]
    split = min(candidates, key=lambda value: abs(value - len(text) / 2)) if candidates else min(maximum_per_line, len(text))
    return text[:split].rstrip() + "\n" + text[split:].lstrip()


def _alignment_time_range(alignment: dict[str, Any], audio_duration_ms: int) -> tuple[str, list[float], list[float], int, int]:
    raw_characters = alignment.get("characters", [])
    characters = raw_characters if isinstance(raw_characters, str) else "".join(str(value) for value in raw_characters)
    starts = [float(value) for value in alignment.get("characterStartTimesSeconds", []) if isinstance(value, (int, float))]
    ends = [float(value) for value in alignment.get("characterEndTimesSeconds", []) if isinstance(value, (int, float))]
    usable = min(len(characters), len(starts), len(ends))
    if usable:
        return characters[:usable], starts[:usable], ends[:usable], round(starts[0] * 1000), round(ends[usable - 1] * 1000)
    return "", [], [], 0, max(1, audio_duration_ms)


def alignment_to_cues(
    script: str,
    alignment: dict[str, Any],
    audio_duration_ms: int,
    lead_in_ms: int = 1250,
    maximum_per_line: int = 22,
    minimum_duration_ms: int = 1000,
    maximum_duration_ms: int = 6000,
    alignment_position: str = "bottom",
) -> list[CaptionCue]:
    display = re.sub(r"\s+", " ", script).strip()
    if not display:
        return []
    aligned_text, starts, ends, speech_start, speech_end = _alignment_time_range(alignment, audio_duration_ms)
    chunks = _split_long_text(display, maximum_per_line * 2)
    exact_alignment = bool(aligned_text and display in aligned_text)
    exact_offset = aligned_text.find(display) if exact_alignment else -1
    cues: list[CaptionCue] = []
    display_cursor = 0
    for chunk in chunks:
        chunk_start = display.find(chunk, display_cursor)
        if chunk_start < 0:
            chunk_start = display_cursor
        chunk_end = min(len(display), chunk_start + len(chunk))
        display_cursor = chunk_end
        if exact_alignment:
            first = min(len(starts) - 1, exact_offset + chunk_start)
            last = min(len(ends) - 1, max(first, exact_offset + chunk_end - 1))
            start_ms = round(starts[first] * 1000)
            end_ms = round(ends[last] * 1000)
        else:
            span = max(1, speech_end - speech_start)
            start_ms = speech_start + round(span * chunk_start / max(1, len(display)))
            end_ms = speech_start + round(span * chunk_end / max(1, len(display)))
        if end_ms - start_ms > maximum_duration_ms and len(chunk) > maximum_per_line:
            halfway = max(1, len(chunk) // 2)
            split_candidates = [index for index, char in enumerate(chunk) if char == " " and 4 <= index <= len(chunk) - 4]
            split_at = min(split_candidates, key=lambda value: abs(value - halfway)) if split_candidates else halfway
            subtexts = [chunk[:split_at].strip(), chunk[split_at:].strip()]
            consumed = 0
            for subtext in subtexts:
                fraction_start = consumed / max(1, len(chunk))
                consumed += len(subtext)
                fraction_end = consumed / max(1, len(chunk))
                sub_start = start_ms + round((end_ms - start_ms) * fraction_start)
                sub_end = start_ms + round((end_ms - start_ms) * fraction_end)
                cues.append(CaptionCue(lead_in_ms + sub_start, lead_in_ms + max(sub_end, sub_start + minimum_duration_ms), wrap_caption(subtext, maximum_per_line), alignment_position))
        else:
            cues.append(CaptionCue(lead_in_ms + start_ms, lead_in_ms + max(end_ms, start_ms + minimum_duration_ms), wrap_caption(chunk, maximum_per_line), alignment_position))
    normalized: list[CaptionCue] = []
    scene_limit = lead_in_ms + max(audio_duration_ms, speech_end) + 1
    for index, cue in enumerate(cues):
        next_start = cues[index + 1].start_ms if index + 1 < len(cues) else scene_limit
        end_ms = min(cue.end_ms, next_start if next_start > cue.start_ms else cue.end_ms, scene_limit)
        end_ms = max(cue.start_ms + 1, end_ms)
        normalized.append(CaptionCue(cue.start_ms, end_ms, cue.text, cue.alignment))
    return normalized


def caption_position_for_scene(scene: dict[str, Any]) -> str:
    protected = scene.get("protectedRegions", [])
    if not isinstance(protected, list) or not protected:
        return "bottom"

    def overlap(region: dict[str, Any], top: float, bottom: float) -> float:
        y1 = float(region.get("y", 0))
        y2 = y1 + float(region.get("height", 0))
        vertical = max(0.0, min(y2, bottom) - max(y1, top))
        return vertical * max(0.0, float(region.get("width", 0)))

    bottom_overlap = sum(overlap(region, 0.70, 1.0) for region in protected if isinstance(region, dict))
    top_overlap = sum(overlap(region, 0.0, 0.28) for region in protected if isinstance(region, dict))
    return "top" if bottom_overlap > top_overlap else "bottom"


def _srt_time(milliseconds: int) -> str:
    milliseconds = max(0, int(milliseconds))
    hours, remainder = divmod(milliseconds, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    seconds, millis = divmod(remainder, 1000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"


def write_srt(path: Path, cues: list[CaptionCue]) -> Path:
    lines: list[str] = []
    for index, cue in enumerate(cues, 1):
        lines.extend([str(index), f"{_srt_time(cue.start_ms)} --> {_srt_time(cue.end_ms)}", cue.text, ""])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def _ass_time(milliseconds: int) -> str:
    centiseconds = max(0, int(round(milliseconds / 10)))
    hours, remainder = divmod(centiseconds, 360_000)
    minutes, remainder = divmod(remainder, 6000)
    seconds, centis = divmod(remainder, 100)
    return f"{hours}:{minutes:02d}:{seconds:02d}.{centis:02d}"


def _ass_text(text: str) -> str:
    return text.replace("\\", r"\\").replace("{", r"\{").replace("}", r"\}").replace("\n", r"\N")


def write_ass(path: Path, cues: list[CaptionCue], width: int = 3840, height: int = 2160) -> Path:
    font_size = max(28, round(height * 0.043))
    margin_v = max(34, round(height * 0.055))
    outline = max(1, round(height / 900))
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
ScaledBorderAndShadow: yes
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans KR,{font_size},&H00FFFFFF,&H00FFFFFF,&H00131B22,&H780B1118,-1,0,0,0,100,100,0,0,3,{outline},0,2,180,180,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    for cue in cues:
        alignment = 8 if cue.alignment == "top" else 2
        events.append(
            f"Dialogue: 0,{_ass_time(cue.start_ms)},{_ass_time(cue.end_ms)},Default,,0,0,0,,{{\\an{alignment}}}{_ass_text(cue.text)}"
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(header + "\n".join(events) + "\n", encoding="utf-8-sig")
    return path


def offset_cues(cues: Iterable[CaptionCue], offset_ms: int) -> list[CaptionCue]:
    return [CaptionCue(cue.start_ms + offset_ms, cue.end_ms + offset_ms, cue.text, cue.alignment) for cue in cues]


def _ffmpeg_filter_path(path: Path) -> str:
    value = path.resolve().as_posix().replace("\\", "/")
    return value.replace(":", r"\:").replace("'", r"\'").replace("[", r"\[").replace("]", r"\]")


def burn_ass_subtitles(video: Path, ass_path: Path, output: Path, crf: int = 17, preset: str = "medium", fps: int = 60) -> Path:
    if not video.exists():
        raise FileNotFoundError(f"자막을 입힐 영상이 없습니다: {video}")
    if not ass_path.exists():
        raise FileNotFoundError(f"ASS 자막이 없습니다: {ass_path}")
    output.parent.mkdir(parents=True, exist_ok=True)
    filter_value = f"ass=filename='{_ffmpeg_filter_path(ass_path)}':fontsdir='{_ffmpeg_filter_path(FONT_PATH.parent)}'"
    command = [
        ffmpeg_executable(),
        "-y",
        "-loglevel",
        "error",
        "-i",
        str(video),
        "-vf",
        filter_value,
        "-c:v",
        "libx264",
        "-preset",
        preset,
        "-profile:v",
        "high",
        "-crf",
        str(crf),
        "-pix_fmt",
        "yuv420p",
        "-r",
        str(fps),
        "-fps_mode",
        "cfr",
        "-c:a",
        "copy",
        "-movflags",
        "+faststart",
        str(output),
    ]
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if result.returncode != 0:
        raise RuntimeError(f"4K 자막 번인 실패: {result.stderr.strip()}")
    return output


def safe_output_stem(title: str) -> str:
    value = re.sub(r"[<>:\"/\\|?*\x00-\x1f]+", "-", title).strip(" .-")
    return value[:80] or "achmage-whiteboard"


def build_caption_tracks(project_dir: Path, scene_paths: list[Path], clip_paths: list[Path]) -> dict[str, Any]:
    if len(scene_paths) != len(clip_paths):
        raise ValueError("장면과 영상 클립 수가 일치하지 않습니다.")
    cache_dir = project_dir / ".achmage-cache" / "captions"
    merged: list[CaptionCue] = []
    scene_entries: list[dict[str, Any]] = []
    offset_ms = 0
    project = load_json(project_dir / "project.json")
    subtitle_config = project.get("subtitles", {}) if isinstance(project.get("subtitles"), dict) else {}
    tts = project.get("tts", {})
    for scene_path, clip_path in zip(scene_paths, clip_paths):
        scene = load_json(scene_path)
        generated = scene.get("voiceover", {}).get("generated", {})
        alignment_file = str(generated.get("alignmentFile", ""))
        alignment_path = scene_path.parent / alignment_file
        alignment = load_json(alignment_path) if alignment_path.exists() else {}
        audio_duration_ms = int(generated.get("audioDurationMs") or 0)
        if not audio_duration_ms:
            raise ValueError(f"음성 길이가 기록되지 않은 장면입니다: {scene_path.parent.name}")
        cues = alignment_to_cues(
            str(scene.get("voiceover", {}).get("script", "")),
            alignment,
            audio_duration_ms,
            int(tts.get("leadInMs", 1250)),
            int(subtitle_config.get("maxCharsPerLine", 22)),
            int(subtitle_config.get("minimumDurationMs", 1000)),
            int(subtitle_config.get("maximumDurationMs", 6000)),
            alignment_position=caption_position_for_scene(scene),
        )
        scene_srt = write_srt(cache_dir / scene_path.parent.name / "captions.srt", cues)
        write_ass(cache_dir / scene_path.parent.name / "captions.ass", cues, 3840, 2160)
        merged.extend(offset_cues(cues, offset_ms))
        clip_info = inspect_video(clip_path)
        duration_ms = round(float(clip_info.get("durationSeconds") or 0) * 1000)
        scene_entries.append(
            {
                "sceneId": scene_path.parent.name,
                "startMs": offset_ms,
                "durationMs": duration_ms,
                "clip": str(clip_path),
                "srt": str(scene_srt),
                "cueCount": len(cues),
            }
        )
        offset_ms += duration_ms
    merged_srt = write_srt(cache_dir / "merged.srt", merged)
    merged_ass = write_ass(cache_dir / "merged.ass", merged, 3840, 2160)
    return {"cues": merged, "srt": merged_srt, "ass": merged_ass, "scenes": scene_entries, "durationMs": offset_ms}


def write_workflow_state(project_dir: Path, state: str, **details: Any) -> Path:
    path = project_dir / "workflow-state.json"
    save_json(path, {"schemaVersion": 1, "state": state, "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"), **details})
    return path


PACKAGE_FILES = (
    ".gitignore",
    "LICENSE",
    "NOTICE",
    "SKILL.md",
    "requirements.lock",
    "setup.cmd",
    "setup.ps1",
    "setup.sh",
)
PACKAGE_DIRECTORIES = ("agents", "assets", "references", "scripts", "templates", "tests")
PACKAGE_EXCLUDED_NAMES = {"__pycache__", ".trace-cache", "marker-hand-source.png", "eraser-hand-source.png", "asset-prompts.txt"}


def _contains_secret_or_personal_path(path: Path) -> list[str]:
    if path.suffix.lower() not in {".md", ".py", ".json", ".yaml", ".yml", ".ps1", ".sh", ".cmd", ".txt"}:
        return []
    text = path.read_text(encoding="utf-8-sig")
    findings: list[str] = []
    if re.search(r"(?i)(?:xi-api-key|api[_-]?key)\s*[:=]\s*['\"]?[A-Za-z0-9_-]{20,}", text):
        findings.append("API 키처럼 보이는 값")
    if re.search(r"(?i)[A-Z]:[/\\]Users[/\\][^/\\]+", text):
        findings.append("Windows 개인 경로")
    return findings


def package_skill(skill_root: Path, output_zip: Path) -> dict[str, Any]:
    if output_zip.exists():
        raise FileExistsError(f"패키지 파일이 이미 있습니다: {output_zip}")
    included: list[Path] = []
    for name in PACKAGE_FILES:
        path = skill_root / name
        if path.exists():
            included.append(path)
    for name in PACKAGE_DIRECTORIES:
        folder = skill_root / name
        if not folder.exists():
            continue
        for path in folder.rglob("*"):
            if path.is_file() and not any(part in PACKAGE_EXCLUDED_NAMES for part in path.parts) and path.suffix.lower() not in {".pyc", ".mp4", ".mp3", ".wav"}:
                included.append(path)
    issues: list[str] = []
    for path in included:
        for finding in _contains_secret_or_personal_path(path):
            issues.append(f"{path.relative_to(skill_root)}: {finding}")
    if issues:
        raise ValueError("배포 패키지 안전 검사 실패: " + "; ".join(issues))
    output_zip.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="achmage-package-") as temporary:
        staging = Path(temporary) / skill_root.name
        for path in included:
            target = staging / path.relative_to(skill_root)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, target)
        with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for path in sorted(staging.rglob("*")):
                if path.is_file():
                    archive.write(path, path.relative_to(staging.parent).as_posix())
    return {"output": str(output_zip.resolve()), "files": len(included), "bytes": output_zip.stat().st_size}
