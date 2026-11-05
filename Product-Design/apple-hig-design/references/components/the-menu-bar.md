---
slug: the-menu-bar
title: "The menu bar"
kind: component
group: "Menus and actions"
platforms: [iPadOS, macOS]
source: https://developer.apple.com/design/human-interface-guidelines/the-menu-bar
---

# The menu bar

**In one line:** The always-available strip of menus along the top of the screen that lists every command an app supports.

## Why it exists
People look to the menu bar for commands. A complete, predictable menu bar teaches what an app can do, enables keyboard shortcuts and Full Keyboard Access, and gives a place for every command no matter where else it appears `the-menu-bar/app-specific-menus/provide-app-specific-menus-for-custom`. Sameness is the point: the same items, standard menus and standard shortcuts `the-menu-bar/best-practices/always-show-the-same-set-of`.

## Use it when
- Your Mac or iPad app has commands, including rare or advanced ones, that need a findable home `the-menu-bar/app-specific-menus/provide-app-specific-menus-for-custom`
- You need keyboard shortcuts for commands, standard where they exist `the-menu-bar/best-practices/support-the-keyboard-shortcuts-defined-for`
- On macOS, a persistent status item suits your app, as a menu bar extra `the-menu-bar/platform-considerations/macos/menu-bar-extras/display-a-menu-not-a-popover`

## Don't use it when
- A function would be reachable only through the menu bar on iPadOS: it is often hidden in full screen, so also provide regular UI `the-menu-bar/platform-considerations/ipados/because-the-menu-bar-is-often`
- You depend on a menu bar extra being visible: also offer a [Dock menu](dock-menus.md) `the-menu-bar/platform-considerations/macos/menu-bar-extras/avoid-relying-on-the-presence-of` `the-menu-bar/platform-considerations/macos/menu-bar-extras/consider-exposing-app-specific-functionality-in`
- You would hide unavailable items: disable them instead `the-menu-bar/best-practices/always-show-the-same-set-of`
- A dynamic item is the only route to an action: provide another way `the-menu-bar/dynamic-menu-items/avoid-making-a-dynamic-menu-item`

## Cost to the user
Essentially none for menus people already know. Cost comes from nonstandard order, hidden items, or dynamic items that people never discover `the-menu-bar/best-practices/support-the-default-system-defined-menus` `the-menu-bar/dynamic-menu-items/avoid-making-a-dynamic-menu-item`.

## Principles at stake
- **Familiarity:** standard menus, order, titles and shortcuts `the-menu-bar/best-practices/support-the-default-system-defined-menus` `the-menu-bar/best-practices/support-the-keyboard-shortcuts-defined-for`
- **Agency:** people control menu bar extras, and no command is trapped in one route `the-menu-bar/platform-considerations/macos/menu-bar-extras/let-people-not-your-app-decide` `the-menu-bar/dynamic-menu-items/avoid-making-a-dynamic-menu-item`
- **Flexibility:** keyboard access, one-modifier dynamic items `the-menu-bar/window-menu/provide-a-window-menu-even-if` `the-menu-bar/dynamic-menu-items/require-only-a-single-modifier-key`
- **Simplicity:** one-word titles, hierarchy-mirroring order `the-menu-bar/best-practices/prefer-short-one-word-menu-titles` `the-menu-bar/app-specific-menus/as-much-as-possible-reflect-your`

## Key rules
- Include the standard system menus in their usual order `the-menu-bar/best-practices/support-the-default-system-defined-menus`
- Always show the same items, disabling those that do not apply `the-menu-bar/best-practices/always-show-the-same-set-of`
- Honor standard shortcuts for standard items; add custom ones only when needed `the-menu-bar/best-practices/support-the-keyboard-shortcuts-defined-for`
- Name menus with one short word where possible `the-menu-bar/best-practices/prefer-short-one-word-menu-titles`
- List all custom commands in app-specific menus, ordered to mirror the app's hierarchy and from broadest to most specialized `the-menu-bar/app-specific-menus/provide-app-specific-menus-for-custom` `the-menu-bar/app-specific-menus/as-much-as-possible-reflect-your` `the-menu-bar/app-specific-menus/aim-to-list-app-specific-menus`
- Put About first in the app menu, alone above a separator `the-menu-bar/app-menu/display-the-about-menu-item-first`
- Always include a View menu and a Window menu (with Minimize and Zoom), even for simple apps `the-menu-bar/view-menu/provide-a-view-menu-even-if` `the-menu-bar/window-menu/provide-a-window-menu-even-if`
- Title show/hide items for the current state, such as Show Toolbar `the-menu-bar/view-menu/ensure-that-each-show-hide-item`
- Keep dynamic items as shortcuts for advanced actions, mostly in menu bar menus, revealed by one modifier key `the-menu-bar/dynamic-menu-items/use-dynamic-menu-items-primarily-in` `the-menu-bar/dynamic-menu-items/require-only-a-single-modifier-key`

## Platform differences
- **macOS:** menu bar extras use a symbol drawn in black and clear (menu bar height is 24 pt), open a menu not a popover unless too complex, are optional for the user, and are not guaranteed visible `the-menu-bar/platform-considerations/macos/menu-bar-extras/consider-using-a-symbol-to-represent` `the-menu-bar/platform-considerations/macos/menu-bar-extras/display-a-menu-not-a-popover` `the-menu-bar/platform-considerations/macos/menu-bar-extras/let-people-not-your-app-decide`
- **iPadOS:** make every function reachable in regular UI, use submenus more readily than on Mac, consider listing tabs in the View menu, and use Settings only to open the app's page in system Settings `the-menu-bar/platform-considerations/ipados/because-the-menu-bar-is-often` `the-menu-bar/platform-considerations/ipados/consider-grouping-menu-items-into-submenus` `the-menu-bar/platform-considerations/ipados/for-apps-with-tab-style-navigation` `the-menu-bar/platform-considerations/ipados/reserve-the-yourappname-settings-menu-item`
- **Not available on:** iOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none] no menu bar; keep every function reachable in regular UI `the-menu-bar/platform-considerations/ipados/because-the-menu-bar-is-often`
- **Desktop web:** [HIG transfer] a web app with a top menu bar should keep stable items, standard shortcuts and one-word titles `the-menu-bar/best-practices/always-show-the-same-set-of`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Menus](menus.md) · [Dock menus](dock-menus.md) · [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
