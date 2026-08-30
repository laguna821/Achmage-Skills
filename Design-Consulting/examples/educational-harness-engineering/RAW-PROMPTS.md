# RAW-PROMPTS — Educational Harness Engineering (raw-01 ~ raw-08)

> **사용법**: 코덱스(GPT Codex)를 열어 새 세션에서 아래 프롬프트를 하나씩
> 복붙 → 생성된 PNG 를
> `60_Operational/output/educational-harness-engineering-web/assets/raw/raw-01.png`
> ~ `raw-08.png` 이름으로 저장 (**번호 정확히**) → 전부 모이면
> **"raw 들어왔어"** 라고 알려주세요. 멀티모달 검수(하단 10항 체크리스트)
> 후 실패분만 재생성 프롬프트를 다시 드리고, 전량 통과 시 webp 변환·
> 최적화는 제가 실행합니다 (`cwebp -q 82`, 가로 1600px — 결과물은
> `assets/images/` 에).
> **검수 전량 통과 + "RAW OK" 승인 후에만 빌드가 시작됩니다.** (I6 HARD STOP)

---

## 왜 이 8장인가 — 배정·재사용 계획 (I3)

씬 비트 12개를 **8장으로** 덮는다. 섹션마다 새 이미지가 아니라 **재사용이
설계**다 — 특히 raw-01 은 히어로(BEAT 1)와 클로징(BEAT 14)에 다시 나와
**수미상관**을 만든다.

| raw | 쓰이는 비트 | 기법 | 밝기 | `--raw-pos` (desktop / mobile) |
|---|---|---|---|---|
| **01** | BEAT 1 프레임 전환 · **BEAT 14 닫는 말 (재사용)** | `cover` / `horizon` | D / D | `center 42%` / `center 55%` |
| **02** | BEAT 3 일탈이 아니라 다수 · **BEAT 13 5가지 질문 (재사용 `wash(.12)`)** | `tone` / `wash` | D / M | `center 38%` / `center 50%` |
| **03** | BEAT 4 탐지기 반론 · **BEAT 6 하네스 개념 (재사용 `behind-image .16`)** | `wash` / `behind-image` | L / L | `center` / `center` |
| **04** | BEAT 5 세 갈래 소거 | `cut` | M | `60% center` / `center 45%` |
| **05** | **BEAT 8 — SIGNATURE** | `neon` (**페이지 유일**) | D | `center 45%` / `center 50%` |
| **06** | BEAT 9 조사방법론 실증 | `crop-shape` (**무필터 원색**) | L | `center 40%` / `center 40%` |
| **07** | BEAT 7 공격자처럼 · **BEAT 11 AI-DGD (재사용)** | `luma` / `luma` | M / L | `center` / `center` |
| **08** | BEAT 10 학생의 언어 | `card-window` | M | `center 35%` / `center 40%` |

**기법 시퀀스** (동일 기법 3연속 금지 ✓ · SIGNATURE 기법 유일 ✓):
`cover → — → tone → wash → cut → behind → luma → neon★ → crop → card-window → luma → — → wash → horizon → —`

**밝기 시퀀스** (동일 밝기 3연속 금지 ✓ · 본문 다크 밴드 3곳 = 상한 준수,
히어로 cover 무대는 산정 제외):
`D · L · D · L · M · L · M · D★ · L · M · L · L · M · D · L`

**색 지시 원칙 (I1.5 단일 하네스 법)**: 모든 프롬프트는 **자연색·풍부한
시네마틱 컬러**로 생성한다. 키컬러(teal) hex 를 프롬프트에 **넣지 않는다** —
톤 통일은 CSS 3층 트리트먼트가 전담한다. 프롬프트의 색 지시는 충돌 캐스트
금지 1줄뿐이다.

---

## raw-01 — 뚫린 시험장 (BEAT 1 cover · BEAT 14 horizon 재사용)

> 장면-은유 도출: BEAT 1 의 move = *"왜 학생이 꼼수를 쓰나"가 아니라 **"왜 이
> 평가는 그렇게 쉽게 뚫렸나"***. 방어는 존재하는데 **우회로가 이미 열려
> 있다**는 것의 물리적 형상.

