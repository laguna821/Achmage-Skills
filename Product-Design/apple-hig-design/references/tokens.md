# Design tokens from HIG tables

Numbers below are copied from the HIG's specification tables (collected 2026-11-04); sizes are in points. The house style (Pretendard Variable, Lucide) is applied in the CSS starter at the end. On the web, start from 1 pt = 1 CSS px; this conversion is an implementation choice, not an HIG rule.

## Text size floors

<!-- data:start -->
| Platform | Default size | Minimum size |
| --- | --- | --- |
| iOS, iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| tvOS | 29 pt | 23 pt |
| visionOS | 17 pt | 12 pt |
| watchOS | 16 pt | 12 pt |
<!-- data:end -->

## Minimum contrast

<!-- data:start -->
| Text size | Text weight | Minimum contrast ratio |
| --- | --- | --- |
| Up to 17 pts | All | 4.5:1 |
| 18 pts | All | 3:1 |
| All | Bold | 3:1 |
<!-- data:end -->

## Control (hit target) sizes

<!-- data:start -->
| Platform | Default control size | Minimum control size |
| --- | --- | --- |
| iOS, iPadOS | 44x44 pt | 28x28 pt |
| macOS | 28x28 pt | 20x20 pt |
| tvOS | 66x66 pt | 56x56 pt |
| visionOS | 60x60 pt | 28x28 pt |
| watchOS | 44x44 pt | 28x28 pt |
<!-- data:end -->

## Type scales (size/leading in pt)

### iOS and iPadOS (Dynamic Type)

<!-- data:start -->
| Style | Weight | Emphasized | xSmall | Small | Medium | Large (default) | xLarge | xxLarge | xxxLarge | AX1 | AX2 | AX3 | AX4 | AX5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Large Title | Regular | Bold | 31/38 | 32/39 | 33/40 | 34/41 | 36/43 | 38/46 | 40/48 | 44/52 | 48/57 | 52/61 | 56/66 | 60/70 |
| Title 1 | Regular | Bold | 25/31 | 26/32 | 27/33 | 28/34 | 30/37 | 32/39 | 34/41 | 38/46 | 43/51 | 48/57 | 53/62 | 58/68 |
| Title 2 | Regular | Bold | 19/24 | 20/25 | 21/26 | 22/28 | 24/30 | 26/32 | 28/34 | 34/41 | 39/47 | 44/52 | 50/59 | 56/66 |
| Title 3 | Regular | Semibold | 17/22 | 18/23 | 19/24 | 20/25 | 22/28 | 24/30 | 26/32 | 31/38 | 37/44 | 43/51 | 49/58 | 55/65 |
| Headline | Semibold | Semibold | 14/19 | 15/20 | 16/21 | 17/22 | 19/24 | 21/26 | 23/29 | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Body | Regular | Semibold | 14/19 | 15/20 | 16/21 | 17/22 | 19/24 | 21/26 | 23/29 | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Callout | Regular | Semibold | 13/18 | 14/19 | 15/20 | 16/21 | 18/23 | 20/25 | 22/28 | 26/32 | 32/39 | 38/46 | 44/52 | 51/60 |
| Subhead | Regular | Semibold | 12/16 | 13/18 | 14/19 | 15/20 | 17/22 | 19/24 | 21/28 | 25/31 | 30/37 | 36/43 | 42/50 | 49/58 |
| Footnote | Regular | Semibold | 12/16 | 12/16 | 12/16 | 13/18 | 15/20 | 17/22 | 19/24 | 23/29 | 27/33 | 33/40 | 38/46 | 44/52 |
| Caption 1 | Regular | Semibold | 11/13 | 11/13 | 11/13 | 12/16 | 14/19 | 16/21 | 18/23 | 22/28 | 26/32 | 32/39 | 37/44 | 43/51 |
| Caption 2 | Regular | Semibold | 11/13 | 11/13 | 11/13 | 11/13 | 13/18 | 15/20 | 17/22 | 20/25 | 24/30 | 29/35 | 34/41 | 40/48 |
<!-- data:end -->

### macOS built-in text styles

