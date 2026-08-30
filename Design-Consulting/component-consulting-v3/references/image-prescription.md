# Image Prescription — raw-N 이미지 semantic 처방 레이어

> **존재 이유 (2026-08-28).** 실증: `t004-web-handoff-2026-08-21` (CMDSPACE
> PKM Conference 랜딩) — 같은 컴포넌트·같은 토큰이라도 **메시지에 종속된
> 이미지가 씬 기법으로 깔리는 순간 페이지가 차원이 다른 수준**이 된다.
> 반대 명제도 참이다: 이미지가 메시지와 무관하게 "예쁘게" 깔리면 그냥
> 스톡포토 템플릿이다. 그래서 이것은 장식 레이어가 아니라 **처방
> 레이어**다 — 어떤 비트에, 어떤 장면-은유를, 어떤 씬 기법으로, 어떤
> 대비 티어로 까는지까지 전부 처방문이 결정하고, 빌드는 수정 없이 따른다.
>
> **정본 계보**: `raw5-deck/references/03-raw5-image-director.md` (재료성
> 10조건 · Stage HARD STOP) + `05-css-techniques.md` (기법 원전) + t004
> `css/main.css` `.raw5-*` (웹 이식 검증된 레시피) + t004 `RAW-PROMPTS.md`
> (프롬프트 골격·검수 10항·"RAW OK" 게이트).

**발동**: Step 1(Beat Map 확정) 후, Step 3(컴포넌트 소싱)과 병렬 —
**SKILL §2 Step 3.5**. 이미지 없는 페이지(순수 문서형)는 이 레이어를
**명시적으로 스킵 선언**하고 지나간다 (기본값이 스킵이 아니라, 스킵도
처방이다).

---

## I1 — 재료 법: raw 는 완성물이 아니라 재료다

raw5-deck 정본 승계. raw 이미지는 전면 배경·워시·톤 오버레이·블렌드·
마스크 크롭·카드 내부 배경으로 **재사용될 재료**이므로:

1. 판독 가능한 텍스트·글자·숫자 없음 / 2. 로고·워터마크 없음 /
3. UI·차트·화면 콘텐츠 없음 / 4. 식별 가능한 얼굴 없음 /
5. **자연색·컬러풀로 생성** — 브랜드 톤 사전 그레이딩 **금지** (아래
단일 하네스 법) / 6. 완성 포스터처럼 보이지 않음 /
7. 도형 크롭·다크 필터·소형 크롭에도 생존 / 8. **텍스트용 네거티브
스페이스가 지정 위치에** 확보 / 9. 중간 대비 — 화이트 wash 와 다크 tone
스크림 **양쪽에서 생존** / 10. 16:9 랜드스케이프 단일 (세로는 CSS 리크롭
이 처리 — 세로 원본 생성 금지).

## I1.5 — 단일 하네스 법 (2026-08-28 개정 — 이 레이어의 제1법)

> **개정 기록.** 초판은 프롬프트에 "Color grade: 키컬러 계열" 을 강제해
> 이미지를 단색조로 생성시킨 뒤 CSS 스크림이 같은 톤을 또 덮었다 —
> **이중 하네스**. 결과: 이미지가 죽고, 활용도가 배경 전용으로 반토막.
> 정본 실증(`Hallym_Media_Day` 다크 브루탈리스트 30장 덱): 사진은
> **컬러풀**하게 생성하고, 키컬러 통일은 **CSS 트리트먼트가 전담**한다.
> 브랜드 일관성을 안 해치면서 이미지의 파괴력이 산다.

