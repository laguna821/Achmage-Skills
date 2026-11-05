---
slug: controls
title: "Controls"
kind: component
group: "System experiences"
platforms: [iOS, iPadOS, macOS]
source: https://developer.apple.com/design/human-interface-guidelines/controls
decision_trees: [beyond-the-app]
---

# Controls

**In one line:** System-level buttons and toggles from your app that people add to system spots such as Control Center, the Lock Screen and the Action button.

## Why it exists
Some actions are worth reaching without opening the app, such as starting a Live Activity `controls/best-practices/offer-controls-for-actions-that-provide`. Because a control can appear where its title and value are hidden, the symbol must carry meaning and the control must reflect true state `controls/best-practices/choose-a-descriptive-symbol-that-suggests` `controls/best-practices/update-controls-when-someone-interacts-with`. Purpose, Agency and Responsibility lead.

## Use it when
- An action gives great benefit without opening the app `controls/best-practices/offer-controls-for-actions-that-provide`
- A control needs setup, such as picking which light: prompt when it is first added and allow changes later `controls/best-practices/help-people-provide-additional-information-the`
- A control opens the camera from a locked device: reuse the in-app camera interface `controls/camera-experiences-on-a-locked-device/use-the-same-camera-ui-in`

## Don't use it when
- The action needs the full app to make sense: leave it in the app (no HIG alternative named) `controls/best-practices/offer-controls-for-actions-that-provide`
- The action affects security, such as locking a door or starting a car: require unlock or authentication first `controls/best-practices/require-authentication-for-actions-that-affect`
- The title or value is personal and the device is locked: let the system redact it `controls/best-practices/hide-sensitive-information-when-the-device`

## Cost to the user
A control is nearly free to use, but a wrong state or silent failure costs trust, so refresh it after interaction and show whether an action is still running `controls/best-practices/update-controls-when-someone-interacts-with`. Setup costs one prompt, best asked when the control is added `controls/best-practices/help-people-provide-additional-information-the`.

## Principles at stake
- **Purpose:** only actions that deliver benefit without the app `controls/best-practices/offer-controls-for-actions-that-provide`
- **Familiarity:** symbols, animation and hint text that explain state and action `controls/best-practices/use-symbol-animations-to-highlight-state`
- **Responsibility:** redact sensitive data and require authentication `controls/best-practices/hide-sensitive-information-when-the-device`
- **Agency:** reconfigurable setup and instructions for adding a control `controls/camera-experiences-on-a-locked-device/provide-instructions-for-adding-the-control`

## Key rules
- Offer controls for the highest-benefit actions that need no app launch `controls/best-practices/offer-controls-for-actions-that-provide`
- Update after interaction, on completion, or via push so it shows true state `controls/best-practices/update-controls-when-someone-interacts-with`
- Choose a descriptive symbol, with distinct symbols for on and off `controls/best-practices/choose-a-descriptive-symbol-that-suggests`
- Animate toggle symbols between states, and keep a button's symbol animating during a lasting action `controls/best-practices/use-symbol-animations-to-highlight-state`
- Choose a tint color that fits your brand; the system uses it in several places `controls/best-practices/select-a-tint-color-that-works`
- Prompt for needed setup when added, and allow reconfiguring `controls/best-practices/help-people-provide-additional-information-the`
- Give the Action button hint text built with verbs `controls/best-practices/provide-hint-text-for-the-action`
- Add placeholder info when the title or value changes with situation `controls/best-practices/if-your-control-title-or-value`
- Let the system redact title and value on a locked device `controls/best-practices/hide-sensitive-information-when-the-device`
- Require authentication for security-affecting actions `controls/best-practices/require-authentication-for-actions-that-affect`

## Anatomy and content
A control has a symbol, a title and a value; depending on placement the title and value may be hidden `controls/best-practices/choose-a-descriptive-symbol-that-suggests`. For a camera control, explain how people add it `controls/camera-experiences-on-a-locked-device/provide-instructions-for-adding-the-control`.

## Platform differences
No platform-specific guidance.
- **Not available on:** tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] symbol clarity, state accuracy and authentication for risky actions `controls/best-practices/require-authentication-for-actions-that-affect`
- **Desktop web:** [HIG transfer] same, for quick-action panels `controls/best-practices/update-controls-when-someone-interacts-with`
- **Slides:** [HIG none]
- **Card news:** [HIG transfer] a brand tint choice may repeat across surfaces `controls/best-practices/select-a-tint-color-that-works`

## Related
[Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets) · [Action button](https://developer.apple.com/design/human-interface-guidelines/action-button) · [App Shortcuts](app-shortcuts.md) · see [Decision tree](../decision-trees/beyond-the-app.md)