<!-- data:start -->
| Text style | Weight | Size (points) | Line height (points) | Emphasized weight |
| --- | --- | --- | --- | --- |
| Large Title | Regular | 26 | 32 | Bold |
| Title 1 | Regular | 22 | 26 | Bold |
| Title 2 | Regular | 17 | 22 | Bold |
| Title 3 | Regular | 15 | 20 | Semibold |
| Headline | Bold | 13 | 16 | Heavy |
| Body | Regular | 13 | 16 | Semibold |
| Callout | Regular | 12 | 15 | Semibold |
| Subheadline | Regular | 11 | 14 | Semibold |
| Footnote | Regular | 10 | 13 | Semibold |
| Caption 1 | Regular | 10 | 13 | Medium |
| Caption 2 | Medium | 10 | 13 | Semibold |
<!-- data:end -->

### tvOS built-in text styles (1920x1080 canvas)

<!-- data:start -->
| Text style | Weight | Size (points) | Leading (points) | Emphasized weight |
| --- | --- | --- | --- | --- |
| Title 1 | Medium | 76 | 96 | Bold |
| Title 2 | Medium | 57 | 66 | Bold |
| Title 3 | Medium | 48 | 56 | Bold |
| Headline | Medium | 38 | 46 | Bold |
| Subtitle 1 | Regular | 38 | 46 | Medium |
| Callout | Medium | 31 | 38 | Bold |
| Body | Medium | 29 | 36 | Bold |
| Caption 1 | Medium | 25 | 32 | Bold |
| Caption 2 | Medium | 23 | 30 | Bold |
<!-- data:end -->

### watchOS (Dynamic Type)

<!-- data:start -->
| Style | Weight | Emphasized | xSmall | Small | Large | xLarge | xxLarge | xxxLarge | AX1 | AX2 | AX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Large Title | Regular | Bold | 30/32.5 | 32/34.5 | 36/38.5 | 40/42.5 | 41/43.5 | 42/44.5 | 44/46.5 | 45/47.5 | 46/48.5 |
| Title 1 | Regular | Semibold | 28/30.5 | 30/32.5 | 34/36.5 | 38/40.5 | 39/41.5 | 40/42.5 | 42/44.5 | 43/46 | 44/47 |
| Title 2 | Regular | Semibold | 24/26.5 | 26/28.5 | 28/30.5 | 30/32.5 | 31/33.5 | 32/34.5 | 34/41 | 35/37.5 | 36/38.5 |
| Title 3 | Regular | Semibold | 17/19.5 | 18/20.5 | 19/21.5 | 20/22.5 | 21/23.5 | 22/24.5 | 24/26.5 | 25/27.5 | 26/28.5 |
| Headline | Semibold | Semibold | 14/16.5 | 15/17.5 | 16/18.5 | 17/19.5 | 18/20.5 | 19/21.5 | 21/23.5 | 22/24.5 | 23/25.5 |
| Body | Regular | Semibold | 14/16.5 | 15/17.5 | 16/18.5 | 17/19.5 | 18/20.5 | 19/21.5 | 21/23.5 | 22/24.5 | 23/25.5 |
| Caption 1 | Regular | Semibold | 13/15.5 | 14/16.5 | 15/17.5 | 16/18.5 | 17/19.5 | 18/20.5 | 18/20.5 | 19/21.5 | 20/22.5 |
| Caption 2 | Regular | Semibold | 12/14.5 | 13/15.5 | 14/16.5 | 15/17.5 | 16/18.5 | 17/19.5 | 17/19.5 | 18/20.5 | 19/21.5 |
| Footnote 1 | Regular | Semibold | 11/13.5 | 12/14.5 | 13/15.5 | 14/16.5 | 15/17.5 | 16/18.5 | 16/18.5 | 17/19.5 | 18/20.5 |
| Footnote 2 | Regular | Semibold | 10/12.5 | 11/13.5 | 12/14.5 | 13/15.5 | 14/16.5 | 15/17.5 | 15/17.5 | 16/17.5 | 17/19.5 |
<!-- data:end -->

Weights map to Pretendard Variable as Regular 400 · Medium 500 · Semibold 600 · Bold 700 · Heavy 800. The HIG tracking tables are specific to Apple fonts and are not used with Pretendard.

## System colors (sRGB hex)

