---
slug: app-shortcuts
title: "App Shortcuts"
kind: component
group: "System experiences"
platforms: [iOS, iPadOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/app-shortcuts
decision_trees: [beyond-the-app]
---

# App Shortcuts

**In one line:** Ready-made actions from your app that people can start by voice, Spotlight or the Shortcuts app without opening the app first.

## Why it exists
The tasks people repeat most should be reachable without navigating through the app. App Shortcuts surface those tasks to the system, ideally finishing in place `app-shortcuts/best-practices/offer-app-shortcuts-for-your-apps`. They only help when people know they exist and can speak or pick them easily, which makes discovery and brevity part of the design `app-shortcuts/best-practices/make-app-shortcuts-discoverable-in-your` `app-shortcuts/editorial-guidelines/provide-brief-memorable-activation-phrases-and`. Purpose, Agency and Simplicity lead.

## Use it when
- A task is done often and matters most, and can finish without leaving the current context `app-shortcuts/best-practices/offer-app-shortcuts-for-your-apps`
- The feature is unique or uses custom content that app schemas do not cover `app-shortcuts/best-practices/to-surface-common-types-of-app`
- One optional parameter would add useful flexibility, with familiar, predictable values `app-shortcuts/best-practices/add-flexibility-by-letting-people-choose`

## Don't use it when
- The functionality is a common kind that app schemas cover: adopt the schemas instead, so the system can surface it `app-shortcuts/best-practices/to-surface-common-types-of-app` (no card for schemas)
- Required detail would make the spoken phrase long: keep phrases short and collect extra details in a later step `app-shortcuts/best-practices/keep-voice-interactions-simple`

## Cost to the user
A shortcut saves steps when it works, but spoken phrases must be remembered and said correctly, so complicated ones cost effort `app-shortcuts/best-practices/keep-voice-interactions-simple`. People who cannot see a screen, such as on AirPods or HomePod, need every critical detail in the spoken reply `app-shortcuts/best-practices/responding-to-app-shortcuts/provide-enough-detail-for-interaction-on`.

## Principles at stake
- **Purpose:** offer shortcuts for the tasks that matter most, and put the broadest ones first on iOS and iPadOS `app-shortcuts/best-practices/offer-app-shortcuts-for-your-apps` `app-shortcuts/platform-considerations/ios-ipados/order-shortcuts-based-on-importance`
- **Agency:** teach people the shortcuts exist, and suggest a default when a request lacks detail `app-shortcuts/best-practices/make-app-shortcuts-discoverable-in-your` `app-shortcuts/best-practices/ask-for-clarification-in-response-to`
- **Simplicity:** short phrases and few parameters `app-shortcuts/best-practices/keep-voice-interactions-simple`
- **Flexibility:** responses that work without a screen `app-shortcuts/best-practices/responding-to-app-shortcuts/provide-enough-detail-for-interaction-on`

## Key rules
- Adopt app schemas for common functionality; keep App Shortcuts for unique features or custom content `app-shortcuts/best-practices/to-surface-common-types-of-app`
- Provide shortcuts for the most common and valuable tasks, preferably ones finishable in place `app-shortcuts/best-practices/offer-app-shortcuts-for-your-apps`
- Allow one optional parameter when sensible, with easy-to-guess values `app-shortcuts/best-practices/add-flexibility-by-letting-people-choose`
- If optional detail is missing, ask a follow-up proposing a likely default, such as the most recent choice, plus a short list of alternatives `app-shortcuts/best-practices/ask-for-clarification-in-response-to`
- Keep spoken phrases short; trim ones that sound awkward aloud `app-shortcuts/best-practices/keep-voice-interactions-simple`
- Show occasional in-app tips when people do common actions `app-shortcuts/best-practices/make-app-shortcuts-discoverable-in-your`
- Put every critical piece of information in the full spoken response `app-shortcuts/best-practices/responding-to-app-shortcuts/provide-enough-detail-for-interaction-on`
- Write short activation phrases that include the app name, with natural alternative wordings `app-shortcuts/editorial-guidelines/provide-brief-memorable-activation-phrases-and`

## Anatomy and content
Write App Shortcuts and Shortcuts in title case, always with the plural Shortcuts `app-shortcuts/editorial-guidelines/when-referring-to-app-shortcuts-or`. Use lowercase for an individual shortcut as opposed to the feature or the Shortcuts app `app-shortcuts/editorial-guidelines/when-referring-to-individual-shortcuts-not`.

## Platform differences
- **iOS, iPadOS:** list the most broadly useful shortcuts first, since this sets the initial order in Spotlight and Shortcuts before the system reorders by usage `app-shortcuts/platform-considerations/ios-ipados/order-shortcuts-based-on-importance`
- **visionOS, watchOS:** no additional platform guidance.
- **Not available on:** tvOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] the lesson to surface frequent tasks without full navigation `app-shortcuts/best-practices/offer-app-shortcuts-for-your-apps`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]; naming conventions in title case are [HIG transfer] only when mentioning the feature `app-shortcuts/editorial-guidelines/when-referring-to-app-shortcuts-or`

## Related
[Siri](https://developer.apple.com/design/human-interface-guidelines/siri) · [Controls](controls.md) · see [Decision tree](../decision-trees/beyond-the-app.md)
