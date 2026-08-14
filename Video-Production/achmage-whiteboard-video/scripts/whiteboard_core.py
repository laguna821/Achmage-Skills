from __future__ import annotations

import copy
import hashlib
import json
import math
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile
import time
import webbrowser
from dataclasses import dataclass
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Iterable

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


SKILL_ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = SKILL_ROOT / "assets" / "fonts" / "NotoSansKR-VF.ttf"
MARKER_HAND_PATH = SKILL_ROOT / "assets" / "hands" / "marker-hand.png"
ERASER_HAND_PATH = SKILL_ROOT / "assets" / "hands" / "eraser-hand.png"
PREVIEW_ROOT = SKILL_ROOT / "assets" / "preview"

THEMES: dict[str, dict[str, Any]] = {
    "achmage-newsroom-light": {
        "background": "#EEF4F7",
        "ink": "#263238",
        "primary": "#2F6BFF",
        "secondary": "#FF6B4A",
        "accent": "#F5B942",
        "texture": "fine-paper",
        "textureStrength": 0.025,
    },
    "achmage-newsroom-dark": {
        "background": "#101827",
        "ink": "#F4F7FB",
        "primary": "#6EA8FF",
        "secondary": "#FF8872",
        "accent": "#FFD166",
        "texture": "fine-paper",
        "textureStrength": 0.018,
    },
}

VALID_ACTIONS = {"draw", "hold", "erase", "replace"}
VALID_KINDS = {"art", "text", "shape"}
TRACE_LEVELS = 4094
TRACE_BACKGROUND = 65535
TRACE_CURSOR_SAMPLES = 2048


def configure_utf8() -> None:
    os.environ.setdefault("PYTHONUTF8", "1")
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8", errors="replace")
            except (ValueError, OSError):
                pass


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def save_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def ease_in_out(value: float) -> float:
    value = clamp(value)
    return value * value * (3.0 - 2.0 * value)


def rgb(color: str) -> tuple[int, int, int]:
    value = color.lstrip("#")
    if len(value) == 3:
        value = "".join(ch * 2 for ch in value)
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def luminance(color: str) -> float:
    vals = [v / 255 for v in rgb(color)]
    vals = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in vals]
    return 0.2126 * vals[0] + 0.7152 * vals[1] + 0.0722 * vals[2]


def resolve_theme(scene: dict[str, Any], project: dict[str, Any] | None = None) -> dict[str, Any]:
    project = project or {}
    name = scene.get("canvas", {}).get("theme") or project.get("theme") or "achmage-newsroom-light"
    if name not in THEMES:
        raise ValueError(f"알 수 없는 테마입니다: {name}")
    theme = dict(THEMES[name])
    theme.update(project.get("themeOverrides", {}))
    canvas = scene.get("canvas", {})
    if canvas.get("texture"):
        theme["texture"] = canvas["texture"]
    if "textureStrength" in canvas:
        theme["textureStrength"] = float(canvas["textureStrength"])
    theme["name"] = name
    return theme


