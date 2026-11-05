---
slug: remotes
title: "Remotes"
kind: input
group: "Inputs"
platforms: [tvOS]
source: https://developer.apple.com/design/human-interface-guidelines/remotes
---

# Remotes

**In one line:** The Siri Remote and compatible remotes for Apple TV: swipes, presses and buttons that move focus and trigger actions.

## Why it exists
People control Apple TV from a distance with a small remote, so its gestures and buttons must mean the same thing in every app `remotes/best-practices/prefer-using-standard-gestures-to-perform`. Familiar mappings keep the experience simple, and feedback shows what a gesture will do `remotes/best-practices/provide-clear-feedback-that-shows-people`.

## Use it when
- You are building a tvOS app: let standard remote gestures do standard things `remotes/best-practices/prefer-using-standard-gestures-to-perform`
- Gameplay needs custom remote gestures `remotes/best-practices/define-new-gestures-only-when-it`
- A live-viewing app has an electronic program guide, which should open from guide or browse buttons `remotes/compatible-remotes/if-your-live-viewing-app-provides`

## Don't use it when
- Outside gameplay, you want a new gesture for a standard action: use the standard one `remotes/best-practices/define-new-gestures-only-when-it`
- You want to react to where on the surface someone tapped, but it is neither intuitive nor discoverable: skip it `remotes/best-practices/consider-using-the-position-of-a`
- The input target is a pointer, keyboard or touch: see [Pointing devices](pointing-devices.md), [Keyboards](keyboards.md) or [Gestures](gestures.md)

## Cost to the user
A remote has few inputs and no precise pointing, so mismatched gesture-and-focus behavior is quickly confusing `remotes/best-practices/be-consistent-with-the-tvos-focus`. Accidental taps during live video can disrupt viewing, so ignore them `remotes/best-practices/differentiate-between-press-and-tap-and`.

## Principles at stake
- **Familiarity:** standard gestures, focus movement in the swipe direction, Back to the parent screen, Play/Pause that plays, pauses or resumes `remotes/best-practices/be-consistent-with-the-tvos-focus` `remotes/best-practices/in-almost-all-cases-open-the` `remotes/best-practices/respond-correctly-to-the-play-pause`
- **Simplicity:** invent custom gestures only where they suit the app, mostly in gameplay `remotes/best-practices/define-new-gestures-only-when-it`
- **Agency:** presses are for intentional actions; Back opens a pause menu in active gameplay `remotes/best-practices/differentiate-between-press-and-tap-and` `remotes/best-practices/in-almost-all-cases-open-the`

## Key rules
- Let standard gestures do standard things, except during gameplay `remotes/best-practices/prefer-using-standard-gestures-to-perform`
- Pair gestures with focus the familiar way, moving focus in the swipe's direction `remotes/best-practices/be-consistent-with-the-tvos-focus`
- Give clear feedback showing what a gesture will do `remotes/best-practices/provide-clear-feedback-that-shows-people`
- Use press for choosing or confirming, tap for navigation or extra info, and ignore taps during live video `remotes/best-practices/differentiate-between-press-and-tap-and`
- Back goes to the parent screen; in active gameplay it opens a pause menu, and Back again resumes `remotes/best-practices/in-almost-all-cases-open-the`
- Play/Pause plays, pauses or resumes during music or video `remotes/best-practices/respond-correctly-to-the-play-pause`
- On a compatible remote, page up and down change channels while content plays `remotes/compatible-remotes/while-your-content-plays-respond-to`
- In live-viewing apps, do not give the guide and browse buttons other meanings `remotes/compatible-remotes/if-your-live-viewing-app-provides`

## Anatomy and content
Swipe scrolls long lists, with momentum that depends on swipe strength, and a swipe at the remote's edge moves faster `remotes/gestures/swipe`. Press activates controls or selects items, and pressing before a swipe starts scrubbing `remotes/gestures/press`. These two entries are definitions, not separate rules.

## Platform differences
- **tvOS:** this whole card applies.
- **Not available on:** iOS, iPadOS, macOS, visionOS, watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG none] for the remote; [HIG transfer] distinguishing intentional press from casual tap applies to touch `remotes/best-practices/differentiate-between-press-and-tap-and`
- **Desktop web:** [HIG transfer] an app shown on a TV browser should move focus predictably `remotes/best-practices/be-consistent-with-the-tvos-focus`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Gestures](gestures.md) · [Pointing devices](pointing-devices.md) · [Keyboards](keyboards.md)
