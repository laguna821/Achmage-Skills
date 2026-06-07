# 01_ROUTER_PIPELINE.md

# Router & Pipeline Controller v4

이 문서는 GPTs가 사용자의 요청을 어떤 단계와 모드로 처리할지 정하는 상태 기계다.

---

## 1. Intake에서 추출할 값

사용자 요청에서 아래 값을 추출한다.

1. `topic` — 발표 주제
2. `audience` — 청중
3. `goal` — 설득 / 보고 / 교육 / 제안 / 투자 / 콘텐츠
4. `slide_count` — 원하는 장수
5. `output_type` — HTML PPT / 카드뉴스 / 프론트 UI / 치트시트 / 프롬프트 팩
6. `design_mode` — V7 / V8 / University AX / Street Editorial / Mixed
7. `image_status` — raw5 필요 / 이미 있음 / 수정 필요
8. `research_need` — 웹 조사 필요 여부
9. `file_status` — 참고 HTML / 이미지 / ZIP이 있는지
10. `stage_status` — Plan / Raw5 / Await Approval / Render / Patch

정보가 부족해도 치명적이지 않으면 질문하지 않고 합리적으로 가정한다. 단, raw image 승인 여부와 HTML 생성 승인 여부는 절대 가정하지 않는다.

---

## 2. 요청 분기

### 2-1. Full Deck Mode

트리거:

- “덱 만들어줘”
- “발표자료로 만들어줘”
- “HTML PPT로 만들어줘”
- “주제는 X, 이런 느낌으로 전체 제작”

처리:

1. Deck Plan
2. Design Mode 선택
3. Raw5 Strategy
4. Raw5 Image Generation
5. Hard Stop
6. User Approval
7. HTML Build
8. QA

중요:

- 이미지 생성 가능 환경이면 raw5 5장만 생성하고 멈춘다.
- 이미지 생성 불가 환경이면 raw5 프롬프트 5개를 제공하고 멈춘다.
- HTML은 승인 후에만 만든다.

### 2-2. Render Only Mode

트리거:

- “방금 그린 5개 이미지를 raw5로 해서 HTML 만들어”
- “첨부한 이미지로 덱 만들어”
- “이미지는 이미 있으니 바로 렌더링”

조건:

- raw image 5장이 실제로 있어야 한다.
- 5장이 아니면 부족한 이미지를 어떻게 처리할지 확인한다.

처리:

1. raw5 역할 재분류
2. `--img1~--img5` 바인딩
3. design mode 확정
4. technique assignment
5. HTML build
6. QA

### 2-3. Patch Mode

트리거:

- “11번 수정”
- “이 글자가 안 보여”
- “카드 안 이미지가 안 보여”
- “왼쪽 하단 번호 빼”
- “v8처럼 네비 자동 숨김”

처리:

1. 피드백 문장을 실패 유형으로 번역한다.
2. 해당 CSS 클래스 / layout harness / JS runtime을 찾는다.
3. 같은 클래스가 쓰인 슬라이드 전체에 영향이 있는지 확인한다.
4. 새 파일을 만든다.
5. 수정 내용을 구체적으로 짧게 보고한다.

패치 매핑 예:

| 사용자 말 | 내부 문제 | 패치 대상 |
|---|---|---|
| 왼쪽 하단 슬라이드 번호 필요 없어 | forbidden TOC visible | `#toc`, `.slide-index`, `.thumb-strip` 제거 |
| 네비게이션 바 자동 숨김 | controller always visible | `#controller.auto-hide`, JS timer |
| 글자가 안 보여 | text contrast failure | overlay / text color / shadow |
| 카드 안 이미지가 안 보여 | material card image too hidden | `::before opacity/blur/brightness` |
| 그래프처럼 생긴 벡터 | fake chart | SVG chart 도입 |
| V8이 복잡해 | overdesigned V8 | 기법 수 3~4개로 축소 |

### 2-4. CheatSheet / Prompt Pack Mode

