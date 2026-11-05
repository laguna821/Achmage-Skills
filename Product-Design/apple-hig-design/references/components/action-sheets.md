---
slug: action-sheets
title: "Action sheets"
kind: component
group: "Presentation"
platforms: [iOS, iPadOS, macOS, tvOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/action-sheets
decision_trees: [alerting-and-confirming]
---

# Action sheets

**In one line:** A modal list of choices tied to an action the person just started, such as saving or discarding.

## Why it exists
When people begin an action on purpose, they sometimes need to pick how it should finish, for example what to do with a draft when they cancel. An action sheet puts those choices right at hand without the weight of an alert `action-sheets/best-practices/use-an-action-sheet-not-an`. It protects against accidental data loss (Responsibility) while keeping the person in control (Agency).

## Use it when
- People chose an action deliberately and need options for finishing it, like saving or deleting a draft `action-sheets/best-practices/use-an-action-sheet-not-an`
- On iPhone or iPad, choices belong to an action, not to a general menu `action-sheets/platform-considerations/ios-ipados/use-an-action-sheet-not-a`
- An action could destroy data and needs a clear way out `action-sheets/best-practices/if-necessary-provide-a-cancel-button`

## Don't use it when
- The message reports a problem or needs urgent attention: use [Alerts](alerts.md) instead `action-sheets/best-practices/use-an-action-sheet-not-an`
- The situation is routine: skip it, since sheets should be rare `action-sheets/best-practices/use-action-sheets-sparingly`
- You are on visionOS: the component is not available (no HIG alternative named)

## Cost to the user
It interrupts the flow and asks for a choice, so each one spends attention `action-sheets/best-practices/use-action-sheets-sparingly`. A sheet long enough to scroll adds effort on iPhone and iPad `action-sheets/platform-considerations/ios-ipados/avoid-letting-an-action-sheet-scroll`.

## Principles at stake
- **Agency:** choices follow an action the person chose `action-sheets/best-practices/use-an-action-sheet-not-an`
- **Responsibility:** destructive options are visually prominent and Cancel is always reachable `action-sheets/best-practices/make-destructive-choices-visually-prominent` `action-sheets/best-practices/if-necessary-provide-a-cancel-button`
- **Simplicity:** short titles, messages only when needed `action-sheets/best-practices/aim-to-keep-titles-short-enough` `action-sheets/best-practices/provide-a-message-only-if-necessary`

## Key rules
- Use an action sheet, not an alert, for choices tied to a deliberate action `action-sheets/best-practices/use-an-action-sheet-not-an`
- Show action sheets only when needed `action-sheets/best-practices/use-action-sheets-sparingly`
- Keep the title to one line `action-sheets/best-practices/aim-to-keep-titles-short-enough`
- Add a message only if it is necessary `action-sheets/best-practices/provide-a-message-only-if-necessary`
- When data could be destroyed, include a Cancel button at the bottom `action-sheets/best-practices/if-necessary-provide-a-cancel-button`
- Use the destructive style for destructive buttons and place them at the top `action-sheets/best-practices/make-destructive-choices-visually-prominent`
- Keep the sheet short enough not to scroll on iPhone and iPad `action-sheets/platform-considerations/ios-ipados/avoid-letting-an-action-sheet-scroll`

## Platform differences
- **iOS, iPadOS:** prefer an action sheet over a menu for action-related choices, and avoid scrolling `action-sheets/platform-considerations/ios-ipados/use-an-action-sheet-not-a` `action-sheets/platform-considerations/ios-ipados/avoid-letting-an-action-sheet-scroll`
- **watchOS:** at most four buttons including the required Cancel, which sits at the upper left `action-sheets/platform-considerations/watchos/avoid-displaying-more-than-four-buttons` `action-sheets/best-practices/if-necessary-provide-a-cancel-button`
- **macOS, tvOS:** no additional considerations.
- **Not available on:** visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] a bottom sheet of choices for a deliberate action, with destructive first and Cancel last `action-sheets/best-practices/make-destructive-choices-visually-prominent`
- **Desktop web:** [HIG transfer] a small confirmation dialog with the same ordering and sparing use `action-sheets/best-practices/use-action-sheets-sparingly`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Alerts](alerts.md) · [Sheets](sheets.md) · [Popovers](popovers.md) · see [Decision tree](../decision-trees/alerting-and-confirming.md)
