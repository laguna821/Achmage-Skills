---
slug: researchkit
title: "ResearchKit"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/researchkit
---

# ResearchKit

**In one line:** A framework for apps that run medical or scientific studies: onboarding with consent, surveys and tasks, a profile and progress feedback.

## Why it exists
Joining a study asks people to share personal information and agree to terms, so trust and understanding come first. The guidance sets a fixed onboarding order and plain, digestible consent (Responsibility, Simplicity) `researchkit/creating-the-onboarding-experience/always-display-the-onboarding-screens-in` `researchkit/creating-the-onboarding-experience/3-get-informed-consent/break-a-long-consent-form-into`.

## Use it when
- You run a study that needs informed consent: follow the onboarding sequence `researchkit/creating-the-onboarding-experience/always-display-the-onboarding-screens-in`
- Participants complete surveys or active tasks: keep them engaging and clear `researchkit/conducting-research/create-surveys-that-keep-participants-engaged` `researchkit/conducting-research/make-active-tasks-easy-to-understand`
- Participants need control over their data and a reason to continue: add a profile and, where suitable, a dashboard `researchkit/managing-personal-information-and-providing-encouragement/use-a-profile-to-help-participants` `researchkit/managing-personal-information-and-providing-encouragement/use-a-dashboard-to-show-progress`

## Don't use it when
- You are on macOS, tvOS, visionOS or watchOS: not supported
- People are not eligible: tell them early, before consent `researchkit/creating-the-onboarding-experience/2-determine-eligibility/determine-eligibility-as-soon-as-possible`
- You want data beyond what the study needs: ask only for what is critical `researchkit/creating-the-onboarding-experience/4-request-permission-to-access-data/get-permission-to-access-the-participants`

## Cost to the user
Onboarding is a long, serious sequence: introduction, eligibility, consent, then permissions. The guidance cuts the load by checking eligibility early, splitting consent into short sections, and giving a quick log-in for returning participants `researchkit/creating-the-onboarding-experience/2-determine-eligibility/determine-eligibility-as-soon-as-possible` `researchkit/creating-the-onboarding-experience/1-introduction/provide-an-introduction-that-informs-and`.

## Principles at stake
- **Responsibility:** informed consent, a signed record, and stated reasons for data access `researchkit/creating-the-onboarding-experience/3-get-informed-consent/make-sure-participants-understand-your-study` `researchkit/creating-the-onboarding-experience/3-get-informed-consent/get-the-participants-consent-and-if`
- **Simplicity:** short sections, simple language, easy entry `researchkit/creating-the-onboarding-experience/3-get-informed-consent/break-a-long-consent-form-into`
- **Agency:** participants can edit data and leave the study from a profile `researchkit/managing-personal-information-and-providing-encouragement/use-a-profile-to-help-participants`
- **Delight:** a dashboard encourages people to continue `researchkit/managing-personal-information-and-providing-encouragement/use-a-dashboard-to-show-progress`

## Key rules
- Show onboarding in order: introduction, eligibility, consent, data permission `researchkit/creating-the-onboarding-experience/always-display-the-onboarding-screens-in`
- Open with the study's subject and purpose, and let returning participants log in quickly `researchkit/creating-the-onboarding-experience/1-introduction/provide-an-introduction-that-informs-and`
- Check eligibility early with only necessary requirements `researchkit/creating-the-onboarding-experience/2-determine-eligibility/determine-eligibility-as-soon-as-possible`
- Make sure participants understand the study, following legal requirements and App Store Guidelines `researchkit/creating-the-onboarding-experience/3-get-informed-consent/make-sure-participants-understand-your-study`
- Break long consent into short sections with a Learn More option; add a quiz where it makes sense `researchkit/creating-the-onboarding-experience/3-get-informed-consent/break-a-long-consent-form-into` `researchkit/creating-the-onboarding-experience/3-get-informed-consent/if-it-makes-sense-provide-a`
- Collect consent through confirmation, then signature and details screens, and email a copy `researchkit/creating-the-onboarding-experience/3-get-informed-consent/get-the-participants-consent-and-if`
- Explain why you need location, Health or other data, and request only what is critical `researchkit/creating-the-onboarding-experience/4-request-permission-to-access-data/get-permission-to-access-the-participants`
- Give active tasks clear, simple instructions and state any requirements `researchkit/conducting-research/make-active-tasks-easy-to-understand`
- Offer a profile screen with editable data, upcoming activities, leave-study and consent and privacy policy access `researchkit/managing-personal-information-and-providing-encouragement/use-a-profile-to-help-participants`

## Platform differences
- **iOS, iPadOS:** supported, with no additional considerations.
- **Not available on:** macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] sequence consent in short steps with a stated reason for each data request `researchkit/creating-the-onboarding-experience/3-get-informed-consent/break-a-long-consent-form-into`
- **Desktop web:** [HIG] the onboarding order and consent rules apply to any study sign-up `researchkit/creating-the-onboarding-experience/always-display-the-onboarding-screens-in`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[HealthKit](healthkit.md) · [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)
