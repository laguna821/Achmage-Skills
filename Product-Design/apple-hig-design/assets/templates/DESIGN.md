---
version: alpha
name: "{Product name}"
description: "{One or two sentences: the product, the people it serves and the feeling it should give}. Built with the apple-hig-design skill on the HIG Kit: HIG system colors and type scales, Pretendard Variable, Lucide icons."
colors:
  primary: "#0088FF"
  primary-text: "#1E6EF4"
  primary-fill: "#1E6EF4"
  on-primary: "#FFFFFF"
  surface: "#FFFFFF"
  surface-grouped: "#F2F2F7"
  surface-cell: "#FFFFFF"
  surface-elevated: "#FFFFFF"
  on-surface: "#000000"
  on-surface-secondary: "#6C6C70"
  on-surface-tertiary: "#8E8E93"
  separator: "#D1D1D6"
  fill: "#E5E5EA"
  error: "#E9152D"
  error-fill: "#E9152D"
  success: "#008932"
  warning: "#C55300"
  switch-on: "#34C759"
  primary-dark: "#0091FF"
  primary-text-dark: "#5CB8FF"
  primary-fill-dark: "#0091FF"
  surface-dark: "#000000"
  surface-grouped-dark: "#1C1C1E"
  surface-cell-dark: "#2C2C2E"
  surface-elevated-dark: "#2C2C2E"
  on-surface-dark: "#FFFFFF"
  on-surface-secondary-dark: "#AEAEB2"
  on-surface-tertiary-dark: "#8E8E93"
  separator-dark: "#3A3A3C"
  fill-dark: "#2C2C2E"
  error-dark: "#FF6165"
  error-fill-dark: "#FF4245"
  success-dark: "#4AD968"
  warning-dark: "#FFA056"
  switch-on-dark: "#30D158"
typography:
  large-title:
    fontFamily: Pretendard Variable
    fontSize: 2.125rem
    fontWeight: 400
    lineHeight: 2.5625rem
  title-1:
    fontFamily: Pretendard Variable
    fontSize: 1.75rem
    fontWeight: 400
    lineHeight: 2.125rem
  title-2:
    fontFamily: Pretendard Variable
    fontSize: 1.375rem
    fontWeight: 400
    lineHeight: 1.75rem
  title-3:
    fontFamily: Pretendard Variable
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.5625rem
  headline:
    fontFamily: Pretendard Variable
    fontSize: 1.0625rem
    fontWeight: 600
    lineHeight: 1.375rem
  body:
    fontFamily: Pretendard Variable
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.375rem
  body-bold:
    fontFamily: Pretendard Variable
    fontSize: 1.0625rem
    fontWeight: 700
    lineHeight: 1.375rem
  callout:
    fontFamily: Pretendard Variable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.3125rem
  subhead:
    fontFamily: Pretendard Variable
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.25rem
  footnote:
    fontFamily: Pretendard Variable
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.125rem
  caption-1:
    fontFamily: Pretendard Variable
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1rem
  caption-2:
    fontFamily: Pretendard Variable
    fontSize: 0.6875rem
    fontWeight: 400
    lineHeight: 0.8125rem
spacing:
  unit: 4px
  s-1: 4px
  s-2: 8px
  s-3: 12px
  s-4: 16px
  s-5: 20px
  s-6: 24px
  s-8: 32px
  s-12: 48px
  read-max: 720px
  app-max: 1200px
  compact-max: 743px
  target: 44px
  target-min: 28px
  target-pointer: 28px
  target-pointer-min: 20px
  tab-bar-height: 68px
  toolbar-height: 52px
rounded:
  sm: 8px
  md: 12px
  lg: 18px
  xl: 26px
  full: 999px
