# Music impacts inside a story

Use this workflow for instrumental films, beat-led edits and optional word-led passages. Voice is not a dependency. Do not generate robotic speech merely to obtain timestamps.

## Order of decisions

1. Write the question, action and consequence for each **sequence**. A sequence can sustain one thought across many short shots. A renderer scene is usually one shot; it is not automatically an entire narrative sequence.
2. Co-design each sequence with its musical phrase. List its shot roles: preparation, contact, transfer, response, scale change and consequence. Decide the subject, viewpoint and outgoing/incoming connection for every shot. Sustained storytelling is continuity of meaning, not default long shot duration.
3. When rhythmic editing is requested, provide recurring runs of clearly music-locked cuts and object actions throughout the relevant phrases. Use 2/4-beat shots and selective shorter fills as starting hypotheses, contrasted with 8-beat shots or a justified pause. Choose against the actual track and reference; these are not universal duration limits. A constant grid alone does not prove a heard drum or accent.
4. Use rhythm_score.holds only when an uninterrupted image actually matters: a particular process, required reading or a deliberate pause. It protects that one shot technically. It must not protect the whole sequence from internal cuts. Long-shot percentages are descriptive, never a success target.
5. Make a continuous 24–32 second editorial proof before another full render after a pacing rejection. Include multiple genuinely different subject/viewpoint states, a complete phrase, a handoff into the next phrase and visible music-locked events. A montage of the best isolated frames cannot pass it. Splitting the same source, changing copy, adding global shake or increasing cut count alone cannot repair weak coverage.
6. Review muted for causal continuity, then with music for perceived impacts, flow and fatigue. Inspect reference passages and record observed boundaries/action landings separately from inferences. Technical reports cannot pass these perceptual gates. If listening has not happened, leave the heard-anchor and groove gates pending.

## Coverage before duration

Maintain a sequence → shot → action map. For each shot, record: what changes from the preceding image; the new camera distance/viewpoint or visual information; the source interval or new graphic required; the target music event; and the object, direction, shape or sound passed forward. Record unavailable coverage as a sourcing/art task. Do not lengthen a few convenient clips merely to fill a long runtime. A reprise can be intentional, but label why it changes meaning.

For example, a 12-second power-transfer sequence can pass from shoe pressure to pedal, tooth contact, chain travel, rear sprocket, tire contact and road motion. These are shot roles, not a claim that stock footage has been found or that every cut should land on the same metrical subdivision.

After a user rejects the edit, retain its technical evidence but label the work product-rejected. Reconsider coverage and phrase construction before adding more validators. Do not promote it as a quality baseline or represent all remaining review as merely pending.

## Public commands

rhythm-review PROJECT --movie HTTPS_MP4 --analysis ANALYSIS_JSON --out NEW_FOLDER creates a browser-local event editor. The supplied movie must represent the project's output clock. It supports frame stepping, looping, waveform/source-energy comparison and event correction export. It never marks all events listening-corrected automatically. A local MP4 file can be selected in the page without uploading it.

rhythm-compile PROJECT --events corrected-events.json --out NEW_PROJECT verifies the exact original score/music clock identity and rebuilds owned targets. Wrong songs, stale score revisions, trims, duplicated events and unsupported listening assertions are rejected. Retain the original project, output and approval; the new project has no approval.

Optional editorial_plan.sequences groups actual shot_ids in contiguous timeline order. Every actual shot must appear exactly once. Each group states question, consequence and musical_role. This checks membership, not narrative quality. Legacy projects without groups remain supported.

The frequency-band analysis reports low (35–180Hz), mid (180–2000Hz) and high (2000–10000Hz) onset candidates and a two-second density series. These ranges do not identify instruments. A high-band transient is not automatically a snare/hi-hat, and density is not automatic chorus detection.

rhythm-analyze PROJECT --out NEW_FOLDER extracts the first registered music clip with FFmpeg and analyzes it with NumPy spectral flux. It keeps the original source clock and separates the authored volume envelope from source changes. BPM, phase and onsets are candidates, not verified kick/snare, chorus or first-bar labels.

rhythm-compile SCORE_PROJECT --out NEW_PROJECT materializes music-impact-v1 bindings into an ordinary3.1 project. Keep output beside input to preserve relative paths. The original and previous approval are preserved; the new project needs a production-scope approval record.

rhythm-audit PROJECT --movie FINAL_MP4 --out NEW_FOLDER checks bindings and extracts exact decoded frames around selected impacts. Rendering a report does not imply listening approval.

