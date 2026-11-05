---
slug: pop-up-buttons
title: "Pop-up buttons"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons
decision_trees: [choosing-values]
---

# Pop-up buttons

**In one line:** A button that opens a menu of mutually exclusive options and then shows the one currently chosen.

## Why it exists
Many settings are a choice from a short list, and showing every option permanently costs space. A pop-up button holds the choices in a menu and displays the current one, so it works where space is tight and not every option must be visible `pop-up-buttons/best-practices/consider-using-a-pop-up-button`.

## Use it when
- People choose one option from a flat set of mutually exclusive options or states `pop-up-buttons/best-practices/use-a-pop-up-button-to`
- Space is tight and not all options need to show at once `pop-up-buttons/best-practices/consider-using-a-pop-up-button`
- On iPadOS in a popover or modal, a list item has a small, well-defined set of options `pop-up-buttons/platform-considerations/ipados/within-a-popover-or-modal-view`

## Don't use it when
- You need actions, multiple selection or submenus: use a [Pull-down button](pull-down-buttons.md) instead `pop-up-buttons/best-practices/use-a-pop-up-button-to`
- A single action is needed: use a [Button](buttons.md) (see its related guidance)
- All options should stay visible: show them directly (no HIG alternative named on this page)

## Cost to the user
One extra step to open the menu. Without a predictable label, people must open it to learn what it offers `pop-up-buttons/best-practices/give-people-a-way-to-predict`.

## Principles at stake
- **Simplicity:** many choices in little space, with a sensible default `pop-up-buttons/best-practices/consider-using-a-pop-up-button` `pop-up-buttons/best-practices/provide-a-useful-default-selection`
- **Familiarity:** a label that tells people what is inside `pop-up-buttons/best-practices/give-people-a-way-to-predict`
- **Agency:** on iPadOS, pick an option without leaving for a detail view `pop-up-buttons/platform-considerations/ipados/within-a-popover-or-modal-view`

## Key rules
- Use it for a flat set of mutually exclusive options; choose a pull-down for actions, multi-select or submenus `pop-up-buttons/best-practices/use-a-pop-up-button-to`
- Preselect the option most people will likely want `pop-up-buttons/best-practices/provide-a-useful-default-selection`
- Let people predict the options without opening it, using an introductory label or a label describing the effect `pop-up-buttons/best-practices/give-people-a-way-to-predict`
- Add a Custom entry for occasional extras, optionally with explanatory text under the list `pop-up-buttons/best-practices/if-necessary-include-a-custom-option`

## Platform differences
- **iPadOS:** in a popover or modal view, prefer a pop-up button over a disclosure indicator for a small, well-defined set of options `pop-up-buttons/platform-considerations/ipados/within-a-popover-or-modal-view`
- **iOS, macOS, visionOS:** no additional considerations.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] a select-style control for exclusive choices, with a default `pop-up-buttons/best-practices/provide-a-useful-default-selection`
- **Desktop web:** [HIG] a dropdown for exclusive options with a predictive label `pop-up-buttons/best-practices/give-people-a-way-to-predict`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Pull-down buttons](pull-down-buttons.md) · [Buttons](buttons.md) · [Menus](menus.md) · see [Decision tree](../decision-trees/choosing-values.md)
