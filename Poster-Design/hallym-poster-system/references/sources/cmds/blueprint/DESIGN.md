---
type: documentation
aliases:
  - Blueprint 테마 설계
  - 설계도 덱 DESIGN
description: "Copy-ready design spec for the blueprint deck theme (engineering-drawing visual language on the scroll engine): dot-grid paper, single-ink strokes, sheet frame, dimension lines, and a bottom-right title block carrying real per-slide metadata. Reference when reusing this theme on other CMDS content or reviewing it."
author:
  - "[[구요한]]"
model: "claude-fable-5-1[1m]"
effort: "high"
date created: 2026-09-09
date modified: 2026-09-09
tags:
  - deck
  - design-system
  - blueprint
CMDS: "[[📚 731 Digital Art and Design]]"
index: "[[🏷 Lecture Notes]]"
---

# Blueprint — DESIGN

## ① 한 줄 정의
발표 자체를 **도면**으로 만든 테마. 점 격자 지면, 한 가지 잉크, 시트 프레임, 치수선, 그리고 우하단 표제란(도면 표제란)이 슬라이드마다 실제 설계·구분 메타데이터를 싣는다.

## ② 언제 쓰나 / 쓰지 말 것
- **쓴다**: 시스템·아키텍처·프로세스를 설명하는 발표. 표제란의 SHEET·SECTION·TYPE·SOURCE 가 "그냥 워딩"이 아니라 의미 있는 구분 정보로 읽힐 때 가치가 최대. `k-diagram`·`k-terminal`·`k-table`·`k-ladder` 가 많은 덱에 특히 강하다.
- **쓰지 말 것**: 감정·서사·브랜드 무드가 앞서야 하는 발표(제품 런칭 티저, 시네마틱 오프닝). 도면 어휘는 차갑고 정연해서 그런 자리에는 과하다.

## ③ 시그니처 결정 5개

1. **지면 = 점 격자 텍스처 (색 그라디언트 아님).** 왜: 제도판의 방안지를 종이 위 잉크 한 겹으로 환원해 Anti-Slop 을 지킨다. 어떻게: `.slide{ background-image:radial-gradient(var(--bp-dot) calc(1.4px*var(--u)),transparent calc(1.7px*var(--u))); background-size:calc(24px*var(--u)) ... }`, `--bp-dot` 는 잉크의 7~8% 알파.
2. **시트 프레임 + 내부 안전선.** 왜: 모든 슬라이드를 한 장의 도면 시트로 읽히게 한다. 어떻게: `.slide::before{ inset:var(--bp-frame); border:1px solid var(--bp-rule) }` + `.slide::after{ inset:calc(var(--bp-frame)+6px*var(--u)); border:1px solid var(--bp-rule2) }`. 클로징(`k-outro`)만 2px 강조 프레임.
3. **잉크는 한 가지.** 왜: CI 두 토큰만으로 도면의 절제를 만든다. 어떻게: 라이트 녹색 `#134538`, 다크 분홍 `#E985A2` — 코어의 `--accent` 스왑을 그대로 상속(`--bp-acc:var(--accent)`). 카드·그림자·이모지·그라디언트 없음.
4. **구조는 괘선·치수선·틱으로.** 왜: 박스/카드 대신 제도 관례로 정보를 세운다. 어떻게: `.step` 상단 2px 괘선 + 좌측 틱, `.stat`/`.tick` 상단 치수선 + 양끝 세로 틱(`::before`/`::after` 11px), 표는 1px 전체 괘선.
5. **우하단 표제란(theme.js).** 왜: 소유자 지침 — "우측 하단 네모칸이 의미 있는 설계·구분 정보를 줄 때 가치가 있다." 어떻게: `theme.js` 가 슬라이드마다 `data-section`/`data-section-name`/`data-kind`/`data-source` + 덱 메타(`rev`/`author`)로 6행 그리드를 만들어 슬라이드 안(`position:absolute; right/bottom:frame`)에 넣는다 → 무대·인쇄에 그대로 나온다.

## ④ 토큰 표

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| paper(`--bg`) | `#F6F5F0` | `#111311` |
| ink(`--fg`) | `#1B1B1B` | `#F2F1EC` |
| acc(`--accent`) | `#134538` | `#E985A2` |
| rule(`--line`) | ink 14% | ink 16% |
| dot(`--bp-dot`) | ink 7% | ink 8% |
| term-acc | `#2FB488` | `#E985A2` |

타이포 스케일(1920 폭 기준, `calc(px * var(--u))`):

| 역할 | px |
|------|----|
| 헤드라인(cover) | 84 |
| 헤드라인(statement) | 58 |
| 통계 숫자 | 88 |
| lead | 28 |
| kicker(mono) | 15 |
| 표제란(mono) | 11 |

- 간격: 시트 프레임 `--bp-frame:20px`, 좌우 여백 `--bp-gut:120px`, 하단 여백 216px(표제란/폴리오 확보), 셀 간 괘선 1px.
- 선 굵기: 프레임/괘선 1px, 강조 프레임 2px, 다이어그램 rect 1.5px · arrow 2.5px.
- **스케일 단위 `--u = calc(var(--dk-w)/1920px)`** — 스크롤 엔진에서 폭 비례. 16x9·16x10 은 폭이 같아 동일 레이아웃, 세로 여분은 `justify-content:center` + `.foot{margin-top:auto}` 로 흡수. `verify`(1920 폭)에서 `--u=1`.

