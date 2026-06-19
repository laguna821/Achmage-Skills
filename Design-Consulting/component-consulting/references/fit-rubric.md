# Fit Rubric

How `component-consulting` scores a candidate component for a job-slot. This is
what separates the skill from "here is a list of websites." **Gates first, then
weighted score, then a page-level pass.** Score each axis **0–4**.

> **The relational truth:** the *same* component scores differently on different
> sites. A dynamic-island notification pill is a **0** on an editorial research
> portal and a **4** on a consumer SaaS social-proof ticker. Fit is never a
> property of the component alone — it is the component **× the message × the
> tokens**.

---

## The five axes

### Axis A — Token Fit *(weighted 0.35)*

How far is the component's default styling from the DESIGN.md tokens? Count the
**remap distance** across five dimensions: **color roles, type scale, radius,
elevation, spacing.**

| Overrides needed | Score | Meaning |
|---|---|---|
| 0–1 dimensions | **4** | drop-in; restyle is pure `{token}` substitution |
| 2 dimensions | **3** | the *"buy + customize lightly"* sweet spot |
| 3 dimensions | **2** | heavy reskin |
| 4 dimensions | **1** | you're basically rebuilding it |
| 5, **or** a baked-in property that can't be re-tokenized (font compiled into an SVG, gradient hard-coded into artwork, color in a canvas) | **0** | **reject for cost** |

