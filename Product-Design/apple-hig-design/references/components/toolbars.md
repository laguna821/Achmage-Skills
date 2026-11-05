---
slug: toolbars
title: "Toolbars"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/toolbars
decision_trees: [navigation-structure]
---

# Toolbars

**In one line:** A bar of frequent actions, navigation and a title that sits at the edge of a window or screen.

## Why it exists
People need quick access to the commands they use most, and a reminder of where they are. A toolbar puts main-task actions, Back and Close, and a title in a steady place `toolbars/actions/provide-actions-that-support-the-main`. It has limited room, so choosing what earns a place is the real design work `toolbars/best-practices/choose-items-deliberately-to-avoid-overcrowding`.

## Use it when
- Commands are the most frequent, or tied to the top-level objects people work with `toolbars/actions/provide-actions-that-support-the-main`
- People need standard Back or Close, and a short title to confirm location `toolbars/navigation/use-the-standard-back-and-close` `toolbars/titles/provide-a-useful-title-for-each`
- One key action, such as Done or Submit, needs a focal point `toolbars/actions/use-the-prominent-style-for-key`
- On iPadOS and macOS, power users would benefit from customization `toolbars/best-practices/in-ipados-and-macos-apps-consider`

## Don't use it when
- Too many items would crowd it: move the least important to a More menu only if necessary, see [Pull-down buttons](pull-down-buttons.md) `toolbars/best-practices/add-a-more-menu-to-contain`
- The window title would just be the app name: use a useful title or leave it empty `toolbars/titles/dont-title-windows-with-your-app`
- On visionOS, you would add a vertical toolbar or a pull-down menu: use the standard toolbar, and tab bars for vertical navigation (see [Ornaments](ornaments.md)) `toolbars/platform-considerations/visionos/avoid-creating-a-vertical-toolbar` `toolbars/platform-considerations/visionos/avoid-using-a-pull-down-menu`

## Cost to the user
Always visible, so it takes space and attention. Many groups or items make it crowded and confusing, and a More menu hides actions `toolbars/item-groupings/minimize-the-number-of-groups` `toolbars/best-practices/add-a-more-menu-to-contain`.

## Principles at stake
- **Purpose:** only commands that support main tasks `toolbars/actions/provide-actions-that-support-the-main`
- **Simplicity:** few items and groups, no custom backgrounds `toolbars/item-groupings/minimize-the-number-of-groups` `toolbars/best-practices/reduce-the-use-of-toolbar-backgrounds`
- **Familiarity:** standard Back/Close, system symbols, consistent placement across platforms `toolbars/navigation/use-the-standard-back-and-close` `toolbars/item-groupings/keep-consistent-groupings-and-placement-across`
- **Agency:** customization and hide/restore `toolbars/best-practices/consider-temporarily-hiding-toolbars-for-a`

## Key rules
- Limit items; on macOS and iPadOS, do not add your own overflow or let items overflow by default `toolbars/best-practices/choose-items-deliberately-to-avoid-overcrowding`
- Skip custom backgrounds and tinted controls; use the scroll edge effect to separate the bar from content `toolbars/best-practices/reduce-the-use-of-toolbar-backgrounds`
- Avoid labels sharing a color with the content behind them `toolbars/best-practices/avoid-applying-a-similar-color-to`
- Use standard components; custom ones need corner radii concentric with the bar `toolbars/best-practices/prefer-using-standard-components-in-a`
- If toolbars can hide, always offer a dependable way to bring them back `toolbars/best-practices/consider-temporarily-hiding-toolbars-for-a`
- Title concisely (under 15 characters), never with the app name `toolbars/titles/write-a-concise-title` `toolbars/titles/dont-title-windows-with-your-app`
- Use the standard Back and Close with standard symbols `toolbars/navigation/use-the-standard-back-and-close`
- Prefer recognizable system symbols without added borders `toolbars/actions/make-sure-the-meaning-of-each` `toolbars/actions/prefer-system-provided-symbols-without-borders`
- One prominent primary action, at the trailing side `toolbars/actions/use-the-prominent-style-for-key`
- Group by function, at most about three groups, with navigation and critical actions in their own distinct sections `toolbars/item-groupings/group-toolbar-items-logically-by-function` `toolbars/item-groupings/minimize-the-number-of-groups` `toolbars/item-groupings/group-navigation-controls-and-critical-actions`
- Separate text-labeled actions from symbol actions, using fixed space between text buttons `toolbars/item-groupings/keep-actions-with-text-labels-separate`

## Platform differences
- **iOS:** include only essential actions and use a More menu for the rest; use a large title that shrinks on scroll `toolbars/platform-considerations/ios/prioritize-only-the-most-important-items` `toolbars/platform-considerations/ios/use-a-large-title-to-help`
- **iPadOS:** consider a toolbar and tab bar in the same top row `toolbars/platform-considerations/ipados/consider-combining-a-toolbar-with-a`
- **macOS:** also offer every toolbar item as a menu bar command `toolbars/platform-considerations/macos/make-every-toolbar-item-available-as`
- **visionOS:** use the standard toolbar, keep windows from shrinking narrower than it, swap in task controls in a modal state and restore on exit `toolbars/platform-considerations/visionos/prefer-using-a-system-provided-toolbar` `toolbars/platform-considerations/visionos/try-to-prevent-windows-from-resizing` `toolbars/platform-considerations/visionos/if-your-app-can-enter-a`
- **watchOS:** offer an important non-primary action as a scrolling toolbar button `toolbars/platform-considerations/watchos/use-a-scrolling-toolbar-button-for`
- **tvOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] few essential actions, More for the rest, standard Back and Close `toolbars/platform-considerations/ios/prioritize-only-the-most-important-items`
- **Desktop web:** [HIG] app header toolbars follow the same grouping, title and primary-action rules; every toolbar action also in a menu is [HIG transfer] `toolbars/platform-considerations/macos/make-every-toolbar-item-available-as`
- **Slides:** [HIG transfer] concise slide titles `toolbars/titles/write-a-concise-title`
- **Card news:** [HIG transfer] same concise-title rule `toolbars/titles/write-a-concise-title`

## Related
[Sidebars](sidebars.md) · [Tab bars](tab-bars.md) · [Buttons](buttons.md) · [Search fields](search-fields.md) · [Ornaments](ornaments.md) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · see [Decision tree](../decision-trees/navigation-structure.md)
