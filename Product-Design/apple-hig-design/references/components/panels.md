---
slug: panels
title: "Panels"
kind: component
group: "Presentation"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/panels
---

# Panels

**In one line:** A Mac window that floats above others and holds supplementary controls or information for the current selection.

## Why it exists
While working on content, people often need quick access to settings that act on the current selection, without opening a full window. A panel stays within reach and follows what is selected `panels/best-practices/use-a-panel-to-give-people`. It supports Flexibility and Craft: lightweight, simple controls that stay out of the way.

## Use it when
- People need quick controls or details for the content they are working on `panels/best-practices/use-a-panel-to-give-people`
- You are building an inspector that updates with the selection `panels/best-practices/consider-using-a-panel-to-present`
- A media app needs a HUD-style panel, or a standard panel would hide essential content `panels/hud-style-panels/prefer-standard-panels`

## Don't use it when
- The content is a fixed Info window: use a regular window ([Windows](windows.md)) or a split view pane instead `panels/best-practices/consider-using-a-panel-to-present`
- Controls need typed text or picking items first: favor simpler adjustment controls such as sliders and steppers `panels/best-practices/prefer-simple-adjustment-controls-in-a`
- You are not on macOS: not available (no HIG alternative named)

## Cost to the user
A floating panel covers part of the workspace, so the HUD in particular should stay small and not compete with the content `panels/hud-style-panels/keep-huds-small`. Panels must not clutter the Window menu or the minimize behavior `panels/best-practices/avoid-including-panels-in-the-window`.

## Principles at stake
- **Familiarity:** panels come forward and hide with the app, and are named by title `panels/best-practices/show-and-hide-panels-appropriately` `panels/best-practices/refer-to-panels-by-title-in`
- **Simplicity:** simple controls, small HUDs, sparing HUD color `panels/best-practices/prefer-simple-adjustment-controls-in-a` `panels/hud-style-panels/use-color-sparingly-in-huds`
- **Craft:** keep one panel style across modes `panels/hud-style-panels/maintain-one-panel-style-when-your`

## Key rules
- Use a panel for quick access to controls or information for the selected content `panels/best-practices/use-a-panel-to-give-people`
- Prefer sliders and steppers over controls needing typed input `panels/best-practices/prefer-simple-adjustment-controls-in-a`
- Give a floating panel a short title-case noun or noun phrase, such as Fonts `panels/best-practices/write-a-brief-title-that-describes`
- Bring all of the app's panels forward when it becomes active, and hide them when inactive `panels/best-practices/show-and-hide-panels-appropriately`
- Keep panels out of the Window menu's document list `panels/best-practices/avoid-including-panels-in-the-window`
- Usually leave off the minimize button `panels/best-practices/in-general-avoid-making-a-panels`
- In menus and help, use the title without the word "panel" `panels/best-practices/refer-to-panels-by-title-in`
- Default to standard panels; reserve HUDs for media apps or similar cases `panels/hud-style-panels/prefer-standard-panels`
- Keep the same style when the mode changes `panels/hud-style-panels/maintain-one-panel-style-when-your`
- In HUDs, use only small touches of high-contrast color and keep them compact `panels/hud-style-panels/use-color-sparingly-in-huds` `panels/hud-style-panels/keep-huds-small`

## Platform differences
- **macOS:** the only platform; all guidance above applies.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none]
- **Desktop web:** [HIG transfer] a floating inspector tied to the selection follows the same simple-controls and short-title rules `panels/best-practices/use-a-panel-to-give-people`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Windows](windows.md) · [Popovers](popovers.md) · [Sheets](sheets.md)