```
A photorealistic cinematic photograph. A dim, empty university examination
hall shot from a low three-quarter angle: long rows of identical bare desks
receding into shadow, chairs tucked in, the room clearly prepared and
sealed for an exam. On the far left wall a single window stands open, and
one shaft of cold daylight cuts across the rows of desks at an angle,
landing on the floor. Shallow depth of field — the near desks are soft, the
lit gap is sharp. Nobody is present. Absolutely nothing written or printed
is legible anywhere.

Natural, rich cinematic color. No dominant warm-orange cast, no purple or
magenta cast.

Composition: keep the upper-left third and the lower band open and
uncluttered as negative space for headline text; the shaft of light must
read clearly through both a dark navy overlay and a light wash overlay.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

## raw-02 — 격자로 내려다본 대규모 시험장 (BEAT 3 tone · BEAT 13 wash 재사용)

> 도출: BEAT 3 의 move = **일탈이 아니라 다수**. 연세대 387명 중 211명,
> 고려대 1,400명 강의. 개인의 일탈이 아니라 **구조**임을 격자 자체가 말한다.

```
A photorealistic cinematic photograph. A very high overhead view looking
straight down onto a vast examination room: a strict rectangular grid of
hundreds of identical empty desks stretching to the edges of the frame,
each desk casting a short shadow under flat institutional lighting. The
repetition and the grid geometry are the subject. The floor markings form
faint parallel lines between rows. Nobody is present.

Natural, rich cinematic color. No dominant warm-orange cast, no purple or
magenta cast.

Composition: the grid should be slightly off-centre, leaving the right
third calmer and more open as negative space for text. The image must
survive a dark scrim overlay without becoming an unreadable black field.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

## raw-03 — 눈금이 읽히지 않는 계측기 (BEAT 4 wash · BEAT 6 behind-image 재사용)

> 도출: BEAT 4 의 move = **탐지기는 틀린다 — 그것도 만든 회사가 인정했다**.
> 계측 장비는 있는데 **판독이 안 되는** 상태. (판독 불가 조건 I1-1 과
> 은유가 일치하는 드문 경우다.)

```
A photorealistic cinematic macro photograph. An extreme close-up of an old
analogue laboratory measuring instrument: a brushed metal panel with a
round glass dial, a thin needle resting somewhere mid-scale, and two worn
knurled knobs. The glass catches a soft reflection. The tick marks and the
scale are deliberately out of focus and blurred beyond legibility — the
instrument is present but nothing on it can be read. Very shallow depth of
field, studio lighting from the upper left.

Natural, rich cinematic color. No dominant warm-orange cast, no purple or
magenta cast.

Composition: instrument occupies the lower-right diagonal; keep the
upper-left half soft and open as negative space for body text. Must remain
legible as texture under a white wash overlay at low opacity.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

## raw-04 — 세 갈래 통로, 둘은 닫힌다 (BEAT 5 cut)

> 도출: BEAT 5 의 move = **금지형 / 탐지형 / 방임형 — 소거법으로 하나만
> 남는다**. `cut` 기법의 사선 절단면과 기하가 공명한다.

```
A photorealistic cinematic photograph. A concrete institutional corridor
that forks into three passages. The left and centre passages recede into
deep shadow and are visibly blocked — one by a closed steel shutter, one by
darkness. The right passage continues and is lit by cold daylight from an
unseen opening further down. Strong directional geometry, hard architectural
lines, wet-looking polished floor reflecting the one lit passage. Nobody is
present.

Natural, rich cinematic color. No dominant warm-orange cast, no purple or
magenta cast.

Composition: the three openings sit across the lower two-thirds; leave the
upper-left area open as negative space. Strong diagonal lines are wanted —
the frame will be clipped along a diagonal.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

## raw-05 — 하네스의 실물 (BEAT 8 — SIGNATURE, neon)

> 도출: BEAT 8 의 move = **책임의 이전 — "학생들이 꼼수를 쓴다면, 교수님
> 본인께서 설계에 실패한 것입니다."** 페이지 제목의 물리적 실체(하네스 =
> 구속·지지 장비)를 정면으로 보여주는 유일한 자리. **이 기법(neon)은
> 페이지에서 여기 한 번만 쓴다.**

