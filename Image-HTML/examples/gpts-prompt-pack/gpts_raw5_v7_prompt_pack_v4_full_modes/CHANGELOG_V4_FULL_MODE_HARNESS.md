# CHANGELOG v4 — Full Design Modes + Harness QA

## 업그레이드 배경

v3는 Raw5 image-first stage gate와 V7 CSS 레이어 시스템을 잘 고정했지만, 실제 제작 과정에서 다음 문제가 반복되었다.

1. V8 다크 브루탈 덱에 디자인 기법을 너무 많이 섞는 문제
2. 왼쪽 하단에 table of contents / slide 번호 목록이 생기는 문제
3. material-image-card가 의도와 달리 그냥 검은 유리 카드처럼 보이는 문제
4. surface-fx-card가 실제 차트가 아니라 차트처럼 생긴 장식 벡터가 되는 문제
5. 사진 위 텍스트가 회색이라 안 읽히는 문제
6. 최종 카드 안 raw 이미지가 거의 보이지 않는 문제
7. design mode별 do/don't가 분리되어 있지 않은 문제

## 변경 사항

### 1. Design Mode 4종 추가

- V7 Bright Report / Strategy
- V8 Dark Brutalist
- University AX Information Grid
- Street Magazine Editorial

### 2. 하네스 강화

- 왼쪽 하단 TOC/번호 목록 금지
- 우측 하단 네비 자동 숨김 필수
- 사진 위 회색 텍스트 금지
- V8 과잉 디자인 금지
- material image card 이미지 가시성 필수
- surface-fx-card 실제 SVG chart 필수

### 3. 신규 문서 추가

- `07_DESIGN_MODE_PLAYBOOKS.md`
- `08_HARNESS_QA_AND_PATCH_RULES.md`
- `09_COPY_READY_MASTER_PROMPTS.md`

### 4. CSS 시스템 확장

기존 V7 기법에 다음 시스템을 추가했다.

- V8 `.bg-stage` 계열
- University AX 정보형 grid 계열
- Street Editorial 신규 10기법

### 5. Stage Gate 유지

v3의 image-first hard stop은 그대로 유지한다.

## v4의 핵심 한 줄

```text
모드는 섞을 수 있지만 하네스는 흔들리면 안 된다.
```

