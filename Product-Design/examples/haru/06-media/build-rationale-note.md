# Build rationale note: 하루 launch landing page and Instagram cards

## Built
- What: landing page (`landing/index.html`) and five Instagram cards (`cards/cards.html`, alt text in `cards/alt-text.md`) · Medium: web (desktop first, also 390 px) and cards (1080 x 1350, 4:5) `design-principles/purpose/create-value`
- Goal in one sentence: make a person who has a to-do list problem understand in a few seconds what 하루 does and press one button to open the app.

## Assumptions
- "가입 없이 바로 써요" is used because the app has no sign-in; data stays in the browser. · Why: design-brief and the running app show no account · Confirm with: owner
- Cards use the sample data (오늘 7 tasks, 웹사이트 개편 6개 중 1개 완료) captured from the running app with the sample action. · Why: the app starts empty · Confirm with: owner
- The card CTA text "프로필 링크에서 하루 시작하기" assumes the Instagram profile link points to `../../04-build/`'s final address. · Why: no public URL exists yet · Confirm with: owner

## Decisions and why
| Decision | Why-chain | Rule IDs | Label |
|---|---|---|---|
| One filled indigo button "하루 시작하기", repeated once at the end, same link | people must know the next step → one clear action → one primary button | `buttons/style/in-general-use-a-button-that` | [HIG transfer] |
| Real screenshots only; features limited to quick add, today list, project progress, undo, search, export | trust → show what exists → no invented features, plus a "know before you start" list (browser-only data, no sync) | `branding/best-practices/ensure-branding-always-defers-to-content` | [HIG transfer] |
| Indigo only on the button, active states and the closing card | accent keeps its meaning | `branding/best-practices/apply-your-apps-accent-color-judiciously` | [HIG transfer] |
| Landing follows light and dark through `prefers-color-scheme`, with dark screenshots swapped in | look good in both appearances | `dark-mode/best-practices/ensure-that-your-app-looks-good` | [HIG transfer] |
| Hierarchy by size and weight: one display headline, Title 1/2 section titles, Body 17 text | attention goes to the headline first | `typography/conveying-hierarchy/adjust-font-weight-size-and-color` | [HIG] |
| Every screenshot has alt text; cards have a separate alt-text file | people using screen readers get the same content | `accessibility/vision/describe-your-apps-interface-and-content` | [HIG] |
| Text meets contrast in both appearances (white Bold on indigo 6.12:1 in light) | readable | `accessibility/vision/strive-to-meet-color-contrast-minimum` | [HIG] |
| Phone-width buttons at least 44 px (kit button), desktop at least 28 px | easy to hit | `accessibility/mobility/offer-sufficiently-sized-controls` | [HIG transfer] |

## House-style choices
- [House] Font: Pretendard Variable everywhere, one family, hierarchy by weight and size (`typography/conveying-hierarchy/minimize-the-number-of-typefaces-you`).
- [House] Icons: Lucide, inline SVG, one per small feature and one per fact.
- [House] Type scale: the landing is a reading page, so the iOS scale is used (Body 17/22 with reading leading 25, Title 1 28, Title 2 22). The hero headline is display type at 2 x Large Title (68 px at 1024 and up, 56 px at 744, 40 px on phones). Cards: iOS Large converted with 2.88 px per pt (Title 3 58/72, Headline and Body 49/64); card headlines are display type at 128 px (cover 160 px), under 2 x Large Title (196 px).
- [House] Cards are always light: a card cannot follow the viewer's appearance. Margins 96 px so text also survives the 3:4 profile-grid crop.

## Craft pass
- Feeling: calm and clear · Carried by: one very large black headline against lots of quiet space, a single indigo accent, soft shadows only under the product images, real screenshots as the only imagery.
- Decision varied: the hero composition (it shapes the whole first screen). Compared at 1280 px in light (and dark for A and C) in `craft-variants/hero-*.png`:
  - A: centered headline and button, desktop window below, phone overlapping its lower left. Calm, one focal order.
  - B: split, text left and devices right. Devices shrank to roughly 55% of the width, the screens became hard to read, and a large empty block remained below the fold.
  - C: full indigo field with the white button. Loud, contradicts "calm", and the button no longer stands out from the field.
  - Chosen: A, because the headline reads first, the button is the only filled color, and the real screen is large enough to read.
- Decision varied (cards): the cover, compared at 1080 x 1350 in `craft-variants/cover-a/b/c.png` and `cover-compare.png`: A type only (a big empty gap in the middle, product not shown); B type plus a phone bleeding off the bottom edge on grouped gray; C indigo field plus phone. Chosen: B, because it shows the product on the first card and leaves the indigo for the last card, where the call to action is; the series then rises to color at the end. Cards 2 to 5 follow the same frame (wordmark and page dots top, headline, one line of text, product image anchored to the bottom and bleeding off) as in `craft-variants/card-1..5.png` and `set.html`.
- Finish list changes: product images bleed off the bottom edge instead of floating; the page dots sit in the top row because the bottom is covered by images; headlines use `word-break: keep-all` so Korean words do not split; the landing's phone layout drops the desktop window (unreadable at that size) and shows the phone only; shadows kept soft; card 3 uses a cropped desktop shot with the sidebar visible rather than a shrunken full window; card 5 keeps the real undo toast as proof of the feature.

## Checks run
- Preview: app at https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/04-build/ (screenshots taken with sample data); landing at https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/06-media/landing/index.html viewed at 1280 and 390 px, light and dark, scrolled through the whole page; cards at 1120 px wide page, all five seen in `craft-variants/set.html` and at full size.
- Audit (`skill/apple-hig-design/scripts/audit-page.js`):
  - Landing 1280 px light: no automatic findings (smallest text 15 px, targets none under 28 px, no missing alt).
  - Landing 1280 px dark: no automatic findings.
  - Landing 390 px light (minTarget 44): no automatic findings.
  - Landing 390 px dark: no automatic findings.
  - Cards (pxPerPt 2.88, canvas [1080, 1350]): no automatic findings; five canvases found, no text outside the canvas, none in the safe margin, smallest text 17 pt (the wordmark), contrast list empty.
- Contrast spot checks: the audit cannot measure text over images; no text sits over a photo here. Token values from theme.css: white Bold on indigo fill 6.12:1 light; accent text on white 6.12:1; in dark, white Bold on the lighter indigo is 3.51:1 (Bold only, needs 3:1). Gray secondary text is taken from the kit's measured tokens.
- Rule IDs: `node scripts/find-rules.mjs --check` on this note and `cards/alt-text.md` (result in answer.md).
- Accessibility: alt text on all screenshots; headings in order (one h1); skip link; keyboard focus uses the kit's ring; no information by color alone (page dots differ by shape); links and buttons are real elements; zoom is not blocked.

## Open [HIG none] questions
- How big a display headline may be on web and cards · My default: at most 2 x Large Title (house 12) · Owner decides: no
- Whether a card CTA should be a button shape when it cannot be tapped · My default: button shape in the closing card with text "프로필 링크에서" so it points to the bio link · Owner decides: yes

## Known gaps
- The landing has no real public URL, so the link is relative (`../../04-build/`).
- Dark-mode screenshots were captured for the landing only; cards are light only by design.
- Another agent was changing the app at the same time; if its screens change, the screenshots need a refresh.