## ⑤ 콘텐츠 클래스 → 이 테마의 해석 (§3 kind 전부)

| kind | Blueprint 해석 |
|------|----------------|
| `k-cover` | 대활자 + 측정 치수선(theme.js 가 헤드라인 실제 렌더 폭 px 을 표기) |
| `k-section` | kicker=SECTION nn, 헤드라인 + `.sub` 부제, lead |
| `k-statement` | 대활자 선언 + `body-list` 는 지시선(1px 틱) 달린 항목 |
| `k-steps` | 4열, 각 step 상단 2px 괘선 + 좌측 틱, `.hi` 는 accent |
| `k-ladder` | 세로 입면 표(60px 라벨열 + 본문), `.hi`(v3) accent 괘선 |
| `k-grid` | 1px 괘선 스케줄(3·4·9칸), 셀 사이는 rule 배경으로 1px 선 |
| `k-cards` | 3칸 스케줄, 순차 공개, no 는 mono accent |
| `k-stats` | 각 숫자 위 치수선 + 양끝 틱, mono accent 숫자 |
| `k-table` | 전체 괘선 도면 표, `.hi` 열은 accent 텍스트 + 헤더 tint |
| `k-quote` | 좌측 2px accent 괘선 인용 |
| `k-diagram` | 종이-잉크 스키매틱(rect paper fill + ink stroke, arrow accent, loop dashed) |
| `k-compare` | 2평면 괘선 도해, b열 accent 제목·불릿 |
| `k-terminal` | 지시선 없는 `DETAIL` 라벨 인셋, 다크 터미널, 라이트에선 밝은 녹색 잉크 |
| `k-timeline` | 5틱 치수선(상단 rule + 시작 accent 틱) |
| `k-bars` | 치수 바(rule 트랙 + accent 채움 `--w%`), `.hi` accent |
| `k-toggle` | mono 토글 버튼(pressed=accent bg) + 괘선 그리드 + 지시선 판정 |
| `k-outro` | 2px accent 강조 프레임 시트 + mono accent 링크 3칸 |

## ⑥ 모션·순차 공개 규칙
`html.js [data-step]{ opacity:0; transform:translateY(calc(8px*var(--u))) }` → `.in` 에서 해제(0.42s ease). `svg [data-step]` 는 이동 없이 페이드만(코어 규약). `prefers-reduced-motion` 은 코어·테마 양쪽에서 즉시 공개. **첫 페인트는 스크롤 위치에 의존하지 않는다** — 스텝의 초기 상태는 CSS 만으로 결정되고, 코어가 최초 슬라이드에 `data-active`·첫 스텝 공개를 준다.

## ⑦ 크롬·진행 표시
- 슬라이드 내부에 자체 진행 표시를 둔다(무대 모드에서 코어 패널이 숨겨져도 보이게): 우하단 **표제란**(SHEET nn/NN 포함) + 좌하단 **폴리오**(SHEET nn/NN + 1px 진행 바 `scaleX((i+1)/total)`).
- 코어 패널은 `--dk-font:var(--font-mono)` · `--dk-panel-bg` · `--dk-panel-line:var(--bp-rule)` · `--dk-accent:var(--bp-acc)` 로 재스킨만 한다(구조 변경·숨김 없음).

## ⑧ 금지 목록
- 그라디언트 배경, 카드 그림자, 이모지 장식, 라운드 코너(도면은 직각).
- 두 CI 토큰 밖의 색. 라이트 지면 위 진한 녹색 터미널 텍스트(안 읽힘 → `--bp-term-acc` 밝은 녹색 사용).
- 인라인 `style="color"`(테마 전환 불가). SVG 로 사람·사물 그리기.
- 표제란에 발명한 숫자·필러(SCALE `1:1` 같은 크롬 라벨은 넣지 않는다 — v8 NOTES 알려진 문제 `#1` 회피). 모든 표제란 값은 슬라이드 실 메타.
- 100vh(스크롤 엔진에선 `var(--dk-h)` 만).

## ⑨ 복사해서 쓰는 법
1. `theme.css` + `theme.js` 를 새 콘텐츠에 얹고 `theme.json` 의 `"engine":"scroll"` 을 유지한다(코어가 `#deck`·`.slide` 를 `--dk-w`×`--dk-h` 로 세운다).
2. 콘텐츠는 §3 마크업 계약을 그대로 따른다 — 특히 각 `section.slide` 에 `data-section`·`data-section-name`·`data-kind`·`data-source` 를 채워야 표제란이 의미를 갖는다.
3. 색은 `--accent`/`--accent-on` 만 갈아끼우면 잉크가 통째로 바뀐다. 폭이 1920 이 아닌 곳에 얹어도 `--u` 가 전 크기를 비례 조정한다.

## ⑩ 계보·출처
- 원본: `../v8-blueprint/index.html` + `NOTES.md` (단일 파일 · 유동 타이포 · scroll-snap).
- 상위 계보: v1 Document(단일 파일 문서 모델) → v8 Blueprint(제도판 어휘).
- 시각 규약 정본: [[DESIGN.md]] (CI 토큰 · Anti-Slop). CMDS 덱 코어: `../../final/core/`.
