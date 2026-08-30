# Page-as-Text — the semantic layer (R1 → R2 → R3)

> **Source doctrine (안창현, 2026-08-28, verbatim):**
> "웹사이트 1개 html 로딩된 전체 내용이 하나의 북/글 챕터라면, 이 북/글
> 챕터/텍스트/칼럼 등은 어떤 식으로 구성해야 타겟 독자를 상대로 **'읽히는
> 글'**이 될것인가를 **semantic하게** 생각해야 되. 발단-전개-절정-결말은
> 하나의 예시일 뿐이야. 이건 오히려 deterministic하게 하면 안 되고 —
> 1) 타겟 독자(프론트 페이지를 '보는(읽는)' 사람)가 누구인가
> 2) 그 독자가 얻어야 할 경험이 무엇인가 내지는 글의 장르가 무엇인가
>    (이 프론트페이지 목적이 뭐냐 — 광고냐 위키냐 아카이브냐 등등)
> 3) 이에 맞춰 '글' 전체를 어떻게 구성하고 각 부분을 '집필'해야 하는가"

**What this file is NOT.** It is not an arc template. There is no
발단-전개-절정-결말 checklist here, no fixed section order, no "every
landing page needs hero → features → social proof → CTA" recipe. That
recipe *is* the average-AI floor. The three judgments below must be made
fresh for every page, and the judgments themselves are the deliverable —
they are what the component prescription is later audited against.

**What this file enforces.** Three ordered judgments (R1 → R2 → R3), a
material gate (RICH/THIN/EMPTY), and an output artifact (the Beat Map).
A prescription produced without a Beat Map is invalid.

---

## Gate 0 — Material (소재) — before any judgment

The design-side twin of ach-writing-system-v7's P0 Grounding: **내용이
없으면 페이지도 없다.** Establish what actual content exists:

- **Mode A — manuscript exists** (MD file, real page copy, a document).
  The manuscript is the **source of truth**. Parse it; R3's beats will
  largely be *discovered in* the text, not invented over it.
  **원고가 복수면 (v3.5 — F27): 정본을 선언**하고, 보조 원고와의 차이를
  **보강 / 모순 / 별개조사** 3종으로 분류해 소재 분류표에 기재한다 —
  (a) 보조가 분모·출처를 더하면 보강으로 흡수 (b) 다른 사실을 주장하면
  정본 채택 + 1차 출처로 판정 (c) 서로 다른 조사로 판명되면 둘 다
  살리되 페이지에는 **정본 계열 하나만** 싣는다. 실측: 이 분류가 없었으면
  HEPI 두 연도 계열(66→92→95 vs 53→88)이 같은 페이지에 섞였을 것이고,
  보조 원고의 연도 표기 오류(URL 이 반증)도 그대로 실렸을 것이다 —
  두 계열 혼재가 곧 수치 오염이다.
- **Mode B — no manuscript** (v3.4 operationalized — 초판은 이 모드가
  한 문장뿐이었고, 제로베이스 테스트 F2·F3·F11 이 동인):
  - **B1 — 저자 볼트가 존재**: 아래 인터뷰 프로토콜과 **볼트 retrieval 을
    병렬로** 돌린다 (v7 P0 G1 의 계층 승계: persona/증류층 → 지식그래프 →
    세션 기록 → 1차 소스 노트). 인터뷰만 하면 저자 기억에 떠오른 것만
    소재가 된다 — retrieval 은 인터뷰가 못 꺼내는 실수치·장면을 회수하고,
    인터뷰는 retrieval 이 모르는 현재 사실(가격·일정·경계)을 확정한다.
    **탐색 지형을 먼저 선언한다**: 증류층(OS 볼트)과 1차 소스(PKM 볼트)를
    구분하고 양쪽을 뒤진다 — 이 저자의 소재 지형은 2-볼트다 (실측: 실수치
    ·장면의 본체는 형제 볼트에 있었다).
  - **B2 — 볼트 없음** (외부/제3자 프로젝트): 인터뷰만. RICH 도달이
    구조적으로 어렵다 — THIN 상한을 정직하게 받아들일 준비를 하고 시작.
  - If the user wants the text authored properly, hand off to
    `ach-writing-system-v7` and resume when a draft exists.

