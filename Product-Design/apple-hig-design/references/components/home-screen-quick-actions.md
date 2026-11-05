---
slug: home-screen-quick-actions
title: "Home Screen quick actions"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions
---

# Home Screen quick actions

**In one line:** Shortcuts shown when people touch and hold an app icon, letting them start a valuable task before the app opens.

## Why it exists
People can save steps if the most valuable tasks are one press away from the Home Screen. Quick actions meet the expectation that every app offers at least one useful shortcut `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high`. Clear titles and familiar icons let people predict the result before choosing `home-screen-quick-actions/best-practices/for-each-quick-action-provide-a`.

## Use it when
- A task is valuable and frequent enough that starting from the icon helps, with one to four actions total `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high`
- Actions should adapt to location, activity, time or settings, and the changes stay predictable `home-screen-quick-actions/best-practices/avoid-making-unpredictable-changes-to-quick`

## Don't use it when
- You want to substitute an emoji for the icon: use a symbol or interface icon `home-screen-quick-actions/best-practices/dont-use-an-emoji-in-place`
- Changes would surprise people: keep the set stable or predictable `home-screen-quick-actions/best-practices/avoid-making-unpredictable-changes-to-quick`
- You need more than four shortcuts: choose the highest-value ones (no HIG alternative named) `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high`

## Cost to the user
Low: it appears only on request and saves opening the app first. Unpredictable changing actions or vague titles make it unreliable `home-screen-quick-actions/best-practices/avoid-making-unpredictable-changes-to-quick`.

## Principles at stake
- **Purpose:** only high-value tasks `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high`
- **Familiarity:** recognizable icons and predictable updates `home-screen-quick-actions/best-practices/provide-a-familiar-interface-icon-for` `home-screen-quick-actions/best-practices/avoid-making-unpredictable-changes-to-quick`
- **Simplicity:** brief titles without the app name `home-screen-quick-actions/best-practices/for-each-quick-action-provide-a`
- **Craft:** single-color icons that keep contrast in Dark Mode `home-screen-quick-actions/best-practices/dont-use-an-emoji-in-place`

## Key rules
- Offer at least one useful quick action and up to four `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high`
- Make dynamic updates predictable `home-screen-quick-actions/best-practices/avoid-making-unpredictable-changes-to-quick`
- Write a brief title whose result is obvious; add a subtitle for context, omit the app name, avoid truncation and plan for localization `home-screen-quick-actions/best-practices/for-each-quick-action-provide-a`
- Give every action a recognizable interface icon, preferably an SF Symbol; custom icons follow the Quick Action Icon Template `home-screen-quick-actions/best-practices/provide-a-familiar-interface-icon-for`
- Never swap an emoji in for the symbol or icon (emoji are full color; quick action symbols are single-color) `home-screen-quick-actions/best-practices/dont-use-an-emoji-in-place`

## Platform differences
- **iOS, iPadOS:** supported; the rules above apply to both.
- **Not available on:** macOS (see [Dock menus](dock-menus.md) for the closest idea), tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] app-icon shortcuts exist only on Apple Home Screens; the title and icon rules suit any shortcut list `home-screen-quick-actions/best-practices/for-each-quick-action-provide-a`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Menus](menus.md) · [Dock menus](dock-menus.md)