def paper_canvas(size: tuple[int, int], theme: dict[str, Any]) -> Image.Image:
    width, height = size
    base = np.empty((height, width, 3), dtype=np.float32)
    base[:] = rgb(theme["background"])
    texture = theme.get("texture", "flat")
    strength = float(theme.get("textureStrength", 0.0))
    if texture != "flat" and strength > 0:
        rng = np.random.default_rng(20260814)
        scale = 255 * strength
        if texture == "recycled":
            noise = rng.normal(0, scale, (max(1, height // 8), max(1, width // 8), 1))
            noise_img = Image.fromarray(np.clip(noise + 128, 0, 255).astype(np.uint8).squeeze(), "L")
            noise_img = noise_img.resize(size, Image.Resampling.BILINEAR).filter(ImageFilter.GaussianBlur(1.2))
            noise = (np.asarray(noise_img, dtype=np.float32) - 128)[:, :, None]
        else:
            noise = rng.normal(0, scale, (height, width, 1))
        base += noise
    result = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB")
    if texture == "dot-grid":
        draw = ImageDraw.Draw(result)
        dot = (*rgb(theme["ink"]), 20)
        overlay = Image.new("RGBA", size, (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        step = max(18, height // 54)
        radius = max(1, height // 1080)
        for y in range(step, height, step):
            for x in range(step, width, step):
                od.ellipse((x - radius, y - radius, x + radius, y + radius), fill=dot)
        result = Image.alpha_composite(result.convert("RGBA"), overlay).convert("RGB")
    return result.convert("RGBA")


def normalized_box(region: dict[str, Any], size: tuple[int, int]) -> tuple[int, int, int, int]:
    width, height = size
    x = int(round(clamp(float(region.get("x", 0))) * width))
    y = int(round(clamp(float(region.get("y", 0))) * height))
    w = int(round(clamp(float(region.get("width", 1))) * width))
    h = int(round(clamp(float(region.get("height", 1))) * height))
    return x, y, max(1, min(width - x, w)), max(1, min(height - y, h))


def fit_cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    width, height = size
    scale = max(width / image.width, height / image.height)
    resized = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - width) // 2)
    top = max(0, (resized.height - height) // 2)
    return resized.crop((left, top, left + width, top + height))


def remove_flat_background(image: Image.Image, theme: dict[str, Any]) -> Image.Image:
    source = image.convert("RGBA")
    arr = np.asarray(source, dtype=np.float32)
    rgb_arr = arr[:, :, :3]
    edge = max(3, min(source.width, source.height) // 80)
    border = np.concatenate(
        [rgb_arr[:edge].reshape(-1, 3), rgb_arr[-edge:].reshape(-1, 3), rgb_arr[:, :edge].reshape(-1, 3), rgb_arr[:, -edge:].reshape(-1, 3)],
        axis=0,
    )
    key = np.median(border, axis=0)
    distance = np.linalg.norm(rgb_arr - key, axis=2)
    low, high = 7.0, 54.0
    alpha = np.clip((distance - low) / (high - low), 0, 1) * arr[:, :, 3]
    # 어두운 테마와 밝은 테마 모두에서 배경과 비슷한 픽셀만 제거한다.
    result = arr.copy()
    result[:, :, 3] = alpha
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGBA")


def validate_region(region: Any, prefix: str, errors: list[str]) -> None:
    if not isinstance(region, dict):
        errors.append(f"{prefix}: region이 객체가 아닙니다.")
        return
    for key in ("x", "y", "width", "height"):
        value = region.get(key)
        if not isinstance(value, (int, float)) or not 0 <= float(value) <= 1:
            errors.append(f"{prefix}: region.{key}는 0~1 숫자여야 합니다.")
    if isinstance(region.get("width"), (int, float)) and float(region["width"]) <= 0:
        errors.append(f"{prefix}: region.width는 0보다 커야 합니다.")
    if isinstance(region.get("height"), (int, float)) and float(region["height"]) <= 0:
        errors.append(f"{prefix}: region.height는 0보다 커야 합니다.")
    if all(isinstance(region.get(k), (int, float)) for k in ("x", "width")) and region["x"] + region["width"] > 1.0001:
        errors.append(f"{prefix}: 가로 영역이 캔버스를 벗어납니다.")
    if all(isinstance(region.get(k), (int, float)) for k in ("y", "height")) and region["y"] + region["height"] > 1.0001:
        errors.append(f"{prefix}: 세로 영역이 캔버스를 벗어납니다.")


def validate_scene(scene: dict[str, Any], scene_path: Path | None = None, require_source: bool = False) -> list[str]:
    errors: list[str] = []
    if scene.get("schemaVersion") != 2:
        errors.append("schemaVersion은 2여야 합니다.")
    if not isinstance(scene.get("sceneId"), str) or not scene["sceneId"]:
        errors.append("sceneId가 필요합니다.")
    duration = scene.get("durationMs")
    if not isinstance(duration, int) or duration <= 0:
        errors.append("durationMs는 양의 정수여야 합니다.")
    voiceover = scene.get("voiceover")
    if voiceover is not None:
        if not isinstance(voiceover, dict):
            errors.append("voiceover는 객체여야 합니다.")
        else:
            if not isinstance(voiceover.get("script", ""), str):
                errors.append("voiceover.script는 문자열이어야 합니다.")
            if voiceover.get("status", "draft") not in {"draft", "approved", "generated"}:
                errors.append("voiceover.status는 draft, approved, generated 중 하나여야 합니다.")
    canvas = scene.get("canvas")
    if not isinstance(canvas, dict):
        errors.append("canvas가 필요합니다.")
    else:
        for key in ("width", "height"):
            if not isinstance(canvas.get(key), int) or canvas[key] <= 0:
                errors.append(f"canvas.{key}는 양의 정수여야 합니다.")
        if canvas.get("theme", "achmage-newsroom-light") not in THEMES:
            errors.append(f"지원하지 않는 테마입니다: {canvas.get('theme')}")
    elements = scene.get("elements")
    if not isinstance(elements, list):
        errors.append("elements는 배열이어야 합니다.")
        return errors
    ids: set[str] = set()
    for index, element in enumerate(elements):
        prefix = f"elements[{index}]"
        eid = element.get("id")
        if not isinstance(eid, str) or not eid:
            errors.append(f"{prefix}: id가 필요합니다.")
        elif eid in ids:
            errors.append(f"{prefix}: 중복 id입니다: {eid}")
        else:
            ids.add(eid)
        if element.get("kind") not in VALID_KINDS:
            errors.append(f"{prefix}: kind는 art, text, shape 중 하나여야 합니다.")
        validate_region(element.get("region"), prefix, errors)
        events = element.get("events", [])
        if not isinstance(events, list):
            errors.append(f"{prefix}: events는 배열이어야 합니다.")
            continue
        for event_index, event in enumerate(events):
            ep = f"{prefix}.events[{event_index}]"
            if event.get("action") not in VALID_ACTIONS:
                errors.append(f"{ep}: 지원하지 않는 action입니다.")
            for key in ("startMs", "durationMs"):
                if not isinstance(event.get(key), int) or event[key] < 0:
                    errors.append(f"{ep}.{key}는 0 이상의 정수여야 합니다.")
            if isinstance(duration, int) and isinstance(event.get("startMs"), int) and isinstance(event.get("durationMs"), int):
                if event["startMs"] + event["durationMs"] > duration:
                    errors.append(f"{ep}: 이벤트가 장면 길이를 벗어납니다.")
            target = event.get("targetId")
            if target and not isinstance(target, str):
                errors.append(f"{ep}: targetId는 문자열이어야 합니다.")
            sync_to = event.get("syncTo")
            if sync_to is not None and not isinstance(sync_to, (str, dict)):
                errors.append(f"{ep}: syncTo는 문자열 또는 객체여야 합니다.")
    for element in elements:
        for event in element.get("events", []):
            if event.get("action") == "replace" and event.get("targetId") not in ids:
                errors.append(f"{element.get('id')}: replace targetId를 찾을 수 없습니다: {event.get('targetId')}")
    source = scene.get("source", {})
    if require_source and scene_path and source.get("file"):
        if not (scene_path.parent / source["file"]).exists():
            errors.append(f"원본 이미지가 없습니다: {source['file']}")
    return errors


def migrate_v1(data: dict[str, Any]) -> dict[str, Any]:
    if data.get("schemaVersion") == 2:
        return data
    canvas = data.get("canvas", {})
    width = int(canvas.get("width", 1920))
    height = int(canvas.get("height", 1080))
    duration = int(data.get("sceneDurationMs", 8000))
    migrated: dict[str, Any] = {
        "schemaVersion": 2,
        "sceneId": data.get("sceneId", "sequence-001"),
        "durationMs": duration,
        "narration": data.get("storyBasis", ""),
        "canvas": {"width": 3840, "height": 2160, "theme": "achmage-newsroom-light", "texture": "fine-paper", "textureStrength": 0.025},
        "source": {"file": "base-art.png", "nativeWidth": width, "nativeHeight": height, "status": "ready", "promptFile": "image-prompt.txt"},
        "textSafeRegions": [],
        "elements": [],
    }
    for index, old in enumerate(data.get("elements", [])):
        r = old.get("region", {})
        reveal = old.get("reveal", {})
        direction = str(reveal.get("direction", "top_to_bottom")).replace("_", "-")
        migrated["elements"].append(
            {
                "id": old.get("id", f"art-{index + 1}"),
                "kind": "art",
                "label": old.get("label", f"그림 {index + 1}"),
                "zIndex": 10 + index,
                "region": {
                    "x": clamp(float(r.get("x", 0)) / width),
                    "y": clamp(float(r.get("y", 0)) / height),
                    "width": clamp(float(r.get("width", width)) / width),
                    "height": clamp(float(r.get("height", height)) / height),
                },
                "events": [
                    {
                        "action": "draw",
                        "startMs": int(reveal.get("startMs", 150)),
                        "durationMs": int(reveal.get("durationMs", 5050)),
                        "animation": "marker-wipe" if direction == "top-to-bottom" else direction,
                    },
                    {"action": "hold", "startMs": min(duration, int(reveal.get("startMs", 150)) + int(reveal.get("durationMs", 5050))), "durationMs": max(0, duration - int(reveal.get("startMs", 150)) - int(reveal.get("durationMs", 5050))), "animation": "none"},
                ],
                "legacy": {"subtitle": old.get("subtitle", ""), "protectedRegions": reveal.get("protectedRegions", [])},
            }
        )
    return migrated


PLAN_ROW = re.compile(r"^\|\s*(\d{1,3})\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$")


def parse_sequence_plan(text: str) -> list[dict[str, Any]]:
    scenes: list[dict[str, Any]] = []
    for line in text.replace("\r\n", "\n").splitlines():
        match = PLAN_ROW.match(line)
        if not match:
            continue
        number = int(match.group(1))
        narration = match.group(2).strip()
        visual = match.group(3).strip()
        if narration and visual:
            scenes.append({"number": number, "narration": narration, "visual": visual})
    seen: set[int] = set()
    unique: list[dict[str, Any]] = []
    for scene in scenes:
        if scene["number"] not in seen:
            seen.add(scene["number"])
            unique.append(scene)
    return sorted(unique, key=lambda item: item["number"])


def scene_prompt(narration: str, visual: str) -> str:
    return (
        "Use case: scientific-educational\n"
        "Asset type: 16:9 whiteboard lecture illustration\n"
        f"Primary request: {visual}\n"
        "Style/medium: sophisticated hand-drawn editorial whiteboard illustration, clean charcoal ink contours, sparse flat color accents\n"
        "Composition/framing: wide 16:9 composition, one coherent visual flow, generous protected title area across the top 20 percent\n"
        "Color palette: charcoal ink, newsroom blue, restrained coral and amber accents, pale cool-gray paper\n"
        f"Narrative intent for composition only: {narration}\n"
        "Constraints: simple readable silhouettes, no text, no letters, no numbers, no logo, no watermark, no pseudo-writing, no UI labels\n"
        "Avoid: photorealism, 3D render, dense background, decorative border, beige cast, Chinese characters, Korean characters\n"
    )


def default_scene(number: int, narration: str, visual: str) -> dict[str, Any]:
    scene_id = f"sequence-{number:03d}"
    elements: list[dict[str, Any]] = [
        {
            "id": "art-main",
            "kind": "art",
            "label": "주요 삽화",
            "zIndex": 10,
            "region": {"x": 0.035, "y": 0.205, "width": 0.93, "height": 0.755},
            "events": [
                {"action": "draw", "startMs": 150, "durationMs": 5050, "animation": "marker-wipe"},
                {"action": "hold", "startMs": 5200, "durationMs": 2800, "animation": "none"},
            ],
        },
        {
            "id": "headline",
            "kind": "text",
            "label": "핵심 문장",
            "zIndex": 20,
            "content": narration,
            "region": {"x": 0.06, "y": 0.035, "width": 0.88, "height": 0.18},
            "style": {"fontSize": 78, "fontWeight": 700, "color": "#263238", "accentColor": "#2F6BFF", "align": "center", "verticalAlign": "middle", "lineSpacing": 1.16},
            "events": [
                {"action": "draw", "startMs": 650, "durationMs": 1850, "animation": "line-by-line"},
                {"action": "hold", "startMs": 2500, "durationMs": 5500, "animation": "none"},
            ],
        },
    ]
    if number == 44:
        elements[0]["events"][0].update({"startMs": 250, "durationMs": 4650})
        elements.append(
            {
                "id": "stages",
                "kind": "text",
                "label": "발전 다섯 단계",
                "zIndex": 25,
                "content": "프롬프트  →  추론  →  도구 연결  →  스킬  →  하네스",
                "region": {"x": 0.08, "y": 0.79, "width": 0.84, "height": 0.12},
                "style": {"fontSize": 52, "fontWeight": 700, "color": "#2F6BFF", "align": "center", "verticalAlign": "middle", "lineSpacing": 1.1, "boxFill": "#EEF4F7E8", "boxRadius": 24},
                "events": [
                    {"action": "draw", "startMs": 2600, "durationMs": 2600, "animation": "left-to-right"},
                    {"action": "hold", "startMs": 5200, "durationMs": 2800, "animation": "none"},
                ],
            }
        )
    if number == 46:
        elements[0]["region"] = {"x": 0.06, "y": 0.27, "width": 0.88, "height": 0.58}
        elements.extend(
            [
                {
                    "id": "pretty-doc",
                    "kind": "text",
                    "label": "사람 중심 문서",
                    "zIndex": 24,
                    "content": "사람에게 예쁜 문서",
                    "region": {"x": 0.09, "y": 0.72, "width": 0.34, "height": 0.11},
                    "style": {"fontSize": 56, "fontWeight": 700, "color": "#FF6B4A", "align": "center", "verticalAlign": "middle", "lineSpacing": 1.1},
                    "events": [{"action": "draw", "startMs": 1500, "durationMs": 1500, "animation": "slide-up"}, {"action": "erase", "startMs": 4400, "durationMs": 650, "animation": "eraser-wipe"}],
                },
                {
                    "id": "machine-doc",
                    "kind": "text",
                    "label": "AI 중심 문서",
                    "zIndex": 25,
                    "content": "AI가 읽기 쉬운 문서",
                    "region": {"x": 0.57, "y": 0.72, "width": 0.34, "height": 0.11},
                    "style": {"fontSize": 56, "fontWeight": 700, "color": "#2F6BFF", "align": "center", "verticalAlign": "middle", "lineSpacing": 1.1},
                    "events": [{"action": "replace", "targetId": "pretty-doc", "startMs": 4500, "durationMs": 1200, "animation": "left-to-right"}, {"action": "hold", "startMs": 5700, "durationMs": 2300, "animation": "none"}],
                },
            ]
        )
    return {
        "schemaVersion": 2,
        "sceneId": scene_id,
        "durationMs": 8000,
        "narration": narration,
        "voiceover": {"script": "", "status": "draft"},
        "visualBrief": visual,
        "canvas": {"width": 3840, "height": 2160, "theme": "achmage-newsroom-light", "texture": "fine-paper", "textureStrength": 0.025},
        "source": {"file": "base-art.png", "nativeWidth": 0, "nativeHeight": 0, "status": "pending", "promptFile": "image-prompt.txt"},
        "textSafeRegions": [{"x": 0.06, "y": 0.035, "width": 0.88, "height": 0.18}],
        "elements": elements,
    }


def import_plan(plan_path: Path, project_dir: Path, force: bool = False) -> int:
    rows = parse_sequence_plan(plan_path.read_text(encoding="utf-8-sig"))
    if not rows:
        raise ValueError("시퀀스 표를 찾지 못했습니다. 번호·핵심 문장·시각 내용의 마크다운 표가 필요합니다.")
    project_file = project_dir / "project.json"
    existing_project = load_json(project_file) if project_file.exists() and force else {}
    if project_file.exists() and not force:
        raise FileExistsError(f"프로젝트가 이미 있습니다: {project_file}")
    project_dir.mkdir(parents=True, exist_ok=True)
    scene_entries: list[dict[str, Any]] = []
    for row in rows:
        number = row["number"]
        scene_dir = project_dir / "scenes" / f"sequence-{number:03d}"
        scene_dir.mkdir(parents=True, exist_ok=True)
        scene = default_scene(number, row["narration"], row["visual"])
        save_json(scene_dir / "scene.json", scene)
        (scene_dir / "image-prompt.txt").write_text(scene_prompt(row["narration"], row["visual"]), encoding="utf-8")
        scene_entries.append({"number": number, "sceneId": scene["sceneId"], "path": f"scenes/{scene['sceneId']}/scene.json", "status": "pending", "anchor": number in {1, 44, 46}})
    project = {
        "schemaVersion": 2,
        "projectId": project_dir.name,
        "title": plan_path.stem,
        "language": "ko-KR",
        "workflowMode": "autoAfterVoiceApproval",
        "outputProfile": "all-in-one",
        "defaultAnimation": "line-trace",
        "sourcePlan": str(plan_path.resolve()),
        "defaultDurationMs": 8000,
        "theme": "achmage-newsroom-light",
        "themeOverrides": {},
        "masterProfile": {"width": 3840, "height": 2160, "fps": 60, "crf": 17},
        "previewProfile": {"width": 960, "height": 540, "fps": 30, "crf": 24},
        "anchorScenes": [1, 44, 46],
        "anchorStatus": "pending-approval",
        "pilotScenes": [1, 2, 3],
        "tts": {
            "provider": "elevenlabs",
            "modelIdByProvider": {"elevenlabs": "eleven_multilingual_v2", "typecast": "ssfm-v30"},
            "voiceId": None,
            "voiceName": None,
            "leadInMs": 1250,
            "leadOutMs": 1750,
            "pilotMaxCredits": 1500,
            "productionMaxCredits": 100000,
            "auditionMaxCredits": 120,
            "budgetMode": "pilot",
            "minimumRemainingFraction": 0.75,
            "licenseMode": "private-preview",
            "voiceSettings": {"stability": 0.65, "similarityBoost": 0.8, "style": 0.15, "speed": 0.95},
        },
        "voiceApproval": None,
        "subtitles": {"mode": "burn-in", "maxLines": 2, "maxCharsPerLine": 22, "minimumDurationMs": 1000, "maximumDurationMs": 6000},
        "pronunciationOverrides": {},
        "scenes": scene_entries,
    }
    for key in ("workflowMode", "outputProfile", "defaultAnimation", "sourceMarkdown", "sourceHash", "targetDurationMs", "subtitles", "pronunciationOverrides"):
        if key in existing_project:
            project[key] = existing_project[key]
    if isinstance(existing_project.get("tts"), dict):
        old_tts = existing_project["tts"]
        project["tts"] = {**project["tts"], **old_tts, "voiceSettings": {**project["tts"]["voiceSettings"], **old_tts.get("voiceSettings", {})}}
    save_json(project_file, project)
    return len(rows)


SRT_TIME = re.compile(r"(\d+):(\d{2}):(\d{2})[,.](\d{1,3})")


def parse_srt(text: str) -> list[dict[str, Any]]:
    cues: list[dict[str, Any]] = []
    blocks = re.split(r"\n\s*\n", text.lstrip("\ufeff").replace("\r\n", "\n").replace("\r", "\n").strip())
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        timeline_index = next((index for index, line in enumerate(lines) if "-->" in line), None)
        if timeline_index is None:
            continue
        matches = SRT_TIME.findall(lines[timeline_index])
        if len(matches) < 2:
            continue
        def to_ms(parts: tuple[str, str, str, str]) -> int:
            hour, minute, second, millis = parts
            return ((int(hour) * 60 + int(minute)) * 60 + int(second)) * 1000 + int(millis.ljust(3, "0"))
        body = " ".join(lines[timeline_index + 1 :]).strip()
        if body:
            cues.append({"number": len(cues) + 1, "startMs": to_ms(matches[0]), "endMs": to_ms(matches[1]), "narration": body, "visual": f"'{body}'의 핵심 의미를 한눈에 보여주는 단순한 취재·데이터 삽화"})
    return cues


def import_srt(srt_path: Path, project_dir: Path, force: bool = False) -> int:
    rows = parse_srt(srt_path.read_text(encoding="utf-8-sig"))
    if not rows:
        raise ValueError("SRT 자막을 찾지 못했습니다.")
    project_file = project_dir / "project.json"
    if project_file.exists() and not force:
        raise FileExistsError(f"프로젝트가 이미 있습니다: {project_file}")
    project_dir.mkdir(parents=True, exist_ok=True)
    entries: list[dict[str, Any]] = []
    for row in rows:
        number = row["number"]
        scene = default_scene(number, row["narration"], row["visual"])
        scene["sourceCue"] = {"startMs": row["startMs"], "endMs": row["endMs"]}
        scene_dir = project_dir / "scenes" / scene["sceneId"]
        scene_dir.mkdir(parents=True, exist_ok=True)
        save_json(scene_dir / "scene.json", scene)
        (scene_dir / "image-prompt.txt").write_text(scene_prompt(row["narration"], row["visual"]), encoding="utf-8")
        entries.append({"number": number, "sceneId": scene["sceneId"], "path": f"scenes/{scene['sceneId']}/scene.json", "status": "pending", "anchor": number in {1, 2, 3}})
    project = {
        "schemaVersion": 2,
        "projectId": project_dir.name,
        "title": srt_path.stem,
        "language": "ko-KR",
        "sourceSrt": str(srt_path.resolve()),
        "defaultDurationMs": 8000,
        "theme": "achmage-newsroom-light",
        "themeOverrides": {},
        "masterProfile": {"width": 3840, "height": 2160, "fps": 60, "crf": 17},
        "previewProfile": {"width": 960, "height": 540, "fps": 30, "crf": 24},
        "anchorScenes": [1, 2, 3],
        "anchorStatus": "pending-approval",
        "pilotScenes": [1, 2, 3],
        "tts": {
            "provider": "elevenlabs",
            "modelIdByProvider": {"elevenlabs": "eleven_multilingual_v2", "typecast": "ssfm-v30"},
            "voiceId": None,
            "voiceName": None,
            "leadInMs": 1250,
            "leadOutMs": 1750,
            "pilotMaxCredits": 1500,
            "minimumRemainingFraction": 0.75,
            "licenseMode": "private-preview",
            "voiceSettings": {"stability": 0.65, "similarityBoost": 0.8, "style": 0.15, "speed": 0.95},
        },
        "scenes": entries,
    }
    save_json(project_file, project)
    return len(rows)


def project_scene_paths(project_dir: Path, scene_number: int | None = None) -> list[Path]:
    project = load_json(project_dir / "project.json")
    paths: list[Path] = []
    for entry in project.get("scenes", []):
        if scene_number is not None and int(entry.get("number", -1)) != scene_number:
            continue
        paths.append(project_dir / entry["path"])
    return paths


def font_for(size: int, weight: int = 700) -> ImageFont.FreeTypeFont:
    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Noto Sans KR 글꼴이 없습니다: {FONT_PATH}")
    # 가변 글꼴의 기본 인스턴스만 사용해 운영체제별 결과 차이를 줄인다.
    font = ImageFont.truetype(str(FONT_PATH), max(1, size))
    try:
        font.set_variation_by_axes([max(100, min(900, int(weight)))])
    except (AttributeError, OSError):
        pass
    return font


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    paragraphs = text.splitlines() or [""]
    lines: list[str] = []
    for paragraph in paragraphs:
        if not paragraph:
            lines.append("")
            continue
        words = paragraph.split(" ")
        current = ""
        for word in words:
            candidate = word if not current else f"{current} {word}"
            if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
                current = candidate
                continue
            if current:
                lines.append(current)
                current = ""
            if draw.textbbox((0, 0), word, font=font)[2] <= max_width:
                current = word
                continue
            chunk = ""
            for char in word:
                candidate = chunk + char
                if chunk and draw.textbbox((0, 0), candidate, font=font)[2] > max_width:
                    lines.append(chunk)
                    chunk = char
                else:
                    chunk = candidate
            current = chunk
        if current:
            lines.append(current)
    return lines or [""]


def text_layer(size: tuple[int, int], element: dict[str, Any], theme: dict[str, Any]) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y, width, height = normalized_box(element["region"], size)
    style = element.get("style", {})
    scale = size[1] / 2160.0
    font_size = max(10, round(float(style.get("fontSize", 72)) * scale))
    font = font_for(font_size, int(style.get("fontWeight", 700)))
    padding = max(4, round(float(style.get("padding", 20)) * scale))
    box_fill = style.get("boxFill")
    if box_fill:
        fill_value = box_fill
        if isinstance(fill_value, str) and len(fill_value.lstrip("#")) == 8:
            raw = fill_value.lstrip("#")
            fill = (*rgb("#" + raw[:6]), int(raw[6:8], 16))
        else:
            fill = (*rgb(str(fill_value)), 255)
        radius = max(0, round(float(style.get("boxRadius", 18)) * scale))
        draw.rounded_rectangle((x, y, x + width, y + height), radius=radius, fill=fill)
    inner_width = max(1, width - padding * 2)
    lines = wrap_text(draw, str(element.get("content", "")), font, inner_width)
    spacing = max(1, round(font_size * float(style.get("lineSpacing", 1.15))))
    total_height = spacing * len(lines)
    vertical = style.get("verticalAlign", "middle")
    if vertical == "top":
        cursor_y = y + padding
    elif vertical == "bottom":
        cursor_y = y + height - padding - total_height
    else:
        cursor_y = y + (height - total_height) // 2
    align = style.get("align", "center")
    fill = style.get("color", theme["ink"])
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_width = bbox[2] - bbox[0]
        if align == "left":
            cursor_x = x + padding
        elif align == "right":
            cursor_x = x + width - padding - line_width
        else:
            cursor_x = x + (width - line_width) // 2
        draw.text((cursor_x, cursor_y), line, font=font, fill=fill)
        cursor_y += spacing
    return layer


def shape_layer(size: tuple[int, int], element: dict[str, Any], theme: dict[str, Any]) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y, width, height = normalized_box(element["region"], size)
    style = element.get("style", {})
    shape = style.get("shape", "roundRect")
    scale = size[1] / 2160.0
    stroke_width = max(1, round(float(style.get("strokeWidth", 8)) * scale))
    stroke = style.get("stroke", theme["primary"])
    fill = style.get("fill")
    if shape == "rect":
        draw.rectangle((x, y, x + width, y + height), fill=fill, outline=stroke, width=stroke_width)
    elif shape == "line":
        draw.line((x, y + height // 2, x + width, y + height // 2), fill=stroke, width=stroke_width)
    elif shape == "arrow":
        mid_y = y + height // 2
        draw.line((x, mid_y, x + width, mid_y), fill=stroke, width=stroke_width)
        head = max(stroke_width * 2, min(width, height) // 3)
        draw.polygon([(x + width, mid_y), (x + width - head, mid_y - head // 2), (x + width - head, mid_y + head // 2)], fill=stroke)
    else:
        radius = max(0, round(float(style.get("radius", 28)) * scale))
        draw.rounded_rectangle((x, y, x + width, y + height), radius=radius, fill=fill, outline=stroke, width=stroke_width)
    return layer


def art_layer(size: tuple[int, int], element: dict[str, Any], source: Image.Image, theme: dict[str, Any]) -> Image.Image:
    fitted = fit_cover(source.convert("RGBA"), size)
    extracted = remove_flat_background(fitted, theme)
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    x, y, width, height = normalized_box(element["region"], size)
    crop = extracted.crop((x, y, x + width, y + height))
    layer.alpha_composite(crop, (x, y))
    return layer


def element_layer(size: tuple[int, int], element: dict[str, Any], source: Image.Image | None, theme: dict[str, Any]) -> Image.Image:
    kind = element.get("kind")
    if kind == "text":
        return text_layer(size, element, theme)
    if kind == "shape":
        return shape_layer(size, element, theme)
    if source is None:
        return Image.new("RGBA", size, (0, 0, 0, 0))
    return art_layer(size, element, source, theme)


def event_progress(event: dict[str, Any], time_ms: float) -> float:
    start = float(event.get("startMs", 0))
    duration = max(1.0, float(event.get("durationMs", 0)))
    return ease_in_out((time_ms - start) / duration)


def element_visibility(element: dict[str, Any], time_ms: float, scene: dict[str, Any]) -> tuple[float, dict[str, Any] | None]:
    events = sorted(element.get("events", []), key=lambda item: (item.get("startMs", 0), item.get("action", "")))
    has_entrance = any(event.get("action") in {"draw", "replace"} for event in events)
    visible = 0.0 if has_entrance else 1.0
    active: dict[str, Any] | None = None
    for event in events:
        start = float(event.get("startMs", 0))
        end = start + float(event.get("durationMs", 0))
        action = event.get("action")
        if time_ms < start:
            continue
        if action in {"draw", "replace"}:
            visible = event_progress(event, time_ms) if time_ms < end else 1.0
        elif action == "erase":
            visible = 1.0 - event_progress(event, time_ms) if time_ms < end else 0.0
        if start <= time_ms < end and action != "hold":
            active = event
    for other in scene.get("elements", []):
        for event in other.get("events", []):
            if event.get("action") != "replace" or event.get("targetId") != element.get("id"):
                continue
            if time_ms >= event.get("startMs", 0):
                visible *= 1.0 - event_progress(event, time_ms)
    return clamp(visible), active


def reveal_mask(size: tuple[int, int], region: dict[str, Any], progress: float, animation: str) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    x, y, width, height = normalized_box(region, size)
    progress = clamp(progress)
    if animation in {"fade", "none"}:
        draw.rectangle((x, y, x + width, y + height), fill=round(255 * progress))
    elif animation in {"right-to-left"}:
        start = x + round(width * (1 - progress))
        draw.rectangle((start, y, x + width, y + height), fill=255)
    elif animation in {"top-to-bottom", "marker-wipe", "line-by-line"}:
        end = y + round(height * progress)
        draw.rectangle((x, y, x + width, end), fill=255)
    elif animation == "bottom-to-top":
        start = y + round(height * (1 - progress))
        draw.rectangle((x, start, x + width, y + height), fill=255)
    elif animation == "center-out":
        half = round(width * progress / 2)
        center = x + width // 2
        draw.rectangle((center - half, y, center + half, y + height), fill=255)
    else:
        end = x + round(width * progress)
        draw.rectangle((x, y, end, y + height), fill=255)
    return mask


@dataclass
class TracePlan:
    """Raster-derived stroke order used by the optional line-trace renderer."""

    order_map: Image.Image
    cursor_positions: list[tuple[int, int]]


def _shift_bool(array: np.ndarray, dy: int, dx: int) -> np.ndarray:
    shifted = np.zeros_like(array, dtype=bool)
    source_y = slice(max(0, -dy), array.shape[0] - max(0, dy))
    source_x = slice(max(0, -dx), array.shape[1] - max(0, dx))
    target_y = slice(max(0, dy), array.shape[0] - max(0, -dy))
    target_x = slice(max(0, dx), array.shape[1] - max(0, -dx))
    shifted[target_y, target_x] = array[source_y, source_x]
    return shifted


def _thin_binary(mask: np.ndarray, max_iterations: int = 72) -> np.ndarray:
    """Zhang-Suen thinning implemented with NumPy to avoid a heavy CV dependency."""

    image = mask.astype(bool).copy()
    if not image.any():
        return image
    for _ in range(max_iterations):
        changed = False
        for first_pass in (True, False):
            p2 = _shift_bool(image, 1, 0)
            p3 = _shift_bool(image, 1, -1)
            p4 = _shift_bool(image, 0, -1)
            p5 = _shift_bool(image, -1, -1)
            p6 = _shift_bool(image, -1, 0)
            p7 = _shift_bool(image, -1, 1)
            p8 = _shift_bool(image, 0, 1)
            p9 = _shift_bool(image, 1, 1)
            neighbors = (p2, p3, p4, p5, p6, p7, p8, p9)
            count = sum(neighbor.astype(np.uint8) for neighbor in neighbors)
            transitions = sum((~neighbors[index] & neighbors[(index + 1) % 8]).astype(np.uint8) for index in range(8))
            if first_pass:
                removable = image & (count >= 2) & (count <= 6) & (transitions == 1) & ~(p2 & p4 & p6) & ~(p4 & p6 & p8)
            else:
                removable = image & (count >= 2) & (count <= 6) & (transitions == 1) & ~(p2 & p4 & p8) & ~(p2 & p6 & p8)
            if removable.any():
                image[removable] = False
                changed = True
        if not changed:
            break
    return image


def _trace_skeleton(skeleton: np.ndarray) -> list[tuple[int, int]]:
    """Turn a skeleton into a deterministic sequence of locally connected strokes."""

    points = {(int(y), int(x)) for y, x in np.argwhere(skeleton)}
    if not points:
        return []
    neighbors = ((-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1))
    ordered: list[tuple[int, int]] = []
    current: tuple[int, int] | None = None
    direction = (0, 1)
    while points:
        if current is None:
            endpoints: list[tuple[int, int]] = []
            for candidate in points:
                degree = sum((candidate[0] + dy, candidate[1] + dx) in points for dy, dx in neighbors)
                if degree <= 1:
                    endpoints.append(candidate)
            if ordered:
                previous = ordered[-1]
                pool = endpoints or list(points)
                current = min(pool, key=lambda point: ((point[0] - previous[0]) ** 2 + (point[1] - previous[1]) ** 2, point[1], point[0]))
            else:
                current = min(endpoints or points, key=lambda point: (point[1], point[0]))
            direction = (0, 1)
        ordered.append(current)
        points.remove(current)
        candidates = [(current[0] + dy, current[1] + dx) for dy, dx in neighbors]
        candidates = [candidate for candidate in candidates if candidate in points]
        if not candidates:
            current = None
            continue
        previous = ordered[-2] if len(ordered) > 1 else None
        if previous:
            direction = (ordered[-1][0] - previous[0], ordered[-1][1] - previous[1])
        next_point = max(
            candidates,
            key=lambda point: (
                direction[0] * (point[0] - current[0]) + direction[1] * (point[1] - current[1]),
                -point[1],
                -point[0],
            ),
        )
        direction = (next_point[0] - current[0], next_point[1] - current[1])
        current = next_point
    return ordered


def _grow_trace_order(foreground: np.ndarray, seed_order: np.ndarray, max_iterations: int = 80) -> np.ndarray:
    """Spread stroke timing from skeletons into fills while preserving transparent gaps."""

    missing = np.uint16(TRACE_BACKGROUND)
    order = seed_order.copy()
    height, width = order.shape
    for _ in range(max_iterations):
        unknown = foreground & (order == missing)
        if not unknown.any():
            break
        best = np.full_like(order, missing)
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)):
            shifted = np.full_like(order, missing)
            source_y = slice(max(0, -dy), height - max(0, dy))
            source_x = slice(max(0, -dx), width - max(0, dx))
            target_y = slice(max(0, dy), height - max(0, -dy))
            target_x = slice(max(0, dx), width - max(0, -dx))
            values = order[source_y, source_x]
            incremented = np.minimum(values.astype(np.uint32) + 1, TRACE_LEVELS).astype(np.uint16)
            shifted[target_y, target_x] = np.where(values == missing, missing, incremented)
            best = np.minimum(best, shifted)
        fill = unknown & (best != missing)
        if not fill.any():
            break
        order[fill] = best[fill]
    order[foreground & (order == missing)] = TRACE_LEVELS
    order[~foreground] = TRACE_BACKGROUND
    return order


def _resample_cursor_path(
    sequence: list[tuple[int, int]],
    work_size: tuple[int, int],
    output_size: tuple[int, int],
    sample_count: int = TRACE_CURSOR_SAMPLES,
) -> list[tuple[int, int]]:
    """Create a stable hand route near the active cluster of inferred strokes."""

    if not sequence:
        return [(output_size[0] // 2, output_size[1] // 2)] * sample_count
    xy = np.asarray([(point[1], point[0]) for point in sequence], dtype=np.float64)
    if len(xy) == 1:
        xy = np.repeat(xy, 2, axis=0)
    source_index = np.arange(len(xy), dtype=np.float64)
    targets = np.linspace(0.0, len(xy) - 1, sample_count)
    sampled = np.column_stack((np.interp(targets, source_index, xy[:, 0]), np.interp(targets, source_index, xy[:, 1])))
    # The reveal map still follows every inferred stroke. The hand follows the
    # local stroke cluster so branch changes do not become visible teleports.
    window = min(41, sample_count if sample_count % 2 else sample_count - 1)
    kernel = np.ones(window, dtype=np.float64) / window
    padding = window // 2
    for axis in (0, 1):
        padded = np.pad(sampled[:, axis], (padding, padding), mode="edge")
        sampled[:, axis] = np.convolve(padded, kernel, mode="valid")
    work_width, work_height = work_size
    output_width, output_height = output_size
    return [
        (
            round(x / max(1, work_width - 1) * (output_width - 1)),
            round(y / max(1, work_height - 1) * (output_height - 1)),
        )
        for x, y in sampled
    ]


def build_trace_plan(layer: Image.Image, output_size: tuple[int, int] | None = None) -> TracePlan:
    """Infer a stroke order from a flattened art layer.

    The map is intentionally generated at preview scale and enlarged with nearest
    sampling. This keeps 4K rendering deterministic and inexpensive per frame.
    """

    output_size = output_size or layer.size
    work_width = min(960, layer.width)
    work_height = max(1, round(layer.height * work_width / max(1, layer.width)))
    work = layer.resize((work_width, work_height), Image.Resampling.LANCZOS)
    alpha = np.asarray(work.getchannel("A"), dtype=np.uint8)
    foreground = alpha >= 18
    if not foreground.any():
        empty = Image.new("I", output_size, TRACE_BACKGROUND)
        return TracePlan(empty, [(output_size[0] // 2, output_size[1] // 2)] * TRACE_CURSOR_SAMPLES)

    skeleton = _thin_binary(foreground)
    sequence = _trace_skeleton(skeleton)
    if not sequence:
        sequence = [(int(y), int(x)) for y, x in np.argwhere(foreground)]

    seed_order = np.full(foreground.shape, np.uint16(TRACE_BACKGROUND), dtype=np.uint16)
    sequence_length = max(1, len(sequence) - 1)
    for index, (y, x) in enumerate(sequence):
        seed_order[y, x] = min(seed_order[y, x], 1 + round(index / sequence_length * (TRACE_LEVELS - 96)))
    order = _grow_trace_order(foreground, seed_order)
    order_image = Image.fromarray(order).convert("I").resize(output_size, Image.Resampling.NEAREST)
    positions = _resample_cursor_path(sequence, (work_width, work_height), output_size)
    return TracePlan(order_image, positions)


def trace_reveal_mask(plan: TracePlan, progress: float) -> Image.Image:
    progress = clamp(progress)
    threshold = round(progress * TRACE_LEVELS)
    feather = 32
    lut: list[int] = []
    for value in range(TRACE_BACKGROUND + 1):
        if value == TRACE_BACKGROUND or value > threshold:
            lut.append(0)
        elif value <= threshold - feather:
            lut.append(255)
        else:
            lut.append(round((threshold - value + 1) / (feather + 1) * 255))
    return plan.order_map.point(lut, mode="L")


def apply_visibility(
    layer: Image.Image,
    element: dict[str, Any],
    progress: float,
    active: dict[str, Any] | None,
    trace_plan: TracePlan | None = None,
) -> Image.Image:
    animation = (active or {}).get("animation")
    if not animation:
        entrances = [event for event in element.get("events", []) if event.get("action") in {"draw", "replace"}]
        animation = entrances[-1].get("animation", "left-to-right") if entrances else "fade"
    mask_animation = animation
    if active and active.get("action") == "erase":
        mask_animation = {
            "eraser-wipe": "right-to-left",
            "left-to-right": "right-to-left",
            "right-to-left": "left-to-right",
            "top-to-bottom": "bottom-to-top",
            "bottom-to-top": "top-to-bottom",
        }.get(animation, "right-to-left")
    if animation == "line-trace" and trace_plan is not None:
        mask = trace_reveal_mask(trace_plan, progress)
    else:
        mask = reveal_mask(layer.size, element["region"], progress, mask_animation)
    alpha = ImageChops.multiply(layer.getchannel("A"), mask)
    shown = layer.copy()
    shown.putalpha(alpha)
    if animation == "slide-up" and active:
        shift = round((1.0 - progress) * normalized_box(element["region"], layer.size)[3] * 0.18)
        moved = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        moved.alpha_composite(shown, (0, shift))
        shown = moved
    return shown


def cursor_position(element: dict[str, Any], progress: float, animation: str, size: tuple[int, int]) -> tuple[int, int]:
    x, y, width, height = normalized_box(element["region"], size)
    if animation in {"top-to-bottom", "marker-wipe", "line-by-line"}:
        return x + round(width * (0.25 + 0.5 * math.sin(progress * math.pi))), y + round(height * progress)
    if animation == "bottom-to-top":
        return x + width // 2, y + round(height * (1 - progress))
    if animation == "right-to-left":
        return x + round(width * (1 - progress)), y + height // 2
    return x + round(width * progress), y + height // 2


def load_hand(path: Path, output_height: int) -> Image.Image | None:
    if not path.exists():
        return None
    hand = Image.open(path).convert("RGBA")
    alpha = hand.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        hand = hand.crop(bbox)
    target_height = max(48, round(output_height * 0.20))
    scale = target_height / hand.height
    return hand.resize((max(1, round(hand.width * scale)), target_height), Image.Resampling.LANCZOS)


@dataclass
class PreparedScene:
    scene: dict[str, Any]
    project: dict[str, Any]
    size: tuple[int, int]
    theme: dict[str, Any]
    background: Image.Image
    layers: dict[str, Image.Image]
    trace_plans: dict[str, TracePlan]
    marker_hand: Image.Image | None
    eraser_hand: Image.Image | None


def _trace_cache_plan(
    scene_path: Path,
    source_path: Path,
    element: dict[str, Any],
    layer: Image.Image,
) -> TracePlan:
    fingerprint_base = hashlib.sha256()
    fingerprint_base.update(b"achmage-line-trace-v3\0")
    fingerprint_base.update(source_path.read_bytes())
    fingerprint_base.update(json.dumps({"id": element.get("id"), "region": element.get("region")}, sort_keys=True).encode("utf-8"))
    safe_id = re.sub(r"[^A-Za-z0-9_.-]+", "-", str(element.get("id", "art"))).strip("-") or "art"
    cache_dir = scene_path.parent / ".trace-cache"

    def cache_paths(size: tuple[int, int]) -> tuple[Path, Path]:
        fingerprint = fingerprint_base.copy()
        fingerprint.update(f"{size[0]}x{size[1]}".encode("ascii"))
        cache_key = fingerprint.hexdigest()[:20]
        return cache_dir / f"{safe_id}-{cache_key}.png", cache_dir / f"{safe_id}-{cache_key}.json"

    def load_cached(map_file: Path, metadata_file: Path) -> tuple[TracePlan, dict[str, Any]] | None:
        if not map_file.exists() or not metadata_file.exists():
            return None
        metadata = load_json(metadata_file)
        positions = [tuple(map(int, point)) for point in metadata.get("cursorPositions", [])]
        if len(positions) != TRACE_CURSOR_SAMPLES:
            return None
        with Image.open(map_file) as opened:
            return TracePlan(opened.convert("I"), positions), metadata

    def scale_plan(plan: TracePlan, source_size: tuple[int, int], target_size: tuple[int, int]) -> TracePlan:
        if source_size == target_size:
            return plan
        source_width, source_height = source_size
        target_width, target_height = target_size
        positions = [
            (
                round(x / max(1, source_width - 1) * (target_width - 1)),
                round(y / max(1, source_height - 1) * (target_height - 1)),
            )
            for x, y in plan.cursor_positions
        ]
        return TracePlan(plan.order_map.resize(target_size, Image.Resampling.NEAREST), positions)

    target_size = layer.size
    map_path, metadata_path = cache_paths(target_size)
    cached = load_cached(map_path, metadata_path)
    if cached:
        return cached[0]

    canonical_width = min(960, layer.width)
    canonical_size = (canonical_width, max(1, round(layer.height * canonical_width / max(1, layer.width))))
    canonical_map, canonical_metadata = cache_paths(canonical_size)
    canonical_cached = load_cached(canonical_map, canonical_metadata)
    if canonical_cached and canonical_size != target_size:
        plan = scale_plan(canonical_cached[0], canonical_size, target_size)
    else:
        plan = build_trace_plan(layer, canonical_size)
        if canonical_size != target_size:
            canonical_plan = plan
            cache_dir.mkdir(parents=True, exist_ok=True)
            canonical_plan.order_map.save(canonical_map, optimize=True)
            save_json(
                canonical_metadata,
                {
                    "version": 3,
                    "elementId": element.get("id"),
                    "outputWidth": canonical_size[0],
                    "outputHeight": canonical_size[1],
                    "cursorPositions": canonical_plan.cursor_positions,
                },
            )
            plan = scale_plan(canonical_plan, canonical_size, target_size)
    cache_dir.mkdir(parents=True, exist_ok=True)
    plan.order_map.save(map_path, optimize=True)
    save_json(
        metadata_path,
        {
            "version": 3,
            "elementId": element.get("id"),
            "outputWidth": layer.width,
            "outputHeight": layer.height,
            "cursorPositions": plan.cursor_positions,
        },
    )
    return plan


def trace_cursor_position(plan: TracePlan, progress: float) -> tuple[int, int]:
    if not plan.cursor_positions:
        return plan.order_map.width // 2, plan.order_map.height // 2
    cursor = clamp(progress) * (len(plan.cursor_positions) - 1)
    low = int(math.floor(cursor))
    high = min(len(plan.cursor_positions) - 1, low + 1)
    blend = cursor - low
    x1, y1 = plan.cursor_positions[low]
    x2, y2 = plan.cursor_positions[high]
    return round(x1 + (x2 - x1) * blend), round(y1 + (y2 - y1) * blend)


def prepare_scene(
    scene_path: Path,
    size: tuple[int, int],
    require_source: bool = True,
    scene_override: dict[str, Any] | None = None,
) -> PreparedScene:
    scene = copy.deepcopy(scene_override) if scene_override is not None else load_json(scene_path)
    project_path = scene_path.parents[2] / "project.json"
    project = load_json(project_path) if project_path.exists() else {}
    errors = validate_scene(scene, scene_path, require_source=require_source)
    if errors:
        raise ValueError("장면 검증 실패:\n- " + "\n- ".join(errors))
    source_path = scene_path.parent / scene.get("source", {}).get("file", "base-art.png")
    source = None
    if source_path.exists():
        with Image.open(source_path) as opened:
            source = opened.convert("RGBA")
    theme = resolve_theme(scene, project)
    layers = {element["id"]: element_layer(size, element, source, theme) for element in scene.get("elements", [])}
    trace_plans: dict[str, TracePlan] = {}
    if source_path.exists():
        for element in scene.get("elements", []):
            if element.get("kind") != "art":
                continue
            if any(event.get("animation") == "line-trace" for event in element.get("events", [])):
                trace_plans[element["id"]] = _trace_cache_plan(scene_path, source_path, element, layers[element["id"]])
    return PreparedScene(
        scene=scene,
        project=project,
        size=size,
        theme=theme,
        background=paper_canvas(size, theme),
        layers=layers,
        trace_plans=trace_plans,
        marker_hand=load_hand(MARKER_HAND_PATH, size[1]),
        eraser_hand=load_hand(ERASER_HAND_PATH, size[1]),
    )


def render_frame(prepared: PreparedScene, time_ms: float, show_cursor: bool = True) -> Image.Image:
    frame = prepared.background.copy()
    cursor: tuple[Image.Image, tuple[int, int]] | None = None
    for element in sorted(prepared.scene.get("elements", []), key=lambda item: int(item.get("zIndex", 0))):
        progress, active = element_visibility(element, time_ms, prepared.scene)
        if progress <= 0:
            continue
        trace_plan = prepared.trace_plans.get(element["id"])
        shown = apply_visibility(prepared.layers[element["id"]], element, progress, active, trace_plan)
        frame = Image.alpha_composite(frame, shown)
        if not show_cursor or not active:
            continue
        action = active.get("action")
        animation = active.get("animation", "left-to-right")
        event_p = event_progress(active, time_ms)
        if animation == "line-trace" and trace_plan is not None:
            trace_progress = 1.0 - event_p if action == "erase" else event_p
            pos = trace_cursor_position(trace_plan, trace_progress)
        else:
            pos = cursor_position(element, event_p, animation, prepared.size)
        if action == "erase" and prepared.eraser_hand:
            cursor = (prepared.eraser_hand, pos)
        elif action == "draw" and element.get("kind") == "art" and prepared.marker_hand:
            cursor = (prepared.marker_hand, pos)
    if cursor:
        hand, (x, y) = cursor
        # 마커 끝이나 지우개 앞부분이 진행 경계에 닿도록 배치한다.
        px = max(-hand.width + 1, min(frame.width - 1, x - round(hand.width * 0.12)))
        py = max(-hand.height + 1, min(frame.height - 1, y - round(hand.height * 0.18)))
        frame.alpha_composite(hand, (px, py))
    return frame


def update_source_metadata(scene_path: Path, image: Image.Image) -> dict[str, Any]:
    scene = load_json(scene_path)
    scene.setdefault("source", {})["nativeWidth"] = image.width
    scene["source"]["nativeHeight"] = image.height
    scene["source"]["status"] = "ready"
    save_json(scene_path, scene)
    return scene


def compose_reference(scene_path: Path) -> Path:
    scene = load_json(scene_path)
    source_path = scene_path.parent / scene.get("source", {}).get("file", "base-art.png")
    if not source_path.exists():
        raise FileNotFoundError(f"원본 이미지가 없습니다: {source_path}")
    with Image.open(source_path) as source:
        native_size = source.size
        update_source_metadata(scene_path, source)
    prepared = prepare_scene(scene_path, native_size, require_source=True)
    output = scene_path.parent / "final-reference.png"
    render_frame(prepared, prepared.scene.get("durationMs", 8000) - 1, show_cursor=False).convert("RGB").save(output, quality=96)
    return output


def ffmpeg_executable() -> str:
    system = shutil.which("ffmpeg")
    if system:
        return system
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as exc:  # pragma: no cover - 진단 메시지를 위한 방어 경로
        raise RuntimeError("FFmpeg를 찾지 못했습니다. setup 스크립트를 먼저 실행하세요.") from exc


def alignment_phrase_start_ms(alignment: dict[str, Any] | None, phrase: str) -> int | None:
    if not alignment or not phrase:
        return None
    characters = alignment.get("characters", [])
    starts = alignment.get("characterStartTimesSeconds", [])
    if isinstance(characters, str):
        text = characters
    elif isinstance(characters, list):
        text = "".join(str(char) for char in characters)
    else:
        return None
    if not isinstance(starts, list):
        return None
    index = text.find(phrase)
    if index < 0 or index >= len(starts):
        return None
    try:
        return max(0, round(float(starts[index]) * 1000))
    except (TypeError, ValueError):
        return None


def retime_scene_for_voiceover(
    scene: dict[str, Any],
    audio_duration_ms: int,
    fps: int,
    lead_in_ms: int = 1250,
    lead_out_ms: int = 1750,
    alignment: dict[str, Any] | None = None,
) -> tuple[dict[str, Any], int]:
    if audio_duration_ms <= 0:
        raise ValueError("음성 길이는 0보다 커야 합니다.")
    if fps <= 0:
        raise ValueError("fps는 0보다 커야 합니다.")
    authored = copy.deepcopy(scene)
    base_duration = int(authored.get("durationMs", 8000))
    minimum_ms = max(1, base_duration)
    requested_ms = max(minimum_ms, lead_in_ms + audio_duration_ms + lead_out_ms)
    frame_count = max(1, math.ceil(requested_ms * fps / 1000.0))
    resolved_ms = round(frame_count * 1000.0 / fps)
    speech_end = lead_in_ms + audio_duration_ms
    authored_reveal_end = min(5200, base_duration)
    reveal_end = min(speech_end, max(lead_in_ms + 1000, lead_in_ms + round(audio_duration_ms * 0.75)))
    reveal_end = min(reveal_end, max(1, resolved_ms - lead_out_ms))

    def map_time(value: int) -> int:
        value = max(0, min(base_duration, int(value)))
        if base_duration <= authored_reveal_end or value <= authored_reveal_end:
            denominator = max(1, authored_reveal_end)
            return round(value / denominator * reveal_end)
        denominator = max(1, base_duration - authored_reveal_end)
        return round(reveal_end + (value - authored_reveal_end) / denominator * (resolved_ms - reveal_end))

    for element in authored.get("elements", []):
        for event in element.get("events", []):
            original_start = int(event.get("startMs", 0))
            original_duration = int(event.get("durationMs", 0))
            sync = event.get("syncTo")
            phrase = sync.get("text") if isinstance(sync, dict) else sync if isinstance(sync, str) else ""
            synced = alignment_phrase_start_ms(alignment, str(phrase)) if phrase else None
            if synced is not None:
                offset = int(sync.get("offsetMs", 0)) if isinstance(sync, dict) else 0
                new_start = max(0, min(resolved_ms, lead_in_ms + synced + offset))
                new_end = min(resolved_ms, new_start + max(1, map_time(original_start + original_duration) - map_time(original_start)))
            else:
                new_start = map_time(original_start)
                new_end = map_time(original_start + original_duration)
            if event.get("action") == "hold":
                new_end = resolved_ms
            event["startMs"] = max(0, min(resolved_ms, int(new_start)))
            event["durationMs"] = max(0, min(resolved_ms - event["startMs"], int(new_end - new_start)))
    authored["durationMs"] = resolved_ms
    authored["resolvedTiming"] = {
        "mode": "voice-plus-padding",
        "baseDurationMs": base_duration,
        "audioDurationMs": audio_duration_ms,
        "leadInMs": lead_in_ms,
        "leadOutMs": lead_out_ms,
        "renderDurationMs": resolved_ms,
        "frameCount": frame_count,
        "fps": fps,
    }
    return authored, frame_count


def render_video(
    scene_path: Path,
    output: Path,
    profile_name: str = "preview",
    voice_timing: dict[str, Any] | None = None,
    scene_override: dict[str, Any] | None = None,
) -> Path:
    scene = copy.deepcopy(scene_override) if scene_override is not None else load_json(scene_path)
    project_path = scene_path.parents[2] / "project.json"
    project = load_json(project_path) if project_path.exists() else {}
    key = "masterProfile" if profile_name == "master" else "previewProfile"
    fallback = {"width": 3840, "height": 2160, "fps": 60, "crf": 17} if profile_name == "master" else {"width": 960, "height": 540, "fps": 30, "crf": 24}
    profile = {**fallback, **project.get(key, {})}
    size = (int(profile["width"]), int(profile["height"]))
    fps = int(profile["fps"])
    crf = int(profile["crf"])
    render_scene = scene
    if voice_timing:
        render_scene, frame_count = retime_scene_for_voiceover(
            scene,
            int(voice_timing["audioDurationMs"]),
            fps,
            int(voice_timing.get("leadInMs", 1250)),
            int(voice_timing.get("leadOutMs", 1750)),
            voice_timing.get("alignment"),
        )
    else:
        duration_ms = int(scene.get("durationMs", 8000))
        frame_count = round(duration_ms * fps / 1000)
    prepared = prepare_scene(scene_path, size, require_source=True, scene_override=render_scene)
    output.parent.mkdir(parents=True, exist_ok=True)
    command = [
        ffmpeg_executable(),
        "-y",
        "-loglevel",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{size[0]}x{size[1]}",
        "-r",
        str(fps),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "medium" if profile_name == "master" else "veryfast",
        "-profile:v",
        "high",
        "-crf",
        str(crf),
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(output),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    assert process.stdin is not None
    try:
        for frame_index in range(frame_count):
            time_ms = frame_index * 1000.0 / fps
            frame = render_frame(prepared, time_ms, show_cursor=True).convert("RGB")
            process.stdin.write(frame.tobytes())
        process.stdin.close()
        stderr = process.stderr.read().decode("utf-8", errors="replace") if process.stderr else ""
        if process.stderr:
            process.stderr.close()
        return_code = process.wait()
    except Exception:
        process.kill()
        raise
    if return_code != 0:
        raise RuntimeError(f"FFmpeg 렌더 실패: {stderr.strip()}")
    return output


def merge_videos(inputs: list[Path], output: Path, reencode: bool = False) -> Path:
    if not inputs:
        raise ValueError("병합할 영상이 없습니다.")
    missing = [path for path in inputs if not path.exists()]
    if missing:
        raise FileNotFoundError("입력 영상이 없습니다: " + ", ".join(str(path) for path in missing))
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8") as handle:
        for path in inputs:
            safe = path.resolve().as_posix().replace("'", "'\\''")
            handle.write(f"file '{safe}'\n")
        list_path = Path(handle.name)
    try:
        command = [ffmpeg_executable(), "-y", "-loglevel", "error", "-fflags", "+genpts", "-f", "concat", "-safe", "0", "-i", str(list_path)]
        if reencode:
            has_audio = inspect_video(inputs[0]).get("hasAudio", False)
            command += ["-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p"]
            if has_audio:
                command += ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]
            else:
                command += ["-an"]
            command += ["-avoid_negative_ts", "make_zero", "-movflags", "+faststart"]
        else:
            command += ["-c", "copy", "-avoid_negative_ts", "make_zero"]
        command.append(str(output))
        result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if result.returncode != 0 and not reencode:
            return merge_videos(inputs, output, reencode=True)
        if result.returncode != 0:
            raise RuntimeError(f"영상 병합 실패: {result.stderr.strip()}")
    finally:
        list_path.unlink(missing_ok=True)
    return output


def inspect_video(path: Path) -> dict[str, Any]:
    result = subprocess.run([ffmpeg_executable(), "-hide_banner", "-i", str(path), "-map", "0:v:0", "-f", "null", "-"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    text = result.stderr
    resolution = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", text)
    fps_match = re.search(r"(\d+(?:\.\d+)?) fps", text)
    duration = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", text)
    frames = re.findall(r"frame=\s*(\d+)", text)
    codec = re.search(r"Video:\s*([A-Za-z0-9_]+)", text)
    profile = re.search(r"Video:\s*[A-Za-z0-9_]+\s*\(([^)]+)\)", text)
    pixel_format = re.search(r"Video:.*?,\s*(yuv[a-zA-Z0-9]+|rgb[a-zA-Z0-9]+|gbrp[a-zA-Z0-9]+)", text)
    duration_seconds = None
    if duration:
        duration_seconds = int(duration.group(1)) * 3600 + int(duration.group(2)) * 60 + float(duration.group(3))
    audio_codec = re.search(r"Audio:\s*([A-Za-z0-9_]+)", text)
    audio_rate = re.search(r"Audio:.*?,\s*(\d+) Hz", text)
    audio_channels = re.search(r"Audio:.*?,\s*(mono|stereo|\d+\.\d+)", text)
    return {
        "path": str(path.resolve()),
        "width": int(resolution.group(1)) if resolution else None,
        "height": int(resolution.group(2)) if resolution else None,
        "fps": float(fps_match.group(1)) if fps_match else None,
        "durationSeconds": duration_seconds,
        "frames": int(frames[-1]) if frames else None,
        "codec": codec.group(1) if codec else None,
        "profile": profile.group(1) if profile else None,
        "pixelFormat": pixel_format.group(1) if pixel_format else None,
        "hasAudio": "Audio:" in text,
        "audioCodec": audio_codec.group(1) if audio_codec else None,
        "audioSampleRate": int(audio_rate.group(1)) if audio_rate else None,
        "audioChannels": audio_channels.group(1) if audio_channels else None,
    }


def inspect_audio(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"오디오 파일이 없습니다: {path}")
    result = subprocess.run(
        [ffmpeg_executable(), "-hide_banner", "-i", str(path), "-map", "0:a:0", "-f", "null", "-"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    text = result.stderr
    duration = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", text)
    codec = re.search(r"Audio:\s*([A-Za-z0-9_]+)", text)
    rate = re.search(r"Audio:.*?,\s*(\d+) Hz", text)
    channels = re.search(r"Audio:.*?,\s*(mono|stereo|\d+\.\d+)", text)
    duration_seconds = None
    if duration:
        duration_seconds = int(duration.group(1)) * 3600 + int(duration.group(2)) * 60 + float(duration.group(3))
    return {
        "path": str(path.resolve()),
        "durationSeconds": duration_seconds,
        "durationMs": round(duration_seconds * 1000) if duration_seconds is not None else None,
        "codec": codec.group(1) if codec else None,
        "sampleRate": int(rate.group(1)) if rate else None,
        "channels": channels.group(1) if channels else None,
    }


def _loudnorm_measurements(audio_path: Path, target_lufs: float, true_peak: float, loudness_range: float) -> dict[str, float]:
    filter_value = f"loudnorm=I={target_lufs}:TP={true_peak}:LRA={loudness_range}:print_format=json"
    result = subprocess.run(
        [ffmpeg_executable(), "-hide_banner", "-nostats", "-i", str(audio_path), "-af", filter_value, "-f", "null", "-"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    match = re.search(r'\{\s*"input_i"[\s\S]*?\}', result.stderr)
    if result.returncode != 0 or not match:
        raise RuntimeError(f"오디오 음량 분석 실패: {result.stderr.strip()}")
    raw = json.loads(match.group(0))
    try:
        return {
            "input_i": float(raw["input_i"]),
            "input_tp": float(raw["input_tp"]),
            "input_lra": float(raw["input_lra"]),
            "input_thresh": float(raw["input_thresh"]),
            "target_offset": float(raw["target_offset"]),
        }
    except (KeyError, TypeError, ValueError) as exc:
        raise RuntimeError("FFmpeg 음량 분석 결과를 읽지 못했습니다.") from exc


def mux_voiceover(
    silent_video: Path,
    audio_path: Path,
    output: Path,
    lead_in_ms: int = 1250,
    target_lufs: float = -16.0,
    true_peak: float = -1.5,
    loudness_range: float = 11.0,
) -> Path:
    video_info = inspect_video(silent_video)
    duration = video_info.get("durationSeconds")
    if not duration:
        raise RuntimeError("무음 영상 길이를 확인하지 못했습니다.")
    measured = _loudnorm_measurements(audio_path, target_lufs, true_peak, loudness_range)
    loudnorm = (
        f"loudnorm=I={target_lufs}:TP={true_peak}:LRA={loudness_range}:"
        f"measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
        f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
        f"offset={measured['target_offset']}:linear=true:print_format=summary"
    )
    audio_filter = f"{loudnorm},adelay={max(0, lead_in_ms)}:all=1,apad,atrim=duration={float(duration):.6f},asetpts=N/SR/TB"
    output.parent.mkdir(parents=True, exist_ok=True)
    command = [
        ffmpeg_executable(),
        "-y",
        "-loglevel",
        "error",
        "-i",
        str(silent_video),
        "-i",
        str(audio_path),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c:v",
        "copy",
        "-af",
        audio_filter,
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-ar",
        "48000",
        "-ac",
        "2",
        "-t",
        f"{float(duration):.6f}",
        "-avoid_negative_ts",
        "make_zero",
        "-movflags",
        "+faststart",
        str(output),
    ]
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if result.returncode != 0:
        raise RuntimeError(f"영상과 음성 결합 실패: {result.stderr.strip()}")
    return output


def timestamps_are_monotonic(path: Path) -> dict[str, Any]:
    video_command = [
        ffmpeg_executable(),
        "-hide_banner",
        "-i",
        str(path),
        "-map",
        "0:v:0",
        "-an",
        "-vf",
        "showinfo",
        "-f",
        "null",
        "-",
    ]
    # Isolate stream logs so asynchronous FFmpeg stderr messages cannot look out of order.
    video_result = subprocess.run(video_command, capture_output=True, text=True, encoding="utf-8", errors="replace")
    video_pts = [float(value) for value in re.findall(r"Parsed_showinfo_\d+.*?pts_time:\s*([-\d.]+)", video_result.stderr)]
    has_audio = bool(inspect_video(path).get("hasAudio"))
    audio_pts: list[float] = []
    if has_audio:
        audio_command = [
            ffmpeg_executable(),
            "-hide_banner",
            "-i",
            str(path),
            "-map",
            "0:a:0",
            "-vn",
            "-af",
            "ashowinfo",
            "-f",
            "null",
            "-",
        ]
        audio_result = subprocess.run(audio_command, capture_output=True, text=True, encoding="utf-8", errors="replace")
        audio_pts = [float(value) for value in re.findall(r"Parsed_ashowinfo_\d+.*?pts_time:\s*([-\d.]+)", audio_result.stderr)]
    monotonic = lambda values: all(right >= left for left, right in zip(values, values[1:]))
    return {
        "videoPtsMonotonic": bool(video_pts) and monotonic(video_pts),
        "audioPtsMonotonic": (not has_audio) or (bool(audio_pts) and monotonic(audio_pts)),
        "videoSamples": len(video_pts),
        "audioSamples": len(audio_pts),
    }


def make_contact_sheet(project_dir: Path, columns: int = 6) -> Path:
    scene_paths = project_scene_paths(project_dir)
    images: list[tuple[str, Image.Image]] = []
    for scene_path in scene_paths:
        image_path = scene_path.parent / "final-reference.png"
        if image_path.exists():
            images.append((scene_path.parent.name, Image.open(image_path).convert("RGB")))
    if not images:
        raise FileNotFoundError("콘택트시트에 넣을 final-reference.png가 없습니다.")
    thumb_size = (480, 270)
    label_height = 42
    rows = math.ceil(len(images) / columns)
    sheet = Image.new("RGB", (thumb_size[0] * columns, (thumb_size[1] + label_height) * rows), "white")
    draw = ImageDraw.Draw(sheet)
    font = font_for(24, 700)
    for index, (label, image) in enumerate(images):
        col, row = index % columns, index // columns
        x, y = col * thumb_size[0], row * (thumb_size[1] + label_height)
        sheet.paste(fit_cover(image, thumb_size), (x, y))
        draw.rectangle((x, y + thumb_size[1], x + thumb_size[0], y + thumb_size[1] + label_height), fill="#101827")
        draw.text((x + 12, y + thumb_size[1] + 7), label, font=font, fill="white")
    output = project_dir / "contact-sheet.png"
    sheet.save(output, quality=94)
    return output


def project_report(project_dir: Path) -> dict[str, Any]:
    project = load_json(project_dir / "project.json")
    scenes: list[dict[str, Any]] = []
    for entry in project.get("scenes", []):
        scene_path = project_dir / entry["path"]
        scene_dir = scene_path.parent
        source = scene_dir / "base-art.png"
        reference = scene_dir / "final-reference.png"
        preview = project_dir / "previews" / f"{scene_dir.name}.mp4"
        master = project_dir / "renders" / f"{scene_dir.name}.mp4"
        status = "pending"
        if source.exists():
            status = "image-ready"
        if reference.exists():
            status = "composed"
        if preview.exists():
            status = "preview-ready"
        if master.exists():
            status = "master-ready"
        scenes.append({"number": entry.get("number"), "sceneId": entry.get("sceneId"), "anchor": bool(entry.get("anchor")), "status": status, "source": source.exists(), "reference": reference.exists(), "preview": preview.exists(), "master": master.exists()})
    counts: dict[str, int] = {}
    for scene in scenes:
        counts[scene["status"]] = counts.get(scene["status"], 0) + 1
    report = {"projectId": project.get("projectId"), "anchorStatus": project.get("anchorStatus"), "sceneCount": len(scenes), "counts": counts, "scenes": scenes, "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z")}
    save_json(project_dir / "render-report.json", report)
    return report


class PreviewHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:
        sys.stderr.write("미리보기: " + (format % args) + "\n")


def serve_preview(project_dir: Path, port: int = 8765, open_browser: bool = True) -> None:
    if not (PREVIEW_ROOT / "index.html").exists():
        raise FileNotFoundError("미리보기 편집기 파일이 없습니다.")
    handler = lambda *args, **kwargs: PreviewHandler(*args, directory=str(PREVIEW_ROOT), **kwargs)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    url = f"http://127.0.0.1:{port}/?project={project_dir.resolve().as_posix()}"
    print(f"미리보기 편집기: {url}")
    print("종료하려면 Ctrl+C를 누르세요.")
    if open_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("미리보기 서버를 종료합니다.")
    finally:
        server.server_close()


def doctor() -> dict[str, Any]:
    checks = {
        "python": platform.python_version(),
        "platform": platform.platform(),
        "utf8Mode": sys.flags.utf8_mode,
        "font": FONT_PATH.exists(),
        "markerHand": MARKER_HAND_PATH.exists(),
        "eraserHand": ERASER_HAND_PATH.exists(),
        "preview": (PREVIEW_ROOT / "index.html").exists(),
        "ffmpeg": None,
    }
    try:
        checks["ffmpeg"] = ffmpeg_executable()
    except RuntimeError:
        checks["ffmpeg"] = None
    return checks


configure_utf8()
