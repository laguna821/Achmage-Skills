# Genre Map — web-page genres as kinds of text

> Starting vocabulary for page-as-text **R2**. These are *lenses, not
> molds*: real pages are usually hybrids ("a portfolio that argues", "a
> tutorial that sells"), and naming a new genre is always allowed. What
> each row fixes is the **reading contract** — what the reader shows up
> expecting and what breaking that expectation costs — plus the intent
> *tendencies* that follow. Order of beats is never prescribed here.

| Genre (예) | The reader's contract | Experience debt (leaves with…) | Intent tendencies | Typical failure |
|---|---|---|---|---|
| **광고/설득 (persuasion)** | "You have seconds to earn my attention; don't waste them" | a changed default — willing to try/buy/sign | I1 loud once · I2/I3 carry the middle · I11 single exit | all I1, no I2 — claims without ground read as hype |
| **위키/레퍼런스 (wiki/reference)** | "I came for one answer; let me find it fast and trust it" | the answer + confidence it's current/sourced | I10 orientation first · I2 citations · I8 depth folded away · I4 at friction points | burying the lookup path under a hero |
| **아카이브/색인 (archive/index)** | "Show me the whole collection and its logic" | the map of what exists + a way back in | I10 as the *spine* · I7 chronology · I8 metadata · I1 minimal | making an index dramatic — drama fights scanning |
| **강의/튜토리얼 (lecture/tutorial)** | "Promise me the outcome, then don't let me fail" | a completed step / a reproducible skill | I6 as the spine · I2 checkpoints · I4 exactly where errors happen · I9 before/after scene | steps without failure-recovery beats |
| **포트폴리오/전시 (portfolio/exhibition)** | "Convince me through the work, not the adjectives" | a memory of 1–3 pieces + how to reach the author | I9 scenes dominate · I12 ethos quiet but present · I3 sparse and real · I11 low-pressure | equal-weight grids — 14 works at one mass = no memory |
| **선언/매니페스토 (manifesto)** | "Say it with your chest; I'll judge the conviction" | a position they can restate — and quote | I1 repeated as refrain · I5 verdicts · I12 the author standing behind it · almost no I8 | hedging; symmetric both-sides beats dilute a manifesto |
| **보고/증거 (report/evidence)** | "Show the method and the numbers; I'll do the believing" | verifiable findings + the provenance trail | I2 is the spine · I7 method history · I5 comparisons · I8 appendix · I1 restrained | decorating evidence (aura backgrounds under data = distrust) |
| **상점/카탈로그 (shop/catalog)** | "Let me compare, decide, and not get tricked" | a confident pick + zero checkout surprises | I5 as the spine · I2 specs · I3 reviews · I4 at purchase anxieties · I11 per-item | hiding the comparison the reader came to make |
| **일지/저널 (journal/log)** | "Give me the person and the time axis" | a sense of the author's trajectory; a reason to return | I7 as the spine · I9 scenes · I8 asides · I12 implicit | retrofitting marketing beats onto a diary |

## How to use this table

1. Ask R2's question — "이 페이지는 어떤 종류의 글인가?" — and answer in
   your own words *first*. Then find the nearest row(s).
2. A hybrid names its dominant genre + modifier ("archive with a
   manifesto's opening", "tutorial that closes as persuasion") and
   states **which contract wins on conflict**.
3. Tendencies feed R3's beat derivation as *priors*, not as orders. The
   `breaks` test still decides every beat.
4. The **Typical failure** column is a pre-mortem checklist: it is the
   genre-specific slop pattern, and Step 7 validation may cite it.

## Genre → delivery notes

- **Deck genres** (강의, 보고, 선언 as slides): SCQA spine maps onto the
  Beat Map; every component must be `deck_safe` (pure CSS/HTML).
- **Reading-heavy genres** (위키, 보고, 일지): typography carries the
  hierarchy; component density lives in the *inner anatomy* (citations,
  tables, asides), not in section spectacle. The density floor is met
  with quiet structures — that is exactly what it is for.
- **Scanning genres** (아카이브, 상점): the reader's F-pattern is the
  layout law; the SIGNATURE beat is usually the *index/collection
  device itself*, not a hero.
