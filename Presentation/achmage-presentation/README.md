# Achmage Presentation 1.0.0
전체 컨설팅 세트를 한 번에 설치하는 발표자료 스킬입니다. Achmage OS/MCP 없이 작동합니다. 기본 결과물은 오프라인 HTML + PDF이며, 모바일에서는 세로 재배치 후 한 장씩 맞춥니다.

## Install
Install the complete folder, not SKILL.md alone. From the repository or extracted full-set ZIP:
First enter Presentation/achmage-presentation in the repository, or achmage-presentation after extracting the ZIP.
```
python -B scripts/install.py --agent codex
python -B scripts/install.py --agent claude
python -B scripts/install.py --agent gemini
```
Use --dest <skills-directory> for a custom/project installation. Existing installations are never silently replaced. Python3.11+ and Node20+ are required; install requirements.txt in your own virtual environment. PDF conversion may need platform libraries described by WeasyPrint. Optional browser capture: npm ci and npx playwright install chromium webkit. The host's browser restrictions still apply.

PDF selection is explicit path via --converter, then ACHMAGE_PRESENTATION_PDF, then the invoking Python environment's WeasyPrint module, then PATH. doctor prints the selected command and availability; export-pdf requires version70.0. Use the same --converter path for doctor and export-pdf when using a standalone distribution. Installing the Python package alone may not install its native Pango libraries. An available HTML renderer is not a complete PDF-capable environment.

## Use
Ask “발표자료 만들어줘” or explicitly invoke achmage-presentation. General automatic selection depends on the host; the package does not edit your global instructions. Six member roles are bundled privately behind the one entrypoint; existing independently installed members remain unchanged.
Read SKILL.md. Run scripts/presentation.py doctor before production. Examples are source JSON, not a promise that every new dense deck fits automatically.

## Contents and limits
Approved engine + complete corpus, argument templates, scoped Hallym guidance, Impeccable references, UX database and renderer audit resources. Historical member instructions are scoped by references/orchestration.md; they cannot switch this renderer or erase its minimal footer.
No editable PPTX promise, university logo, invented affiliation, private MCP/runtime state, or original39 sample redistribution. Hallym-inspired colors are not official university endorsement.
See THIRD_PARTY_NOTICES.md and bundle.lock.json for origins, versions, exclusions and file integrity. See VALIDATION.md for actual tested environments; untested clients/devices are not reported as passed.

The Hallym member is newly authored scoped integration guidance. It preserves the approved brand and interaction contract through the bundled engine; the unlicensed external instructions,72-template development compiler and original samples are excluded.

For Achmage OS, integrations/achmage-os-entry.md is an adapter source: install it as the master entry and keep the entire unchanged bundle in a sibling bundle/ folder. OS aliases/tags belong to the adapter so they cannot invalidate the portable package lock.
