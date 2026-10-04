# Hallym presentation role

This is newly authored Achmage integration guidance under Apache-2.0, not the source text or development compiler of the external Hallym skill. It implements the Hallym brand/pattern role in this six-member bundle. University affiliation and endorsement must never be inferred.

Read APPROVED-PROFILE.md and PATTERN_CATALOG.md. Use the single approved engine through ../../scripts/presentation.py; its bytes and fonts are fixed by ../../engine.lock.json. No alternate renderer, logo asset or original sample is required.

## Start with the audience task
Take the narrative owner's brief and slide-message sequence as input. Identify what the audience should understand or decide after each slide. Select a composition that makes that relation legible on a projected screen. A slide is not a dashboard of every fact known about the topic.

Give the key claim the largest typographic emphasis. Give context, evidence, labels and attribution visibly distinct subordinate roles. Use the available area deliberately: supporting components belong near the claim they establish, and whitespace must help the audience group the message. Do not fill an empty region merely to satisfy an arbitrary density target.

## Preserve the reference's functional simplicity
The segmented footer communicates position and total length with little visual weight, including in PDF and with outer controls hidden. Keep that role. The burden of proof belongs to a proposed replacement.
The same rule applies to hierarchy, purposeful layout rhythm and component behavior. A critique must state the audience problem, show it, and test a minimal alternative. Preference changes such as Light versus Dark are not performance improvements.

## Theme
Use ../../engine/brand-tokens.json as the exact token source. Light is predominantly white with black/deep navy type and blue/teal accents; only small emphasis regions invert to navy. Dark is deep navy with white type. Both themes carry identical content and component semantics. Use the included Pretendard font; no seal, university logo, invented department or invented speaker credential.
Explicit project or user branding wins. If the frozen renderer cannot express an explicitly required brand without changes, explain the limitation and use the protected review procedure rather than silently mutating shared tokens.

## Mode contract
Presentation uses a fixed aspect canvas. Mobile fit reflows content vertically and shows exactly one whole slide in the measured space between the top toolbar and lower navigation. Read is a separately selected scrolling pane. Use the same semantic source for all modes and PDF.
Preserve every number, unit, qualifier, source, reveal conclusion and comparison side. A diagram's mobile form must retain its relationships and directionality. Ambiguous diagrams need a reviewed representation; decorative redraws do not establish equivalence.
Do not hide content or shrink everything to manufacture a pass. Recompose a dense slide while preserving its message. Follow ../../engine/assets/MOBILE-QA.md for actual measurements and interaction checks.

## Output to other roles
Provide the selected native pattern, its reason, any brand exception, and what must remain equivalent across modes. Impeccable critiques hierarchy and rhythm within this profile. UI/UX checks accessibility and interaction. Render audit measures actual output. Final findings and alternatives are counterreviewed under ../../references/review.md when shared engine behavior changes.
