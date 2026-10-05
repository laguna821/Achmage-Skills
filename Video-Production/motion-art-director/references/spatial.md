# 선택 공간 렌더 경로 — 개발 시험 기능

이 문서의 원화 합성 및 오버레이 제한은 기존 버전에 해당한다. 직접 작성 곡면, 컷별 형상 변형, 공통 벡터 타이포, 행동 연동 주행음은 `spatial.version: precision-1`과 [precision-driving.md](precision-driving.md)를 사용한다. 검증 범위를 섞지 않는다.

`renderer: "spatial-three"`, `profile: {gpu: false, jobs: 1}`를 사용한다. 기존 SVG/Skia 기본 경로와 별도이며 Three.js 0.180.0을 로컬 동봉한다. 유료 서비스, Blender, 전용 GPU는 필요 없다. Chromium의 SwiftShader 어댑터가 실제로 확인되어야 CPU 실행으로 기록한다. 실제 16GB 내장 그래픽 노트북 성능은 아직 측정하지 않았다.

## 장면 데이터

`spatial.nodes`에는 id, parent, position/rotation/scale, geometry, material, tags를 기록한다. box/sphere/cylinder/torus/plane/tube/삼각형 mesh와 노드 keyframes를 지원한다. 회전 값은 라디안, keyframes.at은 초다. 노드는 영화 전체 절대 시간, scene.spatial.camera 및 plates의 keyframes는 해당 컷의 상대 시간을 사용한다. wheel/repeat/oscillate는 이전 프레임 없이 계산한다.

모든 컷에 `spatial.camera: {position:[x,y,z],target:[x,y,z],fov:45}`를 작성한다. `travel: {offset,speed,acceleration}`의 거리로 도로 반복과 바퀴 회전을 함께 계산한다. 이는 연출용 좌표이며 실제 차량 성능 수치가 아니다. `hide`는 태그에 따라 노드를 숨긴다. foreground 노드는 원화 뒤에 다시 그려 앞을 가린다. 현재 별도 전경 패스는 작가가 깊이를 지정하는 방식이며 자동 가림 해결기로 설명하지 않는다.

## 원화 합성

`scene.spatial.plates` 항목은 raster asset_id, source_rect와 rect를 사용한다. `source_clip`은 원본 픽셀 좌표의 다각형이다. 멀티뷰 원화의 이웃 차량이 사각형 자르기 안에 들어오면 다각형으로 분리하거나 단일 뷰 원화를 다시 제작한다. 가까운 컷은 전체 차체를 유지하고 카메라를 접근시킨다. 먼저 차체를 사각형으로 잘라 배치하면 절단면이 화면 안에 노출될 수 있다.

`ground_anchors` 두 항목에 원화의 앞뒤 타이어 접점 source:[x,y]와 도로상의 world:[x,0,z]를 대응시킨다. 동일 카메라에 투영해 원화를 배치한다. 두 점의 일치는 원근·차종·조명 일치의 증거가 아니다. 원화 촬영각과 카메라 각도가 다르면 2D 원화가 기울거나 납작해진다. 그 컷은 새 원화나 실제 3D 모델이 필요하다. 크게 궤도를 도는 카메라는 이 방식의 검증 범위 밖이다.

`wheels: [[cx,cy,rx,ry]]`는 원화 픽셀 단위의 휠 안쪽 타원이다. 타이어·펜더까지 포함하지 않는다. wheel_shutter(0–1, 기본 .5)는 시간에 따른 회전 잔상이다. 전후 프레임에서 휠의 원래 무늬가 겹치거나 축이 흔들리면 실패다. `mirrors`의 polygon과 camera는 뒤쪽 세계를 별도로 렌더한다. 투명 거울에 전면 풍경이 그대로 비치도록 두지 않는다.

## 검증 범위

현재 공간 렌더 위의 타이포 오버레이는 svg/text, 이동·불투명도·자간과 SVG 그룹의 균등 배율만 지원한다. 일반 vector-composite의 morph/clip/blend/reveal·축별 배율·회전·글자 굵기 애니메이션을 자동으로 지원하지 않는다. 미지원 옵션은 조용히 무시하지 않고 계약에서 거부한다. 효과 도감 전체 실행 능력으로 설명하지 않는다.

공간 오버레이의 별도 composition.defs, 글자 배율, out easing 역시 현재 거부한다. 해당 연출은 검증된 벡터 장면에서 따로 제작하거나 공간 경로 지원을 먼저 추가·시험한다.

현재 16:9 대표 컷에서 순서를 바꾼 재현·컷별 캐시·원화 가림·CPU 어댑터를 시험했다. 세로 공간 구도, 벡터 SVG 내보내기, 자유로운 3D 차량 궤도 촬영, 미감 승인, 실제 노트북 성능은 미검증이다. 정지 SVG가 필요한 작업은 기존 벡터 경로로 따로 제작한다. 이 개발 기능을 이유로 일곱 출력 루트 전체가 공간 렌더를 지원한다고 표시하지 않는다.