components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
  page-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-surface-dark}"
  grouped-page:
    backgroundColor: "{colors.surface-grouped}"
  grouped-page-dark:
    backgroundColor: "{colors.surface-grouped-dark}"
  list-cell:
    backgroundColor: "{colors.surface-cell}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
  list-cell-dark:
    backgroundColor: "{colors.surface-cell-dark}"
    textColor: "{colors.on-surface-dark}"
  sheet:
    backgroundColor: "{colors.surface-elevated}"
  sheet-dark:
    backgroundColor: "{colors.surface-elevated-dark}"
  secondary-text:
    textColor: "{colors.on-surface-secondary}"
  secondary-text-dark:
    textColor: "{colors.on-surface-secondary-dark}"
  tertiary-text:
    textColor: "{colors.on-surface-tertiary}"
  tertiary-text-dark:
    textColor: "{colors.on-surface-tertiary-dark}"
  separator:
    backgroundColor: "{colors.separator}"
    height: 1px
  separator-dark:
    backgroundColor: "{colors.separator-dark}"
    height: 1px
  tint:
    textColor: "{colors.primary}"
  tint-dark:
    textColor: "{colors.primary-dark}"
  button-filled:
    backgroundColor: "{colors.primary-fill}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-bold}"
    rounded: "{rounded.full}"
    height: "{spacing.target}"
    padding: "{spacing.s-5}"
  button-filled-dark:
    backgroundColor: "{colors.primary-fill-dark}"
    textColor: "{colors.on-primary}"
  button-filled-destructive:
    backgroundColor: "{colors.error-fill}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-bold}"
    rounded: "{rounded.full}"
    height: "{spacing.target}"
    padding: "{spacing.s-5}"
  button-filled-destructive-dark:
    backgroundColor: "{colors.error-fill-dark}"
    textColor: "{colors.on-primary}"
  button-plain:
    textColor: "{colors.primary-text}"
    typography: "{typography.headline}"
    height: "{spacing.target}"
    padding: "{spacing.s-5}"
  button-plain-dark:
    textColor: "{colors.primary-text-dark}"
  segmented-control:
    backgroundColor: "{colors.fill}"
    rounded: "{rounded.full}"
  segmented-control-dark:
    backgroundColor: "{colors.surface-grouped-dark}"
  search-field:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
  search-field-dark:
    backgroundColor: "{colors.fill-dark}"
    textColor: "{colors.on-surface-dark}"
  switch-on:
    backgroundColor: "{colors.switch-on}"
  switch-on-dark:
    backgroundColor: "{colors.switch-on-dark}"
  status-error:
    textColor: "{colors.error}"
  status-error-dark:
    textColor: "{colors.error-dark}"
  status-success:
    textColor: "{colors.success}"
  status-success-dark:
    textColor: "{colors.success-dark}"
  status-warning:
    textColor: "{colors.warning}"
  status-warning-dark:
    textColor: "{colors.warning-dark}"
  tab-bar:
    height: "{spacing.tab-bar-height}"
  toolbar:
    height: "{spacing.toolbar-height}"
---

# {Product name} design system

> Written by the apple-hig-design skill from `visual-system-note.md` and `theme.css`. The tokens mirror the HIG Kit (`assets/kit/hk-base.css`) with the house decisions in `references/house-style.md`; backticked IDs are HIG rules from the skill's `references/`. Replace the braces, keep the section order, and record every change to a token in the section that explains it. Tokens ending in `-dark` are the dark appearance of the token with the same name.

## Overview

{Who uses the product, in what situation, and the feeling it should give, from `design-brief.md`.} The interface defers to content: standard components and conventions first, one accent color that marks what can be acted on, and the Liquid Glass look only on controls and navigation that float above content `materials/liquid-glass/dont-use-liquid-glass-in-the`. Light, dark and increased contrast are all designed and checked `color/best-practices/make-sure-all-your-apps-colors`.

## Colors

