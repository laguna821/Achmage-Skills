---
slug: machine-learning
title: "Machine learning"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/machine-learning
---

# Machine learning

**In one line:** Guidance for features driven by predictions: how to gather feedback, handle mistakes and corrections, present options and confidence, and state limits.

## Why it exists
Learning features guess, and guesses are sometimes wrong. People need a way to teach the system, repair errors cheaply and understand what to expect. The guidance keeps that effort small and honest (Agency, Responsibility) `machine-learning/corrections/always-balance-the-benefits-of-a` `machine-learning/limitations/help-people-establish-realistic-expectations`.

## Use it when
- Suggestions or predictions can improve with feedback: prefer implicit signals and ask for explicit feedback only when necessary `machine-learning/explicit-feedback/request-explicit-feedback-only-when-necessary`
- A feature needs personal setup: keep calibration short, early and clear `machine-learning/calibration/make-calibration-quick-and-easy`
- Several answers are plausible: show diverse, ranked options `machine-learning/multiple-options/prefer-diverse-options` `machine-learning/multiple-options/list-the-most-likely-option-first`

## Don't use it when
- Fixing a mistake costs more than the feature saves (no HIG alternative named) `machine-learning/corrections/always-balance-the-benefits-of-a`
- You would use corrections to excuse poor results `machine-learning/corrections/never-rely-on-corrections-to-make`
- Confidence is too low: show no result at all `machine-learning/confidence/when-you-know-that-confidence-values`

## Cost to the user
Feedback requests, calibration and corrections all take effort, so each must be optional, quick or cheaper than the benefit `machine-learning/explicit-feedback/always-make-providing-explicit-feedback-a` `machine-learning/calibration/avoid-asking-people-to-participate-in` `machine-learning/corrections/always-balance-the-benefits-of-a`. Too many options need scrolling `machine-learning/multiple-options/in-general-avoid-providing-too-many`.

## Principles at stake
- **Agency:** feedback is optional and acted on at once; corrections can themselves be corrected `machine-learning/explicit-feedback/act-immediately-when-you-receive-explicit` `machine-learning/corrections/let-people-correct-their-corrections`
- **Responsibility:** protect data, avoid sensitive suggestions, and do not narrow what people see `machine-learning/implicit-feedback/always-secure-peoples-information` `machine-learning/implicit-feedback/consider-withholding-private-or-sensitive-suggestions` `machine-learning/implicit-feedback/dont-let-implicit-feedback-decrease-peoples`
- **Simplicity:** plain-language attributions and few options `machine-learning/attribution/in-general-avoid-technical-or-statistical` `machine-learning/multiple-options/in-general-avoid-providing-too-many`

## Key rules
- Make explicit feedback optional, described in simple words like "Suggest less pop music", and act on it right away `machine-learning/explicit-feedback/always-make-providing-explicit-feedback-a` `machine-learning/explicit-feedback/use-simple-direct-language-to-describe` `machine-learning/explicit-feedback/act-immediately-when-you-receive-explicit`
- Never use an icon alone for a feedback option `machine-learning/explicit-feedback/add-icons-to-an-option-description`
- Combine feedback signals, prefer recent ones, and do not rely on implicit feedback alone `machine-learning/implicit-feedback/when-possible-use-multiple-feedback-signals` `machine-learning/implicit-feedback/prioritize-recent-feedback` `machine-learning/implicit-feedback/beware-of-confirmation-bias`
- Calibrate once, early, with only essential information and a clear goal and progress `machine-learning/calibration/avoid-asking-people-to-participate-in` `machine-learning/calibration/collect-only-the-most-essential-information` `machine-learning/calibration/make-sure-people-know-how-to`
- Help when calibration stalls without blame, confirm success, allow cancel without comment, and let people edit or remove their data `machine-learning/calibration/immediately-provide-assistance-if-progress-stalls` `machine-learning/calibration/confirm-success` `machine-learning/calibration/let-people-cancel-calibration-at-any` `machine-learning/calibration/give-people-a-way-to-update`
- Match corrective tools to how serious a mistake is, and take extra care with proactive features `machine-learning/mistakes/understand-the-significance-of-a-mistakes` `machine-learning/mistakes/be-especially-careful-to-avoid-mistakes`
- Offer familiar, guided corrections and show corrected content immediately `machine-learning/corrections/give-people-familiar-easy-ways-to` `machine-learning/corrections/when-possible-use-guided-corrections-instead` `machine-learning/corrections/provide-immediate-value-when-people-make`
- Put the likeliest option first, distinguishable from the rest `machine-learning/multiple-options/list-the-most-likely-option-first` `machine-learning/multiple-options/make-options-easy-to-distinguish-and`
- Translate confidence into familiar ideas or actionable suggestions, not raw numbers, unless people expect statistics `machine-learning/confidence/in-general-translate-confidence-values-into` `machine-learning/confidence/whenever-possible-help-people-make-decisions` `machine-learning/confidence/in-scenarios-where-people-expect-statistical`
- Keep attributions factual and never imply judgment of emotions or beliefs `machine-learning/attribution/keep-attributions-factual-and-based-on`
- Set realistic expectations, show how to get the best results, and explain why results are poor `machine-learning/limitations/help-people-establish-realistic-expectations` `machine-learning/limitations/demonstrate-how-to-get-the-best` `machine-learning/limitations/explain-how-limitations-can-cause-unsatisfactory`

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] the feedback, correction, option and confidence rules apply as written `machine-learning/corrections/always-balance-the-benefits-of-a`
- **Desktop web:** [HIG] the same rules apply to recommendation and suggestion features `machine-learning/multiple-options/prefer-diverse-options`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Generative AI](generative-ai.md) · [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)
