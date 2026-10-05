# 프로젝트 v3 계약

examples/*.project.json의 구조를 사용한다. 승인 정보는 새 프로젝트로 복사하지 않는다.
새 작품은 examples/object-flight.project.json 또는 object-water.project.json의 대상 계약 구조를 참고하되 주제별 대상과 화면을 새로 기획한다. 다른 예제는 기능 시험용 legacy 예제다.

direction_contract=object-first-v1이면 scene.visual_plan을 필수 검사한다. viewer_takeaway는 관객이 보아야 할 내용, objects는 id/kind/depicts/features/bindings, information은 이름·값·근거·layer_id, content_links는 content_id/shown_by/reason, beats는 초 단위 window/object_ids/action/before/after, continuity는 장면 사이에 유지할 대상·정보다. 각 layer에 고유 id를 붙이고 실제 그림을 bindings로 연결한다. 일반 대상이 텍스트 레이어에만 연결된 경우 거절한다. typography가 내용상 적합한 경우는 그 이유를 기획하고 시각 검토한다. 구조 검사는 식별·정확성·미감을 판정하지 않는다.

schema_version=3.0.0, project_id 안전 slug, output=1920×1080 30fps total_frames 정수. scenes.start/end는 전역 프레임의 [start,end), 빈틈·중복 없이 이어진다. content_ids는 content_units에 대응. copy_lock=true는 source_text 그대로 표시. required_content_ids는 반드시 포함. 그 밖의 단위도 표시하거나 omissions에 이유를 쓴다. 사건 presented_as는 events.kind(actual/proposed/hypothetical/symbolic)와 같아야 한다.

기본 reading budget은 최소 1.5초, 한국어 약 7자/초+진입 여유를 하한으로 검사한다. 실제 독자와 문장 난이도에 따라 늘린다. 단순 글자 계산은 이해 시간의 증명이 아니다.

visual_policy: strict_svg는 보이는 원 그래픽을 SVG와 편집 가능한 텍스트로 저작한다. image/feImage/foreignObject/외부use/data이미지를 원 그래픽으로 넣지 않는다. CPU Skia로 래스터화하는 것은 출력 방식이며 이 자산 조건을 바꾸지 않는다. procedural_only는 절차적 SVG/코드 그래픽, licensed_media는 출처·라이선스·해시가 기록된 이미지를 허용한다. 글꼴·음원·네트워크 조건은 그래픽 자산 정책과 별개다.

renderer=vector-composite는 composition.layers의 svg/text/procedural을 사용한다. profile.rasterizer=skia는 svg/text만 지원한다. keyframes는 컷 시작부터 초 단위 절대시점이며 x/y/scale/rotation/opacity/draw를 보간한다. SVG morph는 같은 명령 구조와 숫자 개수를 유지한다. portrait_composition은 별도로 배치한다. 텍스트의 content_id는 원문 대응을 보존한다. 윤곽으로 바꾼 글자를 수정할 때는 해당 SVG 자산도 재생성한다.

approval.hash는 approval/status를 제외한 현재 프로젝트 전체에 묶는다. revise는 approval을 제거하며 새 연출 확인이 필요하다. 상태 파일은 rendering/representative_ready/final_rendered/interrupted. final_rendered와 human approved는 다르다.

캐시 키는 scene·해당 문구·폰트·stage 코드·GSAP·프로필·seed·라벨·순서를 포함한다. 이전 run은 hash별 폴더에 남아 있다. 메모리는 프레임 하나와 오디오 블록만 유지하며 FFmpeg backpressure를 따른다.
