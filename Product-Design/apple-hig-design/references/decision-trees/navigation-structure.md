---
tree: navigation-structure
title: "Structuring navigation"
members: [tab-bars, sidebars, toolbars, segmented-controls, split-views, tab-views, page-controls]
---

# Decision tree: Structuring navigation

**Use this when:** people need to move between sections, levels, views or pages of your design, and you must pick the structure that shows where they are.
**Members:** [Tab bars](../components/tab-bars.md) · [Sidebars](../components/sidebars.md) · [Toolbars](../components/toolbars.md) · [Segmented controls](../components/segmented-controls.md) · [Split views](../components/split-views.md) · [Tab views](../components/tab-views.md) · [Page controls](../components/page-controls.md)
**Related patterns:** [Searching](https://developer.apple.com/design/human-interface-guidelines/searching) · [Going full screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)

## Start with the need
1. **Do people need to jump between the main sections of the whole app, often?**
   - Yes, a handful of sections → [Tab bars](../components/tab-bars.md): top-level only, always visible, labeled `tab-bars/best-practices/use-a-tab-bar-to-support` `tab-bars/best-practices/make-sure-the-tab-bar-is`
   - Yes, but there are many sections or nested collections → go to 2
   - No, they step through a sequence or switch views inside one screen → go to 3
2. **Is there room, and is the structure rich (folders, collections, many areas)?**
   - Yes, on a wide Mac or iPad window → [Sidebars](../components/sidebars.md), at most two levels, with disclosure groups and a way to hide it `sidebars/best-practices/in-general-show-no-more-than` `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if` `sidebars/best-practices/consider-letting-people-hide-the-sidebar`
   - First iPhone or iPad navigation → start with a tab bar, and keep the sidebar form for less-used content `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first`
   - On iPad and unsure → default to a tab bar that people can switch to a sidebar `tab-bars/platform-considerations/ipados/prefer-a-tab-bar-for-navigation`
   - The data goes deeper than two levels → keep two in the sidebar and add a content list before the detail view `sidebars/best-practices/in-general-show-no-more-than`
3. **Do people need to see several levels of content side by side (list, then detail)?**
   - Yes, in a regular-width space → [Split views](../components/split-views.md), with the selection highlighted in each pane `split-views/best-practices/to-support-navigation-persistently-highlight-the` `split-views/platform-considerations/ios/prefer-using-a-split-view-in`
   - Compact space such as iPhone portrait → do not split; the HIG names no replacement `split-views/platform-considerations/ios/prefer-using-a-split-view-in`
   - No → go to 4
4. **Do people need to act on the current view, or confirm where they are (Back, Close, title)?**
   - Yes → [Toolbars](../components/toolbars.md): frequent actions, standard Back and Close, a short title `toolbars/actions/provide-actions-that-support-the-main` `toolbars/navigation/use-the-standard-back-and-close` `toolbars/titles/write-a-concise-title`
   - Too many items → cut items first; use a More menu only if necessary `toolbars/best-practices/choose-items-deliberately-to-avoid-overcrowding` `toolbars/best-practices/add-a-more-menu-to-contain`
   - No → go to 5
5. **Do people switch between a few closely related views or options of the same content?**
   - On iOS or iPadOS → [Segmented controls](../components/segmented-controls.md) for related subviews; use a tab bar for separate sections `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch`
   - On macOS, switching panes in the main window → [Tab views](../components/tab-views.md), six tabs or fewer `segmented-controls/platform-considerations/macos/use-a-tab-view-in-the` `tab-views/best-practices/avoid-providing-more-than-six-tabs`
   - On macOS, in a toolbar or inspector → a segmented control, about five to seven segments when wide `segmented-controls/platform-considerations/macos/use-a-tab-view-in-the` `segmented-controls/best-practices/limit-the-number-of-segments-in`
   - On Apple TV, filtering a screen → a split view `segmented-controls/platform-considerations/tvos/consider-using-a-split-view-instead`
   - No → go to 6
6. **Is the content a short, ordered series of peer pages?**
   - Yes → [Page controls](../components/page-controls.md): dots centered near the bottom `page-controls/best-practices/use-page-controls-to-represent-movement` `page-controls/best-practices/center-a-page-control-at-the`
   - Past about ten pages → use a grid with any-order access `page-controls/best-practices/although-page-controls-can-handle-any`
   - Hierarchical or nonsequential → back to 1 or 2 `page-controls/best-practices/use-page-controls-to-represent-movement`
7. **Do people need to find things rather than browse?**
   - Yes → not a navigation structure; follow the [Searching](https://developer.apple.com/design/human-interface-guidelines/searching) pattern: give search a prominent place, such as a toolbar or a dedicated tab `searching/best-practices/if-search-is-important-give-it` `searching/best-practices/aim-to-make-your-apps-content`
8. **Do people need focus, away from all navigation?**
   - Yes → offer full screen as a choice, and keep essential controls easy to reveal `going-full-screen/best-practices/support-full-screen-mode-when-it` `going-full-screen/best-practices/continue-to-provide-access-to-essential`

## At a glance
| Component | Scope | Always visible | Count guidance | Best for | Avoid when |
| --- | --- | --- | --- | --- | --- |
| Tab bars | Whole app | Yes `tab-bars/best-practices/make-sure-the-tab-bar-is` | Weigh complexity against need; avoid a More tab `tab-bars/best-practices/avoid-overflow-tabs` | A few top-level sections | Acting on content `tab-bars/best-practices/use-a-tab-bar-to-support` |
| Sidebars | Whole app | Hideable, not hidden by default `sidebars/best-practices/consider-letting-people-hide-the-sidebar` | Two levels at most | Rich hierarchy, wide windows | Compact first navigation `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first` |
| Toolbars | One view or window | Usually | Few items, about three groups `toolbars/item-groupings/minimize-the-number-of-groups` | Actions, Back, title | Crowding `toolbars/best-practices/choose-items-deliberately-to-avoid-overcrowding` |
| Segmented controls | One object or view | Yes | About five to seven, about five on iPhone `segmented-controls/best-practices/limit-the-number-of-segments-in` | Related options or subviews | Separate app sections on iOS |
| Split views | Hierarchy of lists | Panes can hide on Mac `split-views/platform-considerations/macos/consider-letting-people-hide-a-pane` | Two or three panes | Level-to-detail browsing | Compact width |
| Tab views | One window area | Yes | Six or fewer `tab-views/best-practices/avoid-providing-more-than-six-tabs` | Mac panes | iOS, iPadOS |
| Page controls | Flat sequence | Yes | Under about ten `page-controls/best-practices/although-page-controls-can-handle-any` | Ordered peer pages | Hierarchy, macOS |

## Platform notes
- **iPadOS:** a toolbar and tab bar can share the top row, and people can customize tabs `toolbars/platform-considerations/ipados/consider-combining-a-toolbar-with-a` `tab-bars/platform-considerations/ipados/let-people-customize-the-tab-bar`
- **macOS:** collapse the sidebar as the window shrinks; offer every toolbar item as a menu command `sidebars/platform-considerations/macos/consider-automatically-hiding-and-revealing-a` `toolbars/platform-considerations/macos/make-every-toolbar-item-available-as`
- **visionOS:** for deep hierarchy, put a sidebar inside a tab without switching the tab `tab-bars/platform-considerations/visionos/if-it-makes-sense-in-your` `sidebars/platform-considerations/visionos/if-your-apps-hierarchy-is-deep`
- **watchOS:** no tab bar or sidebar; vertical pages use page controls `page-controls/platform-considerations/watchos/use-vertical-pagination-to-separate-multiple`
- **tvOS:** the tab bar scrolls away on single-view tabs `tab-bars/platform-considerations/tvos/be-aware-of-tab-bar-scrolling`

## Common mistakes
- **Putting actions in a tab bar:** move them to a toolbar `tab-bars/best-practices/use-a-tab-bar-to-support`
- **Hiding or disabling a tab when empty:** keep it and explain the empty state `tab-bars/best-practices/dont-disable-or-hide-tab-bar`
- **A sidebar three levels deep:** cap at two and add a content list `sidebars/best-practices/in-general-show-no-more-than`
- **Mixing action and selection segments:** keep one kind `segmented-controls/best-practices/keep-control-types-consistent-within-a`
- **Dots for a long or hierarchical set:** use a grid or a sidebar `page-controls/best-practices/although-page-controls-can-handle-any`
- **App name as window title:** use a useful title or none `toolbars/titles/dont-title-windows-with-your-app`

## Not settled by the HIG
- Tab bar versus sidebar: no tab count threshold is given; only "weigh complexity" `tab-bars/best-practices/use-the-appropriate-number-of-tabs` [HIG none]
- Segmented control versus tab bar for views of one screen: only the "closely related" versus "separate sections" line is drawn [HIG none]
- Compact-width alternative to a split view: not named [HIG none]

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] bottom bar for top-level sections, drawer only for overflow, dots for short carousels `tab-bars/best-practices/use-a-tab-bar-to-support` `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first`
- **Desktop web:** [HIG transfer] left navigation with two levels, top bar for actions, tabs of six or fewer `sidebars/best-practices/in-general-show-no-more-than` `tab-views/best-practices/avoid-providing-more-than-six-tabs`
- **Slides and card news:** [HIG transfer] only page-control dots for position in an ordered series `page-controls/best-practices/use-page-controls-to-represent-movement`
