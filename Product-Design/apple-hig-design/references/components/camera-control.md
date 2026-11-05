---
slug: camera-control
title: "Camera Control"
kind: input
group: "Inputs"
platforms: [iOS]
source: https://developer.apple.com/design/human-interface-guidelines/camera-control
---

# Camera Control

**In one line:** An iPhone hardware control that launches a camera and adjusts settings through a system overlay, which your camera app can plug into.

## Why it exists
Camera Control lets people reach a camera and tune settings without touching the screen. Your app can join it by launching from anywhere and exposing a few clear controls `camera-control/best-practices/allow-people-to-use-the-camera`, while leaving room for the system overlay `camera-control/best-practices/make-space-for-the-overlay-in`.

## Use it when
- Your app is a camera experience people should launch from anywhere `camera-control/best-practices/allow-people-to-use-the-camera`
- A setting suits a slider or toggle, such as exposure or zoom `camera-control/best-practices/define-prominent-values-for-a-slider`

## Don't use it when
- You would duplicate in the viewfinder the sliders or toggles the overlay already shows `camera-control/best-practices/minimize-distractions-in-the-viewfinder`
- You need custom symbols or state-reflecting icons: not supported `camera-control/best-practices/use-sf-symbols-to-represent-control` (no HIG alternative named)

## Cost to the user
Low: it keeps the viewfinder clean and saves taps. Clutter from duplicated controls, or controls that do not apply to the current mode, cost clarity `camera-control/best-practices/minimize-distractions-in-the-viewfinder` `camera-control/best-practices/enable-or-disable-controls-depending-on`.

## Principles at stake
- **Simplicity:** a clear viewfinder and short names `camera-control/best-practices/keep-names-of-controls-short`
- **Familiarity:** SF Symbols and units such as EV or % `camera-control/best-practices/include-units-or-symbols-with-slider`
- **Agency:** launch from anywhere, and the system remembers the last control `camera-control/best-practices/consider-how-to-arrange-your-controls`
- **Craft:** prominent slider values at sensible steps `camera-control/best-practices/define-prominent-values-for-a-slider`

## Key rules
- Choose a clear SF Symbol for each control `camera-control/best-practices/use-sf-symbols-to-represent-control`
- Keep control names short `camera-control/best-practices/keep-names-of-controls-short`
- Add units or symbols to slider values `camera-control/best-practices/include-units-or-symbols-with-slider`
- Define prominent values, such as frequent choices or even zoom steps `camera-control/best-practices/define-prominent-values-for-a-slider`
- Keep camera UI out of the overlay areas in both orientations, with the viewfinder as large as possible `camera-control/best-practices/make-space-for-the-overlay-in`
- Enable or disable controls by camera mode; the set cannot change at runtime `camera-control/best-practices/enable-or-disable-controls-depending-on`
- Put common controls in the middle and rare ones at the sides `camera-control/best-practices/consider-how-to-arrange-your-controls`
- Build a locked camera capture extension so people can launch from anywhere `camera-control/best-practices/allow-people-to-use-the-camera`

## Platform differences
- **iOS:** the only platform; all rules apply.
- **Not available on:** iPadOS, macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep the viewfinder clear and do not duplicate system controls `camera-control/best-practices/minimize-distractions-in-the-viewfinder`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Action button](action-button.md) · [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols) · [Controls](https://developer.apple.com/design/human-interface-guidelines/controls)
