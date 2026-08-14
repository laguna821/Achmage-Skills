from __future__ import annotations

import base64
import hashlib
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ELEVENLABS_API_ROOT = "https://api.elevenlabs.io"
TYPECAST_API_ROOT = "https://api.typecast.ai"
DEFAULT_AUDITION_TEXT = "차분하게 설명드리겠습니다. 취재 데이터는 다음 질문을 만들고, 검증 가능한 기록은 더 좋은 보도를 만듭니다."


class TTSRequestError(RuntimeError):
    def __init__(self, message: str, status_code: int | None = None, ambiguous: bool = False):
        super().__init__(message)
        self.status_code = status_code
        self.ambiguous = ambiguous


@dataclass(frozen=True)
class SubscriptionInfo:
    tier: str
    used_credits: int | None
    credit_limit: int | None
    raw: dict[str, Any]

    @property
    def remaining_credits(self) -> int | None:
        if self.used_credits is None or self.credit_limit is None:
            return None
        return max(0, self.credit_limit - self.used_credits)


@dataclass(frozen=True)
class VoiceCandidate:
    voice_id: str
    name: str
    score: int
    labels: dict[str, Any]
    preview_url: str | None = None


@dataclass(frozen=True)
class SynthesisResult:
    audio_bytes: bytes
    extension: str
    alignment: dict[str, Any]
    request_id: str | None
    actual_credits: int | None
    raw_metadata: dict[str, Any]


def read_json(path: Path, fallback: Any = None) -> Any:
    if not path.exists():
        return fallback
    return json.loads(path.read_text(encoding="utf-8-sig"))


def atomic_write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".{uuid.uuid4().hex}.tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def atomic_write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".{uuid.uuid4().hex}.tmp")
    temporary.write_bytes(data)
    temporary.replace(path)


def _request_json(
    method: str,
    url: str,
    headers: dict[str, str],
    payload: dict[str, Any] | None = None,
    timeout_seconds: int = 90,
) -> tuple[dict[str, Any], dict[str, str]]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8") if payload is not None else None
    request_headers = {"Accept": "application/json", **headers}
    if payload is not None:
        request_headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=body, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=timeout_seconds) as response:
            response_body = response.read()
            response_headers = {key.lower(): value for key, value in response.headers.items()}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        labels = {
            401: "API 키가 올바르지 않거나 권한이 없습니다.",
            402: "TTS 크레딧이 부족하거나 현재 요금제에서 이 음성을 사용할 수 없습니다.",
            403: "이 계정 또는 API 키로 해당 기능을 사용할 수 없습니다.",
            404: "요청한 화자 또는 API 자원을 찾지 못했습니다.",
            422: "TTS 요청 값이 유효하지 않습니다.",
            429: "TTS 요청 한도에 도달했습니다. 자동 재시도하지 않았습니다.",
        }
        message = labels.get(exc.code, f"TTS API 요청이 실패했습니다. HTTP {exc.code}")
        ambiguous = exc.code >= 500
        if ambiguous:
            message += " 중복 과금을 막기 위해 자동 재시도하지 않았습니다."
        raise TTSRequestError(f"{message} {detail[:500]}", exc.code, ambiguous) from exc
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise TTSRequestError(
            "TTS API 응답을 확인하지 못했습니다. 요청이 처리됐을 가능성이 있어 자동 재시도하지 않습니다.",
            ambiguous=True,
        ) from exc
    try:
        return json.loads(response_body.decode("utf-8")), response_headers
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise TTSRequestError("TTS API의 JSON 응답을 읽지 못했습니다.", ambiguous=method.upper() == "POST") from exc


def _find_numeric(data: Any, names: tuple[str, ...]) -> int | None:
    if isinstance(data, dict):
        for name in names:
            value = data.get(name)
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                return int(value)
        for value in data.values():
            found = _find_numeric(value, names)
            if found is not None:
                return found
    if isinstance(data, list):
        for value in data:
            found = _find_numeric(value, names)
            if found is not None:
                return found
    return None


def _subscription_from_payload(payload: dict[str, Any]) -> SubscriptionInfo:
    tier = str(payload.get("tier") or payload.get("plan") or payload.get("plan_name") or "unknown")
    used = _find_numeric(payload, ("character_count", "credits_used", "used_credits", "credit_used", "usage"))
    limit = _find_numeric(payload, ("character_limit", "credit_limit", "credits_limit", "monthly_credits", "plan_credits", "credits"))
    return SubscriptionInfo(tier=tier, used_credits=used, credit_limit=limit, raw=payload)


