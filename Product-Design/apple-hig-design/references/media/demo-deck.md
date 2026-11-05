# Medium: Demo deck (a presentation that is also a live product demo)

In this skill, HTML slides mean a demo deck: the real product (a web page, or a mobile web page in a phone frame) fills the stage, and each slide dims the product, spotlights one element and explains it in a callout. The presenter moves at their own pace, can stop on any step, and can hand the product over for live use at any moment. It replaces screen-recorded demo videos, which cannot pause on a point, zoom into a control or let people try. General lecture slides are out of scope [House].

**Baseline:** the product keeps its own platform rules (iOS for a phone frame, the web or macOS for a desktop frame). Text the audience reads from a distance follows the tvOS reference adopted for slides (house decision 4). Callouts follow the HIG's guidance for tips and popovers.

Engine and template: `assets/demo-deck/` (`deck.css`, `deck.js`, `index.html`). Worked examples: a desktop web product and a phone product, each eight to ten steps.

## Anatomy

| Layer | What it is | Main rules |
| --- | --- | --- |
| Product | The real page in a same-origin iframe, inside a generic desktop window or phone frame; or a screenshot | The product's own platform rules |
| Dimming and spotlight | Everything except the target is dimmed; the target keeps its real look inside a ring | [House] dim 58%, ring in system blue |
| Callout | A popover tip with an arrow at the target: eyebrow, title, one or two sentences, optional hint | Tips and popovers, below |
| Title card | A step with no target: large text over the dimmed product | tvOS Title 1 and Subtitle 1 sizes |
| Live step | No dimming; the product is fully usable | Teach through interactivity |
| Page control | Dots centered at the bottom; a count such as 7 / 14 beyond ten steps | Page controls |

## How the deck behaves

- **Every press counts, in order.** A key press or a click on the dimmed area changes the wanted step at once (the page control updates immediately); one runner then brings the product to that step, running each step's actions once and in order.
- **Going back never blanks the screen.** When an earlier state is needed, the deck rebuilds it in a hidden second frame and swaps it in when ready.
- **Clicking the spotlighted control moves on.** If the next step scripts the same click (its first `do` action), the presenter's own click counts as that action and the deck shows the result step at once. Clicking it when nothing is scripted switches to live mode so people see the product respond.
- **Live use is temporary.** Changes made in live mode or on a live step are undone when the presenter leaves live mode (L) or moves to another step, so the script stays reliable. R rebuilds the current step on demand.
- **Timing follows the product.** After actions, the deck waits only until the target exists and stops moving (up to `settle` ms), then moves the spotlight.

## Applies as written [HIG]

| Topic | Rule | IDs |
| --- | --- | --- |
| Callout type | A popover tip points at one specific element, keeping the flow of what is on screen. | `offering-help/creating-tips/use-the-most-appropriate-tip-type` |
| What a step covers | Use tips for features that are simple to describe in a few steps; split anything bigger into several steps. | `offering-help/creating-tips/use-tips-for-simple-features` |
| Wording | One or two direct sentences on what the feature does and how to use it, with no promotional language. | `offering-help/creating-tips/make-tips-short-actionable-and-engaging`, `writing/getting-started/be-clear` |
| Do not explain the obvious | Skip standard components; explain what a control does in this product. | `offering-help/best-practices/avoid-bloating-your-help-content-by` |
| Place it near the thing | Put each explanation next to the area it describes, not in a separate tour page. | `onboarding/best-practices/consider-providing-a-collection-of-context` |
| Arrow and position | Aim the arrow at the target and never cover the target or the content it explains. | `popovers/best-practices/position-popovers-appropriately` |
| One at a time | Show a single callout; close it before the next. | `popovers/best-practices/show-one-popover-at-a-time` |
| Size | Just big enough for its text and its arrow. | `popovers/best-practices/avoid-making-a-popover-too-big` |
| Let people try | Include a live step where the audience or presenter uses the product. | `onboarding/best-practices/teach-through-interactivity` |
| Motion | Move the spotlight and camera only to carry attention to the next target, keep it short, never make people wait for it, and honor Reduce Motion. | `motion/best-practices/add-motion-purposefully-supporting-the-experience`, `motion/providing-feedback/aim-for-brevity-and-precision-in`, `motion/providing-feedback/let-people-cancel-motion`, `accessibility/cognitive/be-cautious-with-fast-moving-and` |
| Page control | Dots for an ordered sequence, centered near the bottom; beyond about ten, show a count instead. | `page-controls/best-practices/use-page-controls-to-represent-movement`, `page-controls/best-practices/center-a-page-control-at-the`, `page-controls/best-practices/although-page-controls-can-handle-any` |
| Order | Follow the order of the task people perform, most important first. | `writing/best-practices/consider-each-screens-purpose`, `layout/visual-hierarchy/order-content-by-relative-importance` |
| Color | The spotlight ring is never the only cue: dimming and the callout arrow carry the same meaning. | `accessibility/vision/convey-information-with-more-than-color` |
| Craft | Rehearse every step at full size and refine until each one looks deliberate. | `design-principles/craft/quality-sets-the-tone`, `design-principles/craft/experiment-and-iterate` |

