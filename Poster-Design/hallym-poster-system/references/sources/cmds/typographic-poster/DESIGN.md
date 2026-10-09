---
type: documentation
aliases:
  - Typographic Poster DESIGN
  - 활자 포스터 테마 설계
description: "Design spec for the Typographic Poster deck theme (port of v14 onto the shared deck core): Swiss poster grid, 1700px headline measure lock, four accent color-plane section dividers, typographic rows instead of tables, in-sheet tally-tick progress. Reference when applying this theme to new deck content or comparing final themes."
author:
  - "[[구요한]]"
model: "claude-fable-5-1[1m]"
effort: "high"
date created: 2026-09-09
date modified: 2026-09-09
tags:
  - deck
  - design-system
  - typography
CMDS: "[[📚 731 Digital Art and Design]]"
index: "[[🏷 Lecture Notes]]"
session-link: "omnicontrol://focus?workspace=F16E53B8-C34B-4A18-B844-37D380F04A26&surface=2151B816-C318-490A-8B71-FF47057AB64B&label=final&cwd=%2FUsers%2Fyohankoo%2FLocal+Obsidian_MBP%2FCMDSPACE_Local_MBP%2F70.+Outputs%2F74.+Projects%2F%EB%B0%9C%ED%91%9C%EB%8D%B1+%EC%8B%9C%EC%8A%A4%ED%85%9C+%EB%B9%84%EA%B5%90%2Ffinal&session=2a28e4a9-fb82-4811-8557-c638cda3e4ba&revive=1"
---

# Typographic Poster — DESIGN

## 1. 한 줄 정의
슬라이드 한 장 = 스위스 활자 포스터 한 장. 헤드라인이 1700px 측정폭에 잠기고, 표·카드·차트는 1px 괘선의 활자 행으로 해체되며, 네 장의 색 면이 섹션 리듬을 만든다.

## 2. 언제 쓰나 / 쓰지 말 것
- **쓴다**: 한 장에 한 메시지를 던지는 강연·키노트. 선언·구조·리듬이 핵심인 발표. 인쇄(PDF) 배포까지 같은 파일로 끝내야 할 때.
- **쓰지 말 것**: 한 장에 표 두 개·차트 두 개가 들어가야 하는 데이터 덱. 이미지·사진이 주인공인 덱(이 테마는 이미지 슬롯이 없다). 8줄 넘는 리스트가 흔한 콘텐츠(활자 행이 세로로 넘친다).

## 3. 시그니처 결정 5개

| # | 무엇 | 왜 | 어떻게 (CSS 값) |
|---|------|----|----------------|
| 1 | **측정폭 잠금** | 포스터의 활자는 격자 모서리에 닿아야 힘이 생긴다. 넘치지 않게 '줄이기만' 하면 폰트 폴백에도 안전하다 | `.slide{padding:72px 110px 40px}` → 콘텐츠 폭 1700. `.headline{white-space:nowrap}` + 종류별 상한 px(§4) + `theme.js fitHeads()`가 `scrollWidth > 1700`이면 비율만큼 축소 |
| 2 | **무게 대비** | 800 헤드라인 옆에 400 리드, 그 옆에 21px 모노 라벨. 대비가 위계를 만든다 | `.headline{font-weight:800; line-height:1.02; letter-spacing:-.045em}` · `.lead{400 32px/1.42}` · `.kicker .tp-no .cell-no{mono 19~21px; letter-spacing:.14em}` |
| 3 | **색 면 4장** | 섹션 디바이더가 그대로 솔리드 액센트 면. 라이트=그린+흰 글자, 다크=핑크+`#1B1B1B` | `.k-section{background:var(--accent); color:var(--accent-on)}` + 면 안의 `--fg/--dim/--line/--hair`를 `color-mix(accent-on N%)`로 재정의. 면 위 강조는 색 대신 밑줄 `.055em` |
| 4 | **활자 행** | 표·카드·바 차트를 그리드 박스가 아니라 괘선 행으로. 강조 행은 여백까지 번지는 스트립 | 행 = `border-top:1px solid var(--fg)`(첫 줄) + `border-bottom:1px solid var(--line)`. 강조 = `.ladder .step.hi{margin:0 -110px; padding:30px 110px; background:var(--accent)}` |
| 5 | **포스터 안의 진행 표시** | 크롬이 아니라 인쇄물에 찍히는 탤리 틱 + 시트 번호. JS가 없어도 남는다 | `theme.js`가 시트마다 `footer.tp-base` 주입: `.tp-ticks i{34×8px; gap 6}` N개(`api.slides.length`), `i.on` = 현재까지, `.tp-no{"NN / N"}` |