def normalize_alignment(payload: dict[str, Any]) -> dict[str, Any]:
    # ElevenLabs의 normalized_alignment는 한국어를 로마자로 바꿀 수 있다.
    # 화면 자막은 원문 철자와 맞아야 하므로 원본 alignment를 우선한다.
    raw = payload.get("alignment") or payload.get("normalized_alignment") or {}
    if isinstance(raw, dict) and "characters" in raw:
        return {
            "characters": raw.get("characters", []),
            "characterStartTimesSeconds": raw.get("character_start_times_seconds")
            or raw.get("characterStartTimesSeconds")
            or raw.get("start_times_seconds")
            or [],
            "characterEndTimesSeconds": raw.get("character_end_times_seconds")
            or raw.get("characterEndTimesSeconds")
            or raw.get("end_times_seconds")
            or [],
            "words": raw.get("words", payload.get("words", [])),
        }
    characters = payload.get("characters", [])
    if isinstance(characters, list) and characters and isinstance(characters[0], dict):
        return {
            "characters": [item.get("text", item.get("character", "")) for item in characters],
            "characterStartTimesSeconds": [item.get("start_time", item.get("start", 0)) for item in characters],
            "characterEndTimesSeconds": [item.get("end_time", item.get("end", 0)) for item in characters],
            "words": payload.get("words", []),
        }
    return {
        "characters": characters if isinstance(characters, (list, str)) else [],
        "characterStartTimesSeconds": payload.get("character_start_times_seconds", []),
        "characterEndTimesSeconds": payload.get("character_end_times_seconds", []),
        "words": payload.get("words", []),
    }


def _voice_score(raw: dict[str, Any], desired_gender: str = "male") -> VoiceCandidate | None:
    voice_id = str(raw.get("voice_id") or raw.get("voiceId") or raw.get("id") or "").strip()
    if not voice_id:
        return None
    labels = raw.get("labels") if isinstance(raw.get("labels"), dict) else {}
    combined = " ".join(
        str(value)
        for value in [
            raw.get("name"),
            raw.get("voice_name"),
            raw.get("description"),
            raw.get("gender"),
            raw.get("language"),
            raw.get("use_case"),
            *labels.values(),
        ]
        if value is not None
    ).lower()
    score = 0
    gender = str(raw.get("gender") or labels.get("gender") or "").lower()
    if gender == desired_gender or (desired_gender == "male" and "남성" in combined):
        score += 60
    if any(word in combined for word in ("korean", "ko-kr", " kor", "한국", "한국어")):
        score += 45
    if any(word in combined for word in ("narration", "news", "educat", "audiobook", "강의", "뉴스", "내레이션")):
        score += 30
    if any(word in combined for word in ("calm", "professional", "grounded", "clear", "차분", "신뢰")):
        score += 20
    if raw.get("free_users_allowed") is True:
        score += 10
    if str(raw.get("category", "")).lower() == "premade":
        score += 10
    enriched_labels = {
        **labels,
        "gender": raw.get("gender", labels.get("gender")),
        "language": raw.get("language", labels.get("language")),
        "category": raw.get("category", labels.get("category")),
        "voiceType": raw.get("voice_type", raw.get("voiceType", labels.get("voiceType"))),
        "description": raw.get("description", labels.get("description")),
        "useCase": raw.get("use_case", labels.get("use_case")),
        "age": raw.get("age", labels.get("age")),
    }
    return VoiceCandidate(
        voice_id=voice_id,
        name=str(raw.get("name") or raw.get("voice_name") or voice_id),
        score=score,
        labels={key: value for key, value in enriched_labels.items() if value is not None},
        preview_url=raw.get("preview_url") or raw.get("previewUrl"),
    )


