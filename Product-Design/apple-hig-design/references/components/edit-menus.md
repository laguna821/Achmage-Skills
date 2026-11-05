---
slug: edit-menus
title: "Edit menus"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/edit-menus
decision_trees: [alerting-and-confirming]
---

# Edit menus

**In one line:** The system menu of text and content editing commands (cut, copy, paste, select, delete) shown on selected or editable content.

## Why it exists
Editing commands are among the most familiar in any app. The system edit menu gives people the same commands, gestures and shortcuts everywhere, so they do not learn a custom interaction for a standard task `edit-menus/best-practices/let-people-reveal-an-edit-menu`. Edit actions run without confirmation, so undo and redo are what keep people in control `edit-menus/best-practices/support-undo-and-redo-when-possible`.

## Use it when
- People edit text or other content and need cut, copy, paste and related commands `edit-menus/best-practices/prefer-the-system-provided-edit-menu`
- You have a few custom commands that belong beside related system ones `edit-menus/best-practices/list-custom-commands-near-relevant-system`
- Static text, such as a caption or status, is worth copying into messages, notes or searches `edit-menus/best-practices/when-it-makes-sense-let-people`

## Don't use it when
- You are tempted to build a custom menu with the same commands: use the system one `edit-menus/best-practices/prefer-the-system-provided-edit-menu`
- On iOS or iPadOS the same item already has a [Context menu](context-menus.md): choose one, not both `context-menus/platform-considerations/ios-ipados/provide-either-a-context-menu-or`
- You want extra buttons duplicating edit commands: avoid them, since people expect the menu and standard shortcuts `edit-menus/best-practices/in-general-avoid-implementing-other-controls`
- The text is a control label: do not make it selectable `edit-menus/best-practices/when-it-makes-sense-let-people`

## Cost to the user
Very low: people already know it. Risk comes from custom reveal gestures, or from too many custom commands that overwhelm `edit-menus/best-practices/let-people-reveal-an-edit-menu` `edit-menus/best-practices/list-custom-commands-near-relevant-system`.

## Principles at stake
- **Familiarity:** system component, system gestures, expected command order `edit-menus/best-practices/prefer-the-system-provided-edit-menu` `edit-menus/best-practices/list-custom-commands-near-relevant-system`
- **Agency:** undo and redo, and selectable static text `edit-menus/best-practices/support-undo-and-redo-when-possible` `edit-menus/best-practices/when-it-makes-sense-let-people`
- **Simplicity:** only relevant commands, no duplicate controls `edit-menus/best-practices/offer-commands-that-are-relevant-in` `edit-menus/best-practices/in-general-avoid-implementing-other-controls`

## Key rules
- Use the built-in edit menu rather than a custom one `edit-menus/best-practices/prefer-the-system-provided-edit-menu`
- Reveal it with the standard gestures for each platform `edit-menus/best-practices/let-people-reveal-an-edit-menu`
- Show only commands that apply now, such as Copy only with a selection `edit-menus/best-practices/offer-commands-that-are-relevant-in`
- Put custom commands right after related system commands, and keep the count modest `edit-menus/best-practices/list-custom-commands-near-relevant-system`
- Support undo and redo for edit menu actions `edit-menus/best-practices/support-undo-and-redo-when-possible`
- Avoid extra controls that duplicate edit commands `edit-menus/best-practices/in-general-avoid-implementing-other-controls`
- Distinguish deletion variants when needed, such as Delete versus Cut `edit-menus/best-practices/differentiate-different-types-of-deletion-commands`
- Name custom commands with a verb or brief verb phrase `edit-menus/content/create-short-labels-for-custom-commands`

## Platform differences
- **iOS, iPadOS:** check that the menu works in both the compact horizontal and vertical styles, and move its placement if the default would cover important content `edit-menus/platform-considerations/ios-ipados/ensure-your-edit-menu-works-well` `edit-menus/platform-considerations/ios-ipados/adjust-an-edit-menus-placement-if`
- **macOS, visionOS:** no additional considerations.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] keep native text selection and its menu rather than replacing it `edit-menus/best-practices/prefer-the-system-provided-edit-menu`
- **Desktop web:** [HIG] keep standard copy and paste behavior and make static text selectable `edit-menus/best-practices/when-it-makes-sense-let-people`
- **Slides:** [HIG transfer] verb labels for any on-slide command `edit-menus/content/create-short-labels-for-custom-commands`
- **Card news:** [HIG transfer] same verb-label rule `edit-menus/content/create-short-labels-for-custom-commands`

## Related
[Menus](menus.md) · [Context menus](context-menus.md) · [The menu bar](the-menu-bar.md) · [Undo and redo](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo) · see [Decision tree](../decision-trees/alerting-and-confirming.md)