## 4. 토큰

### 4.1 색

| 토큰 | Light | Dark | 용도 |
|------|-------|------|------|
| `--bg` | `#F3F1EA` | `#0F0F0E` | 시트 바탕 (색 면에서는 `--accent`) |
| `--fg` | `#12110F` | `#F1EFE8` | 헤드라인·본문·괘선(굵은) |
| `--dim` | `#5A5852` | `#A8A59D` | 리드 보조·라벨·각주 |
| `--faint` | `#8F8C85` | `#6C695F` | 예비 |
| `--line` | `#C9C6BD` | `#33322E` | 행 괘선 |
| `--hair` | `#DEDBD2` | `#242320` | 탤리 틱 off · 바 트랙 |
| `--accent` | `#134538` | `#E985A2` | 강조 활자 · 색 면 · 액센트 스트립 |
| `--accent-on` | `#FFFFFF` | `#1B1B1B` | 색 면 위 글자 |

터미널 블록만 테마 무관 `#0B0B0B` 바탕 + `#F2F0EB` 글자 + 핑크 프롬프트(v14 그대로).

### 4.2 타이포 스케일 (px · 1920 기준 · 헤드라인은 상한이며 측정폭에 맞춰 줄어든다)

| 요소 | 크기 |
|------|------|
| 표지 헤드라인 | 230 (2줄) |
| 색 면 헤드라인 / `.sub` | 380 / 64 |
| 선언(04 / 17) | 140 / 200 |
| 4단(05) · 격자(02 / 06 / 21 / 22) · 터미널(13) | 150 · 200 / 150 / 150 / 102 · 150 |
| 통계(07) · 표(08 / 16) · 인용(10) · 도해(11) | 140 · 110 / 92 · 140 · 160 |
| 대비(12) · 사다리(15) · 시각표(18) · 막대(19) · 토글(23) · 아웃트로(24) | 140 · 130 · 120 · 110 · 170 · 180 |
| 리드 | 32 (표지 36, 통계·막대 28) |
| 셀 제목 / 단 제목 / 사다리 제목 | 52 (4열 46) / 52 / 56 |
| 셀 본문·단 본문 | 24 |
| 행 본문 (표·대비·리스트·막대) | 30 / 34 / 34 / 30 |
| 거대 숫자 / 보조 숫자 | 250 / 100 |
| 마스트·시트 번호·라벨 (모노) | 21 / 19 / 20 |
| 각주 `.foot` / `.foot-src` | 22 / 19 mono |

### 4.3 간격 · 선

| 항목 | 값 |
|------|----|
| 여백 · 측정폭 · 거터 | 110 · 1700 · 20 (12열 123.33) |
| 마스트 아래 / 블록 위 | `--mast-gap` 48 (16x10: 64) / `--block-gap` 36 (16x10: 48) |
| 마스트 괘선 / 행 괘선 / 바닥 괘선 | 2px `--fg` / 1px `--line` / 1px `--line` |
| 강조 단 상단선 | 3px `--accent` |
| 탤리 틱 | 34×8, gap 6 |

## 5. 콘텐츠 클래스 → 해석

| kind | 해석 |
|------|------|
| `k-cover` | 마스트 + 230px 2줄 헤드라인 + 36px 리드. `.foot`은 바닥, `.foot-src` 앞에 액센트 원형 마크 |
| `k-section` | **색 면**. 380px 상한 헤드라인(측정폭까지) + 64px `.sub` + 모노 28px 리드. `.tp-base`가 바닥으로 |
| `k-statement` | 3줄 헤드라인(`em` = 액센트) + 리드 + `.body-list` 활자 행(`b` 266px 폭 라벨) |
| `k-steps` | 4열, 각 열 `border-top 1px fg` + 모노 번호 + 52px 제목 + 24px 본문. `.hi`는 3px 액센트 상단선 |
| `k-ladder` | `266 / 410 / 1fr` 3열 행 4개. `.hi` 행 = 여백까지 번지는 액센트 스트립 |
| `k-grid` / `k-cards` / `k-outro` | 3·4열 괘선 셀. `.nine`은 3×3, `.constellation`·`.links` 제목은 모노(핸들·URL) |
| `k-stats` | 첫 통계 = 250px 액센트 거대 숫자(좌 983px), 나머지 3개 = 100px 세로 행(우) |
| `k-table` | thead = 모노 20px 라벨 행, 행 30px, 첫 열 모노 dim, `.hi` = 액센트 800 + 액센트 밑선 |
| `k-quote` | 140px 상한 800 인용문(측정폭 잠금) + 모노 cite + 리드 |
| `k-diagram` | SVG 1200×420 → 1700 폭. 층 rect 1.5px fg 테두리, 가운데(Wiki) 층은 액센트 면 + accent-on 글자. 화살표 3px 액센트, 라벨 14 단위 모노. lint 루프는 `--line` 1.5px |
| `k-compare` | 2열 활자 행. `.a` 본문 dim, `.b h3` 액센트 |
| `k-terminal` | 검은 블록 26px/1.75 모노. prompt 핑크 · dim 회색 · ok 흰 600 |
| `k-timeline` | 5열. 시각 56px 모노, Lv 모노 액센트, 본문 24 |
| `k-bars` | 행 `1fr / 600 / 120`. 라벨 30, 트랙 14px `--hair`, 채움 `--fg`(`.hi`는 액센트), 값 모노 30 |
| `k-toggle` | 사각 버튼(pressed = fg 바탕) + 4열 72px 라벨 셀 + 34px 판정문(harness 뷰에서 액센트) |

