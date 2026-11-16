# Notices

achmage-story-research is licensed under the MIT License (`LICENSE`). The license covers the author's own work in this folder: the rules, the analysis notes and the script. It does not cover the short quotations from third-party articles described below.

## Research basis

The rules in `references/01` to `07` come from a survey of 117 documents in nine clusters: annotated stories and author interviews (The Open Notebook, Nieman Storyboard), verification handbooks and policies (KSJ Science Editing Handbook, KSJ Fact-Checking Project, Verification Handbook, GIJN, Quote Investigator, Wikipedia), research and sourcing practice of video producers (Kurzgesagt, Vox, TED-Ed), explanatory and object-history writing (Quanta Magazine, Aeon, Smithsonian Magazine, Atlas Obscura, JSTOR Daily, 99% Invisible, The Atavist Magazine, The Pudding, Our World in Data), and Korean-language production interviews, reporting notes and articles. They also come from the author's own tests of three ways of combining research with script writing on two topics; the figures quoted in `SKILL.md` are from those tests.

## Casebook (`references/casebook/`)

The casebook holds the survey itself: nine cluster analyses, one re-reading (`clusters/S0.md`) and 117 per-document notes written for this skill. They are commentary on publicly available articles. The same survey ships with achmage-video-script from version 1.3.0, where it supports the story-finding guidance.

- The notes summarize in the surveyor's own words. Direct quotation is limited to 150 words (300 Korean characters) per document and two sentences at a time. No article is reproduced.
- Every note names the author, the outlet and the address. Copyright in the quoted text remains with the respective authors and outlets.
- Outlet names identify the sources of the analysis. The outlets did not take part in this project and do not endorse it.
- Some pages were read from archived copies because the live site could not be opened; each such note says so. Not every document was read in full; each note states the range that was read.

If you hold rights in a quoted passage and want it removed, open an issue at https://github.com/laguna821/Achmage-Skills/issues and it will be removed.

## Captures made while using the skill

The skill asks the host agent to capture the passages it relies on (a page of a manuscript, a paragraph of an article, an image from a holding institution) into a `화면자료/` folder next to its output. Those captures are made by the user of the skill, from sources the user opens. They are working records for checking a script. The skill instructs the agent to record the holder and the terms of use of every item, to treat a credit line as no permission, and not to capture material behind a login or pictures of identifiable living people. Whether a captured item may be shown in a published video depends on its own terms, not on this license.

## Nothing from the network

The skill folder holds text and one Python script that uses the standard library only. The script reads the backing table and the script file and writes a Markdown summary and an HTML sheet. It loads nothing from the network. Research itself uses whatever web tools the host agent provides.
