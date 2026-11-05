---
slug: color-wells
title: "Color wells"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/color-wells
---

# Color wells

**In one line:** A control that shows a color and lets people change the color of text, shapes, guides or other elements.

## Why it exists
When people customize an element's color, they need a familiar way to see the current choice and change it. The HIG gives one guideline: lean on the system color picker instead of building your own `color-wells/best-practices/consider-the-system-provided-color-picker`. That serves Familiarity and Simplicity.

## Use it when
- People should set the color of text, shapes, guides or similar elements [HIG none] beyond the page's definition
- You want a consistent picking experience: use the built-in picker `color-wells/best-practices/consider-the-system-provided-color-picker`

## Don't use it when
- You are on tvOS or watchOS: not available (no HIG alternative named)
- You would build a custom picker from scratch: use the system color picker instead `color-wells/best-practices/consider-the-system-provided-color-picker`

## Cost to the user
Low: the control is small and sits inline. A custom picker adds a learning cost that the system one avoids `color-wells/best-practices/consider-the-system-provided-color-picker`. [HIG none] for further detail.

## Principles at stake
- **Familiarity:** the system picker is already known `color-wells/best-practices/consider-the-system-provided-color-picker`
- **Simplicity:** reuse rather than rebuild `color-wells/best-practices/consider-the-system-provided-color-picker`

## Key rules
- Prefer the built-in system color picker for choosing colors `color-wells/best-practices/consider-the-system-provided-color-picker`
- The Color page repeats it: when people choose colors, use the system picker where one exists `color/best-practices/if-your-app-lets-people-choose`
- Keep each color's meaning constant and never let color alone carry key information, so a chosen color should not be the only signal `color/inclusive-color/avoid-relying-solely-on-color-to`

The color well page itself gives no further guidance.

## Platform differences
- **iOS, iPadOS, visionOS, macOS:** no platform-specific guidance.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] use the platform's native color input rather than a custom one `color-wells/best-practices/consider-the-system-provided-color-picker`
- **Desktop web:** [HIG transfer] same, prefer the browser's native color input `color-wells/best-practices/consider-the-system-provided-color-picker`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Color](https://developer.apple.com/design/human-interface-guidelines/color) · [Image wells](image-wells.md)
