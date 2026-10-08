# CLI

## Verified cache cleanup

`cache-plan RUN_ROOT --out PLAN.json` inventories only complete, runtime-owned hybrid-cache files. Finals, source assets, metadata and unowned files are protected. `cache-prune PLAN.json` is a dry run; `--apply` deletes unchanged listed files. Active leases, replaced identities, stale manifests and modified bytes are rejected. Preserve the latest revision-trial cache when selecting older runs. Store plans and removal reports outside the cleaned cache.

## Live-action contact timing

`source-action-audit PROJECT --out REPORT.json` checks optional video-layer `source_action`: version `source-action-v1`, source_sha256, evidence, before/contact/after in source seconds, landing_frame in shot-local output frames, optional entity_id. Preparation and result must fit the shot. Contact maps through source_in/speed to the exact output frame. This verifies timing metadata, not recognition of visible actions or vehicle identity.

## Music event review and corrections

Create a new review folder with `rhythm-review PROJECT --movie HTTPS_MP4 --analysis ANALYSIS_JSON --out NEW_FOLDER`. Open its index.html, compare music and image, adjust source_seconds, and export corrected-events.json. No file is uploaded when selecting a local comparison movie.

Apply it with `rhythm-compile PROJECT --events corrected-events.json --out NEW_PROJECT`. The target must be a new sibling file. Re-run rhythm-audit and visual/listening review after correction. The exact prior event/clock fingerprint is required.
설치 폴더의 scripts/motion.mjs를 절대 경로로 호출하면 작업 폴더 위치에 의존하지 않습니다.
```sh
node scripts/motion.mjs doctor
node scripts/motion.mjs catalog morph --limit 12
node scripts/motion.mjs catalog --site --out catalog-preview
node scripts/motion.mjs validate project.json
node scripts/motion.mjs plan project.json --out work
node scripts/motion.mjs direction-review project.json --out work/intent-review
node scripts/motion.mjs direction-review project.json --movie final.mp4 --out work/review-v1
node scripts/motion.mjs pacing-review project.json --window-seconds 15 --out work/pacing
node scripts/motion.mjs styleframe project.json --time 2 --out work
node scripts/motion.mjs approve project.json --by <actual-reviewer> --note <actual-confirmation> --expected-hash <plan-hash>
node scripts/motion.mjs render project.json --draft --out work
node scripts/motion.mjs audio project.json --out work/audio
node scripts/motion.mjs soundbed ambience-spec.json --out work/assets --name river.wav
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

Recorded representative selection: `audition-choice-audit project.json --choice local-choice.json --out choice-audit.json`. Validates song/project scope, exact reference movie hashes and applied frame offsets. User choice records stay local; the command does not approve whole-film musical boundaries or actual listening.

In 3.1, `roughcut project.json --out work` renders the complete timeline at720p. A completed identical run is reused after validating the final film and all five WAV hashes. A changed project uses a new output identity; prior verified outputs are preserved.

`soundbed` accepts `{"kind":"river","duration":24,"seed":79,"gain_db":-8}`. Kinds are river, wind, street and room. This is deterministic procedural ambience, not a field recording. Output is streamed stereo48kHzPCM and includes a source/hash receipt. Register it as an audio asset with that provenance before using it. Durations are bounded to600seconds. An existing matching receipt is reused; unrelated files and previous different outputs are preserved.


Skia CPU frames: install requirements-skia.txt in a dedicated Python environment, then setup.mjs --ffmpeg-dir <bin> --python <python> [--skia-path <site-packages>]. Set profile.rasterizer to skia on a vector-composite project. SVG/text layers are supported. The same CLI render/snapshot/cache/audio pipeline is used.

Word/voice clock: sync-compile source.project.json --out compiled.project.json (same directory, new file); sync-audit compiled.project.json [--movie final.mp4] --out review. See references/word-sync.md.

Instrumental clock: rhythm-analyze project.json --out new-analysis; rhythm-compile source.project.json --out new-compiled.project.json; rhythm-audit new-compiled.project.json [--movie final.mp4] --out review. See references/rhythm-direction.md. Candidate pulse/onset detection requires NumPy and FFmpeg, no voice/API. Sustained narrative holds and explicit event bindings coexist.

Analysis also preserves separate fine_transients; low-confidence or silent windows retain coarse evidence. rhythm-audit includes a descriptive text_landings inventory. Neither automatically certifies audible beat alignment.

For an independent encoder-clock witness, decode the final audio to48kHzPCM16 using FFmpeg, then run: python scripts/audio_clock_audit.py mix.wav decoded.wav --windows 15,80,140 --out new-clock-report.json. Choose actual nonperiodic music windows within the film. The script rejects ambiguous tonal windows, silent windows and measurable offsets; it does not replace listening. Compare isolated ending sounds by their onset envelope against preceding silence.
# Audio-only revision after intermediate cache eviction

`node scripts/motion.mjs remix revised.project.json --from prior-completed-run --out new-remix-folder`

For homogeneous hybrid-composite projects, `remix` verifies the completed final hash, project receipt, unchanged picture inputs, source files, exact renderer version and encoded frame count. It copies the encoded video stream and rebuilds the audio. The output must be a new directory. It refuses picture or runtime changes; use normal render for those revisions. This keeps long-film audio revisions independent of bounded intermediate cache retention. The resulting receipt records zero rendered picture frames and the identical video bitstream hash. Listening remains a separate review.
