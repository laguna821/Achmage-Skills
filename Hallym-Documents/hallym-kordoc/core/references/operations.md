# JSON operations

Run `node scripts/run.mjs request.json` or `python scripts/launch.py request.json`. All jobs use `schemaVersion:1`. Paths are relative to the invocation directory or absolute. `outputDir` must be unique; existing outputs are never overwritten. Node >=20 is required; core HWP/HWPX work does not download dependencies. Optional assets are prepared automatically unless `KORDOC_OFFLINE=1`.

| mode | Inputs/options | Output |
| --- | --- | --- |
| capabilities | no input; does not install anything | Node/platform, extension preparation state, offline policy; not certification |
| read | input; options: pages, password, layoutTables, images, plain, htmlTables; chunks:true, chunkOptions | Markdown, IR, metadata, pages, RAG |
| ocr | input; options.ocr:force; options.formulaOcr:true | Korean OCR and PDF formula OCR |
| generate | markdown or markdownFile; options.theme/page/gongmun/profile; images:{reference:path}; frozenDate | Validated HWPX and frozen MD |
| form-analyze | input | fields, schema, HWPX click-here fields |
| fill | input or builtin:gian/gian-simple; values; requireUnique; format:markdown/hwpx/hwpx-preserve | filled fields, unmatched/rejected |
| template-analyze | input; name; roleBindings; inferredStyle; tableRules | TemplatePack v1 |
| template-apply | template path; markdown/markdownFile; options; images | Styled HWPX |
| patch | input HWP5/HWPX; edited markdown/markdownFile | same format, applied/skipped, verification |
| compare | input and other; options | block/cell differences and comparison table |
| validate | input HWPX | ZIP/XML/manifest validation |
| lint | markdown or input | gongmun and munche findings |
| render | input HWP5/HWPX; format:svg/html/png/jpeg/pdf; options.pages/maxWidthPx | previews and scene |
| crop | input HWP5/HWPX; options.types/paddingPt/format | region images and coordinates |
| tables | input; options | structured tables, classification and crops when supported |
| redact | input; options.rules/maskChar | text masking, residual scan; HWP5/HWPX preserve |
| seal | input HWPX; operations:[{anchor,image,occurrence,sizeMm,mode,dxMm,dyMm}] | signed HWPX, positions/warnings |
| batch | jobs:[JSON job,...], up to 100 | sequential results, aggregate status |
| probe | no input | runtime/native capability report |

Nine public presets: official, report, plan, notice, minutes, gaejosik, ministry, bangchim, press. Use engine options directly. Cover dates in gaejosik/ministry/bangchim must be frozen.

Example:
```json
{"schemaVersion":1,"mode":"generate","markdown":"# 사업 보고서\n\n## 목적\n\n- 자료 정리","frozenDate":"2026. 10. 5.","options":{"gongmun":{"preset":"report"}},"outputDir":"results/report"}
```

Repeated values use arrays. Formatting uses `{"value":"19900315","format":"date:ko"}` (engine-supported formats). `requireUnique:true` rejects ambiguous scalar keys while keeping intentional arrays. Unknown formats in the engine are fail-open; verify desired formatting in output.

Use layoutTables:keep for round-trip editing and forms. HWP3 is readable but cannot be patched. HWPX/HWP3 opening passwords are supported where the engine supports them; DRM is separate. HWP5 preserve editing has engine limits. Added/removed paragraphs and unsupported multiline edits can be skipped and produce partial status.

Result fields: schemaVersion, jobId, engine, status, success, files (path/hash/bytes/MIME), warnings, skipped.edits/fields, data, failure(code/message/details). Significant parse warnings cause partial status. Images are actual extracted data in JSON; images must be explicitly provided for generation.

The optional `runtime` result records Node and extension package versions, plus the browser path used for PDF. Setup errors include DEPENDENCY_UNAVAILABLE_OFFLINE, DEPENDENCY_SETUP_FAILED, SETUP_IN_PROGRESS, ASSET_DOWNLOAD_FAILED, ASSET_HASH_MISMATCH and BROWSER_UNAVAILABLE. Core documents and prior outputs are preserved if setup fails. `capabilities` reports preparation, not OCR accuracy or platform certification. OCR and formula recognition require reviewing the recognized text.