pacing-review PROJECT --out NEW_FOLDER [--window-seconds 15] reports shot duration distribution, time spent in longer shots, local cut density, explicit cut bindings, music-evidence methods and repeated source ranges. It does not issue an aesthetic pass/fail. Unbound cuts may still coincide with music; estimated-grid bindings do not establish heard-onset accuracy. Source hashes join aliases, and shot count is kept separate from unique source intervals.

## Clock and ownership

Each event references original source_seconds and the source asset SHA256. Output frame = round((clip.start + (source_seconds - clip.source_in) / clip.speed) *30). Never repeatedly add a rounded beat length.

Targets: cut boundary (also adjusts preceding shot end), editable vector layer, common hybrid camera, or a video source action. Layer/camera targets declare before/after poses and preparation/hold frames. A source action names the original video's hash and contact time. The compiler refuses conflicting target ownership and unowned authored animation. Optional word-impact scores cannot own the same layer as an instrumental binding.

Explicit holds are promises about the same shot remaining on screen. Moving a cut through one is an error. Their existence does not prove the shot contains useful storytelling. Check the action and meaning separately.

v1 binds landscape compositions. Author a separate portrait project; do not silently reuse landscape coordinates. Supported transform properties are listed in lib/rhythm-score.mjs. This version uses constant video speed; no optical flow or variable retiming is implied.

Music gain changes do not invalidate graphic timing. Source trims, speeds, hashes and selected events do. A changed musical event requires recomputation and visual re-review, even if the audio samples themselves are unchanged.

## Counterexamples

- Technical mutation test: keep the declared intended target fixed and move rendered landings by ±1/2/4frames. Reject deviations from that contract and retain an unchanged positive case. This tests execution, not whether the original musical anchor was right.
- Perceptual audition: keep music fixed and present picture offsets with neutral labels. No option is a known aesthetic failure before listening. If an offset is preferred, record the exact files, interval, output device and observation, then revise the intended target. A reviewed nonzero target must pass exact execution; deviations from that revised target must fail. Do not accept every offset by widening an error tolerance.
- Replace a sustained image with beat-by-beat cuts. Its protected hold must fail, even when every new cut lands perfectly.
- Conversely, an edit dominated by holds must not be reported as good rhythmic direction merely because it passes hold validation. Report its actual duration distribution.
- Split one source into many shots or swap words over the same composition. Count the cuts but keep repeated coverage visible; no automatic variety or narrative pass.
- Change source trim, speed, contact time or source hash.
- Re-render selected frames in reverse/shuffled order.
- Test copy-only, event-only, source-only and gain-only revisions and preserve prior outputs.
- Inspect short-shot minimums and reading windows independently of rhythm precision.

## Editable transmission and bicycle sound

lib/mechanism.mjs returns ordinary SVG layers with a transmission-v1 receipt. One pitch-distance controls chain dash offset, front/rear angular displacement and optional wheel. Front/rear radii and centers are explicit. This is illustrative single-ratio mechanics, not measured bicycle data or a full gear-shift/freewheel simulation. Chromium time/scroll/still share one calculation. Skia currently rejects animated dash_offset.

New pedal-click, ratchet and tire-roll cues are deterministic authored sound design, not recordings. Keep them below musical drum accents, listen for synthetic harshness, and never infer naturalness from finite-sample checks.

Cut targets may declare phase: arrival. The incoming transition starts its duration before the event and completes on the selected impact frame. Default start preserves old projects. An arrival target requires an actual whole-frame transition; its settings enter the score signature. Recheck shot intent local times, source handles and neighboring cuts after compiling.

## Attack evidence and visible landing

Coarse spectral-flux peaks are not exact drum labels. Analysis now also emits bounded fine high-frequency transient candidates (256-sample window, 32-sample hop) separately, retaining coarse timestamps and low-confidence fallbacks. A raw PCM energy maximum can lock to a waveform cycle or window edge; do not automatically use it as an onset correction. Synthetic known-attack fixtures verify timing and silence rejection, not human groove.

An on-beat cut may contain a word that finishes easing 120–160ms later. Decide which event carries the accent: cut start, transition arrival, word pose or physical contact. For immediate accent words, show the intended pose at the cut; otherwise bind preparation and landing to an explicit layer event. Do not remove slow intentional movement from quiet sections.

The rhythm-audit text_landings inventory exposes each cut-bound text layer's first authored pose and its frame offset. It is descriptive, since the first keyframe is not universally the perceived landing. Inspect decoded frames around intended impacts and compare unchanged audio against picture-only ±1/2/4-frame controls. Also compare decoded AAC against PCM in early, middle and late windows; metadata and intended event numbers alone cannot prove encoded audiovisual alignment.
