---
slug: alerts
title: "Alerts"
kind: component
group: "Presentation"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/alerts
decision_trees: [alerting-and-confirming]
---

# Alerts

**In one line:** A modal message that stops the current task to deliver critical information and ask for an immediate response.

## Why it exists
Some situations cannot wait: a serious problem, a risk of losing data, or a confirmation people must give before an important action they started. An alert guarantees the message is seen by interrupting, which is exactly why it has to stay rare and essential `alerts/best-practices/use-alerts-sparingly`. It protects people from accidents (Responsibility, Agency) only when the action is uncommon and cannot be undone `alerts/best-practices/avoid-displaying-alerts-for-common-undoable`.

## Use it when
- A rare, destructive action cannot be reversed and may have been triggered by mistake `alerts/best-practices/avoid-displaying-alerts-for-common-undoable`
- A problem needs the person's decision before the task can continue `alerts/best-practices/use-alerts-sparingly`
- Resolving the situation needs one small piece of input, such as a password in a secure field `alerts/content/if-supported-include-a-text-field`

## Don't use it when
- The message is only informational: show it in context instead (no HIG alternative component named) `alerts/best-practices/avoid-using-an-alert-merely-to`
- The action is common and undoable, even if destructive: skip the confirmation and rely on [Undo and redo](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo) `alerts/best-practices/avoid-displaying-alerts-for-common-undoable`
- People need choices about an action they deliberately started: use [Action sheets](action-sheets.md) instead `alerts/platform-considerations/ios-ipados/use-an-action-sheet-not-an`
- The app is just launching: make news discoverable another way, and show cached or placeholder content for startup problems `alerts/best-practices/avoid-showing-an-alert-when-your`

## Cost to the user
An alert halts the task and demands a decision before people can continue, so every unnecessary alert spends attention that real warnings need `alerts/best-practices/use-alerts-sparingly`. Length adds cost: with large text sizes on iPhone and iPad, a long alert can start to scroll `alerts/platform-considerations/ios-ipados/when-possible-avoid-displaying-an-alert`.

## Principles at stake
- **Simplicity:** each alert must earn its interruption, carrying only essential information and useful actions `alerts/best-practices/use-alerts-sparingly`
- **Agency:** people act on purpose and can undo, so do not second-guess routine actions `alerts/best-practices/avoid-displaying-alerts-for-common-undoable`
- **Responsibility:** state the severity honestly and always offer a safe way out of a destructive action `alerts/content/in-all-alert-copy-be-direct` `alerts/buttons/if-theres-a-destructive-action-include`
- **Familiarity:** buttons sit where people expect them on each platform `alerts/buttons/place-buttons-where-people-expect`

## Key rules
- Use alerts rarely, and keep each one to essential information and useful actions `alerts/best-practices/use-alerts-sparingly`
- Write a specific, concise title that says what happened; avoid vague titles like "Error" `alerts/content/write-a-title-that-clearly-and`
- Add body text only if it adds value, and keep it very short `alerts/content/include-informative-text-only-if-it`
- Title buttons with one or two words, preferably verbs tied to the alert text; never Yes and No `alerts/buttons/create-succinct-logical-button-titles`
- Keep OK as the default only for purely informational alerts; otherwise name the action, such as Delete `alerts/buttons/avoid-using-ok-as-the-default`
- Use the destructive style only for a destructive action people did not deliberately choose `alerts/buttons/use-the-destructive-style-to-identify`
- With a destructive action, always include Cancel and do not make it the default `alerts/buttons/if-theres-a-destructive-action-include`
- Offer quick ways to dismiss, such as Escape on a keyboard `alerts/buttons/provide-alternative-ways-to-cancel-an`

## Anatomy and content
An alert is a modal view with a title, an optional message, one or more buttons, and, where supported, a text field. Keep the copy direct and neutral, never blaming people or downplaying the problem `alerts/content/in-all-alert-copy-be-direct`. If you must refer to a button, use the verb "choose" and its exact title `alerts/content/avoid-explaining-alert-buttons`.

## Platform differences
- **iOS, iPadOS:** offer choices for an intentional action in an action sheet, and keep alerts short enough not to scroll `alerts/platform-considerations/ios-ipados/use-an-action-sheet-not-an` `alerts/platform-considerations/ios-ipados/when-possible-avoid-displaying-an-alert`
- **macOS:** use the caution symbol only when extra attention is truly needed, such as a risk of unexpected data loss `alerts/platform-considerations/macos/use-a-caution-symbol-sparingly`
- **visionOS:** the system places the alert in front of the app window (or centered in view in a Full Space); an accessory view can be at most 154 pt tall with a 16 pt corner radius (see the source page)
- **tvOS, watchOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] the same restraint, wording and button rules apply to any modal dialog `alerts/best-practices/use-alerts-sparingly`
- **Desktop web:** [HIG] treat modal dialogs the same way, and let Escape cancel `alerts/buttons/provide-alternative-ways-to-cancel-an`
- **Slides:** [HIG none] for the component itself; [HIG transfer] the title rule suits an on-slide warning `alerts/content/write-a-title-that-clearly-and`
- **Card news:** [HIG none] for the component itself; [HIG transfer] a notice card can follow the direct, neutral tone rule `alerts/content/in-all-alert-copy-be-direct`

## Related
[Action sheets](action-sheets.md) · [Sheets](sheets.md) · [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) · see [Decision tree](../decision-trees/alerting-and-confirming.md)
