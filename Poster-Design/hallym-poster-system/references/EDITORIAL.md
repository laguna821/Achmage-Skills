# Editorial one-sheet · 1.3.0-rc.1 candidate

Use this optional path for a print poster whose message requires prose, tables and a diagram together. It complements legacy and series-v2; it does not migrate their engine or paper contract.

The portfolio's A4 studies use web reading and portrait HTML. Do not generate or upload A4 PDFs for those studies. Poster PDF examples belong in Poster-Design, separately from the portfolio.

## Input and run

Read an example in examples/editorial. The ordinary request runner accepts poster.editorial with:
- size: A2 (420×594mm trim, 2mm bleed); A4 is an optional explicit print request only.
- language, title, subtitle, metadata, abstract.
- figure: local SVG asset, caption, optional heightMm.
- sections: unique id, title, body paragraphs, table headers/rows/widths, optional figure.
- rows: one or two section IDs per row; every section exactly once.
- references: preserve the data, method and source limits.

Set assetRoot to the directory containing the referenced SVGs and outputDir to a new workspace directory; invoke scripts/poster.py request.json. Do not write outputs inside the installed skill. Reuse the included example JSON by adding those two paths in a workspace copy.

This path accepts bounded static SVG, not active HTML, images, external resources or imported scripts. Pele is a build-time producer; it is not required by the poster runner. The same normalized SVG drawing is used for the PDF and HTML paper view.

## Layout decisions

Start with a one-sentence claim. Arrange title/metadata → summary → main figure → evidence and limitations → references. One complex figure or several justified figures are both valid. Do not force a Bento grid. Recompose figures at their actual printed size: A2 prose ≥18pt and diagram/caption ≥18pt. The default prose is21pt. Measurement failure stops the output; edit columns, content or figure design instead of silently shrinking.

Tables preserve textual precision. Diagrams show explicit relationships. An arrow is not evidence of causality. Public-data cached estimates must state that typesetting is not fresh statistical recomputation. Keep native Pele layout, authored SVG, calculation and host behavior distinguishable.

## Verification and viewer

Result status remains generated-awaiting-visual-review until actual review. Check every PDF page, embedded fonts, Trim/Bleed, all text/values, figure label size and actual PDF/HTML geometry. The HTML paper view is a fit overview; zoom and full text reading supply detail. It is not the series-v2 responsive recomposition engine. Inspect320×568,390×844,1440×900 and both viewer themes, tools overlap, keyboard, focus and print mode.

Outputs are poster.pdf, paper.svg, poster.html and result.json. HTML is an offline review artifact with embedded fonts; it does not implement PS10 sharing metadata or claim Kakao preview verification. Publish an explicit allowlist only. RGB output is needs-print-profile; no CMYK, PDF/X or press approval claim. Existing legacy/series production behavior and pinned outputs remain unchanged.