<!-- data:start -->
| Name | API | Light | Dark | Increased contrast light | Increased contrast dark |
| --- | --- | --- | --- | --- | --- |
| Red | `red` | #FF383C | #FF4245 | #E9152D | #FF6165 |
| Orange | `orange` | #FF8D28 | #FF9230 | #C55300 | #FFA056 |
| Yellow | `yellow` | #FFCC00 | #FFD600 | #A16A00 | #FEDF43 |
| Green | `green` | #34C759 | #30D158 | #008932 | #4AD968 |
| Mint | `mint` | #00C8B3 | #00DAC3 | #008575 | #54DFCB |
| Teal | `teal` | #00C3D0 | #00D2E0 | #008198 | #3BDDEC |
| Cyan | `cyan` | #00C0E8 | #3CD3FE | #007EAE | #6DD9FF |
| Blue | `blue` | #0088FF | #0091FF | #1E6EF4 | #5CB8FF |
| Indigo | `indigo` | #6155F5 | #6D7CFF | #564ADE | #A7AAFF |
| Purple | `purple` | #CB30E0 | #DB34F2 | #B02FC2 | #EA8DFF |
| Pink | `pink` | #FF2D55 | #FF375F | #E7124D | #FF8AC4 |
| Brown | `brown` | #AC7F5E | #B78A66 | #956D51 | #DBA679 |
| Gray | `systemGray` | #8E8E93 | #8E8E93 | #6C6C70 | #AEAEB2 |
| Gray (2) | `systemGray2` | #AEAEB2 | #636366 | #8E8E93 | #7C7C80 |
| Gray (3) | `systemGray3` | #C7C7CC | #48484A | #AEAEB2 | #545456 |
| Gray (4) | `systemGray4` | #D1D1D6 | #3A3A3C | #BCBCC0 | #444446 |
| Gray (5) | `systemGray5` | #E5E5EA | #2C2C2E | #D8D8DC | #363638 |
| Gray (6) | `systemGray6` | #F2F2F7 | #1C1C1E | #EBEBF0 | #242426 |
<!-- data:end -->

## Contrast of system colors (computed)

Computed from the hex values above with `scripts/contrast.mjs` (WCAG formula, which the HIG accepts). A color used as text on white and white text on that color give the same ratio. Read each ratio against the minimum contrast table: 4.5:1 for text up to 17 pt, 3:1 for 18 pt and larger or bold; under 3 fails for any text.

| Name | Light, against white | Increased contrast light, against white | Dark, against black | Increased contrast dark, against black |
| --- | --- | --- | --- | --- |
| Red | 3.56 | 4.55 | 6.11 | 7.14 |
| Orange | 2.30 | 4.55 | 9.40 | 10.41 |
| Yellow | 1.51 | 4.58 | 14.87 | 15.85 |
| Green | 2.21 | 4.54 | 10.38 | 11.41 |
| Mint | 2.11 | 4.55 | 11.81 | 12.79 |
| Teal | 2.16 | 4.57 | 11.29 | 12.73 |
| Cyan | 2.16 | 4.56 | 11.94 | 13.01 |
| Blue | 3.52 | 4.57 | 6.49 | 9.75 |
| Indigo | 5.08 | 6.12 | 5.97 | 9.83 |
| Purple | 4.16 | 5.20 | 5.78 | 9.75 |
| Pink | 3.64 | 4.57 | 5.96 | 9.68 |
| Brown | 3.52 | 4.58 | 6.84 | 9.74 |
| Gray | 3.26 | 5.22 | 6.44 | 9.49 |
| Gray (2) | 2.21 | 3.26 | 3.50 | 5.05 |
| Gray (3) | 1.68 | 2.21 | 2.30 | 2.77 |
| Gray (4) | 1.52 | 1.89 | 1.85 | 2.16 |
| Gray (5) | 1.25 | 1.42 | 1.50 | 1.74 |
| Gray (6) | 1.11 | 1.18 | 1.23 | 1.35 |

Every increased contrast light value reaches 4.5:1 against white; most standard light values reach only 3:1, so on light backgrounds they suit text 18 pt and larger or bold, icons and fills. `accessibility/vision/strive-to-meet-color-contrast-minimum`

## Semantic color roles

Use roles by meaning, not by the color they happen to show (see the Color rules in the rule index).

### iOS and iPadOS labels

| Role | Meaning | UIKit API |
| --- | --- | --- |
| Label | Main text | `label` |
| Secondary label | Supporting text | `secondaryLabel` |
| Tertiary label | Third-level text | `tertiaryLabel` |
| Quaternary label | Faintest text | `quaternaryLabel` |
| Placeholder text | Hint text inside empty fields | `placeholderText` |
| Separator | Thin divider that lets content show through | `separator` |
| Opaque separator | Solid divider | `opaqueSeparator` |
| Link | Text that links somewhere | `link` |

### macOS

