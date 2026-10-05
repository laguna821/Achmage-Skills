# Motion Art Director · 3.0.0-rc.1

**기획 질문부터 스타일프레임, 대표 컷, 영상·음악·효과음, 수정과 검수까지 이어지는 Codex·Claude Code 공통 제작 스킬입니다.**

[공개 영상 갤러리](https://motion-art-director-review-oct05.achmage2.chatgpt.site/) · [자동차 150초](https://motion-art-director-review-oct05.achmage2.chatgpt.site/car.html) · [정지·무음·로고 엔딩](https://motion-art-director-review-oct05.achmage2.chatgpt.site/car.html#ending) · [다운로드와 설치 ZIP](https://github.com/laguna821/Achmage-Skills/releases/tag/motion-art-director-v3.0.0-rc.1)

## 무엇이 들어 있나요?

- **내용을 실제로 보여주는 연출:** 안내표의 편명이 지도 위 항로와 비행기로 이어지고, 물과 입자가 체를 통과하는 과정을 장면의 행동으로 작성합니다.
- **연출 검토와 수정:** 기획 → 연출안·스타일프레임·사운드 계획 → 사용자 확인 → 대표 컷 → 전체 제작 → 검수. status/resume과 변경 컷 재렌더, 승인 무효화, 원본 보존을 제공합니다.
- **음악·효과음:** 시드가 고정된 로컬 합성, 분리된 음악·효과음·믹스·작곡 데이터, 출처가 확인된 외부 음원 편집. 템포·드럼·장면별 에너지·정지 시점·로고·무음도 연출 계약에 포함합니다.
- **637개 효과 카드·128개 원본 클립·11개 레시피:** awesome-ai-motion의 출처·파라미터·주의사항·조합·비교 자료를 보존합니다. 자료 수가 자체 구현 또는 미감 검증 수를 뜻하지 않습니다.
- **일곱 출력 루트:** 영상편집, 소개홍보, 쇼츠, 뉴스레터, 인포그래픽, 썸네일, 덱과 사이트.

## 제작 방식

기본은 SVG·GSAP + CPU Chromium + FFmpeg입니다. SVG/text에는 선택적인 Skia CPU 렌더가 있습니다. 전용 GPU·Blender·CUDA·이미지 생성 API 키는 기본 의존성이 아닙니다. 초안 720p, 최종 기본 1080p30, 동시 렌더 1개이며 프레임을 순차 처리합니다.

공간 카메라가 필요하면 직접 작성한 형상을 Three.js/SwiftShader로 렌더하는 선택 확장을 사용합니다. 자동차 데모는 이 확장과 SVG 타이포를 사용했습니다. **자동차 데모를 SVG만으로 만든 영상이라고 설명하지 않습니다.** Codex의 생성 이미지·내부 흐름은 별도 선택 기능입니다.

awesome-ai-motion은 표현을 찾는 도감입니다. 이 패키지는 그 도감을 내용·대상·행동에 연결하고, 결과를 제작·수정하는 워크플로우와 런타임을 더합니다. 효과를 많이 사용하는 것보다 장면의 전달력을 우선합니다.

## 설치

Node.js 20 이상, FFmpeg와 ffprobe가 필요합니다. [시험판 ZIP](https://github.com/laguna821/Achmage-Skills/releases/tag/motion-art-director-v3.0.0-rc.1)을 풀거나 저장소의 이 폴더 전체를 받습니다. SKILL.md만 복사하면 실행되지 않습니다.

```sh
# 압축을 푼 motion-art-director 폴더에서, 사용할 클라이언트 하나를 선택
node scripts/install.mjs --agent codex
# 또는
node scripts/install.mjs --agent claude
```

Codex 기본 경로는 CODEX_HOME/skills 또는 ~/.codex/skills, Claude Code는 ~/.claude/skills입니다. --dest <skills-directory>로 지정할 수 있고 기존 설치는 덮어쓰지 않습니다.

**설치된 motion-art-director 폴더에서** 다음을 실행합니다.

```sh
npm ci
npx playwright install chromium
node scripts/setup.mjs --ffmpeg-dir "/absolute/path/to/ffmpeg/bin"
node scripts/motion.mjs doctor
```

Windows에서는 FFmpeg의 bin 폴더를 따옴표로 감싸 지정합니다. 설정은 사용자 설정 폴더 또는 MOTION_CONFIG에 저장됩니다. 프로젝트·출력·승인 기록은 설치 폴더 밖에 둡니다. 작업 폴더에서는 설치된 scripts/motion.mjs를 절대 경로로 호출합니다.

Claude Code 플러그인으로도 설치할 수 있습니다.

```text
/plugin marketplace add laguna821/Achmage-Skills
/plugin install motion-art-director@achmage-skills
```

플러그인 설치 후 에이전트에게 해당 플러그인의 README에 따라 npm/Chromium/FFmpeg 환경 설정과 doctor를 실행하도록 요청하세요. 캐시 위치는 클라이언트가 정합니다. 플러그인 설치가 시스템 의존성을 자동 설치하지는 않습니다.

## 바로 써보기

> motion-art-director로 이 문서를 30초 모션그래픽으로 만들어줘. 중요한 문장은 유지하고, 내용을 실제 사물과 행동으로 보여줘. 연출안과 대표 컷부터 확인하자.

> 150초 자동차 콘셉트 영상을 만들자. 음악은 빠른 드럼과 엇박이 있는 후보를 비교하고, 가속·마찰 효과음을 행동에 맞춰 넣어줘. 마지막 차가 멈출 때 음악을 끊고, 정적 뒤 로고 효과음만 남겨줘.

```sh
node scripts/motion.mjs catalog morph --limit 12
node scripts/motion.mjs validate examples/object-flight.project.json
node scripts/motion.mjs plan examples/object-flight.project.json --out /path/to/work
node scripts/motion.mjs styleframe examples/object-flight.project.json --time 5 --out /path/to/work
```

렌더 전에 실제 연출 확인을 기록합니다. 공개 예제에는 사용자 승인 기록이 없습니다. 에이전트는 실제 확인 없이 승인했다고 작성하면 안 됩니다. 전체 명령은 [CLI](references/cli.md)를 참고하세요.

## 예제와 영상

| 예제 | 내용 | 보기 |
|---|---|---|
| object-flight | 15초 안내표 → 지도·항로 → 비행기 | [영상](https://motion-art-director-review-oct05.achmage2.chatgpt.site/#flight) |
| object-water | 12초 유입 → 체 → 분리 → 배출 | [영상](https://motion-art-director-review-oct05.achmage2.chatgpt.site/#water) |
| book-150 | 150초, 12개 시퀀스, 새 작곡·효과음 | [영상](https://motion-art-director-review-oct05.achmage2.chatgpt.site/#book) |
| 자동차 연구작 | 150초, 46컷, 공간 카메라·주행음·엔딩 | [영상과 출처](https://motion-art-director-review-oct05.achmage2.chatgpt.site/car.html) |
| material / image-flow / flow-transfer | 20초 벡터 물성 및 선택 이미지 흐름 | examples/의 편집 가능한 프로젝트 |
| journey / editorial | 초기 여행·110초 한국어 타이포 기술 예제 | 현재 미감 기준을 통과한 작품으로 취급하지 않음 |

자동차 연구작은 현대자동차의 공식 광고가 아니며, 실차 CAD 수준의 정확도를 보증하지 않습니다. 공통 패키지에는 자동차 원화·상용차 자료·외부 음악 원곡을 넣지 않았습니다. 갤러리 완성 영상의 음악 출처는 별도로 표시합니다.

## 선택 의존성

- Skia: 별도 Python 환경에 requirements-skia.txt를 설치하고 setup.mjs --python <python>으로 연결합니다. profile.rasterizer=skia는 SVG/text용이며 이미지·일부 변형은 지원하지 않습니다.
- 덱/PDF: 같은 저장소의 [achmage-presentation 1.0.0](../../Presentation/achmage-presentation)을 scripts/connect-presentation.mjs로 연결합니다. 엔진 해시를 확인하며 Python 및 PDF 변환기가 추가로 필요합니다.
- Claude Code 기본 경로는 이미지 생성 서비스를 요구하지 않습니다. Codex 이미지 생성은 해당 도구 사용이 가능한 환경에서만 제공합니다.

## 시험판 범위

[검증표](VALIDATION.md)에서 자동 검사, 프레임 관찰, 전체 청취, 미감 검토를 구분합니다. 현재 PC에서 GPU를 비활성화한 실행을 확인했으며 **실제 내장 그래픽·RAM 16GB 노트북 실측은 아직 없습니다.** 새로운 주제의 완성도는 연출과 대표 컷 검토로 판단해야 합니다.

신규 코드는 MIT입니다. 도감·폰트·GSAP·외부 음악 등은 [개별 고지](THIRD_PARTY_NOTICES.md)를 따릅니다. 사용자 레퍼런스 MP4와 비공개 작업 기록은 배포하지 않습니다.
