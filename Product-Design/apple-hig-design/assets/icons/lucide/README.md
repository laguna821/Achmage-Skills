# Lucide icons (bundled)

- Source: lucide-static 1.67.0 (https://lucide.dev), ISC license; see `LICENSE` in this folder.
- Normalized to the house icon spec in `references/icons.md` at text weight 400 (stroke 1.75) with `scripts/icons.mjs normalize`. All pass `scripts/icons.mjs check`.
- Contents: the 38 Lucide icons named in the HIG standard actions table (`references/icons.md`) plus 61 common interface icons (arrows, chevrons, menu, house, settings, user, bell, mail, map-pin, clock, globe, eye, lock, media, locate-fixed and similar).
- Other text weights: `node scripts/icons.mjs normalize assets/icons/lucide/<name>.svg --out <folder> --weight 600`.
- Anything not here: `node scripts/icons.mjs fetch <name> --out <folder>`, then normalize. Never type icon paths from memory.
