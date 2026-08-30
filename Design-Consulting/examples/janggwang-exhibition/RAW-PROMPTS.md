---
type: article
aliases:
  - "test4b RAW-PROMPTS"
description: "Codex handoff prompts for the 10 raw images of the fictional exhibition 《잔광》 — 8 artworks (content images) + 2 scene backgrounds (cover/tone). I5 skeleton compliant; build is HARD-STOPPED until all 10 pass inspection and the user says RAW OK."
author:
  - "안창현 (Achmage)"
date created: 2026-08-30
date modified: 2026-08-30
tags:
  - test-fixture
  - raw-prompts
  - skill/component-consulting-v3
---

# RAW-PROMPTS — 《잔광 殘光》 raw-01 ~ raw-10

```
사용법: 코덱스(GPT Codex)를 열어 새 세션에서 아래 프롬프트를 하나씩
복붙 → 생성된 PNG 를
60_Operational/output/test4b-virtual-exhibition/assets/raw/raw-01.png
~ raw-10.png 이름으로 저장 (번호 정확히) → 전부 모이면 저에게
"raw 들어왔어" 라고 알려주세요. 멀티모달 검수(하단 체크리스트) 후
실패분만 재생성 프롬프트를 다시 드리고, 전량 통과 시 webp 변환·최적화는
제가 실행합니다 (cwebp -q 82, 가로 1600px — 결과물은 assets/images/ 에).
검수 전량 통과 + "RAW OK" 승인 후에만 빌드가 시작됩니다.
```

> 참고: raw-01~08 은 **작품 그 자체**다 (가상 작가 한새벽의 연작 —
> 페이지에 무필터 원본으로 걸린다). raw-09·10 은 **씬 배경**이다
> (스크림 트리트먼트를 받는다 — 네거티브 스페이스 조항 포함).

---

## raw-01 《새벽 네 시의 모니터》 (작품)

A photorealistic cinematic photograph. A dark bedroom at 4 a.m., a single computer monitor glowing faintly with a blank pale desktop light, the glow spilling onto a desk edge and a wall. The room barely legible in shadow, the screen itself a soft white-blue field with no windows open. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, logos, watermarks, no legible UI elements or icons, no charts, no recognizable faces, no people.

## raw-02 《주사선 연습 I》 (작품)

A photorealistic cinematic photograph. An extreme macro close-up of a CRT screen surface: horizontal phosphor scanlines and the RGB sub-pixel triads, shallow depth of field so the lines dissolve into glow at the edges. Abstract, almost textile-like. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, logos, watermarks, no legible UI, no charts, no faces, no people.

## raw-03 《번인 Burn-in》 (작품)

A photorealistic cinematic photograph. A switched-off CRT monitor screen photographed straight on in a dim room: faint ghostly rectangular shapes burned into the dark glass, like the pale afterimage of windows that stayed open too long. The ghosts are abstract soft-edged rectangles only. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, logos, watermarks, no legible UI, no charts, no faces, no people.

## raw-04 《데드픽셀 성좌》 (작품)

A photorealistic cinematic photograph. A pitch-black LCD screen macro shot: a scattering of tiny stuck and dead pixels glowing as bright specks, arranged like a constellation across the dark panel, faint panel texture visible. Night-sky-like. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, logos, watermarks, no legible UI, no charts, no faces, no people.

## raw-05 《마지막 프레임》 (작품)

A photorealistic cinematic photograph. An old television in a dark living room at night, its screen showing abstract vertical color bars (broadcast test-pattern style, pure color fields only), the colored light washing over the surrounding darkness. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, station logos, watermarks, no legible UI, no charts, no faces, no people.

## raw-06 《전원이 나간 방》 (작품)

A photorealistic cinematic photograph. A nearly black frame: a powered-off screen in a night room, the dark glass faintly reflecting the dim shapes of the room and a distant window's glow — an image at the edge of visibility, rewarding a long look. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, logos, watermarks, no legible UI, no charts, no faces, no people.

## raw-07 《부팅의 기억》 (작품)

A photorealistic cinematic photograph. An old CRT monitor in a dim childhood study room, the dark screen crossed by a single thin horizontal band of soft light near the bottom, abstract like a slowly filling bar of glow — no interface, just the band of light on glass. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, logos, watermarks, no legible UI or icons, no progress-bar graphics with text, no charts, no faces, no people.

## raw-08 《잔광 殘光》 (작품 · 대표작)

A photorealistic cinematic photograph. The exact moment after a CRT television is switched off in a dark room: a fading phosphor bloom lingering in the center of the dark screen, a soft green-white afterglow being swallowed by the dark, slight halation on the glass. The most patient image of the series. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, logos, watermarks, no legible UI, no charts, no faces, no people.

## raw-09 무대 — 표제의 방 배경 (씬 · cover)

A photorealistic cinematic photograph. A wide shot of a dark, matte-walled gallery space at night: bare concrete-toned walls, a faint green phosphorescent glow bleeding from around a far corner, subtle floor reflections. Calm, spacious, museum-like emptiness with clear negative space in the center-left third for large display type; the composition must survive a dark overlay. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, letters, numbers, signage, logos, watermarks, no artworks visible on walls, no legible UI, no charts, no faces, no people.

## raw-10 복도 — 전환 씬 배경 (씬 · tone)

A photorealistic cinematic photograph. A dim gallery corridor in one-point perspective, mid-gray dusk light from a skylight, matte green-gray walls, empty and quiet, gentle falloff into shadow at the far end. Clear negative space in the center for a small wayfinding plate; must survive a mid-gray overlay. Natural, rich cinematic color; no dominant warm-orange cast, no purple or magenta cast. Landscape 16:9, high resolution. STRICT: no readable text, signage, letters, numbers, logos, watermarks, no artworks on walls, no legible UI, no charts, no faces, no people.

---

## 검수 체크리스트 (이미지별 10항 — 전량 통과 후 "RAW OK")

1. 판독 가능한 텍스트·글자·숫자 없음
2. 로고·워터마크·간판 없음
3. 판독 가능한 UI·차트·화면 콘텐츠 없음 (작품의 추상 광원은 허용)
4. 식별 가능한 얼굴·인물 없음
5. 자연색·컬러풀 (사전 단색 그레이딩 아님 — 씬 2장에 한해 CSS 가 톤 전담)
6. 완성 포스터처럼 보이지 않음
7. (씬 09·10) 도형 크롭·다크 필터·소형 크롭 생존 / (작품 01–08) 벤토
   셀 크롭(--crop-pos)에도 주제 생존
8. (씬 09·10) 네거티브 스페이스가 지정 위치에 실재
9. 중간 대비 — (씬) 스크림 양쪽 생존 / (작품) 캡션 플레이트와 인접해도
   눈부심 없음
10. 16:9 랜드스케이프 · 고해상도

> 실패분은 번호를 지목해 주시면 해당 프롬프트만 보정해 재발급합니다.