class TTSProvider:
    name = "base"
    env_name = ""
    default_model = ""
    default_extension = "bin"

    def __init__(self, api_key: str | None = None):
        self.api_key = (api_key or os.environ.get(self.env_name, "")).strip()

    def require_key(self) -> str:
        if not self.api_key:
            raise TTSRequestError(f"{self.env_name} 환경변수가 설정되지 않았습니다.")
        return self.api_key

    def estimate_credits(self, text: str, model_id: str | None = None) -> int:
        return len(text)

    def subscription(self) -> SubscriptionInfo:
        raise NotImplementedError

    def list_voices(self, desired_gender: str = "male") -> list[VoiceCandidate]:
        raise NotImplementedError

    def list_models(self) -> list[dict[str, Any]]:
        return [{"modelId": self.default_model, "name": self.default_model}]

    def synthesize(
        self,
        text: str,
        voice_id: str,
        model_id: str,
        settings: dict[str, Any],
        previous_text: str = "",
        next_text: str = "",
    ) -> SynthesisResult:
        raise NotImplementedError


class ElevenLabsProvider(TTSProvider):
    name = "elevenlabs"
    env_name = "ELEVENLABS_API_KEY"
    default_model = "eleven_multilingual_v2"
    default_extension = "mp3"

    @property
    def headers(self) -> dict[str, str]:
        return {"xi-api-key": self.require_key()}

    def subscription(self) -> SubscriptionInfo:
        payload, _ = _request_json("GET", f"{ELEVENLABS_API_ROOT}/v1/user/subscription", self.headers)
        return _subscription_from_payload(payload)

    def list_voices(self, desired_gender: str = "male") -> list[VoiceCandidate]:
        # voice_type을 제한하지 않아 기본·개인·클론·워크스페이스 음성을 모두 찾는다.
        query = urllib.parse.urlencode({"page_size": 100, "include_total_count": "true"})
        payload, _ = _request_json("GET", f"{ELEVENLABS_API_ROOT}/v2/voices?{query}", self.headers)
        candidates = [_voice_score(raw, desired_gender) for raw in payload.get("voices", [])]
        available = [item for item in candidates if item]
        if desired_gender == "any":
            return sorted(available, key=lambda item: (-item.score, item.name.lower()))
        matching_gender = [
            item
            for item in available
            if str(item.labels.get("gender") or "").lower() == desired_gender
            or (desired_gender == "male" and "남성" in str(item.labels.get("gender") or ""))
        ]
        return sorted(matching_gender or available, key=lambda item: (-item.score, item.name.lower()))

    def list_models(self) -> list[dict[str, Any]]:
        payload, _ = _request_json("GET", f"{ELEVENLABS_API_ROOT}/v1/models", self.headers)
        raw_models = payload if isinstance(payload, list) else payload.get("models", [])
        return [
            {
                "modelId": str(item.get("model_id") or item.get("modelId") or ""),
                "name": str(item.get("name") or item.get("model_id") or ""),
                "supportsTts": bool(item.get("can_do_text_to_speech", True)),
            }
            for item in raw_models
            if isinstance(item, dict) and (item.get("model_id") or item.get("modelId")) and item.get("can_do_text_to_speech", True)
        ]

    def synthesize(
        self,
        text: str,
        voice_id: str,
        model_id: str,
        settings: dict[str, Any],
        previous_text: str = "",
        next_text: str = "",
    ) -> SynthesisResult:
        query = urllib.parse.urlencode({"output_format": settings.get("outputFormat", "mp3_44100_128")})
        request_data: dict[str, Any] = {
            "text": text,
            "model_id": model_id,
            "voice_settings": {
                "stability": float(settings.get("stability", 0.65)),
                "similarity_boost": float(settings.get("similarityBoost", 0.8)),
                "style": float(settings.get("style", 0.15)),
                "use_speaker_boost": bool(settings.get("useSpeakerBoost", True)),
                "speed": float(settings.get("speed", 0.95)),
            },
            "apply_text_normalization": "auto",
        }
        if previous_text:
            request_data["previous_text"] = previous_text
        if next_text:
            request_data["next_text"] = next_text
        payload, headers = _request_json(
            "POST",
            f"{ELEVENLABS_API_ROOT}/v1/text-to-speech/{urllib.parse.quote(voice_id)}/with-timestamps?{query}",
            self.headers,
            request_data,
        )
        audio_value = payload.get("audio_base64")
        if not isinstance(audio_value, str) or not audio_value:
            raise TTSRequestError("ElevenLabs 응답에 오디오가 없습니다.", ambiguous=True)
        credit_value = headers.get("character-cost")
        try:
            actual_credits = int(float(credit_value)) if credit_value is not None else None
        except ValueError:
            actual_credits = None
        return SynthesisResult(
            audio_bytes=base64.b64decode(audio_value),
            extension="mp3",
            alignment=normalize_alignment(payload),
            request_id=headers.get("request-id") or headers.get("x-request-id"),
            actual_credits=actual_credits,
            raw_metadata={"responseHeaders": {key: value for key, value in headers.items() if key in {"character-cost", "request-id", "x-request-id", "x-trace-id"}}},
        )


