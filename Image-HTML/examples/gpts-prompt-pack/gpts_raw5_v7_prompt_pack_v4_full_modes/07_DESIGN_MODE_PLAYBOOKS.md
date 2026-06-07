# 07_DESIGN_MODE_PLAYBOOKS.md

# Design Mode Playbooks v4

이 문서는 디자인 모드별 “해야 할 것 / 하지 말아야 할 것 / 하네스”를 고정한다.

---

# 1. V7 Bright Report / Strategy Mode

## 목적

밝은 전략 보고서, 설명형 덱, 학술/컨설팅형 문서.

## 시각 언어

- 배경: 흰색, 옅은 블루, 아주 밝은 회색
- 글자: 네이비 중심
- 포인트: 블루/테일 소량
- 카드: 흰색, 약한 그림자, 둥근 모서리
- 이미지: 도형, 워시, 블렌드, 톤 보정으로 보조

## 추천 기법

- `.masked-word`
- `.shape-mask-scene`
- `.wash-scene`
- `.blend-scene`
- `.grid-scene`
- `.overlap-scene`
- `.tone-scene`
- `.collage-scene`

## Do

1. 정보를 먼저 정리하고 이미지를 보조로 쓴다.
2. 12컬럼 그리드로 카드 위치를 정확히 잡는다.
3. 이미지는 다양하게 크롭하되 전체 톤은 통일한다.
4. V7 기법은 recipe처럼 적용한다.

## Don't

1. 다크 브루탈 스타일을 섞지 않는다.
2. 형광색을 많이 쓰지 않는다.
3. 사진 위에 회색 글자를 길게 올리지 않는다.
4. 매 슬라이드마다 완전히 다른 시스템을 만들지 않는다.

## Harness

```text
V7이면 밝은 배경, 네이비 텍스트, 이미지 보조, 카드 기반 정보 구조를 유지한다.
```

---

# 2. V8 Dark Brutalist Mode

## 목적

강한 키노트, 선언형 발표, 어두운 풀블리드 배경.

## 시각 언어

- 배경: 검정 또는 아주 어두운 이미지
- 포인트: 형광 그린
- 글자: 크고 짧게
- 카드: 검정 반투명, 강한 경계
- 그리드: 형광 라인 질감

## 추천 기법

- `.bg-stage`
- `.bg-full`
- `.bg-treatment`
- `.bg-grid`
- `.mode-wash`
- `.mode-tone`
- `.mode-blend-left/right`
- `.grid-card`
- `.brutal-card`

## Do

1. 모든 슬라이드에 `.bg-stage` 구조를 유지한다.
2. 모드는 wash / tone / blend 중 하나만 적용한다.
3. 기법은 3~4개만 반복한다.
4. 텍스트는 짧고 크고 강하게 쓴다.
5. 형광 그린을 포인트로 반복한다.

## Don't

1. 유리 카드, 콜라주, 표면 FX, 하프톤을 과하게 섞지 않는다.
2. 밝은 리포트형 카드 디자인을 많이 넣지 않는다.
3. 색을 여러 개 쓰지 않는다.
4. 디테일 욕심 때문에 전체 톤을 깨지 않는다.

## Harness

```text
V8은 “단순함이 힘”이다. 전체 덱은 3~4개 배경 모드만 반복한다. 예쁘게 꾸미려 하지 말고, 큰 문장과 강한 배경을 유지한다.
```

---

# 3. University AX Information Grid Mode

## 목적

대학/조직/전략/운영 구조를 설득하는 정보형 덱.

## 시각 언어

- 배경: 밝은 회청색 / 흰색
- 글자: 네이비
- 카드: 정돈된 흰 패널
- 구조: 12컬럼 정보 그리드
- 이미지: 보조 재료

## 추천 기법

- `.summary-grid`
- `.compare-grid`
- `.kpi-grid`
- `.roadmap-grid`
- `.dashboard-grid`
- `.timeline-grid`
- `.panel.metric`

## Do

1. 슬라이드 타입을 먼저 정한다.
2. KPI, 로드맵, 대시보드는 HTML/SVG로 만든다.
3. 카드 높이와 column span을 정확히 잡는다.
4. 이미지가 정보 구조를 가리지 않게 한다.

## Don't

1. 이미지가 슬라이드 주인공이 되지 않게 한다.
2. 지나친 잡지식 구성이나 브루탈 톤을 넣지 않는다.
3. KPI를 이미지 안에 넣지 않는다.
4. 카드 간격과 높이를 무작위로 만들지 않는다.

## Harness

```text
AX 정보형 덱은 카드의 정확도가 디자인이다. 이미지보다 grid와 metric이 먼저다.
```

---

# 4. Street Magazine Editorial Mode

## 목적

도시, 팝업, 문화 트렌드, 브랜드 경험을 매거진처럼 보여주는 덱.

## 시각 언어

- 배경: 종이색, 크림색
- 글자: 굵은 Pretendard, 큰 검정 제목
- 포인트: 코랄/오렌지
- 이미지: 거리 사진, 질감, 인쇄물 감성
- 카드: 어두운 이미지 창문 카드

## 추천 기법

- `.material-image-card`
- `.luma-mask-scene`
- `.blend-if-scene.cover-text`
- `.surface-fx-card.metric-window`
- `.refract-glass-card`
- `.lut-scene`
- `.selective-accent-scene`
- `.paper-grain-layer`
- `.halftone-overlay`
- `.depth-shadow-stack`
- `.final-card`

## Do

1. 종이색 배경과 굵은 검정 타이틀을 유지한다.
2. 사진 위 텍스트는 흰색 또는 검정으로 강하게 대비시킨다.
3. material image card 안 raw 이미지는 보여야 한다.
4. Surface FX 카드에는 실제 SVG 차트를 넣는다.
5. 마지막 슬라이드는 어두운 배경 위 5개 실행 카드로 정리한다.

## Don't

1. 카드 안 이미지를 너무 흐려서 검은 상자로 만들지 않는다.
2. 회색 글자를 사진 위에 올리지 않는다.
3. 그래프처럼 생긴 선을 실제 차트처럼 취급하지 않는다.
4. 코랄 포인트를 너무 많이 써서 산만하게 만들지 않는다.
5. 유리 표면만 강조하고 이미지 창문 의도를 잊지 않는다.

## Harness

```text
Street Editorial은 “이미지 질감이 보이는 어두운 창문 + 굵은 잡지식 텍스트”다. 예쁜 유리카드가 아니라, 뒤 장면이 보이는 잘린 이미지 카드다.
```

---

# 5. Mixed Mode

여러 모드를 섞을 수 있지만 아래 규칙을 지킨다.

1. 전체 덱의 지배 모드는 하나만 둔다.
2. 섹션 전환에서만 다른 모드를 잠깐 쓴다.
3. V8과 AX는 같은 슬라이드 안에서 섞지 않는다.
4. Street Editorial 기법은 V7 밝은 덱에 일부 쓸 수 있으나 종이색/코랄/굵은 제목을 함께 써야 한다.
5. V8 안에는 Street의 material card를 넣지 않는 것이 기본이다. 넣더라도 1~2장만 제한한다.

