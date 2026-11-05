---
slug: gyro-and-accelerometer
title: "Gyroscope and accelerometer"
kind: input
group: "Inputs"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/gyro-and-accelerometer
---

# Gyroscope and accelerometer

**In one line:** Motion sensors that report how a device moves and tilts. They can feed activity tracking or gameplay, but the HIG treats them as a narrow input.

## Why it exists
Device motion lets an app respond to the physical world, for example by giving activity feedback or improving gameplay. Because the data reveals how a person moves, collecting it needs a real benefit and an honest explanation `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`. Shaking or tilting to drive ordinary interface controls is discouraged outside active gameplay `gyro-and-accelerometer/best-practices/outside-of-active-gameplay-avoid-using`.

## Use it when
- Motion data gives people a clear benefit, such as activity feedback or better gameplay `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`
- The motion is part of active gameplay `gyro-and-accelerometer/best-practices/outside-of-active-gameplay-avoid-using`

## Don't use it when
- You only want a convenient way to drive the interface outside gameplay: use ordinary controls and [Gestures](gestures.md) instead `gyro-and-accelerometer/best-practices/outside-of-active-gameplay-avoid-using`
- You cannot name a benefit to the person: do not collect motion data (no HIG alternative named) `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`

## Cost to the user
Collecting motion data asks for trust and a permission decision, so the request must say why `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`. Using tilt or shake as direct control outside gameplay forces unusual physical effort and excludes people who cannot move the device that way `gyro-and-accelerometer/best-practices/outside-of-active-gameplay-avoid-using`.

## Principles at stake
- **Responsibility:** collect only what gives real benefit and explain why in the permission copy `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`
- **Purpose:** every use of motion data should serve a clear goal `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`
- **Flexibility:** do not make device movement the way people must control the app `gyro-and-accelerometer/best-practices/outside-of-active-gameplay-avoid-using`; the Gestures page adds that not everyone can do a given movement, so offer another way `gestures/best-practices/give-people-more-than-one-way`

## Key rules
- Collect motion data only when it brings people a real benefit, such as activity feedback or better gameplay `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`
- Explain the reason in the permission request text `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`
- Outside active gameplay, do not make accelerometer or gyroscope motion the direct way to control the interface `gyro-and-accelerometer/best-practices/outside-of-active-gameplay-avoid-using`

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] the same limits apply to any motion-driven control `gyro-and-accelerometer/best-practices/outside-of-active-gameplay-avoid-using`
- **Desktop web:** [HIG transfer] if a page reads device motion, justify the benefit and say why when asking `gyro-and-accelerometer/best-practices/use-motion-data-only-to-offer`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Gestures](gestures.md) · [Nearby interactions](nearby-interactions.md)
