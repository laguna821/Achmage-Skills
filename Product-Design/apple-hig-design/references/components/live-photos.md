---
slug: live-photos
title: "Live Photos"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/live-photos
---

# Live Photos

**In one line:** A photo that includes a moment of motion and sound around the shot, which apps must treat as one whole item.

## Why it exists
A Live Photo behaves the same way in every app that shows it. People rely on that shared treatment and interaction model, so apps keep the item whole and recognizable (Familiarity) `live-photos/best-practices/keep-live-photo-content-intact` `live-photos/best-practices/make-live-photos-easily-distinguishable-from`.

## Use it when
- Your app displays photos and should show Live Photos with their motion: mark them so people can tell them from stills `live-photos/best-practices/make-live-photos-easily-distinguishable-from`
- Your app edits Live Photos: apply every adjustment to all frames `live-photos/best-practices/apply-adjustments-to-all-frames`
- Your app shares photos: let people preview the full Live Photo first `live-photos/best-practices/implement-a-great-photo-sharing-experience`

## Don't use it when
- You cannot apply an effect to every frame: let people convert to a still photo instead `live-photos/best-practices/apply-adjustments-to-all-frames`
- The platform or context does not support Live Photos: show a traditional still, not an imitation `live-photos/best-practices/display-live-photos-as-traditional-photos`
- You are on watchOS: not supported

## Cost to the user
Little attention cost if done consistently. The risk is confusion: an unmarked Live Photo, a missing download indicator, or an added playback button leaves people unsure what they have `live-photos/best-practices/clearly-indicate-when-a-live-photo` `live-photos/best-practices/make-live-photos-easily-distinguishable-from`.

## Principles at stake
- **Familiarity:** same visuals and interaction everywhere; no split-out frames or audio `live-photos/best-practices/keep-live-photo-content-intact`
- **Agency:** people choose how to share, as Live Photo or still `live-photos/best-practices/implement-a-great-photo-sharing-experience`
- **Simplicity:** show a plain still where unsupported `live-photos/best-practices/display-live-photos-as-traditional-photos`
- **Craft:** a badge sits in the same spot on every photo `live-photos/best-practices/keep-badge-placement-consistent`

## Key rules
- Apply effects to every frame, or offer conversion to a still `live-photos/best-practices/apply-adjustments-to-all-frames`
- Keep the Live Photo whole: do not show frames or audio separately `live-photos/best-practices/keep-live-photo-content-intact`
- Offer a full preview and always a traditional-photo sharing option `live-photos/best-practices/implement-a-great-photo-sharing-experience`
- Show a progress indicator while downloading and signal when it is playable `live-photos/best-practices/clearly-indicate-when-a-live-photo`
- Where unsupported, show a still `live-photos/best-practices/display-live-photos-as-traditional-photos`
- Distinguish Live Photos at a glance, preferably with a hint of motion, otherwise a system badge; no playback button `live-photos/best-practices/make-live-photos-easily-distinguishable-from`
- Place any badge consistently, usually in a corner `live-photos/best-practices/keep-badge-placement-consistent`

## Platform differences
- **iOS, iPadOS, macOS, tvOS, visionOS:** supported, with no additional considerations for iOS, iPadOS, macOS and tvOS.
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep a type indicator in one consistent spot `live-photos/best-practices/keep-badge-placement-consistent`
- **Desktop web:** [HIG transfer] same consistent badge placement `live-photos/best-practices/keep-badge-placement-consistent`
- **Slides:** [HIG] a consistent badge position suits marking item types in a grid `live-photos/best-practices/keep-badge-placement-consistent`
- **Card news:** [HIG] the same consistent placement applies to labels on cards `live-photos/best-practices/keep-badge-placement-consistent`

## Related
[Photo editing](photo-editing.md) · [Image views](https://developer.apple.com/design/human-interface-guidelines/image-views)
