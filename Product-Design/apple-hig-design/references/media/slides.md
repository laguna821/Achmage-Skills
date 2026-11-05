# Medium: Slides

> In this skill, HTML slides are built as demo decks: see [demo-deck.md](demo-deck.md). This file keeps the distance-viewing rules (tvOS sizes, safe area, contrast) that demo deck text and title cards use.

**Baseline:** the HIG has no slide guidance. Start from the foundations (typography, color, layout, motion, writing, charting) as written, and use [tvOS](../platforms/tvos.md) as the distance-viewing reference, a house decision adopted on 2026-11-04 (see below).

Slides are HTML or presentation pages, often projected and read from across a room. Nothing in the HIG names slides, so every use below is either [HIG] for a medium-neutral foundation rule or [HIG transfer] with the translation stated.

## Applies as written [HIG]

**Color and contrast**
- Never let color alone separate objects or carry key information; add text labels or distinct shapes `color/inclusive-color/avoid-relying-solely-on-color-to` `accessibility/vision/convey-information-with-more-than-color`
- Avoid color pairs that are hard to tell apart or low in contrast `color/inclusive-color/avoid-using-colors-that-make-it`
- Keep each color's meaning constant, and do not style plain text like the color that marks interactive items `color/best-practices/avoid-using-the-same-color-to`
- Keep contrast at 4.5:1 or higher in every appearance and aim for 7:1 with custom colors, especially for small text `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`
- Check colors in bright and dim rooms, since a projector room is one of them `color/best-practices/test-your-apps-color-scheme-under`
- Check how colors read in other cultures `color/inclusive-color/consider-how-the-colors-you-use`
- If you ship light and dark versions, test both, including Increase Contrast `dark-mode/best-practices/test-your-content-to-make-sure`
- A dark-only look is acceptable in rare cases such as media viewing; a darkened room is the nearest case `dark-mode/best-practices/in-rare-cases-consider-using-only`

**Typography**
- Stay at or above each platform's recommended default and minimum sizes, custom fonts included `typography/ensuring-legibility/use-font-sizes-that-most-people` `accessibility/vision/use-recommended-defaults-for-custom-type`
- Avoid light weights: use Regular, Medium, Semibold or Bold `typography/ensuring-legibility/in-general-avoid-light-font-weights`
- Thin custom fonts need larger sizes `accessibility/vision/bear-in-mind-that-font-weight`
- Express hierarchy with weight, size and color, and keep distinctions intact at any size `typography/conveying-hierarchy/adjust-font-weight-size-and-color`
- Use as few typefaces as possible `typography/conveying-hierarchy/minimize-the-number-of-typefaces-you`
- Test legibility in each place the text will run, such as the actual room `typography/ensuring-legibility/test-legibility-in-different-contexts`

**Layout and hierarchy**
- Put key items toward the top and leading edge `layout/visual-hierarchy/order-content-by-relative-importance`
- Align for scanning, group related items with space or containers `layout/visual-hierarchy/align-elements-to-make-them-easier` `layout/visual-hierarchy/group-related-items-to-clearly-express`
- Scale background artwork to fill the screen without changing its aspect ratio `layout/adaptability/when-necessary-scale-background-artwork-in`
- Keep overlaid text clearly contrasting with the picture, with a shadow or backing layer if needed `image-views/content/take-care-when-overlaying-text-on`
- Display video at its original aspect ratio, with no baked-in letterbox bars `playing-video/best-practices/always-display-video-content-at-its`

**Motion**
- Animate only when it supports understanding, and never rely on motion alone for important information `motion/best-practices/add-motion-purposefully-supporting-the-experience` `motion/best-practices/make-motion-optional`
- Use fast or blinking animation sparingly `accessibility/cognitive/be-cautious-with-fast-moving-and`
- Do not make people wait through an animation before they can continue `motion/providing-feedback/let-people-cancel-motion`

**Writing**
- Use plain words, remove words that do no work, and avoid jargon `writing/getting-started/be-clear` `writing/getting-started/write-for-everyone`
- Put the most important information first on each screen, and split separate ideas across screens `writing/best-practices/consider-each-screens-purpose`
- Build recurring language patterns and apply capitalization consistently `writing/best-practices/build-language-patterns` `writing/best-practices/adopt-capitalization-rules-that-align-with`
- Keep brand secondary to content; repeat a logo only where it supplies context `branding/best-practices/ensure-branding-always-defers-to-content` `branding/best-practices/resist-the-temptation-to-display-your`
- Use accent color sparingly `branding/best-practices/apply-your-apps-accent-color-judiciously`

