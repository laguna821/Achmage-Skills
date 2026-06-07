# 02_DECK_PLANNER.md

# Deck Planning Engine v4

이 파일은 발표 주제를 슬라이드별 메시지와 디자인 모드로 바꾸는 기획 엔진이다.

---

## 1. 목표

사용자의 주제를 단순 목차가 아니라 발표 가능한 설득 구조로 만든다.

좋은 덱은 네 가지를 만족한다.

1. 청중이 왜 들어야 하는지 바로 알 수 있다.
2. 문제 진단이 불편하지만 납득 가능하다.
3. 사례, 숫자, 구조, 실행 제안이 함께 있다.
4. 마지막에는 바로 실행 가능한 다음 행동이 있다.

---

## 2. 입력값 추출

아래 값을 추출한다.

```text
topic:
audience:
slide_count:
goal:
tone:
design_mode:
research_need:
required_sources:
forbidden_style:
output_format:
```

부족하면 합리적으로 보완한다. 단, design mode는 가능하면 제안하고 확인할 수 있다.

---

## 3. 덱 브리프 형식

```text
제목:
핵심 주장:
청중:
청중의 현재 상태:
청중의 저항 이유:
발표 후 청중이 해야 할 행동:
덱의 감정 곡선:
금지해야 할 톤:
핵심 설득 방식:
디자인 모드:
```

---

## 4. 기본 내러티브 아크

대부분의 전략 덱은 아래 순서로 안정적으로 작동한다.

1. 오프닝 — 지금 왜 이 주제인가
2. 현상 — 무엇이 잘나가고 있는가
3. 문제 — 겉으로 보이는 성공과 실제 생존 조건의 차이
4. 구조 — 성공 요인을 MECE하게 분해
5. 사례 — 실제 장면 / 동선 / 경험 / 전환
6. 지표 — 무엇을 측정해야 하는가
7. 공식 — 반복 가능한 기획 구조
8. 실행 — 체크리스트, 로드맵, 다음 행동
9. 결론 — 한 문장으로 정리

---

## 5. Design Mode별 기획 방식

### 5-1. V7 Bright Report / Strategy

목적:

- 논리적 설명
- 교육 / 전략 보고 / 컨설팅식 구조
- 이미지 기법을 다양하게 보여주는 덱

기획 방식:

- 5~7개 섹션으로 나눈다.
- 한 슬라이드당 하나의 메시지.
- 숫자, 표, 비교, 카드, 로드맵을 명확히 쓴다.
- 이미지는 배경/도형/마스크로 보조한다.

추천 슬라이드 타입:

```text
cover
executive summary
problem map
3x2 insight grid
comparison
roadmap
kpi dashboard
case analysis
final checklist
```

금지:

- 지나치게 브루탈한 색
- 정보가 너무 적은 키노트식 구성
- 이미지가 텍스트보다 강한 구조

### 5-2. V8 Dark Brutalist Keynote

목적:

- 강한 메시지
- 짧고 날카로운 키노트
- 검정/형광 그린의 반복 리듬

기획 방식:

- 각 슬라이드는 한 문장 주장 중심.
- 본문은 짧게.
- 기법은 3~4개만 반복한다.
- 배경은 `.bg-stage` 풀블리드 구조로 통일한다.

추천 슬라이드 타입:

```text
statement cover
single thesis
brutal grid
harness card
contrast pair
call to action
```

금지:

- 너무 많은 카드, 도형, 유리 효과
- 밝은 리포트식 표와 긴 문단
- 매 슬라이드마다 다른 레이아웃
- 꾸밈 욕심으로 V8의 단순함을 깨는 것

### 5-3. University AX Information Grid

목적:

- 조직 전략
- 대학교/기업의 변화 계획
- KPI, 로드맵, 비교, 운영 구조

기획 방식:

- 정보 밀도를 높이되 카드 간격을 정확히 둔다.
- 12컬럼 그리드 기반으로 짜야 한다.
- 각 섹션마다 패턴을 반복한다.

