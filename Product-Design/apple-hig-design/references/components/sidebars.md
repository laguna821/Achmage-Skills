---
slug: sidebars
title: "Sidebars"
kind: component
group: "Navigation and search"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/sidebars
decision_trees: [navigation-structure]
---

# Sidebars

**In one line:** A panel on the leading edge that lists an app's main areas or top-level collections so people can jump between them.

## Why it exists
People need to see where they are and where else they can go. A sidebar keeps the top-level structure visible at all times, and it can hold deeper content such as folders or playlists. It costs a lot of space, so it fits best when there is room and the structure is rich `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if`. It supports Familiarity (standard symbols and show/hide behavior) and Agency (people can reorder and hide it) `sidebars/best-practices/when-possible-let-people-customize-the`.

## Use it when
- The app has many top-level areas or collections, more than a tab bar can comfortably hold `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first`
- The content is hierarchical, such as folders, and benefits from nested groups `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if`
- Wide windows on Mac or iPad leave room for persistent navigation `sidebars/platform-considerations/macos/consider-automatically-hiding-and-revealing-a`
- A deep visionOS hierarchy needs secondary navigation inside one tab `sidebars/platform-considerations/visionos/if-your-apps-hierarchy-is-deep`

## Don't use it when
- You are designing a first iPhone or iPad navigation: start with a [Tab bars](tab-bars.md) instead, and use its sidebar-style form only for overflow `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first`
- Your data goes deeper than two levels: keep two levels in the sidebar and add a content list between sidebar and detail view (no HIG alternative component named) `sidebars/best-practices/in-general-show-no-more-than`
- The item is a critical action: do not park it at the lower end of a Mac sidebar (no HIG alternative named) `sidebars/platform-considerations/macos/avoid-putting-critical-information-or-actions`

## Cost to the user
A sidebar takes a large share of horizontal and vertical space, which competes with the content. A long, deep list also adds scanning effort, so collapsible groups and a hide option matter `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if` `sidebars/best-practices/consider-letting-people-hide-the-sidebar`.

## Principles at stake
- **Simplicity:** cap the hierarchy at two levels and fold groups away with disclosure controls `sidebars/best-practices/in-general-show-no-more-than`
- **Agency:** let people choose which areas appear, in what order, and whether the sidebar shows `sidebars/best-practices/when-possible-let-people-customize-the`
- **Familiarity:** use familiar symbols and the platform's usual show/hide gestures `sidebars/best-practices/consider-using-familiar-symbols-to-represent`
- **Craft:** content can pass beneath a floating sidebar to show it as a separate layer `sidebars/best-practices/extend-visually-rich-content-beneath-the`

## Key rules
- Let rich content extend beneath a floating sidebar, by horizontal scrolling or a background extension effect `sidebars/best-practices/extend-visually-rich-content-beneath-the`
- Where possible, let people pick which areas show and in what order `sidebars/best-practices/when-possible-let-people-customize-the`
- Nest hierarchy under disclosure controls in content-heavy apps `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if`
- Represent items with familiar symbols; for custom icons, build a symbol, not a bitmap `sidebars/best-practices/consider-using-familiar-symbols-to-represent`
- Allow showing and hiding the sidebar, but do not hide it by default `sidebars/best-practices/consider-letting-people-hide-the-sidebar`
- Show no more than two levels of hierarchy `sidebars/best-practices/in-general-show-no-more-than`
- Title groups with short, descriptive labels `sidebars/best-practices/if-you-need-to-include-two`
- Let icon colors follow the accent color; use fixed colors sparingly for meaning or importance `sidebars/best-practices/make-sure-any-sidebar-icon-colors`

## Platform differences
- **iOS, iPadOS:** begin with a tab bar and use the sidebar-style form for less-used content; outside SwiftUI, apply the collection view list sidebar appearance `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first` `sidebars/platform-considerations/ios-ipados/if-necessary-apply-the-correct-appearance`
- **macOS:** consider collapsing the sidebar when the window shrinks and restoring it when there is room; keep critical items away from the bottom `sidebars/platform-considerations/macos/consider-automatically-hiding-and-revealing-a` `sidebars/platform-considerations/macos/avoid-putting-critical-information-or-actions`
- **visionOS:** place a sidebar inside a tab for secondary navigation, and do not let its choices switch the open tab `sidebars/platform-considerations/visionos/if-your-apps-hierarchy-is-deep`
- **tvOS:** no additional considerations.
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] a drawer menu follows the same limits on depth, labels and optional hiding; prefer a bottom tab bar first `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first`
- **Desktop web:** [HIG] a left-side navigation follows the two-level cap, disclosure groups, and user-controlled hiding `sidebars/best-practices/in-general-show-no-more-than` `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Tab bars](tab-bars.md) · [Split views](https://developer.apple.com/design/human-interface-guidelines/split-views) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · see [Decision tree](../decision-trees/navigation-structure.md)
