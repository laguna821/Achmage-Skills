---
slug: sheets
title: "Sheets"
kind: component
group: "Presentation"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/sheets
decision_trees: [alerting-and-confirming]
---

# Sheets

**In one line:** A modal view for a small, scoped task closely tied to what the person is already doing.

## Why it exists
Some tasks, like composing or editing a detail, belong to the current context but need focus. A sheet keeps the parent visible while people finish the scoped task, then returns them where they were. It works only when the task is short and contained `sheets/best-practices/for-complex-or-prolonged-user-flows`. Simplicity and Familiarity apply: one sheet, standard dismissal.

## Use it when
- A focused, scoped task relates to the current context `sheets/best-practices/for-complex-or-prolonged-user-flows`
- On iPhone, content works best shown partly first, via a medium detent `sheets/platform-considerations/ios-ipados/in-an-iphone-app-consider-supporting`
- On iPadOS, you want the page or form presentation style `sheets/platform-considerations/ios-ipados/prefer-using-the-page-or-form`

## Don't use it when
- The flow is long or complex: use a full-screen modal on iOS and iPadOS, a new window or full screen on Mac, or a Full Space on visionOS `sheets/best-practices/for-complex-or-prolonged-user-flows`
- Supplementary items affect the main task: use a nonmodal view, such as a split view (visionOS), [Panels](panels.md) (macOS) or a nonmodal sheet (iOS, iPadOS) `sheets/best-practices/use-a-nonmodal-view-when-you`
- On Mac, input must be given repeatedly while watching results, like find and replace: use a panel `sheets/platform-considerations/macos/use-a-panel-instead-of-a`
- On Apple Watch, you only need key information or choices: use [Alerts](alerts.md) or [Action sheets](action-sheets.md) `sheets/platform-considerations/watchos/use-a-sheet-only-when-your`

## Cost to the user
A sheet interrupts and blocks the parent until closed. Stacked sheets multiply that burden, and on Apple Watch a sheet should be brief and occasional `sheets/best-practices/display-only-one-sheet-at-a` `sheets/platform-considerations/watchos/keep-sheet-interactions-brief-and-occasional`.

## Principles at stake
- **Simplicity:** one sheet at a time, short tasks `sheets/best-practices/display-only-one-sheet-at-a`
- **Agency:** clear exits: Done with Cancel or Back, swipe to dismiss, a grabber for resizing `sheets/best-practices/provide-an-alternative-to-the-done` `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable`
- **Responsibility:** unsaved changes get a confirmation on dismiss `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet`

## Key rules
- Use alternatives to sheets for long or complex flows `sheets/best-practices/for-complex-or-prolonged-user-flows`
- Show one sheet at a time; if another is needed, dismiss the first, and optionally reopen it later `sheets/best-practices/display-only-one-sheet-at-a`
- Use a nonmodal view for supplementary items `sheets/best-practices/use-a-nonmodal-view-when-you`
- Pair Done with Cancel or Back, never all three `sheets/best-practices/provide-an-alternative-to-the-done`
- Add a grabber to any resizable sheet on iOS and iPadOS `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable`
- Support swipe down to dismiss, confirming unsaved changes with an action sheet `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet`
- Open Mac sheets at a size fitting their content and allow resizing when useful `sheets/platform-considerations/macos/present-a-sheet-in-a-reasonable`
- Let Mac people bring other app windows forward while a sheet is open `sheets/platform-considerations/macos/let-people-interact-with-other-app`

## Platform differences
- **iOS, iPadOS:** consider a medium detent on iPhone; use grabber and swipe dismiss; prefer page or form style on iPad `sheets/platform-considerations/ios-ipados/in-an-iphone-app-consider-supporting` `sheets/platform-considerations/ios-ipados/prefer-using-the-page-or-form`
- **macOS:** reasonable default size, other windows reachable, panel for repeated input `sheets/platform-considerations/macos/present-a-sheet-in-a-reasonable` `sheets/platform-considerations/macos/use-a-panel-instead-of-a`
- **visionOS:** center the sheet in the field of view rather than sliding from the window's bottom; keep it from covering most of the window `sheets/platform-considerations/visionos/avoid-displaying-a-sheet-that-emerges` `sheets/platform-considerations/visionos/present-a-sheet-in-a-default`
- **watchOS:** only for custom titling or content; brief; if you replace the label, use a symbol and avoid text that looks like a back button or page title `sheets/platform-considerations/watchos/use-a-sheet-only-when-your` `sheets/platform-considerations/watchos/keep-sheet-interactions-brief-and-occasional` `sheets/platform-considerations/watchos/if-you-change-the-default-label`
- **tvOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] a bottom sheet with a grabber, medium height first, swipe to close `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable`
- **Desktop web:** [HIG transfer] a modal dialog for scoped tasks, with one open at a time and a non-modal side panel for supplementary items `sheets/best-practices/use-a-nonmodal-view-when-you`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Alerts](alerts.md) · [Action sheets](action-sheets.md) · [Popovers](popovers.md) · [Panels](panels.md) · see [Decision tree](../decision-trees/alerting-and-confirming.md)
