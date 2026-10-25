---
version: alpha
name: Achmage Portfolio
description: White editorial reading surfaces with original SameTone typography and navy, blue and teal structure, derived from the approved Achmage Field Guide v7.
colors:
  primary: "#002e6e"
  on-primary: "#ffffff"
  secondary: "#0066b3"
  on-secondary: "#ffffff"
  accent: "#00b5ad"
  on-accent: "#002e6e"
  accent-text: "#007f7b"
  surface: "#ffffff"
  on-surface: "#142b46"
  muted: "#536273"
  soft: "#edf2f5"
  line: "#d6e0e8"
  dark-surface: "#071b2e"
  dark-panel: "#0b233b"
  dark-text: "#eef5fc"
  dark-muted: "#b0c1d1"
  dark-link: "#79baf2"
  dark-line: "#30475c"
  dark-soft: "#102b44"
  dark-accent-text: "#5ddcd1"
typography:
  display:
    fontFamily: Achmage SameTone
    fontSize: 66px
    fontWeight: 650
    lineHeight: 1.16
    letterSpacing: -0.055em
  display-mobile:
    fontFamily: Achmage SameTone
    fontSize: 39px
    fontWeight: 650
    lineHeight: 1.18
    letterSpacing: -0.04em
  h1:
    fontFamily: Achmage SameTone
    fontSize: 48px
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: -0.04em
  h2:
    fontFamily: Achmage SameTone
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.035em
  h3:
    fontFamily: Achmage SameTone
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.02em
  body:
    fontFamily: Achmage SameTone
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.95
    letterSpacing: 0em
  intro:
    fontFamily: Achmage SameTone
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: -0.01em
  caption:
    fontFamily: Achmage SameTone
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0em
  label:
    fontFamily: Achmage SameTone
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.02em
  code:
    fontFamily: Achmage SameTone
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0em
spacing:
  unit: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  section: 72px
  canvas: 1440px
  touch: 44px
rounded:
  sm: 4px
  md: 8px
components:
  primary-button: {backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.caption}", rounded: "{rounded.sm}", height: "{spacing.touch}"}
  primary-button-hover: {backgroundColor: "{colors.secondary}", textColor: "{colors.on-secondary}"}
  accent-marker: {backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}"}
  reading-surface: {backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.body}"}
  caption: {backgroundColor: "{colors.surface}", textColor: "{colors.muted}", typography: "{typography.caption}"}
  text-accent: {backgroundColor: "{colors.surface}", textColor: "{colors.accent-text}"}
  soft-panel: {backgroundColor: "{colors.soft}", textColor: "{colors.on-surface}", rounded: "{rounded.sm}", padding: "{spacing.md}"}
  separator: {backgroundColor: "{colors.line}", height: 1px}
  dark-reading: {backgroundColor: "{colors.dark-surface}", textColor: "{colors.dark-text}"}
  dark-panel: {backgroundColor: "{colors.dark-panel}", textColor: "{colors.dark-text}"}
  dark-caption: {backgroundColor: "{colors.dark-panel}", textColor: "{colors.dark-muted}"}
  dark-link: {backgroundColor: "{colors.dark-surface}", textColor: "{colors.dark-link}"}
  dark-separator: {backgroundColor: "{colors.dark-line}", height: 1px}
  dark-soft: {backgroundColor: "{colors.dark-soft}", textColor: "{colors.dark-text}"}
  dark-accent: {backgroundColor: "{colors.dark-surface}", textColor: "{colors.dark-accent-text}"}
---

## Overview

안창현의 포트폴리오를 처음 보는 사람도 무엇을 만들었고 왜 만들었는지 이해하는 화면이다. Field Guide v7의 소개·전체 지도·상세 읽기·근거 확인 순서를 표준으로 사용한다. 첫 화면은 왼쪽 설명과 오른쪽의 구체적 흐름으로 시작하고, 아래에서 전체 모음과 깊이 있는 설명으로 이어진다.

흰색 읽기 공간, 네이비 구조, 블루 링크와 동작, 틸의 작은 강조를 사용한다. 제목과 짧은 표식만 읽어도 큰 방향을 알 수 있고, 본문을 읽으면 구현과 예시가 이어져야 한다. 장식이나 긴 애니메이션이 읽는 순서를 대신하지 않는다.

## Colors

