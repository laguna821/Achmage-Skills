# 03_RAW5_IMAGE_DIRECTOR.md

# Raw5 Image Director v4

이 문서는 덱 전체를 버틸 raw image 5장을 설계하는 엔진이다.

---

## 1. 핵심 원칙

raw image는 완성 슬라이드가 아니다.

raw image는 HTML PPT 안에서 다음처럼 쓰일 재료다.

- 전면 배경
- 흐린 워시 배경
- 톤 오버레이 배경
- 블렌드 전환 이미지
- 도형 마스크 크롭
- 글자 안 이미지
- 카드 내부 배경 이미지
- 하프톤/그레인/루마 마스크 재료

따라서 raw image는 아래 조건을 만족해야 한다.

1. 읽을 수 있는 텍스트가 없다.
2. 로고가 없다.
3. 숫자, 표, UI 라벨이 없다.
4. 최종 슬라이드처럼 보이지 않는다.
5. 넓은 여백이 있다.
6. 16:9 전체 배경으로 써도 좋다.
7. 원형, 아치형, 라운드 사각형, 사선 도형으로 잘라도 살아야 한다.
8. 어둡게 필터링해도 형태가 살아야 한다.
9. 카드 안에 작게 크롭해도 핵심 질감이 보인다.
10. 5장만으로 덱의 논리 흐름을 MECE하게 커버한다.

---

## 2. Raw5 Stage Hard Stop

이 단계에서는 HTML을 만들지 않는다.

최종 산출물은 다음 중 하나다.

1. raw image 5장 생성 완료
2. raw image 5장 프롬프트 제공
3. 특정 이미지 재생성 프롬프트 제공

이 단계가 끝나면 반드시 멈춘다.

금지:

- raw5 생성 직후 HTML 생성
- 이미지 확인 없이 material catalog 생성
- placeholder 이미지로 HTML 먼저 만들기
- raw image 5장 없이 CSS 기법 적용

---

## 3. 공통 Raw5 MECE 역할

기본적으로 5장은 아래 역할을 갖는다.

### Raw 01. Location / Context

공간, 장소, 배경, 입지, 전체 맥락.

추천 활용:

- cover
- wash-scene
- blend-scene
- luma-mask-scene
- location card

### Raw 02. Crowd / Tension

대기, 사람, 긴장, 수요 신호, 저항 또는 흐름.

추천 활용:

- contrast slide
- metric card
- queue / demand / friction 이야기
- material-image-card 내부 배경

### Raw 03. Experience / Immersion

실내, 체험, 몰입, 제품을 만지는 장면, 깊이 있는 공간.

추천 활용:

- tone-scene
- surface-fx-card
- refract-glass-card
- dashboard / KPI / operational slide

### Raw 04. Shareability / Spectacle

사진 찍는 장면, 상징적 설치물, 소셜 확산, 강한 비주얼.

추천 활용:

- halftone-overlay
- selective-accent-scene
- paper-grain-layer
- magazine cover

### Raw 05. Conversion / Takeaway

구매, 포장, 전환, 체크아웃, 최종 행동.

추천 활용:

- final-card
- depth-shadow-stack
- closing checklist
- material card background

---

## 4. Design Mode별 Raw5 설계

### 4-1. V7 Bright Report / Strategy

Raw 5 역할:

1. 핵심 장면 / 대표 공간
2. 문제 맥락 / 저항 구조
3. 비교 장면 / 중간 다리
4. 데이터·증거 느낌의 장면
5. 변화·미래 느낌의 장면

프롬프트 톤:

- 깨끗한 자연광
- 넓은 여백
- 설명형 슬라이드에 들어갈 수 있는 균형
- 과한 대비 금지
- 로고/텍스트 금지

### 4-2. V8 Dark Brutalist

Raw 5 역할:

1. 강한 배경 장면
2. 어두운 질감 장면
3. 네온/기술/긴장 장면
4. 사람/행동 장면
5. 결론/전환 장면

프롬프트 톤:

- dark cinematic
- high contrast
- negative space
- neon accent 가능
- 배경으로 어둡게 깔았을 때 강한 실루엣

주의:

- Raw 이미지 자체에 글자, 포스터 문구, UI 라벨이 있으면 안 된다.
- V8에서는 이미지를 전면 배경으로 쓰기 때문에 중앙 피사체가 너무 꽉 차면 실패한다.

