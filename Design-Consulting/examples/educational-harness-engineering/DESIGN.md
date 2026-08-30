---
version: alpha
name: Educational Harness Engineering — 계측된 지면
description: >
  Cold single-hue (teal) closed-set design tokens for a publicly shared,
  evidence-first manifesto by a Korean media-school professor arguing that
  student workarounds are an assessment-design failure. Derived from brand
  words 계기적 · 하중을 견디는 · 낮은 온도의 단호함 by refining a
  ui-ux-pro-max recommendation through component-consulting-v3's
  visual-identity (V1–V5), typography-prescription (T1–T6) and
  grid-prescription (G1–G5) laws. Body language is Korean (CJK hard rules
  blocking). Borders only — zero shadows.

colors:
  # 채색 = 한 계열(teal ~186°)의 명도 사다리. 경쟁하는 제2 hue 없음 (V2 L1).
  key-900: "#04343A"
  key-700: "#0A6069"
  key: "#0B7C87"
  key-300: "#7FBFC6"
  key-050: "#E8F3F4"
  # 중립 = 컬러 예산 밖 별도 사다리, 키 hue 쪽으로 미세 틴트 (V2 L4).
  paper: "#FBFCFC"
  paper-2: "#F1F5F5"
  ink: "#0E1719"
  pencil: "#3A4A4D"
  faint: "#66787C"
  border: "#DDE6E7"
  border-hard: "#B9C7C9"
  # 라이트 스킴 안의 어두운 지면(밝기 교대 축 I4)에서 쓰는 대응색.
  onink-strong: "#EEF5F5"
  onink-body: "#C3D2D4"
  onink-soft: "#8FA2A5"
  onink-line: "#22343A"
  onink-key: "#6FD3DE"
  # 다크 스킴 = 같은 hue 의 명도 재정의 (V2 L1 · V5 활성 경로 의무).
  dk-paper: "#0B1416"
  dk-paper-2: "#121F22"
  dk-ink: "#E9F1F1"
  dk-pencil: "#B3C3C5"
  dk-faint: "#83989B"
  dk-border: "#223236"
  dk-border-hard: "#33474B"
  dk-key: "#4FC2CE"
  dk-key-soft: "#2A7B85"
  dk-key-wash: "#10262A"

typography:
  display:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.594rem, 1.6rem + 4.4vw, 4.05rem)"
    fontWeight: 800
    lineHeight: "1.06"
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.66rem, 1.2rem + 2.1vw, 2.594rem)"
    fontWeight: 800
    lineHeight: "1.2"
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.328rem, 1.15rem + 0.8vw, 1.66rem)"
    fontWeight: 600
    lineHeight: "1.35"
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: "1.78"
    letterSpacing: "0"
  body-strong:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: "1.78"
    letterSpacing: "0"
  label:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: "1.45"
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0"
  figures:
    fontFamily: "Asta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.075rem, 1.2rem + 4vw, 3.242rem)"
    fontWeight: 800
    lineHeight: "1.0"
    letterSpacing: "-0.03em"
    fontFeature: "tnum"

spacing:
  unit: 4px
  gutter: "clamp(20px, 5vw, 48px)"
  # G1 폭 사다리 — 폐집합. 섹션 콘텐츠 박스의 max-width 는 이 넷 중 하나다.
  prose: 720px
  content: 900px
  wide: 1240px
  satellite: 560px

rounded:
  none: 0px
  sm: 2px
  md: 6px
  pill: 999px

