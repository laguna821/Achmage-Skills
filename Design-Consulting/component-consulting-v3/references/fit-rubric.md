# Fit Rubric v3

How `component-consulting-v3` scores a candidate for a beat. **Gates
first, then weighted score, then a page-level pass.** Score each axis
**0–4**. Inherits the v2 machine; v3 adds the License gate, the density
floor, and corpus-traceability.

> **The relational truth:** the *same* component scores differently on
> different pages. A dynamic-island pill is a **0** on an editorial
> research portal and a **4** on a consumer SaaS activity ticker. Fit is
> never a property of the component alone — it is the component **× the
> beat's move × the reader × the tokens**.

---

## Gate 0 — Corpus & License (v3, before any scoring)

- **License:** only `MIT / Apache-2.0 / BSD-2/3 / ISC` may be
  prescribed. The corpus enforces this as `usable: false` on unknown /
  commercial rows — an unusable row cited as a recommendation is an
  automatic REJECT of the whole prescription section, not just the row.
- **ats_verdict** (house mode): `cut` rows are out of the pool
  (negative knowledge only). `conditional` rows require their stated
  condition to be quoted and satisfied in the prescription.
- **Traceability:** a candidate must have a corpus `id`. Unvendored
  delta-check finds are marked `URL-only` and cannot carry a STUB.

## The five axes

### Axis A — Token Fit *(weighted 0.35)*

Remap distance across **color roles, type scale, radius, elevation,
spacing** — read the corpus row's `reskin_cost` first (the curators
often pre-counted it):

| Overrides needed | Score |
|---|---|
| 0–1 dimensions | **4** — drop-in, pure `{token}` substitution |
| 2 | **3** — the "buy + customize lightly" sweet spot |
| 3 | **2** — heavy reskin |
| 4 | **1** — basically rebuilding |
| 5, or a baked-in un-tokenizable property (font in SVG, color in canvas) | **0 — reject for cost** |

**Ceiling rule:** A = 4 only when the restyle is expressible as a
DESIGN.md `components:` entry with **zero orphan literals**.

### Axis B — Message / Beat Fit *(GATE)*

Name the component's rhetorical character in 3–5 words; name the
**beat's move** (from the Beat Map) in 3–5 words; score the angle:

**4** reinforces · **3** compatible · **2** tension (−0.5 tax) ·
**1** fights · **0** undermines.

**GATE: B ≤ 1 → auto-reject, even at Token Fit 4.** The v3 nuance: B is
scored against the *beat*, and the beat traces to R1×R2 — so a
component can only be message-fit if the beat itself survived the
`breaks` test. Decorating a decorative beat is double-zero.

### Axis C — UX-Naturalness + Backend Honesty *(weighted 0.30)*

`C = min(C1, C2)` — a component cannot be more usable than it is honest.

- **C1 flow-fit:** reading order, cognitive load at this point of the
  *simulated read* (R3), density rhythm vs neighbors, affordance
  clarity. Score against the **planned mass tier**, not the gallery
  default; a candidate that only works at a mass the plan can't give
  scores C1 ≤ 1.
- **C2 backend honesty:** **4** wired state · **3** honestly static ·
  **2** harmless decoration · **1** fake controls · **0** dead control
  on a critical-path beat → reject.

### Axis D — Distinctiveness Band *(weighted 0.35)*

```
bland (1) ── safe (2) ── DISTINCTIVE (4) ── awwwards (4) ── gratuitous (1)
                          └────── sweet spot ──────┘
```

Average-AI penalties (−1 each, floor 1): Inter/Roboto as display face ·
even N-column card grid as primary layout · purple→blue gradient /
AI-aura glow · three equal icon-top cards · gratuitous glassmorphism ·
uniform radius + ambient shadow everywhere · generic SaaS hero with
angled dashboard mockup.

**Hard bans → D = 0:** BAN 1 decorative side-stripe
(`border-left/right` > 1px as ornament) · BAN 2 gradient text
(`background-clip: text`).

**One-signature rule:** at most one component in the awwwards band per
page; two shouting → CONFLICT (user chooses); four loud → page capped
at D = 2 gestalt.

### Axis E — House-System Override *(GATE + skin mandate; house mode only)*

Unchanged from v2's correction — **house is a gate and a skin, not an
autocrat**:

1. **Fingerprint gate** — reject any candidate (gallery or house) that
   cannot reskin to the house fingerprints.
2. **Structure competes on merit** — house patterns are ordinary
   candidates; adopting a gallery structure and recomposing it into the
   house skin is the default path.
3. **House-unique bonus** (+0.5) only when the house pattern uniquely
   carries the move.
4. **Starvation check** — every beat resolving to a house pattern is a
   sourcing failure; re-open the corpus for the quiet beats.

---

## Aggregation

**Step 1 — Gates (any → REJECT):** License/usable fail · B ≤ 1 · Axis E
fingerprint fail · A == 0 · D == 0 · C2 == 0.

**Step 2 — Weighted score:**

```
FitScore = 0.35·A + 0.30·C + 0.35·D
           − 0.5 if B == 2 (tension tax)
           + 0.5 house-unique bonus (Axis E.3)
```

**Step 3 — Verdict:** ≥ 3.2 **and** B ≥ 3 → **RECOMMEND** · 2.2–3.2 →
**CUSTOMIZE** · < 2.2 → **REJECT**.

**Step 4 — Page-level pass** (after per-beat winners):

- ≤ 1 awwwards-band beat; demote extras to quiet runners-up.
- **Density floor (v3, blocking):** count across the whole page —
  recognizable gallery signatures **≥ 6**, distinct form factors
  **≥ 10**, interaction layers **≥ 3** (hover states / scroll behavior
  / click-operated). Below floor → return to retrieval and deepen the
  inner anatomy (atoms/molecules inside sections); never pad with beats
  that fail the `breaks` test. Accounting rules per
  `recomposition.md` — laundered components count 0.
  **관측 가능성 기준 (v3.4 — F22):** `data-gallery` 속성 개수는 회계가
  아니라 회계의 **상한**이다. 계상되는 시그니처는 렌더에서 관측
  가능해야 한다 — vanilla 이식 중 시그니처가 흐려진 항목(모션이 빠진
  아코디언, 범용 스티키바로 줄어든 헤더)은 세지 않거나 "약한 시그니처"
  로 표기해 하한 산정에서 뺀다 (실측: 속성 기준 14 중 관측 기준
  10–11). 검증은 render-qa RQ3 의 시그니처 스팟체크가 담당.
- **Average-AI gestalt re-score:** if the page as a whole reads Inter +
  even grid + gradient + ambient shadows, prescribe divergence even if
  each row passed.
- **Layout-rhythm pass:** three consecutive sections at one mass tier,
  or a page that never leaves the card tier, fails — reassign within
  `layout_affordances`. v3.3 additions: sections default to the
  **slide unit** (`min-height:100svh`, SKILL Step 5 — undeclared
  short sections fail) and the **brightness axis** (D/M/L per section,
  three consecutive at one brightness fails — image-prescription I4).
  This pass judges the *plan*; the rendered page is re-measured by
  Step 7.5 `render-qa.md` (RQ1-5 / RQ1-6).
- **Monotony pass:** a repeated (component × mass tier) pairing across
  two beats — or an answer this rubric would emit for *any* brief —
  triggers the diversity guard (SKILL §2 Step 3, bullet 4): widen
  within the intent view, then hybrid.

---

## Per-candidate scorecard

One row per candidate considered (winners **and** each beat's rejected
obvious default):

| Beat | Candidate (corpus id) | Source | License | A | B | C | D | E | Gate | FitScore | Verdict | Signature? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Worked examples

The three v2 worked scorecards remain canonical (aurora hero on a
grief-support service → B-gate REJECT despite A=3; shadcn split-hero on
an editorial portal → 3.65 RECOMMEND signature; marquee logo-cloud as a
quiet slot → 2.65 CUSTOMIZE, *correctly* below signature). v3 adds one:

**Uiverse neumorphic toggle (`uiverse:Toggle-switches/…`, MIT, css) on
a settings-heavy tutorial page** — A 3 (radius + shadow remap) · B 3
(compatible with a Guide beat's control anatomy) · C 4 (real control,
wired) · D 3 (distinct via tactility, no bans) → FitScore 3.30,
RECOMMEND as *quiet* inner anatomy of an I6 section — it also advances
the form-factor count toward the density floor, which is exactly the
job of atoms.