트리거:

- “치트시트 정리”
- “프롬프트 팩 업그레이드”
- “하네스 문서화”
- “다른 AI도 재현 가능하게”

처리:

1. 첨부된 파일을 확인한다.
2. CSS class / JS runtime / layout pattern / QA rule을 추출한다.
3. mode별 do/don't를 만든다.
4. 문서 또는 ZIP으로 만든다.
5. 다운로드 링크를 제공한다.

---

## 3. Design Mode Router

사용자의 표현으로 모드를 고른다.

### V7 Bright Report / Strategy

트리거 단어:

- 전략 보고서
- 학술적
- 설명형
- 깔끔한 리포트
- 파란색 / 네이비 / 화이트
- 치트시트 / 위키

기본 기법:

- `.wash-scene`
- `.blend-scene`
- `.grid-scene`
- `.tone-scene`
- `.masked-word`
- `.collage-scene`

### V8 Dark Brutalist

트리거 단어:

- dark
- brutalist
- 네온
- 강한 키노트
- 검정 배경
- 형광 그린
- full-bleed

기본 기법:

- `.bg-stage`
- `.mode-wash`
- `.mode-tone`
- `.mode-blend-left/right`
- `.grid-card`

주의:

- V8은 기법 3~4개만 반복한다.
- 너무 많은 도형, 유리, 차트, 콜라주를 섞지 않는다.

### University AX Information Grid

트리거 단어:

- 대학
- AX 전략
- 로드맵
- KPI
- 대시보드
- 조직 전략
- 비교 분석

기본 기법:

- `.summary-grid`
- `.compare-grid`
- `.kpi-grid`
- `.roadmap-grid`
- `.dashboard-grid`
- `.timeline-grid`

### Street Magazine Editorial

트리거 단어:

- 성수
- 팝업스토어
- 스트리트 매거진
- editorial
- 거리 잡지
- 종이색
- 코랄
- 브루탈 포스터

기본 기법:

- `.material-image-card`
- `.blend-if-scene.cover-text`
- `.surface-fx-card.metric-window`
- `.paper-grain-layer`
- `.halftone-overlay`
- `.final-card`

---

## 4. Mandatory Stage Gate State Machine

### STATE 0. Intake

브리프를 정리한다.

### STATE 1. Blueprint

슬라이드 구조, design mode, raw5 역할을 만든다.

### STATE 2. Raw5 Stage

이미지 5장만 생성하거나 프롬프트 5개만 제공한다.

### STATE 3. Await Approval

반드시 멈춘다.

허용 응답:

```text
raw image 5장 생성 단계까지 완료했습니다.
...
아직 HTML 덱은 만들지 않겠습니다.
```

### STATE 4. Render

사용자 승인 후 HTML을 만든다.

### STATE 5. QA

모드별 harness와 금지 규칙을 검사한다.

### STATE 6. Patch

피드백을 class-level 또는 runtime-level 패치로 반영한다.

---

## 5. Research Router

최신 자료, 시장 현황, 트렌드, 가격, 법/정책, 일정, 기업/인물 최신 정보가 필요하면 웹 조사가 필요하다.

- 웹 조사가 필요한 경우: 반드시 최신 출처를 확인한다.
- 업로드된 파일을 참조하는 경우: 먼저 업로드 파일을 확인한다.
- 발표 내용과 디자인 시스템이 둘 다 필요한 경우: 내용 조사와 디자인 설계를 분리한다.

---

## 6. Output Router

### 사용자가 “파일로 줘”라고 하면

- HTML 요청 → `.html`
- 프롬프트 팩 요청 → `.zip`
- 치트시트 요청 → `.html` 또는 `.zip`
- 패치 요청 → 새 버전 파일명에 `_v2`, `_fixed`, `_v4` 등을 붙인다.

### 사용자가 “정리해줘”라고만 하면

- 텍스트 요약을 제공하되, 파일 생성 의도가 명확하면 반드시 파일을 만든다.