components:
  section:
    minHeight: 100svh
    paddingInline: "{spacing.gutter}"
    borderTop: "1px solid {colors.border}"
  rule:
    height: 1px
    background: "{colors.border-hard}"
  stat-figure:
    font: "{typography.figures}"
    color: "{colors.key-700}"
  stat-unit:
    font: "{typography.label}"
    color: "{colors.faint}"
  quote-frame:
    borderLeft: "2px solid {colors.key-300}"
    paddingLeft: "24px"
    background: "transparent"
  source-tag:
    font: "{typography.caption}"
    color: "{colors.faint}"
    borderBottom: "1px solid {colors.border}"
  verdict-cell:
    border: "1px solid {colors.border}"
    borderRadius: "{rounded.sm}"
    background: "{colors.paper}"
  fold:
    border: "1px solid {colors.border}"
    borderRadius: "{rounded.sm}"
    font: "{typography.caption}"
---

# Educational Harness Engineering — Design System

> **Derived, not consumed.** 이 프로젝트에는 선행 `DESIGN.md` 가 없었다.
> `component-consulting-v3` **경로 C (refine-external)** 으로 도출했다 —
> `ui-ux-pro-max` 산출을 **원료**로 받아 visual-identity(V1–V5) ·
> typography-prescription(T1–T6) · grid-prescription(G1–G5) 으로 정련.
> 외부 산출 원문 + 질의문: `_work/uupm-raw-01-design-system.md` ·
> `_work/uupm-raw-02-color-type.md` (하드룰 5 — 재현성).
> 소거 기록은 각 섹션 말미에 있다. **충돌은 v3 법이 이기되, 침묵으로
> 이기지 않는다.**

## Overview

브랜드 3어 (V1 — R1×R2 에서 도출, "modern/clean/elegant" 금지):

1. **계기적 (instrumented)** — 이 페이지는 계측 판독이다. 수치가 읽히고,
   출처가 달리고, 검증 상태(✓/⚠️)가 표시된다. 장식은 판독을 방해한다.
2. **하중을 견디는 (load-bearing)** — 하네스는 장식이 아니라 구조물이다.
   모든 요소가 논증의 하중을 받는다. 하중을 안 받는 요소는 없다.
3. **낮은 온도의 단호함 (cold conviction)** — 소리 지르지 않고 단정한다.
   R1 의 독자는 근거 없는 훈계에서 이탈한다. 페이지는 차갑게 말하고,
   뜨거움은 **문장**이 감당한다 — 색이 아니라.

이 3어가 색·폰트·그리드의 공용 심판이다. 판단이 갈릴 때마다 3어로
되돌아간다.

## Colors

**폐집합 (V2 L1)**: 채색 팔레트는 **teal 한 계열(~186°)의 명도 사다리**
`key-900 → key-700 → key → key-300 → key-050` 뿐이다. 경쟁하는 제2 hue
없음. 중립은 컬러 예산 밖의 별도 사다리이되 **키 hue 쪽으로 미세 틴트**
(V2 L4) — 죽은 순수 회색이 아니라 쿨한 지면이라, 키가 얹혔을 때 온도가
어긋나지 않는다.

**희소 (V2 L3)**: 키는 배경을 물들이지 않는다. 키의 자리는 (a) 수치
`stat-figure` (b) 인용 프레임의 좌측 규칙선 (c) 활성/포커스 상태 (d) 링크.
그게 전부다. 첫 화면에 키 계열이 실재하되(=적용 실패가 아니되) 면적은
좁다.

**의미색 없음 (V2 L5)**: 이 페이지는 검증 상태(✓ 검증됨 / ⚠️ 원문 대조
미완)를 표시해야 한다. 그러나 `judgment-*` 네임스페이스를 **만들지
않는다** — L5 가 명시하듯 *문서형 페이지의 "미확인"은 빨강이 아니라
"무게 없음"의 회색*이다. ⚠️ 항목은 `faint` + 형태(점선 하단선)로
구분하고, 빨강/앰버/초록 신호등은 쓰지 않는다. 폐집합이 그만큼 단단해진다.

**다크 (V2 L1 · V5)**: 같은 hue 의 명도 재정의 (`dk-*`). **활성 경로는
`prefers-color-scheme` + 수동 토글 둘 다 배선한다** — 배선 없는 다크
토큰은 죽은 코드다(F21 실측). 다크에서도 채색은 여전히 단일 teal 계열.

