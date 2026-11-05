---
slug: digital-crown
title: "Digital Crown"
kind: input
group: "Inputs"
platforms: [visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/digital-crown
---

# Digital Crown

**In one line:** A rotating hardware dial for scrolling, navigating and adjusting values without covering the small Apple Watch screen.

## Why it exists
On a small screen, a finger blocks what people are trying to see. Turning the crown lets them move through content and values while keeping the display clear. Navigation should be anchored to it and backed up by touch `digital-crown/apple-watch/anchor-your-apps-navigation-to-the`.

## Use it when
- Navigating vertical list, tab or scroll views on Apple Watch `digital-crown/apple-watch/anchor-your-apps-navigation-to-the`
- Inspecting data where navigation is not needed, such as stepping through times of day in World Clock `digital-crown/apple-watch/consider-using-the-digital-crown-to`
- Picking a value, with the picker updating as the crown turns `digital-crown/apple-watch/provide-visual-feedback-in-response-to`

## Don't use it when
- Turning would produce no visible response: always show a change `digital-crown/apple-watch/provide-visual-feedback-in-response-to`
- The interface updates so fast that choosing values becomes hard: match the turn speed `digital-crown/apple-watch/update-your-interface-to-match-the`
- Crown is the only way to act: back it up with touch (no HIG alternative named) `digital-crown/apple-watch/anchor-your-apps-navigation-to-the`

## Cost to the user
Low: one finger, no screen occlusion, little to learn when behavior matches turning speed and haptics `digital-crown/apple-watch/use-the-default-haptic-feedback-when`.

## Principles at stake
- **Familiarity:** vertical navigation and default haptics people already know `digital-crown/apple-watch/use-the-default-haptic-feedback-when`
- **Craft:** pace the interface to the turn speed `digital-crown/apple-watch/update-your-interface-to-match-the`
- **Agency:** touch remains available `digital-crown/apple-watch/anchor-your-apps-navigation-to-the`

## Key rules
- Anchor navigation to crown turns using vertical list, tab and scroll views, with touch as backup `digital-crown/apple-watch/anchor-your-apps-navigation-to-the`
- Use the crown to inspect data where navigation does not apply `digital-crown/apple-watch/consider-using-the-digital-crown-to`
- Show visual change when it turns; if you track turns directly, update the UI `digital-crown/apple-watch/provide-visual-feedback-in-response-to`
- Change the interface at a pace that follows the turn speed `digital-crown/apple-watch/update-your-interface-to-match-the`
- Keep default haptics when suitable; turn off detents that clash with animation, or use linear detents for tables with varied row heights `digital-crown/apple-watch/use-the-default-haptic-feedback-when`

## Platform differences
- **watchOS:** all rules above target Apple Watch.
- **visionOS:** the HIG page gives no separate rules in this bundle. [HIG none]
- **Not available on:** iOS, iPadOS, macOS, tvOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none]
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Action button](action-button.md) · [Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback) · [Immersive experiences](https://developer.apple.com/design/human-interface-guidelines/immersive-experiences)
