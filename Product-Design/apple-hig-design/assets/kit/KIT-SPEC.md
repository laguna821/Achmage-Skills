# HIG Kit: conventions for component authors

The kit gives web front ends built with this skill one shared, HIG-correct set of components, so every build starts from the same parts instead of redrawing buttons and sheets. Read this before adding a component.

## Files

- `hk-base.css`, `hk-base.js`: tokens, base styles and the registry. Do not change tokens without updating this file.
- One group per file set: `hk-<group>.css`, `hk-<group>.js`, `gallery-<group>.html`, `README-<group>.md`. Groups: `controls`, `nav`, `status`.
- Later merged into `kit.css`, `kit.js`, `index.html` and `README.md`.

## Rules

1. **Tokens only.** Colors, type, spacing, radii, motion and shadows come from `hk-base.css` variables. No raw hex values, no px font sizes (use the `--t-*` fonts), spacing in the 4 px scale.
2. **Semantic HTML first.** Real `button`, `input`, `select`, `textarea`, `dialog`, `nav`, `ul`/`li`, `table`, `progress`. ARIA only where HTML has no element (switch, radiogroup, menu, tablist).
3. **Naming.** Classes start with `hk-` (`.hk-btn`, modifier `.hk-btn--filled`, part `.hk-btn__icon`). States use ARIA attributes (`aria-pressed`, `aria-checked`, `aria-selected`, `aria-expanded`, `aria-current`, `aria-invalid`, `disabled`), not `.is-*` classes.
4. **Behavior in JS.** One IIFE per group file. Register with `HK.define('name', el => { ... })` and bind through `data-hk="name"`. No libraries. Each init runs once per element and must not assume other groups are loaded.
5. **Keyboard and assistive technologies.** Every control works with keyboard alone (Tab, Space, Enter, arrows where a pattern expects them, Escape closes overlays) and has an accessible name. Overlays return focus to their opener.
6. **Targets.** At least 44 px on touch layouts (`--target`), never below 28 px; inside `.hk-mac` the tokens switch to pointer sizes (28 px, minimum 20 px).
7. **Size classes.** Compact is `max-width: 743px`, regular is 744 px and wider (house-style 11). Components that change by size class (sheet, tab bar, sidebar, action sheet, popover) do so with these media queries or `HK.compact()`.
8. **Appearance and settings.** Look right in light and dark (`data-theme` forces either), with `prefers-contrast: more`, `prefers-reduced-transparency: reduce` and `prefers-reduced-motion: reduce`.
9. **Glass** (`.hk-glass` or the `--glass-*` tokens) only on controls and navigation that float above content: tab bar, toolbar or navigation bar when floating, floating buttons. Never on content, lists, sheets' content or cards (house-style 3).
10. **Fills behind white text** use `--accent-fill` or `--destructive-fill` with a Bold label (house-style 10).
11. **Evidence.** Each component's README entry lists the HIG rule IDs it implements (3 to 8, from the matching card in `references/components/<slug>.md`), the markup to copy, the options, and what it deliberately does not do. Verify IDs with `node scripts/find-rules.mjs --check README-<group>.md`.
12. **Gallery.** `gallery-<group>.html` shows every component and state (default, hover, focus, pressed or selected, disabled, error where relevant), has a light/dark switch, and reads well at 390 px and at 1280 px. Check it in a browser through the preview server and run `scripts/audit-page.js` in light and dark.

## Markup skeleton for a gallery page

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>HIG Kit · controls</title>
<link rel="stylesheet" href="hk-base.css">
<link rel="stylesheet" href="hk-controls.css">
</head>
<body>
  ... sections ...
<script src="hk-base.js"></script>
<script src="hk-controls.js"></script>
</body>
</html>
```
