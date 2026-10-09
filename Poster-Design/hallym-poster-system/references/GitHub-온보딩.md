# 포스터·슬라이드를 링크로 공유하기

공유도 문서 작업의 연속이다. 사용자는 Git/저장소/Pages 용어를 몰라도 된다.
먼저 프로젝트의 `내양식/hallym-poster-system/publishing.json`과 기존 연결을 확인한다. 등록된 계정/범위가 없을 때만 “GitHub 계정이 있으세요?”라고 안내한다.

프로젝트의 내양식/hallym-poster-system/publishing.json에 계정·저장소·공개 기본값이 있으면 해당 범위를 사용한다. 현재 요청의 비공개/로컬 전용 지시가 우선한다. 공개 범위가 이미 지정된 경우 반복 승인 없이 검수·게시·실주소 확인까지 진행한다. 특정 계정과 Pages 원본 경로는 공통 스킬에 고정하지 않는다.

## 계정과 대상 확인
1. 현재 PC의 GitHub 연결/gh auth status 또는 사용자가 알려준 계정을 읽기 확인한다. 개발자/남편 계정을 아내 계정으로 간주하지 않는다.
2. 계정이 없으면 https://github.com/signup 을 안내한다. “이메일, 비밀번호, 사용자 이름으로 무료 계정을 만들고 이메일을 확인해 주세요. 끝나면 가입했어라고 말씀해 주세요.” 비밀번호/인증코드를 채팅에 보내게 하지 않는다. 약관·CAPTCHA·계정 보안 단계는 사용자가 마친다.
3. 연결된 GitHub 도구에 저장소 쓰기 권한이 있으면 그 연결로 진행한다. Edge 로그인, 앱 내 브라우저 로그인, GitHub 커넥터는 별개이므로 한 브라우저의 로그아웃을 계정 전체 미연결로 판단하지 않는다. 인증된 연결이 없을 때만 본인 계정으로 로그인하도록 돕는다. CLI가 있으면 gh auth login --web, 없으면 GitHub 웹 UI 경로를 안내한다. 명령어 설명으로 사용자에게 일감을 넘기지 말고 가능한 조작은 에이전트가 한다.
4. 기본 저장소 이름은 slides를 제안한다. 계정/기존 저장소를 실제 확인하고 기존 slides가 있으면 내용을 보존하며 새 작품 경로만 추가한다. 이름 충돌을 이유로 기존 저장소를 비우지 않는다.
5. “웹 링크를 가진 사람이 볼 수 있는 페이지”라고 한 번 쉽게 설명한다. GitHub Free Pages는 공개 저장소 기준이다. private 저장소도 Pages 사이트가 비공개라는 보장은 없다. 비공개 요구가 있으면 공개 배포하지 않고 파일 전달 또는 별도 접근제어 호스팅을 제안한다.

## 공개 전에 준비할 것
사용자가 게시를 요청한 산출물만 새 staging에 담는다. 확인된 게시 원본 아래 작품-slug/index.html + og-해시.png + poster.pdf. 이 프로젝트는 main 루트라서 docs/를 붙이지 않는다.
원본 PDF/논문/회의록, 서명 이미지, 내양식, 작업 로그, 환경 설정, 연구 장부, 토큰은 대상이 아니다.
슬라이드는 승인된 presentationPolicy 엔진으로 먼저 제작·검수하고 같은 저장소의 확인된 게시 원본 아래 다른-slug/에 올린다. 포스터 엔진으로 슬라이드를 재제작하지 않는다.
각 작품은 고유 폴더로 보존한다. URL은 https://계정.github.io/slides/작품-slug/ 형태이며 외부 URL을 추측해 완료로 표시하지 않는다.
기존 공개 승인이 이번 산출물·계정·목적까지 포함하면 반복 승인을 묻지 않는다. 범위가 불분명하면 준비된 파일 목록/최종 미리보기를 보여주고 그 대상만 확인한다.

