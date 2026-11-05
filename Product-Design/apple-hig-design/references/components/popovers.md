---
slug: popovers
title: "Popovers"
kind: component
group: "Presentation"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/popovers
decision_trees: [alerting-and-confirming]
---

# Popovers

**In one line:** A temporary view that appears next to the control people clicked or tapped, for a few related tasks or small details.

## Why it exists
Some options are needed only for a moment. A popover shows them next to the thing that triggered them, so people keep their place and no permanent space is spent `popovers/best-practices/consider-using-popovers-when-you-want`. It suits Simplicity and Agency: small, local, easy to dismiss.

## Use it when
- A few related tasks or little information are needed, like changing an event's date or calendar `popovers/best-practices/use-a-popover-to-expose-a`
- Temporary content would otherwise take space as a sidebar or panel `popovers/best-practices/consider-using-popovers-when-you-want`
- On a wide iPhone or iPad view with enough room `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`

## Don't use it when
- You need to deliver a warning: use [Alerts](alerts.md) instead `popovers/best-practices/avoid-using-a-popover-to-show`
- The view is compact on iPhone or iPad: use a full-screen modal such as [Sheets](sheets.md) instead `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`
- The content is large: size it to its content or choose another presentation (no HIG alternative named) `popovers/best-practices/avoid-making-a-popover-too-big`

## Cost to the user
A popover is light and dismissible, but it covers part of the screen and sits above other content. Stacking several or hiding the source element makes it costly `popovers/best-practices/show-one-popover-at-a-time` `popovers/best-practices/position-popovers-appropriately`.

## Principles at stake
- **Simplicity:** few tasks, small size, one at a time `popovers/best-practices/use-a-popover-to-expose-a` `popovers/best-practices/show-one-popover-at-a-time`
- **Responsibility:** keep people's work when it closes on its own `popovers/best-practices/always-save-work-when-automatically-closing`
- **Flexibility:** one click can switch between popovers `popovers/best-practices/when-possible-let-people-close-one`

## Key rules
- Limit it to a few related tasks and little information `popovers/best-practices/use-a-popover-to-expose-a`
- Aim the arrow at the source element, and do not cover that element or essential content `popovers/best-practices/position-popovers-appropriately`
- Add Close, Cancel or Done only when it clarifies something like saving; otherwise dismiss on outside click or selection `popovers/best-practices/use-a-close-button-for-confirmation`
- Save work when a nonmodal popover closes automatically; discard only after explicit Cancel `popovers/best-practices/always-save-work-when-automatically-closing`
- Show one popover at a time and never stack them `popovers/best-practices/show-one-popover-at-a-time`
- Allow only an alert above a popover `popovers/best-practices/dont-show-another-view-over-a`
- Let people switch between popovers with one click or tap `popovers/best-practices/when-possible-let-people-close-one`
- Size it to its content, and animate resizing between condensed and expanded views `popovers/best-practices/avoid-making-a-popover-too-big` `popovers/best-practices/provide-a-smooth-transition-when-changing`
- In help text, describe the task, not the word "popover" `popovers/best-practices/avoid-using-the-word-popover-in`

## Platform differences
- **iOS, iPadOS:** keep for wide views and adapt to size class; use a full-screen modal in compact views `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`
- **macOS:** consider letting people detach a popover into a panel, and keep the panel looking like the popover `popovers/platform-considerations/macos/consider-letting-people-detach-a-popover` `popovers/platform-considerations/macos/make-minimal-appearance-changes-to-a`
- **visionOS:** no additional considerations.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] on narrow screens switch to a full-screen sheet `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`
- **Desktop web:** [HIG transfer] anchored popups follow the arrow, one-at-a-time and outside-click rules `popovers/best-practices/show-one-popover-at-a-time`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Alerts](alerts.md) · [Sheets](sheets.md) · [Panels](panels.md) · see [Decision tree](../decision-trees/alerting-and-confirming.md)
