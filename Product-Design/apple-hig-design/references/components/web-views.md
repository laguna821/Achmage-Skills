---
slug: web-views
title: "Web views"
kind: component
group: "Content"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/web-views
---

# Web views

**In one line:** A view that loads web content, such as embedded HTML or a site, directly inside an app.

## Why it exists
Sometimes people need a web page or HTML content without leaving the app. A web view keeps them in context, but it is not a browser: Safari is where people browse, so copying it adds nothing (Simplicity, Familiarity) `web-views/best-practices/avoid-using-a-web-view-to`.

## Use it when
- People need brief access to a website while staying in your app `web-views/best-practices/avoid-using-a-web-view-to`
- People may visit several pages inside the view, and you can provide back and forward controls `web-views/best-practices/support-forward-and-back-navigation-when`

## Don't use it when
- You are tempted to rebuild browser features: let people browse in Safari instead (no HIG component named) `web-views/best-practices/avoid-using-a-web-view-to`

## Cost to the user
A web view brings another page into your flow. Without back and forward controls, people get stuck, because that navigation is not there by default `web-views/best-practices/support-forward-and-back-navigation-when`.

## Principles at stake
- **Familiarity:** people expect to move between pages `web-views/best-practices/support-forward-and-back-navigation-when`
- **Simplicity:** do not duplicate a full browser inside the app; keep the web view to showing content `web-views/best-practices/avoid-using-a-web-view-to`

## Key rules
- Enable forward and back navigation and add visible controls when multiple pages are likely `web-views/best-practices/support-forward-and-back-navigation-when`
- Use a web view for short, in-context access, not to replicate Safari `web-views/best-practices/avoid-using-a-web-view-to`

## Platform differences
- No additional considerations on iOS, iPadOS, macOS and visionOS.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] an embedded page should stay brief; do not rebuild a browser `web-views/best-practices/avoid-using-a-web-view-to`
- **Desktop web:** [HIG none] the web itself is the medium; for an embedded frame, [HIG transfer] offer back and forward if people may navigate `web-views/best-practices/support-forward-and-back-navigation-when`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[WebKit](https://webkit.org/)

