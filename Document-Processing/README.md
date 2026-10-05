# kordoc-workbench 0.2.0

**한글 양식을 분석하고, Markdown을 같은 스타일의 HWPX 보고서로 만드는 독립 스킬입니다.** Codex·Claude Code와 코드 실행이 가능한 Claude·ChatGPT 웹 세션에서 사용합니다.

[기본 ZIP 다운로드 — 1.04MB](https://github.com/laguna821/Achmage-Skills/raw/refs/heads/main/Document-Processing/downloads/kordoc-workbench-0.2.0-core.zip) · [소스 ZIP](downloads/kordoc-workbench-0.2.0-source.zip) · [검증 범위](VALIDATION.md) · [파일 해시](downloads/SHA256SUMS)

공식 [kordoc](https://github.com/chrisryugj/kordoc)의 **4.18.13**, 커밋 `969526345dde7d6acd2f2bfd3c8e592069333355`를 고정합니다. AI는 내용 작성과 필드의 의미 해석을, 엔진은 조판·파일 생성·검증을 맡습니다. HanMark·Obsidian·Achmage OS 설치는 필요하지 않습니다.

## 바로 사용하기

> kordoc-workbench로 이 HWPX 양식을 분석하고 이 Markdown을 같은 스타일의 보고서로 만들어줘. HWPX, 재사용 양식 패키지와 미리보기를 줘.

> 이 한글 문서의 결재란과 서식을 유지하고 지정한 필드만 채워줘.

참조 문서 → 양식 분석 → Markdown 작성 → HWPX 생성 → 검증·미리보기 순서입니다. 고정 양식을 유지할 때는 fill/patch, 내용 길이와 구성이 바뀌는 보고서는 template-analyze/template-apply를 씁니다.

## 설치

### 기본 ZIP — Codex·Claude Code

ZIP을 풀고 kordoc-workbench 폴더에서 실행합니다. Node 20 이상이 필요합니다.

~~~sh
node scripts/install.mjs --codex --claude
~~~

필요한 대상 옵션만 사용해도 됩니다. 기존 설치를 갱신하려면 --update를 추가합니다. 설치기는 파일 해시를 검사하고 이전 관리 설치본을 보존합니다. 새 세션에서 스킬을 선택합니다.

Node가 없으면 Windows setup.ps1, macOS/Linux의 sh setup.sh가 고정 버전과 SHA256으로 준비합니다. 실행 정책을 우회하지 않습니다. 플랫폼별 실기 검증 범위는 아래 기록을 확인하세요.

### Claude Code 마켓플레이스

~~~text
/plugin marketplace add laguna821/Achmage-Skills
/plugin install kordoc-workbench@achmage-skills
~~~

이 저장소의 플러그인은 [명시적 skills 경로](https://code.claude.com/docs/en/plugins-reference)를 사용합니다. 문서 처리 엔진은 동일한 기본 패키지입니다. 설치 방식은 하나를 선택해 중복 등록을 피하세요.

### Claude·ChatGPT 웹

기본 ZIP을 스킬 업로드 기능에 추가합니다. 지원 여부와 업로드 UI는 계정·제품에 따라 다릅니다. **파일과 Node를 실행할 수 있는 세션**이 필요합니다. 스킬 교체가 지원되지 않는 경우 ZIP을 대화에 첨부해 세션 안에서 압축 해제하고 실행할 수도 있습니다.

웹 실행 시 KORDOC_WEB=1을 설정합니다. 문서 처리는 해당 웹 세션 안에서 수행하며 PC 실행기나 원격 처리 서버를 호출하지 않습니다. 생성된 .kordoc-template.json을 저장하고 새 대화에 다시 첨부하면 양식을 재사용할 수 있습니다. 스킬 설치만으로 개인 양식의 영구 저장이 보장되지는 않습니다.

### GitHub 폴더로 사용

저장소에서 Document-Processing/kordoc-workbench 폴더 전체를 사용합니다. SKILL.md만 복사하면 실행 엔진이 빠집니다. 전체 저장소에는 다른 스킬의 큰 자산도 있으므로 이 스킬만 필요하면 기본 ZIP을 받으세요.

## 작은 기본 패키지와 선택 확장

기본 ZIP은 **1,040,300바이트, 57개 파일**입니다. 전체 오프라인 시험 ZIP 421,676,084바이트에 비해 99.75% 작습니다. 모든 확장을 설치한 최종 디스크 용량이 1MB라는 뜻은 아닙니다.

| 기능 | 준비 |
| --- | --- |
| HWP3/5·HWPX·HWPML 읽기, 양식 분석·채우기·패치·비교 | 기본 포함, Node만 필요 |
| Markdown → HWPX, 공문서 9개 프리셋, 표·병합표·이미지·수식·차트 | 기본 포함 |
| 재사용 TemplatePack, 구조 검사, 표기 검사, SVG·HTML | 기본 포함 |
| 텍스트 개인정보 마스킹·잔존 검사, 도장·서명 배치 | 기본 포함, 이미지 속 정보는 별도 확인 |
| PNG/JPEG·영역 이미지 | 요청 시 sharp 준비 |
| PDF 읽기 | 요청 시 PDF 의존성 준비 |
| 한국어 OCR·수식 OCR | 요청 시 런타임과 모델 준비 |
| PDF 출력 | 기존 Chrome/Edge 실행 확인 후 재사용; 없으면 지원 플랫폼의 고정 Chromium 준비 |

보통의 한글 보고서 작업에서는 Chromium·OCR 모델을 받지 않습니다. 선택 확장은 정확한 버전과 무결성 값을 고정하며 첫 사용 시 다운로드할 수 있습니다. KORDOC_OFFLINE=1은 다운로드를 금지합니다. 웹의 네트워크와 캐시 지속성은 환경에 따라 다릅니다.

## JSON 실행

~~~json
{"schemaVersion":1,"mode":"generate","markdown":"# 보고서\n\n## 목적\n\n자료를 정리합니다.","outputDir":"results/new-report"}
~~~

~~~sh
node scripts/run.mjs request.json
~~~

Python 진입점은 python scripts/launch.py request.json입니다. [모든 작업 모드](kordoc-workbench/references/operations.md)와 [양식 사용법](kordoc-workbench/references/templates.md)을 참조하세요.

종료 코드는 완료 0, 부분 처리 2, 실패 1입니다. JSON에 엔진 버전, 산출물 해시, 경고, 건너뛴 필드·편집, 실패 코드를 포함합니다. 이전 출력은 덮어쓰지 않으므로 새 출력 폴더를 사용하세요. capabilities는 실행 준비 상태이며 문서 작업의 성공 증명이 아닙니다.

## 검증과 한계

[검증 기록](VALIDATION.md)에 실제 통과한 환경과 미검증 항목을 구분했습니다. 확정 Markdown·옵션·자산·날짜·엔진 버전이 같을 때 HWPX 바이트 일치를 검사합니다. AI 초안의 반복 일치는 결정성 범위가 아닙니다.

복잡한 개체·중첩표·인용문 일부 서식에는 제한이 있습니다. 원본 글꼴이 없으면 미리보기가 대체 글꼴이나 네모로 표시될 수 있고 좁은 표 셀의 넘침도 확인해야 합니다. 구조 검사는 한컴에서 열기·편집·저장 및 실제 쪽 나눔 검사를 대신하지 않습니다. OCR 결과는 사람이 검토해야 합니다.

HanMark 양식 전달은 선택 로컬 애드온입니다. 실행 중 수신·재시작 검증은 아직 완료하지 않았으며, 이 패키지가 HanMark 엔진을 교체하지 않습니다.

## 소스와 라이선스

소스 ZIP에는 실행기, 빌드 도구, 테스트와 고정 lockfile이 있습니다. 엔진 원본은 위에 명시한 공식 커밋을 사용합니다.

~~~sh
npm ci
node tools/package-lean.mjs /absolute/path/to/pinned/kordoc-main
node --test tests/lean.test.mjs tests/launcher.test.mjs
~~~

Workbench와 kordoc은 MIT이며, 포함된 각 의존성의 라이선스는 그대로 유지됩니다. [Workbench 라이선스](kordoc-workbench/LICENSE-WORKBENCH), [kordoc 고지](kordoc-workbench/NOTICE-KORDOC), [의존성 라이선스 전문](kordoc-workbench/THIRD-PARTY-LICENSES.txt)을 함께 배포합니다. 이 폴더에는 개인 양식·문서·대화 기록·계정 설정을 포함하지 않습니다.
