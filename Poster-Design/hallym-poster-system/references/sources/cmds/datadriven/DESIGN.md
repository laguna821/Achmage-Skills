---
type: documentation
aliases:
  - Data-Driven 덱 테마 DESIGN
description: "Design spec for the Data-Driven deck theme (final/themes/datadriven) — a rational UI-system look where every numeric value cites its dataset source: 4/8/24/32/48/64/96 spacing, Perfect-Fourth type ramp, radius 0, single semantic accent, Subtle-tier motion. Read when reskinning or copying this theme onto other deck content."
author:
  - "[[구요한]]"
model: "claude-fable-5-1[1m]"
effort: "high"
date created: 2026-09-09
date modified: 2026-09-09
tags:
  - deck
  - design-system
  - ui-ux-pro-max
CMDS: "[[📚 731 Digital Art and Design]]"
index: "[[🏷 Lecture Notes]]"
---

# Data-Driven — DESIGN

## 1. 한 줄 정의
눈이 아니라 데이터가 결정한 덱. 간격·타입·색 대비·모션의 모든 수치가 `ui-ux-pro-max` 데이터셋의 행(styles.csv / ux-guidelines.csv / motion.csv / design_system.py DIAL_TIERS)을 출처로 갖는 합리적 UI 시스템 룩이다. 카드는 그림자 없이 면색 세 단계와 헤어라인으로 층을 만들고, 액센트는 하나만, 강조와 의미 경계에만 쓴다.

## 2. 언제 쓰나 / 쓰지 말 것
- **쓴다** — 숫자·표·비교·바 차트가 많은 기술 발표. 개발자·분석가·임원 중 "왜 이렇게 생겼나"에 근거를 묻는 청중. 발표 후 그대로 웹 문서로 공유할 덱. 다크모드가 필요한 자리.
- **쓰지 않는다** — 편집 디자인·감성이 본체인 자리(→ Editorial Scroll·Typographic Poster). 사진·일러스트 중심 덱. 장식 자체가 메시지인 키노트.

## 3. 시그니처 결정 5개

### 3.1 간격 스케일 4/8/24/32/48/64/96
- **무엇** — 모든 패딩·갭·마진이 일곱 값 중 하나.
- **왜** — `design_system.py` DIAL_TIERS density 1-3 "Spacious" 티어 값 그대로. 정보 4층 이상인 장(9그리드·표·바·타임라인·사다리·터미널·토글·카드)은 density 4-7 "Standard"(md 24→16, lg 32→24, xl 48→32, gap 32→24)로 한 칸 내린다.
- **어떻게** — `--sp-xs:4px --sp-sm:8px --sp-md:24px --sp-lg:32px --sp-xl:48px --sp-2xl:64px --sp-3xl:96px; --gap:32px` (swiss `gap:2rem`). dense: `.k-grid:not(#s02), .k-table, .k-bars, .k-timeline, .k-ladder, .k-terminal, .k-toggle, .k-cards{ --sp-md:16px; --sp-lg:24px; --sp-xl:32px; --gap:24px }`. 슬라이드 패딩 `80 / 112 / 64`(원본 `clamp(2.5rem,6vw,8rem)`@1920 = 115 → 8px 격자 정렬).

### 3.2 타입 램프 Perfect Fourth (1.333)
- **무엇** — 8단 램프, 단 간 비율 1.333.
- **왜** — `styles.csv` exaggerated-minimalism의 `clamp(3rem,10vw,12rem)` 앵커를 1.333 하향 전개한 원본 램프. 원본 clamp 를 1920×1080 에서 평가하면 120/80/52/36/28/22/16/17 인데 이는 *읽기 거리* 앵커라 1080 캔버스의 아래 절반이 비었다(1차 스크린샷 실측). **무대 거리용으로 같은 램프를 정확히 한 단(×1.333) 올렸다** — 비율·단 수·역할은 원본 그대로, 앵커만 한 칸 위.
- **어떻게** — `--t-display:160 --t-h1:107 --t-h2:69 --t-h3:48 --t-lead:37 --t-body:29 --t-caption:21 --t-mono:23`. 행간 `display 1.15 / h1 1.2 / h2 1.28 / body 1.65 / caption 1.5`(ux-guidelines Line Height 1.5–1.75). 자간 `display -.035em / h1 -.025em / h2 -.02em / body -.01em`(데이터셋 -.05em 은 한글에 과함 → 완화). 굵기 `display 800`(900 은 한글 속공간 막힘).

