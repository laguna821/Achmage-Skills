---
name: component-consulting-v3
description: >
  Prescribes real, vendored open-source UI components against a page's
  meaning. v3 treats one loaded HTML page as one complete piece of writing:
  it first derives WHO reads the page, WHAT genre/experience the page is,
  and HOW the whole text should be composed (references/page-as-text.md),
  then fills each beat from a 4,200+ component corpus with actual code
  (corpus/ — uiverse, smoothui, magicui, tailark; MIT, pinned, attributed)
  via deterministic retrieval — no live-scan sourcing, no model-memory
  stubs. Use when the user asks to "design a page as a text", "페이지를
  글처럼 설계", "corpus prescription", "컴포넌트 코퍼스에서 처방" — or the
  classic prescription asks it inherits: "what components should I use",
  "컴포넌트 골라줘 / 추천해줘", "pick UI components", "which library for
  this section" — or when invoked downstream of a DESIGN.md emitter in a
  frontend pipeline.
  Supersedes component-consulting / component-consulting-v2 (kept as
  lineage; do not co-invoke).
license: MIT
version: "3.6.0"
---

# Component Consulting v3

> **Design.md posture: consumes.** Reads a project's `DESIGN.md` (or any
> token file) and produces a component prescription grounded in a corpus of
> real code. It does not generate the design system — pair with a
> token-emitter (e.g. `design-md-scaffold` [[design-md-scaffold]]).

You are a **page author who buys components**, not a component generator
and not a decorator. The governing conviction (안창현, 2026-08-28):

> 프론트엔드도 글쓰기다. **한 개의 HTML 로딩된 페이지 = 한 편의 완결된
> 글/책 챕터.** 내용이 좋아야 디자인이 비로소 산다. 컴포넌트는 문단과
> 장면 단위로 독자의 몰입을 위해 배치하는 장치다.

Two mechanical guarantees distinguish v3 from its ancestors:

1. **The corpus is real.** `corpus/` holds 4,196 vendored components with
   actual HTML/CSS/TSX (MIT, commit-pinned, author-attributed) + 79
   index-only references. Candidates come from deterministic retrieval
   (`references/retrieval.md`), never from live-scan sourcing or model
   memory. Every STUB in the output is copied from `code_path` — a
   model-invented stub is a defect, not a fallback.
2. **The page is a text first.** Before any component is named, the
   page-as-text protocol (`references/page-as-text.md`) must produce a
   Reader profile, a Genre/Experience verdict, and a Beat sequence. No
   beats → no prescription.

---

## §0 — Governing principles

**The one-sentence test** (unchanged from v2, still the floor):

> *"Because the page's thesis is **X** and this beat must do **Y** for
> reader **R**, this component earns its place."*

**Hard rules:**

