---
slug: id-verifier
title: "ID Verifier"
kind: technology
group: "Technologies"
platforms: [iOS]
source: https://developer.apple.com/design/human-interface-guidelines/id-verifier
---

# ID Verifier

**In one line:** An iPhone feature that lets an app check a customer's age or identity from an ID stored on their device.

## Why it exists
Checking identity asks people to share sensitive information, so trust matters. The guidance keeps requests minimal, shows who is asking, and labels the action clearly (Responsibility, Simplicity) `id-verifier/best-practices/ask-only-for-the-data-you` `id-verifier/best-practices/if-your-app-qualifies-for-apple`.

## Use it when
- You must confirm a customer's age or identity in person, and your app qualifies: register so your organization name and logo appear `id-verifier/best-practices/if-your-app-qualifies-for-apple`
- A simple threshold is enough, such as over a certain age: request only that `id-verifier/best-practices/ask-only-for-the-data-you`

## Don't use it when
- You would request more data than the check needs, such as an exact age or birth date for a threshold check: ask for the threshold only (no HIG alternative named) `id-verifier/best-practices/ask-only-for-the-data-you`
- You are on iPadOS, macOS, tvOS, visionOS or watchOS: it is not supported there

## Cost to the user
Each extra data item asked for costs trust, and people may lose confidence in the experience `id-verifier/best-practices/ask-only-for-the-data-you`. The flow adds one deliberate step: a clearly labeled start button `id-verifier/best-practices/provide-a-button-that-initiates-the`.

## Principles at stake
- **Responsibility:** minimize data, and make the asking organization visible `id-verifier/best-practices/ask-only-for-the-data-you` `id-verifier/best-practices/if-your-app-qualifies-for-apple`
- **Familiarity:** use the expected button labels and no brand symbols `id-verifier/best-practices/provide-a-button-that-initiates-the`
- **Agency:** in a Display Only request, the app user records their own visual judgment `id-verifier/best-practices/in-a-display-only-request-help`

## Key rules
- Request only the data the current verification needs `id-verifier/best-practices/ask-only-for-the-data-you`
- Register through Apple Business Register if you qualify, so your official name and logo show in the verification UI `id-verifier/best-practices/if-your-app-qualifies-for-apple`
- Label the start button Verify Age or Verify Identity, with no NFC or QR symbol and never the Apple logo `id-verifier/best-practices/provide-a-button-that-initiates-the`
- In a Display Only request, give buttons such as Matches Person and Doesn't Match Person `id-verifier/best-practices/in-a-display-only-request-help`

## Platform differences
- **iOS:** the only supported platform, with no additional considerations.
- **Not available on:** iPadOS, macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] ask only for the data a check needs `id-verifier/best-practices/ask-only-for-the-data-you`
- **Desktop web:** [HIG] the data-minimizing lesson applies to any identity form `id-verifier/best-practices/ask-only-for-the-data-you`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Wallet](https://developer.apple.com/design/human-interface-guidelines/wallet)
