# Recomposition Grammar v3 — from "buy" to "tailored assembly"

Inherited from component-consulting-v2 v2.1 (the 사용자 10회+ 지적 구조
수리) with v3 corrections: enum fix (`cut`, not the nonexistent
`banned`), corpus-based teardown (the code is real now), and generic
house-mode phrasing. The doctrine is unchanged:

> **스킨은 프로젝트 토큰, 시그니처는 보존 (reskin ≠ erase).** A shipped
> component no longer recognizable as its gallery source counts as
> **zero consumption** — that is laundering, not recomposition.

> ⚠ 폐기된 구 목표의 기록: "none still looks like its gallery
> screenshot" — 이 조항이 소거 기계였다. house 스킨 규율과 결합하면 모든
> 갤러리 컴포넌트가 "테두리 친 타이포 박스"로 합법 수렴하고, 사용자
> 눈에는 항상 "컴포넌트 한두 개"로 보였다 (E2E-2·E2E-3 전 렌더 재현).

## The six moves (ordered, mandatory per winner — #5 v3.4 · #6 v3.5)

### 1. Slot teardown — take the structure, drop the skin

v3 difference: **you have the code.** Open it (`corpus_query.py --show
{id}`) and tear down the real markup — not a remembered description.

- Adopt the slot structure (`slot_anatomy`) and interaction skeleton;
  discard the gallery's colors, fonts, radii, shadows by default —
  **except `preserve_signature`**: the structural/behavioral identity
  (odometer digit roll, before/after drag handle, ring-gauge fill,
  hover-reveal panel, accordion fold, timeline rail+nodes …) is 파괴
  금지. Killing the signature = the consumption never happened.
- Slots may be dropped, repeated, or re-ordered — the beat's move
  decides, not the original design.
- What must survive: the **affordance logic**. If teardown kills the
  affordance, the candidate was wrong — back to retrieval.

### 2. Token remap — zero orphan literals

Every styled property → a `{token}` from the DESIGN.md. No stray hex,
px, or font-name outside the token set (Axis A ceiling rule). Never
import the gallery's font. If actual remap exceeds the row's
`reskin_cost` prediction by 2+ dimensions, re-score Axis A.

### 3. Mass re-sizing — the page owns the scale

Resize to the tier the assembly plan assigned (full-bleed / wide /
content / satellite / inline): type scale, padding, and grid span
follow the tier — **the component's original scale has no vote.** Only
tiers inside `layout_affordances` are legal. Density guard: content
must visibly fill the block; cavernous padding means the tier was too
big — step down.

### 4. Hybrid — combine two candidates' slots (gated)

Max **two** parents; name both (`HYBRID: {id-a} × {id-b}`); the hybrid
re-enters Step 7 validation. Hybrids are the diversity guard's escape
hatch AND the honest answer to real corpus gaps (I7 timeline,
verdict-stamp — see `retrieval.md` gap protocol).

### 5. Responsive recomposition — 반응형도 구매의 일부다 (v3.4)

> **동인 (F23/D2).** 갤러리 부품은 데스크톱 스크린샷 기준으로 큐레이션
> 된다. 반응형 명세 없이 이식하면 빌드는 "전부 1열로 접기"라는 게으른
> 기본값으로 즉흥하고, 태블릿 밴드(≈700–1100px)는 모바일 레이아웃을
> 넓게 늘인 무주공산이 된다 (실전 2호 실측).

- **비트마다 3폭의 이야기를 쓴다** — 모바일(≤560)·태블릿(700–1100)·
  데스크톱. 처방문 MOBILE 필드는 모바일만이 아니라 **중간 폭의 형태
  결정**을 포함한다 ("태블릿에서 벤토는 2열, big 카드는 풀스팬" 수준).
- **1열 붕괴는 선언이 필요한 예외지 기본값이 아니다.** 다열 구조가
  1열로 접힐 때는 무엇이 대신 위계를 지는지(순서·크기·구분선) 명시.
- **인터랙션의 반응형**: hover 시그니처는 터치에서 어떻게 발동하는가
  (tap/focus-within/항상 노출) — 시그니처 보존은 포인터 종류를
  가로질러야 한다.
- **검증 폭은 render-qa 와 정합**: 375 / **768** / 1440 — 태블릿을
  건너뛴 검증은 검증이 아니다.

### 6. Motion porting — 모션 이식의 3정석 (v3.5)

