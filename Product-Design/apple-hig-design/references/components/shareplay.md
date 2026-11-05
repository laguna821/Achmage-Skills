---
slug: shareplay
title: "SharePlay"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/shareplay
---

# SharePlay

**In one line:** A system feature that lets people do an activity together in real time, such as watching, listening or playing, while connected.

## Why it exists
People want to share a moment live, not only send a link afterward. SharePlay lets an app turn an activity into a shared one, and it also supports sharing or saving the result for people who join later `shareplay/best-practices/use-shareplay-for-real-time-experiences`. The design job is to make starting, joining and staying oriented painless (Simplicity, Familiarity) `shareplay/best-practices/make-it-easy-to-start-a`.

## Use it when
- The activity is meant to be done together and live, such as watching or browsing `shareplay/best-practices/use-shareplay-for-real-time-experiences`
- The activity can be shaped for a common view, or for role-based views where roles enrich it `shareplay/best-practices/design-an-experience-that-best-fits`
- People may join from different devices, settings and ways of communicating `shareplay/best-practices/design-activities-that-work-across-apple`

## Don't use it when
- The work is asynchronous: let people share or save the activity afterward instead (no HIG alternative named) `shareplay/best-practices/use-shareplay-for-real-time-experiences`
- The platform is watchOS: SharePlay is not supported there (no HIG alternative named)

## Cost to the user
Friction at the start is the main cost. Every unrelated view, sign-in or download between an invitation and the shared content slows joining, so defer anything nonessential `shareplay/best-practices/let-people-join-an-activity-without`. When one person's action changes things for everyone, an unexplained change disorients the others `shareplay/best-practices/keep-people-oriented-as-an-activity`.

## Principles at stake
- **Simplicity:** get joiners to the shared content fast, with no unrelated views `shareplay/best-practices/let-people-join-an-activity-without`
- **Familiarity:** a clear start control, such as a button with the SharePlay symbol, is easy to recognize `shareplay/best-practices/make-it-easy-to-start-a`
- **Agency:** one person's volume or subtitle choices, or immersion change, must not be forced on others `shareplay/platform-considerations/visionos/designing-shared-activities/let-participants-customize-their-experience-for` `shareplay/platform-considerations/visionos/designing-shared-activities/let-people-opt-in-to-immersion`

## Key rules
- Give activities a clear start control; system features such as the share sheet can also start them `shareplay/best-practices/make-it-easy-to-start-a`
- Take joiners straight to the content; guide sign-in, downloads or subscription in a view that dismisses when done `shareplay/best-practices/let-people-join-an-activity-without`
- Describe the activity briefly in invitations (title, summary, poster), short enough not to be truncated `shareplay/best-practices/describe-activities-clearly-and-concisely`
- When one person's action changes the activity for all, explain why, for example by showing who did what `shareplay/best-practices/keep-people-oriented-as-an-activity`
- Write "SharePlay" as a noun or verb, with no adjectives or altered forms `shareplay/best-practices/use-the-term-shareplay-correctly`
- Let shared video continue in Picture in Picture on iPhone and iPad, or in a window brought forward on Mac `shareplay/platform-considerations/ios-ipados-macos/support-picture-in-picture-for-shared`
- Make volume, subtitles and similar settings per participant `shareplay/platform-considerations/visionos/designing-shared-activities/let-participants-customize-their-experience-for`
- Keep views and immersion levels shared by default; give a personal view only when it enriches the experience `shareplay/platform-considerations/visionos/designing-shared-activities/reserve-unique-views-for-moments-that`

## Platform differences
- **iOS, iPadOS, macOS:** support Picture in Picture or a forward window so people can keep watching while doing other things `shareplay/platform-considerations/ios-ipados-macos/support-picture-in-picture-for-shared`
- **visionOS:** start the activity from a window, not an immersive space, so a Share button is easy to find `shareplay/platform-considerations/visionos/designing-shared-activities/prefer-starting-your-experience-from-a`
- **visionOS:** skip control-grabbing UI for one-user-at-a-time objects; use speech or gesture and a simple rule such as last change wins `shareplay/platform-considerations/visionos/designing-shared-activities/resolve-conflicts-naturally`
- **visionOS:** provide a clear way to rejoin after leaving, and consider a windowed version for multitasking `shareplay/platform-considerations/visionos/designing-shared-activities/make-it-easy-to-leave-and`
- **visionOS, Personas:** offer UI alternatives for people who appear without a spatial Persona `shareplay/platform-considerations/visionos/personas/support-people-who-arent-represented-by`
- **visionOS, spatial templates:** give each stage its own template, change templates only on a person's explicit action, and keep transitions few and smooth with fades and cues `shareplay/platform-considerations/visionos/spatial-templates/divide-a-complex-activity-into-stages` `shareplay/platform-considerations/visionos/spatial-templates/let-people-initiate-template-transitions` `shareplay/platform-considerations/visionos/spatial-templates/keep-template-transitions-smooth`
- **visionOS, custom templates:** set up five seats in advance, and keep a seat filled in place when its occupant leaves `shareplay/platform-considerations/visionos/custom-templates/support-the-maximum-number-of-seats`; space seats at least a meter apart `shareplay/platform-considerations/visionos/custom-templates/place-seats-at-least-a-meter`; keep roles independent of seats `shareplay/platform-considerations/visionos/custom-templates/keep-roles-independent-of-seats`; guide people sharing a physical room with visual cues `shareplay/platform-considerations/visionos/custom-templates/account-for-people-who-are-physically`
- **tvOS:** no additional considerations.
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] for any live co-viewing or co-editing feature, keep the join path short and explain shared changes `shareplay/best-practices/let-people-join-an-activity-without`
- **Desktop web:** [HIG transfer] the same join and orientation rules suit a shared session link `shareplay/best-practices/keep-people-oriented-as-an-activity`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Immersive experiences](https://developer.apple.com/design/human-interface-guidelines/immersive-experiences) · [Collaboration and sharing](https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing) · [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)
