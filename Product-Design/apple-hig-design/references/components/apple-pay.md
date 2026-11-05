---
slug: apple-pay
title: "Apple Pay"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/apple-pay
---

# Apple Pay

**In one line:** A fast, private way to pay for physical goods and services in apps and on the web, using a system payment sheet.

## Why it exists
Checkout is where people give up. Apple Pay shortens it: payment details and shipping information come from the system, so people type almost nothing `apple-pay/streamlining-checkout/prefer-checkout-information-from-apple-pay`. The system payment sheet handles progress and results, keeping the flow familiar `apple-pay/streamlining-checkout/customizing-the-payment-sheet/defer-to-the-payment-sheet-for`.

## Use it when
- Checkout can be offered wherever the device or browser supports Apple Pay `apple-pay/offering-apple-pay/offer-apple-pay-on-all-devices`
- A product page can offer one-tap purchase of a single item `apple-pay/streamlining-checkout/accelerate-single-item-purchases-with-apple`
- A cart can use express checkout with the payment sheet open at once `apple-pay/streamlining-checkout/accelerate-multi-item-purchases-with-express`
- You take recurring payments or donations `apple-pay/supporting-subscriptions/clarify-subscription-details-before-showing-the` `apple-pay/supporting-donations/streamline-checkout-by-offering-predefined-donation`

## Don't use it when
- The device or browser does not support it: hide the button `apple-pay/offering-apple-pay/offer-apple-pay-on-all-devices`
- You would use the Apple Pay button for anything but starting payment or setup `apple-pay/offering-apple-pay/use-apple-pay-buttons-only-to`
- You would hide a button because payment isn't ready: keep it visible and explain after the tap `apple-pay/offering-apple-pay/dont-hide-an-apple-pay-button`
- You need to list the purchased products in the sheet: use line items only for extra charges and similar `apple-pay/streamlining-checkout/customizing-the-payment-sheet/use-line-items-to-explain-additional`

## Cost to the user
It should cost one authorization. Extra costs arise when a flow adds pages, spinners or an account step, so keep checkout inside your app or site and do not require an account before purchase `apple-pay/streamlining-checkout/provide-a-cohesive-checkout-experience` `apple-pay/streamlining-checkout/avoid-requiring-account-creation-before-purchase`.

## Principles at stake
- **Simplicity:** ask only for essential information in the sheet `apple-pay/streamlining-checkout/customizing-the-payment-sheet/only-present-and-request-essential-information`
- **Responsibility:** show what is charged now and when billing starts, and disclose costs added after authorization `apple-pay/supporting-subscriptions/clarify-the-current-payment-amount-in` `apple-pay/streamlining-checkout/customizing-the-payment-sheet/clearly-disclose-when-people-may-incur`
- **Familiarity:** use the provided API for buttons and give Apple Pay first position `apple-pay/using-apple-pay-buttons/always-use-the-apple-provided-api` `apple-pay/streamlining-checkout/if-apple-pay-is-available-assume`
- **Agency:** forgiving validation and easy restart after an interruption `apple-pay/handling-problems/data-validation-errors/avoid-forcing-compliance-with-your-business` `apple-pay/handling-problems/payment-processing-problems/handle-interruptions-correctly`

## Key rules
- Make Apple Pay the primary option when credentials exist, in the same step `apple-pay/offering-apple-pay/make-apple-pay-the-primary-payment`
- Display buttons only through the Apple-provided API `apple-pay/using-apple-pay-buttons/always-use-the-apple-provided-api`
- Make the button at least as large as other payment buttons and visible without scrolling `apple-pay/using-apple-pay-buttons/button-size-and-position/prominently-display-the-apple-pay-button`
- Beside Add to Cart, put Apple Pay on the right `apple-pay/using-apple-pay-buttons/button-size-and-position/position-the-apple-pay-button-correctly`
- Collect needed choices such as color and size before the button, and optional data before or after checkout `apple-pay/streamlining-checkout/collect-necessary-information-like-color-and` `apple-pay/streamlining-checkout/collect-optional-information-before-checkout-begins`
- Keep line items short and put your business name after "Pay" on the total line `apple-pay/streamlining-checkout/customizing-the-payment-sheet/keep-line-items-short` `apple-pay/streamlining-checkout/customizing-the-payment-sheet/provide-a-business-name-after-the`
- Let people choose the shipping method on the sheet `apple-pay/streamlining-checkout/customizing-the-payment-sheet/let-people-choose-the-shipping-method`
- Name the invalid field and what is expected `apple-pay/handling-problems/data-validation-errors/explain-the-problem-clearly-and-succinctly`
- End with a confirmation page that thanks people and says when the order ships `apple-pay/streamlining-checkout/display-an-order-confirmation-or-thank`

## Anatomy and content
Custom button: leave off the Apple Pay name and logo, and show the mark elsewhere to signal acceptance `apple-pay/offering-apple-pay/if-you-use-a-custom-button` `apple-pay/offering-apple-pay/use-the-apple-pay-mark-graphic`. Mark: use Apple's artwork unchanged apart from height, with clear space of one tenth of its height `apple-pay/using-apple-pay-buttons/apple-pay-mark/use-only-the-artwork-provided-by` `apple-pay/using-apple-pay-buttons/apple-pay-mark/maintain-a-minimum-clear-space-around`. Text: write "Apple Pay" as two words, style it in your own font, and do not translate it `apple-pay/referring-to-apple-pay/capitalize-apple-pay-in-text-as` `apple-pay/referring-to-apple-pay/coordinate-the-font-face-and-size` `apple-pay/referring-to-apple-pay/dont-translate-apple-pay-or-any`. Subscriptions and trials: restate billing frequency and the date regular billing begins in line items `apple-pay/supporting-subscriptions/include-line-items-that-reiterate-billing` `apple-pay/supporting-subscriptions/clearly-communicate-trial-period-terms`.

## Platform differences
No platform-specific guidance for iOS, iPadOS, macOS, visionOS or watchOS.
- **Not available on:** tvOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] fewer steps, a visible primary payment button and a thank-you page apply to any checkout `apple-pay/offering-apple-pay/make-apple-pay-the-primary-payment`
- **Desktop web:** [HIG] button placement, markup for search engines and a privacy statement apply `apple-pay/offering-apple-pay/inform-search-engines-that-apple-pay`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Apple In-App Purchase](apple-in-app-purchase.md) · [App Clips](app-clips.md)