### 소거 기록 (L6 reflex 기각 + 외부 산출 정련)

반사적으로 집었을 색을 적고 버린다:

| 기각 대상 | 출처 | 사유 |
|---|---|---|
| 인디고–바이올렛 | AI 기본값 | impeccable 명시 reflex. 이 소재와 무관 |
| tailwind `blue-500` | AI 기본값 | 동상 |
| green `#15803D` + amber `#D97706` + red `#DC2626` | **uupm `--design-system`** | **경쟁 hue 3종 = V2 L1 위반.** 게다가 팔레트 노트가 *"Discovery green + volunteer badge"* — 이 페이지와 무관한 아키타입에 매칭된 증거. Pattern 의 *"Status colors (green/amber/red)"* 도 L5 위반(요구 없는 의미색) + V1 3어("낮은 온도")와 충돌 |
| pink `#EC4899` (Editorial black + accent pink) | uupm `--domain color` R1 | 낮은 온도 위반 |
| gold `#A16207` (Premium/Luxury + gold) | uupm `--domain color` R3·R5·R6 | 온난 + "luxury" 어휘가 R2 장르(증거보고)와 무관 |
| 한림대 navy/blue/teal 3종 세트 | 내부 정본 반사 | 이 페이지는 한림 브랜드 페이지가 아니라 **저자 개인 논증**이고, 실전 1호가 이미 그 스킨이다 |
| 보안 = 빨강 경고색 | 도메인 반사 | L5 (요구 없으면 중립 우선) |
| 형광 초록 on black | "해커 미학" 클리셰 | reflex |

**살아남은 외부 원료 (실제 채택)**: uupm `--domain color` 6행 중 **5행이
"무채색 잉크 + 단일 채색 액센트 + 근백색 지면"** 구조였다 — 구조는
V2 L1/L3 와 정확히 정합하므로 **구조를 채택**한다. **hue 선택은 채택하지
않는다** (하드룰 4: 역할 팔레트를 그대로 매핑하지 않고 L1 폐집합으로
재도출).

**teal 도출 근거**: 소재 어휘가 *하네스 · 공격면 · 침투 테스트 · 계측 ·
증거* 다. 계측·엔지니어링 계열의 한랭 hue 이며, AI reflex(인디고)도
tailwind blue 도 신호등 green 도 아니고, V1 3어("낮은 온도" ✓ "계기적" ✓
"하중" — deep 단계로 구조 확보 ✓) 전부를 통과한다.

## Typography

**단일 패밀리 (T1)**: **`Asta Sans`** 하나. 무게 사다리(400 / 600 / 800 —
**3종**, T4 상한 4 이내)가 위계의 1차 수단이다.

**impeccable 오버라이드 (T1.2 선언분 발동)**: impeccable
`typography_rules` 는 *"DO NOT use only one font family for the entire
page. Pair a distinctive display font with a refined body font"* 라고
한다. **이 페이지에서는 T1 이 이긴다** — 본문이 한국어이고, 라틴 전용
display 를 얹으면 한글이 시스템 폰트로 폴백되며 혼종 조판이 된다
(V3 L4). impeccable 에서 **승계하는 블록**은 `reflex_fonts_to_reject`
원문 대조 · `font_selection_procedure` Step 1–4 · slop bans ·
"vary across projects" 다. 오버라이드는 "pair display+body" 조항 **하나**
로 한정한다.

**스케일 (T2)**: 비율 **1.250 (Major Third)** — T2 표의 *문서·프로덕트·
에디토리얼(중대비)* 칸. base 17px(`1.0625rem`). 사다리
`13.6 / 17 / 21.25 / 26.56 / 33.20 / 41.50 / 51.88 / 64.85`.
모든 `font-size` 는 이 사다리 토큰 또는 사다리 양끝 `clamp` 여야 한다 —
**인라인 크기 발명 = NO-GO** (T6 grep 감사).