## 게시 경로
- 연결된 GitHub 도구 우선: 현재 main 커밋/트리를 읽고 검수된 파일만 blob으로 작성 → 기존 트리를 기반으로 새 tree/commit → expected_sha로 main 갱신한다. 기존 파일을 보존하며 강제 push하지 않는다. 충돌하면 새 HEAD를 확인하고 재구성한다. 인증정보를 로컬 파일로 추출하지 않는다.
- CLI: 연결 계정 확인 → 기존 저장소 조회 → 새 저장소일 때 gh repo create 계정/slides --public → 전용 로컬 clone → staging의 검토된 파일만 복사 → 정확한 경로만 git add → commit/push. 토큰은 gh 자격 저장소에만 둔다. git add . 금지.
- 웹 UI: 본인 계정 → New repository → slides → Public → Create repository. docs/작품 폴더의 웹 파일을 업로드하고 Commit changes. 현재 GitHub UI를 확인해 진행한다.
- 저장소 Settings → Pages → Deploy from a branch → 새 저장소에만 main /docs → Save. 기존 Pages 설정/커스텀 도메인이 있으면 덮어쓰지 말고 실제 설정을 따른다.
- 기존 README를 Jekyll로 보여 주는 홈페이지에는 .nojekyll을 새로 추가하지 않는다. 새 저장소에만 newRepository:true로 준비한다. 기존 작품/홈페이지의 상태도 게시 전후 확인한다.
- 계정이 없는 초보에게 이 전체 목록을 한꺼번에 던지지 않는다. 현재 한 단계만 안내하고 완료 응답 후 이어간다.

## 성공 확인과 이어하기
1. Pages 배포 성공과 실제 URL의 HTTP200, 공개 HTML, 절대 og:url/og:image, 이미지 Content-Type/치수 확인.
2. 카카오 공식 https://developers.kakao.com/tool 의 URL 메타정보 확인과 필요 시 캐시 초기화. 실제 카카오 공유/메시지 전송은 사용자 요청 없이 보내지 않는다.
3. 확인한 수준만 기록: local-ready / staged / pushed / pages-live / kakao-preview-verified.
4. 사용자에게 최종 링크와 PDF, 기본 게시가 등록되었다면 “다음부터 포스터 만들어줘라고 하시면 게시 링크까지 포함합니다.”
5. 이어하기.md에 계정명/저장소 URL/작품 경로/배포 커밋/검증 상태/다음 단계만 저장한다. 토큰·비밀번호는 저장하지 않는다.

공식 근거(2026-10-08):
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
https://developers.kakao.com/docs/ko/tool/common


## PS10 · 모바일 HTML 공유 미리보기
순환 포스터에도 공유 이미지를 독립 산출한다. 1200×600 RGB PNG와 내용 해시 파일명, 절대 HTTPS canonical/og:url/og:image·제목·설명·이미지 형식/크기/대체텍스트를 초기 head에 넣는다. A2 전체 인쇄 미리보기를 OG로 재사용하지 않는다.
공개 poster.html은 폰트·PDF를 별도 파일로 제공하고, poster-offline.html은 같은 본문과 PDF를 내장한다. 공개 파일은 share-manifest.json의 명시된 파일·SHA256만 게시한다. 폴더 재귀 복사 금지. 프로젝트 자체 예산은 HTML256KiB/head64KiB/이미지1MiB이며 카카오 공식 크기 제한으로 주장하지 않는다.
생성→시각 검수→게시→공개 HTML·이미지·폰트 HTTP200/형식/크기/해시 및 canonical 확인을 필수로 한다. 일반 UA와 카카오 UA 응답을 비교하되 실제 카카오 수집 성공과 구분한다. 카카오 metadata debugger 로그인/캐시 확인 또는 실기기 카드 확인 전에는 kakao-preview-verified로 표시하지 않는다. 이미지 변경 시 URL도 해시로 바뀐다. 저장된 미리보기 갱신은 공식 도구 https://developers.kakao.com/tool/debugger/sharing 를 사용하며 메시지는 사용자 요청 없이 발송하지 않는다.
공유 공개 HTML의 수정이 화면 4초·교차 테마·공통 기하·넓은 모바일 폭·독립 A2 한 장을 바꾸면 안 된다. 종이 엔진은 PS09핀을 유지한다. 기존 legacy 출력은 승인 버전을 유지한다.
근거: research:rr-5107dcb3a351649bf07c26c031c27256:f34567b4510382c329f5d35224e482d86836b8f685ffb18bd469c51a8ce0c8f5
