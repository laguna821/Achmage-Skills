# Music impacts inside a story

Use this workflow for instrumental films, beat-led edits and optional word-led passages. Voice is not a dependency. Do not generate robotic speech merely to obtain timestamps.

## Order of decisions

1. Write the viewer's question, visible action and resulting change for each narrative movement.
2. Decide where an image must remain: observing a process, reading a message, feeling distance, or receiving a consequence. Declare those exact windows in rhythm_score.holds before cutting.
3. Select music events that serve the changes. One musical hit may complete a crank rotation, light a line, land a word, or end a camera move without creating another shot.
4. Use a short regular 2/4-beat passage when useful. Contrast it with sustained observation and deliberate stillness. Do not assign every drum hit to a new cut or default zoom.
5. Review the film muted for story and spatial continuity, then music-only, full mix and final encoding for timing, hierarchy and fatigue. Technical reports cannot pass these perceptual gates.

## Public commands

rhythm-analyze PROJECT --out NEW_FOLDER extracts the first registered music clip with FFmpeg and analyzes it with NumPy spectral flux. It keeps the original source clock and separates the authored volume envelope from source changes. BPM, phase and onsets are candidates, not verified kick/snare, chorus or first-bar labels.

rhythm-compile SCORE_PROJECT --out NEW_PROJECT materializes music-impact-v1 bindings into an ordinary3.1 project. Keep output beside input to preserve relative paths. The original and previous approval are preserved; the new project needs a production-scope approval record.

rhythm-audit PROJECT --movie FINAL_MP4 --out NEW_FOLDER checks bindings and extracts exact decoded frames around selected impacts. Rendering a report does not imply listening approval.

## Clock and ownership

Each event references original source_seconds and the source asset SHA256. Output frame = round((clip.start + (source_seconds - clip.source_in) / clip.speed) *30). Never repeatedly add a rounded beat length.

Targets: cut boundary (also adjusts preceding shot end), editable vector layer, common hybrid camera, or a video source action. Layer/camera targets declare before/after poses and preparation/hold frames. A source action names the original video's hash and contact time. The compiler refuses conflicting target ownership and unowned authored animation. Optional word-impact scores cannot own the same layer as an instrumental binding.

Explicit holds are promises about the same shot remaining on screen. Moving a cut through one is an error. Their existence does not prove the shot contains useful storytelling. Check the action and meaning separately.

v1 binds landscape compositions. Author a separate portrait project; do not silently reuse landscape coordinates. Supported transform properties are listed in lib/rhythm-score.mjs. This version uses constant video speed; no optical flow or variable retiming is implied.

Music gain changes do not invalidate graphic timing. Source trims, speeds, hashes and selected events do. A changed musical event requires recomputation and visual re-review, even if the audio samples themselves are unchanged.

## Counterexamples

- Keep music fixed; move visual landings by ±1/2/4frames. The actual compiled target must fail while the unchanged positive case passes.
- Replace a sustained image with beat-by-beat cuts. Its protected hold must fail, even when every new cut lands perfectly.
- Change source trim, speed, contact time or source hash.
- Re-render selected frames in reverse/shuffled order.
- Test copy-only, event-only, source-only and gain-only revisions and preserve prior outputs.
- Inspect short-shot minimums and reading windows independently of rhythm precision.

## Editable transmission and bicycle sound

lib/mechanism.mjs returns ordinary SVG layers with a transmission-v1 receipt. One pitch-distance controls chain dash offset, front/rear angular displacement and optional wheel. Front/rear radii and centers are explicit. This is illustrative single-ratio mechanics, not measured bicycle data or a full gear-shift/freewheel simulation. Chromium time/scroll/still share one calculation. Skia currently rejects animated dash_offset.

New pedal-click, ratchet and tire-roll cues are deterministic authored sound design, not recordings. Keep them below musical drum accents, listen for synthetic harshness, and never infer naturalness from finite-sample checks.
