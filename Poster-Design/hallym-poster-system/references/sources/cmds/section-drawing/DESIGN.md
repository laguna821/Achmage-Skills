---
type: documentation
aliases:
  - Section Drawing DESIGN
description: "Architectural section-drawing deck: a left vertical ruler is the cut line A-A' and doubles as the progress indicator, with datum lines, hatch fills, double sheet frame and a title block on drafting vellum (light) or slate (dark)."
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

# Section Drawing — DESIGN

> [!info] 한 줄 정의
> 좌측 세로 눈금자가 절단선 A–A′ 그 자체이며 24개 스테이션 눈금이 진행 표시다

## 1. 언제 쓰나 / 쓰지 말 것

구조·시스템·프로세스를 '단면'으로 보여주는 강의·컨설팅 덱. 임원 대상 기술 설명, 아키텍처·워크플로 설명, 도면 같은 정밀함이 신뢰를 주는 자리에 쓴다. 감성적 스토리텔링이나 이미지 중심 덱에는 맞지 않는다.

- 엔진: `stage` · 계보: v7 Cinema (fixed 1920 stage) + v8 Blueprint (drawing language) · 원본: `v9-section-drawing`
- 이 문서는 스타일 층만 기술한다. 발표 기능(P/F/N/A/T)과 마크업 계약은 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]]과 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/DESIGN|덱 시스템 DESIGN]]가 정본.

## 2. 시그니처 결정 5

1. 좌측 세로 눈금자가 절단선 A–A′ 그 자체이며 24개 스테이션 눈금이 진행 표시다 — 프로그레스 바가 아니라 절단선 위 깊이 측정
2. 치수 버블이 현재 스테이션 번호를 정확히 덮어 대체한다(이중 번호 없음), 지시 삼각형 + 420px 안에서 사라지는 datum 선
3. 제도 벨럼 지면: 32px 피치 수평 눈금 결이 눈금자 쪽에서만 보이고 본문 쪽으로 mask 로 사라진다 + 이중 도면 프레임 + 우하단 표제 SHEET NN / 24 · 1:1
4. 층이 있는 콘텐츠는 단면처럼 쌓인다 — 1.5px 잉크 외곽선 베이, 강조 층은 틴트 + 45° 해치, 치수선 끝 눈금(::before/::after 13px)
5. 라이트 = 벨럼 `#FAF9F3` + 녹색 잉크 `#134538` · 다크 = 슬레이트 `#0D1211` + 분홍 잉크 `#E985A2`, 헤드라인 800 웨이트 -.035em, 라벨은 모노 .14em

## 3. 토큰

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| `accent` | `#134538` | `#E985A2` |
| `accentOn` | `#FFFFFF` | `#1B1B1B` |
| `bg` | `#FAF9F3` | `#0D1211` |
| `faint` | `#8B938A` | `#606860` |
| `fg` | `#131813` | `#EDEFEA` |
| `line` | `#D3D6CC` | `#242B27` |
| `line2` | `#E7E9E0` | `#171C19` |
| `muted` | `#4C554D` | `#9BA39C` |
| `panel` | `#F1F0E7` | `#131917` |
| `tint` | `rgba(19,69,56,.06)` | `rgba(233,133,162,.10)` |

- 눈금자 기하: `--rul-w 244px` `--rul-x 150px` `--rul-top/-bottom 150px`
- 지면 여백: `--pad-t 118px` `--pad-b 132px` `--pad-r 150px`
- 결(수평 눈금) 피치 32px, 눈금자 쪽에서만 보이고 본문으로 mask 페이드
- 선: 본문 1px `--line` · 베이 외곽 1.5px 잉크 · 섹션 눈금 26px 폭

## 4. 콘텐츠 클래스 → 이 테마의 해석

| kind | 내용 | 해석 |
|------|------|------|
| `k-cover 01` | 표지 | 제호 없이 눈금자 상단 A 에서 시작, 표제란만 |
| `k-section 03·09·14·20` | 섹션 표지 | 섹션 문자(A~D)가 눈금자에 굵은 눈금으로 찍히고 지면은 비운다 |
| `k-statement 04·17` | 선언 | 헤드라인만 남기고 datum 선 한 줄 |
| `k-steps 05` | 4단 프로세스 | 4개 베이가 가로로 이어진 단면 |
| `k-ladder 15` | 세로 사다리 | 층이 위에서 아래로 쌓인 단면, 강조 층은 45° 해치 |
| `k-grid 02·06·22` | 그리드 4열·3×3 | 격자 셀이 도면 부품 칸, 셀 번호가 부품 번호 |
| `k-cards 21` | 카드 3장 | 카드 3장이 상세 단면 3개 |
| `k-stats 07` | 카운터 통계 | 치수 숫자처럼 큰 활자 + 단위 라벨 |
| `k-table 08·16` | 표 | 표는 부품표(BOM) 조판, 헤더는 모노 대문자 |
| `k-quote 10` | 인용 | 인용은 도면 여백의 주기(註記) |
| `k-diagram 11` | SVG 도해 | SVG 도해에 화살촉을 theme.js 가 붙여 지시선으로 |
| `k-compare 12` | 2열 대비 | 두 열이 좌우 단면 A/B |
| `k-terminal 13` | 터미널 | 터미널은 계산서 박스 |
| `k-timeline 18` | 타임라인 5틱 | 타임라인 5틱이 치수선, 끝 눈금 13px |
| `k-bars 19` | 가로 막대 | 막대가 치수선, 값은 우측 정렬 모노 |
| `k-toggle 23` | 관점 토글 | 토글 버튼이 도면 옵션 스위치 |
| `k-outro 24` | 아웃트로 | 표제란만 남기고 A′ 로 닫는다 |

## 5. 모션·순차 공개

`[data-step].in` 은 코어 기본(12px 상승 페이드)을 `--ease cubic-bezier(.22,.78,.28,1)` 로 바꿔 쓴다. 치수 버블은 슬라이드 전환마다 `--p` 로 눈금자를 따라 미끄러진다. 감축 모드에서는 전부 즉시 표시.

## 6. 크롬·진행 표시

좌측 눈금자가 진행 표시 그 자체다. 스테이션 24개, 섹션 경계(A~D)는 굵은 눈금 + 문자 라벨. 현재 위치는 치수 버블이 **그 스테이션 번호를 덮어 대체**하므로 숫자가 겹치지 않는다. 우하단 표제 `SECTION A–A′ · SHEET nn / 24 · 1:1`, 각 시트 우상단에 섹션 코드/이름.

## 7. 금지

- 눈금자 밖에 별도 진행 바를 두지 않는다 (이중 표시)
- 버블과 스테이션 번호를 동시에 보이지 않는다
- 결(수평선)을 본문 영역까지 끌고 가지 않는다 — 사용자 지적 사항

## 8. 복사해서 쓰는 법

1. `themes/section-drawing/theme.css`(+`theme.js`)를 자기 프로젝트의 같은 경로에 둔다.
2. 콘텐츠를 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]] §3의 슬라이드 종류로 쓴다. 이 테마가 특별히 요구하는 것: `data-section`(A~D)이 있어야 눈금자에 섹션 눈금이 찍힌다. 슬라이드 수가 바뀌면 스테이션은 자동으로 재계산된다.
3. `python3 build.py --themes section-drawing` → `dist/section-drawing/index.html` 단일 파일. 검증은 `tools/verify.py` 4조합.

## 9. 계보

`v9-section-drawing` (3차 변주, 2026-09-09) → 최종 R1 이식. 원본 덱은 `../v9-section-drawing/index.html`에 그대로 보존돼 있다.
