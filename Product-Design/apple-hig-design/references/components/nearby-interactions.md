---
slug: nearby-interactions
title: "Nearby interactions"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/nearby-interactions
---

# Nearby interactions

**In one line:** A technology that senses the distance and direction between nearby devices, so an app can react to people and objects around it.

## Why it exists
Many tasks are physical actions at heart, such as bringing two devices together to pass a song along. Nearby interactions let an app turn that action into an interface `nearby-interactions/best-practices/consider-a-task-from-the-perspective`. The value lies in relevance: nearby, contextual information is more useful than a generic list `nearby-interactions/best-practices/use-distance-direction-and-context-to`.

## Use it when
- A task maps naturally onto a physical action between devices `nearby-interactions/best-practices/consider-a-task-from-the-perspective`
- Distance, direction and context can make suggestions more relevant, such as likely share recipients `nearby-interactions/best-practices/use-distance-direction-and-context-to`
- People search for something nearby and need guidance as they move `nearby-interactions/best-practices/provide-continuous-feedback`

## Don't use it when
- It would be the only way to finish a task: always provide an alternative route (no HIG alternative component named) `nearby-interactions/best-practices/avoid-using-a-nearby-interaction-as`
- The task has no physical or spatial meaning: use a conventional interface (no HIG alternative named) `nearby-interactions/best-practices/consider-a-task-from-the-perspective`

## Cost to the user
People must hold and point the device, and obstructions or a narrow sensor field can break the experience, so guidance in onboarding is needed `nearby-interactions/device-usage/help-people-understand-how-intervening-objects` `nearby-interactions/device-usage/design-for-the-devices-directional-field`. Gaps in feedback make people lose track of what is happening `nearby-interactions/best-practices/provide-continuous-feedback`.

## Principles at stake
- **Delight:** feedback that changes as people get closer feels natural `nearby-interactions/best-practices/consider-how-changes-in-physical-distance`
- **Flexibility:** mix visual, audible and haptic feedback by context, and keep other ways to finish the task `nearby-interactions/best-practices/consider-using-multiple-feedback-types-to` `nearby-interactions/best-practices/avoid-using-a-nearby-interaction-as`
- **Responsibility:** warn about obstructions in onboarding or tutorials `nearby-interactions/device-usage/help-people-understand-how-intervening-objects`
- **Purpose:** favor nearby, relevant information `nearby-interactions/best-practices/use-distance-direction-and-context-to`

## Key rules
- Start from the physical-world version of the task `nearby-interactions/best-practices/consider-a-task-from-the-perspective`
- Use distance, direction and context to shape what you suggest `nearby-interactions/best-practices/use-distance-direction-and-context-to`
- Change feedback as distance changes, for example an arrow becoming a pulsing circle `nearby-interactions/best-practices/consider-how-changes-in-physical-distance`
- Keep feedback continuous and responsive to the person's movement `nearby-interactions/best-practices/provide-continuous-feedback`
- Blend visual, audible and haptic feedback: visual while looking at the screen, sound and haptics while engaging the surroundings `nearby-interactions/best-practices/consider-using-multiple-feedback-types-to`
- Never make a nearby interaction the sole way to complete a task `nearby-interactions/best-practices/avoid-using-a-nearby-interaction-as`
- Steer people toward portrait orientation with visual cues rather than explicit instructions `nearby-interactions/device-usage/encourage-people-to-hold-the-device`
- Expect a device outside the sensor's angular field to report distance but no direction `nearby-interactions/device-usage/design-for-the-devices-directional-field`

## Platform differences
- **iOS, watchOS:** no platform-specific rules beyond those above.
- **iPadOS:** no additional considerations.
- **Not available on:** macOS, tvOS, visionOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] progressive, multi-channel feedback and a non-proximity fallback suit any location-aware feature `nearby-interactions/best-practices/avoid-using-a-nearby-interaction-as`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Gyroscope and accelerometer](gyro-and-accelerometer.md) · [Augmented reality](augmented-reality.md) · [AirPlay](airplay.md)
