# 선 따라 정밀 그리기

`line-trace`는 기존 `marker-wipe`를 대체하지 않는 선택형 삽화 모션이다. 평면 PNG에서 전경을 분리하고 골격을 만든 뒤, 연결된 선을 따라 순서를 정하고 색 면을 선 주변으로 점진적으로 채운다. 손은 현재 그려지는 추정 획의 위치를 따라간다. `erase`에도 같은 모드를 지정하면 반대 순서로 지우며 아래 레이어가 복원된다.

선 공개 지도는 고정밀 단계로 계산하고, 손 위치는 고밀도 경로를 주변 획 묶음 중심으로 안정화한 뒤 프레임 사이를 보간한다. 이를 낮은 단계의 좌표 인덱스로 축소하면 긴 유성 장면의 시작 부분에서 손이 멈췄다 뛰는 것처럼 보일 수 있으므로 그대로 유지한다.

## 선택 기준

- 손그림 선, 외곽선, 여백이 뚜렷한 삽화에는 `line-trace`를 사용한다.
- 사진, 촘촘한 질감, 큰 그라데이션 면에는 빠르고 안정적인 `marker-wipe`를 유지한다.
- 래스터 이미지에는 원래 작가의 획 순서 정보가 없으므로 결과는 시각적으로 자연스러운 추정 순서다. 실제 획 순서가 꼭 필요하면 향후 SVG 경로 입력을 사용해야 한다.
- 최초 렌더는 장면 폴더의 `.trace-cache`에 해상도별 추적 지도를 만든다. 같은 원본·영역·해상도는 이후 재사용한다.

## JSON

삽화의 `draw` 또는 `erase` 이벤트에 다음처럼 지정한다.

```json
{"action": "draw", "startMs": 150, "durationMs": 5050, "animation": "line-trace"}
```

## 기존 음성으로 무과금 비교

다음 명령은 장면 JSON과 기존 기본 렌더를 덮어쓰지 않는다. `voiceover.generated`의 로컬 오디오와 타임스탬프만 읽으며 TTS 공급자를 생성하거나 API를 호출하지 않는다.

```text
PY scripts/whiteboard.py rerender-voiced \
  --project <프로젝트폴더> \
  --scenes 1 \
  --animation line-trace \
  --variant line-trace \
  --profiles preview,master
```

출력은 `<프로젝트폴더>/variants/line-trace/` 아래에 저장된다. 먼저 `preview`로 손의 이동과 드러나는 순서를 검수한 뒤 `master`를 만든다. 미리보기 편집기는 이벤트 선택과 대략적인 타이밍만 보여주며, 실제 래스터 선 추적 결과는 렌더 영상이 기준이다.

여러 변형 장면을 순서대로 연결할 때는 같은 변형 이름을 지정한다.

```text
PY scripts/whiteboard.py merge-voiced \
  --project <프로젝트폴더> \
  --scenes 1-3 \
  --profile preview \
  --variant line-trace
```