primary는 딥네이비 구조와 주요 버튼, secondary는 이동할 수 있는 링크와 강조 제목이다. accent는 표식과 선에 사용하고 흰 바탕의 작은 글자에는 accent-text를 쓴다. surface는 흰 읽기 바탕, soft는 예시·보조 구획, line은 구분선이다.

네이비 구획에는 on-primary를 사용한다. 선택 가능한 다크 테마는 dark-* 토큰으로 전체 글자·선·표면을 함께 바꾼다. 강조색 하나만 바꿔 대비를 깨지 않는다.

## Typography

전용 Achmage SameTone 1.000의 원본 WOFF2를 로컬 자산으로 제공한다. 본문·코드·레이블도 같은 서체를 사용하며 숫자는 필요한 곳에 tabular-nums를 적용한다. 원본이 제공되지 않으면 다른 서체를 같은 브랜드인 것처럼 사용하지 않는다.

본문은 17px, 행간 1.95, 최대 72ch를 기준으로 읽힌다. display는 데스크톱에서 44–66px 사이로 유동 조절하고 작은 화면에서 39px까지 낮춘다. 일반 본문은 작은 화면에서도 줄이지 않는다. 제목은 h1/h2/h3의 의미 순서를 지키며 크기 때문에 제목 단계를 건너뛰지 않는다.

## Layout

최대 1440px 캔버스에 같은 좌측 정렬선을 사용한다. 소개는 설명과 네이비 흐름 화면의 두 열, 모음집은 분류 레일과 목록, 상세는 펼쳐진 목차와 장문 본문으로 구성한다.

1200px 이하에서는 간격과 레일 폭을 줄인다. 1060px 이하에서 상단 메뉴와 모음집을 접거나 한 열로 바꾸고, 1000px 이하에서 상세 목차를 모바일 형태로 바꾼다. 760px 이하에서는 소개와 나머지 다단 구획을 세로로 쌓는다. 400px 이하에서는 여백과 로고만 더 줄인다.

활성 장의 소목차를 펼쳐 두고 44px 터치 영역을 확보한다. 고정 헤더 아래에 링크 대상 제목이 보이게 한다. 표·코드의 가로 스크롤은 해당 구획 안에 제한한다.

## Elevation & Depth

깊이는 1px 선과 표면색 차이로 표현한다. 네이비 소개 그림의 짧은 오프셋 그림자와 검색 대화상자의 배경 차단은 기능을 드러내는 곳에만 쓴다. 독서 흐름에 떠 있는 장식 패널을 추가하지 않는다.

## Shapes

기본은 직사각형이다. 버튼과 입력은 sm, 검색 대화상자는 md 모서리를 사용한다. 연결된 목록은 공통 외곽선과 내부 구분선으로 묶는다.

## Components

### 소개와 전체 지도

소개는 쉬운 문제 설명과 구체적인 입력→단계→결과를 함께 보여준다. 흐름 화면은 실제 동작을 설명하는 예시이며 가짜 실시간 대시보드를 표시하지 않는다. 읽기 경로는 독자가 시작·구조·전체 설명·응용 중 필요한 곳을 고르게 한다.

### 모음집과 상세

모음집은 제목·구체적 설명·분류·필요한 정확한 명령을 보여준다. 추가 사양만 접고 핵심 설명은 펼친다. 상세 화면은 숫자, 제목, 충분한 본문, 소목차, 근거로 구성한다.

### 도식과 이미지

도식은 구성요소와 입력·출력을 설명하고, 설명 그림은 실제 파일·기기·행동을 보여준다. 그림마다 alt와 캡션, 출처를 붙인다. 원본 화면 캡처와 생성 그림을 구분한다.

### 상호작용

메뉴와 문서는 일반 링크로 이동한다. 검색은 키보드와 Escape, 명확한 빈 결과를 지원한다. 활성 분류는 색과 aria-pressed로 표시한다. 언어 전환은 현재 장·절을 유지한다. 짧은 상태 전환만 쓰고 줄어든 모션 설정을 따른다.

## Do's and Don'ts

- 같은 원천 데이터로 본문·검색·목차·전체 Markdown을 만든다.
- 핵심 설명을 본문에 보이고, 기술 부록만 접는다.
- 실제 근거와 현재 검증 범위를 표시한다.
- 전용 폰트·로고·색을 일반 디자인 스킬의 권고로 바꾸지 않는다.
- 자료가 없는 메뉴·성과 수치·그래프를 만들어 넣지 않는다.
- 그림이나 작은 레이블만으로 설명을 대신하지 않는다.