class TypecastProvider(TTSProvider):
    name = "typecast"
    env_name = "TYPECAST_API_KEY"
    default_model = "ssfm-v30"
    default_extension = "wav"

    @property
    def headers(self) -> dict[str, str]:
        return {"X-API-KEY": self.require_key()}

    def subscription(self) -> SubscriptionInfo:
        payload, _ = _request_json("GET", f"{TYPECAST_API_ROOT}/v1/users/me/subscription", self.headers)
        return _subscription_from_payload(payload)

    def list_voices(self, desired_gender: str = "male") -> list[VoiceCandidate]:
        query_values = {"model": self.default_model}
        if desired_gender != "any":
            query_values["gender"] = desired_gender
        query = urllib.parse.urlencode(query_values)
        payload, _ = _request_json("GET", f"{TYPECAST_API_ROOT}/v2/voices?{query}", self.headers)
        raw_voices = payload.get("voices", payload.get("data", payload if isinstance(payload, list) else []))
        candidates = [_voice_score(raw, desired_gender) for raw in raw_voices]
        return sorted((item for item in candidates if item), key=lambda item: (-item.score, item.name.lower()))

    def list_models(self) -> list[dict[str, Any]]:
        return [
            {"modelId": "ssfm-v30", "name": "SSFM v3.0", "supportsTts": True},
            {"modelId": "ssfm-v21", "name": "SSFM v2.1", "supportsTts": True},
        ]

    def synthesize(
        self,
        text: str,
        voice_id: str,
        model_id: str,
        settings: dict[str, Any],
        previous_text: str = "",
        next_text: str = "",
    ) -> SynthesisResult:
        request_data: dict[str, Any] = {
            "text": text,
            "model": model_id,
            "voice_id": voice_id,
            "language": "kor",
            "prompt": {"emotion_type": "smart", "previous_text": previous_text, "next_text": next_text},
            "output": {
                "audio_format": "wav",
                "audio_tempo": float(settings.get("speed", 0.95)),
                "target_lufs": -16,
            },
        }
        payload, headers = _request_json(
            "POST",
            f"{TYPECAST_API_ROOT}/v1/text-to-speech/with-timestamps?granularity=char",
            self.headers,
            request_data,
        )
        audio_value = payload.get("audio_base64") or payload.get("audio") or payload.get("audio_data")
        if not isinstance(audio_value, str) or not audio_value:
            raise TTSRequestError("Typecast 응답에 오디오가 없습니다.", ambiguous=True)
        credit_value = headers.get("character-cost") or headers.get("credit-cost")
        try:
            actual_credits = int(float(credit_value)) if credit_value is not None else None
        except ValueError:
            actual_credits = None
        return SynthesisResult(
            audio_bytes=base64.b64decode(audio_value),
            extension="wav",
            alignment=normalize_alignment(payload),
            request_id=headers.get("request-id") or headers.get("x-request-id"),
            actual_credits=actual_credits,
            raw_metadata={"responseHeaders": {key: value for key, value in headers.items() if key in {"character-cost", "credit-cost", "request-id", "x-request-id"}}},
        )


def get_provider(name: str, api_key: str | None = None) -> TTSProvider:
    normalized = name.strip().lower()
    if normalized == "elevenlabs":
        return ElevenLabsProvider(api_key)
    if normalized == "typecast":
        return TypecastProvider(api_key)
    raise ValueError(f"지원하지 않는 TTS 공급자입니다: {name}")