추천 슬라이드 타입:

```text
summary-grid
compare-grid
kpi-grid
roadmap-grid
dashboard-grid
timeline-grid
```

금지:

- 감성 이미지가 정보 구조를 덮는 것
- 너무 어두운 톤
- KPI 숫자가 이미지 안에 박히는 것
- 카드 높이가 서로 무질서하게 흔들리는 것

### 5-4. Street Magazine Editorial

목적:

- 도시/브랜드/팝업/문화 트렌드
- 매거진 표지 느낌
- raw 이미지를 질감과 장면으로 강하게 활용

기획 방식:

- 종이색 배경 + 굵은 검정 제목 + 코랄 포인트.
- 사진 위 텍스트는 흰색 또는 검정으로 강하게.
- 이미지 카드 안 배경 이미지가 보여야 한다.
- 실제 SVG 차트로 운영 지표를 시각화한다.

추천 슬라이드 타입:

```text
street cover
material image card grid
luma masked story
blend-if cover text
metric-window dashboard
refract corner card
selective accent
paper grain editorial
halftone poster
final execution canvas
```

금지:

- 이미지 카드가 그냥 검은 상자로 보이는 것
- 회색 본문이 사진 위에 올라가 안 읽히는 것
- 그래프처럼 생긴 장식 벡터를 차트라고 부르는 것
- 카드 뉴스처럼 과하게 귀여운 색감

---

## 6. Slide Plan 출력 형식

슬라이드별 계획은 아래 표로 만든다.

| slide | section | message | slide type | raw image | technique | notes |
|---:|---|---|---|---|---|---|
| 01 | Opening | 한 문장 주장 | cover | img1 | tone-scene | 큰 제목 |
| 02 | Context | 시장 배경 | grid | img1,img2 | grid-scene | 수치 HTML |

각 슬라이드의 `message`는 실제 발표자가 말할 수 있는 문장이어야 한다.

---

## 7. Technique Assignment 규칙

### V7 밝은 덱

- 처음 10장 안에서 `wash`, `blend`, `tone`, `grid`, `overlap`, `masked-word`, `collage`를 균형 있게 쓴다.
- 단, 한 슬라이드에 2개 이상의 강한 이미지 기법을 겹치지 않는다.

### V8 다크 덱

- `.bg-stage`는 모든 슬라이드에 들어간다.
- 모드는 `mode-wash`, `mode-tone`, `mode-blend-left`, `mode-blend-right` 중 하나만 선택한다.
- 강한 카드나 도형은 필요한 경우에만 쓴다.

### AX 정보형 덱

- `summary`, `compare`, `kpi`, `roadmap`, `dashboard`, `timeline` 중 하나를 슬라이드 타입으로 정한다.
- 이미지 기법은 보조다.

### Street Editorial 덱

- 신규 10기법은 슬라이드 순서와 메시지에 맞게 한 번씩 보여줄 수 있다.
- 각 신규 기법 슬라이드는 해당 기법의 설계 의도가 드러나야 한다.

---

## 8. 자료 조사와 내용 구성

최신성 있는 주제는 웹 조사를 해야 한다. 조사 결과는 슬라이드에 그대로 복사하지 않고 다음으로 바꾼다.

1. 핵심 사실
2. 해석
3. 기획 공식
4. 적용 체크리스트
5. 수치 또는 구조화된 지표

출처는 슬라이드 하단 작은 텍스트나 별도 source slide에 HTML 텍스트로 넣는다.

---

## 9. 최종 메시지 검증

각 슬라이드는 아래 질문을 통과해야 한다.

1. 이 슬라이드는 한 문장으로 무엇을 말하는가?
2. 이 슬라이드의 시각 기법은 메시지를 돕는가?
3. 같은 말을 더 적은 텍스트로 할 수 있는가?
4. 이미지가 내용보다 과하게 앞서지 않는가?
5. design mode의 금지 규칙을 어기지 않았는가?

