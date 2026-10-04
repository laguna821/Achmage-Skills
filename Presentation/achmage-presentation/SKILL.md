---
name: achmage-presentation
description: Create, edit, or review presentation decks, slides, keynotes, 발표자료 and 강의 슬라이드 with the complete Achmage consulting and Hallym set. Produces offline HTML and PDF with desktop presentation, mobile single-slide reflow and reading modes.
metadata:
  version: "1.0.0"
---
# Achmage Presentation — complete set
One brief, one story, one renderer. This installed folder is self-contained; no Achmage OS, MCP, personal vault, or other globally installed skill is required.

## First read
Read [orchestration](references/orchestration.md) and [authoring](references/authoring.md). Run `python -B scripts/presentation.py doctor`. Resolve this skill's directory from this file, not from the current project or a guessed user path. Read each selected member's complete INSTRUCTIONS.md before applying it; the orchestrator scopes those source instructions.

For a normal "발표자료 만들어줘", use this set. Explicit user brand, format, existing deck, and an explicit Raw5/other workflow request take precedence. Do not create multiple alternative decks because multiple members are installed. Missing content or audience is a brief question, not permission to invent evidence or affiliation.

## Workflow
1. Establish audience, purpose, duration and available source material. Record assumptions and distinguish sourced claims from illustrative examples. Make one title sequence and one message per slide; use the component member's Reader → Genre → Beats before choosing patterns.
2. Follow all six member roles in orchestration.md. Record their actual contributions in a sidecar production report. "Loaded" is not evidence a tool ran. The public corpus and UX database are bundled and can be queried locally.
3. Write deck.json using the approved engine's schema. The only renderer is engine/render.py, called through scripts/presentation.py. Never run a member's alternate builder. Frozen engine changes require the separate protected review procedure.
4. Render Light/Dark as requested (both for the default validation set), capture the complete browser matrix through an allowed browser backend, run geometry checks, visually inspect every slide, then export and inspect PDF. Read engine/assets/MOBILE-QA.md in full for every new deck.
5. Deliver standalone HTML + PDF + a concise verification report. Mark unavailable browser/PDF/independent review capability as not reviewed; never substitute source checks for rendered evidence.

## Defaults
Hallym-inspired no-logo profile: white Light surface with black/deep navy text and blue/teal accents; deep navy Dark surface with white text. Pretendard with mono labels where the engine uses them. No invented university affiliation or official endorsement. Preserve the original minimal segmented footer.
Mobile ≤850 CSS px: vertical reflow and one entire slide fitted between real controls. Separate expanded reading and fixed-aspect presentation. Desktop defaults to presentation. Explicit mode choices persist.
Default output is HTML/PDF, not editable PPTX. The 39-slide reference is regression coverage, not a required deck length.

## Completion and changes
Use [validation](references/validation.md). Keep drafts distinct from accepted delivery. Do not hide content, drop sources, erase diagram relationships, or call tiny text readable merely because it fits. 12 CSS px is a portrait screening floor, not a comfort guarantee.
For shared engine changes use [review contract](references/review.md): independent critique of the diagnosis and proposed alternative, candidate counterreview, distinct final verification, exact evidence binding, at most three candidate attempts before defer. A role label is not independent execution. A completed normal deck does not require republishing the engine.