### 3.3 radius 0 · shadow none · 면색 3단 층위
- **무엇** — 모서리 0, 그림자 0. 층위는 `bg → surface → surface-2` 세 면색과 1px 헤어라인.
- **왜** — `styles.csv` minimalism-and-swiss-style Design System Variables `--border-radius:0px; --shadow:none`. "subtle elevation" 은 그림자가 아니라 면색 단계로 표현하는 것이 이 행의 결정.
- **어떻게** — `.cell/.step/.tick/.tg/.compare .col/.body-list li{ background:var(--surface); border:1px solid var(--hairline); border-radius:0 }`. 강조(`.hi`·`.b`·마지막 항목)는 `background:var(--tint-2); border-left:3px solid var(--acc)`.

### 3.4 액센트 하나 원칙
- **무엇** — 라이트 green `#134538`, 다크 pink `#E985A2` 하나만. 강조·의미 경계·진행 표시에만.
- **왜** — 같은 swiss 행 `--accent-color: single primary only`. `ux-guidelines` Color Only [High]: 선택 상태는 색 + 모양(✓ 글리프, 도트 8×8→8×18) 으로.
- **어떻게** — 비강조 바 채움은 `var(--rule)` 중성, `.bar.hi` 만 `var(--acc)`. 토글 선택 버튼 `background:var(--acc); color:var(--on-acc)` + `::before{content:"✓ "}`. 액센트 위 글자는 라이트 `#FFFFFF`(10.85:1) / 다크 `#1B1B1B`(6.84:1).

### 3.5 모션 Subtle 티어
- **무엇** — 순차 공개 340ms 상승 12px, 슬라이드 진입 260ms, 호버 180ms, stagger 30ms, exit 0ms.
- **왜** — `motion.csv` Subtle tier: Page Transition 200–300 / Scroll Reveal 300–400 / Hover Micro 150–200 / y offset 8–16px / stagger 0.02–0.04s. exit < entrance(비대칭) 는 같은 파일 Performance Notes.
- **어떻게** — `--dur-in:260ms --dur-reveal:340ms --dur-hover:180ms --reveal-y:12px --stagger:30ms; --ease-out:cubic-bezier(.25,.46,.45,.94)`(power1.out) `--ease-io:cubic-bezier(.455,.03,.515,.955)`(power1.inOut). `html.js [data-step]` 을 덮어써 코어 기본(.45s ease) 대신 340ms power1.out.

## 4. 토큰 표

### 4.1 색 (CI 색상 · 원본 대비 목표 유지)
원본은 slate 중성(`#0F172A` / `#F8FAFC` 계열)을 썼다. 계약 §4.2(CI 두 토큰과 톤 변주만)에 맞춰 **색상은 CI green 으로 재산출하고 원본이 확정한 대비 목표(본문 AAA · 보조 AAA · 캡션 AA · 의미 경계 3:1+)는 그대로 지켰다.** 대비는 bg 기준 실측.

