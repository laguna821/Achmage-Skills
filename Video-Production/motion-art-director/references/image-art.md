# 생성 원화와 레이어 연출

생성 원화를 선택한 프로젝트에서 구도·재질·빛을 먼저 확보하고 전경·후경·가림·내부 흐름을 설계한다.

## 아트 제작
원화 자체의 구도·재질·빛을 먼저 확보한다. 이미지 생성 스킬과 내장 도구가 있으면 사용한다. 원화에는 글자·데이터·로고를 굽지 않는다. 프롬프트는 작품용 원화임을 명시하고 크롭 여유, 광원, 재질, 팔레트, 네거티브 공간을 정한다. 기존 이미지 변경은 이미지 편집 도구로 수행한다.

전경 제거 배경판(clean plate)을 별도로 만든다. 전경은 실제 윤곽을 따라 크롭/마스크한다. 시차는 실제 분리한 전경·후경에 적용한다. 단순 사진 확대만 반복하지 않는다. 글자 뒤로 물체가 지나가거나 내부 빈 공간으로 글자가 보이게 한다. 연기는 밝기 기반 밀도 마스크를 사용할 수 있으나 실제 투명도가 아니라 합성 근사임을 기록한다. 복잡한 유리·연기의 진짜 알파가 필요하면 이미지 생성 스킬의 해당 경로를 따른다. 크로마키 품질이 좋다고 가정하지 않는다.

대표 프레임에서 재질·빛·윤곽·가림·장면 의미를 비교하고 완성 영상을 만든다. 레이어는 컷당 기본 3–6개, 상한 64개. 원화 2K 안팎 권장, 개별 8.4MP/12MiB 이하. 텍스트와 음악은 독립된 편집 레이어다. 생성은 온라인 서비스일 수 있어도 최종 렌더는 로컬 파일과 임베드만 사용한다.

## 계약과 실행
renderer: image-composite / visual_policy: licensed_media / render_network: local_only.
assets 항목: asset_id, path, kind=raster, origin=generated 또는 provided, provider, prompt, provenance, sha256, width, height. 상대 path는 프로젝트 파일 위치 기준이며, 패키지 자산은 skill:assets/...를 사용한다. 절대 로컬 경로도 허용한다. 자동 수정·재생성으로 원본을 덮어쓰지 않는다. 바이트 해시와 크기/픽셀 예산을 렌더 전 검사한다.

scene.composition: width, height, background, layers. 배열 순서가 뒤→앞이다. layer.kind=image 또는 text. 이미지 layer.asset_id, rect=[x,y,w,h], clip_path=순수 SVG 경로, blend=normal/screen/multiply/overlay. 텍스트는 content_id를 참조해 필수 문구와 연결하거나 장식용 text를 사용한다. position=[x,y], size, color, font(Pretendard/Bodoni), weight, tracking, align. x/y/scale/rotation/opacity 및 pivot=[x,y]와 keyframes=[{at:초,x,y,scale,rotation,opacity}]는 절대 시점으로 계산한다. 필수 content_ids는 실제 editable text 레이어에 모두 있어야 한다.

portrait_composition을 별도로 작성한다. 미제공 시 중앙 fit은 임시 프리뷰이며 별도 세로 연출 검수를 통과한 것으로 쓰지 않는다. 원문 잠금·읽기시간·사건·hash 승인 규칙은 동일하다. 이미지는 이미지이며 이를 strict_svg라고 표기하지 않는다. SVG 내 임베드 이미지 산출물은 편집 가능한 합성 소스이고 순수 벡터 원본이 아니다.

## 호스트 지원
공통 Node 런타임은 Codex/Claude Code 모두에서 이미지를 입력받아 출력한다. Codex 내장 image_gen은 현재 Codex에서 활용할 수 있다. Claude Code에서는 사용 가능한 이미지 MCP/생성 서비스 또는 사용자 원화를 연결해야 한다. CLI를 실행한다고 이미지 모델 호출이 자동으로 생기지 않는다. 별도 이미지 API 경로·키·비용은 해당 호스트에서 확인한다. 이미지 제공자가 없다는 이유로 Blender나 로컬 확산 모델을 자동 설치하지 않는다.

## 범위
이미지 원화 합성은 물성의 미감을 확보하는 방식이다. 원화 밖의 3D 카메라 회전·진짜 유체 시뮬레이션·프레임마다 물성 변화까지 자동 복원하지 않는다. 필요하면 동일한 광원/실루엣으로 추가 원화나 키 포즈를 만들고 전환을 검토한다. 사용자 미감 평가와 CPU 경로 검사를 분리해 기록한다.
