# TemplatePack v1

Analyze with `template-analyze`. HWPX document styles and table profiles are extracted directly. The evidence list includes paragraph text, character IDs and paragraph IDs. Assign semantics using `roleBindings:{"body":{"charPrId":"...","paraPrId":"..."},"h1":{...}}`; the engine reads actual values for those bindings. Direct formatting that differs within a role is not completely reproduced.

For HWP/PDF/images, read/OCR first, interpret style appearance and pass an `inferredStyle` using DocumentStyleProfile schemaVersion3. Those values carry ai-inferred evidence. Do not describe inferred measurements as exact extraction.

A pack contains kind, schemaVersion1, id, version, name, source hash/format, engine, Markdown skeleton, fields, documentStyle, tableProfile, gongmun options, tableRules, assets (base64 plus hash), evidence, limitations, validation and contentHash. The content hash uses sorted-key JSON excluding contentHash, validation and createdAt.

For variable tables, use `tableRules:[{"tableIndex":0,"headerRows":1,"dataRow":1}]`. Data rows must be unmerged and rectangular; existing merged headers remain supported. Actual output row count determines the expanded profile. Unknown columns or complex repeated rows fail explicitly.

Do not guess table indexes. Inspect tableProfile.tables, table_index, anchor_text and row/column counts; official layouts contain decorative tables before the user data table. Preserve the same gongmun preset/options when analyzing and reusing an official source. Pass known options as gongmun in template-analyze so they are stored in the pack. Review direct/inferred role evidence and expose any partial official mapping.

The skeleton is reference material; write new content and verify no reference-only names or values leak into a new report. Use fill/patch for exact-layout requests. General document style application handles named roles and page style. Official documents use an explicitly reported subset through GongmunOptions; other role properties require preview review.

A local library can store each `*.kordoc-template.json` by content hash. For web reuse, return the pack and include it in a refreshed skill upload. A session's transient path alone does not establish persistence.
