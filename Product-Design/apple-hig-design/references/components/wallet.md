---
slug: wallet
title: "Wallet"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/wallet
---

# Wallet

**In one line:** The place where people keep passes, track orders and verify identity, so your content is at hand when needed.

## Why it exists
Printed tickets and cards get lost, and order status lives in emails. Wallet keeps passes current, surfaces them when relevant, and shows order progress `wallet/passes/help-the-system-suggest-a-pass` `wallet/passes/keep-passes-up-to-date`. It also lets people share identity data with a clear reason and limit (Responsibility, Simplicity) `wallet/identity-verification/ask-only-for-the-data-you`.

## Use it when
- You issue tickets, cards or similar passes that should be added in one tap `wallet/passes/offer-to-add-new-passes-to`
- Customers place orders and want status without hunting through email `wallet/order-tracking/make-it-easy-for-people-to`
- A process truly needs identity or age information at the moment it happens `wallet/identity-verification/ask-for-identity-information-only-at`

## Don't use it when
- Updates are marketing or not time-critical: do not send change messages for them (no HIG alternative named) `wallet/passes/use-change-messages-only-for-updates`
- Identity information is wanted early or at account creation: ask only when needed (no HIG alternative named) `wallet/identity-verification/ask-for-identity-information-only-at`
- The device cannot provide the requested identity info: use a fallback verification method `wallet/identity-verification/present-a-wallet-verification-option-only`

## Cost to the user
Wallet notifies people on each add, so adds should be grouped and predictable `wallet/passes/add-related-passes-as-a-group` `wallet/passes/offer-to-add-new-passes-to`. Change messages interrupt, so reserve them for critical updates `wallet/passes/use-change-messages-only-for-updates`. Identity requests ask for trust, and unrelated ones raise suspicion `wallet/identity-verification/ask-for-identity-information-only-at`.

## Principles at stake
- **Responsibility:** ask only for needed data, say why, and state retention `wallet/identity-verification/clearly-indicate-whether-you-will-keep`
- **Agency:** get permission before deleting passes, and do not re-ask after a decline `wallet/passes/always-get-permission-before-deleting-passes` `wallet/passes/help-people-add-a-pass-created`
- **Simplicity:** an uncluttered pass front, short order text `wallet/designing-passes/keep-the-pass-front-uncluttered` `wallet/order-tracking/in-general-keep-text-brief`
- **Craft:** logos, images and contrast stay legible on every device `wallet/designing-passes/ensure-sufficient-contrast-between-background-and`

## Key rules
- Offer adding in one tap, in the background after one-time authorization, or via a review view `wallet/passes/offer-to-add-new-passes-to`
- Add related passes together and keep an Add to Apple Wallet button wherever pass info appears `wallet/passes/add-related-passes-as-a-group` `wallet/passes/display-an-add-to-apple-wallet`
- Link to a pass already in Wallet with a "View in Wallet" style link `wallet/passes/let-people-jump-from-your-app`
- Set expiration, relevant date and voided correctly, and provide relevance so the system can surface the pass `wallet/passes/tell-the-system-when-your-passes` `wallet/passes/help-the-system-suggest-a-pass`
- Keep passes current, such as flight changes `wallet/passes/keep-passes-up-to-date`
- Put essential details in the header and rare ones in the additional information sheet `wallet/designing-passes/keep-the-pass-front-uncluttered`
- Make passes identifiable with brand color or imagery, and avoid device-specific instructions like "Slide to view" `wallet/designing-passes/make-your-pass-instantly-identifiable` `wallet/designing-passes/use-language-that-works-on-any`
- Make order info available right after purchase, with a status if details come later `wallet/order-tracking/make-information-about-an-order-available`
- Keep the fulfillment screen focused on tracking, above any promotion `wallet/order-tracking/displaying-order-and-fulfillment-details/keep-the-fulfillment-screen-centered-on`
- Request only needed identity data, such as an age threshold rather than a birth date, with a clear purpose string `wallet/identity-verification/ask-only-for-the-data-you` `wallet/identity-verification/clearly-and-succinctly-describe-the-reason`

## Anatomy and content
Passes: put visual content only in images and text in text fields, because embedded text is not accessible `wallet/pass-images/reserve-pass-images-for-visual-content`. Keep image files small `wallet/pass-images/keep-image-file-sizes-small`, provide a pass icon `wallet/pass-images/provide-a-pass-icon`, and avoid inner drop shadows on logos `wallet/pass-images/logo/avoid-inner-drop-shadows-on-logo`. Poster passes keep content above the bottom material strip `wallet/pass-images/background/poster-pass-backgrounds`.

Orders: use a high-resolution logo and distinct product images on plain solid backgrounds `wallet/order-tracking/supply-a-high-resolution-logo-image` `wallet/order-tracking/supply-distinct-high-resolution-product-images`. Write clear, friendly, localized text `wallet/order-tracking/use-clear-approachable-language-and-localize`. Describe each item, offer several contact methods including a website link, give carrier links and estimated arrival, and be direct about Issue or Canceled status `wallet/order-tracking/displaying-order-and-fulfillment-details/clearly-describe-each-item-so-people` `wallet/order-tracking/displaying-order-and-fulfillment-details/make-it-easy-for-customers-to` `wallet/order-tracking/displaying-order-and-fulfillment-details/help-people-track-their-order` `wallet/order-tracking/displaying-order-and-fulfillment-details/be-direct-and-thorough-when-describing`. Avoid duplicate notifications when your app is installed `wallet/order-tracking/displaying-order-and-fulfillment-details/avoid-sending-duplicate-notifications`.

## Platform differences
- **watchOS:** passes show less on Apple Watch and some images get white space cropped, so keep essentials out of elements that may be missing and do not pad images `wallet/designing-passes/design-a-pass-that-looks-great`
- **iOS, iPadOS, macOS, visionOS:** no additional considerations.
- **Not available on:** tvOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] ticket and order screens can follow the header-first, uncluttered layout and the status-first order messaging `wallet/designing-passes/keep-the-pass-front-uncluttered`
- **Desktop web:** [HIG transfer] identity requests should be timely, minimal and explained `wallet/identity-verification/ask-only-for-the-data-you`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Apple Pay](apple-pay.md) · [ID Verifier](id-verifier.md) · [Sign in with Apple](sign-in-with-apple.md)