### Mode B 인터뷰 프로토콜 — 게이트에서 질문을 역산한다

질문 시트는 고정 설문이 아니라 **하류 게이트의 역산**이다: 각 질문은
어느 게이트를 먹이는지 명시하고, 게이트가 채워지면 멈춘다 (Step 0 의
≤5 상한과 정합 — 실증: 4문항으로 전 게이트 충족).

| 하류 게이트 (왜 묻나) | 질문 (무엇을 묻나) |
|---|---|
| **RICH 판정** (수치·장면/유물·스탠스) | "이 페이지에 실제로 쓸 수 있는 소재가 무엇인가 — 실수치·실물 유물·구체 장면·검증 이력" (복수 선택; **없는 것을 고르면 안 된다고 명시**) |
| **R1 arrival** | "독자가 누구이며 어디서 이 페이지에 당도하나" |
| **R2 경험 부채** | "닫을 때 독자가 무엇을 할 수 있게 되나" |
| **fit-rubric C2** (backend honesty) | "CTA 는 실제로 어떻게 작동하나 (폼/메일/미정)" |
| 어조·금지 (선택) | "쓰면 안 되는 표현·과장이 있나" |

중지 조건: RICH 3요소 + arrival + 부채 + CTA 실체가 채워지면 인터뷰
종료. 더 묻는 것은 인터뷰가 아니라 지연이다.

### 소재 분류표 — provenance × 시제 (Mode B 의무 산출, Mode A 권장)

Gate 0 는 "소재가 있는가"만 물으면 부족하다 — **소재가 서술하는 대상이
페이지가 파는 대상과 다를 수 있다** (실측: 볼트의 무료·비공식 모임 기록
vs 판매 대상인 유료 공개 워크숍). 수집한 소재를 4열로 분류해 emit 한다:

| 열 | 정의 | 사용 규칙 |
|---|---|---|
| **① 현재 주장-대상 사실** | **페이지가 지금 단언하는 대상**에 대해 참인 것 — 파는 것이 있으면 그것(가격·형식·경계), 없으면 단언 대상 자체(방법론·프로젝트·인물의 현재 정의·절차·조건) (v3.5 — F25: 초판의 "상품" 표현은 판매 페이지 지형의 잔재였고, 비상업 논증 페이지에서 정의되지 않았다) | 페이지가 단언할 수 있는 유일한 조건. 미확정이면 **플레이스홀더로 가시화** — 발명 금지 |
| **② 저자/제3자 이력** | 실적이되 *주장 대상 일반*의 실적이 아닌 것 — 저자 1인의 실행 실적 포함 | I12(에토스)에 격리. I2(대상 근거)로 세탁 금지 — 설득 장르에서 블로킹. 정직한 서술은 주어를 단다: "이 방법론을 쓰면 90%" ❌ → "저자의 2026-1 수업에서 90%" ✓ |
| **③ 논증 재료** | 시제 중립의 진단·스탠스·장면 | 비트의 move 재료로 자유 사용 |
| **④ 사용 금지 (default-deny)** | 과거 조건(현행처럼 읽힐 것)·실행 기록 없는 계획·제3자 귀속물·동의 없는 실명 | `fabricated_experience` 의 사전 차단 목록 — 빌드까지 전파. **저자의 명시 승인 시 ③으로 승격**하되 승인 사실·조건(익명 유지, 범위 등)을 표에 기재한다. 단 **검증 미완(⚠️ 원문 대조 미완 등) 항목은 승인으로 풀리지 않는다** — 승인은 *귀속*을 풀 수 있어도 *검증*을 풀지 못한다 (v3.5 — F28). 지면 변경(폐쇄 배포 → 공개 웹)은 승인 범위 안에서도 재량 축소의 근거다 |

