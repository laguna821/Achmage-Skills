# Hybrid production in 3.1

Use schema_version `3.1.0`, renderer `hybrid-composite`, jobs=1, gpu=false. Keep 3.0 projects on their original schema and engine. Never overwrite them to migrate.

## Plan before selecting clips

For every scene record the medium choice, shooting conditions, selected good range, text-safe space, subject carried into the next cut and sound role. A clip's search tags do not prove a place. Inspect first/middle/last frames and motion, compare identifiable geography with primary sources, and record accepted/rejected candidates with reasons. Preserve source URL, author, license URL, access date, file hash and permission for editing/publication. Track raw redistribution separately. Missing footage requires a redesigned scene; do not relabel footage from another country.

Local files and normal permitted provider downloads are sufficient. Provider search integrations are replaceable. No provider API key or paid AI service is required. Generated artwork is optional; it is not a fallback that silently changes the agreed medium.

## Source and composition contract

## Motion intent and visual revision

Separate object action, typography rhythm, camera movement and cut transition when diagnosing a request for more energy. Do not add continuous zoom/pan or handheld-like oscillation to every scene. Preserve approved type beats, framing and cut lengths unless the user asks to replace them. Prefer a matched subject, contour, direction or velocity across the cut; write its outgoing and incoming coordinates in the scene plan. Use a whole-composition camera only when it has a specific subject and endpoint, with steady intervals for contrast. Compare the revised bridge against the retained baseline at the same times. Record a rejected experiment separately from an implementation failure; do not propagate its style as the package default.

## Source and composition fields

`assets inspect FILE` reports video-stream duration, frame/time bases, rotation, SAR, color, audio and SHA256. `assets import FILE --id ID --receipt rights.json --out asset.json` preserves a receipt. `assets select asset.json --start SEC --duration SEC --out selection.json` extracts first/middle/last candidates; observation and selection rationale remain an explicit review.

A video layer specifies `id`, `kind:video`, `asset_id`, `source_in`, `rect:[x,y,width,height]`, optional `speed`, `crop:[x,y,w,h]` in normalized source coordinates, `fit:cover|contain`, static `mask`, and `sound:mute|source`. It occupies the scene plus the following transition handle. Bounds include that handle. Rect, crop and mask share the composition transform. Unsupported arbitrary video transforms are rejected. Portrait composition must be deliberately authored.

Graphics are straight-alpha PNG/RGBA/FFV1 tracks composited in authored layer order. Selected source frames are computed from the original trim origin at output30fps. Single-frame seeks use that same resampling origin. SDR BT.709 is the output; HDR input is rejected until explicitly normalized and reviewed. Capture and encoding proceed sequentially. Source video, graphics, composition, assembly and audio have separate receipts and caches. Changes in an implementation invalidate its dependent cache.

Scene `renderer` and `rasterizer` override the project settings. A renderer declaration is a capability claim: inspect its supported fields before authoring. SVG/Chromium is the common path; optional Skia supports its documented subset. Mixed engine snapshot parity and regression must be verified before a release claims them.

## Four audio buses and ending

Music, SFX, ambience and voice are separate WAVs. No source soundtrack is invented when a clip contains no audio. Illustrative synthesized sounds are labeled as such. Registered audio clips may use any of the four buses. In 3.1 use voice clips; the legacy narration shortcut is rejected so voice cannot bypass ending gates. Sound-source selection follows the effective portrait or landscape composition.

Apply envelopes after recorded and synthetic material and their tails are mixed. `event-ending-v2` binds an actual layer event to music_stop, quiet_time, title_time, title cues and tail_silence. Preserve v1 automotive tests. Inspect actual delivered PCM and final AAC, not only synthesis statistics. Compare three fresh music candidates on identical representative pictures. Whole listening and aesthetic judgement remain separate from signal measurements.

## Production and evidence

For a long film, compose the entire timeline with selected source ranges before final rendering. Vary framing and scene scale: an insert, an object's close detail, an environment and typographic action have different roles. Do not repeat a centered object under a heading across consecutive sequences. Review visual claims literally: a scene about hands must show the acting hand; a geographic connection must use verified geometry; diagram values must state their basis.

Review action claims at before/contact/after frames. A moving knife over an unchanged object does not demonstrate cutting; a hand approaching a fixed bowl does not demonstrate passing it. Animate the changed object and the receiving contact together. A sequence diagram must activate states in the intended order. An adapter from the right family can still be the wrong choice: a mouse cursor belongs on a software control, not a physical card tap. Use technique counts only after these semantic checks.

Procedural `soundbed` creates bounded, deterministic river/wind/street/room textures. Preserve the generated receipt and label these as authored ambience, never a recording of the depicted place. Add discrete contact, step and mechanism cues to actual event times. Five delivered WAVs are music, SFX, ambience, voice and mix.

The final mix is gated again after mastering at sample boundaries for deliberate pauses and final silence. Limiter latency is compensated. Check both the pause and title cue; silencing the whole ending is not a valid fix. Exact boundary comparisons tolerate arithmetic roundoff, not an extra audible frame.

Completed hybrid runs verify the final MP4 and all five stems before returning reuse. Cache HTML and project sidecars are temporary; cache receipts count toward retention. Retention budgets are applied at start/finish, not a guarantee of maximum in-flight disk use. A free-space floor and bounded child processes protect active rendering. Preserve previous output and use a new revision directory for new snapshots.

Completed-run runtime identity includes automotive audio synthesis as well as the general audio buses. An engine or tire synthesizer implementation change must invalidate the early completed-run shortcut before it can return an older MP4. Project music/volume-only changes still leave graphics keys unchanged; implementation version changes conservatively invalidate the runtime.

Input → object/action plan → styleframes and music comparison → direction confirmation → representative cut review → complete roughcut → detailed film → seven requested output routes → independent transfer test → clean installation → publication.

`roughcut` uses the same renderer and cache as `render`, at draft resolution. It requires production authorization bound to the current project. Authorization for a requested benchmark is not aesthetic acceptance. Record pending listening and user reviews honestly. Recheck old/source-selected frames after edits and preserve earlier approved output. Never label current-PC CPU tests as physical16GB notebook measurements.

## Browser delivery gate

Encode the assembled cuts into one continuous H.264 delivery stream. Independently encoded segments can differ in parameter sets even when dimensions, duration and FFmpeg decode checks pass; do not replace the final assembly encode with stream-copy concatenation as an optimization without native-browser regression evidence.

Test the published file, not just the local file: play from the beginning across every cut to `ended`, then seek to a middle and late cut. Verify HTTP Range returns `206` with a correct `Content-Range` for full-length media. A static server that returns the whole file with `200` is not Range-capable. A bounded Blob loader may be used for short review clips only; it does not satisfy the full-film delivery contract. Record browser, URL, source hash, duration and observed playback outcome. A contact sheet, ffprobe duration, or successful software decode does not substitute for this gate.
