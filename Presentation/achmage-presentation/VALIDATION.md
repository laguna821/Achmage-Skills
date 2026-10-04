# Validation status — v1.0.0, 2026-10-04
This records the tested1.0.0 payload before publication. The external Hallym instruction/reference text has been excluded and replaced by newly authored scoped guidance; no redistribution rights are assumed. Actual publication and OS installation receipts are separate from these technical results.

Baseline engine: 35e3ba49b55268f827b12c55ff96223e03586f0887873e1a4793624878aed37d; all19 locked payload files are unchanged. This is packaging and scoped orchestration, not an engine redesign.

## Observed
- Windows; Python3.12.14, Node25.9.0, Pillow12.3.0. Copy installed in a fresh directory and rendered from an unrelated working directory without Achmage imports/MCP calls.
- Both schema1 quickstart (3 slides) and schema2 data-literacy (10 slides) rendered in Light/Dark. CUA Chromium collected56 and168 valid observations respectively, covering the exact12-case read/present/fit matrix for Korean and both themes. Strict geometry checker passed with zero errors. An earlier uninvoked-collector run produced null rows and was rejected; it was retained separately, not counted.
- Four PDFs exported through an explicitly selected WeasyPrint70.0 executable:3+3+10+10 pages. The6 quickstart pages were visually inspected. The20 data-literacy PDF pages match previously reviewed output text and rendered pixels exactly; both data-literacy HTML files are byte-identical to the existing reviewed artifacts.
-13 acceptance checks passed: existing installation preservation, candidate release refusal, package-output refusal, source/receipt/report protection, valid matrix, mismatched observation binding rejection, missing coverage rejection, browser error rejection, changed member rejection, corpus integrity, capture script syntax.
- Corpus verifier:4275 rows,4196 vendored and attributed records. Local corpus and UX queries worked in an independent forward test.
- Independent forward tester authored a new3-slide deck from the skill docs and rendered both themes without OS/MCP access. Its own browser was unavailable and default PATH PDF converter lacked native libraries; it correctly reported a draft. Parent execution confirmed an explicitly selected working converter. This does not imply every host has its dependencies installed.
- Independent code review found3 defects; observation-byte binding, read-slide capture scope and PDF receipt protection were corrected and reviewed again. Scoped approval/slide-count conflicts and converter diagnostics were clarified.
- Official skill metadata validator passed on Python3.14 with PyYAML6.0.3 and UTF-8 mode. Metadata validation is not a rendering test.
- A separate final reviewer checked the exact19 engine files against the approved release, the690 copied source-mapping files of the other five members, raw prior validation receipts and the newly authored Hallym member. Its unsupported-pattern and stale-reference findings were corrected without modifying the engine.

## Not verified by these results
Physical iPhone/HTML Viewer, WebKit, native browser toolbar changes, other operating systems, actual Codex/Claude/Gemini automatic discovery, standalone capture.mjs execution, complete new-deck interaction/contrast acceptance, or final public ZIP contents. CUA observations do not prove the optional Playwright helper was executed. Original39 was not republished or rerun in this packaging task; the identical engine pin preserves the previously approved baseline, not a new39-slide acceptance claim.

Raw execution records are retained in the managed implementation workspace, outside the public package to avoid distributing personal paths. The package's production workflow still requires every new deck's full evidence; these fixtures confer no blanket pass.
