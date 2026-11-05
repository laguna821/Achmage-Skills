---
slug: labels
title: "Labels"
kind: component
group: "Layout and organization"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/labels
---

# Labels

**In one line:** Static, uneditable text that people can read and often copy, used in buttons, lists and views to give context.

## Why it exists
People need words to know where they are and what they can do next. A label supplies small pieces of text, and the system gives it fonts and colors that scale and signal importance without extra work (Familiarity, Simplicity) `labels/best-practices/use-a-label-to-display-a` `labels/best-practices/prefer-system-fonts`.

## Use it when
- You show a small amount of text people do not need to edit `labels/best-practices/use-a-label-to-display-a`
- Text needs different levels of importance, such as primary and supplemental `labels/best-practices/use-system-provided-label-colors-to`
- The text holds useful details such as an error message, location or IP address `labels/best-practices/make-useful-label-text-selectable`

## Don't use it when
- People must edit short text: use [Text fields](text-fields.md) instead `labels/best-practices/use-a-label-to-display-a`
- You show a large amount of text, or it may be edited: use [Text views](text-views.md) instead `labels/best-practices/use-a-label-to-display-a`

## Cost to the user
Labels cost little: no decision, no interaction. The risk is legibility when custom fonts or styles replace the system ones `labels/best-practices/prefer-system-fonts`.

## Principles at stake
- **Simplicity:** match the element to the amount of text `labels/best-practices/use-a-label-to-display-a`
- **Responsibility:** system fonts bring Dynamic Type where available, keeping text legible `labels/best-practices/prefer-system-fonts`
- **Craft:** four label colors give consistent visual rank `labels/best-practices/use-system-provided-label-colors-to`

## Key rules
- Use a label for small, non-editable text `labels/best-practices/use-a-label-to-display-a`
- Prefer system fonts, and keep any custom styling legible `labels/best-practices/prefer-system-fonts`
- Use the system label colors for relative importance: primary information, secondary or supplemental text, unavailable items, and watermark text (see the source page for the table) `labels/best-practices/use-system-provided-label-colors-to`
- Make useful text selectable and copyable `labels/best-practices/make-useful-label-text-selectable`

## Anatomy and content
The word label covers text inside buttons (what the button does), list items (often with a symbol or image) and views (introducing a control or task). For the colors and fonts in this house style, see [tokens](../tokens.md) [House].

## Platform differences
- **watchOS:** system date and time text and countdown timer text adjust to the available space and update themselves; consider them in complications (see the source page).
- **macOS:** uneditable text is a text field set to not editable (developer detail).
- **iOS, iPadOS, tvOS, visionOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] small static text, system-level hierarchy, copyable details `labels/best-practices/make-useful-label-text-selectable`
- **Desktop web:** [HIG] the same rules apply `labels/best-practices/use-system-provided-label-colors-to`
- **Slides:** [HIG transfer] use a few tiers of text emphasis, and keep styled text legible `labels/best-practices/use-system-provided-label-colors-to` `labels/best-practices/prefer-system-fonts`
- **Card news:** [HIG transfer] the same tiers of emphasis and legibility apply `labels/best-practices/use-system-provided-label-colors-to`

## Related
[Text fields](text-fields.md) · [Text views](text-views.md) · [Color](https://developer.apple.com/design/human-interface-guidelines/color)

