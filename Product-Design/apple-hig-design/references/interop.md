# Working with design files and other skills

This skill works alone. This file covers two situations: the project already has its own design file or design system, and other skills are installed next to this one.

## DESIGN.md posture: consumes and produces

**Design.md posture**: consumes and produces. DESIGN.md is the open format for design tokens plus rationale (YAML front matter, then eight sections in a fixed order). This skill reads one when the project has it and writes one when asked or when another tool in the project reads it.

### Reading a project's DESIGN.md or token file

1. Read it before `house-style.md`. Its tokens are the project's decisions and win over the house defaults (typeface, accent, radii, spacing). House values fill only what it leaves out; say which ones.
2. Map tokens to roles, not names. Names differ between files, so decide by how each token is used, and record the mapping in `visual-system-note.md`:

| DESIGN.md token (typical names) | Role in this skill and the HIG Kit |
| --- | --- |
| `primary` used for links, icons, selection | accent tint `--accent` |
| `primary` used as a fill behind text | `--accent-fill`, with `on-primary` as `--on-accent` |
| `primary` as small text | `--accent-text` (check it separately) |
| `surface`, `neutral`, `background` | `--bg`, `--bg-grouped`, `--bg-cell` |
| `on-surface`, `text` | `--label` |
| `secondary` or muted text | `--label-2` |
| `error` | `--destructive`, `--destructive-text`, `--destructive-fill` |
| typography levels (`headline-*`, `body-*`, `label-*`) | the nearest text style by role in `tokens.md`, keeping the project's typeface |
| `spacing`, `rounded` | `--s-*`, `--r-*` |

3. Check, don't rewrite. For each text and background pair, in light and dark, run `scripts/contrast.mjs`; compare text sizes with the floors and controls with the target sizes in `tokens.md`. A failing pair is a finding with a severity (house decision 6) and rule IDs `accessibility/vision/strive-to-meet-color-contrast-minimum`. Propose the nearest passing value and change the token only when the owner agrees.
4. If the file has no dark values, propose them and ask; both appearances need designed colors `color/best-practices/make-sure-all-your-apps-colors`.
5. Keep the project's typeface and check it against the legibility rules `typography/using-custom-fonts/make-sure-custom-fonts-are-legible`.

### Writing a DESIGN.md

1. Copy `assets/templates/DESIGN.md` and set the product name and description.
2. Fill the tokens from the project's `theme.css` and `visual-system-note.md`. Keep the `-dark` suffix for dark values and the dark component variants, since the format has no appearance switch.
3. Keep the eight sections in order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Cite rule IDs in the prose and mark house values [House].
4. Lint when the tool is available: `npx @google/design.md lint DESIGN.md`. With the house accent, expect two contrast warnings: white Bold labels on the dark-mode fills (3.23:1 and 3.43:1). They pass the HIG table's 3:1 row for bold text (house decision 10) but not the 4.5:1 that the linter applies; report them as such.
5. Keep `theme.css` and DESIGN.md in step. When one changes, change the other in the same edit.

## Sharing work with other skills

This skill's lane: HIG judgment (why a feature, screen or component should exist, which component, platform conventions, accessibility floors, review against the HIG), product UI built on the HIG Kit, launch material for that product, and live demo decks. Outside that lane, another installed skill leads and this one adds HIG checks.

| Situation | Who leads | What this skill adds |
| --- | --- | --- |
| A brand-led or editorial page where the look is the message (an exhibition, an essay page, a campaign), or a request to pick components from an outside component library | A page-composition or component-sourcing skill, if installed (for example `component-consulting-v3`) | Decide and Review on its plan and its result: component fit (alerts, sheets, navigation), contrast, text floors, targets, motion and Liquid Glass limits. Findings come with rule IDs; its reader, genre and signature choices stay its own. |
| Measuring the rendered pixels of a built page | A render QA skill, if installed (for example `render-audit`) | `scripts/audit-page.js` runs as well and both reports are delivered; they overlap only on contrast. |
| A personal or company design system the project already uses | That design system | HIG checks and platform conventions; its tokens win as above. |
| General presentation decks, lecture slides, photo card news | The installed presentation or card-news skill, with its house rules | A live product demo deck (`assets/demo-deck/`), or HIG checks of slides and cards when asked. |
| A critique or polish pass by another named method | The skill for that method | HIG findings only, labeled, when asked. |
| A native app in Swift or SwiftUI | The platform's own components and ordinary engineering | The design decisions, the platform profile and the review. |

Rules for shared work:

1. The user's explicit request comes first, then the project's own design system, then the skill that leads the task.
2. One skill owns each deliverable. Do not produce a competing version of an artifact another skill owns.
3. Report HIG findings; never apply them silently over another skill's decision. Say what would change and why, with rule IDs and severity.
4. Hand work over through files: DESIGN.md for tokens, `component-decision-record.md` for component choices, `hig-review-report.md` for findings.
5. When no other skill is installed, do the whole job here.
