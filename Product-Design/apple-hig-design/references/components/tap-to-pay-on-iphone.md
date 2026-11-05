---
slug: tap-to-pay-on-iphone
title: "Tap to Pay on iPhone"
kind: technology
group: "Technologies"
platforms: [iOS]
source: https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone
---

# Tap to Pay on iPhone

**In one line:** A feature that lets merchants accept contactless payments directly on an iPhone, with no extra hardware.

## Why it exists
Merchants are mid-sale and customers are waiting, so setup, waiting and failures all cost real time. The HIG guides the app to prepare early, keep the option always reachable, and leave merchants a way out when a tap fails `tap-to-pay-on-iphone/checking-out/avoid-making-merchants-wait-to-use` `tap-to-pay-on-iphone/displaying-results/help-merchants-complete-the-checkout-flow`. This serves Simplicity and Responsibility.

## Use it when
- Your app takes payments in person and merchants should be able to accept taps without leaving checkout `tap-to-pay-on-iphone/checking-out/provide-tap-to-pay-on-iphone`
- You need to onboard merchants: terms first, then a tutorial `tap-to-pay-on-iphone/enabling-tap-to-pay-on-iphone/help-merchants-accept-tap-to-pay` `tap-to-pay-on-iphone/educating-merchants/provide-a-tutorial-that-describes-the`

## Don't use it when
- The device is not an iPhone: the feature is iOS only (no HIG alternative named)
- You only read a card without taking a payment: use a generic label such as Look Up, Store Card, Verify or Refund, not Tap to Pay wording `tap-to-pay-on-iphone/additional-interactions/use-a-generic-label-in-a`
- A loyalty card transaction is independent of payment: give it its own button without payment terms `tap-to-pay-on-iphone/additional-interactions/if-your-app-supports-an-independent`

## Cost to the user
Each device and each return to the foreground needs configuration, which can make merchants wait `tap-to-pay-on-iphone/checking-out/avoid-making-merchants-wait-to-use`. Authorization can take several seconds, so a progress indicator is needed `tap-to-pay-on-iphone/displaying-results/display-a-progress-indicator-while-payment`. Terms and a tutorial add one-time learning.

## Principles at stake
- **Simplicity:** the option is easy to find and ready before it is needed `tap-to-pay-on-iphone/checking-out/if-your-app-supports-multiple-payment`
- **Responsibility:** show the final amount and a clear success or decline `tap-to-pay-on-iphone/checking-out/determine-the-final-amount-that-customers` `tap-to-pay-on-iphone/displaying-results/clearly-display-the-result-of-a`
- **Agency:** merchants can switch methods or finish another way `tap-to-pay-on-iphone/checking-out/make-it-easy-for-merchants-to`
- **Familiarity:** the button uses the specified name and symbols `tap-to-pay-on-iphone/checking-out/for-the-label-of-the-button`

## Key rules
- Get terms accepted before checkout, show them only to administrators, and after any required iOS update `tap-to-pay-on-iphone/enabling-tap-to-pay-on-iphone/help-merchants-accept-tap-to-pay` `tap-to-pay-on-iphone/enabling-tap-to-pay-on-iphone/present-tap-to-pay-on-iphone` `tap-to-pay-on-iphone/enabling-tap-to-pay-on-iphone/if-necessary-help-merchants-make-sure`
- Offer a tutorial after acceptance, to new users, and in a consistent help location `tap-to-pay-on-iphone/educating-merchants/provide-a-tutorial-that-describes-the`
- Always include the checkout button, enabled or not `tap-to-pay-on-iphone/checking-out/provide-tap-to-pay-on-iphone`
- Prepare at app start and on each foreground return; keep the option selectable with a progress indicator during configuration `tap-to-pay-on-iphone/checking-out/avoid-making-merchants-wait-to-use` `tap-to-pay-on-iphone/checking-out/make-sure-the-tap-to-pay`
- Make the button easy to find without scrolling; if it is the only method, open it at checkout start `tap-to-pay-on-iphone/checking-out/if-your-app-supports-multiple-payment`
- Use the specified button label, shortened only when space is tight; style color and shape to match other buttons, and never use the Apple logo `tap-to-pay-on-iphone/checking-out/for-the-label-of-the-button` `tap-to-pay-on-iphone/checking-out/design-your-tap-to-pay-on`
- Finalize the amount, including tips, before the Tap to Pay screen, and show pre-payment choices before it opens `tap-to-pay-on-iphone/checking-out/determine-the-final-amount-that-customers` `tap-to-pay-on-iphone/checking-out/if-you-support-pre-payment-options`
- Start processing as soon as the tap result is available, not after the checkmark animation `tap-to-pay-on-iphone/displaying-results/start-processing-a-transaction-as-soon`
- Show clear success or decline, offer a digital receipt where possible, and offer another way to finish when a tap fails `tap-to-pay-on-iphone/displaying-results/clearly-display-the-result-of-a` `tap-to-pay-on-iphone/displaying-results/help-merchants-complete-the-checkout-flow`
- For system errors, describe the problem and recommend a fix; make help and support easy to reach `tap-to-pay-on-iphone/displaying-results/if-the-system-returns-an-error` `tap-to-pay-on-iphone/displaying-results/make-it-easy-for-merchants-to`

## Platform differences
- **iOS:** no additional considerations.
- **Not available on:** iPadOS, macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] any in-person payment step benefits from early preparation, a final amount shown up front, and a fallback when payment fails `tap-to-pay-on-iphone/displaying-results/help-merchants-complete-the-checkout-flow`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Alerts](alerts.md) · [Progress indicators](progress-indicators.md) · [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
