---
slug: healthkit
title: "HealthKit"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/healthkit
---

# HealthKit

**In one line:** Apple's framework for sharing health and fitness data with the Health app, plus rules for permission requests, Activity rings, the Health icon and naming.

## Why it exists
Health data is deeply personal, so people need to trust why an app wants it and keep control of it. The guidance asks for context-based requests, honest reasons and system-level control (Responsibility), and it protects shared Apple symbols so they keep one meaning (Familiarity) `healthkit/privacy-protection/request-access-to-health-data-only` `healthkit/activity-rings/use-activity-rings-for-move-exercise`.

## Use it when
- Your app reads or writes health data and wants it to live in the Health app; ask for access in the moment it is needed `healthkit/privacy-protection/request-access-to-health-data-only`
- You show Move, Exercise or Stand progress for one person `healthkit/activity-rings/use-activity-rings-for-move-exercise` `healthkit/activity-rings/use-activity-rings-to-show-progress`
- You need to show that your app works with Health: use the official icon and name `healthkit/apple-health-icon/use-only-the-apple-provided-icon`

## Don't use it when
- You are on macOS, tvOS or visionOS: HealthKit is not supported there
- You want rings for other data, decoration or branding: use your own graphic instead (no HIG alternative named) `healthkit/activity-rings/use-activity-rings-for-move-exercise` `healthkit/activity-rings/dont-use-activity-rings-for-ornamentation`
- You would build a custom data-sharing screen: send people to the system privacy settings `healthkit/privacy-protection/manage-health-data-sharing-solely-through`

## Cost to the user
A permission request interrupts and asks people to trust the app with sensitive data, so ask only when context makes the purpose obvious, not at launch `healthkit/privacy-protection/request-access-to-health-data-only`. Extra in-app sharing screens add confusion `healthkit/privacy-protection/manage-health-data-sharing-solely-through`.

## Principles at stake
- **Responsibility:** explain why you need data, link a privacy policy, and attribute progress to the right person `healthkit/privacy-protection/clarify-your-apps-intent-by-adding` `healthkit/privacy-protection/provide-a-coherent-privacy-policy` `healthkit/activity-rings/use-activity-rings-to-show-progress`
- **Familiarity:** people expect the standard permission screen and unaltered Apple symbols `healthkit/privacy-protection/clarify-your-apps-intent-by-adding` `healthkit/activity-rings/maintain-activity-ring-and-background-colors`
- **Simplicity:** do not repeat what the system already reports `healthkit/activity-rings/provide-app-specific-information-only-in`
- **Craft:** protect margins and clear space around Apple marks `healthkit/activity-rings/maintain-activity-ring-margins` `healthkit/apple-health-icon/maintain-a-minimum-clear-space-around`

## Key rules
- Give a clearly stated privacy policy URL at submission `healthkit/privacy-protection/provide-a-coherent-privacy-policy`
- Add a few concise sentences to the standard permission screen on why you need the data and the benefit; do not build lookalike screens `healthkit/privacy-protection/clarify-your-apps-intent-by-adding`
- Leave data-sharing control to system settings `healthkit/privacy-protection/manage-health-data-sharing-solely-through`
- Use Activity rings only for Move, Exercise and Stand, for one person, with a label, photo or avatar `healthkit/activity-rings/use-activity-rings-for-move-exercise` `healthkit/activity-rings/use-activity-rings-to-show-progress`
- Never use the rings as decoration, in an app icon or in marketing `healthkit/activity-rings/dont-use-activity-rings-for-ornamentation` `healthkit/activity-rings/dont-use-activity-rings-for-branding`
- Keep rings and background unchanged: no filters, color or opacity changes `healthkit/activity-rings/maintain-activity-ring-and-background-colors`
- Leave an outer margin at least equal to the ring spacing, and set other ring-like shapes apart `healthkit/activity-rings/maintain-activity-ring-margins` `healthkit/activity-rings/differentiate-other-ring-like-elements-from`
- In notifications, give app-specific information, not a repeat of ring updates `healthkit/activity-rings/provide-app-specific-information-only-in`
- Use only Apple's Health icon, unaltered, never as a button, with clear space of a tenth of its height `healthkit/apple-health-icon/use-only-the-apple-provided-icon` `healthkit/apple-health-icon/dont-alter-the-appearance-of-the` `healthkit/apple-health-icon/dont-use-the-apple-health-icon` `healthkit/apple-health-icon/maintain-a-minimum-clear-space-around`
- Say "Apple Health" in text, not "HealthKit", with correct capitalization and the device's translation `healthkit/editorial-guidelines/refer-to-the-health-app-as` `healthkit/editorial-guidelines/dont-use-the-term-healthkit` `healthkit/editorial-guidelines/use-the-system-provided-translation-of`

## Anatomy and content
Keep the Apple Health name near its icon, and make the icon at least as big as neighboring app icons `healthkit/apple-health-icon/display-the-name-apple-health-close` `healthkit/apple-health-icon/display-the-apple-health-icon-consistently`. Do not place the icon in sentences, and do not show Health app screenshots `healthkit/apple-health-icon/dont-use-the-apple-health-icon-2` `healthkit/apple-health-icon/dont-display-health-app-images-or`.

## Platform differences
- **iOS, iPadOS, watchOS:** supported, with no additional considerations.
- **Not available on:** macOS, tvOS, visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] ask for sensitive data in context, with a stated reason `healthkit/privacy-protection/request-access-to-health-data-only`
- **Desktop web:** [HIG none] for Health integration
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Activity rings](activity-rings.md)
