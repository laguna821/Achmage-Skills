#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import shutil
import sys
import time
from pathlib import Path

from whiteboard_core import (
    compose_reference,
    configure_utf8,
    doctor,
    import_plan,
    import_srt,
    inspect_audio,
    inspect_video,
    SKILL_ROOT,
    load_json,
    make_contact_sheet,
    merge_videos,
    migrate_v1,
    mux_voiceover,
    project_report,
    project_scene_paths,
    render_video,
    save_json,
    serve_preview,
    timestamps_are_monotonic,
    update_source_metadata,
    validate_scene,
)
from pipeline_core import (
    apply_pronunciation_overrides,
    build_caption_tracks,
    burn_ass_subtitles,
    package_skill,
    project_content_hash,
    safe_output_stem,
    validate_voice_approval,
    voice_approval_fingerprint,
    write_workflow_state,
)
from tts_core import (
    DEFAULT_AUDITION_TEXT,
    TTSRequestError,
    VoiceCandidate,
    atomic_write_json,
    choose_and_store_voice,
    find_voice,
    get_provider,
    ledger_reserved_credits,
    load_ledger,
    read_json,
    redact_subscription,
    recommend_voices,
    resolved_tts_config,
    synthesize_to_cache,
)


def scene_path(project: Path, number: int) -> Path:
    matches = project_scene_paths(project, number)
    if not matches:
        raise ValueError(f"시퀀스 {number:03d}을 찾지 못했습니다.")
    return matches[0]


def cmd_doctor(_: argparse.Namespace) -> int:
    checks = doctor()
    print(json.dumps(checks, ensure_ascii=False, indent=2))
    required = ["font", "markerHand", "eraserHand", "preview", "ffmpeg"]
    missing = [key for key in required if not checks.get(key)]
    if missing:
        print("준비되지 않은 항목: " + ", ".join(missing), file=sys.stderr)
        return 1
    print("Achmage 화이트보드 환경이 준비됐습니다.")
    return 0


def cmd_import_plan(args: argparse.Namespace) -> int:
    count = import_plan(args.plan.resolve(), args.project.resolve(), args.force)
    print(f"{count}개 시퀀스를 v2 프로젝트로 변환했습니다: {args.project.resolve()}")
    return 0


def cmd_import_srt(args: argparse.Namespace) -> int:
    count = import_srt(args.srt.resolve(), args.project.resolve(), args.force)
    print(f"{count}개 자막을 8초 v2 시퀀스로 변환했습니다: {args.project.resolve()}")
    return 0