def resolved_tts_config(project: dict[str, Any], provider_name: str | None = None) -> dict[str, Any]:
    configured = project.get("tts", {}) if isinstance(project.get("tts"), dict) else {}
    configured_provider = str(configured.get("provider") or "elevenlabs").lower()
    provider = (provider_name or configured_provider).lower()
    model = "eleven_multilingual_v2" if provider == "elevenlabs" else "ssfm-v30"
    defaults: dict[str, Any] = {
        "provider": provider,
        "modelId": model,
        "voiceId": None,
        "voiceName": None,
        "leadInMs": 1250,
        "leadOutMs": 1750,
        "minimumSceneMs": 8000,
        "pilotMaxCredits": 1500,
        "productionMaxCredits": 100000,
        "auditionMaxCredits": 120,
        "budgetMode": "pilot",
        "minimumRemainingFraction": 0.75,
        "licenseMode": "private-preview",
        "voiceSettings": {
            "stability": 0.65,
            "similarityBoost": 0.8,
            "style": 0.15,
            "useSpeakerBoost": True,
            "speed": 0.95,
            "outputFormat": "mp3_44100_128" if provider == "elevenlabs" else "wav",
        },
    }
    defaults.update({key: value for key, value in configured.items() if key != "voiceSettings"})
    defaults["provider"] = provider
    defaults["modelId"] = configured.get("modelIdByProvider", {}).get(provider, configured.get("modelId", model))
    per_provider_voice = configured.get("voicesByProvider", {}).get(provider, {})
    if isinstance(per_provider_voice, dict) and per_provider_voice.get("voiceId"):
        defaults["voiceId"] = per_provider_voice.get("voiceId")
        defaults["voiceName"] = per_provider_voice.get("voiceName")
    elif provider != configured_provider:
        defaults["voiceId"] = None
        defaults["voiceName"] = None
    defaults["voiceSettings"] = {**defaults["voiceSettings"], **configured.get("voiceSettings", {})}
    return defaults


def synthesis_fingerprint(
    text: str,
    provider_name: str,
    voice_id: str,
    model_id: str,
    settings: dict[str, Any],
    previous_text: str = "",
    next_text: str = "",
) -> str:
    payload = {
        "text": text,
        "provider": provider_name,
        "voiceId": voice_id,
        "modelId": model_id,
        "settings": settings,
        "previousText": previous_text,
        "nextText": next_text,
    }
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def load_ledger(project_dir: Path) -> dict[str, Any]:
    return read_json(project_dir / "tts-ledger.json", {"schemaVersion": 1, "entries": []})


def save_ledger(project_dir: Path, ledger: dict[str, Any]) -> None:
    atomic_write_json(project_dir / "tts-ledger.json", ledger)


def ledger_reserved_credits(ledger: dict[str, Any]) -> int:
    total = 0
    for entry in ledger.get("entries", []):
        if entry.get("status") in {"cached", "failed"}:
            continue
        value = entry.get("actualCredits")
        if not isinstance(value, int):
            value = entry.get("estimatedCredits", 0)
        if isinstance(value, int):
            total += max(0, value)
    return total


def begin_ledger_entry(project_dir: Path, entry: dict[str, Any]) -> str:
    ledger = load_ledger(project_dir)
    operation_id = uuid.uuid4().hex
    ledger.setdefault("entries", []).append(
        {
            "operationId": operation_id,
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
            "status": "started",
            **entry,
        }
    )
    save_ledger(project_dir, ledger)
    return operation_id


def finish_ledger_entry(project_dir: Path, operation_id: str, **updates: Any) -> None:
    ledger = load_ledger(project_dir)
    for entry in ledger.get("entries", []):
        if entry.get("operationId") == operation_id:
            entry.update(updates)
            entry["finishedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S%z")
            break
    save_ledger(project_dir, ledger)


def assert_budget(
    project_dir: Path,
    config: dict[str, Any],
    subscription: SubscriptionInfo,
    estimated_credits: int,
    confirmed_credits: int,
) -> None:
    if confirmed_credits < estimated_credits:
        raise ValueError(f"예상 소비량 {estimated_credits}크레딧보다 --confirm-spend 값이 작습니다.")
    ledger = load_ledger(project_dir)
    reserved = ledger_reserved_credits(ledger)
    budget_mode = str(config.get("budgetMode", "pilot"))
    configured_maximum = config.get("approvedMaxCredits")
    if configured_maximum is None:
        configured_maximum = config.get("productionMaxCredits", 100000) if budget_mode == "production" else config.get("pilotMaxCredits", 1500)
    maximum = int(configured_maximum)
    if reserved + estimated_credits > maximum:
        raise ValueError(f"프로젝트 누적 상한 {maximum}크레딧을 넘습니다. 현재 예약·소비량: {reserved}")
    if subscription.credit_limit is None or subscription.used_credits is None:
        raise ValueError("계정 크레딧 한도와 사용량을 확인하지 못해 TTS 호출을 중단했습니다.")
    minimum_remaining = int(subscription.credit_limit * float(config.get("minimumRemainingFraction", 0.75)))
    projected_remaining = subscription.credit_limit - subscription.used_credits - estimated_credits
    if projected_remaining < minimum_remaining:
        raise ValueError(
            f"호출 뒤 예상 잔여량 {projected_remaining}이 보호선 {minimum_remaining}보다 작아 TTS 호출을 중단했습니다."
        )


