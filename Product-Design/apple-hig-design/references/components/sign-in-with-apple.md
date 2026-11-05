---
slug: sign-in-with-apple
title: "Sign in with Apple"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple
---

# Sign in with Apple

**In one line:** A system sign-in method that creates or opens an account without a new password and lets people keep their email private.

## Why it exists
Forced sign-in makes people leave before they get any value, and extra passwords and forms add work. Sign in with Apple removes the new password `sign-in-with-apple/collecting-data/dont-ask-people-to-supply-a`. The design job is to ask late, explain why, and respect what people choose to share (Simplicity, Responsibility) `sign-in-with-apple/offering-sign-in-with-apple/delay-sign-in-as-long-as`.

## Use it when
- An account brings real value, and you can say briefly what it adds, such as personalization or sync `sign-in-with-apple/offering-sign-in-with-apple/ask-people-to-sign-in-only`
- An account is required: explain why first, then offer Sign in with Apple beside other sign-in methods `sign-in-with-apple/offering-sign-in-with-apple/if-you-require-an-account-ask`
- People already have an account and might want to link it `sign-in-with-apple/offering-sign-in-with-apple/consider-letting-people-link-an-existing`

## Don't use it when
- Sign-in is not needed yet: let people try the app first, and ask only when they reach something that needs an account (no HIG alternative named) `sign-in-with-apple/offering-sign-in-with-apple/delay-sign-in-as-long-as`
- The app is a commerce app mid-purchase: invite account creation after purchase, such as on the confirmation page `sign-in-with-apple/offering-sign-in-with-apple/in-a-commerce-app-wait-until`

## Cost to the user
Sign-in is a gate: it adds steps and a decision before people see value, so delay it and keep it brief `sign-in-with-apple/offering-sign-in-with-apple/delay-sign-in-as-long-as`. Extra questions after sign-in add needless work `sign-in-with-apple/offering-sign-in-with-apple/as-soon-as-sign-in-with`.

## Principles at stake
- **Simplicity:** no extra password and no unneeded questions after sign-in `sign-in-with-apple/collecting-data/dont-ask-people-to-supply-a` `sign-in-with-apple/offering-sign-in-with-apple/as-soon-as-sign-in-with`
- **Responsibility:** respect a private relay address instead of asking for a personal email `sign-in-with-apple/collecting-data/avoid-asking-for-a-personal-email`
- **Agency:** optional data is offered when useful, and declining never blocks features `sign-in-with-apple/collecting-data/give-people-a-chance-to-engage`
- **Craft:** buttons keep the system proportions and consistent alignment `sign-in-with-apple/displaying-buttons/using-the-system-provided-buttons/button-size-and-corner-radius/adjust-the-corner-radius-to-match`

## Key rules
- Ask for sign-in only when it brings value, with a short explanation of the benefit `sign-in-with-apple/offering-sign-in-with-apple/ask-people-to-sign-in-only`
- Delay sign-in as long as possible; let people browse or try first `sign-in-with-apple/offering-sign-in-with-apple/delay-sign-in-as-long-as`
- Welcome people right after sign-in and skip information you do not need `sign-in-with-apple/offering-sign-in-with-apple/as-soon-as-sign-in-with`
- Show wording such as "Using Sign in with Apple" on account or settings screens `sign-in-with-apple/offering-sign-in-with-apple/indicate-when-people-are-currently-signed`
- Say clearly which extra data is required and which is optional, and the benefit of optional items `sign-in-with-apple/collecting-data/clarify-whether-the-additional-data-you`
- Do not ask for a password from people using Sign in with Apple `sign-in-with-apple/collecting-data/dont-ask-people-to-supply-a`
- Be open about collected data, for example by greeting people with the name or email they shared `sign-in-with-apple/collecting-data/be-transparent-about-the-data-you`
- Make the button at least as large as other sign-in buttons and visible without scrolling `sign-in-with-apple/displaying-buttons/prominently-display-a-sign-in-with`

## Anatomy and content
Prefer the system-provided button; match its corner radius to your other buttons and keep its minimum size and margin, since titles vary by locale `sign-in-with-apple/displaying-buttons/using-the-system-provided-buttons/button-size-and-corner-radius/adjust-the-corner-radius-to-match` `sign-in-with-apple/displaying-buttons/using-the-system-provided-buttons/button-size-and-corner-radius/maintain-the-minimum-button-size-and`. For a custom logo-and-text button:
- Choose the logo format by button height: vector for any height, PNG only at its intended size `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-buttons-with-a-logo-and-text/choose-the-format-of-the-logo`
- Prefer the system font and keep the default capitalization `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-buttons-with-a-logo-and-text/prefer-the-system-font-for-the` `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-buttons-with-a-logo-and-text/in-general-preserve-the-capitalization-style`
- Center the title vertically, then add a logo matching the button height `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-buttons-with-a-logo-and-text/keep-the-title-and-logo-vertically`
- Keep the stated minimum margins and size (see the source page for values) `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-buttons-with-a-logo-and-text/maintain-a-minimum-margin-between-the` `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-buttons-with-a-logo-and-text/maintain-the-minimum-button-size-and`

For logo-only buttons: do not add horizontal padding, change shape only with a mask, never crop, and keep the stated margin `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-logo-only-buttons/dont-add-horizontal-padding-to-a` `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-logo-only-buttons/use-a-mask-to-change-the` `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-logo-only-buttons/maintain-a-minimum-margin-around-the`.

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] the same timing and data rules apply, and the button corner radius can range from square to capsule on iOS, macOS and the web `sign-in-with-apple/displaying-buttons/using-the-system-provided-buttons/button-size-and-corner-radius/adjust-the-corner-radius-to-match`
- **Desktop web:** [HIG] the web is named for button sizing and corner radius; the sign-in timing rules apply as written `sign-in-with-apple/offering-sign-in-with-apple/delay-sign-in-as-long-as`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy) · [Apple Pay](apple-pay.md) · [Wallet](wallet.md)
