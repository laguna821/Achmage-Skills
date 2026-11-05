---
slug: action-button
title: "Action button"
kind: input
group: "Inputs"
platforms: [iOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/action-button
---

# Action button

**In one line:** A hardware button people assign to a quick action, which your app can support with a few essential functions.

## Why it exists
The Action button gives one-press access to something people do often. Supporting it with your app's few most essential functions keeps it purposeful `action-button/best-practices/support-the-action-button-with-a`, and plain labels keep the choice clear `action-button/best-practices/for-each-action-you-support-write`.

## Use it when
- You have a small set of essential functions people repeat `action-button/best-practices/support-the-action-button-with-a`
- An action should run without leaving the current context (iOS) `action-button/platform-considerations/ios/let-people-use-your-actions-without`
- On Apple Watch, a secondary function logically extends the main one `action-button/platform-considerations/watchos/consider-offering-a-secondary-function-that`

## Don't use it when
- The shortcut would only open the app (no HIG alternative named) `action-button/best-practices/support-the-action-button-with-a`
- You want to explain setup yourself: let the system do it `action-button/best-practices/prefer-letting-the-system-show-people`
- On watchOS, a repeat press would stop the main task: offer stopping in the interface instead `action-button/platform-considerations/watchos/prefer-using-subsequent-button-presses-to`

## Cost to the user
Very low per use, since it is one press. Cost rises with too many actions, long labels, or actions that pull people into the app `action-button/best-practices/support-the-action-button-with-a`.

## Principles at stake
- **Purpose:** only essential functions `action-button/best-practices/support-the-action-button-with-a`
- **Simplicity:** labels of at most three words `action-button/best-practices/for-each-action-you-support-write`
- **Agency:** work in place, with lightweight results `action-button/platform-considerations/ios/let-people-use-your-actions-without`
- **Responsibility:** do not pause where a pause could endanger someone, such as a dive `action-button/platform-considerations/watchos/pause-the-current-function-when-people`

## Key rules
- Support a small set of the app's most essential functions `action-button/best-practices/support-the-action-button-with-a`
- Label each action with a phrase of at most three words, title-style capitalization, starting with a present-tense verb, no articles or prepositions `action-button/best-practices/for-each-action-you-support-write`
- Do not repeat the system's configuration guidance `action-button/best-practices/prefer-letting-the-system-show-people`
- On iOS, use lightweight options such as Live Activities or custom snippets `action-button/platform-considerations/ios/let-people-use-your-actions-without`
- On watchOS, think hard before adding more than one secondary function `action-button/platform-considerations/watchos/consider-offering-a-secondary-function-that`
- On watchOS, use extra presses for added functionality, and treat pausing as separate `action-button/platform-considerations/watchos/prefer-using-subsequent-button-presses-to`
- On watchOS, pause the current function when Action and side buttons are pressed together `action-button/platform-considerations/watchos/pause-the-current-function-when-people`

## Platform differences
- **iOS:** let actions work without leaving context `action-button/platform-considerations/ios/let-people-use-your-actions-without`
- **watchOS:** secondary function, extra-press and pause rules above
- **Not available on:** iPadOS, macOS, tvOS, visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] offer a few essential quick actions, not a shortcut that merely opens the app `action-button/best-practices/support-the-action-button-with-a`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Live Activities](live-activities.md) · [Digital Crown](digital-crown.md) · [App Shortcuts](https://developer.apple.com/design/human-interface-guidelines/app-shortcuts) · [Workouts](https://developer.apple.com/design/human-interface-guidelines/workouts)
