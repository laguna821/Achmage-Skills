# Component Consulting Report — output template

The deterministic skeleton `component-consulting` fills in every run. Keep the
section order fixed so output is consistent and scannable. Delete bracketed
guidance; keep the headings.

---

## 1. Consulting Brief

```
GOAL:      <one sentence — what this page makes the visitor believe or do>
AUDIENCE:  <who / device / mindset>
INTENT:    <2–3 concrete words — no "modern/clean/elegant">
TOKENS:    <path to DESIGN.md / token file>
DELIVER:   <live frontend | slide deck>   ·   HOUSE SYSTEM: <none | name (overrides)>
```

## 2. Token Constraint Card

> The hard constraints every component must reconcile with. Pulled from the
> DESIGN.md — do not invent values.

- **Accent (the 10%):** `{colors.accent}` → `<hex>` — only one loud color allowed
- **Neutrals / surface:** `{colors.surface}`, `{colors.fg}` → …
- **Type roles:** display = `{typography.display}` · body = `{typography.body}` ·
  mono/label = … — **no new fonts**
- **Radius vocabulary:** `{rounded.sm|md|lg}` → …
- **Spacing unit:** `{spacing.unit}` → …
- **Elevation posture:** `<shadows | borders-only>` …
- **Already in `components:` block:** `<list — consume these, don't re-decide>`

## 3. Job-Slot Map

| IA block | Job-slot | Message demand (one phrase) | Signature? |
|---|---|---|---|
| `<block>` | `<slot>` | `<what this slot must say>` | SIGNATURE / quiet |
| … | … | … | quiet |

> Exactly **one** row may be SIGNATURE.

## 4. Per-Slot Recommendations

> Repeat this block per slot. This is the core of the report.

### Slot: `<name>` — *<message demand>*  ·  [SIGNATURE | quiet]

- **RECOMMENDED:** `<component>` from **<gallery>**
- **WHY:** *Because the site's goal is `<X>` and token `<Y>` says `<Z>`, this
  component earns its place.* `<one or two more sentences>`
- **TOKEN MAPPING:**
  - `<css-property>` → `{token.path}`
  - `<css-property>` → `{token.path}`
- **REJECTED OBVIOUS CHOICE:** `<what an average AI would reach for>` —
  rejected because `<message/token/distinctiveness reason>`.
- **STATES** *(if interactive):* hover · focus · active · disabled · empty ·
  loading · error — `<note any that need design>`
- **MOBILE DEGRADATION:** `<how it reflows / collapses on small screens>`
- **BACKEND NOTE:** `<real-data wiring / server-render / form-submit concerns>`
- **STUB:**
  ```
  <minimal, token-customized import + usage — framework-appropriate;
   pure CSS/HTML for slide decks>
  ```

*(Optional)* **Scorecard** for this slot's candidates:

| Candidate | Gallery | A | B | C | D | E | Gate | FitScore | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| `<winner>` | … | … | … | … | … | … | pass | … | RECOMMEND/CUSTOMIZE |
| `<obvious choice>` | … | … | … | … | … | … | … | … | REJECT |

## 5. Combination & Placement Plan

- **Reading order (the decision journey):** `<orient → thesis → proof → objection → CTA>`
- **Rhythm:** `<which sections are dense vs airy; no two adjacent at equal weight>`
- **Signature placement:** `<where the one loud moment lands and why>`
- **Card-soup risk + how avoided:** `<…>`
- **Responsive story:** `<how the set holds together on mobile>`
- **Backend posture:** `<which components carry real state/data>`

## 6. Coherence Verdict

> One paragraph. Does the **set** (not each piece) reinforce the goal sentence?
> Name residual risks.

**VERDICT: PASS / REVISE** — `<rationale>`

---

**Build these next?** *(This skill stops at the prescription — it does not start
building until you say go.)*
