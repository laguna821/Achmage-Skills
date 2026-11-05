# House style

Project decisions layered on top of the HIG. They apply to every deliverable unless the user says otherwise. Label them [House] in outputs, and whenever one overrides something the HIG prefers, say so in the rationale note. Anyone reusing this skill can change this file to set their own house style; the rest of the skill stays the same.

| # | Decision | Applies to |
| --- | --- | --- |
| 1 | Typeface: Pretendard Variable instead of Apple fonts | Everything |
| 2 | Icons: Lucide with the unified spec, never SF Symbols | Everything |
| 3 | Liquid Glass look outside Apple platforms, controls and navigation only | Web, other operating systems, slides, card news |
| 4 | Slides use tvOS as the distance-viewing reference | Slides |
| 5 | Card news uses glanceable surfaces as the reference | Card news |
| 6 | Review severity: Blocker, Major, Minor | Reviews |
| 7 | Answer in the user's language with Apple's official terms | All responses |
| 8 | Slides are demo decks: the real product with spotlight callouts, not lecture slides | Slides |
| 9 | Secondary text and neutral colors from the HIG gray table | Everything outside native apps |
| 10 | Filled accent buttons: Bold white label, increased-contrast fill in light mode | Everything outside native apps |
| 11 | Web layout defaults: 4 px spacing scale, 720 px reading column, 1200 px app width, compact below 744 px | Web, mobile web |
| 12 | Craft pass before delivery; one display headline up to twice the largest text style; fixed canvases composed as a whole | Everything built |

## 1. Typeface: Pretendard Variable

Pretendard was made to stand in for Apple's system typefaces on other platforms; its letter heights are matched to San Francisco, so layouts built on the HIG type scales hold up. It is licensed under the SIL Open Font License, which allows commercial use, modification and redistribution (it may not be sold on its own).

The HIG allows custom fonts under conditions the skill must meet:

- Keep text legible and stay at or above each platform's default and minimum sizes `typography/using-custom-fonts/make-sure-custom-fonts-are-legible` `typography/ensuring-legibility/use-font-sizes-that-most-people`
- Support the same accessibility behavior as system fonts, such as Dynamic Type and Bold Text, in native apps `typography/using-custom-fonts/implement-accessibility-features-for-custom-fonts`
- Remember that weight changes legibility; avoid Pretendard 100 to 300 for small text `accessibility/vision/bear-in-mind-that-font-weight`

On the web:

```html
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

```css
font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
```

- When self-hosting the variable font, declare the weight range `45 920`, or WebKit browsers may render weights wrongly.
- Weights: Regular 400, Medium 500, Semibold 600, Bold 700, Heavy 800.
- Korean line breaks: set `word-break: keep-all; overflow-wrap: break-word;` on text so lines break between words, not inside them.
- Type scales come from the HIG tables in [tokens.md](tokens.md): iOS for mobile, macOS for app-like desktop interfaces, tvOS for slides. The HIG tracking tables belong to Apple's fonts and are not used with Pretendard.

**Conflicts to disclose:** the HIG suggests system fonts for body text and captions when a brand font is used `branding/best-practices/consider-using-a-custom-font`, and prefers system fonts in labels and widgets `labels/best-practices/prefer-system-fonts` `widgets/best-practices/displaying-text-in-widgets/prefer-using-the-system-font-text`. The house rule uses Pretendard there too, so check small-size legibility and mention the difference in native app work.

## 2. Icons: Lucide with the unified spec

Use Lucide as the base set and make every icon, imported or newly drawn, pass the 15-rule spec in [icons.md](icons.md): consistent size, detail and stroke `icons/best-practices/maintain-visual-consistency-across-all-interface`, stroke weight matched to the adjacent text weight `icons/best-practices/in-general-match-the-weights-of`, HIG metaphors for standard actions, and an accessibility label on every icon. `scripts/icons.mjs` normalizes, checks and previews icons against the spec.

**Conflicts to disclose:** the HIG recommends SF Symbols for tab bars, toolbars and Dark Mode `tab-bars/best-practices/consider-using-sf-symbols-to-provide` `toolbars/actions/prefer-system-provided-symbols-without-borders` `dark-mode/dark-mode-colors/icons-and-images/use-sf-symbols-wherever-possible`. Mention it when building native Apple apps.

<a id="liquid-glass"></a>
## 3. Liquid Glass look outside Apple platforms

On Apple platforms, standard components adopt Liquid Glass on their own. Elsewhere the house imitates it, under the HIG's own limits [HIG transfer]:

- **Where:** only controls and navigation that float above content: tab and tool bars, floating buttons, segmented controls over media, page indicators, small labels over imagery. Transient controls such as sliders and toggles may take the look while in use. Never the content layer: no glass cards, list backgrounds, page backgrounds or panels behind body text `materials/liquid-glass/dont-use-liquid-glass-in-the`
- **How much:** sparingly, on the most important functional elements only `materials/liquid-glass/use-liquid-glass-effects-sparingly`
- **Variant:** regular by default, because it blurs and evens out what is behind it so text stays legible. Clear only over visually rich backgrounds such as photos or video; if the background is bright, add a dark dimming layer of 35% opacity `materials/liquid-glass/only-use-clear-liquid-glass-for`
- **Color and legibility:** add color to glass sparingly `color/liquid-glass-color/apply-color-sparingly-to-the-liquid`, use vibrant, high-contrast foreground colors `materials/standard-materials/help-ensure-legibility-by-using-vibrant`, and meet the contrast minimums `accessibility/vision/strive-to-meet-color-contrast-minimum`
- **Accessibility settings:** when people ask for reduced transparency or more contrast, fall back to an opaque surface.
- **Slides and card news:** render the effect as a still image (a blurred, slightly brightened patch of the picture behind a floating element, with a thin light edge), on floating elements only.

Web starting point. The blur, opacity and border values are [House] values to tune by eye, not HIG numbers; the 35% dimming comes from the HIG.

```css
.glass {
  background: color-mix(in srgb, white 18%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid color-mix(in srgb, white 35%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 45%, transparent);
}
.glass.clear { background: color-mix(in srgb, white 8%, transparent); }
.glass-dim { background: rgb(0 0 0 / 0.35); } /* dimming layer under clear glass on bright content */
@media (prefers-color-scheme: dark) {
  .glass { background: color-mix(in srgb, black 28%, transparent); border-color: color-mix(in srgb, white 18%, transparent); }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: Canvas; -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@media (prefers-contrast: more) {
  .glass { background: Canvas; border-color: CanvasText; }
}
```

## 4. Slides: tvOS as the distance-viewing reference

A 1920x1080 canvas, text at 29 pt by default and never under 23 pt, the tvOS type scale, safe margins of 60 pt top and bottom and 80 pt left and right, and contrast of at least 4.5:1 for all text, aiming for 7:1 with custom colors `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`. Details and limits: [media/slides.md](media/slides.md).

## 5. Card news: glanceable surfaces as the reference

Borrow the guidance for widgets, notifications and complications: one purpose per card, very few words, large text at medium weight or heavier, color never the only carrier of meaning. Do not copy their sizes or margins as card dimensions. Details: [media/cards.md](media/cards.md).

## 6. Review severity

- **Blocker:** breaks an explicit HIG "don't", a minimum size or contrast, or stops people from finishing the task.
- **Major:** works against a design principle or a platform convention.
- **Minor:** polish.
- **Estimates:** when a Blocker rests on an estimated measurement (for example sizes or colors read from a screenshot), file it as Major and write "Blocker if confirmed".

Every finding cites rule IDs, or is marked [HIG none]. The review order is in [workflow.md](workflow.md).

## 7. Language

Answer in the user's language. In Korean, use the official terms in [glossary-en-ko.md](glossary-en-ko.md) and add the English term in parentheses the first time. Keep rule IDs, file names and code in English.

## 8. Slides are demo decks

Decided by the user on 2026-11-04. HTML slides in this skill present a product: the real front end (or a screenshot) fills the stage, each slide dims it, spotlights one element and explains it in a callout, and the presenter can hand the product over for live use. General lecture slides are left to other tools. Text follows decision 4 (tvOS sizes and safe area). House values: 58% dimming around the spotlight, a 3 px system-blue ring, a nearly opaque callout for legibility, generic device outlines. Guide: `references/media/demo-deck.md`; engine: `assets/demo-deck/`.

## 9. Secondary text and neutral colors

Decided by the user on 2026-11-04. The HIG names text roles (label, secondary label) but gives no values for the web, so the house takes them from the HIG gray table in `tokens.md`:

| Role | Light | Dark | Note |
| --- | --- | --- | --- |
| Primary text | #000000 | #FFFFFF | |
| Secondary text | #6C6C70 (Gray, increased contrast) | #AEAEB2 (Gray, increased contrast) | 5.22:1 on white; 9.49:1 on black, 6.3:1 on #2C2C2E |
| Tertiary, non-essential | #8E8E93 (Gray) | #8E8E93 | Only for text 18 pt and up or bold, icons and disabled states (3.26:1 on white) |
| Separator | #D1D1D6 (Gray 4) | #3A3A3C (Gray 4) | |
| Grouped background | #F2F2F7 (Gray 6) | #1C1C1E (Gray 6) | Elevated surfaces in dark: #2C2C2E (Gray 5) |

On Gray 5 fills (#E5E5EA, for example a search field), secondary text drops to 4.16:1. Put secondary and accent text, placeholders included, on white, Gray 6 or the cell color, or use primary text on Gray 5.

`accessibility/vision/strive-to-meet-color-contrast-minimum`

## 10. Filled accent buttons

Decided by the user on 2026-11-04. Labels on an accent fill are white and Bold (700). In light mode the fill uses the accent's increased-contrast value (blue #1E6EF4 gives 4.57:1, so any size passes); in dark mode the fill uses the dark value (blue #0091FF, 3.23:1) and relies on the HIG table's row for bold text (3:1). For another accent, check both modes with `scripts/contrast.mjs`.

## 11. Web layout defaults

Decided by the user on 2026-11-04. The HIG gives no web grid, so these are house values:

- **Spacing:** multiples of 4 px: 4, 8, 12, 16, 20, 24, 32, 48. The HIG's 12 pt and 24 pt gaps around controls fit this scale `accessibility/mobility/consider-spacing-between-controls-as-important`.
- **Widths:** reading pages keep the text column at most 720 px; app-like layouts keep content at most 1200 px.
- **Size classes [HIG transfer]:** compact below 744 px, regular from 744 px. 744 pt is the narrowest iPad width in portrait in the HIG screen-size table, the point where iPad layouts use a sidebar. Compact uses the phone layout (tab bar, full-width lists, sheets from the bottom); regular uses the sidebar layout. `layout/adaptability/design-a-layout-that-adapts-gracefully`

## 12. Craft pass and display type

Adopted on 2026-11-04 after trials showed rule-correct artifacts looking plainer than ones made without the skill; the user left the direction to the agent, and the HIG-only option was taken. Every built artifact gets the craft pass in `craft.md` before delivery. On fixed canvases, title cards and landing heroes, one headline may grow beyond the largest text style of the scale in use, up to twice its size. Fixed canvases are composed as a whole, centered or anchored, with no large area left unused by accident.