**Icons**
- Simple, recognizable, consistent in size, detail, stroke and perspective, weighted like nearby text `icons/best-practices/create-a-recognizable-highly-simplified-design` `icons/best-practices/maintain-visual-consistency-across-all-interface` `icons/best-practices/in-general-match-the-weights-of`
- Add padding so asymmetric icons look centered, and use vector files `icons/best-practices/if-necessary-add-padding-to-a` `icons/best-practices/if-you-create-a-custom-interface`
- Put text inside an icon only when essential `icons/best-practices/include-text-in-your-design-only`

**Charts** (see [Charts](../components/charts.md) for the component card)
- Pick the mark type by the question the data answers `charts/marks/choose-a-mark-type-based-on`
- State the takeaway as a short title and subtitle `charts/descriptive-content/summarize-the-main-message-of-your`
- Keep the data most prominent and axes and descriptions quiet `charts/best-practices/establish-a-consistent-visual-hierarchy-that`
- Back up color with shapes or patterns, and add small gaps between adjacent colored segments `charts/color/avoid-relying-solely-on-color-to` `charts/color/aid-comprehension-by-adding-visual-separation`
- Use fewer, lighter grid lines and familiar tick sequences `charts/axes/tailor-the-appearance-of-grid-lines` `charts/axes/prefer-familiar-sequences-of-values-in`
- Prefer common chart types; teach unfamiliar ones step by step `charting-data/designing-effective-charts/in-general-prefer-using-common-chart` `charting-data/designing-effective-charts/if-you-need-to-create-a`
- Keep multiple charts of one dataset consistent in type, color and layout `charting-data/designing-effective-charts/maintain-continuity-among-multiple-charts-that`

## Translate [HIG transfer]

