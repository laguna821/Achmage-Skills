---
slug: context-menus
title: "Context menus"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/context-menus
decision_trees: [alerting-and-confirming]
---

# Context menus

**In one line:** A hidden shortcut menu, opened on an item, that lists the commands most likely needed for that item right now.

## Why it exists
People often want a quick action on one thing without leaving their place or hunting for a toolbar button. A context menu brings the likely commands to the item itself `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`. Because it is hidden, it can only be a shortcut: every command must also be reachable another way `context-menus/best-practices/always-make-context-menu-items-available`.

## Use it when
- An item has a few commands most likely needed in the current context `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`
- You want quick access without adding permanent controls, applied consistently across the app `context-menus/best-practices/support-context-menus-consistently-throughout-your`
- On visionOS, frequent functions would otherwise need a separate panel or inspector window `context-menus/platform-considerations/visionos/consider-using-a-context-menu-instead`
- On iPadOS, people may create new objects from a long press or secondary click `context-menus/platform-considerations/ios-ipados/in-ipados-consider-using-a-context`

## Don't use it when
- A command exists only here: also offer it in a toolbar, the menu bar or the interface `context-menus/best-practices/always-make-context-menu-items-available`
- The item is text where people expect cut, copy and paste on iOS or iPadOS: use an [Edit menu](edit-menus.md), never both on the same item `context-menus/platform-considerations/ios-ipados/provide-either-a-context-menu-or`
- You need a menu from a visible button: use a [Pull-down button](pull-down-buttons.md) or [Pop-up button](pop-up-buttons.md) instead `menus/organization/be-mindful-of-menu-length`
- You would list rare or advanced commands: leave them out and keep them in the main menus `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`

## Cost to the user
Low when small and relevant. The cost is discoverability: people must know to open it, so a menu available on some items but not others makes the feature feel broken `context-menus/best-practices/support-context-menus-consistently-throughout-your`. Long menus are hard to scan and scroll `context-menus/best-practices/aim-for-a-small-number-of`.

## Principles at stake
- **Purpose:** show what is likely needed now, nothing more `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`
- **Simplicity:** few items, at most about three groups, one submenu level `context-menus/best-practices/aim-for-a-small-number-of` `context-menus/best-practices/follow-best-practices-for-using-separators`
- **Agency:** every command has another route `context-menus/best-practices/always-make-context-menu-items-available`
- **Responsibility:** destructive items are last and flagged; titles and previews confirm the target `context-menus/best-practices/in-ios-ipados-and-visionos-warn` `context-menus/content/include-a-title-in-a-context`

## Key rules
- Choose the commands most likely needed in context; omit advanced or rarely used ones `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`
- Keep the item count small `context-menus/best-practices/aim-for-a-small-number-of`
- Support context menus consistently throughout the app `context-menus/best-practices/support-context-menus-consistently-throughout-your`
- Nest at most one submenu level, titled so people can guess its contents `context-menus/best-practices/if-you-need-to-use-submenus`
- Remove inapplicable items instead of dimming them (on macOS, Cut, Copy and Paste may appear dimmed) `context-menus/best-practices/hide-unavailable-menu-items-dont-dim`
- Put the most-used items nearest where the menu opens, flipping the order if it opens above `context-menus/best-practices/aim-to-place-the-most-frequently`
- Show keyboard shortcuts in the main menus, not here `context-menus/best-practices/show-keyboard-shortcuts-in-your-apps`
- Group with separators, no more than about three groups `context-menus/best-practices/follow-best-practices-for-using-separators`
- Add a title only when it clarifies what is affected, such as the count of selected items `context-menus/content/include-a-title-in-a-context`
- Use the system's familiar icons for common commands such as Copy, Share and Delete `context-menus/content/represent-menu-item-actions-with-familiar`

## Platform differences
- **iOS, iPadOS, visionOS:** put data-destroying items last and mark them destructive `context-menus/best-practices/in-ios-ipados-and-visionos-warn`
- **iOS, iPadOS:** attach a context menu or an edit menu, not both; show a preview of the target item, with the clipping path matching the image shape `context-menus/platform-considerations/ios-ipados/provide-either-a-context-menu-or` `context-menus/platform-considerations/ios-ipados/prefer-a-graphical-preview-that-clarifies` `context-menus/platform-considerations/ios-ipados/ensure-that-your-preview-looks-good`
- **visionOS:** keep the menu no taller than its window; tune the item count to how people use the app `context-menus/platform-considerations/visionos/in-general-avoid-letting-a-context`
- **macOS, tvOS:** no additional considerations.
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] long-press menus follow the same relevance and brevity rules `context-menus/best-practices/aim-for-a-small-number-of`
- **Desktop web:** [HIG] right-click menus: relevant, short, consistent, with commands also available elsewhere `context-menus/best-practices/always-make-context-menu-items-available`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Menus](menus.md) · [Edit menus](edit-menus.md) · [Pop-up buttons](pop-up-buttons.md) · [Pull-down buttons](pull-down-buttons.md) · see [Decision tree](../decision-trees/alerting-and-confirming.md)
