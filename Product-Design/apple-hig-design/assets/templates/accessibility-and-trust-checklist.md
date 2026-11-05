# Accessibility and trust checklist

**Purpose:** Stage 7 (Include). A pass/fail list for usability, privacy and honesty, with evidence. See workflow (`references/workflow.md#include`) and the inclusion (`references/lenses.md#inclusion`) and trust (`references/lenses.md#trust`) lenses.

Mark each: Pass / Fail / N/A. Fail items become findings in the review report (`assets/templates/hig-review-report.md`).

## Vision
| Check | Result | Evidence | Rule IDs |
|---|---|---|---|
| Larger text supported, layout survives | <P/F/NA> | <what was tested> | `accessibility/vision/support-larger-text-sizes` |
| Contrast meets the minimums in tokens (`references/tokens.md`) | <P/F/NA> | <values> | `accessibility/vision/strive-to-meet-color-contrast-minimum` |
| Color never carries meaning alone | <P/F/NA> | <second cue> | `color/inclusive-color/avoid-relying-solely-on-color-to` |
| Light, dark, Increase Contrast, Reduce Transparency | <P/F/NA> | <result> | `dark-mode/best-practices/test-your-content-to-make-sure` |

## Hearing, motion, mobility
| Check | Result | Evidence | Rule IDs |
|---|---|---|---|
| Sound paired with another channel | <P/F/NA> | <cue> | `accessibility/hearing/use-haptics-in-addition-to-audio` |
| Motion optional | <P/F/NA> | <setting> | `motion/best-practices/make-motion-optional` |
| Control spacing | <P/F/NA> | <values> | `accessibility/mobility/consider-spacing-between-controls-as-important` |
| No single input or body movement required | <P/F/NA> | <alternative> | `rule-id` |

## Labels and assistive tech
| Check | Result | Evidence | Rule IDs |
|---|---|---|---|
| Custom icons, charts, controls have text labels | <P/F/NA> | <where> | `icons/best-practices/provide-alternative-text-labels-for-custom` |

## Privacy and honesty
| Check | Result | Evidence | Rule IDs |
|---|---|---|---|
| Each permission asked in context, with reason | <P/F/NA> | <step> | `rule-id` |
| Only needed data collected, sensitive entries protected | <P/F/NA> | <fields> | `design-principles/responsibility/keep-peoples-information-safe` |
| AI use disclosed, not passed off as human-made | <P/F/NA> | <where> | `generative-ai/transparency/communicate-where-your-app-uses-ai` |

## Other media
- <Slides or cards: [HIG transfer] which checks apply; [HIG none] for reading-distance claims>

## Why-chain (one failed or tricky item)
- **Why-chain:** situation → principle → pattern → component → rule IDs → label
- <situation> → <principle> → <pattern> → <component> → `rule-id` → [HIG]
