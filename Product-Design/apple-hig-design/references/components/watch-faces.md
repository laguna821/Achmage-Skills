---
slug: watch-faces
title: "Watch faces"
kind: technology
group: "System experiences"
platforms: [watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/watch-faces
decision_trees: [beyond-the-app]
---

# Watch faces

**In one line:** Shareable Apple Watch faces that bundle several of your complications into a ready-made, curated setup.

## Why it exists
A watch face is where people see your app most often, but they must set it up themselves. Sharing a face with several of your complications shows a curated experience and helps people find your app `watch-faces/best-practices/help-people-discover-your-app-by`. It serves Purpose and Agency, and Flexibility across watch models.

## Use it when
- You want people to discover your app through a face that features several of your complications `watch-faces/best-practices/help-people-discover-your-app-by`
- You can offer faces that suit every Apple Watch model, with older-compatible equivalents `watch-faces/best-practices/aim-to-offer-shareable-watch-faces`

## Don't use it when
- You would share a face with a single, thin setup: feature several complications to make it worthwhile (no HIG alternative named) `watch-faces/best-practices/help-people-discover-your-app-by`
- A device cannot run the face: do not show an error, give a compatible alternative `watch-faces/best-practices/respond-gracefully-if-people-choose-an`

## Cost to the user
Low: people pick a face they like and skip manual setup. The risk is a dead end on an incompatible watch, which the rules ask you to avoid `watch-faces/best-practices/respond-gracefully-if-people-choose-an`.

## Principles at stake
- **Purpose:** a curated face shows what your app is for `watch-faces/best-practices/help-people-discover-your-app-by`
- **Craft:** a preview that shows the face's advantages in a hardware bezel `watch-faces/best-practices/display-a-preview-of-each-watch`
- **Flexibility:** cover all watch models and label supported devices `watch-faces/best-practices/aim-to-offer-shareable-watch-faces`
- **Agency:** an incompatible choice still leads to something usable `watch-faces/best-practices/respond-gracefully-if-people-choose-an`

## Key rules
- Share faces that feature several of your complications `watch-faces/best-practices/help-people-discover-your-app-by`
- Show a preview for each face, framed by an illustrated or high-fidelity hardware bezel `watch-faces/best-practices/display-a-preview-of-each-watch`
- Offer shareable faces for all Apple Watch models `watch-faces/best-practices/aim-to-offer-shareable-watch-faces`
- Give a similar configuration on older-compatible faces `watch-faces/best-practices/aim-to-offer-shareable-watch-faces`
- Label which devices each face supports `watch-faces/best-practices/aim-to-offer-shareable-watch-faces`
- On an incompatible choice, provide a compatible alternative immediately instead of an error `watch-faces/best-practices/respond-gracefully-if-people-choose-an`
- Warn in previews that a substitute face may appear `watch-faces/best-practices/respond-gracefully-if-people-choose-an`

## Platform differences
- **watchOS:** the only platform; all rules apply.
- **Not available on:** iOS, iPadOS, macOS, tvOS, visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none]
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Widgets](widgets.md) · [Live Activities](live-activities.md) · see [Decision tree](../decision-trees/beyond-the-app.md)