**역할 시트 (T3)**: 위 YAML `typography:` 8역할이 시트다. 컴포넌트 처방은
시트 확정 **후에만** 진행한다. 특히 `figures` 역할은 이 페이지의 핵심
페이로드(95% · 211/387 · 61.3% · 5분)를 받으며, **수치가 단위·라벨보다
반드시 크고 무겁다** (T6 역할 바인딩 감사 — "283시간" 재발 방지 항목).

**CJK 하드룰 (V4 — 블로킹)**: `word-break: keep-all` 본문 루트 ·
한국어 헤드라인을 `Nch` 로 절단 금지 · 한글에 양수 장평 트래킹 금지
(display 의 음수 트래킹은 허용) · `overflow-wrap: anywhere` 는 URL·DOI
등 기계 문자열에만 국소 적용.

### 폰트 3중 게이트 실측 (하드룰 3)

| 후보 | 출처 | 게이트 1 (impeccable 원문 대조) | 게이트 2 (T1) | 게이트 3 (V3 L4 본문 언어) | 판정 |
|---|---|---|---|---|---|
| **Crimson Pro** | uupm `--design-system` heading | ❌ **reject 목록 등재** (원문 93행) | — | — | **기각** |
| **Atkinson Hyperlegible** | uupm `--design-system` body | ✓ 목록 밖 | — | ❌ **라틴 전용** — V3 L4 가 이 패밀리를 **이름으로 지목**해 금지 | **기각** |
| IBM Plex Sans KR | 내 반사 후보 | ❌ **부모 패밀리 `IBM Plex Sans` 등재** (원문 100행) | — | — | **기각** |
| Pretendard Variable | 내 반사 후보 | ✓ | ✓ | ✓ | 기각 — **실전 1호가 사용** (vary across projects) |
| Wanted Sans Variable | 내 반사 후보 | ✓ | ✓ | ✓ | 기각 — **실전 2호가 사용** |
| **Asta Sans** | **uupm `--domain google-fonts`** | ✓ 목록 밖 (부모 패밀리 없음) | ✓ 가변 `wght 300–800` | ✓ **coverage: korean + latin** | **채택** |

