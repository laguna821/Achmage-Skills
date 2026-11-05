---
slug: generative-ai
title: "Generative AI"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/generative-ai
---

# Generative AI

**In one line:** Guidance for features that create content such as text or images: when to offer them, how to be open about them, and how to keep people in control.

## Why it exists
Generative features can create and change content, so the stakes for people's trust, privacy and decisions are high. A quick prototype is easy; a dependable experience is hard `generative-ai/best-practices/design-your-experience-responsibly`. The guidance centers on Responsibility and Agency: be open about AI use, protect data, and let people steer and undo results `generative-ai/best-practices/keep-people-in-control`.

## Use it when
- A generative feature brings clear, specific value, such as saving time, communicating better or boosting creativity `generative-ai/best-practices/design-engaging-and-useful-generative-features`
- The feature is optional or complementary, so the app still works if people skip it `generative-ai/best-practices/ensure-a-great-experience-even-when`
- You can show where AI is used and what it can and cannot do `generative-ai/transparency/communicate-where-your-app-uses-ai` `generative-ai/transparency/set-clear-expectations-about-what-your`

## Don't use it when
- The feature adds no clear, specific value: leave it out (no HIG alternative named) `generative-ai/best-practices/design-engaging-and-useful-generative-features`
- The task is destructive or hard to undo: do not automate it, and get confirmation first (no HIG alternative named) `generative-ai/inputs/consider-consequences-and-get-permission-before`
- You would present AI output as made by a person: never do this `generative-ai/transparency/communicate-where-your-app-uses-ai`

## Cost to the user
Generative models are usually slower than real-time tracking or vision models, so people wait `generative-ai/outputs/factor-processing-time-into-your-design`. Open-ended inputs also ask people to guess what to type, and output may be plausible but wrong `generative-ai/inputs/guide-people-on-how-to-use` `generative-ai/inputs/raise-awareness-about-and-minimize-the`.

## Principles at stake
- **Responsibility:** be open about AI, plan for misuse and avoid copyrighted output `generative-ai/transparency/communicate-where-your-app-uses-ai` `generative-ai/outputs/reduce-unexpected-and-harmful-outcomes-with` `generative-ai/outputs/strive-to-avoid-replicating-copyrighted-content`
- **Agency:** people can dismiss, refine, undo, retry and choose between results `generative-ai/outputs/make-it-easy-for-people-to` `generative-ai/outputs/consider-offering-alternate-versions-of-results`
- **Purpose:** offer the feature only where it earns its place `generative-ai/best-practices/design-engaging-and-useful-generative-features`
- **Flexibility:** avoid bias and stereotypes, and keep the model swappable `generative-ai/best-practices/ensure-an-inclusive-experience-for-all` `generative-ai/continuous-improvement/design-flexible-adaptable-features`

## Key rules
- Honor clear in-scope requests, handle sensitive content carefully and let people dismiss new content `generative-ai/best-practices/keep-people-in-control`
- Tell people when and where AI is used `generative-ai/transparency/communicate-where-your-app-uses-ai`
- Explain what the feature can and cannot do, for example with a short tutorial or curated suggestions `generative-ai/transparency/set-clear-expectations-about-what-your`
- Ask before using personal or usage data, use the minimum and give a clear opt-out `generative-ai/privacy/ask-permission-before-using-personal-information`
- Disclose how data is used and stored, and explain benefits concisely when you ask `generative-ai/privacy/clearly-disclose-how-your-app-and`
- Pick the model type with privacy in mind: on-device keeps data local, servers offer more power `generative-ai/privacy/choose-a-model-type-that-fits`
- Offer varied example inputs to steer people `generative-ai/inputs/guide-people-on-how-to-use`
- Put Edit, Undo, Retry or Adjust beside generated output, and visibly confirm when changes land `generative-ai/outputs/make-it-easy-for-people-to`
- Show specific progress messages while generating, not vague ones like "Processing" `generative-ai/outputs/consider-giving-specific-reassuring-feedback-during`
- When output is blocked or poor, coach better phrasing with example prompts `generative-ai/outputs/help-people-improve-requests-when-blocked`
- Let people send feedback on outputs `generative-ai/continuous-improvement/let-people-share-feedback-on-outputs`

## Anatomy and content
Treat the feature as a loop: input (guide with examples), output (refine, revert, alternatives), then feedback. Datasets and model choice shape behavior, so assess capabilities early and know where data comes from `generative-ai/models-and-datasets/thoughtfully-evaluate-model-capabilities` `generative-ai/models-and-datasets/be-intentional-when-choosing-or-creating`.

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] the transparency, control and feedback rules apply as written `generative-ai/best-practices/keep-people-in-control`
- **Desktop web:** [HIG] progress messages and refine controls apply to web generative tools `generative-ai/outputs/consider-giving-specific-reassuring-feedback-during` `generative-ai/outputs/make-it-easy-for-people-to`
- **Slides:** [HIG none] no media guidance for slides
- **Card news:** [HIG none] no media guidance for cards

## Related
[Machine learning](machine-learning.md) · [Inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion) · [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy) · [Loading](https://developer.apple.com/design/human-interface-guidelines/loading)
