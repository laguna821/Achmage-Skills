# v2 장면 스키마

## 프로젝트 자동화 필드

- `workflowMode`: 기본 `autoAfterVoiceApproval`
- `outputProfile`: 기본 `all-in-one`, 선택 편집본은 `editable`
- `defaultAnimation`: 기본 `line-trace`. 장면의 `animationMode`가 있으면 해당 장면 값을 우선한다.
- `voiceApproval`: 공급자, 화자, 모델, 설정, 콘텐츠 해시와 승인 비용 상한
- `subtitles`: 줄 수, 글자 수, 최소·최대 표시 시간과 번인 모드
- `pronunciationOverrides`: TTS 발음에만 적용하는 원문→발음 문자열 사전
- `targetDurationMs`: 선택적인 전체 목표 시간. TTS 뒤 ±5%를 검사한다.

승인 지문은 대본, 원문 해시, 발음표, 화자, 모델과 음성 설정이 바뀌면 달라진다. API 키는 포함하지 않는다.

## 좌표와 시간

- `region`은 `{x, y, width, height}` 형식이며 모든 값은 0~1이다.
- 시간은 정수 밀리초다. 기본 `durationMs`는 8000이다.
- 요소는 `zIndex` 오름차순으로 합성한다.
- 네이티브 이미지의 픽셀 크기는 `source.nativeWidth`, `source.nativeHeight`에 기록한다.

## 최상위 구조

```json
{
  "schemaVersion": 2,
  "sceneId": "sequence-001",
  "durationMs": 8000,
  "narration": "장면의 한 문장 주장",
  "voiceover": {"script": "실제로 읽을 자연스러운 강의 대본", "status": "draft"},
  "canvas": {"width": 3840, "height": 2160, "theme": "achmage-newsroom-light"},
  "source": {"file": "base-art.png", "nativeWidth": 0, "nativeHeight": 0, "status": "pending"},
  "textSafeRegions": [{"x": 0.06, "y": 0.05, "width": 0.88, "height": 0.18}],
  "protectedRegions": [{"x": 0.05, "y": 0.72, "width": 0.35, "height": 0.22}],
  "elements": []
}
```

## 요소

`kind`는 `art`, `text`, `shape` 중 하나다.

```json
{
  "id": "headline",
  "kind": "text",
  "label": "핵심 문장",
  "zIndex": 20,
  "content": "정확하게 표시할 한국어",
  "region": {"x": 0.07, "y": 0.05, "width": 0.86, "height": 0.18},
  "style": {
    "fontSize": 82,
    "fontWeight": 700,
    "color": "#263238",
    "accentColor": "#2F6BFF",
    "align": "center",
    "verticalAlign": "middle",
    "lineSpacing": 1.18
  },
  "events": [
    {"action": "draw", "startMs": 300, "durationMs": 1800, "animation": "line-by-line"},
    {"action": "hold", "startMs": 2100, "durationMs": 5900, "animation": "none"}
  ]
}
```

`shape`는 `style.shape`에 `rect`, `roundRect`, `line`, `arrow`를 사용한다. `replace` 이벤트는 `targetId`를 지정해 기존 요소를 같은 시간 동안 지운다.

## 이벤트 의미

- `draw`: 0에서 1까지 요소를 나타낸다.
- `hold`: 현재 상태를 유지한다.
- `erase`: 1에서 0까지 요소를 지운다.
- `replace`: 새 요소를 나타내며 `targetId`를 동시에 지운다.

지원 애니메이션: `marker-wipe`, `line-trace`, `left-to-right`, `right-to-left`, `top-to-bottom`, `bottom-to-top`, `center-out`, `line-by-line`, `slide-up`, `fade`, `eraser-wipe`, `none`.

`line-trace`는 `art` 요소의 래스터 선과 면에서 획 순서를 추정해 마커 손이 해당 경로를 따라가게 한다. 원본 이미지나 기준 장면 JSON을 바꾸지 않고 기존 음성으로 비교하려면 `rerender-voiced`를 사용한다. 자세한 제한과 사용법은 `line-trace.md`를 따른다.

선택 필드 `syncTo`에 대본 속 문구 또는 `{"text": "문구", "offsetMs": 0}`를 넣으면 유성 렌더에서 해당 발화 시점에 이벤트를 맞춘다. 이 값이 없으면 기준 8초 타임라인에서 음성 구간으로 비례 이동한다. `hold`는 동적 장면의 마지막 프레임까지 연장된다.

## 음성 메타데이터

- `voiceover.status`: `draft`, `approved`, `generated`
- `voiceover.generated`: 공급자, 모델, 화자 ID, 대본·설정 지문, 오디오 길이, 요청 ID, 실제 소비량, 로컬 파일 경로와 라이선스 판정
- API 키는 어떤 JSON에도 저장하지 않는다.
- 원본 `durationMs`와 이벤트 시간은 기준값으로 유지한다. 음성 기반 `resolvedTiming`은 렌더 메모리에서만 계산한다.

## v1 변환

v1 픽셀 영역은 원래 `canvas` 크기로 나눠 정규화한다. `reveal.startMs`와 `reveal.durationMs`는 `draw` 이벤트로 옮기고, 방향 이름은 하이픈 형식으로 정규화한다. 원본 파일은 덮어쓰지 않는다.
