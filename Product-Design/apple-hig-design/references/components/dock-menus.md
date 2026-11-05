---
slug: dock-menus
title: "Dock menus"
kind: component
group: "Menus and actions"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/dock-menus
---

# Dock menus

**In one line:** The menu that appears from an app's Dock icon, used for jumping to windows or acting without bringing the app forward.

## Why it exists
People can reach an app from the Dock while working elsewhere. A Dock menu lets them jump straight to a window or run a top action without first opening the app, which saves steps `dock-menus/best-practices/prefer-high-value-custom-items-for`. Not everyone uses it, so it supplements other routes and never replaces them `dock-menus/best-practices/make-custom-dock-menu-items-available`.

## Use it when
- People often need an open window or a top action while the app is not frontmost `dock-menus/best-practices/prefer-high-value-custom-items-for`
- You want a convenient shortcut that duplicates commands available elsewhere `dock-menus/best-practices/make-custom-dock-menu-items-available`

## Don't use it when
- A command would exist only in the Dock menu: also place it in the menu bar or the interface, see [The menu bar](the-menu-bar.md) `dock-menus/best-practices/make-custom-dock-menu-items-available`
- The item is low value or only useful inside the app: leave it out of the Dock menu `dock-menus/best-practices/prefer-high-value-custom-items-for`

## Cost to the user
Almost none: it is optional and appears only on request. The risk is hidden functionality, which is why each command needs another route `dock-menus/best-practices/make-custom-dock-menu-items-available`.

## Principles at stake
- **Purpose:** include only items valuable when the app is in the background `dock-menus/best-practices/prefer-high-value-custom-items-for`
- **Flexibility:** people who skip the Dock menu still reach every command `dock-menus/best-practices/make-custom-dock-menu-items-available`
- **Simplicity:** a short, high-value list `dock-menus/best-practices/prefer-high-value-custom-items-for`

## Key rules
- Offer each custom Dock menu command somewhere else too, such as a menu bar menu or the interface `dock-menus/best-practices/make-custom-dock-menu-items-available`
- Fill the menu with valuable items, such as open windows and top actions useful when the app is not frontmost `dock-menus/best-practices/prefer-high-value-custom-items-for`

## Platform differences
- **macOS:** the only supported platform. The HIG page gives just these two rules, and the menu bar page suggests a Dock menu as a second route for menu bar extras `the-menu-bar/platform-considerations/macos/menu-bar-extras/consider-exposing-app-specific-functionality-in`
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS. For the iOS equivalent see [Home Screen quick actions](home-screen-quick-actions.md).

## In other media
- **Mobile (any OS) and mobile web:** [HIG none]
- **Desktop web:** [HIG none] no Dock exists; the lesson that shortcuts must duplicate, not replace, regular routes is [HIG transfer] `dock-menus/best-practices/make-custom-dock-menu-items-available`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Menus](menus.md) · [Home Screen quick actions](home-screen-quick-actions.md) · [The menu bar](the-menu-bar.md)