def next_versioned_stem(folder: Path, base_stem: str, force: bool) -> str:
    if not force:
        return base_stem
    version = 2
    candidate = f"{base_stem}-r{version}"
    while any(folder.glob(candidate + ".*")):
        version += 1
        candidate = f"{base_stem}-r{version}"
    return candidate


def synthesize_to_cache(
    project_dir: Path,
    destination_dir: Path,
    text: str,
    provider: TTSProvider,
    config: dict[str, Any],
    voice_id: str,
    kind: str,
    confirmed_credits: int,
    previous_text: str = "",
    next_text: str = "",
    force: bool = False,
) -> dict[str, Any]:
    settings = config.get("voiceSettings", {})
    model_id = str(config.get("modelId") or provider.default_model)
    fingerprint = synthesis_fingerprint(text, provider.name, voice_id, model_id, settings, previous_text, next_text)
    short_hash = fingerprint[:16]
    destination_dir.mkdir(parents=True, exist_ok=True)
    existing = sorted(destination_dir.glob(f"{kind}-{short_hash}*.manifest.json"))
    if existing and not force:
        manifest = read_json(existing[0], {})
        audio_path = destination_dir / manifest.get("audioFile", "")
        if audio_path.exists():
            manifest["cacheHit"] = True
            return manifest
    estimated = provider.estimate_credits(text, model_id)
    before = provider.subscription()
    assert_budget(project_dir, config, before, estimated, confirmed_credits)
    base_stem = next_versioned_stem(destination_dir, f"{kind}-{short_hash}", force)
    operation_id = begin_ledger_entry(
        project_dir,
        {
            "kind": kind,
            "provider": provider.name,
            "fingerprint": fingerprint,
            "estimatedCredits": estimated,
            "textCharacters": len(text),
        },
    )
    try:
        result = provider.synthesize(text, voice_id, model_id, settings, previous_text, next_text)
        audio_path = destination_dir / f"{base_stem}.{result.extension}"
        alignment_path = destination_dir / f"{base_stem}.alignment.json"
        manifest_path = destination_dir / f"{base_stem}.manifest.json"
        atomic_write_bytes(audio_path, result.audio_bytes)
        atomic_write_json(alignment_path, result.alignment)
        after = provider.subscription()
        subscription_delta = None
        if before.used_credits is not None and after.used_credits is not None:
            subscription_delta = max(0, after.used_credits - before.used_credits)
        actual = result.actual_credits if result.actual_credits is not None else subscription_delta
        if actual is None:
            actual = estimated
        manifest = {
            "schemaVersion": 1,
            "kind": kind,
            "fingerprint": fingerprint,
            "scriptHash": hashlib.sha256(text.encode("utf-8")).hexdigest(),
            "provider": provider.name,
            "modelId": model_id,
            "voiceId": voice_id,
            "text": text,
            "textCharacters": len(text),
            "estimatedCredits": estimated,
            "actualCredits": int(actual),
            "requestId": result.request_id,
            "audioFile": audio_path.name,
            "alignmentFile": alignment_path.name,
            "accountTier": before.tier,
            "licenseMode": config.get("licenseMode", "private-preview"),
            "commercialUseAllowed": str(before.tier).lower() not in {"free", "unknown"},
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
            **result.raw_metadata,
        }
        atomic_write_json(manifest_path, manifest)
        finish_ledger_entry(
            project_dir,
            operation_id,
            status="success",
            actualCredits=int(actual),
            requestId=result.request_id,
            manifest=str(manifest_path.relative_to(project_dir).as_posix()),
            accountUsedBefore=before.used_credits,
            accountUsedAfter=after.used_credits,
        )
        manifest["manifestPath"] = str(manifest_path)
        manifest["cacheHit"] = False
        return manifest
    except Exception as exc:
        ambiguous = isinstance(exc, TTSRequestError) and exc.ambiguous
        updates: dict[str, Any] = {"status": "ambiguous" if ambiguous else "failed", "error": str(exc)[:800]}
        if not ambiguous:
            updates["actualCredits"] = 0
        finish_ledger_entry(project_dir, operation_id, **updates)
        raise


