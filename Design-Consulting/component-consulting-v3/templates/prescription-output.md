# Prescription Output — v3 skeleton

Emit sections in this order. Nothing optional except where marked.

---

## 1. Consulting Brief

```
THESIS:    <one sentence>
READER:    <who / arrival / posture / attention budget>
GENRE:     <kind of text + experience debt>
GROUNDING: <RICH | THIN | EMPTY>
TOKENS:    <path>
DELIVER:   <live frontend | HTML-slide deck>  ·  HOUSE SYSTEM: <none | name (skin-gate)>
CORPUS:    <corpus_version>
```

## 2. Page-as-Text verdict

- **Reader (R1):** 2-line compression of the reading posture.
- **Genre & experience debt (R2):** "When this reader closes the tab,
  they should now ___."
- **Reading contract (R3a):** first-screen promise → payoff beat.

## 3. Beat Map

| # | Beat | Move (breaks-test summary) | Intent | Mass | raw # | 씬 기법 | SIGNATURE? |
|---|------|---------------------------|--------|------|-------|---------|------------|

*(씬 없는 비트는 raw/기법 칸에 `—`. 테이블 아래 한 줄로 기법 시퀀스
명기: `cover→wash→blend→…` — 동일 기법 3연속 금지.)*

*(Exactly one SIGNATURE row. Every beat's `breaks` field must be
non-trivial — a beat nothing depends on does not ship.)*

## 4. Token Constraint Card

- Accent (owns the 10%): `{colors.…}`
- Type roles: display / body / mono / label → tokens
- Radius vocabulary · spacing unit · elevation posture (borders vs
  shadows) · `components:` block entries that pre-decide
- **Do not invent values.**

## 5. Per-Beat Recommendations *(the core — one block per beat)*

```
### BEAT {n} — {name}   [{intent} · {mass tier} · {SIGNATURE|quiet}]

MOVE:        {what this moment does to the reader}
RECOMMENDED: {name} — corpus id `{id}` ({source}, {altitude})
WHY:         "Because the page's thesis is X and this beat must do Y for
             reader R, this component earns its place."  ← filled in
INNER ANATOMY (sections): {slot_anatomy parts} → filled with:
             {molecule/atom corpus ids per part}
TOKEN MAPPING: {css prop → {token} …}   (zero orphan literals)
PLACEMENT MASS: {tier} · recomposition applied: {teardown / re-size /
             hybrid: {id-a} × {id-b} / "structure kept, skin remapped"}
PRESERVE:    {preserve_signature — the observable trait that must survive}
DATA ATTRS:  data-gallery="{source}:{name}" data-component="{canonical_type}"
REJECTED DEFAULT: {the average-AI pick for this beat} — {why rejected}
STATES (if interactive): hover / focus / active / disabled / empty /
             loading / error — each answered
MOBILE:      {degradation story — no story → downgrade}
BACKEND:     {server-render / real-data honesty note}
LICENSE:     {license} · AUTHOR: {author} · SOURCE: {source_url}
STUB:        ↓ copied from {code_path}, token-remapped (NEVER invented)
```

```{language}
{the real code, remapped to tokens}
```

## 5.5 RAW-PROMPTS emit (씬이 있는 페이지 필수)

`RAW-PROMPTS.md` 를 별도 파일로 emit: 코덱스 핸드오프 안내문(복붙 사용법
+ 저장 경로 + "RAW OK" 게이트 고지) + raw 별 프롬프트(골격 6요소 — 장면
은유는 해당 비트의 move 에서, color grade 는 DESIGN.md 키 폐집합에서) +
검수 10항 체크리스트. **HARD STOP: 전량 통과 + "RAW OK" 전 빌드 금지.**

## 6. Assembly Plan

- **Rhythm map:** the mass-tier sequence down the page (never 3
  consecutive sections at one tier; dense/airy alternation).
- **Signature placement:** where attention peaks per the reading
  simulation, and what quiets around it.
- **Density accounting (blocking):**

| Metric | Floor | This page | Evidence |
|---|---|---|---|
| Recognizable gallery signatures | ≥ 6 | {n} | {ids} |
| Distinct form factors | ≥ 10 | {n} | {types} |
| Interaction layers | ≥ 3 | {n} | {hover / scroll / click} |

- **Corpus gaps hit** (if any): {gap → hybrid/hand-roll declaration}.

## 7. Coherence Verdict

One paragraph: does the assembled page pay the reading contract and
service the experience debt? Residual risks? **PASS / REVISE.**

## 8. Render QA 인수인계 계약 *(HARD — RAW OK 급, v3.6)*

빌드 세션은 이 계약의 이행 없이 완료를 선언할 수 없다. 검사관 파라미터
동봉은 처방자의 의무다 (미동봉 시 검사관이 CSS 에서 재구성하지만, 표
비동기(F39)의 뿌리가 그 공백이다).

```
AUDITOR:      render-audit — full 기본값 (3폭 × 2스킴, RQ1/RQ2/RQ2-OBS/
              RQ3 전 계층). fast 는 render-audit 의 선언식 예외로만
              (근거 + 생략 조합 열거 + 잔여 리스크 1줄).
BLOCKING:     빌드 완료 선언 전 render-audit full PASS 를 이 처방문
              § Render QA 로 append (섹션×스킴 매트릭스·관측성 표 포함).
SCRIM:        {씬 클래스별 c / a / op / mul / blur 표 — CSS 를 수리하면
              이 표를 같이 갱신}
WIDTH_TOKENS: {DECLARED_WIDTH_TOKENS 값 + 폭 토큰 이름들 (G1)}
SCENES:       {--raw-pos-m 선언 수 = 씬 테이블 행 수 (RQ1-9 대조용)}
RQ2-OBS:      {적용 | exempt: 순수 문서형 (R2 근거 1줄)}
```

---

**Build these next?** *(the consultant stops here — the build is a
separate, explicit step; 빌드의 완료는 §8 계약이 정의한다)*
