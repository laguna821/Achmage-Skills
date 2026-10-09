---
type: documentation
aliases:
  - Editorial Scroll DESIGN
description: "Fluid editorial snap-scroll deck: generous margins, hairline rules, display typography scaled to the deck frame, a per-slide progress-dot column, and an accent-toned closing spread."
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

# Editorial Scroll — DESIGN

> [!info] 한 줄 정의
> 유동 타이포

## 1. 언제 쓰나 / 쓰지 말 것

링크·USB로 던져주고 발표 뒤에도 웹 문서로 계속 살아야 하는 자료. 리허설한 줄바꿈이 그대로 나와야 하는 고위험 무대에는 stage 엔진 테마를 쓴다.

- 엔진: `scroll` · 계보: 손상현 scroll-snap deck → v1 Editorial Scroll (CMDS CI) · 원본: `v1-editorial-scroll`
- 이 문서는 스타일 층만 기술한다. 발표 기능(P/F/N/A/T)과 마크업 계약은 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]]과 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/DESIGN|덱 시스템 DESIGN]]가 정본.

## 2. 시그니처 결정 5

1. 유동 타이포 — 모든 크기는 덱 프레임(--dk-w/--dk-h)의 1/100 단위(--uw/--uh)에 clamp()로 묶는다
2. 헤어라인 규칙 — 1px line / 1.5px rule 두 굵기만으로 격자·표·리스트를 나눈다 (박스 없음)
3. 넉넉한 거터 — 좌우 clamp(28px, 7uw, 112px), 콘텐츠 최대 1180~1696px, 세로는 중앙 정렬
4. 진행 점 — 슬라이드 수만큼의 점을 덱 우측에 세로로, 현재 점은 액센트·1.45배, 섹션 사이 간격, 클릭하면 이동
5. 액센트 지면 클로징 — 마지막 스프레드만 acc-bg 로 지면을 물들이고 규칙선은 acc-line 으로

## 3. 토큰

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| `accent` | `#134538` | `#E985A2` |
| `accentBg` | `#F1F7F4` | `#2B1922` |
| `accentLine` | `#BAD9C9` | `#4A2C38` |
| `card` | `#FFFFFF` | `#0D1411` |
| `faint` | `#8A938E` | `#626A66` |
| `ink` | `#0B0D0C` | `#F2F4F3` |
| `line` | `#E6E8E6` | `#1A231F` |
| `muted` | `#4A544F` | `#9AA39D` |
| `onAccent` | `#FFFFFF` | `#1B1B1B` |
| `paper` | `#FBFBFA` | `#0B0F0D` |
| `rule` | `#D0D3D0` | `#26302A` |
| `soft` | `#F5F6F4` | `#0A1110` |

- 유동 단위: `--uw` `--uh` = 덱 프레임의 1/100, 모든 타이포는 `clamp()` 로 상·하한을 묶는다
- 거터: 좌우 `clamp(28px, 7uw, 112px)` · 콘텐츠 최대 1180~1696px
- 규칙선 2종만: 1px `--ed-line` · 1.5px `--ed-rule`

## 4. 콘텐츠 클래스 → 이 테마의 해석

| kind | 내용 | 해석 |
|------|------|------|
| `k-cover 01` | 표지 | 큰 제목 + 부제, 여백 넉넉 |
| `k-section 03·09·14·20` | 섹션 표지 | 간지, 섹션 번호만 |
| `k-statement 04·17` | 선언 | 한 문단 에세이 |
| `k-steps 05` | 4단 프로세스 | 4열 또는 접히는 목록 |
| `k-ladder 15` | 세로 사다리 | 세로 목록, 강조 행 액센트 |
| `k-grid 02·06·22` | 그리드 4열·3×3 | 헤어라인으로 나눈 격자 |
| `k-cards 21` | 카드 3장 | 카드 3장(테두리 없이 규칙선만) |
| `k-stats 07` | 카운터 통계 | 큰 숫자 4개 |
| `k-table 08·16` | 표 | 표는 헤어라인 표 |
| `k-quote 10` | 인용 | 인용은 큰 활자 + 출처 |
| `k-diagram 11` | SVG 도해 | 도해는 SVG 그대로, 유동 크기 |
| `k-compare 12` | 2열 대비 | 두 열 대비 |
| `k-terminal 13` | 터미널 | 터미널 블록 |
| `k-timeline 18` | 타임라인 5틱 | 타임라인 5틱 |
| `k-bars 19` | 가로 막대 | 막대 5행 |
| `k-toggle 23` | 관점 토글 | 토글 세그먼트 |
| `k-outro 24` | 아웃트로 | 액센트 지면으로 물든 클로징 스프레드 |

## 5. 모션·순차 공개

`--ed-ease cubic-bezier(.22,.8,.3,1)` 로 부드럽게. 스크롤 스냅이 기본 전환이고, `[data-step]` 은 짧은 상승 페이드.

## 6. 크롬·진행 표시

**우측 세로 진행 점** — 슬라이드 수만큼의 점, 현재 점은 액센트 + 1.45배, 섹션 사이에 간격, 클릭하면 그 장으로 이동(`api.go`). 사용자가 원본에서 가장 좋다고 한 요소라 그대로 살렸다. 코어 패널은 종이 톤으로 재스킨.

## 7. 금지

- 박스·카드 배경 (규칙선만으로 나눈다)
- 점 진행 표시를 지우지 않는다 — 이 테마의 시그니처
- 한글 헤드라인을 자연 wrap 에 맡기지 않는다 (고아 글자)

## 8. 복사해서 쓰는 법

1. `themes/editorial-scroll/theme.css`(+`theme.js`)를 자기 프로젝트의 같은 경로에 둔다.
2. 콘텐츠를 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]] §3의 슬라이드 종류로 쓴다. 이 테마가 특별히 요구하는 것: `data-section` 이 있으면 점이 섹션별로 묶인다. 헤드라인의 `<br/>` 는 콘텐츠에 이미 들어 있고, `clamp()` 상한이 1920 폭에서 넘치지 않게 잡혀 있다.
3. `python3 build.py --themes editorial-scroll` → `dist/editorial-scroll/index.html` 단일 파일. 검증은 `tools/verify.py` 4조합.

## 9. 계보

`v1-editorial-scroll` (3차 변주, 2026-09-09) → 최종 R1 이식. 원본 덱은 `../v1-editorial-scroll/index.html`에 그대로 보존돼 있다.