**Verdict:**

| Verdict | Test | Consequence |
|---|---|---|
| **RICH** | ≥1 concrete scene/artifact + ≥1 real number/fact + a stated stance | Full page allowed. |
| **THIN** | Stance only — no scenes, no numbers | Page capped: a short, honest page (no fabricated proof sections — a stats band with invented numbers is `fabricated_experience` for frontends). |
| **EMPTY** | No stance, no material — "just make it look good" | **Refuse to design.** Recommend material-gathering or the writing hand-off. 소재 없으면 설계하지 않는다. |

*Provenance 주석: RICH 는 소재의 **존재** 판정이지 **사용권** 판정이
아니다 — 분류표 ②는 RICH 를 만들 수 있지만 상품 실적 비트를 만들 수는
없다. "수치가 있다"와 "이 수치를 이 비트에 쓸 수 있다"는 다른 질문이다.*

---

## R1 — The Reader (독자)

Not a marketing persona. A **reading posture**. Answer in one line each:

1. **Arrival** — where does this reader come from (search result, a link
   from a colleague, a QR on a slide, a bookmark, cold ad)? What do they
   already believe when they land?
2. **State** — hurried or settled? On a phone in transit or a desktop at
   work? First visit or returning?
3. **Attention budget** — realistically, how many seconds before they
   decide to stay? (This prices the opening beat.)
4. **Prior knowledge** — what vocabulary can be assumed; what must be
   taught; what would insult them if over-explained?
5. **Stopping risk** — what specifically would make *this* reader leave
   (jargon? wall of text? obvious template smell? a paywall vibe?).

*Write the reader as one paragraph, not bullet fragments — you are about
to compose a text for them; know them as a reader, not a demographic.*

## R2 — Genre & the owed experience (장르와 경험)

Ask: **"이 페이지는 어떤 종류의 글인가?"** — judged, not picked from a
list. `genre-map.md` provides a *starting* vocabulary (advertisement /
persuasion · wiki / reference · archive / index · lecture / tutorial ·
portfolio / exhibition · manifesto · report / evidence · shop / catalog
· journal / log) with each genre's reading contract and intent
tendencies — but hybrids and new genres are normal; name them.

Then the second half, which templates always skip: **what must the
reader leave with?** Complete this sentence honestly:

> "When this reader closes the tab, they should now ______ (know /
> believe / feel / be able to do) ______."

That sentence is the page's **experience debt**. Every beat in R3 either
services this debt or is decoration.

## R3 — Composition & authorship (구성과 집필)

From R1 × R2, compose the page as a text:

### 3a. The reading contract (읽기 계약)

One sentence: **what does the first screen promise, and where does the
page pay it off?** A page that promises nothing gets skimmed; a page
that promises and never pays is a scam. Name the promise and the payoff
beat explicitly.

### 3b. The Beat sequence (비트 열)

Derive the sequence of message moments **from the material and the
reader** — not from a structure catalog. For each beat write four
fields:

```
BEAT n: <name>
  move:    <what this moment does to the reader — assert / ground / preempt an
            objection / show a scene / compare / let someone else speak /
            change chapter / close>
  why-here: <why this position in the reading order — what the reader knows
             by now, what they doubt by now>
  gain:    <what the reader has after this beat that they lacked before>
  breaks:  <what collapses if this beat is removed — if nothing, delete it>
```

**The `breaks` test is the anti-slop mechanism.** A beat that survives
deletion without damage is decoration; cut it. (This is the page-level
form of the one-sentence test.)

Sequencing heuristics — *heuristics, not a template*:

- Beats follow the **reader's evolving state**: what they believe after
  beat n determines what beat n+1 must do. Write the sequence by
  simulating the read, not by stacking sections.
