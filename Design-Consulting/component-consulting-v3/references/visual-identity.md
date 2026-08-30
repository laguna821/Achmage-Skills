# Visual Identity Derivation — Colors/Typography semantic layer (v2)

> **v2 재작성 기록 (2026-08-28).** v1 은 실전 1호의 산출물을 역방향으로
> 정당화한 하네스였다 — "키컬러는 배치다, 3개소 이상 실재" 를 법으로
> 세웠는데, 이 프레임은 "키컬러 = 색을 더 뿌려라" 로 읽히며 **방향이
> 틀렸다** (저자 지적). 키컬러의 핵심은 배치(가산)가 아니라 **폐집합
> (감산)** 이다. v2 는 OS 의 실물 시스템 3종에서 원칙을 캐서 다시 썼다:
>
> - `40_Achmage-Wiki/wiki/design-md/my-systems/hallym-ppt-v2-DESIGN.md` —
>   키 = **navy `#002E6E` / blue `#0066B3` / teal `#00B5AD`** 인접 한랭
>   계열 3종 세트 + 각각의 명도 단계(-700/-900, -300/-100)뿐. 회색은
>   별도 중립 사다리. danger/warning/success 는 브랜드가 아니라 **격리된
>   데이터 의미색**(-soft 워시 동반). 72장 슬라이드 전체가 이 폐집합만.
> - `20_Master-Skills/achmage-frontend-design-system/references/tokens-reference.md`
>   — 브랜드 = Action Blue **한 hue 의 3단계**(500/600/700). 원문:
>   *"파랑은 행동과 핵심 강조에만 강하게 쓴다. 배경 전체를 브랜드색으로
>   물들이지 않는다."*
> - `20_Master-Skills/impeccable/impeccable/reference/color-and-contrast.md`
>   — *"Most apps work fine with **one accent color**. Adding more creates
>   decision fatigue and visual noise."* · *"Accent colors work **because
>   they're rare**. Overuse kills their power."* · 변주는 같은 hue/chroma
>   에서 **명도만** 사다리로 · 중립은 브랜드 쪽으로 미세 틴트(tinted
>   neutrals) · 알파 남용은 팔레트 미완성의 냄새.
>
> 폐기 조항(소거 기록): ~~"key 는 3개소 이상 실재해야 한다"~~ — 배치
> 개수는 법이 아니다. 첫 화면에 키 계열이 안 보이면 그것은 "더 뿌려라"가
> 아니라 "계열이 정의만 되고 적용이 안 됐다"는 **진단 신호**일 뿐이다.

**발동 조건**: Step 2 에서 DESIGN.md 가 없을 때 이 절차로 도출→emit.
있으면 소비(consumes) — 단 §V4 CJK 규칙은 항상 블로킹.

---

## V1 — Brand words (design.md §1 Overview 대응)

R1(독자)·R2(장르)에서 구체적 3어를 뽑는다 ("modern/clean/elegant" 금지).
이 3어가 컬러·타이포 공용 심판이다.

## V2 — Key color: 폐집합의 법 (design.md §2 Colors 대응)

**L1 — 폐집합 (감산이 본체).** 페이지의 채색(chromatic) 팔레트는
**한 계열의 명도 사다리**다: 같은 hue(또는 한랭/온난으로 인접한 hue 군)
에서 deep / base / soft (+wash) 3~4 단계. 그게 전부다. 서로 경쟁하는
제2의 hue 를 "다양성"으로 들이지 않는다 — 삼성이 파랑을 쓰다가 빨강을
쓰는 일은 없다. **한눈에 "뭐가 키컬러인지" 답이 안 나오면 실패다.**

**L2 — 일관.** 같은 역할 = 같은 스와치, 항상. 섹션마다 색으로 변화를
주고 싶은 충동은 지면(배경 반전)·질량·형태로 해소한다. 색은 변주 수단이
아니라 정체성이다.

**L3 — 희소.** 키는 좁은 면적에 강하게 (행동·핵심 강조·활성 상태).
배경을 키로 물들이지 않는다. 60-30-10 은 픽셀 수가 아니라 시각 무게다 —
rare 해서 작동하는 것이므로, 남용이 곧 브랜드 소거다.

**L4 — 중립은 인프라, 단 키 쪽으로 틴트.** 회색·지면 사다리는 컬러
예산 밖의 별도 사다리로 정의하되, 죽은 순수 회색 대신 키 hue 방향으로
미세 틴트(채도 0.005~0.015 수준)해 브랜드와 온도를 맞춘다. 키가 한랭인데
지면이 온난 크림이면 어긋난다.

**L5 — 의미색은 격리.** 데이터가 판정색(성공/위험 등)을 실제로 요구할
때만, 브랜드와 다른 네임스페이스(`judgment-*`)에 워시 동반으로 정의한다.
요구가 없으면 **중립으로 처리하는 것이 우선이다** (문서형 페이지의
"미확인"은 빨강이 아니라 "무게 없음"의 회색이 맞다). 의미색이 키 옆에서
loud 하게 경쟁하기 시작하면 그것은 팔레트가 아니라 소음이다.

**L6 — reflex 기각.** 반사적으로 집는 색을 적고 버린다: 인디고-바이올렛
AI 기본값, tailwind blue-500, "blue hue 250 / warm orange hue 60"
(impeccable 명시 AI 디폴트). 키는 페이지의 의미·소재 어휘에서 도출하고
V1 3어로 교차 검증한다.

