# 하루: 맨땅에서 출시 발표까지 (통합 시험, 2026-11-04)

`apple-hig-design` 스킬 하나로 할 일·프로젝트 웹앱 '하루'를 기획부터 출시 발표 자료까지 이어서 만든 기록입니다. 단계마다 다른 에이전트가 앞 단계의 문서만 읽고 이어 갔고, 사람은 제품 주인으로서 질문에 답만 했습니다.

## 바로 열어 보기

| 산출물 | 주소 |
| --- | --- |
| 동작하는 웹앱 (예시 데이터) | [04-build/?sample=1](https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/04-build/?sample=1) |
| 웹앱 (빈 상태에서 시작) | [04-build/](https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/04-build/) |
| 랜딩 페이지 | [06-media/landing/](https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/06-media/landing/) |
| 카드뉴스 5장 (1080×1350) | [06-media/cards/cards.html](https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/06-media/cards/cards.html) |
| 데모 덱, PC 13단계 | [07-deck/web/](https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/07-deck/web/) |
| 데모 덱, 휴대폰 8단계 | [07-deck/app/](https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/07-deck/app/) |

데모 덱 조작: → 또는 Space 다음, ← 이전, L 직접 조작, R 처음 상태로, F 전체 화면, ? 도움말. 덱은 진짜 앱을 띄워 놓고 한 요소만 밝히며 설명합니다.

데이터는 브라우저 저장소(localStorage)에만 저장됩니다. 서버, 로그인, 데이터베이스는 없습니다.

## 단계별 산출물

| 단계 | 폴더 | 산출물 | 숫자 |
| --- | --- | --- | --- |
| 1. 정의와 구조 | [01-plan/](01-plan) | 기획서, 흐름 지도, 화면 목록 | 화면 9개 (S01~S09), 정할 거리 16개 (D01~D16) |
| 2. 결정과 화면 구성 | [02-design/](02-design) | 결정 기록, 화면 명세 9장 | 규칙 인용 326개, 없는 ID 0 |
| 3. 시각, 동작, 문구 | [03-system/](03-system) | 시각 체계, theme.css, 상태와 피드백 표, 문구 표 | 규칙 인용 195개, 없는 ID 0 |
| 4. 구현 | [04-build/](04-build) | 동작하는 웹앱 | 화면 9개, HIG Kit 부품 사용 |
| 5. 검토와 수정 | [05-review/](05-review), [04-build/fix-log.md](04-build/fix-log.md) | 독립 검토 보고서, 수정 기록 | 17건 중 15건 해결, 2건 일부 |
| 6. 출시 자료 | [06-media/](06-media) | 랜딩 페이지, 카드뉴스 5장과 대체 텍스트, 시안 비교 | 자동 점검 문제 0 |
| 7. 발표 | [07-deck/](07-deck) | 데모 덱 PC 13단계, 휴대폰 8단계 | 앞뒤 이동, 빠른 연타, 직접 클릭, 초기화 통과 |

각 폴더의 `answer.md`는 그 단계를 맡은 에이전트가 남긴 전달 메모입니다. 시험 당시에는 로컬 미리 보기 서버에서 열었고, 이 사본의 주소는 GitHub Pages로 바꿨습니다.

## 숫자로 본 결과

- 추적: 화면 9개(공통 문구 포함 10)와 결정 16개가 문서에서 코드의 `data-screen`, `data-decision`까지 모두 이어졌습니다 (`scripts/trace.mjs`, 빈 곳 0).
- 검토: 독립 검토자가 Blocker 1, Major 3, Minor 13을 찾았습니다. 수정 후 Blocker와 Major는 0, Minor는 11개 해결, 2개 일부 해결.
- 자동 점검: 15개 상태 × 2폭 × 2모드, 60회 실행에서 문제 0 (`scripts/audit-page.js`: 글꼴, 최소 글자, 대비, 조작 영역, 이름과 라벨, 잘림).

## 주인 답변 가운데 시험용으로 대신 정한 것

이 시험의 '제품 주인' 답변은 에이전트가 위임을 받아 정한 것이며 실제 사용자 결정이 아닙니다. 예: 레귤러 화면에서 휴지통 비우기는 일반 스타일 알림과 Return 확인(D01), 실행 취소 메시지는 시간 제한 없음(D02). 근거와 개정 기록은 [02-design/decisions.md](02-design/decisions.md)에 있습니다.

## 남은 한계

- 서버, 로그인, 기기 간 동기화가 없습니다. 이번 범위가 브라우저 저장 프론트엔드였기 때문입니다.
- 날짜 선택은 브라우저 기본 부품입니다. 부품 모음에 달력이 없습니다.
- Chromium 계열 브라우저에서만 시험했습니다. 실제 VoiceOver, Safari, Firefox, 터치 기기는 시험하지 않았습니다.
- 195 px처럼 매우 좁은 폭에서 탭 글자가 단어 중간에서 줄바꿈됩니다.