## Translate [HIG transfer]

- **Text read from a distance:** stage 1920x1080 with the tvOS safe area (60 top and bottom, 80 at the sides). Callout title Headline 38, body Body 29, eyebrow and hint Caption 1 25; title cards Title 1 76 with Subtitle 1 38. Nothing below 23. `typography/ensuring-legibility/use-font-sizes-that-most-people`, `layout/platform-considerations/tvos/adhere-to-the-screens-safe-area`
- **Small interface:** a desktop product shown whole on a 1920 stage keeps its text near its real size, which is small from the back of a room. Zoom the camera (1.3 to 2) toward the target so the spotlighted control reads at least at about 23 px on the stage. The tvOS way of showing focus is a change of scale with a little motion, not color alone. `color/platform-considerations/tvos/avoid-using-only-color-to-indicate`
- **Emotion:** decide what the audience should feel at the end (relief, speed, confidence) and pick the steps that show it. `design-principles/delight/identify-the-emotion-you-want-to`, `design-principles/delight/create-defining-moments`

## House decisions here [House]

- **Dimming 58%** around the spotlight. The HIG gives no figure for this; its only dimming figure is 35% under clear Liquid Glass on bright content `materials/liquid-glass/only-use-clear-liquid-glass-for`, which is too weak to hold attention on a projector.
- **Ring:** 3 px in system blue (dark #0091FF, light #0088FF), plus the dimming.
- **Callout:** 640 px wide, 28 px corners, a nearly opaque elevated background instead of a see-through glass, so text stays legible on a projector `materials/standard-materials/help-ensure-legibility-by-using-vibrant`. Colors: dark theme white on #2C2C2E with secondary #AEAEB2 (6.3:1) and accent #5CB8FF (6.4:1); light theme black on white with #6C6C70 and #1E6EF4.
- **Frames:** generic window and phone outlines drawn in CSS, never Apple device artwork.
- **Themes:** dark for dim rooms (default), light for bright rooms.
- Pretendard Variable for all text; Lucide for the hint and live icons.

## Writing the steps

1. **Story first.** Write the value in one sentence for the opening title card, then list what the audience must see to believe it. `design-principles/purpose/create-value`
2. **One idea per step.** Title is the point in a few words; body says what it does and how to use it. Six to twelve steps.
3. **Show results, not only controls.** After a control step, add a step that performs the action (`do`) and spotlights the result, such as an undo notice or an opened sheet.
4. **One live step** where trying it helps most, usually near the end; then a closing title card.
5. **Number features, not steps:** the eyebrow names the feature (for example `2 · 검색`); the page control already counts steps.

## Building

1. Copy `assets/demo-deck/` next to the product so both are served from one origin: `node scripts/preview.mjs <common parent>`.
2. Set `product` (device, src or image, width, height) and write `steps`. Press P in the deck and click an element to copy its selector; for a screenshot product, drag a rectangle to copy `[x, y, width, height]`.
3. Use `do` actions to bring the product into the state a step needs (click, type, scroll, focus), with `settle` as the longest wait for the product's own animations. When a step invites a click (`hint`), script that same click as the first action of the next step, so the presenter's click and the arrow key lead to the same result. Hidden-on-hover controls need a `focus` action first. Set `resetStorage: true` if the product saves state, so going back replays cleanly.
4. Step through every step at 1920x1080 and fix any step where the callout covers its target, the target is not found (the deck shows a notice), or the spotlighted text is too small (zoom in).
5. Lessons from trials:
   - **Hint targets are one control.** Spotlight the button itself, not the row or sheet around it; only a click on the scripted control moves the deck on.
   - **Select by meaning, not position.** When product data can change order (sample data, sorting), target items by a stable attribute, for example `li:has([aria-label="'우체국 가기' 완료"])`, `data-*` attributes or IDs, not `:nth-of-type`.
   - **Zoom small targets only.** Zooming a full-width target (tab bar, sheet, banner) crops it; leave those at zoom 1.
   - **Products that save on unload are fine.** The engine unloads the old page before clearing storage, so a product's beforeunload save cannot leak an old state into a replay.
5. Audit the product itself with `scripts/audit-page.js`; the deck's own colors are checked above.

## Ask the user first [HIG none]

- Room and screen: projector or large display, lit or dark room (theme), any aspect ratio other than 16:9.
- Product source: a local front end, a deployed site (cross-origin pages cannot be spotlighted by selector; use screenshots with rectangles), or screenshots.
- Who drives: presenter only, or will the audience use the live step.
- Length and language; whether step numbers should show.

## Before you deliver

- [ ] Every target found and spotlighted; no callout covers its target.
- [ ] Each callout is one or two sentences, no promotional wording.
- [ ] Spotlighted interface reads from the back: zoom where the product text is small.
- [ ] Keyboard: arrows, Space, PageDown and PageUp work; L enters and leaves live mode; R resets a step.
- [ ] Going backward replays cleanly (state-changing steps use `do`, storage reset if needed).
- [ ] Reduce Motion turns movement into simple fades.
- [ ] Opening and closing title cards; one live step.
