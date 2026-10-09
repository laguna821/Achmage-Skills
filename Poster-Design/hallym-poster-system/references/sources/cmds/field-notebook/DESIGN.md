---
type: documentation
aliases:
  - Field Notebook DESIGN
description: "Research field-notebook look on the fluid scroll engine: cream/black paper on a desk, faint 5mm graph grid, left margin rule, rubber-stamp date mark, page stamp with dog-ear, and a right margin column where every footnote and source lives as a hand-pasted note."
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

# Field Notebook — DESIGN

> [!info] 한 줄 정의
> 책상 위 종이 한 장: 슬라이드마다 --frame 만큼 안쪽에 종이(--paper)가 놓이고 바깥은 책상(--desk) 색이다

## 1. 언제 쓰나 / 쓰지 말 것

연구·강의 자료처럼 '읽히는' 덱, 각주와 출처가 많은 발표에 쓴다. 화면 크기가 제각각인 자리(노트북 화면 공유·자유 비율)에서도 한 화면 한 장으로 스냅된다. 큰 무대의 시네마틱 연출이나 정확한 1920 캔버스 재현이 필요하면 stage 엔진 테마를 쓴다.

- 엔진: `scroll` · 계보: v8 Blueprint (fluid scroll-snap) → v12 Field Notebook · 원본: `v12-field-notebook`
- 이 문서는 스타일 층만 기술한다. 발표 기능(P/F/N/A/T)과 마크업 계약은 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]]과 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/DESIGN|덱 시스템 DESIGN]]가 정본.

## 2. 시그니처 결정 5

1. 책상 위 종이 한 장: 슬라이드마다 --frame 만큼 안쪽에 종이(--paper)가 놓이고 바깥은 책상(--desk) 색이다
2. 5mm 모눈: 20px 피치 SVG 선 패턴을 종이에 깔되 알파를 라이트 .05 · 다크 .038 로 낮춰 선이 아니라 질감으로만 읽힌다 (원본의 절반)
3. 여백이 두 번째 지면: 본문 컬럼 | 우측 마진 컬럼 2단. .foot-note/.foot-src 와 data-source 는 본문에 없고 마진에 붙은 메모(※)로 산다
4. 고무 스탬프 크롬: 좌상단 날짜·이름 스탬프(-1.6° 회전, 이중 테두리, 라이트에선 multiply), 우하단 페이지 스탬프 + 접힌 귀, 우측 가장자리 색인 탭
5. 형광펜 강조: 강조는 색 글자가 아니라 --tint 띠(box-decoration-break: clone)와 .hi 행의 틴트 배경으로 처리한다

## 3. 토큰

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| `accent` | `#134538` | `#E985A2` |
| `accentOn` | `#FFFFFF` | `#1B1B1B` |
| `desk` | `#DCD6C7` | `#0A0B0A` |
| `dim` | `#525B55` | `#A7ADA4` |
| `faint` | `#8A928B` | `#6F766F` |
| `grid` | `rgba(19,69,56,.05)` | `rgba(233,133,162,.038)` |
| `ink` | `#182019` | `#EDEEE8` |
| `paper` | `#F5F1E6` | `#141614` |
| `rule` | `#D5CEBC` | `#2B302B` |
| `strip` | `#FBF9F2` | `#1B1E1B` |

- 유동 단위: `--uw calc(--dk-w / 100)` `--u calc(--dk-h / 100)` — 모든 크기가 덱 프레임에 비례
- 종이: `--frame clamp(12px, 1.1uw, 18px)` `--pad clamp(44px, 5uw, 96px)`
- **모눈 알파 라이트 .05 / 다크 .038** (원본 .11 의 절반 이하 — 사용자 지적 반영)
- 마진 컬럼: 본문 : 마진 = 약 3 : 1

## 4. 콘텐츠 클래스 → 이 테마의 해석

| kind | 내용 | 해석 |
|------|------|------|
| `k-cover 01` | 표지 | 노트 표지, 날짜 스탬프 |
| `k-section 03·09·14·20` | 섹션 표지 | 간지 한 장 |
| `k-statement 04·17` | 선언 | 본문 한 문단 + 마진 메모 |
| `k-steps 05` | 4단 프로세스 | 4개 항목이 번호 매긴 관찰 기록 |
| `k-ladder 15` | 세로 사다리 | 세로 목록, 강조 행은 형광펜 틴트 |
| `k-grid 02·06·22` | 그리드 4열·3×3 | 모눈 위 표 형태 기록 |
| `k-cards 21` | 카드 3장 | 카드 3장이 붙인 메모지 |
| `k-stats 07` | 카운터 통계 | 측정값 기록 |
| `k-table 08·16` | 표 | 표는 실험 기록표 |
| `k-quote 10` | 인용 | 인용은 인용 카드(들여쓰기 + 좌측 규칙선) |
| `k-diagram 11` | SVG 도해 | 도해는 손그림 스케치 영역 |
| `k-compare 12` | 2열 대비 | 두 열이 대조 관찰 |
| `k-terminal 13` | 터미널 | 터미널은 붙여넣은 로그 |
| `k-timeline 18` | 타임라인 5틱 | 타임라인이 일지 |
| `k-bars 19` | 가로 막대 | 막대가 측정 눈금 |
| `k-toggle 23` | 관점 토글 | 토글이 관점 스위치 |
| `k-outro 24` | 아웃트로 | 마지막 장 + 색인 탭 |

## 5. 모션·순차 공개

종이에 붙이듯 `[data-step]` 이 아래에서 짧게 올라온다. 스크롤 엔진이라 슬라이드 간 이동은 스냅.

## 6. 크롬·진행 표시

좌상단 고무 스탬프(날짜·이름, -1.6° 회전), 우하단 페이지 스탬프 + 접힌 귀, 우측 가장자리 색인 탭이 현재 섹션을 표시. **우측 마진 컬럼**이 이 테마의 핵심 — `.foot-note` `.foot-src` `data-source` 가 본문에서 빠져 마진 메모(※)로 산다.

## 7. 금지

- 모눈을 다시 진하게 하지 않는다 (사용자 지적)
- 마진 메모를 본문 폭으로 늘리지 않는다
- 손글씨 폰트 (CI 폰트 규칙)

## 8. 복사해서 쓰는 법

1. `themes/field-notebook/theme.css`(+`theme.js`)를 자기 프로젝트의 같은 경로에 둔다.
2. 콘텐츠를 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]] §3의 슬라이드 종류로 쓴다. 이 테마가 특별히 요구하는 것: `data-source` 를 채우면 마진에 출처 메모가 자동으로 붙는다. 각주가 없는 슬라이드는 마진이 비어도 격자는 유지된다.
3. `python3 build.py --themes field-notebook` → `dist/field-notebook/index.html` 단일 파일. 검증은 `tools/verify.py` 4조합.

## 9. 계보

`v12-field-notebook` (3차 변주, 2026-09-09) → 최종 R1 이식. 원본 덱은 `../v12-field-notebook/index.html`에 그대로 보존돼 있다.
