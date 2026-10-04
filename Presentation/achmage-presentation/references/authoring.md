# Authoring contract
Use schemaVersion 1 for straightforward new content; use schemaVersion 2 semantic nodes for approved patterns/interactive diagrams. Both are accepted by the same renderer. See examples/data-literacy.json and examples/quickstart.json.
Required deck fields: schemaVersion, title, audience, purpose, slides. Optional theme light|dark; aspect16x9|16x10; brand overrides primary/secondary/accent/surface/ink as six-digit hex. Explicit other branding takes precedence, but new custom SVG palettes need separate visual verification; do not promise the Hallym diagram palette automatically follows every override.
Each schema1 slide needs title and kind. Use id for stable navigation. Fields: eyebrow, body, source, detail, quote. compare: two items{label,text}; steps/timeline: items{label,text}; metrics: items{value,label,text}; bars: unit + nonnegative numeric items{label,value}. Never invent numbers. Image slides need a local PNG/JPEG relative to the spec, plus alt/caption.
Schema2: slides[].nodes is a semantic tree of type/roles/children, with whitelisted tags and roles in engine/render.py. No arbitrary script, style, event handlers or raw external runtime. Node key links to translations[language][key]. Every provided language is validated separately. Use existing example trees and preserve semantic relationships.
Do not embed speaker notes. The engine loads a separate note file only by explicit user file selection.
A missing/unsupported pattern is a design decision: prefer an existing faithful structure; do not invent unsafe diagram projections or change engine code casually.

Commands from any project directory:
```
python -B <skill>/scripts/presentation.py doctor
python -B <skill>/scripts/presentation.py render deck.json --output light.html --theme light
python -B <skill>/scripts/presentation.py render deck.json --output dark.html --theme dark
python -B <skill>/scripts/presentation.py export-pdf light.html --output light.pdf
python -B <skill>/scripts/presentation.py verify --observations observations.json --slide-count 10 --languages ko --html light.html dark.html
```
Render only produces a draft. Verify reports structural/mobile evidence scope; complete delivery additionally needs content/visual/PDF inspection and a production report. Never relabel a command's limited pass as full acceptance.

