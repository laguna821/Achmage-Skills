---
slug: apple-in-app-purchase
title: "Apple In-App Purchase"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase
---

# Apple In-App Purchase

**In one line:** The system way to sell content, features and subscriptions inside an app, with a standard confirmation sheet and subscription management.

## Why it exists
Buying inside an app involves money, so people need honest prices, clear terms and a familiar confirmation. The store should feel like part of the app `apple-in-app-purchase/best-practices/design-an-integrated-shopping-experience`, while the system confirmation sheet stays untouched `apple-in-app-purchase/best-practices/use-the-default-confirmation-sheet`. Letting people try before buying respects their choice `apple-in-app-purchase/best-practices/let-people-experience-your-app-before`.

## Use it when
- You sell digital content, features or auto-renewable subscriptions inside the app `apple-in-app-purchase/best-practices/design-an-integrated-shopping-experience`
- You offer subscriptions with several content choices, service levels or durations `apple-in-app-purchase/auto-renewable-subscriptions/offer-a-range-of-content-choices`
- You support offer codes redeemed in the app through the system flow `apple-in-app-purchase/auto-renewable-subscriptions/supporting-offer-codes/consider-supporting-offer-redemption-within-your`

## Don't use it when
- Payments are not possible, for example under parental restrictions: hide the store or explain why it is unavailable `apple-in-app-purchase/best-practices/display-your-store-only-when-people`
- The person already subscribes: do not push a new subscription `apple-in-app-purchase/auto-renewable-subscriptions/encourage-a-new-subscription-only-when`
- You are tempted to restyle or imitate the confirmation sheet `apple-in-app-purchase/best-practices/use-the-default-confirmation-sheet`

## Cost to the user
Purchases ask for money and a commitment. Hidden terms or hard-to-find cancellation turn that into distrust, so show the full billing amount and make canceling easy to find `apple-in-app-purchase/best-practices/display-the-total-billing-price-for` `apple-in-app-purchase/auto-renewable-subscriptions/helping-people-manage-their-subscriptions/always-make-it-easy-for-customers`.

## Principles at stake
- **Responsibility:** show the total price, trial terms, and links to terms and privacy `apple-in-app-purchase/best-practices/display-the-total-billing-price-for` `apple-in-app-purchase/auto-renewable-subscriptions/making-signup-effortless/give-people-more-information-in-your`
- **Agency:** try before buying, easy refunds and cancellation `apple-in-app-purchase/best-practices/let-people-experience-your-app-before` `apple-in-app-purchase/best-practices/providing-help/make-it-easy-for-people-to`
- **Simplicity:** short product names, only essential signup data `apple-in-app-purchase/best-practices/use-simple-succinct-product-names-and` `apple-in-app-purchase/auto-renewable-subscriptions/making-signup-effortless/simplify-initial-signup-by-asking-only`
- **Familiarity:** keep the system confirmation sheet and consider system subscription management `apple-in-app-purchase/auto-renewable-subscriptions/helping-people-manage-their-subscriptions/consider-using-the-system-provided-subscription`

## Key rules
- Let people try the app before buying; consider limited free access with subscriptions `apple-in-app-purchase/best-practices/let-people-experience-your-app-before`
- Give products short names that do not truncate, with plain descriptions `apple-in-app-purchase/best-practices/use-simple-succinct-product-names-and`
- Show the full billed amount for every purchase option `apple-in-app-purchase/best-practices/display-the-total-billing-price-for`
- Name each subscription option clearly with price and duration, including introductory and later prices `apple-in-app-purchase/auto-renewable-subscriptions/making-signup-effortless/provide-clear-distinguishable-subscription-options`
- State how a free trial works, including that payment starts automatically afterward `apple-in-app-purchase/auto-renewable-subscriptions/making-signup-effortless/clearly-describe-how-a-free-trial`
- Show subscription prompts at fitting moments, such as near a free-content limit `apple-in-app-purchase/auto-renewable-subscriptions/prompt-people-to-subscribe-at-relevant`
- Summarize subscriptions and the next renewal date near management controls `apple-in-app-purchase/auto-renewable-subscriptions/helping-people-manage-their-subscriptions/provide-summaries-of-the-customers-subscriptions`
- Make canceling easy to find and do; a retention reminder or offer is allowed `apple-in-app-purchase/auto-renewable-subscriptions/helping-people-manage-their-subscriptions/encourage-a-subscriber-to-keep-their`
- Offer purchase help before a refund request, keep the refund button easy to reach, and do not comment on Apple's refund policy `apple-in-app-purchase/best-practices/providing-help/provide-help-that-customers-can-view` `apple-in-app-purchase/best-practices/providing-help/avoid-characterizing-or-providing-guidance-on`

## Anatomy and content
Family Sharing: mention it where people browse offerings and explain its benefits `apple-in-app-purchase/best-practices/supporting-family-sharing/prominently-mention-family-sharing-in-places` `apple-in-app-purchase/best-practices/supporting-family-sharing/help-people-understand-the-benefits-of`. Offer codes: describe offers plainly, use only alphanumeric ASCII in custom codes, and say how to redeem them `apple-in-app-purchase/auto-renewable-subscriptions/supporting-offer-codes/clearly-explain-offer-details` `apple-in-app-purchase/auto-renewable-subscriptions/supporting-offer-codes/follow-guidelines-for-creating-a-custom` `apple-in-app-purchase/auto-renewable-subscriptions/supporting-offer-codes/tell-people-how-to-redeem-a`.

## Platform differences
- **watchOS:** say how the watch app differs from other versions, show required subscription info in one modal sheet, and present options compactly, for example one button per option `apple-in-app-purchase/platform-considerations/watchos/clearly-describe-the-differences-between-versions` `apple-in-app-purchase/platform-considerations/watchos/consider-using-a-modal-sheet-to` `apple-in-app-purchase/platform-considerations/watchos/make-subscription-options-easy-to-compare`
- **tvOS:** let people sign up on another device by sending a code there `apple-in-app-purchase/auto-renewable-subscriptions/making-signup-effortless/in-your-tvos-app-help-people`
- **iOS, iPadOS, macOS, visionOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] pricing clarity, trial terms and easy cancellation apply to any paid flow `apple-in-app-purchase/best-practices/display-the-total-billing-price-for`
- **Desktop web:** [HIG] same rules for subscription pages `apple-in-app-purchase/auto-renewable-subscriptions/making-signup-effortless/give-people-more-information-in-your`
- **Slides:** [HIG transfer] state full prices and trial terms plainly on pricing slides `apple-in-app-purchase/auto-renewable-subscriptions/making-signup-effortless/clearly-describe-how-a-free-trial`
- **Card news:** [HIG transfer] short product names and plain offer descriptions `apple-in-app-purchase/best-practices/use-simple-succinct-product-names-and`

## Related
[Apple Pay](apple-pay.md) · [App Clips](app-clips.md)
