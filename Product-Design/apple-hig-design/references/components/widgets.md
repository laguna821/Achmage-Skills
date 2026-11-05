---
slug: widgets
title: "Widgets"
kind: technology
group: "System experiences"
platforms: [iOS, iPadOS, macOS, watchOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/widgets
decision_trees: [beyond-the-app]
---

# Widgets

**In one line:** Small, glanceable views of an app's most useful content, placed on system surfaces so people see it without opening the app.

## Why it exists
People want a quick answer from an app without launching it. A widget tied to the app's core purpose delivers timely content fast `widgets/best-practices/choose-simple-ideas-that-relate-to` `widgets/best-practices/aim-to-create-a-widget-that`. It serves Purpose, Simplicity and Agency (a tap opens the right place in the app).

## Use it when
- A simple idea tied to the app's core purpose can give timely content at a glance `widgets/best-practices/choose-simple-ideas-that-relate-to`
- Information changes through the day and can stay fresh `widgets/best-practices/prefer-dynamic-information-that-changes-throughout`
- A larger size can add real layers of information or actions `widgets/best-practices/offer-widgets-in-multiple-sizes-when`

## Don't use it when
- The task needs real-time updates for a limited time: use [Live Activities](live-activities.md) instead `widgets/platform-considerations/ios-ipados/offer-live-activities-to-show-real`
- The action is complex: leave it to the app `widgets/best-practices/adding-interactivity/offer-simple-relevant-functionality-and-reserve`
- You would only repeat the app icon `widgets/best-practices/aim-to-create-a-widget-that`
- You would copy the widget's look inside your app without its behavior `widgets/best-practices/avoid-mirroring-your-widgets-appearance-within`

## Cost to the user
Low and passive: a widget does not interrupt, and a tap can go straight to details `widgets/best-practices/adding-interactivity/ensure-that-a-widget-interaction-opens`. Crowded or app-like layouts cost glanceability `widgets/best-practices/balance-information-density`.

## Principles at stake
- **Purpose:** only data tied to the widget's main purpose `widgets/best-practices/display-only-the-information-thats-directly`
- **Simplicity:** essentials at a glance, details on a longer look `widgets/best-practices/balance-information-density`
- **Agency:** let people configure what shows when that helps `widgets/best-practices/choose-between-automatically-displaying-content-and`
- **Flexibility:** legible in every rendering mode and text size `widgets/best-practices/displaying-text-in-widgets/avoid-rasterizing-text`
- **Delight:** surprise on meaningful days `widgets/best-practices/look-for-opportunities-to-surprise-and`

## Key rules
- Show only information directly tied to the widget's purpose `widgets/best-practices/display-only-the-information-thats-directly`
- Use brand elements for recognition without overpowering content `widgets/best-practices/use-brand-elements-thoughtfully`
- Pick an update schedule that fits how often data changes, and show last refresh if people may look often `widgets/best-practices/updating-widget-content/keep-your-widget-up-to-date`
- Keep interactions simple, glanceable and not app-like, with confident tap targets `widgets/best-practices/adding-interactivity/offer-interactivity-while-remaining-glanceable-and`
- Use standard margins and a container that adapts to the corner radius `widgets/best-practices/choosing-margins-and-padding/in-general-use-standard-margins-to` `widgets/best-practices/choosing-margins-and-padding/coordinate-the-corner-radius-of-your`
- Prefer the system font and text styles; avoid text smaller than about 11 points `widgets/best-practices/displaying-text-in-widgets/prefer-using-the-system-font-text` `widgets/best-practices/displaying-text-in-widgets/avoid-very-small-font-sizes`
- Keep text as real text so it scales and VoiceOver can read it `widgets/best-practices/displaying-text-in-widgets/avoid-rasterizing-text`
- Never rely on color alone for meaning `widgets/best-practices/using-color/convey-meaning-without-relying-on-specific`
- Support light and dark with semantic colors `widgets/rendering-modes/full-color/support-light-and-dark-appearances`
- Show a realistic gallery preview and recognizable placeholder content `widgets/previews-and-placeholders/design-a-realistic-preview-to-display` `widgets/previews-and-placeholders/design-placeholder-content-that-helps-people`

## Anatomy and content
Rendering modes: full color; accented (elements split into accent and primary sets, with the system rendering primary white and tinting accents); vibrant (full-opacity content, brighter grays for key items) `widgets/rendering-modes/accented/group-widget-components-into-an-accented` `widgets/rendering-modes/vibrant/create-optimized-assets-for-the-best`. Use full-color images sparingly because tinted and clear styles desaturate them `widgets/best-practices/using-color/use-full-color-images-judiciously`. Gallery description: a short, verb-first sentence without "This widget shows", with sizes grouped in one entry `widgets/previews-and-placeholders/write-a-succinct-widget-description` `widgets/previews-and-placeholders/group-your-widgets-sizes-together-and`.

## Platform differences
- **iOS, iPadOS:** keep Lock Screen widgets legible when the Always-On display dims; in StandBy, scale up text and avoid rich images `widgets/platform-considerations/ios-ipados/support-the-always-on-display-on` `widgets/platform-considerations/ios-ipados/standby-and-carplay/limit-usage-of-rich-images-or`
- **visionOS:** treat widgets as part of the room, with large type; people can scale widgets by 75 to 125 percent `widgets/platform-considerations/visionos/adapt-your-design-and-content-for` `widgets/platform-considerations/visionos/thresholds-and-sizes/display-content-in-a-way-that`. Choose elevated or recessed mounting, and paper or glass treatment `widgets/platform-considerations/visionos/mounting-styles/choose-the-mounting-style-that-fits` `widgets/platform-considerations/visionos/treatment-styles/choose-the-glass-style-for-information`
- **watchOS:** give the Smart Stack background a meaningful color, and supply relevancy information `widgets/platform-considerations/watchos/provide-a-colorful-background-that-conveys` `widgets/platform-considerations/watchos/encourage-the-system-to-display-or`
- **macOS:** no additional considerations.
- **Not available on:** tvOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] a home-screen or dashboard tile follows the same purpose-first, glanceable rules `widgets/best-practices/choose-simple-ideas-that-relate-to`
- **Desktop web:** [HIG] density, margins, real text and color-independence apply to dashboard tiles `widgets/best-practices/balance-information-density`
- **Slides:** [HIG] density and brand restraint apply to a KPI tile `widgets/best-practices/balance-information-density`
- **Card news:** [HIG] same density balance `widgets/best-practices/balance-information-density`

## Related
[Live Activities](live-activities.md) · [Watch faces](watch-faces.md) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · see [Decision tree](../decision-trees/beyond-the-app.md)
