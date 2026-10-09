---
type: documentation
aliases:
  - Intertitle DESIGN
description: "Design spec for the Intertitle deck theme (port of v10 silent-film title cards onto deck-core): 2.39:1 letterbox band inside the 1920 stage, scene slate in the bars, centered heavy display type, hairline frame, cut-style sequential reveal. Read to copy the theme onto other content or to review its rules."
author:
  - "[[구요한]]"
model: "claude-fable-5-1[1m]"
effort: "high"
date created: 2026-09-09
date modified: 2026-09-09
tags:
  - deck
  - design-system
  - theme
CMDS: "[[📚 731 Digital Art and Design]]"
index: "[[🏷 Lecture Notes]]"
session-link: "omnicontrol://focus?workspace=F16E53B8-C34B-4A18-B844-37D380F04A26&surface=2151B816-C318-490A-8B71-FF47057AB64B&label=final&cwd=%2FUsers%2Fyohankoo%2FLocal+Obsidian_MBP%2FCMDSPACE_Local_MBP%2F70.+Outputs%2F74.+Projects%2F%EB%B0%9C%ED%91%9C%EB%8D%B1+%EC%8B%9C%EC%8A%A4%ED%85%9C+%EB%B9%84%EA%B5%90%2Ffinal&session=2a28e4a9-fb82-4811-8557-c638cda3e4ba&revive=1"
---

# Intertitle — DESIGN

## 1. 한 줄 정의
무성영화의 자막 카드. 1920 무대 안에 2.39:1 픽처 밴드(804px)를 두고, 위아래 검정 바가 씬 슬레이트·진행·각주를 나르며, 밴드 안에는 문장 하나가 정중앙에 선다. 공개는 컷이다.

## 2. 언제 쓰나 / 쓰지 말 것
- **쓴다** — 대활자 선언·인용·섹션 전환이 발표의 리듬인 강연. 한 화면에 한 문장을 크게 세우고 컷을 넘기며 말할 때. 다크 룸 투사.
- **쓰지 말 것** — 표·그리드가 주가 되는 자료(밴드 높이 804px가 상한이라 8행 표·9칸 그리드가 한계다). 손에 들고 보는 PDF 핸드아웃(바 영역이 지면의 26%를 차지한다). 데이터 밀도가 높은 대시보드형 덱.

## 3. 시그니처 결정 5개
### 3.1 레터박스 밴드
- **무엇** — 슬라이드 = 바(`--bars`) + 밴드(`--bg`). 밴드는 항상 804px, 바는 남는 세로를 흡수한다.
- **왜** — 촬영된 프레임의 인상. 16:10에서도 밴드가 커지지 않고 바가 자라는 것이 레터박스의 자연스러운 동작이다.
- **어떻게** — `--bar:138px`(16:9) / `198px`(16:10), `.slide::before{top:var(--bar);height:804px;background:var(--bg)}`, 슬라이드 패딩 `calc(var(--bar) + 34px + 30px) 100px`.
### 3.2 씬 슬레이트
- **무엇** — 상단 좌측 모노 `SC 05 · TAKE 02 / 04`. TAKE는 공개된 `[data-step]` 수, 분모는 전체 스텝 수(스텝 없는 장은 `01 / 01`).
- **왜** — 발표자가 시연으로 화면을 나갔다 돌아와도 어느 컷인지 즉시 잡힌다.
- **어떻게** — theme.js가 슬라이드마다 `header.it-top`을 주입, `slide`·`step` 훅에서 DOM의 `.in` 개수를 읽어 갱신.
### 3.3 센터 대활자
- **무엇** — 커버 144px · 섹션 140px · 선언 92px · 인용 80px · 나머지 52px. 전부 밴드 정중앙, 액센트는 `em`/`b` 한 조각.
- **왜** — 자막 카드는 문장이 곧 화면이다. 콘텐츠 장도 같은 축(중앙 정렬)을 유지해 덱 전체가 한 장르로 읽힌다.
- **어떻게** — `.headline{font:700 52px/1.12 var(--font-display);letter-spacing:-.035em;text-wrap:balance}` + kind별 크기 오버라이드.
### 3.4 헤어라인 프레임
- **무엇** — 밴드 안쪽 34px 인셋에 1px 선 하나. 셀·표·단계·타임라인도 전부 1px 헤어라인만 쓴다.
- **왜** — 채움·그림자·그라디언트 없이 "프레임 안"을 만든다. Anti-Slop.
- **어떻게** — `.slide::after{inset:calc(var(--bar)+34px) 34px;border:1px solid var(--line)}`, 셀 `border:1px solid var(--line)`.
### 3.5 컷 공개와 릴
- **무엇** — 스텝은 14px 상승 페이드로 들어오고, 리스트·타임라인에서는 지나간 컷이 dim으로 물러난다(릴 모드).
- **왜** — v10의 "교체형 자막"을 코어 계약(모든 스텝 유지) 안에서 재현하는 방법. 최신 컷만 살아 있다.
- **어떻게** — `html.js [data-step]{opacity:0;transform:translateY(14px)}` / `.in{opacity:1}`, `li[data-step].in:has(~ [data-step].in){color:var(--dim)}`.

