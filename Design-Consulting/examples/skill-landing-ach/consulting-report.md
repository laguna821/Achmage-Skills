# Component Consulting Report — the skill's own landing page (ACH Thesis / Axis-E mode)

> `component-consulting` run on **itself**, consuming the canonical
> `40_Achmage-Wiki/wiki/design-md/my-systems/ach-thesis-DESIGN.md`. Because the
> brief names a house design system, **Axis E (house-override) is ON** — the ACH
> 14 signature patterns become the first-choice catalog; generic gallery
> components are rejected unless they reskin to the ACH fingerprints. Rendered
> result: `./index.html`.

## 1. Consulting Brief

```
GOAL:      Convince a developer that picking + placing components by message-fit (not vibes) is the missing skill — and make them open the SKILL.md.
AUDIENCE:  Vibe-coders & frontend devs, desktop-first, skeptical ("another component list?").
INTENT:    structural, argued, evidence-first
TOKENS:    ach-thesis-DESIGN.md (consumed verbatim — borders-only, action-blue sparingly, mono meta + sans body)
DELIVER:   live frontend (long-scroll landing)   ·   HOUSE SYSTEM: ACH Thesis (OVERRIDES — Axis E on)
```

## 2. Token Constraint Card (from ach-thesis-DESIGN.md)

- **Canvas/surface:** `{colors.bg-canvas}` `#F5F7FA` / `{colors.bg-surface}` `#FFFFFF` — quiet, ≤4 bg shades
- **Action blue (the only loud color):** `{colors.brand-500}` `#245BDB` — one primary action per viewport
- **Borders carry structure:** `{colors.border-strong}` `#344054` — *borders over shadows*
- **Role accents = 3px LEFT borders only:** evidence `#B7791F` · quote `#0F766E` · case `#7C3AED` · ai `#6941C6`
- **Type:** Pretendard sans body, **JetBrains Mono** meta labels; display 44/56 700; measure **72ch** / side-rail 32ch
- **Radius:** `{rounded.sm}` 8px structural · `{rounded.md}` 12px panels — bias small
- **Elevation:** `shadow-none` default; **sparse hard-offset** allowed on key surfaces; **no soft ambient blur, no glass, no gradient**

## 3. Job-Slot Map (Axis-E: each slot resolves to an ACH pattern, not a gallery component)

| IA block | Job-slot | ACH pattern (chosen) | Signature? |
|---|---|---|---|
| Masthead | Orientation | mono condensing masthead (no hero image) | quiet |
| Opening argument | Hero/Thesis | **ThesisHeader** | **SIGNATURE** |
| Reading axis | Orientation | **AxisStrip** (sticky) | quiet |
| The essence | Summary | **CoreSummaryBox** | quiet |
| The problem | Axis-Compare | **AxisCompareBlock** (average-AI vs message-fit) | quiet |
| The method | Process | **WorkflowStrip** (ask→derive→source→score→place→validate) | quiet |
| The rubric | Data-display | **EvidenceTable** (5 axes) | quiet |
| Worked example | Proof/Case | **CaseScene** (aurora-hero gate-fail) | quiet |
| The gap | Proof | **EvidencePanel** (no skill does this) | quiet |
| Reader check | Self-check | **SelfCheckBlock** | quiet |
| Provenance (meta) | Review | **AIProvenancePanel** + **RevisionTimeline** | quiet |
| Sources | Citation | **SourceLedger / CitationRail** | quiet |
| Closing | Primary-CTA | one primary button (`Read the SKILL.md`) | quiet |

> **One signature moment** = the ThesisHeader. Everything else is quiet-by-restraint — exactly ACH's "개성은 색이 아니라 위계·간격·제목·테두리·배치에서."

## 4. Per-Slot highlights

### Hero/Thesis — **ThesisHeader** · SIGNATURE
- **WHY:** *Because the goal is to reframe "which components?" into "which components serve the message?", and ACH demands the page start with the question, the ThesisHeader IS the signature* — overline (mono) + reframed thesis (display) + thesis line on the action-blue left bar + summary chips + one CTA.
- **TOKEN MAPPING:** thesis line `border-left` → `4px {colors.brand-500}` · overline `font` → `{typography.meta-mono}` · title → `{typography.display}` · header `border-bottom` → `2px {colors.border-strong}`
- **REJECTED OBVIOUS CHOICE:** an aceternity aurora/spotlight hero — **Axis E gate-fail** (glass/gradient/AI-aura forbidden) *and* Axis B fail (hype undermines "structural, argued").

### The problem — **AxisCompareBlock**
- Two columns, equal level: *"Average-AI frontend"* (pretty, dead buttons, message-blind, card-soup) vs *"Message-fit frontend"* (every component earns a one-sentence test). Borders separate columns; no decorative fill.
- **REJECTED:** three even feature-cards — ACH anti-pattern (card-soup) and an Axis-D average-AI tell.

### The rubric — **EvidenceTable**
- Real `<table>` semantics: Axis · measures · gate/weight. `border-strong` outer, `bg-subtle` header. Not a grid of stat cards.

### Worked example — **CaseScene** (`role-case` left border)
- Concrete scene: *"A grief-support service. The AI reaches for an aurora-spotlight hero because it looks premium…"* → Axis B gate-fails it regardless of token-fit. Abstract rubric → lived scene (ACH principle 6).

### Provenance (meta, self-referential) — **AIProvenancePanel** + **RevisionTimeline**
- The page **declares it was built by the skill it documents**: 4 mandatory fields (what's AI-generated / what's human-decided / when / restore path) + a draft→prescription→build→verify timeline. AI as *state, not atmosphere*.

## 5. Combination & Placement Plan

- **Reading order = the argument:** thesis → essence → problem → method → rubric → proof(case) → gap → self-check → provenance → CTA. The page is read top-to-bottom as one thesis.
- **Rhythm:** Tier-1 thesis gets `sp-10` air; evidence/method tiers `sp-06`; meta rows `sp-02`. No two adjacent blocks at equal weight.
- **Side rail:** a **CitationRail** on ≥1200px keeps sources attached without breaking the 72ch body.
- **Motion (ACH-restrained, awwwards-through-restraint):** sticky AxisStrip; scroll-progress hairline; functional fade-up reveal of evidence/case panels; **one** hard-offset shadow on the thesis card. No ambient gradient show, no motion chrome.
- **Backend honesty:** the CTA is a real link; the self-check uses real checkboxes; nothing is fake interactivity.

## 6. Coherence Verdict

The page *is* its own thesis: it reframes the question in the ThesisHeader, argues it with a comparison + rubric + a lived case, and — self-referentially — discloses that the skill built it. One loud moment (the thesis), borders not shadows, blue used exactly twice (thesis bar + CTA), zero gradient/glass. Every ACH don't is avoided; every component traces to a token.

**VERDICT: PASS** — message = medium: a consulting skill argued in the argument-first design system.

---

**Build:** `./index.html` (self-contained, no build step).