- Questions the reader is silently asking are beats (반론 선처리) — put
  them where the question actually arises, not in a FAQ ghetto at the
  bottom by default.
- Genres imply *tendencies*, never orders: a wiki front-loads
  orientation; a manifesto front-loads the claim; an archive
  front-loads the index; a tutorial front-loads the promised outcome.
  See `genre-map.md`.
- The number of beats is a judgment. Five is legitimate. Fourteen is
  legitimate. "The template has nine sections" is not a reason.

### 3c. Intent + mass per beat

Map each beat to its rhetorical intent (**I1–I12** — the corpus's
retrieval key) and give it a **mass budget** (full-bleed / wide /
content / satellite) proportional to its weight in the *argument*, not
its visual appeal:

| Intent | The beat is… |
|---|---|
| I1 Proclaim | the thesis said with mass |
| I2 Ground | unfakeable evidence (number + unit + source) |
| I3 Testify | someone else's framed voice |
| I4 Dialogize | a question answered where it arises |
| I5 Compare & Verdict | side-by-side plus a pick |
| I6 Guide | a path with numbered footholds |
| I7 Chronicle | an accounted history |
| I8 Aside | optional depth, collapsed by default |
| I9 Summon | a scene before the product |
| I10 Transition | a chapter change with wayfinding |
| I11 Close & Call | the final utterance + one action |
| I12 Ethos | the author's standing (people, track record, artifacts) |

Exactly **one** beat is tagged SIGNATURE (where the text's attention
peaks — R3 decides from the reading simulation, not from "hero goes on
top"). Everything else is quiet.

### 3d. Density budget

The page must satisfy the density floor (≥6 recognizable gallery
signatures · ≥10 distinct form factors · ≥3 interaction layers) —
distribute this across beats now, so the floor is met by composition
rather than by last-minute decoration. A 5-beat page can meet the floor
through inner anatomy (a section beat contains molecules and atoms);
density never justifies adding beats that fail the `breaks` test.

---

## Output artifact — the Beat Map

```
READER:   <R1 paragraph, compressed to 2 lines>
GENRE:    <R2 name + experience debt sentence>
CONTRACT: <3a promise → payoff beat>

| # | Beat | Move (breaks-test summary) | Intent | Mass | SIGNATURE? |
|---|------|----------------------------|--------|------|------------|
```

Hand the Beat Map to the user for a nod before sourcing components
(the 기획안-먼저 gate). Then proceed to retrieval (`retrieval.md`).

**재진입 규칙 (v3.4, v3.5 확장 — nod 이후 무언가 바뀌면):** 주장-대상
사실(가격·형식·경계·기간 등)이 nod 이후 확정·변경되는 일은 정상이다
(실측: nod 직후 후속 질문에서 4개 조건이 바뀜). **사실 변경뿐 아니라
소싱이 유발한 질량·부품 변경에도 같은 기준을 적용한다** (v3.5 — F34:
실측에서 사실은 하나도 안 변했는데 코퍼스 사정 — gap·다양성 가드·밴
패턴 — 으로 비트 4개의 tier/부품이 바뀌었고, 규칙이 "사실"만 말해서
실행자가 기록 의무 밖이라 판단할 뻔했다). 판단 기준은 **비트 구조**다 —
구조 불변이면 비트 내용만 갱신하고 처방문에 **개정 각주 + Beat Map
확정판 표**(nod 시점 대비 변경이 보이게)를 남긴다; 비트가 생기거나
죽거나 SIGNATURE 가 이동하면 Beat Map **재승인**. 어느 쪽이든 소재
분류표(①현재 주장-대상 사실)를 먼저 갱신하고 비트로 전파한다.

## Cross-system note

For ACH-house projects, beats additionally map to `mcgl_move` values
(ach-writing-system-v7's move canon) — that crosswalk is owned by
`achmage-frontend-design-system-v2`, not here. This file stays generic:
any author, any project, any genre.
