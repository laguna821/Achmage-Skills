# hallym-kordoc

한림대학교 문서 34개 문서군을 선택해 Markdown과 HWPX를 작성하는 독립 스킬입니다.
공개 서식 참고 재구성 13개, 공통 초안 21개를 포함합니다. 각 문서군의 대표이며 모든 세부 서식의 모음은 아닙니다.
공식 양식 적용 상태와 실행 성공을 구분합니다. HWP는 참고로 읽고, 양식과 한글 결과는 HWPX로 만듭니다.

## 설치

기본 ZIP을 풀고 hallym-kordoc 폴더에서 Node 20 이상으로 실행합니다.

node scripts/install.mjs --codex --claude

Node가 없으면 setup.ps1으로 고정 런타임을 준비합니다. 실행 정책을 우회하지 않습니다.
개인 양식은 ~/.hallym-kordoc/library에 별도로 저장됩니다. HALLYM_KORDOC_HOME으로 위치를 지정할 수 있습니다.
기존 관리 설치본을 갱신할 때 --update를 사용합니다. 기존 일반 폴더는 덮어쓰지 않습니다.

한림고딕체가 없는 PC에서는 공식 한림대 글꼴 설치 후 사용하면 모양이 일관됩니다.
글꼴·브라우저·OCR 모델은 기본 패키지에 포함하지 않습니다.

## 예시

- “PBL 회의록을 이 자료로 작성해서 한글 파일로 줘.”
- “이 Markdown을 한림대 보고서로 만들어줘.”
- “이 HWPX를 내 양식으로 등록하고 다음 학기 자문보고서부터 사용해줘.”

선택과 작성은 AI, 조판과 검사는 동봉 kordoc 4.18.13이 수행합니다.
SKILL.md만 복사하지 말고 전체 폴더를 사용하세요. 별도 kordoc-workbench 설치는 필요 없습니다.

## 개발과 검증

node tools/build.mjs
node --test tests/*.test.mjs
node tools/package.mjs

빌드는 동봉한 hk-01의 공개 출처 메타데이터·필수 안내 문구·조사 카탈로그를 참조합니다. 원본 HWP나 개인 작성 문서는 배포하지 않습니다.
vendor core는 kordoc-workbench 0.2.0의 검증된 경량 릴리스를 포함합니다. 독립 실행에 npm 설치가 필요하지 않습니다.
동봉 HanMark 스타일 도우미는 Obsidian 의존성을 제거한 MIT 코드이며 정확한 소스 해시는 scripts/style-provenance.json에 있습니다.

이 릴리스는 RC입니다. 한컴 열기·편집·저장과 실제 조판 대조가 확인되기 전 정식 완성판으로 표시하지 않습니다.
웹, macOS/Linux, 모든 선택 확장 검증은 v1 로컬 핵심 범위 밖입니다.