## 6. 모션 · 순차 공개
- 시트 진입: 시트 전체 페이드 `.45s` + 직계 자식 `tpRise .6s`(22px 상승) 80ms 스태거 (nth-child 1~6). `.tp-base`는 제외.
- `[data-step]`: 18px 상승 페이드 `.5s cubic-bezier(.2,.7,.2,1)` (코어 기본 12px를 덮어씀). SVG 안은 transform 없음.
- `prefers-reduced-motion`: 라이즈·시트 페이드 모두 `animation:none`. 카운터·스텝은 코어가 처리.
- 인쇄: 모든 애니메이션 `none !important`, `print-color-adjust:exact`(색 면이 찍힌다).

## 7. 크롬 · 진행 표시
- **마스트** = 콘텐츠의 `.kicker`를 재사용. 왼쪽 원문(아이브로우), 오른쪽 `::after{content:attr(data-tp-right)}` = `"{섹션코드} / {섹션명}"`(theme.js가 세팅). 2px `--fg` 괘선.
- **바닥 괘선** = `footer.tp-base` (theme.js 주입, `aria-hidden`). 탤리 틱 N개 + `NN / N`. N은 `api.slides.length`.
- 코어 패널은 `--dk-panel-bg`(bg 94%) `--dk-panel-fg` `--dk-panel-line` `--dk-font`(mono) `--dk-accent`로 재스킨만. stage 모드에서는 숨겨지므로 포스터 안의 진행 표시가 유일한 크롬이 된다.

## 8. 금지 목록
- 그라디언트·그림자·둥근 모서리(버튼 `border-radius:0`)·이모지·아이콘 SVG.
- 헤드라인에 `white-space:normal` — 줄바꿈은 콘텐츠의 `<br/>`만. 자연 wrap을 허용하면 측정폭 잠금이 무너진다.
- 색 면 위에서 액센트 색 강조(같은 색이라 사라진다) — 밑줄로.
- 세 번째 색. 회색은 `--dim/--faint/--line/--hair` 4단만.
- 표를 박스 그리드로 되돌리기 — 이 테마의 표는 항상 괘선 행이다.
- 자체 키 리스너·슬라이드 이동 로직 — 코어 API만 읽는다.

## 9. 복사해서 쓰는 법
1. `theme.css` + `theme.js` + `theme.json`을 `themes/{slug}/`에 두고 `python3 build.py --themes {slug}` — 코어·콘텐츠는 손대지 않는다.
2. 콘텐츠는 §5의 `k-*` 클래스 계약(CONTRACT.md §3)을 지키면 된다. 헤드라인 줄바꿈은 `<br/>`로 명시하고, 한 줄이 1700px을 넘으면 theme.js가 알아서 줄인다.
3. 슬라이드 수가 바뀌어도 탤리 틱·시트 번호는 자동. 섹션 디바이더에 `k-section`을 붙이면 그 장이 색 면이 된다.

마크업 계약 요약: `.slide.k-*` 안에 `.kicker`(마스트) → `.headline`(`<br/>`·`em`·`.sub`) → 본문 블록 → `.lead` → `.foot(.foot-note .foot-src)`. 순차 공개는 `[data-step]`, 카운터는 `[data-count]`.

## 10. 계보 · 출처
- 원본: `../v14-typographic-poster/index.html` + `NOTES.md` (v7 Cinema 고정 무대 계보 위의 스위스 포스터 변주, 2026-09-09).
- 이식 대상: `final/core/deck-core.{css,js}` R1 + `final/content.html` 24장.
- 시각 규약: [[DESIGN.md]] §1 CI 토큰 · §2 Anti-Slop.
- 검증·잔여 이슈: 같은 폴더 `NOTES.md`.
