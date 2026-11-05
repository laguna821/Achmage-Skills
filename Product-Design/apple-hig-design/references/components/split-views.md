---
slug: split-views
title: "Split views"
kind: component
group: "Layout and organization"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/split-views
decision_trees: [navigation-structure]
---

# Split views

**In one line:** A layout that shows two or three panes side by side, usually a hierarchy of lists leading to a detail view.

## Why it exists
When several levels of content are visible together, people stay oriented and can move around without losing context. Split views make that possible on wide screens, provided each pane stays usable (Familiarity, Flexibility) `split-views/best-practices/to-support-navigation-persistently-highlight-the`.

## Use it when
- Content has several levels and people benefit from seeing them together `split-views/best-practices/to-support-navigation-persistently-highlight-the`
- On iOS in regular-width environments `split-views/platform-considerations/ios/prefer-using-a-split-view-in`
- On visionOS, supplementary information should stay in context `split-views/platform-considerations/visionos/to-display-supplementary-information-prefer-a`
- On the watch, you offer pages of detail `split-views/platform-considerations/watchos/if-your-app-displays-multiple-detail`

## Don't use it when
- The space is compact, such as iPhone portrait: panes wrap or truncate (no HIG alternative named) `split-views/platform-considerations/ios/prefer-using-a-split-view-in`
- On visionOS, a new window for supplementary info: use a split view instead `split-views/platform-considerations/visionos/to-display-supplementary-information-prefer-a`

## Cost to the user
Panes cost width. A pane that gets too small can lose its divider `split-views/platform-considerations/macos/set-reasonable-defaults-for-minimum-and`. Hiding panes reduces distraction, so offer several ways to restore them `split-views/platform-considerations/macos/consider-letting-people-hide-a-pane` `split-views/platform-considerations/macos/provide-multiple-ways-to-reveal-hidden`.

## Principles at stake
- **Familiarity:** a persistent highlight in each pane shows how panes relate `split-views/best-practices/to-support-navigation-persistently-highlight-the`
- **Flexibility:** iPad windows resize fluidly, so design for narrow, compact and intermediate widths `split-views/platform-considerations/ipados/account-for-narrow-compact-and-intermediate`
- **Agency:** hiding a pane and drag and drop put control in people's hands `split-views/platform-considerations/macos/consider-letting-people-hide-a-pane` `split-views/best-practices/consider-letting-people-drag-and-drop`

## Key rules
- Keep the current selection highlighted in each pane leading to the detail view `split-views/best-practices/to-support-navigation-persistently-highlight-the`
- Consider drag and drop between panes `split-views/best-practices/consider-letting-people-drag-and-drop`

## Platform differences
- **iOS:** use split views in regular size, not compact `split-views/platform-considerations/ios/prefer-using-a-split-view-in`
- **iPadOS:** keep panes navigable at narrow, compact and intermediate widths `split-views/platform-considerations/ipados/account-for-narrow-compact-and-intermediate`
- **macOS:** set sensible minimum and maximum pane sizes; allow hiding with multiple ways to reveal; use the thin divider `split-views/platform-considerations/macos/set-reasonable-defaults-for-minimum-and` `split-views/platform-considerations/macos/provide-multiple-ways-to-reveal-hidden` `split-views/platform-considerations/macos/prefer-the-thin-divider-style`
- **tvOS:** balance proportions (default or half and half); one title for the whole content, centered when the secondary pane is a collection `split-views/platform-considerations/tvos/choose-a-split-view-layout-that` `split-views/platform-considerations/tvos/display-a-single-title-above-a` `split-views/platform-considerations/tvos/choose-the-titles-alignment-based-on`
- **visionOS:** prefer a split view over an extra window `split-views/platform-considerations/visionos/to-display-supplementary-information-prefer-a`
- **watchOS:** open on the most relevant detail; use a vertical tab view with a page indicator `split-views/platform-considerations/watchos/automatically-display-the-most-relevant-detail` `split-views/platform-considerations/watchos/if-your-app-displays-multiple-detail`

## In other media
- **Mobile (any OS) and mobile web:** [HIG] use a split view only at regular width; in narrow widths, fall back to a single pane `split-views/platform-considerations/ios/prefer-using-a-split-view-in`
- **Desktop web:** [HIG] hide and restore panes, keep a visible divider and highlight the selection `split-views/platform-considerations/macos/consider-letting-people-hide-a-pane` `split-views/best-practices/to-support-navigation-persistently-highlight-the`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Sidebars](sidebars.md) · [Tab bars](tab-bars.md) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · see [Decision tree](../decision-trees/navigation-structure.md)