```
A photorealistic cinematic macro photograph. An extreme close-up of an
industrial safety harness: thick woven nylon webbing under tension, a
forged steel buckle and a load-bearing D-ring, stitched box patterns in the
strap, fine fibre texture visible. The straps pull taut across the frame in
strong diagonals — the whole image reads as load and restraint. Dark studio
background, single hard key light raking across the weave from the right so
the texture and the metal edge catch highlights. Very shallow depth of
field.

Natural, rich cinematic color. No dominant warm-orange cast, no purple or
magenta cast.

Composition: webbing crosses the frame diagonally from lower-left to
upper-right; keep the left third and the centre relatively dark and open as
negative space for a large multi-line declaration. Must survive a heavy
dark scrim with a coloured radial glow on top.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

## raw-06 — 손으로 쓴 것들 (BEAT 9 crop-shape, 무필터 원색)

> 도출: BEAT 9 의 move = **해봤다 ① — 매주 자기서사 글쓰기, 21일 챌린지,
> 대면 자필 기말**. 디지털 기기 없이 손으로 이룬 성과. **이 이미지만 필터
> 없이 원색 그대로 도형 크롭으로 쓰인다** (I1.5-3: 톤 배경 사이의 컬러
> 악센트 = 그 자체로 시각 위계).

```
A photorealistic cinematic photograph. A wooden desk surface photographed
from a steep overhead angle, covered with a loose stack of handwritten
paper notebooks — pages open, corners curled, several sheets overlapping.
A worn pencil and a plain eraser rest beside them. Warm afternoon window
light falls across the paper from the left, raking the grain of the sheets
and casting soft shadows between the pages. The handwriting is rendered
only as rhythmic ink strokes and is completely illegible at this depth of
field. No hands, no people.

Natural, rich cinematic color — the paper whites, wood browns and graphite
greys should all be present and saturated. No dominant warm-orange cast, no
purple or magenta cast.

Composition: fills the frame edge to edge; this image will be cropped into
a circle and an arch shape, so the visual interest must survive an
aggressive centre crop. No single strong subject at the extreme edges.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

## raw-07 — 분해된 자물쇠 (BEAT 7 luma · BEAT 11 luma 재사용)

> 도출: BEAT 7 의 move = **"공격자처럼 생각하라"** (Schneier) + Dawson 이
> 자기 시험을 직접 해킹해 **5개 공격 중 4개가 작동**함을 보인 연구. 침투
> 테스터의 시선을 물체로 옮긴 것. `luma` 로 색이 제거되고 질감만 남는다.

```
A photorealistic cinematic macro photograph. A disassembled pin-tumbler
lock cylinder laid open on a dark matte workbench: the brass plug, the
scattered driver pins and springs arranged in a row, the shear line
visible, a slim tension wrench and a pick resting alongside. Cold, precise
top-down studio lighting; the machined metal surfaces show fine tooling
marks and micro-scratches. Very shallow depth of field so only the pin row
is sharp.

Natural, rich cinematic color. No dominant warm-orange cast, no purple or
magenta cast.

Composition: the disassembled parts run along the lower third in a
horizontal line; keep the upper half open and quiet as negative space. The
image will be desaturated to luminosity only, so it must read entirely
through texture and tonal contrast rather than through colour.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

## raw-08 — 창가의 공책 (BEAT 10 card-window)

> 도출: BEAT 10 의 move = **학생의 언어로 확인되는 변화** — "간파당한
> 느낌", "'굉장히'를 지웠다". 저자의 자기 보고가 아니라 학생 쪽 자리.
> 카드 내부 소형 크롭(`--card-img`)으로 4장의 인용 카드 헤더에 재등장한다.

```
A photorealistic cinematic photograph. A single open notebook lying on a
window-side desk in a quiet study room, seen from a low oblique angle. Soft
morning light comes through the window behind it, backlighting the page
edges so the paper glows slightly at the top edge. The page carries dense
handwriting rendered purely as soft rhythmic marks, entirely unreadable due
to the angle and the shallow focus. A plain ceramic cup sits out of focus
in the background. The chair is empty; nobody is present.

Natural, rich cinematic color. No dominant warm-orange cast, no purple or
magenta cast.

Composition: the notebook sits in the left half; the window light and the
empty right third form calm negative space. This image will be cropped into
small fixed-ratio card windows, so the notebook and the light gradient must
both survive a tight crop.

