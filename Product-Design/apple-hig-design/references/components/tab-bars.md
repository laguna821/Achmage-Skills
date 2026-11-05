---
slug: tab-bars
title: "Tab bars"
kind: component
group: "Navigation and search"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/tab-bars
decision_trees: [navigation-structure]
---

# Tab bars

**In one line:** A persistent bar of icon-and-label buttons for switching between an app's top-level sections.

## Why it exists
People should always know the main sections of an app and move between them in one tap. A tab bar stays on screen so the structure is never hidden, and it is only for navigation, not for acting on content `tab-bars/best-practices/use-a-tab-bar-to-support` `tab-bars/best-practices/make-sure-the-tab-bar-is`. It serves Familiarity and Simplicity: a few labeled destinations, always visible.

## Use it when
- The app has a handful of top-level sections people switch between often `tab-bars/best-practices/use-a-tab-bar-to-support`
- On iPad, you want default navigation that people can later switch to a sidebar `tab-bars/platform-considerations/ipados/prefer-a-tab-bar-for-navigation`
- A tvOS live-viewing app organizes live, recorded and other content `tab-bars/platform-considerations/tvos/in-a-live-viewing-app-organize`

## Don't use it when
- You need controls that act on the current view: use a toolbar (no HIG card in this set; see the Toolbars page) `tab-bars/best-practices/use-a-tab-bar-to-support`
- The structure is complex, with many sections: consider a [Sidebars](sidebars.md) or an adaptive tab bar `tab-bars/best-practices/use-the-appropriate-number-of-tabs`
- A section is empty or unavailable: do not hide or disable its tab, explain the empty state instead `tab-bars/best-practices/dont-disable-or-hide-tab-bar`

## Cost to the user
Each added tab adds complexity and makes every tab harder to pick `tab-bars/best-practices/use-the-appropriate-number-of-tabs`. A More tab hides destinations behind an extra step `tab-bars/best-practices/avoid-overflow-tabs`. Badges pull attention, so spend them carefully `tab-bars/best-practices/use-a-badge-to-indicate-that`.

## Principles at stake
- **Simplicity:** fewer tabs, one-word labels, badges only for critical news `tab-bars/best-practices/include-tab-labels-to-help-with` `tab-bars/best-practices/use-a-badge-to-indicate-that`
- **Familiarity:** a consistent, always-visible bar with symbols plus labels `tab-bars/best-practices/make-sure-the-tab-bar-is` `tab-bars/best-practices/consider-using-sf-symbols-to-provide`
- **Agency:** on iPad, people can add or remove tab items `tab-bars/platform-considerations/ipados/let-people-customize-the-tab-bar`
- **Craft:** label color must stay distinct from the content behind it `tab-bars/best-practices/avoid-applying-a-similar-color-to`

## Key rules
- Use tabs only for top-level sections; put view actions in a toolbar `tab-bars/best-practices/use-a-tab-bar-to-support`
- Keep the bar visible while people move between sections, except under a temporary modal view `tab-bars/best-practices/make-sure-the-tab-bar-is`
- Pick the tab count by weighing complexity against need `tab-bars/best-practices/use-the-appropriate-number-of-tabs`
- Minimize the collapse into a More tab `tab-bars/best-practices/avoid-overflow-tabs`
- Keep every tab visible and enabled; explain empty sections `tab-bars/best-practices/dont-disable-or-hide-tab-bar`
- Add a label to each icon, one word if possible `tab-bars/best-practices/include-tab-labels-to-help-with`
- Prefer filled symbols so icons adapt between layouts [House] icons come from `../icons.md` `tab-bars/best-practices/consider-using-sf-symbols-to-provide`
- Badge a tab only for new or updated critical information `tab-bars/best-practices/use-a-badge-to-indicate-that`
- Avoid label colors close to the content background `tab-bars/best-practices/avoid-applying-a-similar-color-to`

## Platform differences
- **iPadOS:** make the tab bar the default and let people switch to a sidebar; allow adding and removing items, keeping the default list short `tab-bars/platform-considerations/ipados/prefer-a-tab-bar-for-navigation` `tab-bars/platform-considerations/ipados/let-people-customize-the-tab-bar`
- **tvOS:** the bar scrolls away on single-view tabs but stays with split views; Menu returns focus to it; live apps order live first, then recorded, then the rest `tab-bars/platform-considerations/tvos/be-aware-of-tab-bar-scrolling` `tab-bars/platform-considerations/tvos/in-a-live-viewing-app-organize`
- **visionOS:** give every tab a symbol and a short label; for deep hierarchy, put a sidebar inside a tab without it switching the tab `tab-bars/platform-considerations/visionos/supply-a-symbol-and-a-text` `tab-bars/platform-considerations/visionos/if-it-makes-sense-in-your`
- **macOS:** no additional considerations.
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] a bottom navigation bar follows the same rules: top-level only, always visible, labeled `tab-bars/best-practices/use-a-tab-bar-to-support` `tab-bars/best-practices/include-tab-labels-to-help-with`
- **Desktop web:** [HIG transfer] a top nav of sections keeps labels, no hidden items, and badges only for critical news `tab-bars/best-practices/dont-disable-or-hide-tab-bar`
- **Slides:** [HIG none]
- **Card news:** [HIG transfer] the label-color contrast rule suits colorful backgrounds `tab-bars/best-practices/avoid-applying-a-similar-color-to`

## Related
[Sidebars](sidebars.md) · [Page controls](page-controls.md) · see [Decision tree](../decision-trees/navigation-structure.md)