> **동인 (F35).** 갤러리 컴포넌트는 React+motion 전제라, 등장 연출이
> `initial={{opacity:0,…}}` — **콘텐츠 기본 숨김** — 로 구현돼 있다.
> 실전 3호에서만 후보 4개가 이 패턴이었고(코퍼스 text-effect 계열의
> 등장 연출 행 전부 + faq·testimonials 일부), 대부분 `useReducedMotion`
> 은 존중하지만 **no-JS 는 안 지켜진다 — 두 문제는 다르다.**
> reduced-motion 폴백이 있다고 은닉 금지를 통과한 것이 아니다.
> 코퍼스는 이런 행에 `slop_flags: [initial-hidden]` (WARN)을 단다 —
> 처방 가능하되, 이식 시 아래 3정석 중 하나를 **명시 선택**해야 한다.

바닐라 이식 시 등장 연출의 합법 경로는 셋뿐이다 (즉석 발명 금지):

1. **`.js` 스코프 가두기** — 숨김 규칙을 `html.js` (스크립트가 부여)
   아래에만 두어, 스크립트 미실행 시 콘텐츠가 처음부터 보이게 한다.
   `prefers-reduced-motion: reduce` 에서도 즉시 표시. (실전 3호 BEAT 8
   실증 — `html` 클래스를 비운 상태에서 5줄 전문 opacity 1 실측.)
2. **연출 제거** — 순차 타이핑·스태거가 비트의 논증에 기여하지 않으면
   버린다. 콘텐츠가 처음부터 전문 렌더된다. (실전 3호 BEAT 6 터미널 —
   프롬프트 3판은 순차 공개가 아니라 병치 비교가 논점이었다.)
3. **`@starting-style` 전환** — CSS-only 등장(`@starting-style` +
   `transition`)으로 재작성. 스크립트 없이도 최종 상태가 기본값이다.

**검증**: 스크립트 차단 상태(`html` 클래스 제거)에서 해당 콘텐츠의
computed opacity/visibility 실측 — Step 7 "진입 애니메이션 은닉 금지"
auto-fail 과 [[render-qa]] RQ3 의 no-JS 항목이 짝이다.

## 클래스 네임스페이스 (v3.5 — F40)

한 페이지에는 **N 개 서로 다른 부모**의 STUB 마크업이 모인다. 짧은
일반명(`.q` `.card` `.item` `.panel` `.dot`)은 **충돌 전제**로 취급한다:

- STUB 의 클래스는 비트 또는 컴포넌트 타입으로 접두한다
  (`.stepq` / `.b13-q` / `.cmp-col`).
- 실측 (실전 3호): tailark 인용 카드의 `.q{display:grid}` 와 smoothui
  스텝퍼 질문의 `.q` 가 충돌 — 질문 문단의 인라인 자식들이 각각 그리드
  행이 되어 한 줄 문장이 3행으로 쪼개졌다. **Step 7·RQ1·RQ2 전부
  통과했고 RQ3 육안에서만 잡혔다** — 대비·사다리·폭이 전부 정상인
  구조 결함이라 정적 검사의 사각지대다.
- 값싼 보조 검사: 같은 클래스명이 서로 다른 `data-gallery` 조상 아래에서
  스타일 규칙을 공유하면 의심하라.

## After recomposition

Re-run the slop sweep (a clean component can acquire a ban during
recomposition — e.g. a side-stripe added as a "label rail"). Then ask:
**"이 블록이 어느 갤러리 컴포넌트에서 왔는지 화면만 보고 알아볼 수
있는가?"** 알아볼 수 없으면 그 beat 의 recomposition 은 실패다.

## Consumption accounting — 세탁 금지

A component counts toward the density floor (≥6 signatures / ≥10 form
factors / ≥3 interaction layers) ONLY when:

1. Its **`preserve_signature` is observable at render** — DOM structure
   or interaction behavior. Lineage comments ("← I3 골조 차용") = 0.
2. The element carries **`data-gallery="{source}:{name}"`** and
   **`data-component="{canonical_type}"`** — the machine-audit anchor.
   Self-reported counts are not evidence.
3. A react-sourced entry (deck or no-build context) **reproduces the
   signature in vanilla CSS/JS** (odometer roll, hover panel, drag
   handle, fold — all vanilla-reproducible). "근사했다"며 정적 박스로
   강등 = 0 계상.
4. Entries whose signature *is* a house hard-ban (glow, aura, infinite
   loop, gradient) are the unusable pool — `ats_verdict: cut` (already
   `usable: false` in the corpus) or `conditional` with its condition
   unmet. Don't lift the ban; pick another entry. The ban-free pool is
   large enough — that is what the corpus is for.

## Anti-patterns

- ❌ Paste-in with a palette swap ("customized" = one hex changed)
- ❌ Respecting gallery proportions against the assigned tier
- ❌ Hybrid of 3+ parents (unauditable Frankenstein)
- ❌ Teardown keeping skin, dropping structure (decoration harvesting)
- ❌ Recomposing the *message* to fit a beloved component
- ❌ Writing a STUB from memory when `code_path` is right there
