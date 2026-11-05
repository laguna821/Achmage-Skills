---
slug: top-shelf
title: "Top Shelf"
kind: technology
group: "System experiences"
platforms: [tvOS]
source: https://developer.apple.com/design/human-interface-guidelines/top-shelf
decision_trees: [beyond-the-app]
---

# Top Shelf

**In one line:** The large content area at the top of the Apple TV Home Screen where your app can feature content when its icon is focused.

## Why it exists
When someone focuses your app's icon, Top Shelf is a chance to take them straight to something they care about `top-shelf/best-practices/help-people-jump-right-into-your`. It serves Purpose and Agency: new, relevant, personal content, not promotion `top-shelf/best-practices/feature-new-content` `top-shelf/best-practices/avoid-showing-advertisements-or-prices`.

## Use it when
- You can take people straight into content, for example a primary play button plus More Info `top-shelf/best-practices/help-people-jump-right-into-your`
- You have new releases, episodes or upcoming titles to highlight `top-shelf/best-practices/feature-new-content`
- You can personalize it, such as resuming playback or returning to active gameplay `top-shelf/best-practices/personalize-peoples-favorite-content`

## Don't use it when
- You would show ads, or prices before people show interest (no HIG alternative named) `top-shelf/best-practices/avoid-showing-advertisements-or-prices`
- The content was already bought, rented or watched: feature something new `top-shelf/best-practices/feature-new-content`

## Cost to the user
Low: it appears passively, and a good layout saves steps to content. Ads and stale items waste prime screen space `top-shelf/best-practices/avoid-showing-advertisements-or-prices`.

## Principles at stake
- **Purpose:** feature new, relevant content `top-shelf/best-practices/feature-new-content`
- **Agency:** let people resume or jump in directly `top-shelf/best-practices/personalize-peoples-favorite-content`
- **Responsibility:** no ads in a space people did not ask to fill `top-shelf/best-practices/avoid-showing-advertisements-or-prices`
- **Delight:** dynamic content, ideally with layered images `top-shelf/best-practices/showcase-compelling-dynamic-content-that-can`

## Key rules
- Prefer dynamic content with the newest or top-rated items, ideally layered images `top-shelf/best-practices/showcase-compelling-dynamic-content-that-can`
- Without full-screen content, supply at least one static fallback at 2320x720 pt; tvOS flips and blurs it `top-shelf/best-practices/if-you-dont-provide-the-recommended`
- Make static images look non-interactive `top-shelf/best-practices/avoid-implying-interactivity-in-a-static`
- Carousel actions: give a concise title and an optional brief subtitle `top-shelf/dynamic-layouts/carousel-actions/provide-a-title`
- Carousel details: show the playing title near the top, with an optional short phrase or app attribution above `top-shelf/dynamic-layouts/carousel-details/provide-a-title-that-identifies-the`
- Sectioned row: load enough images to span the screen width and include at least one label `top-shelf/dynamic-layouts/sectioned-content-row/provide-enough-content-to-constitute-a`
- Mixed sizes scale shorter images up to the tallest (16:9 can grow to 500 pixels) `top-shelf/dynamic-layouts/sectioned-content-row/169/be-aware-of-additional-scaling-when`
- Scrolling inset banner: three to eight images `top-shelf/dynamic-layouts/sectioned-content-row/scrolling-inset-banner/provide-three-to-eight-images`
- Put banner text in the image, on its own layer if layered, and repeat it in the accessibility label `top-shelf/dynamic-layouts/sectioned-content-row/scrolling-inset-banner/if-you-need-text-add-it`

## Platform differences
- **tvOS:** the only platform; all rules above apply.
- **Not available on:** iOS, iPadOS, macOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] static hero images should not look tappable unless they are `top-shelf/best-practices/avoid-implying-interactivity-in-a-static`
- **Desktop web:** [HIG transfer] same for a hero banner; give carousels a bounded count `top-shelf/dynamic-layouts/sectioned-content-row/scrolling-inset-banner/provide-three-to-eight-images`
- **Slides:** [HIG transfer] a concise title with optional subtitle suits a title slide `top-shelf/dynamic-layouts/carousel-actions/provide-a-title`
- **Card news:** [HIG] a concise title and optional subtitle apply directly; text built into the image gets an accessibility label `top-shelf/dynamic-layouts/sectioned-content-row/scrolling-inset-banner/if-you-need-text-add-it`

## Related
[Widgets](widgets.md) · [Live Activities](live-activities.md) · see [Decision tree](../decision-trees/beyond-the-app.md)
