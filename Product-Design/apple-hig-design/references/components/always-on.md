---
slug: always-on
title: "Always On"
kind: technology
group: "Technologies"
platforms: [iOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/always-on
---

# Always On

**In one line:** A reduced, dimmed state that keeps a display glanceable while the device is idle, so key information stays visible.

## Why it exists
In Always On, the screen can be seen by anyone nearby, and it should draw little attention. The design job is to show only what matters at a glance while protecting privacy `always-on/best-practices/hide-sensitive-information`. A calm, dim layout keeps key information readable without drawing the eye `always-on/best-practices/keep-important-content-legible-and-dim`.

## Use it when
- Non-sensitive updates help in a glance, such as workout pace or a ride arriving `always-on/best-practices/keep-other-types-of-personal-information`
- Your layout can stay stable while it enters and leaves the dimmed state `always-on/best-practices/maintain-a-consistent-layout`

## Don't use it when
- The information is personal and bystanders might see it, such as bank balances or health data: redact it, including in notifications `always-on/best-practices/hide-sensitive-information`
- The content is rich imagery or large color fills that do not suit a dim state: dim or simplify them `always-on/best-practices/keep-important-content-legible-and-dim`

## Cost to the user
A good Always On state costs nothing: no taps and no learning. The risks are exposed private data and distracting changes, so updates should be rare and subtle `always-on/best-practices/maintain-a-consistent-layout`. People can turn Always On off `always-on/best-practices/keep-other-types-of-personal-information`.

## Principles at stake
- **Responsibility:** hide what people would not want bystanders to see `always-on/best-practices/hide-sensitive-information`
- **Simplicity:** dim secondary content so key information stands out `always-on/best-practices/keep-important-content-legible-and-dim`
- **Craft:** a stable layout and motion that winds down smoothly `always-on/best-practices/maintain-a-consistent-layout` `always-on/best-practices/gracefully-transition-motion-to-a-resting`
- **Purpose:** keep personal updates glanceable where they serve the person `always-on/best-practices/keep-other-types-of-personal-information`

## Key rules
- Redact sensitive details such as bank balances or health data, in notifications too `always-on/best-practices/hide-sensitive-information`
- Keep non-sensitive personal updates glanceable `always-on/best-practices/keep-other-types-of-personal-information`
- Dim secondary text, images and color fills; consider dropping rich images or big color areas for dimmed colors `always-on/best-practices/keep-important-content-legible-and-dim`
- Keep the layout stable across entering, staying in and leaving Always On `always-on/best-practices/maintain-a-consistent-layout`
- Show interactive parts as unavailable instead of removing them, and make updates rare and subtle `always-on/best-practices/maintain-a-consistent-layout`
- Let motion wind down smoothly into a resting state, not cut off abruptly `always-on/best-practices/gracefully-transition-motion-to-a-resting`

## Platform differences
- **iOS, watchOS:** no additional considerations.
- **Not available on:** iPadOS, macOS, tvOS, visionOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] redact private details on any glanceable or lock-screen surface `always-on/best-practices/hide-sensitive-information`
- **Desktop web:** [HIG transfer] dim secondary content so the key item stands out `always-on/best-practices/keep-important-content-legible-and-dim`
- **Slides:** [HIG] the dimming rule helps keep key information legible `always-on/best-practices/keep-important-content-legible-and-dim`; [HIG transfer] redact private numbers before sharing `always-on/best-practices/hide-sensitive-information`
- **Card news:** [HIG] dim secondary elements so the main message stands out `always-on/best-practices/keep-important-content-legible-and-dim`

## Related
[CarPlay](carplay.md) · [Gyroscope and accelerometer](gyro-and-accelerometer.md)