## 4. 토큰 표

| 토큰 | Light | Dark | 용도 |
|------|-------|------|------|
| `--bars` | `#E6E1D5` | `#000000` | 상·하 바, body 배경 |
| `--bg` | `#F6F3EC` | `#0B0B0B` | 픽처 밴드 |
| `--fg` | `#1B1B1B` | `#F2F0EB` | 본문·대활자 |
| `--dim` | `#5A574F` | `#A9A59D` | 리드·부연·지나간 컷 |
| `--faint` | `#948F86` | `#6A6760` | 슬레이트·인덱스·표 헤더 |
| `--line` | `#D5CFC2` | `#2A2825` | 헤어라인 전부 |
| `--surface` | `#ECE8DE` | `#161513` | 도해 박스·다크 터미널 |
| `--accent` | `#134538` | `#E985A2` | 단 하나의 강조색 |
| `--accent-on` | `#FFFFFF` | `#1B1B1B` | 액센트 위 글자 |

타이포 스케일(px, 1920 기준): 슬레이트·바 17 mono · 각주 18 · 셀 본문 20~22 · 표 26 · 리드 28~32 · 셀 제목 28~34 · 헤드라인 52 · 선언 92 · 인용 80 · 섹션 140 · 커버 144 · 숫자 156. 간격: 슬라이드 gap 40 · 그리드 gap 14 · 단계 gap 24. 선: 전부 1px (`.step.hi` 상단만 2px).

## 5. 콘텐츠 클래스 → 해석

| kind | 해석 |
|------|------|
| `k-cover` | 144px 2행 대활자 정중앙 + 리드(dim 32). 각주는 하단 바로 내려간다 |
| `k-section` | 140px 제목 + `.sub` 44px dim + 리드는 모노 액센트 letterspaced(`Connect · Merge …`) |
| `k-statement` | 92px 3행 선언, `em` 액센트. 17의 리스트는 릴 자막(모노 라벨 + 문장) |
| `k-steps` | 4열, 상단 헤어라인, 모노 라벨 → 34px 제목 → 23px dim 본문, 중앙 정렬 |
| `k-ladder` | 세로 4행 `120 / 300 / 1fr` 그리드, `.hi` 행은 액센트 라벨 pill + 액센트 제목 |
| `k-grid` | 헤어라인 셀, 셀 안 중앙 정렬. `nine`은 3×3 190px 행, `constellation`은 모노 핸들 |
| `k-cards` | 셀 번호가 액센트 pill(`HOW`·`WHY`·`VISUAL`), 스텝으로 한 장씩 |
| `k-stats` | 156px 액센트 숫자 + 52px 단위, 콘텐츠 폭 열(`10,000+`가 절대 안 꺾인다) |
| `k-table` | 헤어라인 행, 모노 대문자 헤더, `.hi` 열 액센트 볼드. 8행이 밴드 안에 든다 |
| `k-quote` | 80px 인용 + `— cite` 모노 + 리드 dim |
| `k-diagram` | SVG 높이 460 캡, 박스 `--surface`+헤어라인, 화살표·동사 액센트 모노 |
| `k-compare` | 2열, 왼쪽(RAG) dim, 오른쪽 제목·밑줄·불릿 액센트 |
| `k-terminal` | 라이트=검정 터미널(v10), 다크=`--surface` 터미널. 프롬프트·히트 핑크 |
| `k-timeline` | 5열, 모노 시점 액센트, 지나간 틱은 릴 dim |
| `k-bars` | 헤어라인 행, 12px 트랙, `.hi` 행만 액센트(나머지 dim 막대) |
| `k-toggle` | 버튼 pill(눌림=액센트), 4셀 헤어라인, 판정문 harness 관점이면 액센트 |
| `k-outro` | 링크 제목 모노 액센트, 리드 dim |

