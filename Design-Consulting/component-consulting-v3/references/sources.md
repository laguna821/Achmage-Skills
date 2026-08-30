# Sources — provenance, pins, refresh

> Replaces v1/v2's `gallery-catalog.md`. The old file's Live-Scan
> Protocol ("shortlist from what the scan returned") was the *sourcing*
> path — that doctrine is **deleted** in v3. Sourcing is the corpus
> (`retrieval.md`); this file only records where the corpus comes from
> and how to refresh it.

## Vendored sources (code in `corpus/vendor/`)

| Source | Upstream | Pin | Items | License | Altitude |
|---|---|---|---|---|---|
| uiverse | github.com/uiverse-io/galaxy | commit `adbd2ad…` (repo frozen 2024-09-02) | 3,802 HTML | MIT (repo-wide) | atom |
| smoothui | smoothui.dev/r/registry.json → github.com/educlopez/smoothui | registry snapshot (see manifest) | 167 TSX | MIT | molecule + 34 sections |
| magicui | magicui.design/r/{name}.json → github.com/magicuidesign/magicui | registry snapshot | 77 TSX | MIT | molecule (effects) |
| tailark | github.com/tailark/blocks | commit `8139698…` | 150 blocks (radix base; dusk/mist/veil kits) | MIT | section |

Exact pins, SHA-256 digests, and per-source counts:
`corpus/index/corpus-manifest.json` (built) and the airlock's
`fetch-manifest.json` (fetch-time).

## Index-only sources (metadata + URL, no code)

From the v2 curators' library — aceternity (redistribution-restricted:
never vendor), inspira (Vue), shadcn, baseui, radix. These rows carry
license status; non-permissive/unknown ⇒ `usable: false`.

**component.gallery** is the naming authority (60-type vocabulary +
aliases in `corpus/index/aliases.json`), not a code source — it links
out to design-system docs.

## Known gaps (structural, recorded honestly)

- **I7 Chronicle** — the gallery ecosystem barely makes timeline /
  changelog components; the corpus holds only index-only rows here.
  Hand-roll or hybrid, declared explicitly (retrieval.md gap protocol).
- Verdict-stamp, Tufte margin-note, deck-safe scene transitions —
  same treatment.
- tailark's paid registry families (bento, how-it-works, blog, header,
  investors, open-roles, description-list, secondary-hero…) are NOT in
  the MIT repo — do not confuse tailark.com's catalog with the OSS pin.

## Refresh procedure (delta, not rebuild-from-scratch)

*(경로는 스킬 루트 기준 — v3.6 H8: 스크립트는 스킬 폴더 `scripts/` 에
산다. `80_Build/scripts/corpus/` 는 포워딩 스텁.)*

1. `python scripts/fetch_sources.py` — airlock only
   (never the vault), pinned commits updated deliberately in `PINS`.
2. `python scripts/build_component_corpus.py` —
   idempotent: re-extracts, re-classifies, re-merges the v2
   annotations (ATS-banned 주석 → `ats_verdict:cut` 자동 배선 포함,
   v3.5 F31), re-stamps `last_verified`, bumps counts.
3. `python scripts/scan_slop.py --write` (v3.5 —
   F31-b) — 정적 슬롭 스캔 + `slop_flags[]` 스탬프. **리빌드 후 필수**
   (빌드가 flags 를 지우므로).
4. `python scripts/verify_corpus.py --strict` — gate:
   licenses present, attribution 100%, no secrets/abs-paths, views
   consistent, usable-law holds, **annotation-enum law (규칙 9)**,
   **slop-scan presence law (규칙 10, v3.6 H5 — 3단계 생략 또는
   리빌드가 flags 를 지운 상태를 FAIL 로 문다)**.
   NO-GO on any violation.
5. Commit note: corpus_version bump + what changed (new source, new
   pin, count delta).

Rules for adding a source: permissive license verified at the repo
level (not assumed), pin recorded, LICENSE + NOTICE emitted, per-item
attribution preserved, classification rules added to
`build_component_corpus.py` (FAMILY_INTENT / type maps) — then the
verifier must PASS. Per `external-ingest-security` → "Vendored
Component Corpus Exception": fetch in airlock, nothing executed, user
approval per corpus.

## uiverse freshness note

The galaxy mirror froze 2024-09-02; uiverse.io keeps growing but blocks
scripted access. The 3,802 offline atoms remain fully valid (MIT,
attributed); genuinely new uiverse elements can only enter via a future
mirror update — check the repo occasionally, don't scrape the site.

## Coverage gap log (실전에서 확인된 소싱 우선순위 — v3.4 F17, v3.5 F32)

다음 재빌드/신규 소스 편입 시 우선 소싱 대상 (실전 3회에서 corpus gap
으로 실측된 타입):

- **I6 "Guide" 섹션 고도 실질 0 — 폼이 점유 (v3.5, F32 구체화).**
  `--intent I6 --altitude section` 17행이 **전부 auth-form(12)·contact(3)
  ·기타**다 — login/sign-up/forgot-password 폼. "번호 있는 발판을 가진
  경로"는 0행이고, I6 primary 총 67행 중 절차형 부품은 분자 고도의
  `smoothui:animated-stepper` 1개뿐. 실전 3호에서 한 페이지 안에서
  **두 번**(개념 진화 비트 + 5질문 비트) 분자→섹션 승격으로 우회해야
  했다. **절차/체크리스트/타임라인 섹션이 차기 소싱 1순위.** 중기 검토:
  I6 분리 — `I6a 절차` / `I6b 폼·온보딩` 은 비트 관점에서 다른 것이다.
- **`steps` / `timeline` / `process` 섹션 — 0건.** 커리큘럼·절차·연혁
  비트가 실전 전부에서 재조합으로 우회했다 (무기고 I7 연대기 gap, 실전
  2호 3교시 구조, 실전 3호 위 항목).
- **논증형 2-way comparator — 0건, 단 재의미화로 우회 가능 (v3.5 갱신).**
  `comparator` 4종이 전부 가격표 골격이지만, 실전 3호에서 price→판정어
  slot 재의미화로 "네 갈래 소거 + 판정" 비트를 성립시켰다 — 신규 소싱
  우선순위는 유지하되 gap 등급을 "차단"에서 "우회 가능"으로 낮춘다.
- **table 섹션이 index-only** — 코퍼스 유일 table 행(`shadcn:table-shadcn`)
  은 `code_path: None` 이라 STUB 자격이 없다. 실전 3호 대조표가 HAND-ROLL
  선언으로 처리됐다.
- index-only 79행 중 실전 수요가 확인된 것: `inspira:balance-slider`
  (대조·역전 비트 최적), `inspira:morphing-tabs`·`shadcn:tabs-shadcn`
  (절차 탭) — vendored 승격 후보.
