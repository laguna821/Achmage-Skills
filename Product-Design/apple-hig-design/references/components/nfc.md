---
slug: nfc
title: "NFC"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/nfc
---

# NFC

**In one line:** Near-field tag scanning: people hold their device near an object and your app reads it, in the app or in the background.

## Why it exists
Most people do not know the technical term, and they do not need to touch the object. The guidance asks for plain, short prompts that tell people what to do (Familiarity, Simplicity) `nfc/in-app-tag-reading/use-approachable-terminology` `nfc/in-app-tag-reading/dont-encourage-people-to-make-contact`.

## Use it when
- People should scan a physical object to bring up information or an action in your app: add in-app tag reading `nfc/in-app-tag-reading/provide-succinct-instructional-text-for-the`
- You support background tag reading: also keep an in-app way to scan `nfc/background-tag-reading/support-both-background-and-in-app`

## Don't use it when
- You are on macOS, tvOS, visionOS or watchOS: not supported
- Your only route is background reading: some devices do not support it, so add in-app scanning `nfc/background-tag-reading/support-both-background-and-in-app`

## Cost to the user
Low: one short scanning prompt and a physical gesture. Wrong words add cost, because "tap" or "touch" suggests contact that is not needed, and jargon like "NFC" or "tag" may put people off `nfc/in-app-tag-reading/dont-encourage-people-to-make-contact` `nfc/in-app-tag-reading/use-approachable-terminology`.

## Principles at stake
- **Familiarity:** everyday words, such as "Scan the object name" `nfc/in-app-tag-reading/use-approachable-terminology`
- **Simplicity:** a short scanning sheet sentence that is not truncated `nfc/in-app-tag-reading/provide-succinct-instructional-text-for-the`
- **Flexibility:** always keep an in-app option `nfc/background-tag-reading/support-both-background-and-in-app`

## Key rules
- Say scan or hold near, not tap or touch `nfc/in-app-tag-reading/dont-encourage-people-to-make-contact`
- Use everyday wording rather than NFC or tag `nfc/in-app-tag-reading/use-approachable-terminology`
- Write the scanning sheet text as one short, complete sentence in sentence case with a period, naming the object and varying it on later scans `nfc/in-app-tag-reading/provide-succinct-instructional-text-for-the`
- Keep an in-app scan option even with background reading `nfc/background-tag-reading/support-both-background-and-in-app`

## Platform differences
- **iOS, iPadOS:** supported, with no additional considerations.
- **Not available on:** macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] describe physical gestures in plain words `nfc/in-app-tag-reading/use-approachable-terminology`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Apple Pay](https://developer.apple.com/design/human-interface-guidelines/apple-pay) · [Wallet](https://developer.apple.com/design/human-interface-guidelines/wallet)
