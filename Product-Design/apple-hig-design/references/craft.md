# Craft pass: from correct to finished

Rule checks make an artifact correct; they do not make it look finished. In trials, artifacts that passed every check still looked plainer than ones made without the skill: content huddled at the top of a canvas, headlines no bigger than body text allowed, every decoration stripped in the name of simplicity. The HIG asks for more than that: deliberate decisions that aim for striking visuals, refined through prototypes and real-world testing `design-principles/craft/quality-sets-the-tone` `design-principles/craft/experiment-and-iterate`. Run this pass after the build passes its checks and before you deliver.

## 1. Name the feeling

Pick one or two words for what people should feel (calm, quick, confident, playful) and say which visual means will carry it: type contrast, color restraint or warmth, spacing rhythm, materials, motion `design-principles/delight/identify-the-emotion-you-want-to`. Delight serves the task, never decoration for its own sake `design-principles/delight/dont-mistake-delight-for-decoration`.

## 2. Look at it at real size

Render every screen or canvas at its real size (preview server, screenshots at the target widths, 1080 px card or 1920 px stage) and look at it as a whole before looking at details.

## 3. Make two or three variants of the decision that shapes the look most

Choose the single decision with the most visual weight (usually the main headline treatment, the composition of the first screen or card, density, or how the accent color is used). Build two or three variants that differ only in that decision, each argued from the feeling and the hierarchy. Put them side by side at real size, pick one, and write why in the build note. Do not vary things at random.

## 4. Finish list

| Check | What finished looks like | IDs |
| --- | --- | --- |
| One focal point | Each screen or canvas has one clear first thing, and it is the intended one (visual-order method in `lenses.md`). | `design-principles/simplicity/establish-hierarchy`, `layout/visual-hierarchy/order-content-by-relative-importance` |
| Real hierarchy | Levels differ in size, weight and color together; neighboring levels are not near-identical. | `typography/conveying-hierarchy/adjust-font-weight-size-and-color` |
| Display headline [House] | On fixed canvases, title cards and landing heroes, one headline may grow beyond the largest text style of the scale in use, up to twice its size; everything else stays on the scale. | `typography/ensuring-legibility/use-font-sizes-that-most-people` |
| Whole canvas [House] | On fixed canvases (card news, title cards), the content block is placed deliberately: centered or anchored to top and bottom. No more than about a third of the canvas is left unused by accident. | `layout/visual-hierarchy/group-related-items-to-clearly-express` |
| Rhythm | One alignment edge per column; spacing from the 4 px scale, smaller inside groups than between them. | `layout/visual-hierarchy/align-elements-to-make-them-easier`, `layout/visual-hierarchy/group-related-items-to-clearly-express` |
| Words | Headlines state the point, not the topic; the most important information comes first; every word earns its place. | `writing/best-practices/consider-each-screens-purpose`, `design-principles/simplicity/be-concise` |
| Color restraint | One accent, used for primary actions and state, not spread over every control. | `branding/best-practices/apply-your-apps-accent-color-judiciously` |
| Details | Corner radii nest concentrically; icon weight matches the text next to it; Korean lines break between words; nothing is cut off or crowded. | `toolbars/best-practices/prefer-using-standard-components-in-a`, `icons/best-practices/in-general-match-the-weights-of` |
| Motion | Only where it carries attention or shows a result; short; off with Reduce Motion. | `motion/best-practices/add-motion-purposefully-supporting-the-experience` |

## 5. Record

Add a "Craft pass" section to `build-rationale-note.md`: the feeling, the variants compared (screenshots or short descriptions), the one chosen and why, and what you changed from the finish list.
