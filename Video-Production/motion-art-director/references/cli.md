# CLI
설치 폴더의 scripts/motion.mjs를 절대 경로로 호출하면 작업 폴더 위치에 의존하지 않습니다.
```sh
node scripts/motion.mjs doctor
node scripts/motion.mjs catalog morph --limit 12
node scripts/motion.mjs catalog --site --out catalog-preview
node scripts/motion.mjs validate project.json
node scripts/motion.mjs plan project.json --out work
node scripts/motion.mjs styleframe project.json --time 2 --out work
node scripts/motion.mjs approve project.json --by <actual-reviewer> --note <actual-confirmation> --expected-hash <plan-hash>
node scripts/motion.mjs render project.json --draft --out work
node scripts/motion.mjs audio project.json --out work/audio
node scripts/motion.mjs render project.json --out work
node scripts/motion.mjs export project.json --routes promo,shorts --out work
node scripts/motion.mjs audit project.json --movie <final.mp4> --out work/audit
node scripts/motion.mjs revise project.json --id c0 --text <replacement> --out revised.json
node scripts/motion.mjs status project.json --out work
node scripts/motion.mjs resume project.json --out work
node scripts/motion.mjs serve work --port 0
```
status와 명령 기록은 출력 폴더에 저장합니다. resume은 승인된 렌더를 이어가며, 미승인 상태면 필요한 확인을 반환합니다.
Asset paths are project-relative, absolute local paths, or skill:assets/... for bundled assets. Legacy skill-relative paths remain readable. Examples contain no approvals.

setup.mjs --ffmpeg-dir <bin> writes an external host configuration. MOTION_CONFIG selects a project configuration file. Optional --playwright points at an existing Playwright module directory.
connect-presentation.mjs <public-bundle> <python> <pdf-converter> validates and pins the approved presentation package.
glyphs.py --text <word> --out <word.svg> creates CPU Skia outlines, with a JSON font hash receipt.
install.mjs --agent codex|claude [--dest <skills-directory>] copies the complete package and preserves existing installations.

Package publication is a separate user-authorized action. This CLI does not upload user projects.


Skia CPU frames: install requirements-skia.txt in a dedicated Python environment, then setup.mjs --ffmpeg-dir <bin> --python <python> [--skia-path <site-packages>]. Set profile.rasterizer to skia on a vector-composite project. SVG/text layers are supported. The same CLI render/snapshot/cache/audio pipeline is used.