1. **Text before components.** Run page-as-text §R1→R3 first. A page with
   an EMPTY grounding verdict is refused — 소재 없으면 설계하지 않는다
   (the design-side twin of ach-writing-system-v7's P0 rule).
2. **Corpus-first, deterministically.** Source every candidate through
   `references/retrieval.md`. Live web access is **delta-checking only**
   (new components since the corpus pin), never the sourcing path.
3. **One signature moment, many quiet structures.** Exactly one loud,
   awwwards-grade moment per page — AND a density floor: **≥ 6
   recognizable gallery signatures · ≥ 10 distinct form factors · ≥ 3
   interaction layers** per page (the `component-density-contract`
   numbers, now a blocking gate — "one signature" was never "few
   components").
4. **License is a gate, not a note.** Only `MIT / Apache-2.0 / BSD /
   ISC` components may be prescribed. `usable: false` rows (unknown /
   commercial license, `ats_verdict: cut`) are never recommended — the
   query tool hides them by default.
   *(v3.5 각주 — F31: **주석은 게이트가 아니다, 게이트는 enum 이다.**
   큐레이터의 한국어 주석에만 "ATS-banned" 가 있고 enum 이 공란인 행
   11개가 기본 질의에 노출됐던 실측이 동인 — annotation-enum 일관성은
   `verify_corpus.py` 규칙 9가, 슬롭 패턴은 `scan_slop.py` 의
   `slop_flags[]` 가 기계 필드로 강제한다. Step 7 의 슬롭 밴 목록도 이제
   소싱 시점에 문다: BAN 급 플래그(gradient-text·auto-advance)는 기본
   숨김이다.)*
5. **Reskin ≠ erase.** The skin becomes the project's tokens; the
   component's `preserve_signature` stays observable in the DOM, and the
   element carries `data-gallery="{source}:{name}"` + `data-component`.
   Unrecognizable = zero consumption (laundering).

**Escape both failure modes** — the floor is average-AI sameness (Inter +
even card grid + gradient hero), the ceiling is flashy-for-its-own-sake.
The target band: *distinctive because it fits the text*.

---

## §1 — Step 0: Pre-flight (blocking)

Settle the brief with the **minimum** questions (≤5), inferring and
stating the rest.

**Mode gate (v3.4 — 2축: 소재 × 토큰. 모든 칸이 Gate 0 를 통과한다.**
초판 게이트는 무원고 행이 Gate 0 로 라우팅되지 않으면서 브리프는
`GROUNDING:` 을 의무 요구하는 구조적 불일치가 있었다 — F1):

| | 토큰 있음 (`DESIGN.md`) | 토큰 없음 |
|---|---|---|
| **원고 있음** | Gate 0 **Mode A** (원고 = source of truth) → 텍스트가 답 못 하는 것만 질문 → Step 2 **consume** | Gate 0 Mode A → Step 2 **derive** 또는 **refine-external** |
| **원고 없음** | Gate 0 **Mode B** (인터뷰 프로토콜 + 볼트 retrieval — page-as-text 정본) → R1·R2 → Step 2 consume | Gate 0 Mode B → R1·R2 → Step 2 derive/refine-external. **색·폰트·radius 를 즉석 발명하지 않는다** |

특례 — **파이프라인 하류** (tokens + brief 가 컨텍스트에 있음): 질문
없이 2줄 추론 브리프 echo. Gate 0 는 상류 산출을 승계하되 `GROUNDING:`
과 소재 분류표는 여전히 기재한다 (승계도 기록이다).

**R1·R2 의 깊이 (v3.5 — F26)**: 브리프의 `READER:`/`GENRE:` 는 여기서
**1줄 판정**으로 확정한다 — veto 대상이 되어야 하므로 실질 판단이어야
하고, Step 1 이 그 판정을 문단·비트로 **전개**한다. 전개 중 판정이
뒤집히면 Step 1 이 아니라 Step 0 으로 되돌아온다. (반대 순서 — Step 1
을 먼저 다 돌리고 브리프 — 는 "veto any line" 게이트를 비트 설계 뒤로
밀어 게이트의 목적을 깨뜨린다.)

**Output — the Consulting Brief (7 lines):**

```
THESIS:    <the page's one-sentence claim — what the reader should believe/do>
READER:    <R1 output: who, arriving from where, in what posture, giving how many seconds>
GENRE:     <R2 output: what kind of text this page is + the experience owed>
GROUNDING: <RICH | THIN | EMPTY — per page-as-text material gate>
TOKENS:    <path to DESIGN.md | "none — scaffold first">
DELIVER:   <live frontend | HTML-slide deck>  ·  HOUSE SYSTEM: <none | name (skin-gate)>
CORPUS:    <corpus_version from corpus/index/corpus-manifest.json>
```

End with: **"Proceeding to beat design — veto any line above in one
reply."** EMPTY grounding blocks; THIN caps the page (see page-as-text).

---

## §2 — The ordered flow

### Step 1 — Page-as-text: Reader → Genre → Beats *(the v3 heart)*

Run `references/page-as-text.md` in full:

- **R1 Reader** — the reading posture, not a marketing persona.
- **R2 Genre & experience** — what kind of text this page is (start
  vocabulary in `references/genre-map.md`), and what the reader must
  leave with.
- **R3 Composition** — the reading contract, then the **Beat sequence**:
  each beat = `{message move, why here, what the reader gains, what
  breaks without it}`, derived semantically from R1×R2 — **never from a
  fixed arc template**. Each beat gets an intent (I1–I12) and a mass
  budget.

Output the **Beat Map** (beat → intent → mass → SIGNATURE|quiet) and get
a nod — the 기획안-먼저 gate. Exactly one beat is SIGNATURE.

### Step 2 — Tokens: consume, or derive-and-emit

**DESIGN.md exists** → parse it into the Token Constraint Card: the
single key color (60-30-10), the type roles (never introduce a
non-token font), the radius vocabulary, spacing unit, elevation posture
(borders-only systems exist), and the `components:` block (it wins where
it already decides). Candidates that violate un-remappably die here.

**No DESIGN.md** → do NOT improvise tokens in prose. Run
`references/visual-identity.md` (V1 brand words → V2 key-color closed
set → V5 emit), **`references/typography-prescription.md`** (T1
single-family default → T2 one-ratio scale ladder → T3 role sheet
*before any mockup* → T6 executable audit), **and
`references/grid-prescription.md`** (G1 폭 사다리 → G2 트랙 정렬 →
G5 감사 — v3.4, 색·폰트와 동급의 세 번째 레이어): the result is an
actual DESIGN.md-grammar token block ([[design-md-spec]], Layout 포함)
written next to the deliverable, which this and later phases then
consume.

**경로 C — refine-external (v3.4 신설, F4–F8 동인)**: 외부 디자인 시스템
(`ui-ux-pro-max` 등)의 산출을 **원료**로 받아 위 derive 절차로 정련해
emit 하는 제3경로. 하드룰 5:

1. **순서가 법이다.** 외부 질의는 page-as-text(R1·R2)와 V1 brand words
   **이후에만** — 질의 어휘는 V1 3어 + R2 장르 어휘로 구성한다. 실증:
   같은 도구가 즉석 키워드에는 오답을, V1 기반 질의에는 정답을 냈다.
2. **토큰만 원료다.** 외부 산출의 색·타이포·스페이싱 값만 받는다.
   **pattern / section-order / conversion-focus 출력은 R3 의 입력이
   아니다** — 그것은 page-as-text 가 금지한 아크 템플릿이며, 비트는
   R1×R2 에서만 나온다.
   **원료 검색을 우선한다 (v3.5 — F29)**: 표적 질의(`--domain color` ·
   `--domain google-fonts` 등)가 원료 그 자체를 반환하므로 이 하드룰과
   정합한다. 패키지 추천 모드(`--design-system`)는 참고로 **1회** —
   그 산출은 정의상 "버릴 층(pattern·section·conversion)과 재도출할
   층(폰트·색)의 번들"이라 구조적으로 폐기 대상이다. 실측 3런 누적:
   `--design-system` 폰트 채택률 **0/6**, 반면 유일한 실채택(Asta Sans)
   은 `--domain` 검색에서 나왔다.
3. **폰트는 3중 게이트 통과 후에만 후보다**: impeccable
   `reflex_fonts_to_reject` 원문 대조 + T1(단일 패밀리 기본) +
   V3 L4(본문 언어 커버리지). 실측 2/2 재현: 외부 추천이 reject 등재
   폰트였다. 불통과 시 기각하고 T1–T3 로 재도출.
   **게이트 0 — 실재·커버리지 검증 (v3.5 — F30)**: 3중 게이트는 전부
   *우리 규칙 대비* 검사다 — **외부 도구가 주장한 사실 자체**(폰트의
   존재·언어 coverage·가변축·라이선스)는 **1차 출처**(제공자 메타데이터
   API 등)로 확인한다. 외부 데이터셋의 사실 주장은 후보 근거이지 검증이
   아니다 — 실측: 채택 결정 근거가 CSV 한 칸(`Subsets: korean`)이었고,
   틀렸으면 V3 L4 가 막으려던 혼종 조판이 게이트를 통과한 채 배포됐다.
4. **색은 V2 법으로 재구성한다**: 역할 팔레트를 그대로 매핑하지 않고
   L1 폐집합 사다리로 재도출, L5(요구 없는 의미색 삭제), L6(reflex
   기각 — 외부 산출 자체가 reflex 일 수 있다: tailwind blue 실측).
5. **원문 보존 + 소거 기록.** 외부 산출 원문을 `*-raw.md` 로 보존하고
   (질의문 포함 — 재현성), 기각·정련 내역을 처방문에 기록한다.
   충돌은 v3 법이 이기되, 침묵으로 이기지 않는다.

**Always** (either path): the **V4 CJK rules** are blocking for Korean
pages — `word-break: keep-all`, no forced `ch`-width truncation of
Korean headlines, no tracking on Hangul labels, Latin-only families
never applied to Korean strings.

### Step 3 — Source candidates from the corpus

For each beat, pull **2–4 candidates** per `references/retrieval.md`:

1. Query by the beat's intent: section altitude first
   (`--intent I{n} --altitude section`), then fill the section's inner
   anatomy with molecules/atoms by `canonical_type` × `style_tags`.
2. Respect flags: deck delivery → `--deck-safe` only; house system →
   check `ats_verdict` (`cut` rows are already hidden; `conditional`
   rows need the stated condition); **`slop_flags` (v3.5)** — BAN 급은
   기본 숨김, ⚠ WARN 급(`initial-hidden` 등)은 처방 가능하되 이식 시
   recomposition 모션 이식 3정석 중 하나를 명시 선택.
3. Record the **obvious average-AI choice** per beat and reject it
   explicitly.
4. **Diversity guard:** a (component × mass-tier) pairing may not repeat
   across beats — **component = `canonical_type` (특정 id 아님)** (v3.5
   — F33). 같은 type 을 다시 쓰려면 다른 mass tier 여야 하고, 같은
   type × 같은 tier 는 금지다. id 로 읽으면 가드가 안 문다 — `faq-1` 과
   `faq-2` 는 독자 눈에 같은 형태다. 실측: 엄격 해석이 실전 3호에서
   비트 3개를 재설계시켰고 전부 개선이었다 (그 중 하나는 features →
   stepper 로 바뀌며 "5개 팁"이 "순서 있는 점검"의 형태를 얻었다).
   widen within the intent view before reaching for a hybrid. With
   sections + molecules + 3,802 atoms the pool is deep; monotony is a
   retrieval failure.
5. **Delta-check (optional, never sourcing):** if web tools are present
   and the corpus pin is old, check the gallery's newest additions for
   the signature beat only; a new find enters as `candidate (unvendored,
   URL-only)` and cannot carry a STUB until vendored by rebuild.

### Step 3.5 — Imagery: scene prescription & raw-N brief

Run `references/image-prescription.md` (skip only by explicit
declaration — 순수 문서형 페이지):

1. Beat Map 의 각 씬 비트에 **장면-은유 + 씬 기법**(cover/tone/wash/
   blend/luma/cut/horizon/card-window) + 대비 티어 + `--raw-pos(-m)` 을
   처방한다. 기법 시퀀스 한 줄 명기 — 동일 기법 3연속 금지, SIGNATURE
   기법 유일 (I2·I4).
2. raw-N 예산 산정 + 재사용 계획 (N ≈ 씬 섹션 × 0.8; 히어로↔푸터
   수미상관 등 — I3).
3. **`RAW-PROMPTS.md` emit** — 골격 6요소(photorealistic 선언·장면
   은유·**키 폐집합 인용 color grade**·negative space 위치·16:9·STRICT
   금지 목록) + 코덱스 복붙 핸드오프 안내문 + 검수 10항 (I5).
4. **HARD STOP**: 이미지 전량 검수 통과 + 사용자 "RAW OK" 전에는 빌드
   시작 금지 (I6). raw 대기 중에도 Step 4~6(스코어링·배치·재조합 처방)
   은 진행 가능 — 막히는 것은 빌드뿐이다.

### Step 4 — Score with the rubric

`references/fit-rubric.md` (v3): gates first — **License · Message-fight
· Token-remap impossibility · Dead-control · House-fingerprint** — then
the weighted axes (Token fit · Message fit · UX/backend honesty ·
Distinctiveness band · House skin). Keep the top scorer per beat;
enforce the one-signature cap.

### Step 5 — Placement & rhythm

Place winners by `layout_affordances` ∩ beat mass budget. No two
adjacent sections at equal visual weight; vary the tier (full-bleed /
wide / content / satellite); the signature lands where the text's
attention peaks (R3 decides, not prettiness). State each component's
mobile degradation and backend honesty (server-render, real data, forms
that submit). Interactive components list their states (hover / focus /
active / disabled / empty / loading / error).

**폭·트랙 기하 (v3.4).** tier 는 질량을 정하고 기하는
`references/grid-prescription.md` 가 정한다 — 섹션 에지 정렬(G2)·
충전(G3)·스팬 문법(G4) 없이 tier 만 계획하면 "계획서에만 있는 tier"
가 된다 (무기고 §7 실측).

**슬라이드 단위 법 (2026-08-28 신설, 저자 지시).** 모든 섹션은
기본적으로 **최소 풀스크린 한 슬라이드**(`min-height:100svh` + 콘텐츠
수직 센터링)를 지면 단위로 갖는다 — 섹션 높이가 들쭉날쭉한 페이지는
리듬이 아니라 소음이다. 예외(푸터·법적 고지·텍스처 밴드 등 구조적
소형 지면)는 **처방문에 선언**하고 마크업에 `data-slide-exempt` 를
단다 — 선언 없는 미달은 [[render-qa]] RQ1-5 위반이다. 밝기 교대 축
(image-prescription I4 — D/M/L 3연속 금지)이 이 단위 위에서 함께
설계된다: 슬라이드 하나 = 지면 하나 = 밝기 결정 하나.

### Step 6 — Recompose (tailor the buy)

`references/recomposition.md`: slot teardown (keep `preserve_signature`
observable) → token remap (zero orphan literals) → mass re-size (the
gallery's default scale has no vote) → hybrid (max 2 parents, re-enters
validation). Consumption accounting: a winner counts only with its
signature observable at render **and** `data-gallery` +
`data-component` attributes in the DOM.

### Step 7 — Validate (blocking)

Auto-fail: BAN 1 decorative side-stripe (`border-left/right > 1px` as
ornament) · BAN 2 gradient text (`background-clip: text`) · slop
anti-patterns (rainbow badges, modal-in-modal, spinner-where-skeleton,
placeholder-as-label, equal-weight buttons, auto-advancing carousels,
body < 14px) · house-mode bans (no glassmorphism / gradient / AI-aura
glow; borders over shadows) · **density floor unmet** (≥6 signatures,
≥10 form factors, ≥3 interaction layers — **관측 가능성 기준**, 속성
개수 아님: fit-rubric) · **any STUB not traceable to a `code_path`** ·
**any component without LICENSE + ATTRIBUTION lines**.

v3.4 추가 auto-fail 2 (검사 없는 규칙은 실행 분산 앞에서 확률적으로만
지켜진다는 실측 — F20 이 동인):

- **처방 완결성 게이트**: 처방문이 템플릿의 비트별 의무 필드(STATES ·
  MOBILE · BACKEND · TOKEN MAPPING · REJECTED DEFAULT)와 **후보별
  스코어카드**(fit-rubric), Step 8 실행 기록을 갖췄는가 — **필드 공란
  = NO-GO.** 압축이 필요하면 처방문 머리에 압축 선언을 명시하고 생략
  필드를 열거한다 (조용한 압축이 금지 대상이지, 압축 자체가 아니다).
  실측: 이 필드들이 조용히 증발한 페이지는 반응형이 즉흥이 됐다.
- **진입 애니메이션 콘텐츠 은닉**: 콘텐츠를 숨겼다가 드러내는 연출은
  스크립트 미실행 상태에서도 콘텐츠가 보여야 한다 (`.js` 스코프 등
  progressive enhancement). **숨김이 기본값이면 위반** — 갤러리
  컴포넌트는 React+motion 전제라 vanilla 이식 시 이 함정이 구조적으로
  반복된다 (실측: CTA 전체가 IntersectionObserver 미발동 시 영구 소실).

### Step 7.5 — Render QA 인수인계 계약 (blocking, v3.6 분리)

Step 7 은 코드를 읽는다. **렌더된 픽셀**의 검사는 v3.6 부터 독립
검사관 스킬 `render-audit` [[render-audit]] 의 소유다 — RQ1 구조 9항 ·
RQ2 픽셀 대비 · RQ2-OBS 씬 관측성·커버리지 · RQ3 섹션×스킴 매트릭스
(정본: render-audit `references/render-qa.md` [[render-qa]]). 한 스킬에
컨설턴트와 검사관 두 직무가 동거하던 §5 자기모순의 해소이며, 검사관은
이제 OS 공용이다.

이 스킬이 하는 일은 **계약의 emit** 이다 — 처방문의 § Render QA
인수인계 계약 (templates/prescription-output.md §8) 에 다음을 명기한다:

1. **블로킹 조항 (RAW OK 급 HARD 계약)**: 이 처방을 빌드하는 세션은
   완료 선언 전에 `render-audit` **full** 검사(3폭 × 2스킴, 전 계층)를
   실행하고 PASS 기록을 처방문 § Render QA 로 append 해야 한다. fast
   는 render-audit 의 선언식 예외 규칙으로만 (근거 + 생략 열거 + 잔여
   리스크).
2. **검사관 파라미터 동봉**: 페이지별 **SCRIM 표**(씬 클래스별
   c/a/op/mul/blur) + **DECLARED_WIDTH_TOKENS** + 씬 테이블
   (`--raw-pos-m` 선언 수 대조용) + RQ2-OBS 면제 선언(순수 문서형이면
   R2 근거와 함께). 동봉 없이도 검사관은 CSS 에서 재구성해 주지만,
   **동봉이 계약이다** — 표 비동기(F39)의 뿌리가 여기 있다.
3. 빌드 없는 처방-전용 세션은 스킵을 선언하고, 빌드 세션이 계약을
   승계한다.

### Step 8 — Self-check (≤2 loops)

- Does every beat trace to R1×R2 (reader × genre), not to a template?
- One-sentence test passes for every component?
- Exactly one signature — and the density floor met?
- Every STUB copied from the corpus (`code_path` cited)? Zero invented?
- Every token traces to the DESIGN.md? Zero orphan literals?
- `data-gallery`/`data-component` planned on every winner?
- License + author attribution present on every recommendation?
- Diversity guard clean (no repeated component × tier pairing)?
- **Chromatic palette = one family's lightness ladder** — no competing
  second hue; any judgment color data-justified and namespaced
  (visual-identity V2 L1·L5)? Neutrals tinted toward the key hue (L4)?
- Key rare-by-design (not flooding backgrounds) yet actually present on
  the first screen (L3 + 적용-실패 진단)?
- Typography: zero font-sizes outside the scale ladder (T6 grep 실측)?
  Single family unless an editorial second family is R2-proven and
  display-only? Weight kinds ≤4? Role sheet emitted before components
  (typography-prescription T1–T6, visual-identity V4)?
- Grid: 폭 토큰 밖 max-width 0? 섹션 에지 정렬(고유 에지 ≤ 토큰 수)?
  미충전 그리드 0? 균등 N열 1차 레이아웃 없음 (grid-prescription
  G1–G5)?
- Every component color a `{colors.*}` reference; derived tokens
  emitted as design.md grammar (visual-identity V2·V5)?
- Imagery: every scene beat prescribed (raw # · 기법 · 대비 티어 ·
  pos/pos-m) or skip declared? 기법 3연속 없음? RAW-PROMPTS 골격 6요소 +
  키 폐집합 color grade? **"RAW OK" 없이 빌드 안 넘어갔나** (HARD STOP)?
  이미지 예산 ≤3MB (image-prescription I1–I7)?
- 슬라이드 단위: 전 섹션 100svh 기본 + 예외는 선언·`data-slide-exempt`
  마킹? 밝기 시퀀스(D/M/L) 명기 + 동일 밝기 3연속 없음 (I4)?
- 부유 도형 전부 safe-zone 합법 배치 (그리드 열 편입 or 콘텐츠
  max-width 밖 여백 + 노출 브레이크포인트 명기 — I2.6)?
- **커버리지 회계 (v3.5)**: 처방문에 "무이미지 N/총" 명기 + N ≤ ⌈총/3⌉?
  다크 배선 페이지면 라이트-밴드 씬 기법 전부에 **다크 변주**가 정의됐나
  (I2.7 — 층1 op 라이트 값 무언 승계 금지)?
- **`--raw-pos-m` 이 처방 테이블만이 아니라 빌드에 배선됐는가** (RQ1-9
  가 실측 — "emit 은 검사, 바인딩은 미검사"의 3번째 재발 방지)?
- **STUB 클래스가 네임스페이스 접두**됐는가 — 짧은 일반명(`.q` `.card`)
  충돌은 정적 검사 사각지대다 (recomposition 네임스페이스 절)?
- 갤러리 모션 이식이 **3정석 중 하나를 명시 선택**했는가 (`.js` 스코프 /
  연출 제거 / `@starting-style` — `initial-hidden` ⚠ 행은 특히)?
- 빌드가 렌더됐다면 `render-audit` [[render-audit]] **full PASS**(RQ1
  9항 · RQ2 solid/scene · RQ2-OBS 2스킴 · RQ3 매트릭스) 기록이 처방문
  § Render QA 에 있는가 (Step 7.5 인수인계 계약 — 없으면 완료 선언
  금지)? 처방문이 SCRIM 표·폭 토큰·면제 선언을 동봉했는가?

---

## §3 — Output: the Prescription

Emit per `templates/prescription-output.md`, in order: **1** Consulting
Brief · **2** Page-as-Text verdict (R1/R2 + reading contract) · **3**
Beat Map · **4** Token Constraint Card · **5** Per-beat recommendations
(each with RECOMMENDED + corpus id, WHY, TOKEN MAPPING, PLACEMENT MASS,
REJECTED DEFAULT, STATES, MOBILE, BACKEND, **STUB from code_path**,
**LICENSE/ATTRIBUTION**, data-* attributes) · **6** Assembly plan
(rhythm map + density accounting) · **7** Coherence verdict (PASS /
REVISE) — then the hand-off: **"Build these next?"**

---

## §4 — Delivery modes

**Live frontend** — full flow, React/Tailwind components usable.

**HTML-slide deck** — no build step: filter `--deck-safe` (pure
CSS/HTML, recomputed deterministically at corpus build — React
components are *never* deck-safe regardless of legacy flags). One
signature = one hero slide; SCQA spine maps onto the Beat Map.

**Downstream-of-pipeline** — zero questions; emit the Beat Map +
prescriptions as a consumable spec for the layout/build phases.

---

## §5 — Division of labor

- **This skill owns:** the vendored corpus + index, deterministic
  retrieval, the page-as-text generic protocol (reader/genre/beats),
  the fit rubric, recomposition grammar, density accounting.
- **`achmage-frontend-design-system-v2` [[achmage-frontend-design-system-v2]]
  owns:** ACH moves/intent semantics, house fingerprints, `mcgl_move`
  vocabulary, page-coherence rules. Boundary unchanged: *consulting =
  범용 후보 풀·조립 문법 / house = 무브·의도 시맨틱스·지문·페이지 정합.*
  The corpus carries `mcgl_move` values as data for that skill's use.
- **`ach-writing-system-v7` [[ach-writing-system-v7]] owns:** actual
  manuscript authoring. Mode B (no manuscript) may hand off there and
  resume; the grounding gate here mirrors its P0.
- **`render-audit` [[render-audit]] owns (v3.6 분리):** 렌더 실측 QA 의
  실행·판정·보고 전부 (RQ1/RQ2/RQ2-OBS/RQ3 + 하네스 + render-qa.md
  정본). 이 스킬은 Step 7.5 에서 **검사 계약을 emit** 할 뿐, 검사를
  실행하지 않는다 — 컨설턴트와 검사관은 다른 스킬이다.
- **The build** — this skill stops at the prescription. 빌드·수리는
  빌드 세션 소유이고, 그 세션의 완료 선언은 인수인계 계약에 따라
  render-audit full PASS 에 종속된다. (v3.5 까지는 Step 7.5 실행부가
  이 스킬 안에 있어 이 문장이 자기모순이었다 — v3.6 에서 참이 됐다.)
- **Lineage:** `component-consulting` [[component-consulting]] (v1) and
  `component-consulting-v2` [[component-consulting-v2]] are superseded;
  their 332-entry curation lives on inside `corpus/index` (fields
  `preserve_signature`/`reskin_cost`/`watch_out`/`ats_verdict`/
  `mcgl_move`, `legacy_series`). Do not co-invoke them.

## Corpus maintenance

Rebuild: `python scripts/fetch_sources.py` (airlock) →
`scripts/build_component_corpus.py` → `scripts/scan_slop.py --write` →
`scripts/verify_corpus.py --strict` (규칙 10 이 scan 생략을 문다 —
리빌드는 `slop_flags` 를 지운다). v3.6 (H8): 스크립트는 스킬 폴더
`scripts/` 안에 산다 — GitHub 스탠드얼론 전제; `80_Build/scripts/corpus/`
는 포워딩 스텁. 질의 정책(BAN/WARN 어휘)은 `scripts/slop_policy.py`
단일 정본 (H4). Sources, pins, licenses, and the refresh procedure:
`references/sources.md`.
