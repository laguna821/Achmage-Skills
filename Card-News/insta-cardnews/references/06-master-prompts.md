# 06 — Master Prompts (copy-ready)

Paste-ready blocks for the three ways this skill gets invoked. All obey the Stage-2 HARD STOP.

## Full run (plan → prompts → build)

```text
insta-cardnews로 인스타 카드뉴스를 만들자.
주제: [topic]
타깃: [audience]     목표: [goal]     톤: [tone]
카드 수: [N ≤ 20]    프리셋: [A 다크워시 / B 브랜드톤 / C 라이트에디토리얼]
시리즈명: [name]     핸들: @[handle]

Stage 1에서 카드별 메시지 테이블(card#/role/message/image-brief/filter)을 먼저 보여줘.
승인하면 Stage 2에서 카드별 세로 이미지 프롬프트를 10장 배치로 끊어서 주고 멈춰.
"HTML로 진행"이라고 하면 그때 cardnews-proof.html을 만들고 PNG로 export해.
```

## Render-only (images already exist)

```text
카드 이미지는 assets/cards/card01.png ~ cardNN.png에 이미 있어.
insta-cardnews Stage 3만 실행해:
프리셋 [A/B/C]로 cardnews-proof.html 빌드 → DOM-eval QA → export-cards.ps1로 1080×1440 PNG export.
카드별 메시지/헤드라인은 [여기에 카드별 문구 or "아래 테이블 참고"].
```

## Patch (fix specific cards)

```text
cardnews-proof.html에서 [카드 번호들]만 고쳐:
- [카드 3] 헤드라인 대비 약함 → fx-material을 fx-tone-dark로, 스크림 강화
- [카드 7] 사진 교체함(card07.png 새 파일) → 다시 바인딩만
나머지 카드는 그대로. 고친 카드만 다시 export해.
```

## GPTs / Claude system-prompt seed (if packaging as a standalone assistant)

```text
너는 인스타그램 카드뉴스(1080×1440, 3:4 세로) 제작 도구다.
원칙: 카드 1장 = 전용 사진 1장 + 가독성 필터 1개 + HTML/SVG 텍스트. "이미지는 재료, HTML은 진실."
반드시 3단계: (1) 카드별 메시지 테이블 → 승인, (2) 카드별 세로 이미지 프롬프트를 10장 배치로 emit 후 HARD STOP,
(3) 승인 후 HTML 빌드 + 1080×1440 PNG export.
불변식: 사진 위 글자는 흰색 또는 잉크(회색 금지), 액센트 1개, 채움 ≥70%, 세이프존 상하 ~135px, backdrop-filter 금지, 카드당 필터 1개.
프리셋 A 다크워시 / B 브랜드톤 / C 라이트에디토리얼 중 하나로 시리즈 전체를 통일하고, 모든 사진에 같은 LUT를 적용한다.
Stage 2에서 절대 HTML을 먼저 만들지 않는다. 사용자가 이미지를 만들어 돌아올 때까지 멈춘다.
```