def cmd_validate(args: argparse.Namespace) -> int:
    paths = project_scene_paths(args.project.resolve(), args.scene)
    if not paths:
        print("검증할 장면이 없습니다.", file=sys.stderr)
        return 1
    failure_count = 0
    for path in paths:
        errors = validate_scene(load_json(path), path, require_source=args.require_source)
        if errors:
            failure_count += 1
            print(f"[실패] {path.parent.name}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"[통과] {path.parent.name}")
    print(f"검증 완료: {len(paths) - failure_count}개 통과, {failure_count}개 실패")
    return 1 if failure_count else 0


def cmd_attach_image(args: argparse.Namespace) -> int:
    path = scene_path(args.project.resolve(), args.scene)
    source = args.image.resolve()
    if not source.exists():
        raise FileNotFoundError(f"이미지가 없습니다: {source}")
    scene = load_json(path)
    desired = path.parent / "base-art.png"
    if desired.exists() and not args.replace:
        version = 2
        while (path.parent / f"base-art-v{version}.png").exists():
            version += 1
        desired = path.parent / f"base-art-v{version}.png"
    shutil.copy2(source, desired)
    from PIL import Image

    with Image.open(desired) as image:
        scene.setdefault("source", {})["nativeWidth"] = image.width
        scene["source"]["nativeHeight"] = image.height
    scene["source"]["file"] = desired.name
    scene["source"]["status"] = "ready"
    scene["source"]["generationMode"] = "codex-native"
    save_json(path, scene)
    print(f"이미지를 연결했습니다: {desired}")
    return 0


def cmd_compose(args: argparse.Namespace) -> int:
    paths = project_scene_paths(args.project.resolve(), args.scene)
    completed = 0
    for path in paths:
        try:
            output = compose_reference(path)
            completed += 1
            print(f"합성 완료: {output}")
        except FileNotFoundError as exc:
            if args.scene is not None:
                raise
            print(f"건너뜀: {path.parent.name} ({exc})")
    print(f"한글 포함 기준 이미지 {completed}개를 만들었습니다.")
    return 0


def render_one(project: Path, number: int, profile: str) -> Path:
    path = scene_path(project, number)
    folder = "renders" if profile == "master" else "previews"
    output = project / folder / f"{path.parent.name}.mp4"
    return render_video(path, output, profile)


def cmd_render(args: argparse.Namespace) -> int:
    output = render_one(args.project.resolve(), args.scene, args.profile)
    print(f"영상 렌더 완료: {output}")
    print(json.dumps(inspect_video(output), ensure_ascii=False, indent=2))
    return 0


def cmd_render_all(args: argparse.Namespace) -> int:
    project = args.project.resolve()
    completed = 0
    for path in project_scene_paths(project):
        number = int(path.parent.name.rsplit("-", 1)[-1])
        source_name = load_json(path).get("source", {}).get("file", "base-art.png")
        if not (path.parent / source_name).exists():
            print(f"건너뜀: {path.parent.name} (원본 이미지 없음)")
            continue
        output = render_one(project, number, args.profile)
        completed += 1
        print(f"영상 렌더 완료: {output}")
    print(f"{completed}개 영상을 렌더했습니다.")
    return 0


def cmd_merge(args: argparse.Namespace) -> int:
    project = args.project.resolve()
    folder = "renders" if args.profile == "master" else "previews"
    project_data = load_json(project / "project.json")
    numbers = parse_scene_numbers(project_data, args.scenes) if args.scenes else None
    paths = [scene_path(project, number) for number in numbers] if numbers else project_scene_paths(project)
    inputs = [project / folder / f"{path.parent.name}.mp4" for path in paths]
    inputs = [path for path in inputs if path.exists()]
    output = args.output.resolve() if args.output else project / "merged-review.mp4"
    merge_videos(inputs, output)
    print(f"병합 완료: {output}")
    print(json.dumps(inspect_video(output), ensure_ascii=False, indent=2))
    return 0


def cmd_migrate(args: argparse.Namespace) -> int:
    source = args.input.resolve()
    output = args.output.resolve()
    if output.exists() and not args.force:
        raise FileExistsError(f"출력 파일이 이미 있습니다: {output}")
    save_json(output, migrate_v1(load_json(source)))
    print(f"v2 변환 완료: {output}")
    return 0


def cmd_contact_sheet(args: argparse.Namespace) -> int:
    output = make_contact_sheet(args.project.resolve(), args.columns)
    print(f"콘택트시트 완료: {output}")
    return 0


def cmd_report(args: argparse.Namespace) -> int:
    report = project_report(args.project.resolve())
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


def cmd_preview(args: argparse.Namespace) -> int:
    serve_preview(args.project.resolve(), args.port, not args.no_open)
    return 0


def cmd_approve_anchors(args: argparse.Namespace) -> int:
    project_path = args.project.resolve() / "project.json"
    project = load_json(project_path)
    missing: list[int] = []
    for number in project.get("anchorScenes", []):
        path = scene_path(args.project.resolve(), int(number))
        if not (path.parent / "final-reference.png").exists() or not (args.project.resolve() / "previews" / f"{path.parent.name}.mp4").exists():
            missing.append(int(number))
    if missing:
        raise ValueError("기준 이미지와 프리뷰가 없는 앵커: " + ", ".join(f"{number:03d}" for number in missing))
    project["anchorStatus"] = "approved"
    save_json(project_path, project)
    print("앵커 3개를 승인 상태로 잠갔습니다. 나머지 장면 생성을 진행할 수 있습니다.")
    return 0


def parse_scene_numbers(project: dict, specification: str | None) -> list[int]:
    available = [int(entry["number"]) for entry in project.get("scenes", [])]
    if specification and specification.strip().lower() == "all":
        return available
    if not specification:
        configured = project.get("pilotScenes")
        return [int(value) for value in configured] if configured else available
    selected: set[int] = set()
    for part in specification.split(","):
        value = part.strip()
        if not value:
            continue
        if "-" in value:
            start_text, end_text = value.split("-", 1)
            start, end = int(start_text), int(end_text)
            if end < start:
                raise ValueError(f"시퀀스 범위가 올바르지 않습니다: {value}")
            selected.update(range(start, end + 1))
        else:
            selected.add(int(value))
    missing = sorted(selected.difference(available))
    if missing:
        raise ValueError("프로젝트에 없는 시퀀스: " + ", ".join(str(value) for value in missing))
    return sorted(selected)


def load_project_and_tts(project_dir: Path, provider_name: str | None = None) -> tuple[Path, dict, dict]:
    project_path = project_dir / "project.json"
    project = load_json(project_path)
    config = resolved_tts_config(project, provider_name)
    return project_path, project, config


def project_content_text(project_dir: Path, scene_numbers: list[int], markdown_path: Path | None = None) -> str:
    parts: list[str] = []
    if markdown_path and markdown_path.exists():
        parts.append(markdown_path.read_text(encoding="utf-8-sig"))
    for number in scene_numbers:
        scene = load_json(scene_path(project_dir, number))
        parts.extend(
            [
                str(scene.get("narration", "")),
                str(scene.get("voiceover", {}).get("script", "")),
                str(scene.get("visualBrief", "")),
            ]
        )
    return "\n".join(part for part in parts if part.strip())


def voice_recommendation_plan(
    project_dir: Path,
    scene_numbers: list[int],
    provider_name: str | None = None,
    markdown_path: Path | None = None,
    gender: str = "any",
    limit: int = 3,
) -> dict:
    _, _, config = load_project_and_tts(project_dir, provider_name)
    provider = get_provider(config["provider"])
    content = project_content_text(project_dir, scene_numbers, markdown_path)
    profile, candidates = recommend_voices(provider.list_voices(gender), content, limit)
    if not candidates:
        raise RuntimeError("현재 계정에서 추천할 수 있는 음성을 찾지 못했습니다.")
    estimated = voiceover_plan(project_dir, scene_numbers, provider.name)["estimatedCredits"]
    return {
        "provider": provider.name,
        "modelId": config["modelId"],
        "contentProfile": profile,
        "estimatedProjectCredits": estimated,
        "auditionText": DEFAULT_AUDITION_TEXT,
        "auditionCreditsPerVoice": provider.estimate_credits(DEFAULT_AUDITION_TEXT, config["modelId"]),
        "candidates": [
            {
                "rank": index + 1,
                "voiceId": voice.voice_id,
                "name": voice.name,
                "score": voice.score,
                "labels": voice.labels,
            }
            for index, voice in enumerate(candidates)
        ],
    }


def approval_scene_paths(project_dir: Path, project: dict, scene_numbers: list[int]) -> list[Path]:
    return [scene_path(project_dir, number) for number in scene_numbers]


def write_voiceover_script(project_dir: Path, scene_numbers: list[int]) -> Path:
    lines = ["# 음성 대본", ""]
    total = 0
    for number in scene_numbers:
        path = scene_path(project_dir, number)
        scene = load_json(path)
        voiceover = scene.get("voiceover", {})
        script = str(voiceover.get("script", "")).strip()
        status = voiceover.get("status", "missing")
        total += len(script)
        lines.extend([f"## 시퀀스 {number:03d}", "", f"- 상태: `{status}`", f"- 글자 수: {len(script)}", "", script or "(대본 없음)", ""])
    lines.extend(["---", "", f"총 글자 수: {total}", ""])
    output = project_dir / "voiceover-script.md"
    output.write_text("\n".join(lines), encoding="utf-8")
    return output


def voiceover_plan(project_dir: Path, scene_numbers: list[int], provider_name: str | None = None) -> dict:
    _, project, config = load_project_and_tts(project_dir, provider_name)
    provider = get_provider(config["provider"])
    scenes: list[dict] = []
    estimated = 0
    missing_images: list[int] = []
    unapproved: list[int] = []
    for number in scene_numbers:
        path = scene_path(project_dir, number)
        scene = load_json(path)
        source_name = scene.get("source", {}).get("file", "base-art.png")
        image_ready = (path.parent / source_name).exists()
        voiceover = scene.get("voiceover", {})
        script = str(voiceover.get("script", "")).strip()
        status = str(voiceover.get("status", "missing"))
        cost = provider.estimate_credits(script, config.get("modelId")) if script else 0
        estimated += cost
        if not image_ready:
            missing_images.append(number)
        if status not in {"approved", "generated"}:
            unapproved.append(number)
        scenes.append(
            {
                "number": number,
                "sceneId": scene.get("sceneId"),
                "scriptStatus": status,
                "characters": len(script),
                "estimatedCredits": cost,
                "imageReady": image_ready,
            }
        )
    script_path = write_voiceover_script(project_dir, scene_numbers)
    return {
        "provider": config["provider"],
        "modelId": config["modelId"],
        "voiceId": config.get("voiceId"),
        "leadInMs": config["leadInMs"],
        "leadOutMs": config["leadOutMs"],
        "pilotMaxCredits": config["pilotMaxCredits"],
        "minimumRemainingFraction": config["minimumRemainingFraction"],
        "estimatedCredits": estimated,
        "missingImages": missing_images,
        "unapprovedScripts": unapproved,
        "scriptFile": str(script_path),
        "scenes": scenes,
    }


def cmd_tts_status(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, _, config = load_project_and_tts(project_dir, args.provider)
    provider = get_provider(config["provider"])
    info = provider.subscription()
    result = {
        "provider": provider.name,
        "configuredModelId": config["modelId"],
        "models": provider.list_models(),
        **redact_subscription(info),
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


def cmd_tts_voices(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, _, config = load_project_and_tts(project_dir, args.provider)
    provider = get_provider(config["provider"])
    voices = provider.list_voices(args.gender)[: args.limit]
    if not voices:
        raise RuntimeError("조건에 맞는 화자 후보를 찾지 못했습니다.")
    print(
        json.dumps(
            [
                {"rank": index + 1, "voiceId": voice.voice_id, "name": voice.name, "score": voice.score, "labels": voice.labels}
                for index, voice in enumerate(voices)
            ],
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


def cmd_tts_recommend(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, project, _ = load_project_and_tts(project_dir, args.provider)
    numbers = parse_scene_numbers(project, args.scenes)
    result = voice_recommendation_plan(
        project_dir,
        numbers,
        args.provider,
        args.markdown.resolve() if args.markdown else None,
        args.gender,
        args.limit,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


def cmd_tts_audition(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    project_path, project, config = load_project_and_tts(project_dir, args.provider)
    numbers = parse_scene_numbers(project, getattr(args, "scenes", None))
    text = args.text or DEFAULT_AUDITION_TEXT
    if len(text) > 60:
        raise ValueError("오디션 대본은 60자를 넘을 수 없습니다.")
    provider = get_provider(config["provider"])
    requested = getattr(args, "voice_ids", None) or args.voice_id
    if requested:
        voice_ids = [value.strip() for value in str(requested).split(",") if value.strip()]
    else:
        recommendation = voice_recommendation_plan(project_dir, numbers, provider.name, gender=args.gender, limit=2)
        voice_ids = [item["voiceId"] for item in recommendation["candidates"][:2]]
    if not voice_ids or len(voice_ids) > 2:
        raise ValueError("오디션 화자는 한 번에 1명 또는 2명만 선택할 수 있습니다.")
    estimated_total = sum(provider.estimate_credits(text, config["modelId"]) for _ in voice_ids)
    if args.confirm_spend < estimated_total:
        raise ValueError(f"오디션 예상 소비량 {estimated_total}보다 --confirm-spend 값이 작습니다.")
    outputs: list[dict] = []
    for voice_id in voice_ids:
        selected = find_voice(provider, voice_id, args.gender)
        manifest = synthesize_to_cache(
            project_dir,
            project_dir / "auditions",
            text,
            provider,
            config,
            selected.voice_id,
            "audition",
            args.confirm_spend,
            force=args.force,
        )
        output = project_dir / "auditions" / manifest["audioFile"]
        outputs.append(
            {
                "voiceId": selected.voice_id,
                "voiceName": selected.name,
                "labels": selected.labels,
                "audio": str(output),
                "credits": manifest.get("actualCredits"),
                "cacheHit": manifest.get("cacheHit", False),
                "accountTier": manifest.get("accountTier"),
                "commercialUseAllowed": manifest.get("commercialUseAllowed", False),
            }
        )
        print(f"오디션 음성: {output}")
    content_hash = project_content_hash(project_dir, approval_scene_paths(project_dir, project, numbers), project)
    project["auditionGate"] = {
        "status": "awaiting-selection",
        "contentHash": content_hash,
        "provider": provider.name,
        "modelId": config["modelId"],
        "sceneNumbers": numbers,
        "auditionText": text,
        "estimatedProjectCredits": voiceover_plan(project_dir, numbers, provider.name)["estimatedCredits"],
        "candidates": outputs,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    atomic_write_json(project_path, project)
    write_workflow_state(project_dir, "awaitingVoiceApproval", candidates=outputs, sceneNumbers=numbers)
    print(json.dumps({"estimatedAuditionCredits": estimated_total, "candidates": outputs}, ensure_ascii=False, indent=2))
    return 0


def cmd_tts_plan(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, project, _ = load_project_and_tts(project_dir, args.provider)
    numbers = parse_scene_numbers(project, args.scenes)
    print(json.dumps(voiceover_plan(project_dir, numbers, args.provider), ensure_ascii=False, indent=2))
    return 0


def current_audio_from_manifest(scene_dir: Path, manifest: dict) -> tuple[Path, dict]:
    voice_dir = scene_dir / "voiceover"
    audio = voice_dir / str(manifest.get("audioFile", ""))
    alignment = read_json(voice_dir / str(manifest.get("alignmentFile", "")), {})
    if not audio.exists():
        raise FileNotFoundError(f"생성된 음성 파일이 없습니다: {audio}")
    return audio, alignment


def update_scene_voiceover(scene_path_value: Path, manifest: dict, audio_info: dict) -> None:
    scene = load_json(scene_path_value)
    voiceover = scene.setdefault("voiceover", {})
    voiceover["status"] = "generated"
    voiceover["generated"] = {
        "provider": manifest.get("provider"),
        "modelId": manifest.get("modelId"),
        "voiceId": manifest.get("voiceId"),
        "fingerprint": manifest.get("fingerprint"),
        "scriptHash": manifest.get("scriptHash"),
        "audioFile": f"voiceover/{manifest.get('audioFile')}",
        "alignmentFile": f"voiceover/{manifest.get('alignmentFile')}",
        "requestId": manifest.get("requestId"),
        "actualCredits": manifest.get("actualCredits"),
        "audioDurationMs": audio_info.get("durationMs"),
        "accountTier": manifest.get("accountTier"),
        "commercialUseAllowed": manifest.get("commercialUseAllowed", False),
    }
    save_json(scene_path_value, scene)


def assert_purpose_allowed(scene_paths: list[Path], purpose: str) -> None:
    if purpose != "commercial":
        return
    blocked: list[str] = []
    for path in scene_paths:
        generated = load_json(path).get("voiceover", {}).get("generated", {})
        if not generated.get("commercialUseAllowed"):
            blocked.append(path.parent.name)
    if blocked:
        raise ValueError("무료 계정 음성이 포함되어 상업 공개용 빌드를 만들 수 없습니다: " + ", ".join(blocked))


def assert_commercial_preflight(scene_paths: list[Path], provider) -> None:
    unresolved: list[Path] = []
    blocked: list[str] = []
    for path in scene_paths:
        generated = load_json(path).get("voiceover", {}).get("generated")
        if not isinstance(generated, dict):
            unresolved.append(path)
        elif not generated.get("commercialUseAllowed"):
            blocked.append(path.parent.name)
    if blocked:
        raise ValueError("무료 계정 음성이 포함되어 상업 공개용 빌드를 만들 수 없습니다: " + ", ".join(blocked))
    if unresolved:
        tier = str(provider.subscription().tier).lower()
        if tier in {"free", "unknown"}:
            raise ValueError("무료 또는 확인 불가능한 계정에서는 상업 공개용 TTS를 호출하지 않습니다.")


def normalize_variant(value: str | None) -> str | None:
    if value is None:
        return None
    variant = re.sub(r"[^A-Za-z0-9_.-]+", "-", value).strip("-.")
    if not variant:
        raise ValueError("변형 이름에는 영문, 숫자, 점, 밑줄, 하이픈이 필요합니다.")
    return variant


def voiced_output_path(project_dir: Path, profile: str, scene_id: str, variant: str | None = None) -> Path:
    folder = "renders-voiced" if profile == "master" else "previews-voiced"
    if variant:
        return project_dir / "variants" / variant / folder / f"{scene_id}.mp4"
    return project_dir / folder / f"{scene_id}.mp4"


def merge_voiced_profile(
    project_dir: Path,
    numbers: list[int],
    profile: str,
    output: Path | None = None,
    variant: str | None = None,
) -> Path:
    paths = [scene_path(project_dir, number) for number in numbers]
    inputs = [voiced_output_path(project_dir, profile, path.parent.name, variant) for path in paths]
    if output is None:
        root = project_dir / "variants" / variant if variant else project_dir
        output = root / f"opening-{numbers[0]:03d}-{numbers[-1]:03d}-{profile}-voiced.mp4"
    return merge_videos(inputs, output)


def existing_voiceover_assets(scene_path_value: Path) -> tuple[Path, dict, dict]:
    scene = load_json(scene_path_value)
    generated = scene.get("voiceover", {}).get("generated")
    if not isinstance(generated, dict):
        raise ValueError(f"생성된 음성이 없는 장면입니다: {scene_path_value.parent.name}")
    audio_name = str(generated.get("audioFile", "")).strip()
    alignment_name = str(generated.get("alignmentFile", "")).strip()
    audio_path = scene_path_value.parent / audio_name
    alignment_path = scene_path_value.parent / alignment_name
    if not audio_path.exists():
        raise FileNotFoundError(f"기존 음성 파일이 없습니다: {audio_path}")
    alignment = load_json(alignment_path) if alignment_path.exists() else {}
    return audio_path, alignment, generated


def set_art_animation(scene: dict, animation: str) -> int:
    changed = 0
    for element in scene.get("elements", []):
        if element.get("kind") != "art":
            continue
        for event in element.get("events", []):
            if event.get("action") in {"draw", "erase"}:
                event["animation"] = animation
                changed += 1
    return changed


def cmd_rerender_voiced(args: argparse.Namespace) -> int:
    """Render a visual variant with existing audio and never call a TTS provider."""

    project_dir = args.project.resolve()
    _, project, config = load_project_and_tts(project_dir)
    numbers = parse_scene_numbers(project, args.scenes)
    profiles = [value.strip() for value in args.profiles.split(",") if value.strip()]
    if not profiles or any(value not in {"preview", "master"} for value in profiles):
        raise ValueError("--profiles에는 preview와 master만 사용할 수 있습니다.")
    variant = normalize_variant(args.variant)
    assert variant is not None
    paths = [scene_path(project_dir, number) for number in numbers]
    assert_purpose_allowed(paths, args.purpose)
    report_scenes: list[dict] = []
    for number, path in zip(numbers, paths):
        scene = load_json(path)
        changed = set_art_animation(scene, args.animation)
        if changed == 0:
            raise ValueError(f"그리기 또는 지우기 이벤트가 있는 삽화 요소가 없습니다: {path.parent.name}")
        audio_path, alignment, generated = existing_voiceover_assets(path)
        audio_info = inspect_audio(audio_path)
        if not audio_info.get("durationMs"):
            raise RuntimeError(f"음성 길이를 확인하지 못했습니다: {audio_path}")
        timing = {
            "audioDurationMs": int(audio_info["durationMs"]),
            "leadInMs": int(config["leadInMs"]),
            "leadOutMs": int(config["leadOutMs"]),
            "alignment": alignment,
        }
        rendered: dict[str, dict] = {}
        for profile in profiles:
            folder = "renders-voiced" if profile == "master" else "previews-voiced"
            output = project_dir / "variants" / variant / folder / f"{path.parent.name}.mp4"
            temporary = project_dir / "tmp" / "variants" / variant / profile / f"{path.parent.name}.silent.mp4"
            render_video(path, temporary, profile, voice_timing=timing, scene_override=scene)
            mux_voiceover(temporary, audio_path, output, int(config["leadInMs"]))
            temporary.unlink(missing_ok=True)
            info = inspect_video(output)
            info["timestamps"] = timestamps_are_monotonic(output)
            if not info["timestamps"]["videoPtsMonotonic"] or not info["timestamps"]["audioPtsMonotonic"]:
                raise RuntimeError(f"{profile} 변형 렌더의 PTS가 단조 증가하지 않습니다.")
            rendered[profile] = info
            print(f"무과금 변형 렌더 완료: {output}")
        report_scenes.append(
            {
                "number": number,
                "sceneId": path.parent.name,
                "animation": args.animation,
                "reusedAudio": str(audio_path),
                "voiceId": generated.get("voiceId"),
                "ttsApiCalled": False,
                "renders": rendered,
            }
        )
    report_path = project_dir / "variants" / variant / "render-report.json"
    previous_report = load_json(report_path) if report_path.exists() else {}
    previous_scenes = {item.get("sceneId"): item for item in previous_report.get("scenes", [])}
    for item in report_scenes:
        previous = previous_scenes.get(item["sceneId"], {})
        item["renders"] = {**previous.get("renders", {}), **item["renders"]}
        previous_scenes[item["sceneId"]] = item
    report_scenes = sorted(previous_scenes.values(), key=lambda item: int(item.get("number", 0)))
    report = {
        "projectId": project.get("projectId"),
        "variant": variant,
        "animation": args.animation,
        "ttsApiCalled": False,
        "scenes": report_scenes,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    save_json(report_path, report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


def cmd_build_voiced(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    project_path, project, config = load_project_and_tts(project_dir, args.provider)
    numbers = parse_scene_numbers(project, args.scenes)
    planning = voiceover_plan(project_dir, numbers, config["provider"])
    if planning["missingImages"]:
        raise ValueError("TTS 호출 전에 이미지가 필요합니다: " + ", ".join(f"{number:03d}" for number in planning["missingImages"]))
    if planning["unapprovedScripts"]:
        raise ValueError("승인되지 않은 음성 대본: " + ", ".join(f"{number:03d}" for number in planning["unapprovedScripts"]))
    if args.confirm_spend < planning["estimatedCredits"] and not all(
        load_json(scene_path(project_dir, number)).get("voiceover", {}).get("status") == "generated" for number in numbers
    ):
        raise ValueError(f"전체 예상 소비량 {planning['estimatedCredits']}보다 --confirm-spend 값이 작습니다.")
    provider = get_provider(config["provider"])
    scene_paths = [scene_path(project_dir, number) for number in numbers]
    approval = validate_voice_approval(project_dir, scene_paths, project, config)
    if planning["estimatedCredits"] > math.floor(int(approval["estimatedCredits"]) * 1.10):
        raise ValueError("예상 TTS 소비량이 승인 시점보다 10% 이상 늘었습니다. 새 음성 승인이 필요합니다.")
    selected = VoiceCandidate(
        str(approval["voiceId"]),
        str(approval.get("voiceName") or approval["voiceId"]),
        999,
        project.get("tts", {}).get("voiceLabels", {}),
    )
    profiles = [value.strip() for value in args.profiles.split(",") if value.strip()]
    if not profiles or any(value not in {"preview", "master"} for value in profiles):
        raise ValueError("--profiles는 preview, master 중 하나 이상이어야 합니다.")
    if args.purpose == "commercial":
        assert_commercial_preflight(scene_paths, provider)
    scripts = [str(load_json(path).get("voiceover", {}).get("script", "")).strip() for path in scene_paths]
    pronunciation = project.get("pronunciationOverrides", {})
    spoken_scripts = [apply_pronunciation_overrides(script, pronunciation) for script in scripts]
    prepared_scenes: list[dict] = []
    for index, path in enumerate(scene_paths):
        manifest = synthesize_to_cache(
            project_dir,
            path.parent / "voiceover",
            spoken_scripts[index],
            provider,
            config,
            selected.voice_id,
            "voiceover",
            args.confirm_spend,
            previous_text=spoken_scripts[index - 1] if index > 0 else "",
            next_text=spoken_scripts[index + 1] if index + 1 < len(spoken_scripts) else "",
            force=args.force,
        )
        audio_path, alignment = current_audio_from_manifest(path.parent, manifest)
        audio_info = inspect_audio(audio_path)
        if not audio_info.get("durationMs"):
            raise RuntimeError(f"음성 길이를 확인하지 못했습니다: {audio_path}")
        update_scene_voiceover(path, manifest, audio_info)
        prepared_scenes.append(
            {
                "path": path,
                "manifest": manifest,
                "audioPath": audio_path,
                "alignment": alignment,
                "audio": audio_info,
                "timing": {
                    "audioDurationMs": int(audio_info["durationMs"]),
                    "leadInMs": int(config["leadInMs"]),
                    "leadOutMs": int(config["leadOutMs"]),
                    "alignment": alignment,
                },
            }
        )
    master_fps = int(project.get("masterProfile", {}).get("fps", 60))
    predicted_duration_ms = 0
    for item in prepared_scenes:
        authored_ms = int(load_json(item["path"]).get("durationMs", 8000))
        requested = max(authored_ms, int(config["leadInMs"]) + int(item["audio"]["durationMs"]) + int(config["leadOutMs"]))
        predicted_duration_ms += round(math.ceil(requested * master_fps / 1000) * 1000 / master_fps)
    target_duration_ms = project.get("targetDurationMs")
    if isinstance(target_duration_ms, (int, float)) and target_duration_ms > 0:
        drift = abs(predicted_duration_ms - float(target_duration_ms)) / float(target_duration_ms)
        if drift > 0.05:
            write_workflow_state(
                project_dir,
                "needsDurationAdjustment",
                targetDurationMs=round(float(target_duration_ms)),
                predictedDurationMs=predicted_duration_ms,
                driftFraction=round(drift, 4),
                nextCodexAction="사람에게 묻지 말고 장면 대본 길이를 자동 조정한 뒤 변경된 장면만 다시 합성하세요.",
            )
            raise ValueError("실제 음성 기준 예상 길이가 목표의 ±5%를 벗어났습니다. 4K 렌더 전에 대본 조정이 필요합니다.")
    report_scenes: list[dict] = []
    for index, item in enumerate(prepared_scenes):
        path = item["path"]
        scene_override = load_json(path)
        animation = str(scene_override.get("animationMode") or project.get("defaultAnimation", "line-trace"))
        if animation in {"line-trace", "marker-wipe"}:
            set_art_animation(scene_override, animation)
        rendered: dict[str, dict] = {}
        for profile in profiles:
            temporary = project_dir / "tmp" / "voiced" / profile / f"{path.parent.name}.silent.mp4"
            output = voiced_output_path(project_dir, profile, path.parent.name)
            render_video(path, temporary, profile, voice_timing=item["timing"], scene_override=scene_override)
            mux_voiceover(temporary, item["audioPath"], output, int(config["leadInMs"]))
            temporary.unlink(missing_ok=True)
            rendered[profile] = inspect_video(output)
            print(f"유성 영상 완료: {output}")
        report_scenes.append(
            {
                "number": numbers[index],
                "sceneId": path.parent.name,
                "audio": item["audio"],
                "credits": item["manifest"].get("actualCredits"),
                "cacheHit": item["manifest"].get("cacheHit", False),
                "renders": rendered,
            }
        )
    assert_purpose_allowed(scene_paths, args.purpose)
    merged: dict[str, dict] = {}
    for profile in profiles:
        output = merge_voiced_profile(project_dir, numbers, profile)
        merged[profile] = inspect_video(output)
        merged[profile]["timestamps"] = timestamps_are_monotonic(output)
        if not merged[profile]["timestamps"]["videoPtsMonotonic"] or not merged[profile]["timestamps"]["audioPtsMonotonic"]:
            raise RuntimeError(f"{profile} 병합본의 PTS가 단조 증가하지 않습니다.")
        print(f"유성 병합 완료: {output}")
    report = {
        "projectId": project.get("projectId"),
        "provider": provider.name,
        "voiceId": selected.voice_id,
        "voiceName": selected.name,
        "purpose": args.purpose,
        "predictedDurationMs": predicted_duration_ms,
        "scenes": report_scenes,
        "merged": merged,
        "ledger": load_ledger(project_dir),
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    atomic_write_json(project_dir / "voiced-render-report.json", report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


def cmd_merge_voiced(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, project, _ = load_project_and_tts(project_dir)
    numbers = parse_scene_numbers(project, args.scenes)
    paths = [scene_path(project_dir, number) for number in numbers]
    assert_purpose_allowed(paths, args.purpose)
    variant = normalize_variant(args.variant)
    output = merge_voiced_profile(project_dir, numbers, args.profile, args.output.resolve() if args.output else None, variant)
    info = inspect_video(output)
    info["timestamps"] = timestamps_are_monotonic(output)
    if not info["timestamps"]["videoPtsMonotonic"] or not info["timestamps"]["audioPtsMonotonic"]:
        raise RuntimeError("병합본의 PTS가 단조 증가하지 않습니다.")
    print(f"유성 병합 완료: {output}")
    print(json.dumps(info, ensure_ascii=False, indent=2))
    return 0


def finalize_all_in_one(
    project_dir: Path,
    numbers: list[int],
    clean_master: Path,
    scene_clips: list[Path],
    purpose: str,
    profile: str = "master",
) -> dict:
    scene_paths = [scene_path(project_dir, number) for number in numbers]
    assert_purpose_allowed(scene_paths, purpose)
    tracks = build_caption_tracks(project_dir, scene_paths, scene_clips)
    project = load_json(project_dir / "project.json")
    title = safe_output_stem(str(project.get("title") or project.get("projectId") or "achmage-whiteboard"))
    final_dir = project_dir / "final" if profile == "master" else project_dir / ".achmage-cache" / "review"
    suffix = "4k-captioned" if profile == "master" else "preview-captioned"
    output = final_dir / f"{title}-{suffix}.mp4"
    profile_data = project.get("masterProfile" if profile == "master" else "previewProfile", {})
    burn_ass_subtitles(
        clean_master,
        tracks["ass"],
        output,
        int(profile_data.get("crf", 17 if profile == "master" else 24)),
        "medium" if profile == "master" else "veryfast",
        int(profile_data.get("fps", 60 if profile == "master" else 30)),
    )
    video = inspect_video(output)
    video["timestamps"] = timestamps_are_monotonic(output)
    if not video["timestamps"]["videoPtsMonotonic"] or not video["timestamps"]["audioPtsMonotonic"]:
        raise RuntimeError("올인원 완성본의 영상·음성 PTS가 단조 증가하지 않습니다.")
    if not video.get("hasAudio"):
        raise RuntimeError("올인원 완성본에 음성이 없습니다.")
    expected_fps = int(profile_data.get("fps", 60 if profile == "master" else 30))
    expected_size = (
        int(profile_data.get("width", 3840 if profile == "master" else 960)),
        int(profile_data.get("height", 2160 if profile == "master" else 540)),
    )
    if (video.get("width"), video.get("height")) != expected_size:
        raise RuntimeError(f"올인원 완성본 해상도가 예상값과 다릅니다: {video.get('width')}x{video.get('height')}")
    if abs(float(video.get("fps") or 0) - expected_fps) > 0.02:
        raise RuntimeError(f"올인원 완성본 fps가 {expected_fps}가 아닙니다: {video.get('fps')}")
    if video.get("codec") != "h264" or video.get("profile") != "High" or video.get("pixelFormat") != "yuv420p":
        raise RuntimeError("올인원 완성본의 H.264 High/yuv420p 규격이 맞지 않습니다.")
    if video.get("audioCodec") != "aac" or video.get("audioSampleRate") != 48000:
        raise RuntimeError("올인원 완성본의 AAC 48kHz 오디오 규격이 맞지 않습니다.")
    expected_seconds = tracks["durationMs"] / 1000.0
    if abs(float(video.get("durationSeconds") or 0) - expected_seconds) > (1.0 / expected_fps + 0.011):
        raise RuntimeError("올인원 완성본 길이가 장면 합계와 한 프레임 이상 다릅니다.")
    generated = [load_json(path).get("voiceover", {}).get("generated", {}) for path in scene_paths]
    credits = sum(int(item.get("actualCredits") or 0) for item in generated)
    commercial_allowed = all(bool(item.get("commercialUseAllowed")) for item in generated)
    report = {
        "schemaVersion": 1,
        "projectId": project.get("projectId"),
        "title": project.get("title"),
        "outputProfile": "all-in-one",
        "workflowMode": project.get("workflowMode", "autoAfterVoiceApproval"),
        "sceneCount": len(scene_paths),
        "sceneNumbers": numbers,
        "durationMs": tracks["durationMs"],
        "provider": generated[0].get("provider") if generated else None,
        "voiceId": generated[0].get("voiceId") if generated else None,
        "modelId": generated[0].get("modelId") if generated else None,
        "actualCredits": credits,
        "purpose": purpose,
        "commercialUseAllowed": commercial_allowed,
        "publicationStatus": "publishable" if purpose == "commercial" and commercial_allowed else "local-review",
        "captionedVideo": str(output.resolve()),
        "captionCueCount": len(tracks["cues"]),
        "video": video,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    final_dir.mkdir(parents=True, exist_ok=True)
    report_name = "build-report.json" if profile == "master" else "preview-report.json"
    atomic_write_json(final_dir / report_name, report)
    return report


def cmd_finalize_all_in_one(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, project, _ = load_project_and_tts(project_dir)
    numbers = parse_scene_numbers(project, args.scenes)
    variant = normalize_variant(args.variant)
    scene_clips = [voiced_output_path(project_dir, args.profile, scene_path(project_dir, number).parent.name, variant) for number in numbers]
    clean_master = args.input.resolve() if args.input else merge_voiced_profile(project_dir, numbers, args.profile, variant=variant)
    report = finalize_all_in_one(project_dir, numbers, clean_master, scene_clips, args.purpose, args.profile)
    print(f"올인원 완성본: {report['captionedVideo']}")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


def cmd_export_edit_package(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, project, _ = load_project_and_tts(project_dir)
    numbers = parse_scene_numbers(project, args.scenes)
    variant = normalize_variant(args.variant)
    scene_paths = [scene_path(project_dir, number) for number in numbers]
    assert_purpose_allowed(scene_paths, args.purpose)
    scene_clips = [voiced_output_path(project_dir, "master", path.parent.name, variant) for path in scene_paths]
    clean_master = args.input.resolve() if args.input else merge_voiced_profile(project_dir, numbers, "master", variant=variant)
    tracks = build_caption_tracks(project_dir, scene_paths, scene_clips)
    title = safe_output_stem(str(project.get("title") or project.get("projectId") or "achmage-whiteboard"))
    output_dir = args.output.resolve() if args.output else project_dir / "edit-package"
    output_dir.mkdir(parents=True, exist_ok=True)
    clean_output = output_dir / f"{title}-4k-clean.mp4"
    shutil.copy2(clean_master, clean_output)
    shutil.copy2(tracks["srt"], output_dir / f"{title}.srt")
    sequence_dir = output_dir / "sequences"
    index_scenes: list[dict] = []
    for entry, clip in zip(tracks["scenes"], scene_clips):
        destination = sequence_dir / entry["sceneId"]
        destination.mkdir(parents=True, exist_ok=True)
        clip_output = destination / f"{entry['sceneId']}.mp4"
        subtitle_output = destination / f"{entry['sceneId']}.srt"
        shutil.copy2(clip, clip_output)
        shutil.copy2(Path(entry["srt"]), subtitle_output)
        index_scenes.append(
            {
                "sceneId": entry["sceneId"],
                "startMs": entry["startMs"],
                "durationMs": entry["durationMs"],
                "video": str(clip_output.relative_to(output_dir).as_posix()),
                "subtitle": str(subtitle_output.relative_to(output_dir).as_posix()),
            }
        )
    script_path = write_voiceover_script(project_dir, numbers)
    shutil.copy2(script_path, output_dir / "voiceover-script.md")
    save_json(output_dir / "pronunciation-overrides.json", project.get("pronunciationOverrides", {}))
    index = {
        "schemaVersion": 1,
        "projectId": project.get("projectId"),
        "cleanMaster": clean_output.name,
        "mergedSubtitle": f"{title}.srt",
        "ttsApiCalls": 0,
        "scenes": index_scenes,
    }
    save_json(output_dir / "edit-index.json", index)
    print(f"편집 패키지 완료: {output_dir}")
    print(json.dumps(index, ensure_ascii=False, indent=2))
    return 0


def cmd_package_skill(args: argparse.Namespace) -> int:
    output = args.output.resolve() if args.output else SKILL_ROOT.parent / f"{SKILL_ROOT.name}-portable.zip"
    report = package_skill(SKILL_ROOT, output)
    print(f"클린 스킬 패키지 완료: {output}")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


def _stage_markdown_project(markdown: Path, project_dir: Path, purpose: str, target_minutes: float | None = None) -> tuple[Path, dict]:
    project_dir.mkdir(parents=True, exist_ok=True)
    source = project_dir / "source.md"
    if markdown.resolve() != source.resolve():
        shutil.copy2(markdown, source)
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    project_path = project_dir / "project.json"
    if project_path.exists():
        project = load_json(project_path)
    else:
        project = load_json(SKILL_ROOT / "templates" / "project.template.json")
        project["projectId"] = safe_output_stem(markdown.stem).lower().replace(" ", "-")
        project["title"] = markdown.stem
    project.update(
        {
            "workflowMode": "autoAfterVoiceApproval",
            "outputProfile": "all-in-one",
            "defaultAnimation": "line-trace",
            "sourceMarkdown": "source.md",
            "sourceHash": source_hash,
        }
    )
    project.setdefault("subtitles", {"mode": "burn-in", "maxLines": 2, "maxCharsPerLine": 22, "minimumDurationMs": 1000, "maximumDurationMs": 6000})
    project.setdefault("pronunciationOverrides", {})
    project.setdefault("tts", {})["licenseMode"] = purpose
    if target_minutes is not None:
        if target_minutes <= 0:
            raise ValueError("--target-minutes는 0보다 커야 합니다.")
        project["targetDurationMs"] = round(target_minutes * 60_000)
    atomic_write_json(project_path, project)
    return project_path, project


def cmd_autobuild(args: argparse.Namespace) -> int:
    markdown = args.markdown.resolve()
    if not markdown.exists():
        raise FileNotFoundError(f"마크다운 파일이 없습니다: {markdown}")
    project_dir = args.project.resolve()
    project_path, project = _stage_markdown_project(markdown, project_dir, args.purpose, args.target_minutes)
    if not project.get("scenes"):
        state = write_workflow_state(
            project_dir,
            "needsSceneDesign",
            sourceMarkdown="source.md",
            nextCodexAction="마크다운을 장면·대본·이미지 프롬프트로 설계한 뒤 project.json과 scene.json을 채우세요.",
        )
        print(f"원문을 준비했습니다. Codex 장면 설계가 필요합니다: {state}")
        return 0
    numbers = parse_scene_numbers(project, args.scenes or "all")
    for number in numbers:
        path = scene_path(project_dir, number)
        scene = load_json(path)
        script = str(scene.get("voiceover", {}).get("script", "")).strip()
        if not script:
            write_workflow_state(project_dir, "needsSceneDesign", missingScriptScene=number)
            raise ValueError(f"음성 대본이 없는 장면입니다: {number:03d}")
        if scene.setdefault("voiceover", {}).get("status") not in {"generated", "approved"}:
            scene["voiceover"]["status"] = "approved"
            save_json(path, scene)
    project = load_json(project_path)
    paths = approval_scene_paths(project_dir, project, numbers)
    content_hash = project_content_hash(project_dir, paths, project)
    existing_gate = project.get("auditionGate", {})
    if existing_gate.get("contentHash") == content_hash and existing_gate.get("status") in {"awaiting-selection", "approved"}:
        print(json.dumps(existing_gate, ensure_ascii=False, indent=2))
        return 0
    recommendation = voice_recommendation_plan(project_dir, numbers, args.provider, markdown, args.gender, 3)
    selected_ids = ",".join(item["voiceId"] for item in recommendation["candidates"][:2])
    _, _, config = load_project_and_tts(project_dir, args.provider)
    audition_args = argparse.Namespace(
        project=project_dir,
        provider=args.provider,
        scenes="all" if len(numbers) == len(project.get("scenes", [])) else ",".join(str(value) for value in numbers),
        text=DEFAULT_AUDITION_TEXT,
        gender=args.gender,
        voice_id=None,
        voice_ids=selected_ids,
        confirm_spend=int(config.get("auditionMaxCredits", 120)),
        force=False,
    )
    print(json.dumps(recommendation, ensure_ascii=False, indent=2))
    return cmd_tts_audition(audition_args)


def cmd_approve_voice(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    project_path, project, config = load_project_and_tts(project_dir, args.provider)
    gate = project.get("auditionGate")
    if not isinstance(gate, dict) or gate.get("status") not in {"awaiting-selection", "approved"}:
        raise ValueError("현재 프로젝트의 오디션 결과가 없습니다. 먼저 autobuild 또는 tts audition을 실행하세요.")
    numbers = [int(value) for value in gate.get("sceneNumbers", [])]
    paths = approval_scene_paths(project_dir, project, numbers)
    content_hash = project_content_hash(project_dir, paths, project)
    if gate.get("contentHash") != content_hash:
        raise ValueError("오디션 뒤 대본이나 원문이 변경됐습니다. 새 오디션이 필요합니다.")
    selected = next((item for item in gate.get("candidates", []) if item.get("voiceId") == args.voice_id), None)
    if selected is None:
        raise ValueError("선택한 화자는 이 프로젝트에서 오디션한 후보가 아닙니다.")
    provider_name = str(gate.get("provider") or config["provider"])
    provider = get_provider(provider_name)
    planning = voiceover_plan(project_dir, numbers, provider_name)
    estimated = int(planning["estimatedCredits"])
    ledger_ceiling = ledger_reserved_credits(load_ledger(project_dir)) + math.ceil(estimated * 1.10)
    subscription = provider.subscription()
    if args.purpose == "commercial" and str(subscription.tier).lower() in {"free", "unknown"}:
        raise ValueError("현재 계정은 상업 공개용 음성 사용이 확인되지 않아 승인을 완료할 수 없습니다.")
    project.setdefault("tts", {}).update(
        {
            "provider": provider_name,
            "voiceId": selected["voiceId"],
            "voiceName": selected.get("voiceName"),
            "voiceLabels": selected.get("labels", {}),
            "approvedMaxCredits": ledger_ceiling,
        }
    )
    project["tts"].setdefault("voicesByProvider", {})[provider_name] = {
        "voiceId": selected["voiceId"],
        "voiceName": selected.get("voiceName"),
        "voiceLabels": selected.get("labels", {}),
    }
    updated_config = resolved_tts_config(project, provider_name)
    fingerprint = voice_approval_fingerprint(content_hash, provider_name, selected["voiceId"], updated_config["modelId"], updated_config["voiceSettings"])
    project["voiceApproval"] = {
        "status": "approved",
        "fingerprint": fingerprint,
        "contentHash": content_hash,
        "provider": provider_name,
        "voiceId": selected["voiceId"],
        "voiceName": selected.get("voiceName"),
        "modelId": updated_config["modelId"],
        "estimatedCredits": estimated,
        "approvedAdditionalCredits": math.ceil(estimated * 1.10),
        "approvedLedgerCeiling": ledger_ceiling,
        "accountTier": subscription.tier,
        "commercialUseAllowed": str(subscription.tier).lower() not in {"free", "unknown"},
        "sceneNumbers": numbers,
        "approvedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    project["auditionGate"]["status"] = "approved"
    atomic_write_json(project_path, project)
    write_workflow_state(project_dir, "voiceApproved", voiceId=selected["voiceId"], sceneNumbers=numbers)
    print(f"음성을 승인했습니다: {selected.get('voiceName') or selected['voiceId']}")
    resume_args = argparse.Namespace(
        project=project_dir,
        provider=provider_name,
        scenes=",".join(str(value) for value in numbers),
        purpose=args.purpose,
        edit_package=args.edit_package,
        force=False,
    )
    return cmd_resume(resume_args)


def cmd_resume(args: argparse.Namespace) -> int:
    project_dir = args.project.resolve()
    _, project, config = load_project_and_tts(project_dir, args.provider)
    approval = project.get("voiceApproval", {})
    configured_numbers = approval.get("sceneNumbers") if isinstance(approval, dict) else None
    specification = args.scenes or (",".join(str(value) for value in configured_numbers) if configured_numbers else "all")
    numbers = parse_scene_numbers(project, specification)
    paths = approval_scene_paths(project_dir, project, numbers)
    approval = validate_voice_approval(project_dir, paths, project, config)
    estimated = voiceover_plan(project_dir, numbers, config["provider"])["estimatedCredits"]
    if estimated > math.floor(int(approval["estimatedCredits"]) * 1.10):
        write_workflow_state(project_dir, "needsCostReapproval", estimatedCredits=estimated, approvedCredits=approval["estimatedCredits"])
        raise ValueError("현재 예상 TTS 소비량이 오디션 승인 시점보다 10% 이상 늘었습니다. 새 승인이 필요합니다.")
    missing_images: list[int] = []
    for number, path in zip(numbers, paths):
        scene = load_json(path)
        source_name = scene.get("source", {}).get("file", "base-art.png")
        if not (path.parent / source_name).exists():
            missing_images.append(number)
    if missing_images:
        state = write_workflow_state(project_dir, "needsImages", sceneNumbers=missing_images, nextCodexAction="Codex 네이티브 이미지 생성으로 base-art.png를 채운 뒤 resume을 다시 실행하세요.")
        print(f"음성 승인은 완료됐습니다. 이미지 생성 뒤 자동 재개합니다: {state}")
        return 0
    for path in paths:
        if not (path.parent / "final-reference.png").exists():
            compose_reference(path)
    build_args = argparse.Namespace(
        project=project_dir,
        provider=config["provider"],
        scenes=specification,
        profiles="master",
        confirm_spend=int(approval["approvedLedgerCeiling"]),
        force=bool(args.force),
        purpose=args.purpose,
    )
    cmd_build_voiced(build_args)
    clean_master = merge_voiced_profile(project_dir, numbers, "master")
    scene_clips = [voiced_output_path(project_dir, "master", path.parent.name) for path in paths]
    report = finalize_all_in_one(project_dir, numbers, clean_master, scene_clips, args.purpose, "master")
    if args.edit_package:
        edit_args = argparse.Namespace(project=project_dir, scenes=specification, variant=None, input=clean_master, output=None, purpose=args.purpose)
        cmd_export_edit_package(edit_args)
    write_workflow_state(project_dir, "complete", captionedVideo=report["captionedVideo"], sceneNumbers=numbers)
    print(f"풀 오토 올인원 제작 완료: {report['captionedVideo']}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Achmage 한국어 화이트보드 영상 제작 도구")
    sub = parser.add_subparsers(dest="command", required=True)

    doctor_parser = sub.add_parser("doctor", help="설치 상태 확인")
    doctor_parser.set_defaults(func=cmd_doctor)

    plan = sub.add_parser("import-plan", help="마크다운 시퀀스 표를 v2 프로젝트로 변환")
    plan.add_argument("--plan", type=Path, required=True)
    plan.add_argument("--project", type=Path, required=True)
    plan.add_argument("--force", action="store_true")
    plan.set_defaults(func=cmd_import_plan)

    srt = sub.add_parser("import-srt", help="SRT 자막을 8초 v2 프로젝트로 변환")
    srt.add_argument("--srt", type=Path, required=True)
    srt.add_argument("--project", type=Path, required=True)
    srt.add_argument("--force", action="store_true")
    srt.set_defaults(func=cmd_import_srt)

    validate = sub.add_parser("validate", help="프로젝트와 장면 JSON 검증")
    validate.add_argument("--project", type=Path, required=True)
    validate.add_argument("--scene", type=int)
    validate.add_argument("--require-source", action="store_true")
    validate.set_defaults(func=cmd_validate)

    attach = sub.add_parser("attach-image", help="네이티브 생성 이미지를 장면에 연결")
    attach.add_argument("--project", type=Path, required=True)
    attach.add_argument("--scene", type=int, required=True)
    attach.add_argument("--image", type=Path, required=True)
    attach.add_argument("--replace", action="store_true", help="기존 base-art.png 교체")
    attach.set_defaults(func=cmd_attach_image)

    compose = sub.add_parser("compose", help="정확한 한글이 포함된 기준 이미지 합성")
    compose.add_argument("--project", type=Path, required=True)
    compose.add_argument("--scene", type=int)
    compose.set_defaults(func=cmd_compose)

    render = sub.add_parser("render", help="장면 하나 렌더")
    render.add_argument("--project", type=Path, required=True)
    render.add_argument("--scene", type=int, required=True)
    render.add_argument("--profile", choices=("preview", "master"), default="preview")
    render.set_defaults(func=cmd_render)

    render_all = sub.add_parser("render-all", help="원본 이미지 준비가 끝난 모든 장면 렌더")
    render_all.add_argument("--project", type=Path, required=True)
    render_all.add_argument("--profile", choices=("preview", "master"), default="preview")
    render_all.set_defaults(func=cmd_render_all)

    merge = sub.add_parser("merge", help="렌더된 장면 순서대로 병합")
    merge.add_argument("--project", type=Path, required=True)
    merge.add_argument("--profile", choices=("preview", "master"), default="preview")
    merge.add_argument("--scenes", help="예: 1-3 또는 1,3,5")
    merge.add_argument("--output", type=Path)
    merge.set_defaults(func=cmd_merge)

    migrate = sub.add_parser("migrate-v1", help="기존 v1 주석 JSON을 v2로 변환")
    migrate.add_argument("--input", type=Path, required=True)
    migrate.add_argument("--output", type=Path, required=True)
    migrate.add_argument("--force", action="store_true")
    migrate.set_defaults(func=cmd_migrate)

    contact = sub.add_parser("contact-sheet", help="완성 기준 이미지 콘택트시트 생성")
    contact.add_argument("--project", type=Path, required=True)
    contact.add_argument("--columns", type=int, default=6)
    contact.set_defaults(func=cmd_contact_sheet)

    report = sub.add_parser("report", help="장면별 준비 상태 보고")
    report.add_argument("--project", type=Path, required=True)
    report.set_defaults(func=cmd_report)

    preview = sub.add_parser("preview", help="한국어 영역·타임라인 편집기 실행")
    preview.add_argument("--project", type=Path, required=True)
    preview.add_argument("--port", type=int, default=8765)
    preview.add_argument("--no-open", action="store_true")
    preview.set_defaults(func=cmd_preview)

    approve = sub.add_parser("approve-anchors", help="3개 앵커를 승인 상태로 잠금")
    approve.add_argument("--project", type=Path, required=True)
    approve.set_defaults(func=cmd_approve_anchors)

    tts = sub.add_parser("tts", help="TTS 계정·화자·대본·오디션 관리")
    tts_sub = tts.add_subparsers(dest="tts_command", required=True)

    tts_status = tts_sub.add_parser("status", help="TTS 계정과 잔여 크레딧 확인")
    tts_status.add_argument("--project", type=Path, required=True)
    tts_status.add_argument("--provider", choices=("elevenlabs", "typecast"))
    tts_status.set_defaults(func=cmd_tts_status)

    tts_voices = tts_sub.add_parser("voices", help="차분한 남성 강의 화자 후보 확인")
    tts_voices.add_argument("--project", type=Path, required=True)
    tts_voices.add_argument("--provider", choices=("elevenlabs", "typecast"))
    tts_voices.add_argument("--gender", choices=("male", "female", "any"), default="any")
    tts_voices.add_argument("--limit", type=int, default=5)
    tts_voices.set_defaults(func=cmd_tts_voices)

    tts_recommend = tts_sub.add_parser("recommend", help="마크다운과 대본에 맞는 음성 후보 3명 추천")
    tts_recommend.add_argument("--project", type=Path, required=True)
    tts_recommend.add_argument("--provider", choices=("elevenlabs", "typecast"))
    tts_recommend.add_argument("--markdown", type=Path)
    tts_recommend.add_argument("--scenes", default="all", help="예: all, 1-3 또는 1,3,5")
    tts_recommend.add_argument("--gender", choices=("male", "female", "any"), default="any")
    tts_recommend.add_argument("--limit", type=int, default=3)
    tts_recommend.set_defaults(func=cmd_tts_recommend)

    tts_audition = tts_sub.add_parser("audition", help="60자 이내 한국어 화자 오디션 생성")
    tts_audition.add_argument("--project", type=Path, required=True)
    tts_audition.add_argument("--provider", choices=("elevenlabs", "typecast"))
    tts_audition.add_argument("--text")
    tts_audition.add_argument("--gender", choices=("male", "female", "any"), default="any")
    tts_audition.add_argument("--voice-id", help="목록에서 선택한 화자 ID")
    tts_audition.add_argument("--voice-ids", help="쉼표로 구분한 오디션 화자 ID, 최대 2명")
    tts_audition.add_argument("--scenes", default="all", help="승인 범위: all, 1-3 또는 1,3,5")
    tts_audition.add_argument("--confirm-spend", type=int, required=True)
    tts_audition.add_argument("--force", action="store_true")
    tts_audition.set_defaults(func=cmd_tts_audition)

    tts_plan = tts_sub.add_parser("plan", help="API 호출 없이 대본과 예상 크레딧 확인")
    tts_plan.add_argument("--project", type=Path, required=True)
    tts_plan.add_argument("--provider", choices=("elevenlabs", "typecast"))
    tts_plan.add_argument("--scenes", help="예: 1-3 또는 1,3,5")
    tts_plan.set_defaults(func=cmd_tts_plan)

    build_voiced = sub.add_parser("build-voiced", help="TTS 합성부터 유성 렌더·병합까지 실행")
    build_voiced.add_argument("--project", type=Path, required=True)
    build_voiced.add_argument("--provider", choices=("elevenlabs", "typecast"))
    build_voiced.add_argument("--scenes", help="예: 1-3 또는 1,3,5")
    build_voiced.add_argument("--profiles", default="preview,master")
    build_voiced.add_argument("--confirm-spend", type=int, required=True)
    build_voiced.add_argument("--force", action="store_true")
    build_voiced.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    build_voiced.set_defaults(func=cmd_build_voiced)

    merge_voiced = sub.add_parser("merge-voiced", help="유성 시퀀스를 순서대로 병합")
    merge_voiced.add_argument("--project", type=Path, required=True)
    merge_voiced.add_argument("--scenes", help="예: 1-3 또는 1,3,5")
    merge_voiced.add_argument("--profile", choices=("preview", "master"), default="preview")
    merge_voiced.add_argument("--output", type=Path)
    merge_voiced.add_argument("--variant", help="변형 렌더 폴더 이름(예: line-trace-smooth-v2)")
    merge_voiced.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    merge_voiced.set_defaults(func=cmd_merge_voiced)

    rerender_voiced = sub.add_parser("rerender-voiced", help="기존 음성을 재사용해 시각 모션만 무과금으로 다시 렌더")
    rerender_voiced.add_argument("--project", type=Path, required=True)
    rerender_voiced.add_argument("--scenes", required=True, help="예: 1 또는 1-3")
    rerender_voiced.add_argument("--animation", choices=("line-trace", "marker-wipe"), default="line-trace")
    rerender_voiced.add_argument("--variant", default="line-trace")
    rerender_voiced.add_argument("--profiles", default="preview")
    rerender_voiced.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    rerender_voiced.set_defaults(func=cmd_rerender_voiced)

    autobuild = sub.add_parser("autobuild", help="마크다운을 올인원 프로젝트로 준비하고 음성 오디션 게이트까지 진행")
    autobuild.add_argument("markdown", type=Path)
    autobuild.add_argument("--project", type=Path, required=True)
    autobuild.add_argument("--provider", choices=("elevenlabs", "typecast"), default="elevenlabs")
    autobuild.add_argument("--scenes", help="예: all, 1-3 또는 1,3,5")
    autobuild.add_argument("--gender", choices=("male", "female", "any"), default="any")
    autobuild.add_argument("--target-minutes", type=float, help="전체 목표 길이(분), 예: 60")
    autobuild.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    autobuild.set_defaults(func=cmd_autobuild)

    approve_voice = sub.add_parser("approve-voice", help="오디션 화자를 승인하고 추가 승인 없이 전체 제작 재개")
    approve_voice.add_argument("--project", type=Path, required=True)
    approve_voice.add_argument("--voice-id", required=True)
    approve_voice.add_argument("--provider", choices=("elevenlabs", "typecast"))
    approve_voice.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    approve_voice.add_argument("--edit-package", action="store_true")
    approve_voice.set_defaults(func=cmd_approve_voice)

    resume = sub.add_parser("resume", help="승인된 프로젝트를 누락된 단계부터 자동 재개")
    resume.add_argument("--project", type=Path, required=True)
    resume.add_argument("--provider", choices=("elevenlabs", "typecast"))
    resume.add_argument("--scenes", help="예: all, 1-3 또는 1,3,5")
    resume.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    resume.add_argument("--edit-package", action="store_true")
    resume.add_argument("--force", action="store_true")
    resume.set_defaults(func=cmd_resume)

    finalize = sub.add_parser("finalize-all-in-one", help="기존 유성 클립에 자막을 입혀 올인원 완성본 생성")
    finalize.add_argument("--project", type=Path, required=True)
    finalize.add_argument("--scenes", default="all", help="예: all, 1-3 또는 1,3,5")
    finalize.add_argument("--profile", choices=("preview", "master"), default="master")
    finalize.add_argument("--variant", help="기존 변형 렌더 이름")
    finalize.add_argument("--input", type=Path, help="이미 병합된 깨끗한 유성 영상")
    finalize.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    finalize.set_defaults(func=cmd_finalize_all_in_one)

    edit_package = sub.add_parser("export-edit-package", help="API 호출 없이 Premiere 수동 편집 자료 내보내기")
    edit_package.add_argument("--project", type=Path, required=True)
    edit_package.add_argument("--scenes", default="all", help="예: all, 1-3 또는 1,3,5")
    edit_package.add_argument("--variant", help="기존 변형 렌더 이름")
    edit_package.add_argument("--input", type=Path, help="이미 병합된 깨끗한 4K 유성 영상")
    edit_package.add_argument("--output", type=Path)
    edit_package.add_argument("--purpose", choices=("private-preview", "noncommercial", "commercial"), default="private-preview")
    edit_package.set_defaults(func=cmd_export_edit_package)

    package = sub.add_parser("package-skill", help="개인 GitHub·새 컴퓨터용 클린 ZIP 생성")
    package.add_argument("--output", type=Path)
    package.set_defaults(func=cmd_package_skill)
    return parser


def main(argv: list[str] | None = None) -> int:
    configure_utf8()
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return int(args.func(args))
    except (FileNotFoundError, FileExistsError, ValueError, RuntimeError, TTSRequestError) as exc:
        print(f"오류: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
