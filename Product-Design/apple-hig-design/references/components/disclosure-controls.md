---
slug: disclosure-controls
title: "Disclosure controls"
kind: component
group: "Layout and organization"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/disclosure-controls
---

# Disclosure controls

**In one line:** Small controls, a triangle or a button, that show or hide detail and advanced functionality tied to a view or a control.

## Why it exists
Most people need only the common options. Hiding the rest until they are relevant keeps the essential information easy to find without overwhelming anyone (Simplicity, Flexibility) `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`.

## Use it when
- Advanced or detailed options should stay hidden by default, with the most-used controls visible at the top `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
- A view or list needs expandable sections, using a disclosure triangle with a descriptive label `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using`
- One control has extra choices that expand next to it, using a disclosure button `disclosure-controls/disclosure-buttons/place-a-disclosure-button-near-the`

## Don't use it when
- The hidden content is something most people need immediately: keep it visible at the top `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
- A single view would need several disclosure buttons: reduce them to one `disclosure-controls/disclosure-buttons/use-no-more-than-one-disclosure`
- The data is a true hierarchy of rows: see [Outline views](outline-views.md) (named as related) `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using`

## Cost to the user
Hidden content costs a click to reach, and unlabeled controls leave people guessing what is behind them `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using`. Several disclosure buttons in one view add complexity and confusion `disclosure-controls/disclosure-buttons/use-no-more-than-one-disclosure`.

## Principles at stake
- **Simplicity:** progressive disclosure keeps the first view uncluttered `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
- **Familiarity:** the control sits beside what it reveals so the link is obvious `disclosure-controls/disclosure-buttons/place-a-disclosure-button-near-the`
- **Flexibility:** advanced people can still open everything `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`

## Key rules
- Put the most-used controls at the top and visible; hide advanced ones by default `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
- Label a disclosure triangle with what it discloses, for example "Advanced Options" `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using`
- Place a disclosure button close to the content it expands and collapses `disclosure-controls/disclosure-buttons/place-a-disclosure-button-near-the`
- Use at most one disclosure button per view `disclosure-controls/disclosure-buttons/use-no-more-than-one-disclosure`

## Anatomy and content
The triangle sits at the leading edge: it points inward while content is hidden and down while shown. A disclosure button points down when hidden and up when shown. Clicking either toggles the state and the view resizes to fit (see the source page).

## Platform differences
- **macOS:** no additional considerations.
- **iOS, iPadOS, visionOS:** available through the SwiftUI disclosure group (see the source page).
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] hide detail until relevant, with the frequent options on top `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
- **Desktop web:** [HIG] labeled expanders and one button per view `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using` `disclosure-controls/disclosure-buttons/use-no-more-than-one-disclosure`
- **Slides:** [HIG transfer] put the main point first and keep detail in an appendix `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
- **Card news:** [HIG transfer] lead with the essentials and push detail to later cards `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`

## Related
[Outline views](outline-views.md) · [Lists and tables](lists-and-tables.md) · [Buttons](buttons.md)

