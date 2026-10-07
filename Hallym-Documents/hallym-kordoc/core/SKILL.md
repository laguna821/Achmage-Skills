---
name: kordoc-workbench
description: Analyze Korean HWP/HWPX reference forms and create HWPX reports from Markdown in their style. Reuse templates, fill fixed forms, and verify generated documents with kordoc.
---

Use the bundled kordoc 4.18.13 engine for Korean reports. The normal workflow is reference form → style/field analysis → confirmed Markdown → HWPX → validation and SVG/HTML preview. Keep reusable TemplatePacks with the output. Core HWP/HWPX work needs Node >=20, without OCR models or a browser.

1. Read [references/templates.md](references/templates.md) for reference-form reports and [references/gongmunseo.md](references/gongmunseo.md) for official reports. Select a mode from [references/operations.md](references/operations.md). Read other mode details only when needed. The pinned API types are in `references/engine-api.d.ts`.
2. Write a JSON request with `schemaVersion: 1`, `mode`, absolute input paths and a new `outputDir`. Invoke `node scripts/run.mjs request.json` or `python scripts/launch.py request.json`. If Node is missing, run the platform setup script. Optional capabilities download pinned dependencies/models only when requested; explicit `KORDOC_OFFLINE=1` forbids downloads. Query `mode: capabilities` for environment readiness. Never treat readiness as successful document verification.
3. Review JSON results. Exit codes: 0 complete, 2 partial, 1 failed. Describe skipped edits/fields and requested features that were not processed. A partial result is not complete success.
4. Deliver output files and relevant previews. HWPX structure validation is automatic for new files; visual review and Hancom opening are separate checks.

Do not request PDF/PNG/OCR for every report. Prefer SVG/HTML previews; request expensive formats only when needed. Preserve original font names; a preview can substitute installed fonts and is not proof of exact Hancom pagination. Internet access and cache persistence vary in web sessions: disclose an unavailable extension and never silently omit a requested output.

For fixed-layout forms, use `fill` (HWPX preserve) or `patch` (HWP5/HWPX). For reports with new structure or length, use `template-analyze` then `template-apply`. Confirm role meaning from extracted XML evidence; mark non-HWPX style inference as inferred.

Freeze cover dates explicitly with `frozenDate` or `gongmun.cover.date`. Determinism applies to frozen Markdown/options/assets and engine 4.18.13, not to the AI's draft. Retain originals and use new output directories. Masking covers detected text, with image PII coverage reported separately.

In web sessions set `KORDOC_WEB=1` before invoking the runner. TemplatePacks are download artifacts: reuse across sessions requires saving and reattaching the pack, or verifying its persistent storage. HanMark delivery is an optional local addon; read [references/hanmark.md](references/hanmark.md) only when requested. Web processing runs inside the web session and must not call a PC or external processing server.
