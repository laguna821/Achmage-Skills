---
slug: apple-pencil-and-scribble
title: "Apple Pencil and Scribble"
kind: input
group: "Inputs"
platforms: [iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/apple-pencil-and-scribble
---

# Apple Pencil and Scribble

**In one line:** Precise stylus input for drawing and marking, plus Scribble, which turns handwriting into typed text in text fields.

## Why it exists
A pencil feels natural when it behaves like a real pen: marks start at once, and the app answers right where the tip touches `apple-pencil-and-scribble/best-practices/let-people-make-a-mark-the` `apple-pencil-and-scribble/best-practices/provide-visual-feedback-to-indicate-a`. It serves Familiarity and Agency: people choose when to switch between finger and Pencil `apple-pencil-and-scribble/best-practices/let-people-choose-when-to-switch`.

## Use it when
- People draw, mark up or annotate `apple-pencil-and-scribble/best-practices/support-behaviors-people-intuitively-expect-when`
- Text entry feels natural by hand, such as writing a new list item in blank space `apple-pencil-and-scribble/scribble/make-scribble-available-everywhere-people-might`
- A single quick gesture (squeeze, double-tap) can trigger a discrete, undoable action `apple-pencil-and-scribble/squeeze/treat-squeeze-as-a-single-quick`

## Don't use it when
- The action would be destructive or lose data: do not bind it to hover, double-tap or squeeze `apple-pencil-and-scribble/hover/avoid-using-hover-to-initiate-an` `apple-pencil-and-scribble/double-tap/avoid-using-the-double-tap-gesture` `apple-pencil-and-scribble/squeeze/define-squeeze-actions-that-are-nondestructive`
- Navigation or revealing controls is the goal: do not use barrel roll `apple-pencil-and-scribble/barrel-roll/use-barrel-roll-only-to-modify`
- A password field: standard fields except password fields support Scribble `apple-pencil-and-scribble/scribble/make-text-entry-feel-fluid-and`

## Cost to the user
Low when it works like a pen. Costs appear with required mode switches, surprises from unrelated gestures, or text fields that move while writing `apple-pencil-and-scribble/best-practices/let-people-make-a-mark-the` `apple-pencil-and-scribble/scribble/while-people-are-writing-in-a`.

## Principles at stake
- **Familiarity:** behave like real pens, keep previews steady `apple-pencil-and-scribble/hover/use-hover-to-help-people-predict`
- **Agency:** controls respond to both finger and Pencil; honor system gesture settings `apple-pencil-and-scribble/double-tap/respect-peoples-settings-for-the-double`
- **Responsibility:** only undoable actions on indirect gestures `apple-pencil-and-scribble/double-tap/avoid-using-the-double-tap-gesture`
- **Delight:** expressive strokes from tilt, force and orientation `apple-pencil-and-scribble/best-practices/help-people-express-themselves-by-responding`

## Key rules
- Start marks when the Pencil touches, with no button tap or mode first `apple-pencil-and-scribble/best-practices/let-people-make-a-mark-the`
- Keep pressure effects simple, such as continuous opacity or brush size `apple-pencil-and-scribble/best-practices/help-people-express-themselves-by-responding`
- Place controls so neither hand covers them; support left and right hands `apple-pencil-and-scribble/best-practices/design-a-great-left-and-right`
- Use hover to preview the mark, steady across heights, with mid-range values; do not trigger actions from it `apple-pencil-and-scribble/hover/prefer-showing-a-preview-value-thats` `apple-pencil-and-scribble/hover/avoid-using-hover-to-initiate-an`
- Show Pencil hover previews for Pencil only, not for pointing devices `apple-pencil-and-scribble/hover/prefer-showing-hover-previews-for-apple`
- For custom double-tap, give a control to choose it and make the mode easy to find `apple-pencil-and-scribble/double-tap/give-people-a-way-to-specify`
- Show squeeze UI, such as a contextual menu, close to the Pencil Pro tip `apple-pencil-and-scribble/squeeze/if-you-use-squeeze-to-reveal`
- For Scribble, hide autocompletion and placeholder text once writing starts `apple-pencil-and-scribble/scribble/avoid-distracting-people-while-they-write`
- Keep fields fixed, do not autoscroll, and enlarge fields only before or between writing `apple-pencil-and-scribble/scribble/prevent-autoscrolling-text-while-people-are` `apple-pencil-and-scribble/scribble/give-people-enough-space-to-write`
- When drawing over a PDF or photo, disable dynamic color adjustment on the canvas `apple-pencil-and-scribble/custom-drawing/help-people-draw-on-top-of`
- In compact layouts, consider your own undo and redo buttons plus the 3-finger gesture `apple-pencil-and-scribble/custom-drawing/consider-displaying-custom-undo-and-redo`

## Platform differences
- **iPadOS:** the only platform; all rules apply.
- **Not available on:** iOS, macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] for any stylus, start marks at touch and avoid destructive indirect gestures `apple-pencil-and-scribble/best-practices/let-people-make-a-mark-the`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Entering data](https://developer.apple.com/design/human-interface-guidelines/entering-data) · [Digital Crown](digital-crown.md)
