---
slug: app-clips
title: "App Clips"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/app-clips
---

# App Clips

**In one line:** A small, fast part of an app that opens from a code, link or tag so people can finish one task without installing anything.

## Why it exists
People often need one thing right now, such as paying for parking or renting a bike. An App Clip lets them finish the task, try a demo or beat a level without the full app `app-clips/designing-your-app-clip/allow-people-to-complete-a-task`. It earns trust by being useful, not promotional `app-clips/designing-your-app-clip/dont-use-app-clips-solely-for`.

## Use it when
- A single, specific task can be finished quickly in context `app-clips/designing-your-app-clip/focus-on-essential-features`
- A demo or taste of the full app should be usable without installation `app-clips/designing-your-app-clip/allow-people-to-complete-a-task`
- A business needs an experience tied to a place or object, launched from a code `app-clips/designing-your-app-clip/creating-app-clips-for-businesses/use-consistent-branding`

## Don't use it when
- The goal is to promote products or services, or to show ads `app-clips/designing-your-app-clip/dont-use-app-clips-solely-for`
- Only web content is possible: give a quick link to your site instead `app-clips/designing-your-app-clip/avoid-using-web-views-in-your`
- The task needs tab bars, settings or complex navigation: that belongs in the full app `app-clips/designing-your-app-clip/design-a-linear-easy-to-use`

## Cost to the user
Everything the App Clip asks for is friction in a moment of need: waiting at launch, creating an account, or an install prompt. The HIG asks for instant use, no splash screen and no forced sign-up `app-clips/designing-your-app-clip/ensure-people-can-use-your-app` `app-clips/designing-your-app-clip/avoid-requiring-people-to-create-an`.

## Principles at stake
- **Simplicity:** linear flow, essential features only `app-clips/designing-your-app-clip/design-a-linear-easy-to-use` `app-clips/designing-your-app-clip/focus-on-essential-features`
- **Agency:** finish the task without installing, and recommend the full app politely at a natural pause `app-clips/designing-your-app-clip/showcasing-your-app/pick-the-right-time-to-recommend`
- **Responsibility:** minimal personal data and tightly limited notifications `app-clips/designing-your-app-clip/preserving-privacy/limit-the-amount-of-data-you` `app-clips/designing-your-app-clip/limiting-notifications/keep-notifications-focused`
- **Craft:** a lightweight build that opens immediately `app-clips/designing-your-app-clip/ensure-your-app-clip-is-small`

## Key rules
- Include only what the task needs; leave advanced features to the full app `app-clips/designing-your-app-clip/focus-on-essential-features`
- Build with native components `app-clips/designing-your-app-clip/avoid-using-web-views-in-your`
- At launch, take people straight to the section matching their context `app-clips/designing-your-app-clip/on-launch-show-the-most-relevant`
- Bundle needed assets and avoid fetching extra data `app-clips/designing-your-app-clip/ensure-your-app-clip-is-small`
- Consider Apple Pay for checkout and Sign in with Apple for login, and ask for an account only after the task `app-clips/designing-your-app-clip/make-it-easy-to-pay-for` `app-clips/designing-your-app-clip/preserving-privacy/consider-offering-sign-in-with-apple`
- Suggest the full app only when the task is done, with no repeated requests and no push notifications for it `app-clips/designing-your-app-clip/showcasing-your-app/recommend-your-app-in-a-nonintrusive`
- Ask for notification permission only for use over a day where a reminder helps `app-clips/designing-your-app-clip/limiting-notifications/only-ask-for-permission-to-use`
- Put the business's branding forward, matching its card `app-clips/designing-your-app-clip/creating-app-clips-for-businesses/use-consistent-branding`

## Anatomy and content
Card: pick imagery that shows the value or the place, not a UI screenshot, and keep words out of the image `app-clips/creating-content-for-an-app-clip-card/prefer-photography-and-graphics` `app-clips/creating-content-for-an-app-clip-card/avoid-using-text`. Supply a 1800x1200 PNG or JPEG without transparency `app-clips/creating-content-for-an-app-clip-card/adhere-to-image-requirements`. Title up to 30 characters, subtitle up to 56 `app-clips/creating-content-for-an-app-clip-card/use-concise-copy`. Action verb: View for media or informational content, Play for games, Open otherwise `app-clips/creating-content-for-an-app-clip-card/pick-a-verb-for-the-action`.

App Clip Codes: use the generated code unaltered, with no overlaid text or effects `app-clips/app-clip-codes/customizing-your-app-clip-code/always-use-the-generated-app-clip` `app-clips/app-clip-codes/displaying-app-clip-codes/make-sure-the-app-clip-code`. Meet minimum sizes (3/4 inch printed, 256x256 px digital) `app-clips/app-clip-codes/displaying-app-clip-codes/dont-create-app-clip-codes-that`. Place codes on flat or cylindrical surfaces `app-clips/app-clip-codes/displaying-app-clip-codes/place-your-app-clip-code-on`, with clear margins `app-clips/app-clip-codes/displaying-app-clip-codes/provide-enough-space-between-an-app`. Print on matte, non-reflective stock `app-clips/printing-guidelines/use-high-quality-non-textured-print`, and print at 300 dpi or more `app-clips/printing-guidelines/use-high-resolution-images-and-printer`.

## Platform differences
- **iOS, iPadOS:** no additional considerations.
- **Not available on:** macOS, tvOS, visionOS, watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG] lightweight, linear, task-first flows with no forced account fit instant web experiences `app-clips/designing-your-app-clip/avoid-requiring-people-to-create-an`
- **Desktop web:** [HIG transfer] the same lean, task-first approach applies to a landing flow `app-clips/designing-your-app-clip/design-a-linear-easy-to-use`
- **Slides:** [HIG transfer] pick informative imagery over text-heavy visuals `app-clips/creating-content-for-an-app-clip-card/be-informative`
- **Card news:** [HIG transfer] concise copy (title 30, subtitle 56 characters) and informative photos suit a card `app-clips/creating-content-for-an-app-clip-card/use-concise-copy`

## Related
[Apple Pay](apple-pay.md) · [Apple In-App Purchase](apple-in-app-purchase.md) · [Sign in with Apple](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)
