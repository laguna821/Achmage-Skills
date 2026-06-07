# Achmage-Skills

안창현 (Achmage) 의 Claude 스킬 모음.

## 📦 수록 스킬

### [`Image-HTML/raw-5-html`](Image-HTML/raw-5-html) — Raw5 이미지 임베드 HTML 덱
이미지를 **배경 재료**로만 쓰고 텍스트·숫자·차트는 전부 **HTML/SVG**로 유지하는 1920×1080 HTML 발표 덱(HTML PPT / 카드뉴스 / 키노트) 제작 스킬. GPTs “Raw5 v4” 프롬프트 팩을 Claude 스킬로 포팅했다. 4개 모드(V7 밝은 리포트 / V8 다크 / University AX / Street 에디토리얼) · 3단계 워크플로우(기획 → 이미지 5장 프롬프트[HARD STOP] → HTML 빌드).
→ 상세: **[Image-HTML/README.md](Image-HTML/README.md)**

## 🚀 빠른 설치 (Claude Code)

```bash
# 방법 A — npx (가장 간단)
npx skills add laguna821/Achmage-Skills
```

```text
# 방법 B — 플러그인 마켓플레이스 (공식 배포 경로)
/plugin marketplace add laguna821/Achmage-Skills
/plugin install raw-5-html@achmage-skills
```

```bash
# 방법 C — 수동 복사
git clone https://github.com/laguna821/Achmage-Skills
cp -r Achmage-Skills/Image-HTML/raw-5-html ~/.claude/skills/raw5-deck
```

설치 후엔 **“HTML 덱 / 카드뉴스 / 발표자료 만들어줘”** 라고 요청하면 자동 로드된다(또는 `/raw5-deck` 로 직접 호출). 옵션·상세는 [Image-HTML/README.md](Image-HTML/README.md#-설치-installation).

## 🖼 예시

[`Image-HTML/examples/`](Image-HTML/examples) — 정전 샘플 덱(V7 / V8 / University AX / Street) + 원본 GPTs Raw5 프롬프트 팩 + 검증용 “민주주의” · “행동경제학” 덱.

## License

Apache-2.0 — [LICENSE](LICENSE).
