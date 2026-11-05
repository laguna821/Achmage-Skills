---
slug: lockups
title: "Lockups"
kind: component
group: "Layout and organization"
platforms: [tvOS]
source: https://developer.apple.com/design/human-interface-guidelines/lockups
---

# Lockups

**In one line:** An Apple TV unit that joins a content view, a header and a footer into one focusable element: cards, caption buttons, monograms or posters.

## Why it exists
On Apple TV, people move focus between items. A lockup bundles an image and its text so the whole unit grows and shrinks together when focused. Spacing and consistent sizing keep that motion clean (Craft, Familiarity) `lockups/best-practices/allow-adequate-space-between-lockups` `lockups/best-practices/use-consistent-lockup-sizes-within-a`.

## Use it when
- Media items need an image with a title, subtitle or rating that acts as one focusable target `lockups/best-practices/use-consistent-lockup-sizes-within-a`
- You show people, such as cast and crew, in monograms `lockups/monograms/prefer-images-over-initials`

## Don't use it when
- The platform is not Apple TV: lockups are tvOS only (no HIG alternative named) `lockups/best-practices/allow-adequate-space-between-lockups`

## Cost to the user
Cramped lockups overlap or push neighbors when one is focused, which breaks the sense of place `lockups/best-practices/allow-adequate-space-between-lockups`. Mixed sizes make rows look untidy `lockups/best-practices/use-consistent-lockup-sizes-within-a`.

## Principles at stake
- **Craft:** equal sizes and enough gap keep focus motion tidy `lockups/best-practices/use-consistent-lockup-sizes-within-a` `lockups/best-practices/allow-adequate-space-between-lockups`
- **Delight:** a photo makes a monogram feel more personal than initials `lockups/monograms/prefer-images-over-initials`

## Key rules
- Leave enough gap so a focused (enlarged) lockup does not overlap others `lockups/best-practices/allow-adequate-space-between-lockups`
- Keep lockups in one row or group at the same size `lockups/best-practices/use-consistent-lockup-sizes-within-a`
- In monograms, prefer a photo of the person over initials `lockups/monograms/prefer-images-over-initials`

## Anatomy and content
A lockup has a content view, a header above and a footer below. All three scale together on focus. Four types exist: cards (ratings and reviews), caption buttons (image or text with title and subtitle, tilting with the swipe), monograms (circular picture and name, initials as fallback) and posters (image with title and subtitle that show on focus) (see the source page).

## Platform differences
- **tvOS:** the only supported platform.
- **Not available on:** iOS, iPadOS, macOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep tiles in a row the same size; prefer photos for people `lockups/best-practices/use-consistent-lockup-sizes-within-a` `lockups/monograms/prefer-images-over-initials`
- **Desktop web:** [HIG transfer] leave room for hover or focus enlargement between tiles `lockups/best-practices/allow-adequate-space-between-lockups`
- **Slides:** [HIG transfer] same-size items per row, photos over initials `lockups/best-practices/use-consistent-lockup-sizes-within-a`
- **Card news:** [HIG transfer] same-size items per row, photos over initials `lockups/monograms/prefer-images-over-initials`

## Related
[Designing for tvOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · [Image views](image-views.md)
