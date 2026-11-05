---
slug: siri
title: "Siri"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/siri
---

# Siri

**In one line:** Apple's voice assistant, through which people reach your app's actions and content by speaking, often hands-free.

## Why it exists
People use Siri when their hands or eyes are busy, on devices that may have no screen in view. Your app only works well there if you choose the right actions, use familiar words, and keep spoken replies short `siri/best-practices/identify-your-apps-most-popular-actions` `siri/customizing-your-apps-experience-with-siri/keep-responses-as-succinct-as-possible`. This serves Simplicity and Familiarity.

## Use it when
- Some actions in your app are popular and happen in contexts such as hands-free use `siri/best-practices/identify-your-apps-most-popular-actions`
- Content is relevant to a person's context, such as recent searches, favorites or wishlists, and can be shared with Spotlight `siri/best-practices/offer-relevant-content`
- The built-in responses do not fit your app: write a custom response only then `siri/best-practices/only-provide-a-custom-response-if`

## Don't use it when
- You want to advertise: keep ads, marketing and in-app purchase pitches out of what Siri delivers (no HIG alternative named) `siri/best-practices/dont-advertise`
- You are tempted to imitate Siri or rebuild its functionality (no HIG alternative named) `siri/editorial-guidelines/be-aware-that-the-system-reserves`

## Cost to the user
Spoken responses cost time and attention: people may hear the same one many times, so extra words and jokes become irritating `siri/customizing-your-apps-experience-with-siri/keep-responses-as-succinct-as-possible`. Reading a long list aloud takes too long `siri/customizing-your-apps-experience-with-siri/ask-an-open-ended-question-when`.

## Principles at stake
- **Purpose:** expose the actions people use most `siri/best-practices/identify-your-apps-most-popular-actions`
- **Familiarity:** name content and actions with words people recognize `siri/best-practices/use-familiar-terms-for-your-content`
- **Simplicity:** short, specific responses and questions `siri/customizing-your-apps-experience-with-siri/write-response-dialogue-thats-clear-and`
- **Responsibility:** respect parental controls and nearby listeners `siri/customizing-your-apps-experience-with-siri/use-appropriate-language-and-respect-parental`

## Key rules
- Find the most popular actions and when and where they happen, then prioritize them `siri/best-practices/identify-your-apps-most-popular-actions`
- Use the terms people most likely recognize for intents and entities `siri/best-practices/use-familiar-terms-for-your-content`
- Say plainly what will happen, and make follow-up questions specific, such as "Which soup?" rather than "Which one?" `siri/customizing-your-apps-experience-with-siri/write-response-dialogue-thats-clear-and`
- Keep responses as short as possible; drop filler and jokes `siri/customizing-your-apps-experience-with-siri/keep-responses-as-succinct-as-possible`
- Make responses work audibly and visually, with the spoken version complete on its own `siri/customizing-your-apps-experience-with-siri/provide-responses-that-siri-can-deliver`
- Avoid gendered pronouns when unnecessary `siri/customizing-your-apps-experience-with-siri/design-inclusive-interactions`
- Avoid device-specific wording, because a request may start on one device and finish on another `siri/customizing-your-apps-experience-with-siri/keep-responses-device-independent-whenever-possible`
- Leave your app name out of responses; the system already credits your app `siri/customizing-your-apps-experience-with-siri/omit-your-app-name-from-responses`
- Make errors specific, such as naming the sold-out item `siri/customizing-your-apps-experience-with-siri/help-people-understand-errors-and-failures`

## Anatomy and content
Editorial rules: call Siri by name, not "she" or "her" `siri/editorial-guidelines/refer-to-siri-by-name`; avoid reserved phrases such as "Hey Siri" in your own responses `siri/editorial-guidelines/be-aware-that-the-system-reserves`; in localized text, translate only the word "Hey" and never the name Siri `siri/editorial-guidelines/in-a-localized-context-translate-only`.

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] for any voice feature, keep replies short and complete without a screen `siri/customizing-your-apps-experience-with-siri/provide-responses-that-siri-can-deliver`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[App Shortcuts](app-shortcuts.md) · [Snippets](snippets.md) · [Writing](https://developer.apple.com/design/human-interface-guidelines/writing) · [Inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion)
