---
slug: toggles
title: "Toggles"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/toggles
decision_trees: [choosing-values]
---

# Toggles

**In one line:** A control that flips something between two opposing states, such as on and off, shown as a switch, checkbox or radio button.

## Why it exists
Many settings are a plain yes or no. A toggle manages the state of content or a view, and shows at a glance whether it is on `toggles/best-practices/use-a-toggle-to-help-people`. It serves Familiarity and Simplicity: each platform has expected forms, and people must understand what they are turning on or off `toggles/best-practices/clearly-identify-the-setting-view-or`.

## Use it when
- Two opposing values describe the state of content or a view `toggles/best-practices/use-a-toggle-to-help-people`
- On iOS and iPadOS, the setting sits in a list row: use the switch style `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only`
- On macOS, you want to stress a setting or turn a whole group on or off: use a switch `toggles/platform-considerations/macos/switches/prefer-a-switch-for-settings-that`
- On macOS, several choices may be selected: use checkboxes `toggles/platform-considerations/macos/radio-buttons/prefer-a-set-of-radio-buttons`

## Don't use it when
- People pick from a list or trigger another action: use another component such as a pop-up button (see [Pop-up buttons](pop-up-buttons.md)) `toggles/best-practices/use-a-toggle-to-help-people`
- On iOS and iPadOS, you are outside a list: use a toggle-like button instead of a switch `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a`
- On macOS, there are more than two mutually exclusive options: use radio buttons `toggles/platform-considerations/macos/checkboxes/consider-using-radio-buttons-if-you`
- On macOS, there are more than about five radio options: consider a pop-up button `toggles/platform-considerations/macos/radio-buttons/avoid-listing-too-many-radio-buttons`

## Cost to the user
A toggle is cheap to use, but an unclear one costs understanding: people must know what it affects, and must tell the on and off states apart without relying on color alone `toggles/best-practices/clearly-identify-the-setting-view-or` `toggles/best-practices/make-sure-the-visual-differences-in`.

## Principles at stake
- **Familiarity:** use the form each platform expects, such as a switch only in a list row on iOS `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only`
- **Simplicity:** one clear two-state setting, with no redundant explanatory label on toggle-style buttons `toggles/platform-considerations/ios-ipados/avoid-supplying-a-label-that-explains`
- **Flexibility:** states differ by more than color, so more people can perceive them `toggles/best-practices/make-sure-the-visual-differences-in`
- **Craft:** consistent spacing and truthful state, such as a mixed checkbox for a master setting `toggles/platform-considerations/macos/checkboxes/accurately-reflect-a-checkboxs-state-in`

## Key rules
- Use a toggle only for two opposing values `toggles/best-practices/use-a-toggle-to-help-people`
- Make clear what the toggle affects, usually by context, adding a label when needed; a toggle-like button needs a purposeful icon and a background change with state `toggles/best-practices/clearly-identify-the-setting-view-or`
- Differ on and off by fill, background shape or inner marks, not color alone `toggles/best-practices/make-sure-the-visual-differences-in`
- Recolor a switch only when needed, and keep enough contrast with the uncolored state `toggles/platform-considerations/ios-ipados/change-the-default-color-of-a`
- Keep existing macOS checkboxes rather than swapping them for switches `toggles/platform-considerations/macos/switches/in-general-dont-replace-a-checkbox`
- Show hierarchies of settings with checkboxes: aligned on the leading edge, dependent ones indented `toggles/platform-considerations/macos/checkboxes/use-a-checkbox-instead-of-a`
- For a lone on/off setting, use a checkbox; use two labeled radio buttons only if that is unclear `toggles/platform-considerations/macos/radio-buttons/to-present-a-single-setting-that`
- On macOS, place these three controls in the main window body, never in the toolbar or status bar `toggles/platform-considerations/macos/use-switches-checkboxes-and-radio-buttons`

## Anatomy and content
Checkbox groups can be introduced with a label whose baseline lines up with the first checkbox `toggles/platform-considerations/macos/checkboxes/consider-using-a-label-to-introduce`. Horizontal radio buttons share one slot width sized to the longest label `toggles/platform-considerations/macos/radio-buttons/use-consistent-spacing-when-you-display`. In a grouped form, use mini switches for single-row settings, or a regular switch for the main setting with mini ones below `toggles/platform-considerations/macos/switches/within-a-grouped-form-consider-using`.

## Platform differences
- **iOS, iPadOS:** switch only inside list rows, with no label of its own; toggle-like buttons elsewhere, highlighted when active `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only` `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a`
- **macOS:** switches, checkboxes and radio buttons each have defined roles, as above `toggles/platform-considerations/macos/switches/prefer-a-switch-for-settings-that`
- **tvOS, visionOS, watchOS:** no additional platform guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] two-state rule and non-color state cues `toggles/best-practices/make-sure-the-visual-differences-in`
- **Desktop web:** [HIG] checkbox, radio and switch role guidance applies directly `toggles/platform-considerations/macos/radio-buttons/prefer-a-set-of-radio-buttons`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Segmented controls](segmented-controls.md) · [Pickers](pickers.md) · see [Decision tree](../decision-trees/choosing-values.md)