**Ceiling rule:** Axis A = 4 only if the restyle can be written purely as
`{token}` substitutions — i.e. expressible as a DESIGN.md `components:` entry with
**no orphan literals** (no stray hex, px, or font-name the tokens don't cover).

### Axis B — Message / Philosophy Fit *(GATE)*

The user's #1 priority. Name the component's **rhetorical intent** in 3–5 words,
name the **site's stated intent** in 3–5 words, and score the angle between them:

| Score | Relationship |
|---|---|
| **4** | reinforces — the component *is* the message made visible |
| **3** | compatible — neutral, doesn't fight |
| **2** | tension — slight friction (applies a **−0.5 tax** to the final score) |
| **1** | fights — pulls against the stated intent |
| **0** | undermines — actively contradicts the message |

**GATE: B of 0 or 1 → auto-reject, even with Token Fit of 4.** A perfectly
on-brand-colored component that fights the message is still wrong.

**Worked pairings:**

- *Dynamic-island pill* — rhetorical intent "playful, ephemeral, consumer." On an
  **editorial research portal** (intent "archival, authoritative, calm") → **0,
  reject**. On a **consumer SaaS** "live activity" ticker → **4, recommend**.
- *Aurora-spotlight hero* — intent "premium, kinetic, hype." On a
  **grief-support service** (intent "gentle, steady, human") → **0, reject**
  regardless of how cleanly it takes the brand color. On a **brutalist agency
  launch** → **3, compatible**.
- *Hard-bordered bento grid* — intent "structured, confident, dense." On an
  **enterprise data product** → **4**. On a **luxury perfume landing** (intent
  "airy, sparse, slow") → **1, reject**.

### Axis C — UX-Naturalness + Backend Honesty *(weighted 0.30)*

`C = min(C1, C2)` — a component cannot be more usable than it is honest.

- **C1 — flow-fit:** reading order, cognitive load at this point in the journey,
  density rhythm vs neighbors, affordance clarity.
- **C2 — backend honesty:**

  | Score | Meaning |
  |---|---|
  | **4** | real, wired interactivity (state maps to data) |
  | **3** | honestly static (no fake affordances) |
  | **2** | harmless decorative motion |
  | **1** | **fake controls** — looks interactive, does nothing |
  | **0** | a **dead control on a critical-path slot** (e.g. a CTA button that's decorative) → **reject** |

This axis directly targets the forum-post failure: *"pretty buttons that don't
work."* A control on the conversion path that can't be truly wired is a reject,
not a deduction.

### Axis D — Distinctiveness Band *(weighted 0.35)*

A band, not a ladder — the sweet spot is in the **middle**:

```
bland (1) ── safe (2) ── DISTINCTIVE (4) ── awwwards (4) ── gratuitous (1)
                          └────── sweet spot ──────┘
```

**Average-AI penalties** (−1 each, floor of 1) — these push a candidate toward
"bland":

- Inter / Roboto used as the **display** face
- an evenly-spaced N-column **card grid** as the primary layout
- a **purple→blue gradient** / "AI-aura" glow
- three equal-weight, icon-on-top, centered cards
- gratuitous **glassmorphism**
- uniform medium radius **+ ambient shadow everywhere**
- a generic SaaS hero with an angled dashboard mockup

**Hard bans → D = 0 (reject):**

- **BAN 1** — decorative side-stripe (`border-left`/`border-right` > 1px as ornament)
- **BAN 2** — gradient text via `background-clip: text`

**One-signature-moment rule (page-level):** at most **one** component per page in
the awwwards band (3.5–4); every other component earns its keep through
*restraint* (distinctive ≈ "quietly right"). Two components both shouting → flag
**CONFLICT**, force the user to choose which one is the signature. Four components
all loud → the whole page is capped at **D = 2 (gratuitous gestalt)**.

### Axis E — House-System Override *(GATE + mode-switch; only when a house/personal design system is in play)*

When the brief names a house or personal design system (e.g. a "thesis" system),
this axis activates and **inverts the catalog's preferences**:

1. **Preference inversion** — the house's own signature patterns become the
   **first-choice** catalog; generic gallery components are the fallback.
2. **Fingerprint gate** — reject any gallery component that can't be reskinned to
   the house fingerprints. *Example fingerprints (ACH Thesis):* cool neutral
   canvas; **charcoal borders, not shadows**; blue used sparingly; mono labels +
   sans body; low radius + side rails; **no glass / gradient / AI-aura**; thesis
   stated **before** any hero flourish.
3. **Override verdict** — if a gallery component fights *any* fingerprint **and**
   a house pattern does the same job, **reject the gallery component and
   recommend the house pattern.**
4. **Bonus** — **+0.5** to the final score when a house pattern is chosen over a
   generic one (rewards system consistency).

---

## Aggregation

**Step 1 — Gates (any failure → REJECT, skip the rest):**

- Axis B ≤ 1
- Axis E fingerprint failure (when house mode is on)
- Axis A == 0
- Axis D == 0 (a hard ban tripped)
- Axis C2 == 0 (dead control on a critical-path slot)

**Step 2 — Weighted score** (for candidates that pass the gates):

```
FitScore = 0.35·A + 0.30·C + 0.35·D
           − 0.5  if B == 2   (tension tax)
           + 0.5  if a house pattern was chosen (Axis E bonus)
```

**Step 3 — Verdict:**

| FitScore | with… | Verdict |
|---|---|---|
| ≥ 3.2 | **and B ≥ 3** | **RECOMMEND** (buy as-is or 1-dimension remap) |
| 2.2 – 3.2 | — | **CUSTOMIZE** (buy + light remap) |
| < 2.2 | — | **REJECT** |

**Step 4 — Page-level pass** (after per-slot winners are chosen):

- Enforce **≤ 1** awwwards-band slot; demote extras to their quiet runner-up.
- Flag any signature **CONFLICT** for a user decision.
- Re-score the **whole-page "average-AI gestalt"**: if the page as a whole reads
  as Inter + even grid + gradient + ambient shadows, cap it and prescribe a
  divergence even if each component passed individually.

---

## Per-candidate scorecard (the table the skill emits)

One row per candidate considered (winners **and** the rejected obvious choice):

| Slot | Candidate | Gallery | A | B | C | D | E | Gate | FitScore | Verdict | Remap dims | Signature? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

---

## Worked scorecards

**1. Aurora-spotlight hero on a grief-support service** *(intent: gentle, steady,
human)*

| A | B | C | D | E | Gate | Verdict |
|---|---|---|---|---|---|---|
| 3 (takes the brand color cleanly) | **0** (undermines — hype vs grief) | 2 | 2 | n/a | **B-gate FAIL** | **REJECT** |

> Token fit is irrelevant. The message gate kills it. *This is the point of the
> rubric.*

**2. shadcn split-hero (text left, calm image right) on an editorial research
portal** *(intent: archival, authoritative, calm)*

| A | B | C | D | E | Gate | FitScore | Verdict |
|---|---|---|---|---|---|---|---|
| 4 (drop-in, all token substitutions) | 4 (reinforces) | 4 | 3 (distinctive via restraint) | n/a | pass | **0.35·4 + 0.30·4 + 0.35·3 = 3.65** | **RECOMMEND** (signature slot) |

**3. Marquee logo-cloud as a *quiet* social-proof slot** on the same portal

| A | B | C | D | E | Gate | FitScore | Verdict |
|---|---|---|---|---|---|---|---|
| 3 (remap motion speed + grayscale logos) | 3 (compatible) | 3 | 2 (safe, intentionally quiet) | n/a | pass | **0.35·3 + 0.30·3 + 0.35·2 = 2.65** | **CUSTOMIZE** (correct: a quiet slot should *not* score awwwards) |

> Note slot #3 deliberately does **not** reach RECOMMEND-as-signature — and that's
> right. Only slot #2 is the signature; everything else serves it.
