# Retrieval — deterministic corpus access

> The sourcing contract of v3: **every candidate comes from the corpus,
> by query — never from live scan, never from model memory.** If the
> corpus lacks something, that is a recorded gap (→ `sources.md`
> refresh), not permission to invent.

## The corpus at a glance

```
corpus/index/components.jsonl      ← 1 row = 1 component (full metadata)
corpus/index/views/by-intent/     i01..i12.jsonl   — intent-classified pool (full rows)
corpus/index/views/by-type/       {type}.jsonl     — compact projections
corpus/index/views/by-altitude/   atom|molecule|section.jsonl
corpus/index/views/deck-safe.jsonl
corpus/index/aliases.json          ← canonical vocabulary + synonyms
corpus/index/corpus-manifest.json  ← version, pins, counts
corpus/vendor/…                    ← the actual code (+ LICENSES/)
```

Row schema (the important fields): `id · name · source · source_url ·
author · license · code_path · vendored · framework · deck_safe ·
canonical_type · altitude (atom|molecule|section) · intent{primary,
secondary} · layout_affordances · motion_profile · slot_anatomy ·
preserve_signature · reskin_cost · style_tags · watch_out · ats_verdict
· mcgl_move · usable · legacy_series · last_verified · corpus_version`.

Korean annotation fields (`preserve_signature`, `reskin_cost`,
`watch_out`) are the v2 curators' hand-written knowledge — read them;
they are the fit-reasoning head start.

## The query tool

```bash
python scripts/corpus_query.py --intent I3 --altitude section --limit 8
python scripts/corpus_query.py --type button --tags neumorphism,minimalist
python scripts/corpus_query.py --type hero --source tailark --fields id,name,code_path
python scripts/corpus_query.py --show "smoothui:pricing-1"     # print real code
python scripts/corpus_query.py --extract "uiverse:Buttons/…" --out btn.html
python scripts/corpus_query.py --stats
```

*(경로는 스킬 루트 기준 — v3.6 H8 이식성: 스크립트가 스킬 폴더 안에
산다. vault 루트에서는 `20_Master-Skills/component-consulting-v3/scripts/…`
또는 구 경로 `80_Build/scripts/corpus/…` 포워딩 스텁 둘 다 동작.)*

- Filters AND together; `--tags` is ANY-match; `--type` accepts aliases
  (resolved via `aliases.json`: navbar→header, loader→spinner, …).
- `--deck-safe` restricts to pure CSS/HTML rows (view:
  `corpus/index/views/deck-safe.jsonl`) — **mandatory for deck
  delivery** (SKILL §2 Step 3); React components are never deck-safe.
  (v3.4 문서화 — 그간 SKILL 에만 있던 플래그.)
- `usable: false` rows (non-permissive license, `ats_verdict: cut`) are
  hidden by default. `--include-unusable` shows them ⛔-marked — for
  *negative knowledge* only (why a thing was cut), never to prescribe.
- **`slop_flags` (v3.5 — F31-b)**: `scan_slop.py` 가 vendored 코드를 정적
  스캔해 스탬프한다. **BAN 급**(`gradient-text` — Step 7 BAN 2 ·
  `auto-advance` — 콘텐츠 타입의 자동 전환 캐러셀)은 기본 숨김,
  `--include-slop` 로 열람(🚫). **WARN 급**(`auto-cycle`·`clip-text`·
  `initial-hidden`)은 표시되되 ⚠ 마커 — 처방 가능하지만 이식 시 해당
  함정을 처리해야 한다(`initial-hidden` → recomposition 모션 이식 3정석).
  동인 실측: v3.4 까지 Step 7 슬롭 밴 목록이 코퍼스 어느 필드에도
  인코딩돼 있지 않아, 자동 전환 캐러셀(`smoothui:testimonials-1`)이
  세 필드 전부 침묵한 채 후보로 나왔다 — 코드를 열어 `setTimeout` 을
  눈으로 본 것이 유일한 방어였다. **주석은 게이트가 아니다 — 게이트는
  enum 이다** (annotation-enum 일관성은 `verify_corpus.py` 규칙 9).
- No Python available? The views are plain JSONL — `grep` works:
  `grep '"canonical_type": "faq"' corpus/index/views/by-intent/i04.jsonl`.

## The standard pull, per beat

1. **Section first.** `--intent I{n} --altitude section` → shortlist
   2–4. Read each candidate's `preserve_signature` + `watch_out`.
   **목록 단계에서 `--fields` 에 `code_path` 를 포함하라 (v3.4 — F17)**:
   `code_path = None` 인 행은 **index-only**(vendored 아님)라 STUB 을 못
   달고 처방 자격이 없다 — `--show` 까지 가서야 아는 것은 후보 선별
   낭비다 (실측: SIGNATURE 최적 후보가 index-only 라 shortlist 를 다시
   돌렸다). 79 개 index-only 행이 존재한다.
2. **Inner anatomy second.** The chosen section's `slot_anatomy` names
   its sub-parts; fill or upgrade them with molecules
   (`--altitude molecule --type {part}`) and atoms
   (`--type button --tags {style-direction}` — 3,802 uiverse atoms are
   searchable by style: neumorphism, brutalist, glassmorphism, retro,
   minimalist, gradient, hover…).
3. **Style-tag discipline.** Pull atoms whose `style_tags` agree with
   the DESIGN.md posture (a borders-only editorial system does not pull
   `glassmorphism` atoms; a brutalist page does not pull soft-shadow
   cards). Tags are the corpus-side face of the token constraints.
4. **Read the code before recommending.** `--show {id}` — the STUB in
   the prescription is copied (then token-remapped) from this output.
   Recommending a component whose code you did not open is forbidden.

## Altitude law

- **Sections carry intent.** Beats bind to sections (or to a composed
  group of molecules acting as a section — state that explicitly).
- **Atoms carry style, not intent.** A button is not "persuasion"; it
  becomes persuasive by where the section puts it. Never satisfy a beat
  with a bare atom; never justify an atom by intent vocabulary.
- **Molecules go both ways** — v2-classified molecules carry inherited
  intent (their curators' judgment); use it as a hint, not as a beat
  filler on its own.

## Gap protocol (when the corpus genuinely lacks it)

1. Check aliases (`aliases.json`) — most "missing" types are naming
   misses (jumbotron→hero, ticker→marquee).
2. Check index-only rows (`--include-unusable` + aceternity/shadcn/
   inspira sources) — the type may exist as a URL-only reference with
   its license status recorded.
3. If truly absent (known thin spots: **I7 timeline/changelog**,
   verdict-stamp, Tufte margin-note): compose a **hybrid** from two
   corpus parents (recomposition.md move 4) or declare a **hand-roll**
   explicitly in the prescription (`HAND-ROLL: reason + nearest corpus
   neighbors consulted`). A silent hand-roll that pretends to be a
   corpus pull is a Step 7 failure.
4. Record the gap in the prescription's Assembly notes — gaps feed the
   next corpus refresh (`sources.md`).

## Delta-check (the only live-web use)

When web tools are available AND the manifest's pins are old, you may
check a gallery's newest additions **for the signature beat only**. A
find enters the prescription as `candidate (unvendored, URL-only,
license-checked)` — it cannot carry a STUB until the next corpus
rebuild vendors it. Delta-checking is never required and never blocks.