| 토큰 | 라이트 | 대비 | 다크 | 대비 | 역할 |
|------|--------|-----:|------|-----:|------|
| `--bg` | `#F6F8F7` | — | `#0E1512` | — | 슬라이드 바탕 (green @4% / green-black) |
| `--surface` | `#FFFFFF` | — | `#182019` | — | 카드·표 헤더·패널 |
| `--surface-2` | `#E7ECEB` | — | `#232C26` | — | 바 트랙·도판 박스 |
| `--fg` | `#0E1F1B` | 16.0 | `#F3F5F3` | 16.9 | 본문 (원본 목표 ≥13.9 / ≥17) |
| `--fg-2` | `#45554F` | 7.39 | `#C8D1CC` | 11.85 | 보조 (원본 목표 ≥7.0 AAA) |
| `--fg-3` | `#66756F` | 4.54 | `#94A29B` | 6.96 | 캡션·라벨 전용 (AA) |
| `--hairline` | `#DEE5E3` | 1.2 | `#3D4842` | 1.94 | 장식 구획선 전용 |
| `--rule` | `#66756F` | 4.54 | `#6E7D77` | 3.82 | 의미를 전달하는 경계 (≥3:1) |
| `--acc` | `#134538` | 10.17 | `#E985A2` | 7.35 | 액센트 하나 |
| `--on-acc` | `#FFFFFF` | 10.85* | `#1B1B1B` | 6.84* | 액센트 채움 위 글자 (*acc 기준) |
| `--tint-1/2/3` | `#F6F8F7 / #ECF0EF / #E3E9E7` | | `#1B1C1B / #242020 / #312729` | | acc @4/8/12% (라이트) · @6/10/16% (다크) |

### 4.2 타이포 (px, 1920 캔버스)

| 단 | 크기 | 행간 | 용도 |
|----|-----:|-----:|------|
| display | 160 | 1.15 | 표지·섹션 헤드라인 |
| h1 | 107 | 1.2 | 선언(statement)·인용·클로징 헤드라인·stat 숫자 |
| h2 | 69 | 1.28 | 콘텐츠 장 헤드라인·토글 라벨 |
| h3 | 48 | 1.3 | 카드·스텝·틱 제목 |
| lead | 37 | 1.5–1.62 | 리드·비교 리스트·바 값 |
| body | 29 | 1.55–1.65 | 카드 본문·표·바 라벨 |
| caption | 21 | 1.5 | 각주·kicker·status |
| mono | 23 | 1.4–1.75 | 번호·라벨·터미널 |

### 4.3 간격 · 선
- 간격: §3.1. 슬라이드 패딩 `80/112/64`, 16:10 은 `96/112/80`.
- 선: 장식 `1px`(hairline) · 의미 경계 `1.5px`(rule, 세그먼트 컨트롤) · 강조 좌측 `3px`(acc) · stat·틱 상단 `2px` · 진행바 `2px`.

## 5. 콘텐츠 클래스 → 이 테마의 해석

| kind | 해석 |
|------|------|
| `k-cover` | display 160 헤드라인, kicker 는 fg-3 모노, 리드 h3, 푸터 모노 캡션. 콘텐츠 블록 세로 중앙 |
| `k-section` | display 헤드라인 + h2 sub(fg-2) + 96px 2px 액센트 괘선 + 모노 리드(fg-3) |
| `k-statement` | h1 107 / 800, `em` 은 액센트. `.body-list` 는 헤어라인 패널 3단, 마지막 항목 tint-2 + 액센트 좌측 3px |
| `k-steps` | 4열 surface 패널, 좌측 3px 헤어라인, 패널 사이 `→`, 마지막 아래 `⟲` (원본 .loop) |
| `k-ladder` | 세로 4단 `140px 380px 1fr` 그리드 패널, `.hi` 는 tint-2 + 액센트 좌측선 (원본 .ladder) |
| `k-grid` / `k-cards` | `.cell` = surface 패널. nine 은 dense 티어. constellation·links 제목은 모노(코드 식별자) |
| `k-stats` | 액센트 2px 상단 괘선, 숫자 h1 107 액센트 tabular-nums, 단위 h3, 라벨 body fg-2 (원본 .counter) |
| `k-table` | 헤어라인 행, thead 모노 대문자 fg-3 + rule 하단선, `.hi` 열 tint-2 + 액센트 좌측 3px + fg 600 |
| `k-quote` | 액센트 좌측 3px, p 는 h1 107 / 800, cite 모노 fg-3 |
| `k-diagram` | svg 를 surface 패널에 담음. rect surface-2 + rule 1.4, 가운데 층 tint-2 + acc 1.6, 화살표 acc 2px, 루프 rule 점선 |
| `k-compare` | 2열 패널, 우측(`.b`) tint-2 + 액센트, 불릿은 8px 사각(rule/acc) |
| `k-terminal` | tint-2(라이트)/tint-1(다크) + rule 1px, 모노 23/1.75, prompt·ok 액센트, dim fg-3 |
| `k-timeline` | 5열 패널, 상단 2px. 30·60·90 틱만 액센트 상단선, 90일은 tint-2 (발표자 노트 "본체" 반영) |
| `k-bars` | 대시보드: 행 패널 `1fr 640px 96px`, 트랙 12px surface-2, 채움 rule(비강조)/acc(`.hi`), 값 모노 lead. 스텝 공개 시 width 0→값 340ms |
| `k-toggle` | 세그먼트 컨트롤: rule 1.5px 외곽, 버튼 min 44×44, 선택 = acc 채움 + ✓. `.tg` 상단 2px, harness 뷰에서 액센트 |
| `k-outro` | h1 헤드라인, links 제목 모노 34 액센트 밑줄, 리드 600 fg |

