---
version: alpha
name: Phosphor Gallery (인광 화랑)
description: Fixed-scheme dark-gallery design system for the fictional exhibition viewing room 《잔광》. Phosphor-green single key ladder on green-tinted gallery neutrals, serif display + gothic body (catalog convention, R2-proven), borders-only frames. Derived via component-consulting-v3 Step 2.

colors:
  key: "#22A96C"
  key-deep: "#147A4E"
  key-soft: "#5FE3A8"
  key-wash: "#DDF3E7"
  wall-black: "#0E1110"
  wall-deep: "#171C19"
  wall-mid: "#9AA69D"
  cube-white: "#F2F5F1"
  paper: "#E9EEE9"
  ink: "#101512"
  ink-soft: "#2E3630"
  on-dark: "#ECF2EC"
  muted-on-dark: "#A7B3AA"
  muted-on-light: "#4A554D"
  muted-on-mid: "#232B26"
  line-dark: "#2A322D"
  line-light: "#C9D2CB"

typography:
  display:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "clamp(2.518rem, 6vw, 4.476rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "clamp(1.889rem, 3.4vw, 2.518rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.008em"
  work-title:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "1.417rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0"
  body:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "0"
  label:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  figures:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "clamp(1.889rem, 3vw, 2.518rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0"

spacing:
  unit: "8px"
  prose: "42rem"
  content: "50rem"
  wide: "72rem"

rounded:
  sm: "2px"
  pill: "999px"

components:
  frame:
    border: "1px solid {colors.line-dark}"
    mat: "{spacing.unit} × 2 padding, background {colors.wall-deep}"
    hairline: "outline 1px {colors.line-dark} offset 6px"
  caption-plate:
    background: "{colors.wall-deep}"
    title: "{typography.work-title}"
    meta: "{typography.caption}"
  room-dots:
    active: "{colors.key-soft}"
    idle: "{colors.line-dark}"
  wayfinding:
    plate: "{colors.wall-black} @ .82"
    text: "{typography.label} {colors.on-dark}"
---

# Phosphor Gallery (인광 화랑)

## Overview

가상 전시 《잔광》의 온라인 뷰잉룸. 성격 3어: **잔광의(phosphor) ·
무광 화랑의(matte-gallery) · 여백의(sparse)**. 조명이 고정된 갤러리
이므로 **단일 스킴 고정**을 선언한다 — 다크 토큰을 emit 하지 않는다
(V5: 반쪽 지원이 최악, 미지원 선언이 합법 경로). 어두운 전시 벽과
화이트큐브 방이 교대하는 것이 이 페이지의 명암 리듬이다.

- Reflex 기각 (V2 L6): 인디고-바이올렛 AI 기본값 · tailwind blue ·
  (실전 4호-A 인주의 관성 재사용도 기각 — 이 페이지의 의미는 날인이
  아니라 잔광). 키 = **인광 그린** — 작품 주제(CRT 형광물질의 잔광)
  에서 직접 도출.

## Colors

- 채색 = 인광 한 계열 사다리: `{colors.key-deep}` / `{colors.key}` /
  `{colors.key-soft}` / `{colors.key-wash}`. 어두운 벽 위 키 텍스트는
  `{colors.key-soft}`, 밝은 방 위 키 텍스트는 `{colors.key-deep}`
  (대비 역할 분담 — 같은 사다리의 명도 선택이지 제2 hue 가 아니다).
- 중립은 전부 그린 틴트 (갤러리 무광 도장): 검은 벽 · 회벽(mid) ·
  화이트큐브. 키가 한랭이므로 지면도 한랭 ✓.
- 키는 희소: 활성 인디케이터·라벨 악센트·인광 글로우(무대 씬)에만.
  작품 위에는 절대 올리지 않는다.
- judgment 색 없음 (데이터 요구 부재).

## Typography

- **2 패밀리 (T1 증명 경로)**: display = **Noto Serif KR** (전시 도록
  장르의 편집 관행 — R2 가 요구하는 명시적 편집 의도; display·작품명
  전용, 본문 침투 금지) + body = **Pretendard Variable**. 둘 다
  impeccable `reflex_fonts_to_reject` **원문 대조 통과** (2026-08-30,
  목록 20종 전수 확인 — 등재 없음). 한글 커버리지 네이티브 ✓ 혼종
  폴백 없음 ✓.
- 스케일: base 17px · 비율 **1.333 (Perfect Fourth — 전시 대화면
  고대비)**. 전 크기 사다리 토큰. 무게 값 집합 {400, 700, 900} = 3종.
- CJK 하드룰 (V4) 전항 준수 — 작품명 한자 병기는 lang 속성으로.

## Layout

- 폭 사다리 3계: wide 72rem / content 50rem / prose 42rem — 전 섹션
  콘텐츠 박스는 이 토큰만.
- 갤러리 월(B3)은 wide 에서 12컬럼 비대칭 스팬 (G4 — 대표작이 큰
  칸을 받는다. 균등 격자는 이 장르의 전형 실패).

## Elevation & Depth

- **Borders-only.** 그림자 금지. 액자는 매트(패딩) + 1px 보더 +
  헤어라인 아웃라인의 3겹으로 깊이를 만든다. 글로우는 씬 스크림
  (인광) 전용 — UI 요소에 금지.

## Shapes

- 모서리 `{rounded.sm}` 2px (액자 칼각). 방 인디케이터 dot 만 pill.

## Components

- `frame` / `caption-plate` / `room-dots` / `wayfinding`: 위 YAML
  `components:` 블록이 정본. **작품 위 텍스트·스크림 금지** — 캡션은
  항상 별도 플레이트 (도록 원고 §1 의 "작품은 작품의 벽에, 말은 말의
  벽에"가 토큰 계약이기도 하다).

## Do's and Don'ts

- DO: 작품 `<img>` 는 무필터·무스크림 원본 — 씬 트리트먼트는 무대/
  복도 배경 raw 에만.
- DO: 씬 기법은 cover(무대)·tone(복도)·cover 저농도 에코(콜로폰) 3곳.
- DON'T: 작품 이미지를 배경으로 깔고 글자 올리기(훼손) · 균등 N열
  작품 그리드 · 그라디언트 텍스트 · 그림자 카드 · 자동 캐러셀.
