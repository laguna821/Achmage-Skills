---
type: documentation
aliases:
  - Control Room DESIGN
description: "Dark-first mission-control instrument panel: a live status strip (SLIDE/STEP/CLK/THEME/NOTES/LOG) and a segmented timecode rail that read real engine state, monospace labels, 1px rules on panel surfaces, pink square bullets."
author:
  - "[[구요한]]"
model: "claude-fable-5-1[1m]"
effort: "high"
date created: 2026-09-09
date modified: 2026-09-09
tags:
  - deck
  - design-system
  - DESIGN
CMDS: "[[📚 731 Digital Art and Design]]"
index: "[[🏷 Lecture Notes]]"
---

# Control Room — DESIGN

> [!info] 한 줄 정의
> 계기판은 장식이 아니라 실제 텔레메트리다

## 1. 언제 쓰나 / 쓰지 말 것

세션·에이전트·로그·색인처럼 시스템이 스스로를 계측하는 이야기를 할 때. 어두운 강당·기술 청중·라이브 데모가 있는 강의에 맞다.

- 엔진: `stage` · 계보: v7 Cinema → v13 Control Room · 원본: `v13-control-room`
- 이 문서는 스타일 층만 기술한다. 발표 기능(P/F/N/A/T)과 마크업 계약은 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]]과 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/DESIGN|덱 시스템 DESIGN]]가 정본.

## 2. 시그니처 결정 5

1. 계기판은 장식이 아니라 실제 텔레메트리다 — 스트립과 레일은 theme.js 훅으로 api.state()를 읽어 그린다
2. 상단 56px 상태 스트립: 브랜드 · SLIDE nn/NN · STEP n/N · CLK · THEME · NOTES · LOG(마지막 이벤트 1건)
3. 하단 64px 타임코드 바: TC 경과 시간 + 슬라이드 수만큼의 세그먼트(past dim · current accent×스텝 비율 · future line)
4. 절제된 계기판 — 1px 괘선 · 패널 면 · 소문자 모노 라벨 · tabular-nums · 네온·스캔라인 없음
5. 다크 우선(핑크 액센트) · 라이트는 관제실 조명을 켠 상태(밝은 회색 패널 위 그린)

## 3. 토큰

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| `accent` | `#134538` | `#E985A2` |
| `accentOn` | `#FFFFFF` | `#1B1B1B` |
| `bg` | `#E3E5E1` | `#0B0C0D` |
| `dim` | `#4B4F4A` | `#A3A7A1` |
| `faint` | `#7E827D` | `#6B6F6A` |
| `fg` | `#131513` | `#ECEDE9` |
| `line` | `#C2C6C0` | `#2A2E33` |
| `line2` | `#D4D7D2` | `#1E2226` |
| `panel` | `#F1F2EF` | `#121416` |
| `panel2` | `#FAFAF8` | `#181B1E` |

- 스트립/레일 높이: `--cr-strip 56px` `--cr-tc 64px` (16:10 에서도 고정, 여분은 본문이 흡수)
- 지면 여백: `--pad-x 120px` `--pad-t 40px` `--pad-b 36px` `--gap 28px`
- 모든 계기 라벨은 모노 + `.14em` 자간 + `tabular-nums`

## 4. 콘텐츠 클래스 → 이 테마의 해석

| kind | 내용 | 해석 |
|------|------|------|
| `k-cover 01` | 표지 | 계기판이 부팅되는 화면, 스트립에 SLIDE 01/24 |
| `k-section 03·09·14·20` | 섹션 표지 | 섹션 진입은 LOG 에 SECTION 이벤트로 남고 지면은 큰 활자만 |
| `k-statement 04·17` | 선언 | 한 문장 + 하단 타임코드 |
| `k-steps 05` | 4단 프로세스 | 4개 모듈 패널 |
| `k-ladder 15` | 세로 사다리 | 세로 스택, 강조 행은 액센트 좌측 바 |
| `k-grid 02·06·22` | 그리드 4열·3×3 | 계기 타일 그리드 |
| `k-cards 21` | 카드 3장 | 카드 3장이 서브시스템 패널 |
| `k-stats 07` | 카운터 통계 | 큰 수치 + 단위, tabular-nums |
| `k-table 08·16` | 표 | 표는 텔레메트리 로그 테이블 |
| `k-quote 10` | 인용 | 인용은 패널 위 큰 활자 |
| `k-diagram 11` | SVG 도해 | 도해는 배선도 |
| `k-compare 12` | 2열 대비 | 두 열이 A/B 채널 |
| `k-terminal 13` | 터미널 | 터미널이 이 테마의 본거지 — 패널 면 그대로 |
| `k-timeline 18` | 타임라인 5틱 | 타임라인이 타임코드 눈금과 같은 문법 |
| `k-bars 19` | 가로 막대 | 막대가 게이지 |
| `k-toggle 23` | 관점 토글 | 토글이 물리 스위치 |
| `k-outro 24` | 아웃트로 | 세션 종료 로그 |

## 5. 모션·순차 공개

계기판은 애니메이션하지 않는다(값만 바뀐다). 본문 `[data-step]` 은 코어 기본 모션 + `--ease cubic-bezier(.2,.7,.2,1)`. LOG 는 마지막 1건만 표시하며 슬라이드·스텝·테마·모드·비율 변경 시 갱신.

## 6. 크롬·진행 표시

**상단 56px 상태 스트립** — 브랜드 · `SLIDE nn/NN` · `STEP n/N` · `CLK` · `THEME` · `NOTES` · `LOG`. **하단 64px 타임코드 바** — `TC` 경과 시간 + 슬라이드 수만큼의 세그먼트(지난 것 dim, 현재는 스텝 비율만큼 액센트, 남은 것 line). 둘 다 `theme.js` 가 `api.state()` 를 읽어 그리므로 실제 엔진 상태다.

## 7. 금지

- 네온·스캔라인·글로우 (원본 NOTES 의 금지 항목)
- 계기판에 가짜 수치를 넣지 않는다 — 모든 값은 api 상태에서 온다
- 스트립을 슬라이드 밖(코어 패널)으로 옮기지 않는다 — stage 모드에서 사라진다

## 8. 복사해서 쓰는 법

1. `themes/control-room/theme.css`(+`theme.js`)를 자기 프로젝트의 같은 경로에 둔다.
2. 콘텐츠를 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]] §3의 슬라이드 종류로 쓴다. 이 테마가 특별히 요구하는 것: 슬라이드 수는 `api.slides.length` 로 자동 계산된다. 하드코딩된 24 는 없다.
3. `python3 build.py --themes control-room` → `dist/control-room/index.html` 단일 파일. 검증은 `tools/verify.py` 4조합.

## 9. 계보

`v13-control-room` (3차 변주, 2026-09-09) → 최종 R1 이식. 원본 덱은 `../v13-control-room/index.html`에 그대로 보존돼 있다.
