---
slug: rating-indicators
title: "Rating indicators"
kind: component
group: "Status"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/rating-indicators
decision_trees: [progress-and-status]
---

# Rating indicators

**In one line:** A row of stars or similar symbols showing, and letting people set, a rank or rating.

## Why it exists
Ranked items need a quick, familiar way to show and change their rank. The star is widely recognized for rankings, so people read it as a rating without explanation `rating-indicators/best-practices/if-you-replace-the-star-with`. Changing rank in place saves a trip to another screen `rating-indicators/best-practices/make-it-easy-to-change-rankings`.

## Use it when
- Items in a ranked list carry a rating that people may want to change `rating-indicators/best-practices/make-it-easy-to-change-rankings`

## Don't use it when
- Changing a rank would send people to a separate edit screen: edit in place instead (no HIG alternative named) `rating-indicators/best-practices/make-it-easy-to-change-rankings`
- The value is a level within a range, not a rank: the HIG defines [Gauges](gauges.md) for that (from the Gauges page definition; no rule states the choice)
- A custom symbol would not read as a rating: keep the star, or make the replacement clearly a rating `rating-indicators/best-practices/if-you-replace-the-star-with`

## Cost to the user
Sending people to a separate screen to change a rank adds navigation `rating-indicators/best-practices/make-it-easy-to-change-rankings`. A symbol that does not suggest a scale makes people stop and decode it `rating-indicators/best-practices/if-you-replace-the-star-with`.

## Principles at stake
- **Agency:** in-place rank changes keep control with the person `rating-indicators/best-practices/make-it-easy-to-change-rankings`
- **Simplicity:** no extra screen for a small edit `rating-indicators/best-practices/make-it-easy-to-change-rankings`
- **Familiarity:** the star signals a rating, other symbols may not `rating-indicators/best-practices/if-you-replace-the-star-with`

## Key rules
- In ranked lists, let people change an item's rank in place `rating-indicators/best-practices/make-it-easy-to-change-rankings`
- When replacing the star, make sure people can still tell the symbol represents a rating `rating-indicators/best-practices/if-you-replace-the-star-with`

## Platform differences
No platform-specific guidance; the component is documented for macOS only.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] the star-familiarity and in-place-edit lessons apply to any rating widget `rating-indicators/best-practices/if-you-replace-the-star-with`
- **Desktop web:** [HIG] both rules apply directly `rating-indicators/best-practices/make-it-easy-to-change-rankings`
- **Slides:** [HIG transfer] keep a recognizable symbol on a slide rating `rating-indicators/best-practices/if-you-replace-the-star-with`
- **Card news:** [HIG transfer] same `rating-indicators/best-practices/if-you-replace-the-star-with`

## Related
[Gauges](gauges.md) · [Ratings and reviews](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews) · see [Decision tree](../decision-trees/progress-and-status.md)
