---
slug: menus
title: "Menus"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/menus
decision_trees: [alerting-and-confirming, choosing-values]
---

# Menus

**In one line:** A list of commands or choices revealed on demand, which saves space by hiding items until they are needed.

## Why it exists
Interfaces cannot show every command at once. A menu keeps commands out of sight but findable, and lets people learn what exists, even when an item is unavailable `menus/labels/show-people-when-a-menu-item`. Its value depends on scanning: short, well-grouped, clearly worded lists that start with what matters `menus/organization/prefer-listing-important-or-frequently-used`.

## Use it when
- Many commands or options must fit in little space `menus/organization/be-mindful-of-menu-length`
- Related commands can be clustered and ordered so people find them by scanning `menus/organization/consider-grouping-logically-related-items`
- A state toggles and one item with a changing label can express it `menus/toggled-items/consider-using-a-changeable-label-that`

## Don't use it when
- A primary action would be buried: show it as a [Button](buttons.md) `pull-down-buttons/best-practices/avoid-putting-all-of-a-views`
- Choosing one value from a flat set: use a [Pop-up button](pop-up-buttons.md) `pop-up-buttons/best-practices/use-a-pop-up-button-to`
- Commands tied to a button's action: use a [Pull-down button](pull-down-buttons.md) `pull-down-buttons/best-practices/use-a-pull-down-button-to`
- Commands for a specific item opened in place: use a [Context menu](context-menus.md) `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`
- Deep hierarchy: restructure into separate menus, since nested levels are hard to use `menus/submenus/limit-the-depth-and-length-of`

## Cost to the user
A menu hides its contents behind a click or tap, and a long or deeply nested one costs time and attention, so people may miss the command they want `menus/organization/be-mindful-of-menu-length` `menus/submenus/use-submenus-sparingly`.

## Principles at stake
- **Simplicity:** short labels, few icons, sparing submenus `menus/labels/for-each-menu-item-write-a` `menus/icons/use-menu-item-icons-sparingly-and` `menus/submenus/use-submenus-sparingly`
- **Familiarity:** standard icons, title-style capitalization, checkmarks for state `menus/icons/represent-common-actions-consistently` `menus/labels/to-be-consistent-with-platform-experiences` `menus/toggled-items/consider-using-a-checkmark-to-show`
- **Agency:** unavailable items stay visible, and one command can clear many toggles `menus/labels/show-people-when-a-menu-item` `menus/toggled-items/consider-offering-a-menu-item-that`
- **Purpose:** top positions go to important or frequent items `menus/organization/prefer-listing-important-or-frequently-used`

## Key rules
- Word items clearly and briefly, starting actions with a verb `menus/labels/for-each-menu-item-write-a`
- Capitalize labels in title style `menus/labels/to-be-consistent-with-platform-experiences`
- Drop articles such as a, an and the from English labels `menus/labels/remove-articles-like-a-an-and`
- Show unavailable items as inactive, and keep the menu openable even if all items are unavailable `menus/labels/show-people-when-a-menu-item`
- End a label with an ellipsis when the action needs more input first `menus/labels/append-an-ellipsis-to-a-menu`
- Use icons selectively; in one group, give every item an icon or none `menus/icons/use-menu-item-icons-sparingly-and` `menus/icons/apply-a-uniform-visual-treatment-across`
- List important or frequent items first, cluster related ones with separators, and keep a rare variant with its siblings `menus/organization/prefer-listing-important-or-frequently-used` `menus/organization/consider-grouping-logically-related-items` `menus/organization/prefer-keeping-all-logically-related-commands`
- Keep menus short (user-generated lists may be long); use submenus rarely, one level deep, past about five items make a separate menu `menus/organization/be-mindful-of-menu-length` `menus/submenus/limit-the-depth-and-length-of`
- Keep a submenu item openable even if everything inside is unavailable, and show relationships with a submenu, not indentation `menus/submenus/make-sure-a-submenu-remains-available` `menus/submenus/prefer-using-a-submenu-to-indenting`
- Use one flipping label (Show Map, Hide Map) and add a verb if it could read as a state `menus/toggled-items/consider-using-a-changeable-label-that` `menus/toggled-items/include-a-verb-if-a-changeable`

## Platform differences
- **iOS, iPadOS:** use the medium layout for about three key actions and the small layout only for tightly related groups with recognizable symbols `menus/platform-considerations/ios-ipados/choose-a-small-or-medium-menu`
- **visionOS:** show a menu near the content it affects, and default to the subtle breakthrough effect over 3D content `menus/platform-considerations/visionos/prefer-displaying-a-menu-near-the` `menus/platform-considerations/visionos/prefer-the-subtle-breakthrough-effect-in`
- **Games:** let players navigate menus with the device's normal input and check menus stay easy to open and read on every platform `menus/in-game-menus/let-players-navigate-in-game-menus` `menus/in-game-menus/make-sure-your-menus-remain-easy`
- **macOS, tvOS, watchOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] verb labels, grouping, brevity and state handling apply to any menu `menus/labels/for-each-menu-item-write-a`
- **Desktop web:** [HIG] same rules for dropdown and app menus `menus/organization/consider-grouping-logically-related-items`
- **Slides:** [HIG transfer] any list of options: important first, grouped, no articles `menus/organization/prefer-listing-important-or-frequently-used` `menus/labels/remove-articles-like-a-an-and`
- **Card news:** [HIG transfer] same list rules `menus/labels/remove-articles-like-a-an-and`

## Related
[Pop-up buttons](pop-up-buttons.md) · [Pull-down buttons](pull-down-buttons.md) · [Context menus](context-menus.md) · [The menu bar](the-menu-bar.md) · see [Decision tree](../decision-trees/alerting-and-confirming.md) · see [Decision tree](../decision-trees/choosing-values.md)
