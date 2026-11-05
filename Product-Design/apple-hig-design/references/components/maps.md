---
slug: maps
title: "Maps"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/maps
---

# Maps

**In one line:** An interactive map you embed in your app, with your own annotations, overlays, place cards and indoor venue maps.

## Why it exists
People know how to zoom, pan and select on a map, and your content needs to sit on it without clutter. The guidance keeps maps interactive and legible, and lets custom information blend in (Familiarity, Simplicity, Craft) `maps/best-practices/in-general-make-your-map-interactive` `maps/best-practices/cluster-overlapping-points-of-interest-to`.

## Use it when
- Location is central to your content: let people zoom and pan as usual `maps/best-practices/in-general-make-your-map-interactive`
- People must find places: add search with category filters `maps/best-practices/help-people-find-places-in-your`
- You show details about a place: use a place card `maps/place-cards/displaying-place-cards-in-a-map/consider-your-map-presentation-when-choosing`
- You run a venue with several floors: add an indoor map with a floor picker `maps/indoor-maps/offer-a-floor-picker-if-your`

## Don't use it when
- A non-interactive overlay would block the map: keep it interactive `maps/best-practices/in-general-make-your-map-interactive`
- A place card would repeat what your app already shows: choose a lighter style such as compact callout or caption `maps/place-cards/displaying-place-cards-in-a-map/avoid-duplicating-information`
- Covering the Apple logo and legal link permanently: keep them visible `maps/best-practices/help-people-see-the-apple-logo`

## Cost to the user
Maps use space and can get cluttered. Too much detail, overlapping pins, or controls that blend into the map make people work to read it `maps/indoor-maps/adjust-map-detail-based-on-the` `maps/best-practices/cluster-overlapping-points-of-interest-to` `maps/custom-information/make-sure-theres-enough-contrast-between`.

## Principles at stake
- **Familiarity:** standard zoom and pan, clear selection styling, a visible Apple logo `maps/best-practices/in-general-make-your-map-interactive` `maps/best-practices/clearly-identify-elements-that-people-select`
- **Simplicity:** clustering, detail that scales with zoom, short floor labels `maps/best-practices/cluster-overlapping-points-of-interest-to` `maps/indoor-maps/adjust-map-detail-based-on-the`
- **Craft:** enough contrast and sensible overlay layers `maps/custom-information/make-sure-theres-enough-contrast-between` `maps/custom-information/use-overlays-to-define-map-areas`
- **Agency:** limit scrolling away from a venue so people do not get lost `maps/indoor-maps/limit-scrolling-outside-of-your-venue`

## Key rules
- Choose the emphasis style that fits: default saturated, or muted `maps/best-practices/pick-a-map-emphasis-style-that`
- Make selected elements stand out with an outline and color change `maps/best-practices/clearly-identify-elements-that-people-select`
- Style annotations to match your app, with icon strings of a couple of characters `maps/custom-information/use-annotations-that-match-the-visual`
- Use overlays to mark areas, picking a level that keeps the map beneath visible as needed `maps/custom-information/use-overlays-to-define-map-areas`
- Keep the selected location visible when a place card appears, offset and pointing at it `maps/place-cards/displaying-place-cards-in-a-map/keep-the-location-on-your-map`
- Make place card content fit different devices and resized windows `maps/place-cards/displaying-place-cards-in-a-map/make-sure-your-place-card-looks`
- Outside a map, use cues such as place names, addresses or a pin to show a place card can open `maps/place-cards/adding-place-cards-outside-of-a-map/use-location-related-cues-in-surrounding`
- Indoor: set areas apart with color plus icons, show surroundings dimmed if noninteractive, and match your app style `maps/indoor-maps/use-distinctive-styling-to-differentiate-the` `maps/indoor-maps/include-surrounding-areas-to-provide-context` `maps/indoor-maps/design-an-indoor-map-that-feels`
- Consider routes between the venue and transit or parking `maps/indoor-maps/consider-supporting-navigation-between-your-venue`

## Anatomy and content
Custom information on a map has three layers: annotations (pins), overlays (areas) and selectable custom details for standard features `maps/custom-information/if-you-want-to-display-custom`. Place cards come in full callout (most detail) and compact callout (saves space) `maps/place-cards/displaying-place-cards-in-a-map/consider-your-map-presentation-when-choosing`.

## Platform differences
- **watchOS:** size the map element to fit the screen without scrolling, and show the smallest region containing all points of interest `maps/platform-considerations/watchos/fit-the-map-interface-element-to` `maps/platform-considerations/watchos/show-the-smallest-region-that-encompasses`
- **iOS, iPadOS, macOS, tvOS, visionOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] interactive zoom and pan, clustering and clear selection apply to any map `maps/best-practices/in-general-make-your-map-interactive`
- **Desktop web:** [HIG] the same map rules apply `maps/best-practices/cluster-overlapping-points-of-interest-to`
- **Slides:** [HIG transfer] a static map can still use a clear selection style and a restrained overlay `maps/best-practices/clearly-identify-elements-that-people-select` `maps/custom-information/use-overlays-to-define-map-areas`
- **Card news:** [HIG transfer] a map graphic can use color plus icons to mark areas `maps/indoor-maps/use-distinctive-styling-to-differentiate-the`

## Related
[Charts](https://developer.apple.com/design/human-interface-guidelines/charts) · [Search fields](search-fields.md)
