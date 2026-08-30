# Design-Consulting — Component Consulting v3 + Render-Audit

AI가 만든 프론트엔드/HTML 덱이 **페이지의 메시지** · **DESIGN.md 토큰** · **distinctiveness 밴드**와 일치하도록, 실재하는 오픈소스 컴포넌트 코퍼스에서 "무엇을 살지 / 어떻게 remap 할지 / 어디에 놓을지"를 처방하는 **컨설팅 스킬**과, 빌드된 페이지의 완료 선언을 지키는 **렌더 실측 검사관**, 그리고 실전 쇼케이스 모음.

> **v3 의 두 가지 기계적 보증.**
> ① **코퍼스는 실재한다** — 4,275행 인덱스 · vendored 실코드 4,196개(uiverse 3,802 · smoothui 167 · magicui 77 · tailark 150 — 전량 MIT, 커밋 pin, 저자 귀속 100%). 후보는 결정적 retrieval 로만 나오고, 모든 STUB 은 `code_path` 에서 복사된다. 모델 기억 스텁은 결함이다.
> ② **페이지는 먼저 글이다** — 컴포넌트 이름이 나오기 전에 독자(R1) → 장르(R2) → 비트 열(R3)을 판정한다. 발단-전개-절정-결말 템플릿 금지, `breaks` 테스트를 통과 못 하는 비트는 장식이므로 삭제.

## 📦 이 카테고리의 두 스킬

### [`component-consulting-v3/`](component-consulting-v3) — 페이지를 글처럼 설계하는 컴포넌트 컨설턴트 (3.6.0)

| 레이어 | 내용 |
|---|---|
| `SKILL.md` | 거버닝 원칙(one-sentence test · one-signature + density floor · license gate) + Step 0~8 플로우 + §8 Render QA 인수인계 계약 emit |
| `corpus/` | **4,275행 인덱스 + vendored 실코드 4,196** (LICENSES/ · NOTICE 동봉, slop_flags 기계 스탬프) |
| `references/` | page-as-text(R1→R3) · genre-map · retrieval · fit-rubric(5축 gates-first) · visual-identity(키컬러 폐집합) · typography(사다리 법) · grid(폭 토큰) · image-prescription(raw-N 씬 문법) · recomposition(모션 이식 3정석) |
| `scripts/` | `corpus_query.py`(결정적 질의 / `--show` 실코드) · `verify_corpus.py --strict` · `scan_slop.py` · `build_component_corpus.py` · `fetch_sources.py` — **SKILL_DIR 자기 도출, 스탠드얼론 동작** |
| `templates/` | 처방문 스켈레톤 (비트별 의무 필드 — 공란 = NO-GO) |

v1(갤러리 live-scan)과 v2를 승계·대체한다: v1/v2 는 코드 0줄의 서지 카탈로그 위에서 "모델 기억으로" 처방했고, v3 는 실코드 코퍼스 위에서 결정적으로 처방한다.

### [`render-audit/`](render-audit) — 렌더 실측 QA 검사관 (1.0.1)

빌드된 페이지의 **렌더된 픽셀**을 실측해 완료 선언을 게이트한다 — 소스 검사가 못 잡는 결함(스크림 아래 묻힌 글자, 밝기 단조, 씬 소거)이 대상.

- **RQ1** 구조 9항 (결정적 JS 하네스 — 겹침·슬라이드 단위·밝기 3연속·에지 정렬·리크롭 배선)
- **RQ2** 픽셀 대비 (canvas 최악-픽셀 WCAG — solid 정확 계산 / scene 합성 샘플링)
- **RQ2-OBS** 씬 관측성·커버리지 회계 (질감 sd 실측 — "글자를 지키느라 이미지를 죽이는" 스크림 단조 상승을 반대편에서 무는 쌍대 게이트)
- **RQ3** 멀티모달 스크린샷 순회 (섹션×스킴 매트릭스 기록 의무 — "기록 없는 순회는 순회가 아니다")

**full(3폭×2스킴 전 계층)이 기본값**, 축소 실행은 선언식 예외로만. 출력은 HIGH/MED/LOW · evidence-not-taste · 상한 15 · Not-reviewed 정직. component-consulting-v3 의 §8 계약이 이 스킬을 자동 발동하지만, 어떤 프론트엔드 빌드에도 단독 사용 가능.

## 🖼 Showcases