- **Primary (#0088FF, dark #0091FF):** the accent for icons, selection, focus rings and large or bold text. It means "you can act here" and nothing else `color/best-practices/avoid-using-the-same-color-to`.
- **Primary text (#1E6EF4, dark #5CB8FF):** the accent when it is small text.
- **Primary fill (#1E6EF4, dark #0091FF):** behind a white Bold label (house decision 10). Light reaches 4.57:1; dark reaches 3.23:1, which passes only because the label is Bold `accessibility/vision/strive-to-meet-color-contrast-minimum`.
- **Surfaces and labels:** neutral values from the HIG gray table (house decision 9). Secondary text #6C6C70 (dark #AEAEB2). Tertiary #8E8E93 only for text 18 pt and up or bold, icons and disabled states. Keep secondary text off the fill color (#E5E5EA, 4.16:1).
- **Status:** error, success and warning use the increased-contrast system colors, always with an icon or words as well `accessibility/vision/convey-information-with-more-than-color`.
- System colors keep their intended roles `color/system-colors/avoid-redefining-the-semantic-meanings-of`. To rebrand, change the three primary tokens and check both appearances with `scripts/contrast.mjs`.

## Typography

Pretendard Variable (house decision 1) on the iOS Large (default) text-style scale, in rem so that browser text-size settings scale it; fallback stack: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, sans-serif. Body is 17 px and nothing goes below 11 px on touch layouts `typography/ensuring-legibility/use-font-sizes-that-most-people`. Weights are Regular, Semibold and Bold; light weights are not used `typography/ensuring-legibility/in-general-avoid-light-font-weights`. Pointer layouts (`.hk-mac` in the kit) switch to the macOS scale: body 13 px, minimum 10 px.

## Layout

Compact below 744 px (tab bar, full-width lists, sheets from the bottom) and regular from 744 px (sidebar) `layout/adaptability/design-a-layout-that-adapts-gracefully`. Spacing comes in multiples of 4 px, with 12 px and 24 px gaps around controls `accessibility/mobility/consider-spacing-between-controls-as-important`. Reading columns stay at most 720 px wide and app content at most 1200 px (house decision 11). Targets are 44 px on touch (28 px minimum) and 28 px with a pointer (20 px minimum) `buttons/best-practices/make-buttons-easy-for-people-to`.

## Elevation & Depth

Two layers: content, and the controls and navigation that float above it. Only the floating layer gets the glass look (a translucent fill, a 16 px blur with 160 percent saturation and a light 1 px inner edge), and sparingly `materials/liquid-glass/use-liquid-glass-effects-sparingly`. With reduced transparency or increased contrast, the glass becomes the opaque elevated surface `dark-mode/best-practices/test-your-content-to-make-sure`. Shadows are house values [House]: floating `0 8px 28px rgb(0 0 0 / .12), 0 1px 3px rgb(0 0 0 / .08)`, modal `0 24px 64px rgb(0 0 0 / .22)`.

## Shapes

Corner radii are house values tuned by eye [House]: 8, 12, 18 and 26 px, plus the capsule (999 px). Buttons and segmented controls are capsules; grouped lists and cards use 12 or 18 px.

## Components

Components come from the HIG Kit (`assets/kit/`); its README lists the rule IDs each one implements. One filled button per view marks the most likely action, and style, not size, sets it apart `buttons/style/use-style-not-size-to-visually`. A destructive action gets the destructive style and never the primary role `buttons/role/dont-assign-the-primary-role-to`. Switches use system green when on. {List the product's own components, each with the `D##` decision that chose it.}

## Do's and Don'ts

- Do keep one meaning per color: the accent marks what can be acted on `color/best-practices/avoid-using-the-same-color-to`
- Do check every text and background pair in light, dark and increased contrast `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`
- Don't put the glass look behind content such as lists, cards or text `materials/liquid-glass/dont-use-liquid-glass-in-the`
- Don't set text below 11 px on touch or 10 px with a pointer `typography/ensuring-legibility/use-font-sizes-that-most-people`
- Don't show status by color alone `accessibility/vision/convey-information-with-more-than-color`
- Don't make a destructive button the primary one `buttons/role/dont-assign-the-primary-role-to`