### 4-3. University AX Information Grid

Raw 5 역할:

1. 대학/캠퍼스/조직 장면
2. 회의/저항/프로세스 장면
3. 디지털 전환/도구 장면
4. 데이터/운영/측정 장면
5. 미래/성과/학습 장면

프롬프트 톤:

- 밝은 배경
- 안정감
- 네이비/블루 계열과 잘 맞는 색감
- 카드 안에 들어가도 질서 있어 보이는 구도

주의:

- 인물이 너무 많으면 카드 크롭에서 산만해진다.
- 정보형 덱이므로 사진은 보조 재료다.

### 4-4. Street Magazine Editorial

Raw 5 역할:

1. Location — 거리와 입지
2. Buzz — 줄, 대기, 수요 신호
3. Immersion — 체험 공간 내부
4. Shareability — 사진 찍히는 상징 장면
5. Conversion — 구매, 포장, 전환

프롬프트 톤:

- editorial street photography
- premium realistic
- no readable text
- no logos
- blank signage only
- strong focal scene + negative space
- 종이색/코랄/검정과 잘 맞는 색감

주의:

- 카드 내부 배경으로 쓸 수 있어야 하므로 장면의 질감이 살아야 한다.
- 너무 어두우면 material-image-card에서 검은 상자가 된다.
- 너무 화려하면 텍스트 가독성이 깨진다.

---

## 5. Raw5 프롬프트 템플릿

### 기본 템플릿

```text
Create a 1920x1080 horizontal raw source image for an HTML PPT design system.
This is not a final slide. It will be used as CSS background material.
Subject: [topic]
Role in Raw5: [role]
Scene: [scene description]
Style: premium editorial photography, realistic, clean composition, clear focal point, useful negative space.
Do not include readable text, logos, numbers, UI labels, posters, brand names, or final slide typography.
Make it suitable for cropping into circles, arches, rounded cards, dark overlays, wash backgrounds, and image cards.
```

### Street Editorial 템플릿

```text
Create a 1920x1080 horizontal raw source image for a street magazine editorial HTML PPT deck.
Topic: [topic]
Raw role: [Location / Buzz / Immersion / Shareability / Conversion]
Show [scene].
Mood: premium realistic editorial photography, Seongsu-like urban-industrial Seoul mood, paper magazine sensibility, restrained colors, strong atmosphere, useful negative space.
No readable text, no logos, no brand names. Blank signage only.
This is raw material for CSS effects such as material-image-card, luma-mask, blend-if cover text, paper grain, halftone overlay, and final dark image cards.
```

### V8 Dark 템플릿

```text
Create a 1920x1080 horizontal raw source image for a dark brutalist keynote deck.
This image will become a full-bleed CSS background.
Scene: [scene]
Mood: dark cinematic, high contrast, minimal, strong negative space, subtle neon or technological tension if appropriate.
No readable text, no logos, no numbers, no UI labels.
Make it work under black gradient overlays and neon green typography.
```

---

## 6. Raw5 QA

각 이미지를 아래 기준으로 검사한다.

| 항목 | 합격 기준 |
|---|---|
| 텍스트 없음 | 읽을 수 있는 글자가 없어야 함 |
| 로고 없음 | 브랜드명, 마크 없음 |
| 장면 역할 | 5장 역할이 서로 달라야 함 |
| 크롭 가능성 | 원/아치/카드 크롭 가능 |
| 어두운 필터 가능성 | tone-scene에서 살아야 함 |
| 카드 내부 사용성 | 작은 카드에서 질감이 보여야 함 |
| 여백 | 제목 또는 카드가 올라갈 공간 있음 |
| 반복 사용성 | 최소 5개 이상의 기법에 재사용 가능 |

실패하면 해당 이미지만 재생성한다.

---

## 7. Raw5 승인 후 Material Catalog

HTML Build Stage가 시작되면 raw5를 아래 재료로 파생한다.

```text
img1.full
img1.wash
img1.tone-dark
img1.blend-left
img1.material-card
img1.circle-crop
img1.arch-crop
...
```

이 catalog는 내부적으로만 쓰고, 사용자가 요청하지 않으면 길게 출력하지 않는다.

