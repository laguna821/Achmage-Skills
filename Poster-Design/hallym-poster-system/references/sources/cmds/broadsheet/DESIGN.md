---
type: documentation
aliases:
  - Broadsheet DESIGN
description: "Newspaper front-page typesetting: static masthead and folio printed on every sheet, six-column measure with hairline column rules, ink-on-newsprint light and a night edition dark."
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

# Broadsheet — DESIGN

> [!info] 한 줄 정의
> 마스트헤드가 크롬이다

## 1. 언제 쓰나 / 쓰지 말 것

긴 호흡의 강의·에세이형 발표, 인쇄본(PDF)까지 같이 나가는 덱. 마스트헤드·폴리오가 지면에 인쇄돼 JS 없이도 진행이 남는다.

- 엔진: `stage` · 계보: v7 Cinema → v11 Broadsheet · 원본: `v11-broadsheet`
- 이 문서는 스타일 층만 기술한다. 발표 기능(P/F/N/A/T)과 마크업 계약은 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]]과 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/DESIGN|덱 시스템 DESIGN]]가 정본.

## 2. 시그니처 결정 5

1. 마스트헤드가 크롬이다 — 제호·귀·폴리오·이중 괘선(4px+1px)이 매 면 지면 위에 인쇄되고, 굵은 괘선의 액센트 구간이 진행을 말한다
2. 6단 격자 위 1px 괘선으로만 나눈다 — 카드·그림자·둥근 모서리 없음, 강조는 잉크 반전 한 가지
3. 세리프 없이 신문 위계 — SF Pro/Pretendard 800 헤드라인(-.04em) · 400 데크 · 모노 슬러그와 폴리오
4. 각주는 매 면 하단 밴드(3px 괘선) — 24면이 같은 문법으로 읽힌다
5. 인쇄는 항상 신문지 라이트 — 다크(야간판)가 켜져 있어도 잉크 반전으로 찍지 않는다

## 3. 토큰

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| `accent` | `#134538` | `#E985A2` |
| `accentOn` | `#FFFFFF` | `#1B1B1B` |
| `dim` | `#56534B` | `#ABA79B` |
| `faint` | `#6E6A60` | `#8A867B` |
| `ink` | `#17160F` | `#EDE8DC` |
| `paper` | `#F3F0E8` | `#121212` |
| `rule` | `#C9C4B5` | `#3A3831` |
| `tint` | `#EAE6DA` | `#1B1A17` |

- 격자: `--pad-x 96px` `--gut 36px` `--col calc((1920 - 96*2 - 36*5) / 6)` = 6단
- 여백: `--pad-t 52px` `--pad-b 60px` `--body-gap 32px`
- 괘선 3종: 4px 제호 굵은 괘선 · 3px 각주 밴드 · 1px 본문 괘선

## 4. 콘텐츠 클래스 → 이 테마의 해석

| kind | 내용 | 해석 |
|------|------|------|
| `k-cover 01` | 표지 | 1면 제호 + 톱기사 헤드라인 |
| `k-section 03·09·14·20` | 섹션 표지 | 섹션 프런트(경제/과학면 같은 면 머리) |
| `k-statement 04·17` | 선언 | 전면 사설 |
| `k-steps 05` | 4단 프로세스 | 4단 기사 컬럼 |
| `k-ladder 15` | 세로 사다리 | 세로 리스트, 강조 행은 잉크 반전 |
| `k-grid 02·06·22` | 그리드 4열·3×3 | 6단 격자 위 셀, 괘선만으로 분리 |
| `k-cards 21` | 카드 3장 | 카드 3장이 박스 기사, 마지막은 잉크 반전 |
| `k-stats 07` | 카운터 통계 | 큰 수치 리드 |
| `k-table 08·16` | 표 | 표는 신문 표 조판(모노 헤더 + 1px 괘선) |
| `k-quote 10` | 인용 | 인용은 큰 활자 발췌문 |
| `k-diagram 11` | SVG 도해 | 도해는 잉크 인포그래픽 |
| `k-compare 12` | 2열 대비 | 두 열이 좌우 사설 대비 |
| `k-terminal 13` | 터미널 | 터미널은 조판된 리스팅 박스 |
| `k-timeline 18` | 타임라인 5틱 | 타임라인이 연표 |
| `k-bars 19` | 가로 막대 | 막대가 지표 그래프 |
| `k-toggle 23` | 관점 토글 | 토글이 판형 전환 |
| `k-outro 24` | 아웃트로 | 마지막 면 폴리오 + 안내 |

## 5. 모션·순차 공개

신문은 움직이지 않는다. `[data-step]` 은 코어 기본보다 짧은 페이드만. 마스트헤드·폴리오는 `theme.js` 가 init 에서 한 번 그려 DOM 에 고정하므로 JS 가 죽어도, 인쇄해도 남는다.

## 6. 크롬·진행 표시

**마스트헤드가 크롬이다.** 매 면 상단에 제호·귀(edition)·폴리오(`섹션 · nn / 24`)가 인쇄되고, 굵은 괘선의 액센트 구간 길이가 진행을 말한다. 하단에는 각주 밴드(3px 괘선). 코어 패널은 신문지 톤으로 재스킨.

## 7. 금지

- 세리프 폰트 (신문 느낌은 괘선·격자·웨이트로 낸다 — CI 폰트 규칙)
- 카드·그림자·둥근 모서리
- 다크(야간판)로 인쇄하지 않는다 — 인쇄는 항상 신문지 라이트

## 8. 복사해서 쓰는 법

1. `themes/broadsheet/theme.css`(+`theme.js`)를 자기 프로젝트의 같은 경로에 둔다.
2. 콘텐츠를 [[70. Outputs/74. Projects/발표덱 시스템 비교/final/CONTRACT|덱 이식 계약]] §3의 슬라이드 종류로 쓴다. 이 테마가 특별히 요구하는 것: `data-section-name` 이 폴리오의 면 이름이 된다. 6단 격자가 모든 kind 의 바탕 measure 다.
3. `python3 build.py --themes broadsheet` → `dist/broadsheet/index.html` 단일 파일. 검증은 `tools/verify.py` 4조합.

## 9. 계보

`v11-broadsheet` (3차 변주, 2026-09-09) → 최종 R1 이식. 원본 덱은 `../v11-broadsheet/index.html`에 그대로 보존돼 있다.