| HIG element | Equivalent here | How | Rules |
| --- | --- | --- | --- |
| Purpose, focus, simplicity principles | Deck and slide purpose | Ask what the deck is for; keep only the few ideas that serve it; let secondary items recede | `design-principles/purpose/create-value` `design-principles/purpose/keep-focused` `design-principles/simplicity/include-just-whats-necessary` |
| Hierarchy and concision | One main message per slide | Establish hierarchy so viewers see what is first; use exactly the words needed | `design-principles/simplicity/establish-hierarchy` `design-principles/simplicity/be-concise` |
| Progressive disclosure | Builds, appendix | Show less first and reveal more in steps | `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts` |
| Charts: simple, on-demand detail | Slide chart | Keep the chart uncluttered; move extra detail to a follow-up slide, not hover | `charting-data/best-practices/keep-a-chart-simple-letting-people` `charting-data/best-practices/use-a-chart-when-you-want` |
| Chart size | Chart area | Size the chart for readable labels at viewing distance | `charting-data/designing-effective-charts/match-the-size-of-a-chart` |
| Chart descriptive text | Chart title and annotation | Headline plus annotations | `charting-data/designing-effective-charts/aid-comprehension-by-adding-descriptive-text` |
| Compact chart tips | Chart beside text | Shorten axis labels, move units to the title | `charts/best-practices/in-a-compact-environment-maximize-the` |
| Page controls | Slide progress indicator | Use for an ordered sequence only; avoid many dots (past about ten, use another layout) | `page-controls/best-practices/use-page-controls-to-represent-movement` `page-controls/best-practices/although-page-controls-can-handle-any` |
| Page control placement | Indicator position | Centered near the bottom | `page-controls/best-practices/center-a-page-control-at-the` |
| Scroll cues | Content continues | Show partial content at an edge, or overlap a little between pages | `scroll-views/best-practices/make-it-apparent-when-content-is` `scroll-views/best-practices/consider-supporting-page-by-page-scrolling` |
| Lists and tables | Text lists on slides | Keep rows brief; use a list for text, a collection for many images | `lists-and-tables/content/keep-item-text-succinct-so-row` `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` |
| Truncation | Clipped labels | Ellipsis in the middle keeps both ends visible | `outline-views/best-practices/consider-using-a-centered-ellipsis-to` |
| Lockups | Repeated logo/title groups | Keep lockups in a row the same size | `lockups/best-practices/use-consistent-lockup-sizes-within-a` |
| Buttons style | Calls to action on a slide | One or two prominent actions; verb-led labels | `buttons/style/in-general-use-a-button-that` `buttons/content/consider-using-text-when-a-short` |
| Labels and system label colors | Text tiers | Use primary and secondary label colors for importance levels | `labels/best-practices/use-system-provided-label-colors-to` |
| Boxes | Callout panels | Keep boxes small; use padding and alignment, not nested boxes | `boxes/best-practices/prefer-keeping-a-box-relatively-small` `boxes/best-practices/consider-using-padding-and-alignment-to` |
| Splash screen | Title slide | Brief, beautiful, taken in at a glance | `onboarding/additional-content/briefly-display-a-splash-screen-if` |
| Onboarding | Opening of a talk | Short, about your subject, with little to memorize | `onboarding/best-practices/if-you-need-to-present-a` `onboarding/best-practices/keep-onboarding-content-focused-on-the` |
| Loading | Slow media | Show something immediately, such as a placeholder | `loading/best-practices/show-something-as-soon-as-possible` |
| Hiding toolbars | Presenting mode | Hide chrome so content leads, with a familiar way to bring it back | `going-full-screen/best-practices/prioritize-content-by-temporarily-hiding-toolbars` |
| Tips | Speaker hints on screen | One or two direct sentences | `offering-help/creating-tips/make-tips-short-actionable-and-engaging` |
| Empty screens | Section or blank slides | Say what comes next | `writing/best-practices/provide-clear-next-steps-on-any` |
| Immersive attention cues | Focus a key moment | Start subtle (dim, scale, motion) and strengthen only with reason | `immersive-experiences/best-practices/help-people-engage-with-key-moments` `immersive-experiences/creating-an-environment/minimize-distracting-content` |
| Spatial depth | Layered visuals | Use depth only where it clarifies; keep text flat | `spatial-layout/depth/make-sure-depth-adds-value` `spatial-layout/depth/in-general-avoid-adding-depth-to` |
| Tone and emotion | Deck voice | Pick the feeling first; adjust tone to context | `design-principles/delight/identify-the-emotion-you-want-to` `writing/getting-started/match-your-tone-to-the-context` |
| Games text legibility | Slide text | Good background contrast and at least the minimum size | `designing-for-games/look-stunning-on-every-display/make-sure-text-is-always-legible` |
| Resolution | Image assets | Provide high-resolution images; embed a color profile | `images/resolution/provide-high-resolution-assets-for-all` `images/best-practices/include-a-color-profile-with-each` |
| Real-device testing | Projector check | Test on the real display, not only the design tool | `images/best-practices/always-test-images-on-a-range` `layout/adaptability/preview-your-app-on-multiple-devices` |

## Adopted: tvOS as the distance-viewing reference

**Adopted as a house decision (2026-11-04) [House] [HIG transfer].** Apply it by default. If a deck is made for a different screen or room, ask for those details and adjust.

**The case.** tvOS is the only HIG platform built for a very large display seen from several feet away, with viewers who may move around the room `platforms/tvos.md`. A projected slide has the same setup: a big surface, distant readers, no touch or pointer. The HIG does not say slides are a tvOS case, so this is [HIG transfer].