1. **톤은 CSS 의 책임, 색은 이미지의 책임.** raw 는 자연스럽고 풍부한
   색으로 생성한다. 프롬프트의 색 지시는 (a) 시네마틱 실사 선언 (b)
   브랜드와 정면 충돌하는 캐스트 금지 1줄 (예: "no dominant warm-orange
   cast") — 딱 거기까지. 키컬러 hex 를 프롬프트에 넣는 순간 위반이다.
2. **배경으로 쓸 때** — 키컬러 트리트먼트 레이어가 톤을 통일한다
   (I2 의 3층 구조). 이미지 자체 필터는 미세 정규화만
   (`saturate(.82~.9) contrast(1.05~1.12)`).
3. **도형 크롭으로 쓸 때** — **필터 없이 원색 그대로.** 같은 raw 가
   토널 배경과 컬러 악센트 두 역할을 하며 활용도가 배가된다. 톤 배경
   위의 원색 크롭은 그 자체로 시각 위계다.
4. **톤 연속 금지.** 인접 섹션이 같은 밝기·같은 키 농도의 배경으로
   이어지면 안 된다 — tone / 블러-wash / 컬러 크롭 / 무이미지 지면을
   교대시킨다. 그리고 **씬 커버리지가 기본값이다**: 이미지가 안 깔린
   섹션이 연속 2개를 넘으면 스킵 선언을 재심사한다.
   **+ 커버리지 회계 (v3.5 — F42, 저자 육안 발견이 동인)**: 연속 기준은
   단독 배치로 우회된다 (실측: 무이미지 3곳을 전부 단독 배치해 문자적으로
   통과했는데, 다크 스킴 실효 무텍스처는 9/15 였다). 그래서 **총량·실효
   기준을 병행한다** — 처방문에 "무이미지 N/총" 명기, 빌드 후 [[render-qa]]
   **RQ2-OBS** 가 스킴별 실효 저질감(텍스처 sd < 8, 콘텐츠 이미지 없는
   지면)을 실측, **상한 ⌈총/3⌉ 초과 = REVISE**. 라벨이 아니라 픽셀이
   커버리지다.

## I2 — 씬 문법: 기법 7종 + 카드 윈도우 (CSS 정본 포함)

구조 계약 (v2 — Hallym_Media_Day 정본 3층):
- **층1 `bg-full`** (`::before`) — 컬러풀 원본 이미지. 필터는 미세
  정규화만: `saturate(.82~.9) contrast(1.05~1.12)` (+wash 티어는
  `blur(8px) opacity(.38) scale(1.08)`).
- **층2 `bg-treatment`** (`::after`) — **키컬러 트리트먼트**: 다크/라이트
  그라디언트 + **키컬러 radial glow 2~3개** + `mix-blend-mode:multiply`
  (다크) / 라이트 지면은 화이트 그라디언트 + 키 glow. 톤 통일은 전적으로
  이 층의 일이다.
- **층3** — 콘텐츠 (z-index 위).
밴드(`band--light`/`band--dark`)가 트리트먼트 티어를 결정한다. 도형
크롭(`crop-*`)은 층2 없이 층1 원색만 쓴다.

| 기법 | 무엇 | 언제 (비트/의도 매핑) | 핵심 레시피 |
|---|---|---|---|
| **cover** | 풀블리드 무대 (`--raw-opacity:1`) + 다크 스크림 | I1 히어로·최종 CTA — 페이지당 1–2 무대 | `::after` 에 키컬러 대각(74→26%) + 수직 비네트 |
| **tone** | 다크 밴드 — 이미지 위 키컬러 스크림 지배 | I2 stat 밴드·I7 연혁·푸터 — 반전 지면과 결합 | 키 deep 대각 78→36% + 하단 8→22% |
| **wash** | 라이트 지면 — 화이트 스크림 아래 은은한 질감 | quiet 비트 전반(I4 FAQ·I6 표·I9 카드 배경) | 화이트 55→68% 수직 + 키 7% 대각 틴트. 농도 변형 `wash(.12)` 등 |
| **blend-left/right** | mask 로 이미지가 한쪽에서 페이드-인 | 본문↔장면 병치 (I9 Summon·I3 증언) — 텍스트는 반대편 | `mask-image:linear-gradient(90°/270°, transparent 2%→#000 56%)` + 방향 스크림 96→30% |
| **luma** | `mix-blend-mode:luminosity` — 색 제거, 질감만 | 체크리스트·kv 등 정보 밀도 높은 quiet 비트 | opacity .52, 지면색이 이미지를 염색 |
| **cut** | `clip-path` 사선 절단면 | 전환·대조 비트 (I5·I10) — 기하가 곧 수사 | `polygon(38% 0,100% 0,100% 100%,16% 100%)` + 사선 방향 스크림 |
| **horizon** | 하단 띠만 (`inset:auto 0 0 0; height:min(42vh,420px)`) | **SIGNATURE CTA** — 지평선 위 착지감 | 상단 97→6% 수직 워시, 이미지는 하단 40%만 |
| **card-window** | 카드 내부 `--card-img` 소형 크롭 | 세션/자산 카드 헤더 — raw 재사용처 | 고정비율 창 + 카드별 `--raw-pos` |
| **crop-shape (무필터 원색)** | 원·아치·라운드·사선 도형 크롭 — **트리트먼트 없음** | 토널 배경 사이의 컬러 악센트 — 대조·비교 비트, 무이미지 지면의 숨구멍 | `border-radius`/`clip-path` 크롭 + 원색, 키컬러 hairline 프레임 선택 |
| **neon 변형** | tone 의 키 glow 강도 상향 (radial .4+) | SIGNATURE 급 강조 순간 | 같은 3층 문법, glow 만 증폭 |

### I2.5 — 확장 카탈로그: 원전 32기법 전량 (raw5-deck `05-css-techniques.md`)

위 코어 표는 **배경 씬 계열**만이다. 원전은 4계보 32기법 — 처방은 이
전체 카탈로그에서 고른다. CSS 전문은 정본(`raw5-deck/references/
05-css-techniques.md` 해당 번호)을 그대로 이식하고, 색·라운드 값만
프로젝트 토큰으로 치환한다.

**V7 Bright Report 계보 (11)** — 라이트 지면의 편집 기법:

| # | 기법 | 무엇 · 언제 |
|---|---|---|
| V7-01 | `.masked-word` | **글자 안에 이미지** (background-clip:text — 이미지 클립이므로 impeccable BAN 2(그라디언트 텍스트)와 별개). 짧고 굵은 단어 전용 — 히어로/장 제목의 시그니처 급 |
| V7-02 | `.shape-mask-scene` | 원·아치·사선 도형 크롭 (코어 crop-shape 의 원전) |
| V7-03 | `.behind-image-scene` | **텍스트 뒤 희미한 도형 이미지** (opacity .16 + 화이트 스크림) — 무이미지처럼 보이던 본문 섹션의 해법 |
| V7-04 | `.frames-scene` | 다형 프레임(원/라운드/사선) 산포 배치 |
| V7-05 | `.wash-scene` | 블러 워시 원전 (blur 12 · opacity .22 · 화이트 레이어) |
| V7-06 | `.blend-scene` | 2열 그리드 — 사진→본문 그라디언트 봉합 |
| V7-07 | `.grid-scene` | 12컬럼 이미지/정보 패널 그리드 (패널 하단 그라디언트 + 라벨) |
| V7-08 | `.overlap-scene` | **이미지 카드 + float-card 겹침** — 깊이. 인용/증언 비트에 강력 |
| V7-09 | `.title-image-scene` | masked-word 타이틀 + 대형 이미지 통합 록업 |
| V7-10 | `.tone-scene` | 브랜드 톤 multiply 오버레이 (코어 tone 의 원전) |
| V7-11 | `.collage-scene` | 도형 이미지 + float-card 편집 콜라주 |

**V8 Dark Brutalist 계보 (5)** — 다크 무대 엔진 (3층 구조의 원전):

| # | 기법 | 무엇 · 언제 |
|---|---|---|
| V8-01 | `.bg-stage` | bg-full/bg-treatment/bg-grid/slide-ui 4층 무대 — **모든 다크 섹션이 같은 구조를 공유** ("매번 다른 구조를 만들지 않는다") |
| V8-02 | `.mode-wash` | 다크 블러 워시 (blur 8 · op .38 · 흑 그라디언트) |
| V8-03 | `.mode-tone(.neon)` | 흑 대각 + **키 radial glow** multiply — neon 은 glow .42 증폭 |
| V8-04 | `.mode-blend-L/R` | 흑 방향 그라디언트 — "글자는 어두운 쪽, 사진 좋은 쪽은 살린다" |
| V8-05 | `.grid-card`/`.brutal-card` | 키컬러 보더 정보 카드 / 하드섀도 브루탈 카드. **하네스: 3–4개 기법만 반복, 욕심 금지** |

**AX Information Grid 계보 (6)** — 정보 밀도 섹션의 카드 질서
(이미지는 보조): AX-01 밝은 쉘 / AX-02 `.summary-grid` / AX-03
`.compare-grid` / AX-04 `.kpi-grid` / AX-05 `.roadmap-grid` / AX-06
`.dashboard-grid` — 12컬럼 비대칭 스팬 격자. 표·비교·KPI 비트가 씬을
스킵할 때 이 격자가 형태값을 댄다.

**S Street Magazine 계보 (10)** — 에디토리얼 마감:

| # | 기법 | 무엇 · 언제 |
|---|---|---|
| S-01 | `.material-image-card` | **어두운 이미지 창문 카드** — "카드 속 raw 가 보이는 창문" (brightness .6 + blur 2, opacity 로 죽이기 금지). 카드 그리드 비트의 정답 |
| S-02 | `.luma-mask-scene` | 밝기 기반 마스크 페이드 |
| S-03 | `.blend-if-scene.cover-text` | **카드 없이 사진 위 대형 흰 제목** — base/highlight-pass(screen)/shadow-pass(multiply) 멀티패스 + text-shadow. "회색 글자 금지" |
| S-04 | `.metric-window` | 이미지 창문 KPI 카드 + **실제 SVG 차트 의무** (장식 벡터 금지) |
| S-05 | `.refract-glass-card` | 굴절 글래스 (blur 20 + saturate) — 페이지당 상한 준수 |
| S-06 | `.lut-scene` | **여러 이미지를 하나의 색감으로** — grayscale+saturate 정규화 + 키 soft-light 오버레이. 단일 하네스 법의 원전 기법 |
| S-07 | `.selective-accent-scene` | 전체 저채도 + **한 지점만 키컬러 radial 강조** multiply |
| S-08 | `.paper-grain-layer` | 인쇄 그레인 마감 (1px 도트 격자) |
| S-09 | `.halftone-overlay` | 망점 포스터 오버레이 (9px 도트 + multiply) |
| S-10 | `.final-card` 스택 | 긴 이미지 창문 카드 N개 나열 — 실행/단계 비트의 클로징 |

**계보 선택 규칙**: R2 장르가 계보를 고른다 (보고/전략 → V7+AX ·
선언/무대 → V8 · 잡지/포트폴리오 → S) — 한 페이지에서 계보를 혼용할
때도 다크 무대는 V8 문법 하나로 통일한다 ("매 섹션 다른 구조 금지").

**대비 생존 규칙**: 스크림 위 텍스트는 typography 역할 그대로 — wash 위
잉크 텍스트 ≥7:1, tone 위 화이트 텍스트 ≥7:1 실측. 스크림을 뚫는 저대비
연출 금지 (읽히는 글이 우선 — page-as-text 계약). 실측은 Step 7.5
[[render-qa]] RQ2 가 집행한다.

## I2.6 — 부유 도형 safe-zone 법 (2026-08-28 신설)

> **동인.** 실전 1호에서 absolute 배치된 behind-shape 육각형과 crop--arch
> 가 (a) 스크롤 중 고정 pillbar 와 시각적으로 겹치고 (b) 특정 폭에서
> 매트릭스 표와 충돌했다. 도형은 씬의 숨구멍이지 콘텐츠의 경쟁자가
> 아니다 — 배치 가능 영역을 법으로 닫는다.

1. **fixed-nav 경로 금지.** 고정 상단 UI(pillbar·progress 등)가 있으면,
   부유 도형은 섹션 상단에서 **nav 하단 + 24px 밴드 안에서 시작할 수
   없다.** 도형이 높이 떠 있을수록 스크롤 내내 nav 와 스치는 빈도가
   올라간다 — 섹션 상단 1/4 은 도형 금지 구역이 기본값.
2. **콘텐츠 박스 겹침 금지.** absolute 도형의 bbox 는 텍스트 블록·표·
   카드의 bbox 와 **어떤 뷰포트 폭에서도** 교차할 수 없다. 이것을
   보장하는 두 가지 합법 배치뿐이다:
   - **그리드 열 편입 (권장)** — 도형을 in-flow 로 승격해 콘텐츠와 같은
     그리드의 전용 열에 앉힌다. 겹침이 구조적으로 불가능해진다.
   - **콘텐츠 max-width 밖 여백** — 콘텐츠 박스 바깥 마진 영역에만,
     해당 여백이 실존하는 브레이크포인트에서만 노출 (`display:none`
     하한 명시).
3. **z-order.** 장식 도형은 항상 콘텐츠 아래(z-index 음수 또는 콘텐츠
   래퍼가 위), `pointer-events:none`, `aria-hidden="true"` — 이 선언이
   [[render-qa]] RQ1-3/4 검출의 선택자 계약이기도 하다.
4. 도형 배치를 처방할 때는 **노출 브레이크포인트와 앉는 여백**을
   처방문에 명기한다 ("crop--arch, ≥1200px, 우측 그리드 열 220px").

## I2.7 — 스킴 변주 법 (v3.5 신설 — F44, 다크에서 씬이 소거된 실측이 동인)

> **동인.** 색은 V5 가 다크 재정의를 의무화하고 밝기는 I4/RQ1-6 이
> 스킴별로 검사하는데, **씬 3층 문법에는 스킴 조항이 없었다.** 그 결과
> 실전 3호에서: 라이트 밴드 기법의 층2 가 band 토큰(`color-mix`)이라
> 다크 스킴에서 "화이트 워시"가 **다크 워시로 뒤집히고**, 층1
> opacity(.34/.16/.40)는 라이트 튜닝 그대로 승계되어 — wash 33.1→5.5 ·
> behind 17.1→2.7 · luma 12.1→1.9 (텍스처 sd) 로 씬이 소거됐다.
> 처방 무이미지 3곳이 다크 실효 9곳이 된 주범이다.

1. **기법의 의미는 스킴 종속이다.** "wash = 화이트 스크림 아래 질감"은
   라이트 스킴의 정의다. 다크 스킴을 배선하는 페이지는 각 라이트-밴드
   기법의 **다크 변주를 명시적으로 정의**해야 한다 — 최소한 층1
   opacity/필터의 스킴별 재정의. **라이트 값의 무언 승계 = 위반.**
2. **다크-밴드 기법(cover/tone/neon/horizon — 고정 multiply 스크림)은
   스킴 불변**이 정상이다 — 이미 어두운 지면 위 정의라 두 스킴에서 같은
   텍스처를 낸다 (실측 sd 동일). 변주 의무는 라이트-밴드 기법
   (wash/behind/luma/cut/card-window)에만 있다.
3. **검증은 [[render-qa]] RQ2-OBS 가 두 스킴 각각** 집행한다 — 다크
   변주를 정의했다는 선언이 아니라 다크 렌더의 텍스처 실측이 증거다.
4. 다크를 배선하지 않는 페이지(V5 에 따라 다크 토큰도 emit 안 함)는
   이 절이 적용되지 않는다.

## I3 — 예산·재사용 법

- **raw-N 산정**: N ≈ ⌈씬 섹션 수 × 0.8⌉ (t004: 12섹션 → raw-10).
  섹션마다 새 이미지가 아니라 **재사용이 설계다**: 히어로↔푸터 동일
  raw 재사용(수미상관), 본문 raw 의 카드-윈도우 재등장(모티프 회귀).
- 재사용은 처방 테이블에 명시 (`05 재사용`, `01 재사용(.22)`) — 빌드가
  임의로 돌려쓰지 않는다.
- 장면-은유는 Beat Map 의 move 에서 도출한다: 비트가 "교정"이면 계측기
  매크로, "축적"이면 서가 원근 — **컨셉 없는 예쁜 이미지 금지** (그게
  스톡포토와의 차이다).

## I4 — 시퀀스 법

- **동일 기법 3연속 금지** (t004: cover→wash→blend→luma→wash→cut→blend→
  tone→horizon→wash→wash→tone ✓). 기법 시퀀스를 처방문에 한 줄로 명기.
- **밝기 교대 축 (2026-08-28 승격 — 기법 교대와 별도 축).** 배경 밝기를
  섹션마다 **D(다크)/M(미드)/L(라이트)** 로 분류해 시퀀스를 함께 명기
  한다. **동일 밝기 3연속 = 위반** — 기법이 바뀌어도 밝기가 같으면
  독자에게는 같은 지면이다 (실전 1호의 라이트 6연속이 동인). 미드톤
  지면(키 틴트 강화 밴드)은 이 축을 풀기 위한 정식 지면 등급이다.
  **분류는 페이지-상대다 (v3.4 — F15)**: 지면 휘도를 그 페이지·그
  스킴의 min–max 로 정규화한 뒤 3분위로 D/M/L 을 매긴다. 절대 임계
  (예: .18/.55)는 라이트 스킴의 편의 근사일 뿐 — 다크 스킴에서는 전
  지면이 D 로 수렴해 규칙이 무의미해진다 (실측: 같은 페이지가 절대
  분류로 라이트 `LMLDLMLDL` / 다크 `DDDDDDDDD`, 상대 분류로는 두 스킴
  이 동형). 교대 검사는 **두 스킴 각각**에서 통과해야 한다. 미드톤은
  상대 계단에서 실제로 가운데 단이어야 한다 — paper-2 급 미세 차이는
  M 이 아니다 (실측: paper-2 를 M 으로 쓰자 실측 L 로 판정돼 3연속
  위반).
- 다크 밴드(tone/cover)는 페이지 리듬의 파단점 — **본문 2~3곳 상한**
  (히어로 cover 무대 1곳 + 저농도 에코(opacity ≤ .25 푸터 등)는 상한
  산정에서 제외), 지면 교대 규칙(P1→P2→INK)과 정렬.
- **질감 축 (v3.5 — F45, 제3축).** 밝기 축·기법 라벨 축과 독립으로,
  **실측 저질감(텍스처 sd < 8, 콘텐츠 이미지 없음) 3연속 = 위반.**
  기법 라벨이 다양해도 픽셀이 같은 "빈 지면"이면 독자에게는 단조다 —
  실측: 라벨은 card-window/luma/무/wash012 로 다양한 구간이 픽셀로는
  {0 · 8.9 · 1.9 · 0 · 0.6} 이었고, 기존 두 축 어느 것도 울리지 않았다.
  실측은 [[render-qa]] RQ2-OBS 가 두 스킴 각각 집행한다.
- SIGNATURE 비트의 기법은 유일해야 한다 (t004: horizon 은 S9 한 곳).
- 밝기 시퀀스의 렌더 실측은 Step 7.5 [[render-qa]] RQ1-6 이 집행한다.

## I5 — 프롬프트 emit 법 (코덱스 핸드오프)

처방 시 `RAW-PROMPTS.md` 를 **함께 emit** 한다. 사용자 UX 는 복붙
한 번이 되도록:

**핸드오프 안내문 (파일 상단 고정)**:
```
사용법: 코덱스(GPT Codex)를 열어 새 세션에서 아래 프롬프트를 하나씩
복붙 → 생성된 PNG 를 {프로젝트}/assets/raw/raw-01.png ~ raw-NN.png
이름으로 저장 (번호 정확히) → 전부 모이면 저에게 "raw 들어왔어" 라고
알려주세요. 멀티모달 검수(하단 체크리스트) 후 실패분만 재생성 프롬프트를
다시 드리고, 전량 통과 시 webp 변환·최적화는 제가 실행합니다
(cwebp -q 82, 가로 1600px — 결과물은 assets/images/ 에).
검수 전량 통과 + "RAW OK" 승인 후에만 빌드가 시작됩니다.
```

**프롬프트 골격 6요소** (이미지마다 전부 포함):
1. `A photorealistic cinematic photograph.` 선언 (재료성 — 일러스트/
   3D/포스터 금지가 기본값; 컨셉이 요구할 때만 다른 선언)
2. **장면-은유** 2–3문장 (Beat move 에서 도출; 얕은 심도·스튜디오 촬영
   등 "판독 불가" 장치 포함)
3. **색 지시 줄 (I1.5 단일 하네스 법)** — `Natural, rich cinematic
   color.` + 브랜드 충돌 캐스트 금지 1줄만 (예: `no dominant warm-orange
   cast, no purple/magenta cast`). **키컬러 hex·"muted"·단색조 지시
   금지** — 톤 통일은 CSS 트리트먼트의 책임이다.
4. **Negative space 위치 지정** — 그 비트의 텍스트가 앉을 자리
   (`center-left third`, `upper half`, `bottom 40% band composition`…)
   + 필요시 "must survive a {dark navy|white} overlay" 명기
5. `Landscape 16:9, high resolution.`
6. **STRICT 금지 목록**: no readable text/letters/numbers/logos/
   watermarks/legible UI/charts/recognizable faces (+상황별: no people,
   no purple or magenta cast, no lens flare, no glowing particles)

## I6 — 검수 게이트 (HARD STOP)

raw5-deck Stage Hard Stop 승계: **이미지 전량 통과 전 빌드 금지.**
이미지별 10항 채점 (I1 의 10조건 그대로 표로) → 실패분만 번호 지목
재생성 → 10/10 PASS + 사용자 **"RAW OK"** 승인 → 빌드 시작.
검수는 멀티모달로 실제 파일을 보고 한다 — 파일명만 보고 통과 금지.

## I7 — 반응형·접근성

- 이미지마다 `--raw-pos`(데스크톱) + `--raw-pos-m`(모바일 리크롭)을
  처방 테이블에 기재 — 세로 화면에서 네거티브 스페이스가 유지되도록.
- 모바일에서 blend 는 수직 스크림으로 전환, `--raw-opacity` 재조정.
- `prefers-reduced-motion`: 이미지 패럴랙스/줌 전면 금지 (기본도 정적 —
  `transform:scale(1.015)` 고정만 허용).
- 배경 이미지는 의미 전달 수단이 아니다 — 정보는 항상 텍스트에 있고
  이미지는 분위기다 (alt 불필요한 CSS 배경으로만; `<img>` 콘텐츠
  이미지는 별도 규율).
- 성능: webp 필수, 섹션당 1장, `background-attachment:fixed` 금지
  (모바일 jank), 총 이미지 예산 ≤ 페이지당 3MB.

## Self-check (SKILL §2 Step 8 병합분)

- 씬이 있는 모든 비트에 `raw # + 기법 + 대비 티어 + --raw-pos(-m)` 가
  처방됐는가? 스킵이면 스킵이 선언됐는가? **그리고 `--raw-pos-m` 이
  빌드에 실제로 배선됐는가** (선언 ≠ 배선 — [[render-qa]] RQ1-9 실측,
  F41)?
- **커버리지 회계**: 처방문에 "무이미지 N/총" 이 명기됐고, N ≤ ⌈총/3⌉
  인가? 다크를 배선했다면 라이트-밴드 기법 전부에 **다크 변주**(층1
  op/필터 스킴별 재정의)가 정의됐는가 (I2.7)?
- 기법 시퀀스 한 줄이 있고 3연속이 없는가? SIGNATURE 기법이 유일한가?
- **밝기 시퀀스(D/M/L) 한 줄이 있고 동일 밝기 3연속이 없는가** (I4)?
- **부유 도형이 전부 safe-zone 합법 배치**(그리드 열 편입 또는 여백
  전용 + 노출 브레이크포인트 명기)인가 (I2.6)?
- RAW-PROMPTS 가 골격 6요소를 갖췄고 색 지시가 **자연색 + 충돌 캐스트
  금지 1줄뿐**인가 (키 hex 인용 = 이중 하네스 위반)?
- 배경은 3층(원본/트리트먼트/콘텐츠)이고, **도형 크롭이 원색 무필터**로
  최소 1곳 있는가? 인접 섹션 톤 연속·무이미지 연속 2+ 가 없는가?
- 재사용 계획이 명시됐는가 (히어로↔푸터 등)? 총 예산 ≤3MB?
- HARD STOP: "RAW OK" 승인 없이 빌드로 넘어가지 않았는가?

---

## 부록 — 씬 CSS 정본 v2 (Hallym_Media_Day 3층 문법, 키컬러 토큰 이식)

```css
.raw5-bg{isolation:isolate;overflow:hidden;position:relative;--raw-pos:center}
.raw5-bg::before,.raw5-bg::after{content:"";position:absolute;inset:0;pointer-events:none}
/* 층1 bg-full — 컬러풀 원본 + 미세 정규화만 */
.raw5-bg::before{z-index:0;background-image:var(--section-img);
  background-size:cover;background-position:var(--raw-pos);
  filter:saturate(.86) contrast(1.1)}
/* 층2 bg-treatment — 키컬러 톤 전담 */
.raw5-bg::after{z-index:1}
.band--dark.raw5-bg::after{mix-blend-mode:multiply;background:
  linear-gradient(135deg,rgba(K900,.9),rgba(K900,.68) 55%,rgba(K900,.5)),
  radial-gradient(circle at 78% 22%,rgba(K300,.26),transparent 31%),
  radial-gradient(circle at 10% 86%,rgba(KEY,.14),transparent 25%)}
.band--dark.raw5-bg{background:#000}  /* multiply 받침 */
.band--light.raw5-bg::after{background:
  linear-gradient(180deg,rgba(paper,.8),rgba(paper,.88)),
  radial-gradient(circle at 20% 15%,rgba(KEY,.10),transparent 30%)}
/* wash — 블러 워시 (정본: blur+저농도+확대) */
.raw5-wash::before{filter:blur(8px) saturate(.75) contrast(1.02);
  opacity:.38;transform:scale(1.08)}
/* blend / luma / cut / horizon / cover / neon — v1 마스크·클립 동일, 층2만 위 문법 */
.raw5-neon.band--dark.raw5-bg::after{background:
  linear-gradient(135deg,rgba(K900,.88),rgba(K900,.6)),
  radial-gradient(circle at 72% 18%,rgba(K300,.42),transparent 29%),
  radial-gradient(circle at 15% 80%,rgba(KEY,.2),transparent 25%)}
/* crop-shape — 무필터 원색 도형 크롭 */
.crop{position:relative;overflow:hidden;background-image:var(--crop-img);
  background-size:cover;background-position:var(--crop-pos,center)}
.crop--circle{border-radius:50%;aspect-ratio:1}
.crop--arch{border-radius:999px 999px var(--radius) var(--radius);aspect-ratio:3/4}
.crop--slab{border-radius:var(--radius);aspect-ratio:16/10}
.crop--cut{clip-path:polygon(0 0,100% 0,86% 100%,0 100%)}
.crop.framed{outline:1px solid var(--key);outline-offset:6px}
```

(K900/KEY/K300/paper 는 프로젝트 DESIGN.md 토큰으로 치환. 도형 크롭은
`filter` 선언 자체가 없다 — 원색이 규칙이다.)
