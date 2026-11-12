# Notices

achmage-video-script is licensed under the MIT License (`LICENSE`). The license covers the author's own work in this folder: the rules, the analysis, the script and the template. It does not cover the short quotations from third-party videos described below.

## Research basis

The rules in `references/01` to `07` come from the author's own analysis of on-screen text in 159 videos from 27 public channels (EBS 지식채널e, 역사채널e, 뉴스타파 5 Minutes, AJ+, NowThis, Brut, ESOcast Light and others). Example lines in those seven files are short illustrations written for this skill, not transcripts of episodes.

## Casebook (`references/casebook/`)

The casebook is that analysis itself: 27 channel analyses and 159 per-video structure notes, written by the author. It is commentary and research on publicly available videos.

- It contains no video, image or audio from those channels, no full transcripts and no frame captures. The per-video timing tables record position, type, line count, length and scene description only, not the on-screen text.
- The analysis quotes short passages of on-screen text and speech to show how a hook, a turn or an ending works. Across the whole casebook, the quoted share of any one video is limited to 15% of that video's on-screen text and speech (with a floor of 80 Korean characters or 160 English characters for very short videos). Longer quotations were abbreviated and end in `…`. The limit was applied and checked by script.
- Every quotation is attributed: each file names the video, the channel and its address. Copyright in the quoted text remains with the respective broadcasters and producers. Quotations are used for commentary, criticism and research.
- ESOcast Light and Hubblecast Light are published under the Creative Commons Attribution 4.0 International License and are quoted without that limit. Credit: ESO. Credit: ESA/Hubble.
- Channel names identify the sources of the analysis. The channels did not take part in this project and do not endorse it.
- View counts and dates were recorded on 2026-11-11.

If you hold rights in a quoted passage and want it removed, open an issue at https://github.com/laguna821/Achmage-Skills/issues and it will be removed.

## Research corpus (`corpus/`, not in the public package)

The verbatim on-screen-text logs, caption transcripts and frame captures collected for the analysis are third-party material. They are kept for private research use and are not part of the published package or the installation ZIP. The skill works without them.

## No third-party media in the skill folder

The skill folder holds text, a Python script that uses the standard library only, and an HTML template. It loads nothing from the network. The example videos published next to the package (`../examples/`) contain third-party footage, music, sound effects and public-domain drawings; their sources and terms are listed in `../ASSET-NOTICE.md` and in each example's `credits.md`. Those terms apply to the examples, not to the skill.