def choose_and_store_voice(
    project_path: Path,
    provider: TTSProvider,
    desired_gender: str = "male",
    preferred_voice_id: str | None = None,
) -> VoiceCandidate:
    project = read_json(project_path, {})
    config = resolved_tts_config(project, provider.name)
    configured_id = config.get("voiceId")
    if configured_id and not preferred_voice_id:
        return VoiceCandidate(str(configured_id), str(config.get("voiceName") or configured_id), 999, {})
    voices = provider.list_voices(desired_gender)
    if not voices:
        raise TTSRequestError("계정에서 사용할 수 있는 TTS 화자를 찾지 못했습니다.")
    if preferred_voice_id:
        selected = next((voice for voice in voices if voice.voice_id == preferred_voice_id), None)
        if selected is None:
            raise TTSRequestError("선택한 화자를 현재 계정의 사용 가능한 기본 음성에서 찾지 못했습니다.")
    else:
        selected = voices[0]
    project.setdefault("tts", {})["provider"] = provider.name
    project["tts"]["voiceId"] = selected.voice_id
    project["tts"]["voiceName"] = selected.name
    project["tts"]["voiceLabels"] = selected.labels
    project["tts"].setdefault("voicesByProvider", {})[provider.name] = {
        "voiceId": selected.voice_id,
        "voiceName": selected.name,
        "voiceLabels": selected.labels,
    }
    atomic_write_json(project_path, project)
    return selected


def find_voice(provider: TTSProvider, voice_id: str, desired_gender: str = "any") -> VoiceCandidate:
    selected = next((voice for voice in provider.list_voices(desired_gender) if voice.voice_id == voice_id), None)
    if selected is None:
        raise TTSRequestError("선택한 화자를 현재 계정에서 찾지 못했습니다.")
    return selected


def content_voice_profile(text: str) -> dict[str, Any]:
    lowered = text.lower()
    tags: list[str] = ["calm", "clear", "professional"]
    if any(word in lowered for word in ("취재", "뉴스", "보도", "검증", "데이터", "저널리즘")):
        tags.extend(["news", "grounded", "trustworthy"])
    if any(word in lowered for word in ("강의", "교육", "설명", "학습", "과정")):
        tags.extend(["education", "narration", "warm"])
    if any(word in lowered for word in ("이야기", "사례", "인터뷰", "현장")):
        tags.extend(["storytelling", "natural", "conversational"])
    if any(word in lowered for word in ("기술", "ai", "인공지능", "코드", "도구")):
        tags.extend(["confident", "technical"])
    return {"tags": sorted(set(tags)), "summary": "차분하고 또렷한 한국어 강의 내레이션"}


def recommend_voices(voices: list[VoiceCandidate], content_text: str, limit: int = 3) -> tuple[dict[str, Any], list[VoiceCandidate]]:
    profile = content_voice_profile(content_text)
    ranked: list[VoiceCandidate] = []
    for voice in voices:
        searchable = " ".join([voice.name, *[str(value) for value in voice.labels.values()]]).lower()
        bonus = sum(12 for tag in profile["tags"] if tag in searchable)
        if any(word in searchable for word in ("young", "young adult", "젊")):
            bonus += 6
        if any(word in searchable for word in ("robot", "synthetic", "character")):
            bonus -= 10
        ranked.append(VoiceCandidate(voice.voice_id, voice.name, voice.score + bonus, voice.labels, voice.preview_url))
    return profile, sorted(ranked, key=lambda item: (-item.score, item.name.lower()))[: max(1, limit)]


def redact_subscription(info: SubscriptionInfo) -> dict[str, Any]:
    return {
        "tier": info.tier,
        "usedCredits": info.used_credits,
        "creditLimit": info.credit_limit,
        "remainingCredits": info.remaining_credits,
    }
