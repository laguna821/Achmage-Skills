---
name: achmage-presentation
description: Create, edit and review presentation decks using the complete portable Achmage six-role bundle, with Hallym defaults and mobile single-slide fit. The OS adapter validates the bundle against the work's approved engine pin.
license: Apache-2.0
aliases:
  - achmage-presentation
tags:
  - skill
  - skill/achmage-presentation
  - skill-category/visual-content-presentation
---
# Achmage OS presentation entry

This thin OS entry accompanies a byte-identical complete public bundle in the sibling bundle/ directory. It is not a substitute for those resources. Follow the available presentationPolicy and read bundle/SKILL.md, then its scoped orchestration and selected member instructions.

Run bundle/scripts/presentation.py doctor using presentationPolicy.engine.execution.pythonPath with -B and --converter presentationPolicy.engine.execution.pdfConverterPath. Compare the reported engineSha256 with presentationPolicy.engine.packageSha256. They must match before generating a deck. Do not silently update a running work's engine pin or substitute a different installed member version.

The packaged renderer and approved OS engine must remain byte-equivalent. The public package owns content orchestration; the OS owns selection, work engine pinning and protected review. Shared engine changes still require the existing presentationPolicy.reviewRefs gates. A future promoted engine requires a compatible new package version before this adapter can use it.

For ordinary presentation requests use the bundle's single narrative and six scoped roles. Do not independently activate the historical Hallym compiler, Raw5 builder, a second consulting builder or competing design-system generators. Explicit user/project workflow and format choices take precedence.

Deliver HTML/PDF and honest evidence limits. The compact hook may retain legacy member metadata; the selected workflow and this single entry define the effective member set. Read bundle/VALIDATION.md to distinguish known coverage from this new deck's required checks.