<!-- data:start -->
| Role | AppKit API |
| --- | --- |
| Alternate selected control text color | `alternateSelectedControlTextColor` |
| Alternating content background colors | `alternatingContentBackgroundColors` |
| Control accent | `controlAccentColor` |
| Control background color | `controlBackgroundColor` |
| Control color | `controlColor` |
| Control text color | `controlTextColor` |
| Current control tint | `currentControlTint` |
| Unavailable control text color | `disabledControlTextColor` |
| Find highlight color | `findHighlightColor` |
| Grid color | `gridColor` |
| Header text color | `headerTextColor` |
| Highlight color | `highlightColor` |
| Keyboard focus indicator color | `keyboardFocusIndicatorColor` |
| Label color | `labelColor` |
| Link color | `linkColor` |
| Placeholder text color | `placeholderTextColor` |
| Quaternary label color | `quaternaryLabelColor` |
| Secondary label color | `secondaryLabelColor` |
| Selected content background color | `selectedContentBackgroundColor` |
| Selected control color | `selectedControlColor` |
| Selected control text color | `selectedControlTextColor` |
| Selected menu item text color | `selectedMenuItemTextColor` |
| Selected text background color | `selectedTextBackgroundColor` |
| Selected text color | `selectedTextColor` |
| Separator color | `separatorColor` |
| Shadow color | `shadowColor` |
| Tertiary label color | `tertiaryLabelColor` |
| Text background color | `textBackgroundColor` |
| Text color | `textColor` |
| Under page background color | `underPageBackgroundColor` |
| Unemphasized selected content background color | `unemphasizedSelectedContentBackgroundColor` |
| Unemphasized selected text background color | `unemphasizedSelectedTextBackgroundColor` |
| Unemphasized selected text color | `unemphasizedSelectedTextColor` |
| Window background color | `windowBackgroundColor` |
| Window frame text color | `windowFrameTextColor` |
<!-- data:end -->

## tvOS grid (1920x1080 canvas)

<!-- data:start -->
| Columns | Unfocused content width | Horizontal spacing | Minimum vertical spacing |
| --- | --- | --- | --- |
| Two-column | 860 pt | 40 pt | 100 pt |
| Three-column | 560 pt | 40 pt | 100 pt |
| Four-column | 410 pt | 40 pt | 100 pt |
| Five-column | 320 pt | 40 pt | 100 pt |
| Six-column | 260 pt | 40 pt | 100 pt |
| Seven-column | 217 pt | 40 pt | 100 pt |
| Eight-column | 184 pt | 40 pt | 100 pt |
| Nine-column | 160 pt | 40 pt | 100 pt |
<!-- data:end -->

## App icon specifications

<!-- data:start -->
| Platform | Layout shape | Icon shape after system masking | Layout size | Style | Appearances |
| --- | --- | --- | --- | --- | --- |
| iOS, iPadOS, macOS | Square | Rounded rectangle (square) | 1024x1024 px | Layered | Default, dark, clear light, clear dark, tinted light, tinted dark |
| tvOS | Rectangle (landscape) | Rounded rectangle (rectangular) | 800x480 px | Layered (Parallax) | N/A |
| visionOS | Square | Circular | 1024x1024 px | Layered (3D) | N/A |
| watchOS | Square | Circular | 1088x1088 px | Layered | N/A |
<!-- data:end -->

## CSS starter (house style applied)

