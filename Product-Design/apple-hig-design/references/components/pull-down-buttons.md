---
slug: pull-down-buttons
title: "Pull-down buttons"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons
decision_trees: [choosing-values]
---

# Pull-down buttons

**In one line:** A button that opens a menu of commands related to its action, such as what to add or how to sort.

## Why it exists
A view often has related actions that would clutter the interface as separate buttons. A pull-down button folds them into one menu that refines the button's target or behavior `pull-down-buttons/best-practices/use-a-pull-down-button-to`. The trade-off is discoverability, so primary actions should stay visible `pull-down-buttons/best-practices/avoid-putting-all-of-a-views`.

## Use it when
- Commands relate to the button's action, such as choosing what to add or how to sort `pull-down-buttons/best-practices/use-a-pull-down-button-to`
- You have at least three items worth a menu `pull-down-buttons/best-practices/balance-menu-length-with-ease-of`
- On iOS and iPadOS, lower-priority items can go into a More button when space is tight `pull-down-buttons/platform-considerations/ios-ipados/consider-using-a-more-pull-down`

## Don't use it when
- Choosing one non-command option from a flat set: use a [Pop-up button](pop-up-buttons.md) instead `pull-down-buttons/best-practices/use-a-pull-down-button-to`
- You have one or two items: use buttons, toggles or switches (see [Buttons](buttons.md), [Toggles](toggles.md)) `pull-down-buttons/best-practices/balance-menu-length-with-ease-of`
- It would hide all of a view's actions: show primary actions directly `pull-down-buttons/best-practices/avoid-putting-all-of-a-views`
- On visionOS, in a toolbar: avoid it (see [Toolbars](toolbars.md)) `toolbars/platform-considerations/visionos/avoid-using-a-pull-down-menu`

## Cost to the user
Opening the menu is an extra step, and a More button gives little hint of its contents `pull-down-buttons/platform-considerations/ios-ipados/consider-using-a-more-pull-down`. Very long menus slow finding an item `pull-down-buttons/best-practices/balance-menu-length-with-ease-of`.

## Principles at stake
- **Simplicity:** one button replaces several, with no needless menu title `pull-down-buttons/best-practices/use-a-pull-down-button-to` `pull-down-buttons/best-practices/display-a-succinct-menu-title-only`
- **Agency:** primary actions stay discoverable `pull-down-buttons/best-practices/avoid-putting-all-of-a-views`
- **Responsibility:** destructive items are flagged and confirmed `pull-down-buttons/best-practices/let-people-know-when-a-pull`
- **Familiarity:** icons that clarify meaning `pull-down-buttons/best-practices/include-an-interface-icon-with-a`

## Key rules
- Use for commands tied to the button's action; use pop-up for non-command exclusive choices `pull-down-buttons/best-practices/use-a-pull-down-button-to`
- Do not hide every action of a view in one pull-down `pull-down-buttons/best-practices/avoid-putting-all-of-a-views`
- Give the menu at least three items and avoid very long ones `pull-down-buttons/best-practices/balance-menu-length-with-ease-of`
- Add a menu title only when it adds real meaning `pull-down-buttons/best-practices/display-a-succinct-menu-title-only`
- Mark destructive items (red text) and require confirmation: an action sheet on iOS, a popover on iPadOS `pull-down-buttons/best-practices/let-people-know-when-a-pull`
- Add an icon after the label when it clarifies meaning, preferably an SF Symbol `pull-down-buttons/best-practices/include-an-interface-icon-with-a`

## Platform differences
- **iOS, iPadOS:** a More pull-down button holds lower-priority items; weigh compactness against reduced discoverability `pull-down-buttons/platform-considerations/ios-ipados/consider-using-a-more-pull-down`
- **macOS, visionOS:** no additional considerations.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] action menus with three or more items and flagged destructive items `pull-down-buttons/best-practices/balance-menu-length-with-ease-of`
- **Desktop web:** [HIG] the same rules for action dropdowns `pull-down-buttons/best-practices/use-a-pull-down-button-to`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Pop-up buttons](pop-up-buttons.md) · [Buttons](buttons.md) · [Menus](menus.md) · see [Decision tree](../decision-trees/choosing-values.md)
