---
slug: buttons
title: "Buttons"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/buttons
---

# Buttons

**In one line:** A control that starts an action with one tap or click, styled and labeled so its purpose and importance are clear.

## Why it exists
Almost every task is a chain of actions, and people need to see what can be done and which action matters most. A button makes one action visible and reachable. Style, label and role tell people which choice is likely, so they can act fast without misreading `buttons/style/in-general-use-a-button-that` `buttons/content/ensure-that-each-button-clearly-communicates`.

## Use it when
- A single, clear action should be available directly in the interface `buttons/content/ensure-that-each-button-clearly-communicates`
- One action in a view is the most likely next step and deserves emphasis `buttons/style/in-general-use-a-button-that`
- A temporary view needs a confirming choice that Return can trigger `buttons/role/assign-the-primary-role-to-the`

## Don't use it when
- People choose among options for a value or state in a flat set: use a [Pop-up button](pop-up-buttons.md) instead `pop-up-buttons/best-practices/use-a-pop-up-button-to`
- Actions are commands tied to one button, or are too many to show: use a [Pull-down button](pull-down-buttons.md) instead `pull-down-buttons/best-practices/use-a-pull-down-button-to`
- On macOS, the control would sit in a toolbar or status bar as a square or image button: use a toolbar item (see [Toolbars](toolbars.md)) `buttons/platform-considerations/macos/square-buttons/use-square-buttons-in-a-view`

## Cost to the user
A button costs space and a little attention. Too many prominent buttons raise cognitive load because color draws the eye `buttons/style/in-general-use-a-button-that`. An unlabeled or unfamiliar icon forces guessing `buttons/content/ensure-that-each-button-clearly-communicates`.

## Principles at stake
- **Simplicity:** one or two prominent buttons per view, equal sizes, clear labels `buttons/style/in-general-use-a-button-that` `buttons/style/use-style-not-size-to-visually`
- **Familiarity:** standard symbols for standard actions, and a press state on every custom button `buttons/content/try-to-associate-familiar-actions-with` `buttons/best-practices/always-include-a-press-state-for`
- **Responsibility:** never make a destructive button the primary one `buttons/role/dont-assign-the-primary-role-to`
- **Flexibility:** generous hit regions work with any input method `buttons/best-practices/make-buttons-easy-for-people-to`

## Key rules
- Give buttons enough surrounding space and a hit region of at least 44x44 pt (60x60 in visionOS) `buttons/best-practices/make-buttons-easy-for-people-to`
- Give every custom button a press state, or it feels unresponsive `buttons/best-practices/always-include-a-press-state-for`
- Mark the most likely action as prominent, and keep prominent buttons to one or two `buttons/style/in-general-use-a-button-that`
- Make option buttons equal in size and signal the preferred one with style, not size `buttons/style/use-style-not-size-to-visually`
- Keep labels from sharing a color with the content beneath; over colorful content, keep default monochrome labels `buttons/style/avoid-applying-a-similar-color-to`
- Make each button's purpose obvious with a symbol, text or both `buttons/content/ensure-that-each-button-clearly-communicates`
- Use familiar icons for familiar actions, preferably standard symbols `buttons/content/try-to-associate-familiar-actions-with`
- When words beat an icon, use a short label that starts with a verb `buttons/content/consider-using-text-when-a-short`
- Give the primary role to the most likely choice, but not to a destructive button, even if it is the likeliest `buttons/role/assign-the-primary-role-to-the` `buttons/role/dont-assign-the-primary-role-to`

## Platform differences
- **iOS, iPadOS:** a button can show an activity indicator, with an optional label change, for actions that take time `buttons/platform-considerations/ios-ipados/configure-a-button-to-display-an`
- **macOS:** end a push button's title with an ellipsis when it opens another window, view or app; use flexible-height push buttons only for tall or multi-line content `buttons/platform-considerations/macos/push-buttons/append-a-trailing-ellipsis-to-the` `buttons/platform-considerations/macos/push-buttons/use-a-flexible-height-push-button`
- **macOS:** keep square and image buttons inside view content, with symbols in square buttons, no intro labels, and about 10 pixels of padding around images `buttons/platform-considerations/macos/square-buttons/prefer-using-a-symbol-in-a` `buttons/platform-considerations/macos/square-buttons/avoid-using-labels-to-introduce-square` `buttons/platform-considerations/macos/image-buttons/include-about-10-pixels-of-padding`
- **macOS:** use the system help button, one per window, in an expected corner and inside the view, linking to the current context's topic `buttons/platform-considerations/macos/help-buttons/use-the-system-provided-help-button` `buttons/platform-considerations/macos/help-buttons/include-no-more-than-one-help` `buttons/platform-considerations/macos/help-buttons/position-help-buttons-where-people-expect` `buttons/platform-considerations/macos/help-buttons/when-possible-open-the-help-topic`
- **visionOS:** use a contrasting filled shape (except in toolbars, menus, alerts, ornaments), favor circular or capsule shapes, keep centers at least 60 pts apart, and avoid white fill with dark content, which the system uses for toggled-on `buttons/platform-considerations/visionos/prefer-buttons-that-have-a-discernible` `buttons/platform-considerations/visionos/in-general-prefer-circular-or-capsule` `buttons/platform-considerations/visionos/provide-enough-space-around-a-button` `buttons/platform-considerations/visionos/avoid-creating-a-custom-button-that`
- **watchOS:** place corner buttons through a toolbar, give primary actions full width, and keep stacked text buttons the same height `buttons/platform-considerations/watchos/use-a-toolbar-to-place-buttons` `buttons/platform-considerations/watchos/prefer-buttons-that-span-the-width` `buttons/platform-considerations/watchos/use-the-same-height-for-vertical`
- **tvOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] hit region, press state, one or two prominent buttons, verb labels `buttons/best-practices/make-buttons-easy-for-people-to`
- **Desktop web:** [HIG] the same rules apply; macOS push, help and image button conventions are [HIG transfer] to web toolbars versus content `buttons/platform-considerations/macos/image-buttons/use-an-image-button-in-a`
- **Slides:** [HIG transfer] emphasize one call to action with style and keep labels short `buttons/style/in-general-use-a-button-that`
- **Card news:** [HIG transfer] one prominent call to action with a verb-led label; familiar icons for familiar actions `buttons/content/consider-using-text-when-a-short` `buttons/content/try-to-associate-familiar-actions-with`

## Related
[Pop-up buttons](pop-up-buttons.md) · [Pull-down buttons](pull-down-buttons.md) · [Toggles](toggles.md) · [Segmented controls](segmented-controls.md) · [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)