**Asta Sans 실재 검증 (기억 대조 금지)**: `fonts.google.com/metadata/
fonts/Asta Sans` 직접 조회 — 제작 **42dot**(*"We Are A Mobility AI
Company"*), 라이선스 **OFL**, 축 **wght 300–800**(default 400), coverage
**korean + latin**. `css2` API 가 6 weight `@font-face` 를 실제로 반환함을
확인. uupm CSV 의 주장(`Subsets: korean | latin`)을 1차 출처로 교차 확인한
것이지, CSV 를 신뢰한 것이 아니다.

**부수 정합**: 42dot 은 자율주행 모빌리티 AI 회사다 — 이 페이스는 계기판
UI 계보이고, V1 1어 "계기적"과 의미가 맞는다. 선정 사유가 아니라
사후 확인이다.

## Layout

**폭 사다리 (G1 — 폐집합)**: 섹션 콘텐츠 박스의 `max-width` 는 **넷 중
하나**다. 임의 폭 발명 = G5 위반.

| 토큰 | 값 | 용도 |
|---|---|---|
| `{spacing.wide}` | 1240px | 전폭 그리드 지면 (증거 격자·비교표·사례 벤토) |
| `{spacing.content}` | 900px | 문서 지면 (표·인용 묶음·목록) |
| `{spacing.prose}` | 720px | 행길이 지면 (본문 산문) — 한국어 기준 |
| `{spacing.satellite}` | 560px | 접힘 부록·각주·메타 |

**에지 정렬 (G2 — 의무)**: 페이지를 세로로 훑을 때 콘텐츠 **좌 에지의
고유 x 값 집합 = 위 4개 토큰의 에지뿐**이어야 한다. 섹션마다 에지가
미끄러지면 지면이 아니라 표류다. 내부 그리드의 컬럼 트랙은 같은 wide
에지 안에서 **분할만 바꾸어** 공명시킨다 (권장).

**스팬 문법 (G4)**: 기본은 **비대칭 스팬** — 12컬럼 격자 위에서 비트의
mass 가 스팬을 정한다. 균등 N열 카드 그리드를 **1차 레이아웃으로 쓰지
않는다**(fit-rubric Axis D 감점). 동급 항목 나열(예: 5가지 설계 질문)에
균등 그리드를 쓸 경우, 그것은 지면 속 **한 블록**이지 지면 자체가 아니다.

**충전 (G3)**: 그리드는 할당 폭을 채운다 — 트랙 합/컨테이너 실폭 ≥ .96.
못 채우면 트랙 수를 줄이거나 tier 를 강등한다.

**슬라이드 단위**: 모든 섹션은 기본적으로 `min-height: 100svh` + 콘텐츠
수직 센터링. 예외(부록·푸터)는 처방문에 선언하고 `data-slide-exempt`.

## Elevation & Depth

**보더 온리 — 그림자 0.** V1 2어 "하중을 견디는"의 직접 귀결이자
impeccable *"borders over shadows"* 승계. `box-shadow` 는 이 시스템에
존재하지 않는다 (포커스 링 제외). 깊이는 **지면의 밝기 교대**로 만든다
— 밝은 지면(`paper`) / 중간 지면(`paper-2`) / 어두운 지면(`key-900`
계열)의 3등급이며, **동일 밝기 3연속 금지**(image-prescription I4).
글래스모피즘·AI-aura glow·그라데이션 지면 전부 금지.

## Shapes

`rounded` 어휘는 **4종뿐**: `none 0` (기본값 — 지면·표·구획) ·
`sm 2px` (칩·태그·인용 프레임) · `md 6px` (접힘 블록·이미지 크롭) ·
`pill 999px` (상태 점 전용). 큰 라운드는 이 페이지의 태도와 어긋난다 —
계측 장비는 모서리가 둥글지 않다.

## Components

위 YAML `components:` 블록이 사전 결정한 것들 — 후속 단계는 이를 **소비**
하며, 여기서 이미 정해진 것을 다시 정하지 않는다. 모든 색 값은
`{colors.*}` 참조다 (V2 구조 강제: 폐집합이 문법으로 강제되면 제2 hue 는
토큰을 추가하지 않는 한 물리적으로 들어올 수 없다).

## Do's and Don'ts

**Do**

- 수치는 `figures` 역할로 렌더하고, 단위·라벨은 반드시 그보다 **작고 가볍게**.
- 모든 통계에 출처 태그(`source-tag`)를 붙인다 — report 장르의 provenance 계약.
- ⚠️ 원문 대조 미완 항목은 **정직하게 표시**하되 `faint` + 형태로만.
- 저자 실적은 **"안창현의 2026-1 수업에서"** 주어를 달고 쓴다 (②→I2 세탁 금지).
- 다크 스킴을 emit 했으므로 **활성 경로를 반드시 배선**한다.

**Don't**

- 그라데이션 텍스트(`background-clip: text`) · 장식 사이드 스트라이프
  (`border-left > 1px` as ornament) — Step 7 auto-fail.
- 신호등 색(green/amber/red)으로 판정 표시 — L5 위반.
- 진입 애니메이션으로 콘텐츠를 **숨겼다가** 드러내기 — 스크립트 미실행
  상태에서도 콘텐츠가 보여야 한다 (`.js` 스코프 progressive enhancement).
- 한국어 헤드라인을 `ch` 폭으로 절단하거나 한글에 양수 트래킹.
- 사다리 밖 `font-size`, 폭 토큰 밖 `max-width` — 각각 T6 · G5 에서 NO-GO.
- 균등 N열 카드 그리드를 섹션의 1차 레이아웃으로 사용.