Landscape 16:9, high resolution.

STRICT: no readable text, no letters, no numbers, no logos, no watermarks,
no legible UI or screens, no charts, no recognizable faces, no people, no
lens flare, no glowing particles.
```

---

## 검수 체크리스트 (I1 재료성 10조건 · 이미지별 10/10 필수)

멀티모달로 **실제 파일을 열어** 채점합니다 — 파일명만 보고 통과시키지
않습니다. 실패분은 번호를 지목해 재생성 프롬프트를 드립니다.

**검수 실행 2026-08-29 — 멀티모달, 실제 파일 8장 전량 열람. 결과 8/8 PASS (10/10).**

| # | 조건 | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 판독 가능한 텍스트·글자·숫자 **없음** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2 | 로고·워터마크 **없음** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3 | UI·차트·화면 콘텐츠 **없음** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 4 | 식별 가능한 얼굴 **없음** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 5 | 자연색·컬러풀 (브랜드 사전 그레이딩 **안 됨**) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓✓ | ✓ | ✓ |
| 6 | 완성 포스터처럼 보이지 **않음** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 7 | 도형 크롭·다크 필터·소형 크롭에도 **생존** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 8 | 텍스트용 **네거티브 스페이스가 지정 위치에** | ✓ | ✓ | ✓ | ✓ | ✓✓ | ✓ | ✓ | ✓ |
| 9 | 중간 대비 — 화이트 wash·다크 tone **양쪽 생존** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 10 | 16:9 랜드스케이프 (세로 원본 **아님**) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**특별 주의 항목의 실제 판정**

- **raw-03** (최대 위험) — 다이얼 눈금·숫자가 **완전히 흐려져 판독 불가**.
  계기는 존재하는데 읽히지 않는다 = 비트 4 의 은유와 조건 1 이 동시에 충족.
- **raw-06 / raw-08** — 손글씨가 리듬 있는 잉크 자국으로만 렌더됨, 자형 0.
  판독 불가 ✓
- **raw-05 (SIGNATURE)** — **좌측 1/3 + 중앙이 실제로 어둡고 비어 있다.**
  5줄 선언이 앉을 자리가 확보됐고, 웨빙이 좌하→우상 대각으로 흐른다 (✓✓).
- **raw-06** — 세트에서 **가장 채도가 높다**(원목 갈색 · 크림 지면 · 청회색
  잉크 · 황동 연필). 유일한 무필터 원색 크롭 용도에 정확히 맞다 (✓✓).
- **raw-07** — 요청한 텐션 렌치·픽은 미생성. **조건 위반 아님**(분해된 실린더
  + 핀 열만으로 은유가 성립하고, `luma` 로 색이 제거되므로 영향 없음).

**webp 변환 완료** (`assets/images/`, Pillow 12.1.0 · q82 · 1600px):

```
14.61 MB (PNG 8장) → 0.63 MB (webp 8장)   예산 3.00 MB 대비 21%
raw-01 56KB · 02 100KB · 03 57KB · 04 50KB · 05 108KB · 06 128KB · 07 80KB · 08 69KB
```

**특별 주의 항목**

- **raw-03** — 계측기 눈금이 *읽히면* 조건 1 위반입니다. 흐릿해야 통과합니다.
- **raw-06 / raw-08** — 손글씨가 조금이라도 판독되면 조건 1 위반입니다.
- **raw-05 (SIGNATURE)** — 좌측/중앙이 어둡고 비어 있어야 5줄 선언이 앉습니다.
  웨빙이 프레임을 꽉 채우면 조건 8 위반으로 재생성합니다.
- **raw-06** — 유일하게 **필터 없이 원색**으로 쓰이므로 색이 죽으면 안 됩니다.
- 전량 통과 후 제가 webp 변환(`cwebp -q 82`, 1600px)합니다. **총 예산 ≤3MB**.

---

## HARD STOP (I6)

**전량 10/10 통과 + 사용자 "RAW OK" 승인 전에는 빌드를 시작하지 않습니다.**
raw 대기 중에도 Step 4(스코어링) · Step 5(배치) · Step 6(재조합) 처방은
계속 진행합니다 — 막히는 것은 **빌드뿐**입니다.
