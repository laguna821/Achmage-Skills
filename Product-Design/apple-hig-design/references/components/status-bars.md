---
slug: status-bars
title: "Status bars"
kind: component
group: "System experiences"
platforms: [iOS, iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/status-bars
---

# Status bars

**In one line:** The strip at the top of an iPhone or iPad screen that shows system information such as time and battery.

## Why it exists
People rely on the system strip for time and device status. Apps should keep it readable and predictable, and hide it only when content such as media needs the full screen `status-bars/best-practices/consider-temporarily-hiding-the-status-bar`. It serves Familiarity and Agency: people can always bring it back `status-bars/best-practices/avoid-permanently-hiding-the-status-bar`.

## Use it when
- Content scrolls beneath it: keep it readable with a blurred scroll edge effect `status-bars/best-practices/obscure-content-under-the-status-bar`
- Full-screen media is showing: hide it temporarily `status-bars/best-practices/consider-temporarily-hiding-the-status-bar`

## Don't use it when
- You are tempted to hide it permanently: let people restore it with a simple, discoverable gesture such as a tap (no HIG alternative named) `status-bars/best-practices/avoid-permanently-hiding-the-status-bar`
- You would let content show clearly behind it: it can look interactive (no HIG alternative named) `status-bars/best-practices/obscure-content-under-the-status-bar`

## Cost to the user
Almost none while visible. Hiding it removes system information, so a hidden bar needs an easy way back `status-bars/best-practices/avoid-permanently-hiding-the-status-bar`.

## Principles at stake
- **Familiarity:** it stays legible and does not suggest that content behind it is interactive `status-bars/best-practices/obscure-content-under-the-status-bar`
- **Agency:** people can bring a hidden bar back `status-bars/best-practices/avoid-permanently-hiding-the-status-bar`
- **Delight:** hiding it for media gives content more room `status-bars/best-practices/consider-temporarily-hiding-the-status-bar`

## Key rules
- Keep the bar readable and do not imply content behind it is interactive `status-bars/best-practices/obscure-content-under-the-status-bar`
- Prefer a scroll edge effect with a blurred view behind it `status-bars/best-practices/obscure-content-under-the-status-bar`
- Consider hiding it for a while during full-screen media `status-bars/best-practices/consider-temporarily-hiding-the-status-bar`
- Never hide it for good `status-bars/best-practices/avoid-permanently-hiding-the-status-bar`
- Offer a simple, discoverable gesture to bring it back `status-bars/best-practices/avoid-permanently-hiding-the-status-bar`

## Platform differences
- **iOS, iPadOS:** the rules above apply as written.
- **Not available on:** macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] keep system chrome readable; on mobile web, hide browser or fixed bars only temporarily `status-bars/best-practices/avoid-permanently-hiding-the-status-bar`
- **Desktop web:** [HIG transfer] a fixed top bar over scrolling content should be blurred or opaque so content behind does not look clickable `status-bars/best-practices/obscure-content-under-the-status-bar`
- **Slides:** [HIG transfer] a full-screen image or video slide may drop persistent chrome `status-bars/best-practices/consider-temporarily-hiding-the-status-bar`
- **Card news:** [HIG none]

## Related
[Live Activities](live-activities.md) · [Widgets](widgets.md)
