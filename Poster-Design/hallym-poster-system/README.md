# Hallym Poster System · 1.2.0-rc.5
한국어 행사·모집·학술 포스터를 **모바일 HTML과 별도로 편집한 인쇄 PDF**로 만듭니다.
Achmage OS, MCP, EJ 설치 없이 실행할 수 있는 전체 스킬 패키지입니다.

## 이번 버전
- 여러 장의 HTML도 각 장이 제목·일시·장소·참여 조건을 갖춘 완결 포스터입니다.
- 기본 4초 순환, 라이트·다크 교차, 상하단·로고 동시 전환.
- 장마다 좌우 여백이 흔들리지 않는 공통 폭·배율. 모바일 세로 본문 폭 90% 이상을 검수합니다.
- HTML 장수와 독립된 A2 한 장 편집. 420×594mm trim / 424×598mm bleed.
- 작은 ⋯ 도구 안의 테마·확대·PDF. 공개 HTML은 가볍게, 오프라인 HTML은 자산과 PDF를 내장합니다.
- 1200×600 공유 이미지와 초기 OG 메타데이터, 파일 해시 검사 및 게시 후 확인.

[실제 공개 시험본](https://achmage-slides.vercel.app/experiments/pkm-speaker-posters-2026/) · [검증 범위](VALIDATION.md) · [출처·라이선스](THIRD_PARTY_NOTICES.md)

## 설치
ZIP을 풀어 **hallym-poster-system 폴더 전체**를 보관하세요. SKILL.md만 복사하면 실행할 수 없습니다.
Python 3.11과 requirements.txt의 의존성이 필요합니다. 검증 환경은 Windows/Python 3.11입니다.

폴더 안에서 패키지를 확인합니다:
~~~text
python -X utf8 -B scripts/verify_package.py
~~~
Codex는 실제 사용 중인 CODEX_HOME/skills 아래, Claude Code는 ~/.claude/skills 또는 프로젝트 .claude/skills 아래에 이 폴더 전체를 복사합니다.
기존 동명 설치는 먼저 별도 백업하세요. 개인 원고·출력·양식은 스킬 폴더 밖에 두세요.
Claude Code 마켓플레이스 경로도 제공합니다:
~~~text
/plugin marketplace add laguna821/Achmage-Skills
/plugin install hallym-poster-system@achmage-skills
~~~
새 세션에서 설치 스킬을 확인하고 “이 자료를 모바일 HTML 포스터와 A2 PDF 한 장으로 만들어줘”처럼 요청하세요.
호스트에 따라 스킬 재로드가 필요합니다. 전체 OS를 설치하거나 기존 발표 엔진을 교체할 필요가 없습니다.

## 직접 실행
가상환경은 스킬 폴더 밖에 만듭니다. 아래 python은 준비한 가상환경의 실행 파일을 뜻합니다.
~~~text
python -m pip install -r requirements.txt
python -X utf8 -B scripts/poster.py doctor
python -X utf8 -B -m unittest discover -s tests
~~~
제작은 스킬 폴더 밖의 작업 폴더에서 실행합니다. 아래 두 경로는 압축을 푼 실제 경로로 바꾸세요.
~~~text
python -X utf8 -B /설치경로/hallym-poster-system/scripts/poster.py /설치경로/hallym-poster-system/examples/series-minimal.json
~~~
제작 명령은 현재 작업 폴더에 series-example-output을 새로 만듭니다.
이미 같은 출력 폴더가 있으면 덮어쓰지 않습니다. 원고의 outputDir을 새 경로로 바꾸세요.
예제는 합성 시험 원고이며 실제 행사 모집 공고가 아닙니다.

AI는 SKILL.md → 모드별 계약 → 원고 편집 → 실행 → 실제 화면/PDF 검수 순서를 따릅니다.
series-v2의 paper engine은 1.2.0-rc.4에 고정되어 있습니다. 기존 legacy-rc6 원고는 자동 이관하지 않습니다.

## 게시와 인쇄
공개 URL을 정한 뒤 share-manifest에 명시한 HTML·PDF·OG·폰트만 게시하고 실제 HTTP와 카톡 카드 상태를 확인합니다.
로컬 원고·실행 기록·개인 경로를 통째로 업로드하지 않습니다.
scripts/prepare_pages.py는 게시 후보만 준비하며 인증·push·사이트 설정 변경을 하지 않습니다.
카톡 사용자 확인은 링크별 증거입니다. 이 버전 설치만으로 모든 링크의 카드 성공을 보장하지 않습니다.

CMYK 출력은 인쇄소·용지에 맞는 ICC를 별도로 지정해야 합니다. ICC가 없으면 RGB 교정본입니다.
글꼴은 내장하고 벡터는 유지하지만 PDF/X 인증이나 모든 인쇄업체의 출력 승인을 주장하지 않습니다.
기관 역할과 로고 출처를 확인해야 하며, 기본 색상은 한림대 공식 소속을 뜻하지 않습니다.