**절차**: reflex 기각 → 의미 도출 → **계열 사다리로 전개** (deep/base/
soft/wash + 다크 스킴은 같은 hue 명도 재정의) → 중립 사다리 틴트 →
(필요 증명 시에만) judgment 격리 → design.md `colors:` 로 emit.

**구조 강제 (design.md 가 존재하는 이유).** 컴포넌트의 모든 색 값은
`{colors.*}` 참조여야 한다 — 폐집합이 문법으로 강제되면 제2 hue 는
토큰을 추가하지 않는 한 물리적으로 들어올 수 없다.

## V3 — Typography: 사다리의 법 (design.md §3 대응)

> **전체 처방 절차는 `typography-prescription.md` 가 정본이다** (T1 단일
> 패밀리 기본법 · T2 스케일 법 · T3 역할 시트 법 · T4 무게 사다리 · T5
> 페어링 · T6 실행 감사). 아래 L1–L5 는 그 요약이며 충돌 시 정본 우선.

**L1 — 위계는 패밀리 수가 아니라 사다리다.** 무게·크기 사다리를 가진
한 패밀리가 위계의 기본 수단이다 — Hallym PPT v2 는 **Pretendard 단일
패밀리**의 weight ladder(800→400)로 72장을 다 만든다. 패밀리 추가는
기존 패밀리가 그 일을 물리적으로 못 할 때만 허용된다 (장문 세리프 가독,
본문 언어 네이티브 커버 등 — "분위기"는 사유가 아니다).

**L2 — 상한 2+1 은 상한이지 목표가 아니다.** 아이덴티티 ≤2 + 기능 1
(+시스템 mono). 1개로 되면 1개가 정답.

**L3 — 사다리 없는 패밀리 경계.** 단일 무게(400뿐)의 디스플레이
페이스는 시스템 안에서 사다리를 만들 수 없다 — 채택하려면 그 대가
(두 번째 세리프 추가 등)를 명시하고, 대안(본문 패밀리의 700 확장)과
비교해 이겨야 한다.

**L4 — 혼종 폴백 금지.** 본문 언어 글리프를 못 덮는 패밀리(예: Atkinson
Hyperlegible 은 라틴 전용)는 기능 폰트 자격이 없다 — 한글이 시스템
폰트로 폴백되며 혼종 조판이 된다. 라틴 전용은 순수 라틴/숫자 문자열에만.

**L5 — 역할표 의무** (design.md typography 스키마로 emit): display /
body / label / figures — family·size(clamp)·weight·lineHeight·
letterSpacing. 크기비 ≥1.25, display ≥ body ×1.5. impeccable 의
reflex_fonts_to_reject 와 폰트 Step 1–4 는 상위 규칙.

## V4 — CJK 조판 하드룰 (항상 블로킹)

- `word-break: keep-all` 본문 루트 — 어절 중간 개행("발표/는") 금지.
  `overflow-wrap:anywhere` 는 URL·ID 등 기계 문자열에만 국소 적용.
- 헤드라인 개행은 우연에 맡기지 않는다: `text-wrap:balance` + 명시
  `<br>`/`<wbr>`. 한국어 제목을 `max-width:Nch` 로 절단하지 않는다.
- 한글에 장평 트래킹 금지 (`letter-spacing ≥ .08em` 은 순수 라틴 대문자
  전용). 한글 라벨 위계는 크기·굵기·색으로.
- `tabular-nums` 미지원 패밀리면 자리수 정렬 의존 레이아웃 회피.

## V5 — Emit

도출 결과를 [[design-md-spec]] 문법(`colors/typography/spacing/rounded/
components`, `{dot.path}` 참조, 8섹션 순서)으로 `DESIGN.md` emit.
이후 단계는 그 파일을 소비한다.

**다크 스킴 활성 경로 의무 (v3.4 — F21/D4 동인).** 다크 재정의를 emit
하면 **활성 경로 배선까지가 정의의 일부다** — 토글 UI 또는
`prefers-color-scheme` 미디어 쿼리 중 하나를 빌드에 명시한다. 활성
경로 없는 다크 토큰은 죽은 코드다 (실측: 다크를 2스킴 검증까지 통과해
놓고 사용자가 볼 방법이 없었다). 다크를 지원하지 않기로 했으면 다크
토큰을 emit 하지 않는다 — 반쪽 지원이 최악이다.

## Self-check (SKILL §2 Step 8 병합분)

- 채색 팔레트가 **한 계열의 명도 사다리**인가? 경쟁하는 제2 hue 가
  있는가 — 있다면 데이터가 요구를 증명했고 judgment 네임스페이스로
  격리했는가?
- 중립 사다리가 키 hue 쪽으로 틴트되어 온도가 맞는가?
- 키가 배경을 물들이고 있지 않은가 (희소성)? 반대로 첫 화면에 계열이
  전혀 실재하지 않는가 (적용 실패 진단)?
- 패밀리 수가 사다리 논리로 정당화되는가 (추가 패밀리마다 "기존이 못
  하는 일" 명시)? 혼종 폴백이 없는가?
- 한국어 페이지: keep-all · 트래킹 · ch-절단 전항 준수?
- 모든 컴포넌트 색이 `{colors.*}` 참조인가 (폐집합의 구조 강제)?
- design.md 문법으로 emit 되었는가?
- 다크 토큰을 emit 했다면 **활성 경로**(토글 or prefers-color-scheme)가
  빌드에 배선됐는가 — 없으면 다크 토큰 제거가 정답 (V5)?