### ★ 잔광 殘光 — 가상 전시 full exhibition (v3.6 풀 파이프라인, 2026-08)

[![잔광 대표작](examples/janggwang-exhibition/assets/images/raw-08.webp)](https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/janggwang-exhibition/)

**https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/janggwang-exhibition/**

완전 허구의 사진전(가상 작가 한새벽, 《잔광 — 꺼진 화면들을 위한 여덟 개의 방》)을 온라인 뷰잉룸으로. 15섹션 · **방 8개가 전부 다른 감상 장치**(exposure-slider 노출 · lens 돋보기 · 닦기 분할기 · 관측 툴팁 · 시점 탭 · 암순응 dwell · 부팅 재연 progress · power-off-slide 잔광 재연) · 복도 3D 푸시-인 · 비대칭 벤토 인덱스 월. 도록 원고 → 처방 → raw-10 이미지 생성 → 빌드 → render-audit full PASS 의 전 과정 산출물 동봉: [도록 원고](examples/janggwang-exhibition/manuscript-catalog.md) · [처방문(QA 기록 포함)](examples/janggwang-exhibition/prescription.md) · [DESIGN.md](examples/janggwang-exhibition/DESIGN.md) · [RAW-PROMPTS](examples/janggwang-exhibition/RAW-PROMPTS.md)

### ★ Educational Harness Engineering (v3.5 Mode A 풀 파이프라인, 2026-08)

[![Educational Harness Engineering](examples/educational-harness-engineering/assets/images/raw-01.webp)](https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/educational-harness-engineering/)

**https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/educational-harness-engineering/**

실원고(교육 하네스 엔지니어링 논증) 기반 Mode A 풀 파이프라인 — 원고가 source of truth 인 논증형 페이지. raw-8 씬 문법(cover/tone/wash/luma) + 코퍼스 처방 + 다크 스킴 REVISE 루프까지의 실전 기록 동봉: [처방문](examples/educational-harness-engineering/prescription.md) · [DESIGN.md](examples/educational-harness-engineering/DESIGN.md) · [하네스 프릭션 로그](examples/educational-harness-engineering/HARNESS-FRICTION-LOG.md) — 스킬이 실전에서 어떻게 자기 하네스를 고쳐 왔는지의 F25~F46 전 기록.

### v1 계보 쇼케이스 (2026-06, component-consulting v1 시절)

[골목 베이커리](https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/golmok-bakery-deck/) · [SURGE EV](https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/surge-ev/) · [Skill Landing](https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/skill-landing-ach/)

## 🚀 설치 (Installation)

```bash
# A — npx (가장 간단)
npx skills add laguna821/Achmage-Skills --skill component-consulting-v3 -a claude-code
npx skills add laguna821/Achmage-Skills --skill render-audit -a claude-code
```

```text
# B — 플러그인 마켓플레이스
/plugin marketplace add laguna821/Achmage-Skills
/plugin install component-consulting-v3@achmage-skills
/plugin install render-audit@achmage-skills
```

```bash
# C — 수동 복사
git clone https://github.com/laguna821/Achmage-Skills
cp -r Achmage-Skills/Design-Consulting/component-consulting-v3 ~/.claude/skills/component-consulting-v3
cp -r Achmage-Skills/Design-Consulting/render-audit ~/.claude/skills/render-audit
```

설치 후 **"페이지를 글처럼 설계해줘 / corpus prescription / 컴포넌트 코퍼스에서 처방"** 또는 고전 트리거("컴포넌트 추천해줘")로 로드된다. 빌드 완료 직전에는 **"렌더 검사해줘 / render QA"** 로 render-audit 이 발동한다.

코퍼스 무결성은 언제든 검증 가능:

```bash
python Design-Consulting/component-consulting-v3/scripts/verify_corpus.py --strict
```

## License

- **Skills (`component-consulting-v3/`, `render-audit/`)**: MIT
- **Corpus vendored code**: 각 소스의 MIT — `corpus/vendor/LICENSES/` (uiverse · smoothui · magicui · tailark) + per-item 저자 귀속 주석 보존
- **Repo / showcases**: Apache-2.0 (루트 `LICENSE`) · 쇼케이스 콘텐츠·이미지는 생성 픽스처 (잔광 전시는 전면 허구 — 페이지 콜로폰에 명시)
- **방법론**: 안창현 (Achmage), 2026