**Numbers it would give** (from `../tokens.md` and the tvOS profile):
- Canvas 1920x1080 pt, the canvas the tvOS type scale is defined on.
- Text: default 29 pt, minimum 23 pt `typography/ensuring-legibility/use-font-sizes-that-most-people`. Compare iOS 17/11 and macOS 13/10: the tvOS floor is more than double the macOS default.
- Built-in scale (size/leading pt): Title 1 76/96, Title 2 57/66, Title 3 48/56, Headline 38/46, Subtitle 1 38/46, Callout 31/38, Body 29/36, Caption 1 25/32, Caption 2 23/30. Weights are Medium (Regular for Subtitle 1); emphasized is Bold or Medium.
- Safe area: inset primary content 60 pt top and bottom, 80 pt left and right, so nothing is lost to projector or TV overscan `layout/platform-considerations/tvos/adhere-to-the-screens-safe-area`.
- Grid: 40 pt horizontal gaps and at least 100 pt vertical spacing; unfocused widths from 860 pt (two columns) to 160 pt (nine columns). Even spacing keeps scanning easy `layout/platform-considerations/tvos/grids/use-consistent-spacing`.
- Titled rows get extra room above and below the title `layout/platform-considerations/tvos/grids/include-additional-vertical-spacing-for-titled`.
- Peeking content shows equal width on both sides `layout/platform-considerations/tvos/grids/make-partially-hidden-content-look-symmetrical`.
- Contrast: hold all slide text to at least 4.5:1, and aim for 7:1 with custom colors. This follows the stricter Dark Mode rule rather than the 3:1 the accessibility table allows for 18 pt and bold text `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`.

**Other tvOS rules that fit a distant, non-touch viewer** (each [HIG transfer]):
- Small palette that coordinates with the logo, so content leads `color/platform-considerations/tvos/consider-choosing-a-limited-color-palette`.
- Do not signal state by color alone; use scale and motion for emphasis `color/platform-considerations/tvos/avoid-using-only-color-to-indicate`.
- Keep logos and overlays small, short and preferably translucent `playing-video/platform-considerations/tvos/defer-to-content-when-displaying-logos`.
- Pause video at least 0.5 seconds before an interactive overlay and give a clear dismiss `playing-video/platform-considerations/tvos/show-interactive-overlays-gracefully`.
- Full-screen pages of content as peers, with no extra controls on them `page-controls/platform-considerations/tvos/use-page-controls-on-collections-of`.
- One title above a split layout, not one per pane `split-views/platform-considerations/tvos/display-a-single-title-above-a`; balanced panes, default or half and half `split-views/platform-considerations/tvos/choose-a-split-view-layout-that`.
- Keep essential content away from edges of layered artwork, put text on the front layer, keep depth subtle `images/platform-considerations/tvos/layered-images/leave-a-safe-zone-around-the` `images/platform-considerations/tvos/layered-images/generally-keep-text-in-the-foreground` `images/platform-considerations/tvos/layered-images/keep-layering-simple-and-subtle`.
- Keep an opaque base layer under layered art `images/platform-considerations/tvos/layered-images/keep-the-background-layer-opaque`.
- Keep a distant-readable image simple and recognizable, such as a logo or word mark `game-center/platform-considerations/tvos/display-an-optional-image-at-the`.
- Minimize typing and do not require pointers: for slides, avoid interactive demos that need fine pointing `managing-accounts/platform-considerations/tvos/minimize-data-entry` `focus-and-selection/platform-considerations/tvos/avoid-displaying-a-pointer`.
- Hit-target sizes (66x66 pt default, 56x56 minimum) matter only for slides that are clicked or touched on a big screen.

**Limits of this reference:** tvOS rules about focus, remotes, tab bars and live viewing do not apply to a slide. tvOS has no rule on slide count, reading time or aspect ratio other than its own canvas.

**Defaults in force:** 1920x1080 canvas; text 29 pt default and 23 pt minimum; safe area 60 pt top and bottom, 80 pt left and right; contrast at least 4.5:1 for all text, aiming for 7:1 with custom colors `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`.

## Does not apply

- Touch and pointer target sizes, gestures, and Dynamic Type text scaling: slides are not resized by viewers. Compact-layout and watch-specific chart rules also drop out.
- Focus effects, remotes, tab bars, sidebars, sheets, alerts, menus and settings patterns: these are interaction components with no slide counterpart.
- Right-to-left layout mirroring applies only if the deck is written in a right-to-left language (then follow [Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)).
- Apple-only technologies (Apple Pay, Live Activities, widgets, App Clips, CarPlay, Maps) are not slide content.
- Accessibility features such as VoiceOver labels on charts apply to HTML slides that people read in a browser; for a projected deck, back them with captions and plain descriptions instead `charts/best-practices/make-every-chart-in-your-app` `accessibility/hearing/support-text-based-ways-to-enjoy`.

## Ask the user first [HIG none]