## 6. 모션 · 순차 공개 규칙
- `[data-step]`: 340ms power1.out, 12px 상승. SVG 내부는 변위 0.
- 스텝이 없는 묶음(`.cell`·`.stat`·`.tbl tbody tr`·`.compare .col`)은 슬라이드 진입 시 30ms stagger 로 함께 뜬다(Stagger List Subtle).
- 슬라이드 진입 260ms power1.inOut 페이드+12px, exit 0ms(비대칭).
- `.bar-track i` 는 `.in` 전 width 0.
- `prefers-reduced-motion`: 코어가 스텝을 즉시 공개, 테마는 슬라이드 진입·stagger 애니메이션을 끈다.

## 7. 크롬 · 진행 표시
- 슬라이드 안(theme.js 주입, 원본 .kicker/.status/.rail/.progress): 우상단 `섹션코드 / 섹션명`(fg-3 모노), 좌하단 `NN / 24 · 제목`(fg-2 모노), 우측 24×24 히트영역 도트 레일(8×8 헤어라인, 섹션 시작 rule, 활성 acc 8×18), 하단 2px 액센트 진행바.
- 코어 패널 재스킨: `--dk-panel-bg:surface --dk-panel-fg:fg-2 --dk-panel-line:hairline --dk-font:mono --dk-accent:acc`, 버튼 radius 0, 호버 acc.

## 8. 금지 목록
- radius > 0, box-shadow, 그라디언트 배경.
- 액센트 2색 동시 사용, 비강조 요소에 액센트 채움.
- 데이터셋 7값 밖의 간격(예: 20px·40px).
- Inter/Roboto/Arial/Fraunces. 웹폰트·CDN·이미지.
- 이모지 prefix(🏛📖📚🏷)를 슬라이드 본문에.
- 코어 패널 구조 변경·숨김, 자체 키 리스너.

## 9. 복사해서 쓰는 법
1. `themes/datadriven/theme.css` + `theme.js` 를 새 덱 폴더에 복사하고 `theme.json` 의 `name`만 바꾼다.
2. 콘텐츠는 CONTRACT §3 마크업 계약을 지킨다 — `section.slide.k-*` + `.kicker .headline .lead .foot`, 컴포넌트는 `.cell/.step/.stat/.tick/.tg/.bar` 와 `data-step`.
3. `python3 build.py --themes {slug}` → `tools/verify.py` 로 overflow/overlap 0 확인. 정보 4층 이상인 새 kind 는 dense 셀렉터 목록에 추가한다.

## 10. 계보 · 출처
- 원본: `../v3-uiux-datadriven/index.html` + `NOTES.md` (2026-09-02 2차 수리본). 데이터 출처 표는 원본 NOTES "데이터 근거" 절이 정본.
- 데이터셋: `ui-ux-pro-max` — styles.csv(minimalism-and-swiss-style · exaggerated-minimalism · editorial-grid-magazine), ux-guidelines.csv, motion.csv, colors.csv, design_system.py DIAL_TIERS.
- 상위 규약: [[DESIGN.md]] §1 CI 토큰 · §2 Anti-Slop. 계약: `final/CONTRACT.md`.
