# Achmage Portfolio Site 1.0.0

기술 프로젝트나 수업 자료를 웹사이트로 소개할 때, 처음 온 사람이 전체 내용을 이해하고 필요한 설명을 찾아 읽을 수 있도록 만드는 스킬입니다. [Achmage Field Guide](https://achmage-fieldguide.achmage2.chatgpt.site)의 정보 배치와 시각 스타일을 표준 템플릿으로 사용합니다.

## 어떤 것을 만드나요?

첫 화면에서는 무엇을 만들었고 누구에게 도움이 되는지 설명합니다. 이어서 독자별 읽기 경로와 전체 구성을 보여주고, 상세 페이지에서는 사용 장면·작동 순서·구체적인 예시·근거를 풀어 씁니다. 제작 과정과 원문도 따로 찾아볼 수 있습니다.

- [Google DESIGN.md](achmage-portfolio-site/assets/template/DESIGN.md)에 색상·글자·간격·컴포넌트 규칙을 담았습니다.
- SameTone 웹폰트와 네이비·블루·틸·화이트 색상을 포함합니다.
- 한국어·영어, 현재 장의 펼쳐지는 세부 목차, 검색·필터, 전체 HTML/Markdown과 원문 다운로드를 제공합니다.
- 도식·설명 그림·실제 화면을 언제 쓰는지, 캡션·대체 텍스트·출처를 어떻게 남기는지 안내합니다.
- 새 프로젝트를 생성하는 Python 도구와 정적 React/TypeScript 템플릿을 포함합니다.

기본 기획·사이트 제작에는 Achmage OS/MCP가 필요하지 않습니다. 프로젝트를 실행할 **Python 3.11 이상, Node.js 22.13 이상, npm, 파일 편집과 브라우저 검수가 가능한 AI 환경**이 필요합니다. 선택적인 Pele 도식이나 CMDS 그림 제작은 해당 도구가 준비된 환경에서 수행합니다. 외부 도구가 없다고 제작을 완료했다고 표시하지 않습니다.

## 설치

### Codex와 다른 스킬 지원 도구

다음 명령으로 설치할 스킬을 지정할 수 있습니다. 설치 도구가 표시하는 대상 앱과 경로를 확인하세요.

```bash
npx skills add laguna821/Achmage-Skills --skill achmage-portfolio-site
```

### Claude Code 플러그인

```text
/plugin marketplace add laguna821/Achmage-Skills
/plugin install achmage-portfolio-site@achmage-skills
```

플러그인 등록 파일과 스킬 경로를 검사했습니다. 이번 배포에서 Claude Code의 실제 플러그인 설치·호출까지 시험한 것은 아닙니다.

### ZIP으로 설치

[전체 설치 ZIP](downloads/achmage-portfolio-site-1.0.0.zip)을 내려받아 압축을 풀고, 안에 있는 **achmage-portfolio-site 폴더 전체**를 사용하는 앱의 스킬 폴더에 복사합니다. SKILL.md 한 파일만 복사하면 템플릿이 빠집니다.

- Codex: 설정한 CODEX_HOME 아래의 skills 폴더. 기본 경로를 쓰는 경우 ~/.codex/skills/achmage-portfolio-site.
- Claude Code: 개인 스킬은 ~/.claude/skills/achmage-portfolio-site.
- 이미 같은 스킬이 있다면 기존 내용을 확인하고 백업한 뒤 교체합니다.

새 대화에서 스킬을 선택하거나 이름을 명시해 요청하세요. 다른 앱과 PC의 자동 선택 동작은 실제 클라이언트 설정에 따라 확인해야 합니다. [파일 해시](downloads/SHA256SUMS)와 [패키지 목록](PACKAGE-MANIFEST.json)을 제공합니다.

## 사용 예시

> $achmage-portfolio-site 이 프로젝트 자료로 내 포트폴리오 사이트를 만들어줘. 첫 화면에서는 전체 내용을 쉽게 파악하게 하고, 자세한 제작 과정과 원문도 읽을 수 있게 해줘.

> 이 수업 자료를 Field Guide 스타일의 학습 사이트로 만들어줘. 학생이 먼저 볼 내용과 과제할 때 다시 찾을 내용을 나눠서 배치해줘.

AI는 자료와 독자를 확인하고 정보 배치표, 프로젝트 DESIGN.md, 사이트 소스, 필요한 시각자료와 검수 기록을 만듭니다. 공개 배포까지 원하면 요청에 배포 대상과 배포 요청을 함께 적습니다.

## 직접 실행해 보기

설치한 스킬 폴더의 실제 경로를 사용해 **비어 있는 새 프로젝트 폴더**를 만듭니다.

```bash
python /path/to/achmage-portfolio-site/scripts/scaffold.py --dest /path/to/new-portfolio
cd /path/to/new-portfolio
npm ci --ignore-scripts --no-audit --no-fund
npm run check
npm run design:lint
npm run build
npm run dev -- --port 4173
```

Windows PowerShell에서는 필요한 경우 python 대신 설치한 Python 경로, npm 대신 npm.cmd를 사용합니다. 실행 뒤 터미널에 표시되는 로컬 주소를 브라우저에서 엽니다. dist 폴더에 정적 배포 파일이 만들어집니다.

내용은 content/portfolio.json에서 바꾸며, 데이터 형식은 src/model.ts에 정의되어 있습니다. 같은 데이터로 목차·검색·전체 문서·원문 다운로드를 만듭니다. 기본 예제의 기록실은 가상 자료이며 실제 성과나 사례로 소개하면 안 됩니다.

기존 사이트에 적용할 때는 생성 스크립트로 덮어쓰지 않고, 현재 기술 환경을 유지하며 필요한 구성과 디자인 규칙을 옮깁니다.

## 다른 사람의 브랜드로 사용할 때

Achmage 로고와 폰트를 자신의 브랜드처럼 쓰기보다, 소유한 로고·웹폰트와 프로젝트 DESIGN.md로 교체하도록 요청하세요. 사용자가 지정한 브랜드가 템플릿 기본값보다 우선합니다. 브랜드를 바꾸었다면 자산 해시를 확인하는 검사도 새로 승인한 기준에 맞춰 갱신하고 실제 화면을 다시 확인해야 합니다.

[브랜드·외부 자산 고지](ASSET-NOTICE.md), [스킬 지침](achmage-portfolio-site/SKILL.md), [검증 범위](VALIDATION.md)를 함께 확인하세요.

## 배포 파일 검증

이 저장소에서 다음 명령으로 스킬 파일과 ZIP의 일치를 확인할 수 있습니다. 네트워크 요청이나 의존성 설치는 하지 않습니다.

```bash
python Web-Portfolio/tools/verify_package.py
```