The HIG says nothing on these. Ask; do not guess.
- Aspect ratio and canvas size (16:9, 4:3, other). The only canvas in the HIG is the tvOS 1920x1080 one.
- Output format: HTML, PDF, PowerPoint, Keynote, Google Slides.
- Number of slides, time per slide, talk length.
- Whether the deck is presented live, read alone, or both. This changes density.
- Speaker notes: whether to write them, their length and their style.
- Slide transitions and builds, beyond the general motion rules.
- Presentation room, screen size and distance, lighting, projector or monitor.
- Template, master layouts and slide numbering conventions.
- Handouts, appendix and reference slides.
- Citation and source style for data.
- Audience, language and level of expertise.
- Brand assets: logo files, colors, fonts (house default: Pretendard Variable).
- Video and audio embedding, autoplay and fallback behavior.

## House style here [House]

- Font: Pretendard Variable; weights Regular 400, Medium 500, Semibold 600, Bold 700, Heavy 800, as mapped in `../tokens.md`.
- Use the tvOS tokens in `../tokens.md`: `--tv-title-1` 500 76px/96px, `--tv-title-2` 57/66, `--tv-title-3` 48/56, `--tv-headline` 38/46, `--tv-subtitle-1` 400 38/46, `--tv-callout` 31/38, `--tv-body` 29/36, `--tv-caption-1` 25/32, `--tv-caption-2` 23/30, on a 1920x1080 stage with 1 pt = 1 px (an implementation choice, not an HIG rule).
- If it is declined, do not use the iOS or macOS scales as slide body text without the user's agreement, since they are tuned for near viewing.
- Colors: the system color tokens in `../tokens.md`, with light, dark and increased-contrast variants as needed `color/best-practices/make-sure-all-your-apps-colors`.
- Icons: Lucide, per `../icons.md`. Stroke weight follows the adjacent text weight (400 = 1.75, 500 = 2, 600 = 2.25, 700 = 2.5 on the 24 px grid); size icons in em so they scale with the text. Where the HIG prefers SF Symbols, the house rule wins. SVG with `currentColor` `icons/best-practices/maintain-visual-consistency-across-all-interface` `icons/best-practices/in-general-match-the-weights-of`.
- Give charts the Pretendard type tokens and one color per meaning, with shapes or patterns as a second cue `charts/color/avoid-relying-solely-on-color-to`.
- **Liquid Glass look [House] [HIG transfer]:** only for elements that float over imagery (page indicators, small labels or button shapes on a photo), never as the panel behind body text; use the clear variant only over visually rich images with a dark dimming layer when the image is bright, and follow [house style](../house-style.md#liquid-glass) `materials/liquid-glass/dont-use-liquid-glass-in-the` `materials/liquid-glass/use-liquid-glass-effects-sparingly` `materials/liquid-glass/only-use-clear-liquid-glass-for`

## Before you deliver

- [ ] Every text block is at or above the agreed floor (29 pt default, 23 pt minimum) `typography/ensuring-legibility/use-font-sizes-that-most-people`
- [ ] No Light, Thin or Ultralight weights `typography/ensuring-legibility/in-general-avoid-light-font-weights`
- [ ] Contrast checked against the stricter chosen ratio, in the real room if possible `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in` `typography/ensuring-legibility/test-legibility-in-different-contexts`
- [ ] Content stays inside the agreed safe area `layout/platform-considerations/tvos/adhere-to-the-screens-safe-area`
- [ ] Color is never the only carrier of meaning, charts included `color/inclusive-color/avoid-relying-solely-on-color-to`
- [ ] Each slide has one clear main point, key item first `layout/visual-hierarchy/order-content-by-relative-importance` `writing/best-practices/consider-each-screens-purpose`
- [ ] Charts state their takeaway in a title and subtitle and use a common chart type `charts/descriptive-content/summarize-the-main-message-of-your` `charting-data/designing-effective-charts/in-general-prefer-using-common-chart`
- [ ] Brand and logos defer to content `branding/best-practices/ensure-branding-always-defers-to-content`
- [ ] Motion has a purpose and nothing important depends on it `motion/best-practices/add-motion-purposefully-supporting-the-experience` `motion/best-practices/make-motion-optional`
- [ ] Icons share size, detail and stroke weight `icons/best-practices/maintain-visual-consistency-across-all-interface`
- [ ] All items under "Ask the user first" were answered or recorded as assumptions