공통: `.kicker` → 상단 바 중앙 아이브로우(액센트 대시 + 모노), `.foot` → 하단 바(각주 좌 · 출처 우), 슬레이트·인덱스·진행은 theme.js 주입.

## 6. 모션·순차 공개 규칙
- 스텝 진입 `.28s` 상승 페이드, 공개 `.45s` + `.1s` 지연(v10 값). SVG 스텝은 transform 없음.
- 릴 dim은 `.body-list li`·`.tick`에만. 격자·막대·카드·도해는 dim하지 않는다(구조가 주인공).
- 밴드는 슬라이드 진입 시 `.32s` 페이드(`.slide[data-active]::before`), `prefers-reduced-motion: no-preference`에서만.
- 자체 키 리스너 없음. 공개 상태는 코어의 `.in`만 읽는다.

## 7. 크롬·진행 표시
- 상단 바: 좌 슬레이트 `SC NN · TAKE k / n` · 중앙 kicker 아이브로우 · 우 `섹션문자 · 섹션명`.
- 하단 바: 좌 `NN / 24` + 240px 진행 트랙(액센트 채움 `scaleX(i/24)`) · 중앙 각주(`.foot-note`) · 우 출처(`.foot-src`).
- 코어 패널은 `--dk-panel-*`로 바 색·헤어라인·모노 폰트에 맞춰 재스킨. stage 모드에서는 슬라이드 안 크롬만 남는다.

## 8. 금지 목록
- id 선택자(`#sNN`) — v10 3차 검증의 자막 비표시 결함 원인. 이 테마는 0개.
- `html.js [data-step].in`보다 강한 선택자로 스텝 가시성 건드리기.
- 그라디언트·그림자·비네트·채움 배경(밴드·터미널·도해 박스·pill 제외).
- 세 번째 색. 액센트는 하나, 나머지는 fg/dim/faint 톤.
- 밴드 높이 변경(804px 고정). 내용이 안 들면 타입 스케일로 푼다.
- 바에 콘텐츠 본문 넣기(각주·출처·슬레이트·진행만).

## 9. 복사해서 쓰는 법
1. `themes/intertitle/{theme.json,theme.css,theme.js}`를 새 덱의 `themes/` 아래에 복사하고 `build.py --themes intertitle`.
2. 콘텐츠는 `CONTRACT.md §3` 마크업(`section.slide.k-*` + `.kicker .headline .lead .foot`)을 지키면 된다. `.kicker`와 `.foot`는 자동으로 바에 올라간다.
3. 슬레이트·인덱스는 theme.js가 `window.CmdsDeck`을 보고 자기 부팅한다. 다른 코어를 쓰면 `init(api)`만 직접 불러주면 된다.

## 10. 계보·출처
- 원본 `../v10-intertitle/index.html` + `NOTES.md` (2026-09-09, 3차 검증 포함). 계보: v7 Cinema 고정 무대 → v10 자막 카드 → 본 테마(코어 이식).
- 색·타이포·슬레이트·프레임 값은 v10 그대로. 바뀐 것은 `NOTES.md` 이식 요약 참조.