```css
/* Pretendard Variable (variable dynamic subset, v1.3.9) */
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");
:root {
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
  /* Mobile scale: iOS Large (default) */
  --m-large-title: 400 34px/41px var(--font-sans);
  --m-title-1: 400 28px/34px var(--font-sans);
  --m-title-2: 400 22px/28px var(--font-sans);
  --m-title-3: 400 20px/25px var(--font-sans);
  --m-headline: 600 17px/22px var(--font-sans);
  --m-body: 400 17px/22px var(--font-sans);
  --m-callout: 400 16px/21px var(--font-sans);
  --m-subhead: 400 15px/20px var(--font-sans);
  --m-footnote: 400 13px/18px var(--font-sans);
  --m-caption-1: 400 12px/16px var(--font-sans);
  --m-caption-2: 400 11px/13px var(--font-sans);
  /* Desktop app-like scale: macOS */
  --d-large-title: 400 26px/32px var(--font-sans);
  --d-title-1: 400 22px/26px var(--font-sans);
  --d-title-2: 400 17px/22px var(--font-sans);
  --d-title-3: 400 15px/20px var(--font-sans);
  --d-headline: 700 13px/16px var(--font-sans);
  --d-body: 400 13px/16px var(--font-sans);
  --d-callout: 400 12px/15px var(--font-sans);
  --d-subheadline: 400 11px/14px var(--font-sans);
  --d-footnote: 400 10px/13px var(--font-sans);
  --d-caption-1: 400 10px/13px var(--font-sans);
  --d-caption-2: 500 10px/13px var(--font-sans);
  /* Distance-viewing scale: tvOS (candidate for slides) */
  --tv-title-1: 500 76px/96px var(--font-sans);
  --tv-title-2: 500 57px/66px var(--font-sans);
  --tv-title-3: 500 48px/56px var(--font-sans);
  --tv-headline: 500 38px/46px var(--font-sans);
  --tv-subtitle-1: 400 38px/46px var(--font-sans);
  --tv-callout: 500 31px/38px var(--font-sans);
  --tv-body: 500 29px/36px var(--font-sans);
  --tv-caption-1: 500 25px/32px var(--font-sans);
  --tv-caption-2: 500 23px/30px var(--font-sans);
  /* Minimum targets */
  --target-touch: 44px; --target-touch-min: 28px; --target-pointer: 28px; --target-pointer-min: 20px;
  /* System colors, light */
  --red: #FF383C;
  --orange: #FF8D28;
  --yellow: #FFCC00;
  --green: #34C759;
  --mint: #00C8B3;
  --teal: #00C3D0;
  --cyan: #00C0E8;
  --blue: #0088FF;
  --indigo: #6155F5;
  --purple: #CB30E0;
  --pink: #FF2D55;
  --brown: #AC7F5E;
  --gray: #8E8E93;
  --gray-2: #AEAEB2;
  --gray-3: #C7C7CC;
  --gray-4: #D1D1D6;
  --gray-5: #E5E5EA;
  --gray-6: #F2F2F7;
}
body { font-family: var(--font-sans); word-break: keep-all; overflow-wrap: break-word; } /* Korean: break between words */
@media (prefers-color-scheme: dark) {
  :root {
    --red: #FF4245;
    --orange: #FF9230;
    --yellow: #FFD600;
    --green: #30D158;
    --mint: #00DAC3;
    --teal: #00D2E0;
    --cyan: #3CD3FE;
    --blue: #0091FF;
    --indigo: #6D7CFF;
    --purple: #DB34F2;
    --pink: #FF375F;
    --brown: #B78A66;
    --gray: #8E8E93;
    --gray-2: #636366;
    --gray-3: #48484A;
    --gray-4: #3A3A3C;
    --gray-5: #2C2C2E;
    --gray-6: #1C1C1E;
  }
}
@media (prefers-contrast: more) {
  :root {
    --red: #E9152D;
    --orange: #C55300;
    --yellow: #A16A00;
    --green: #008932;
    --mint: #008575;
    --teal: #008198;
    --cyan: #007EAE;
    --blue: #1E6EF4;
    --indigo: #564ADE;
    --purple: #B02FC2;
    --pink: #E7124D;
    --brown: #956D51;
    --gray: #6C6C70;
    --gray-2: #8E8E93;
    --gray-3: #AEAEB2;
    --gray-4: #BCBCC0;
    --gray-5: #D8D8DC;
    --gray-6: #EBEBF0;
  }
}
```

## House values 9 to 11 (CSS)

Neutral colors, filled buttons and web layout defaults from `house-style.md` decisions 9 to 11.

```css
:root {
  --label: #000000; --label-2: #6c6c70; --label-3: #8e8e93;
  --separator: #d1d1d6; --bg: #ffffff; --bg-grouped: #f2f2f7; --bg-elevated: #ffffff;
  --accent: #0088ff; --accent-fill: #1e6ef4; --on-accent: #ffffff;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-12: 48px;
  --read-max: 720px; --app-max: 1200px; --compact-max: 743px;
}
@media (prefers-color-scheme: dark) {
  :root { --label: #ffffff; --label-2: #aeaeb2; --separator: #3a3a3c; --bg: #000000; --bg-grouped: #1c1c1e; --bg-elevated: #2c2c2e; --accent: #0091ff; --accent-fill: #0091ff; }
}
.button-filled { background: var(--accent-fill); color: var(--on-accent); font-weight: 700; }
/* compact below 744 px: tab bar layout; regular from 744 px: sidebar layout */
@media (max-width: 743px) { /* compact */ }
```
