# Notices

achmage-video-script is licensed under the MIT License (`LICENSE`). The license covers the author's own work in this folder: the rules, the analysis, the script and the template. It does not cover third-party text: the quotations in the casebook and the records in `corpus/` described below.

## Research basis

The rules in `references/01` to `07` come from the author's own analysis of on-screen text in 159 videos from 27 public channels (EBS 지식채널e, 역사채널e, 뉴스타파 5 Minutes, AJ+, NowThis, Brut, ESOcast Light and others). Example lines in those seven files are short illustrations written for this skill, not transcripts of episodes.

## Casebook (`references/casebook/`)

The casebook is that analysis: 27 channel analyses and 159 per-video structure notes, written by the author. It is commentary and research on publicly available videos.

- The per-video timing tables record position, type, line count, length and scene description only, not the on-screen text.
- The analysis quotes short passages to show how a hook, a turn or an ending works. Within the casebook the quoted share of any one video is limited to 15% of that video's on-screen text and speech (with a floor of 80 Korean characters or 160 English characters for very short videos). Longer quotations end in `…`.

## Research records (`corpus/`)

From version 1.2.0 the skill also ships the research records the analysis was made from, so that the skill works the same on any computer.

- `corpus/화면문장_로그/`: for each of the 159 videos, a log of its on-screen text as read from the screen (time, text, scene, type) with the author's structure notes.
- `corpus/자막_트랜스크립트/`: 103 caption tracks collected from YouTube and one official transcript.
- `corpus/채널별_분석/` and the report: the author's analyses before quotations were shortened.
- Index files and a list of the 1,049 videos of the EBS 지식채널e YouTube channel (titles, lengths, view counts, addresses).

These records reproduce third-party text. **They are not licensed under the MIT License and are not offered for reuse.** Copyright in the on-screen text and captions remains with the respective broadcasters and producers. They are included as records of research and criticism: to show how each script is built, card by card. Every record names the video, the channel and its address. The skill instructs writers to take structure and rhythm from them and never to copy sentences into a script.

The frame captures used to read the screens (contact sheets of video frames) are not included.

- ESOcast Light and Hubblecast Light are published under the Creative Commons Attribution 4.0 International License. Credit: ESO. Credit: ESA/Hubble.
- Channel names identify the sources of the analysis. The channels did not take part in this project and do not endorse it.
- View counts and dates were recorded on 2026-11-11.

If you hold rights in a record or a quoted passage and want it removed, open an issue at https://github.com/laguna821/Achmage-Skills/issues and it will be removed.

## No third-party media in the skill folder

The skill folder holds text, a Python script that uses the standard library only, and an HTML template. It contains no video, image or audio from the channels, and it loads nothing from the network. The example videos published next to the package (`../examples/`) contain third-party footage, music, sound effects and public-domain drawings; their sources and terms are listed in `../ASSET-NOTICE.md` and in each example's `credits.md`. Those terms apply to the examples, not to the skill.
