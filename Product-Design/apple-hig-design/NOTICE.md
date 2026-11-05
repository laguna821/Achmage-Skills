# Notices

apple-hig-design is licensed under the Apache License 2.0 (`LICENSE`). The third-party material below keeps its own terms.

## Apple Human Interface Guidelines

- This skill contains no text, images or videos from Apple. Rule summaries, decision trees, component cards and templates are written in our own words. Each rule ID is a short slug (at most six words from the rule) that points to the HIG page holding Apple's guidance.
- `scripts/fetch-hig.mjs` downloads the HIG from Apple's public site to your own computer (`.hig-local/`, ignored by git) so you can check exact wording. That copy is Apple's content: keep it local and do not redistribute it.
- Apple, iPhone, iPad, Mac, macOS, iOS, iPadOS, watchOS, tvOS, visionOS, Apple TV, Apple Vision Pro, Apple Watch, Liquid Glass, SF Symbols and San Francisco are trademarks of Apple Inc. This project is not affiliated with, sponsored or endorsed by Apple Inc. "Apple HIG" in the name only says which guidelines it follows.
- SF Symbols and the San Francisco fonts are neither used nor included.

## Lucide icons

`assets/icons/lucide/` holds SVG icons from Lucide (lucide-static 1.67.0), normalized to the house stroke. Lucide is under the ISC License, and the icons derived from Feather are under the MIT License; the full texts are in `assets/icons/lucide/LICENSE`. Icons inlined in the kit galleries and examples come from the same set.

## Pretendard

Pretendard Variable (SIL Open Font License 1.1, orioncactus) is loaded from the jsDelivr CDN (`orioncactus/pretendard@v1.3.9`). No font files are included.

## DESIGN.md format

`assets/templates/DESIGN.md` follows the open DESIGN.md format from Google Labs (`google-labs-code/design.md`, alpha). No Google code is included; the lint tool runs through npx when you have it. Google does not endorse this skill.
