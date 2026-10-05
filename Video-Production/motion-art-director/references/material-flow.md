# 물성 내부의 움직임
image-composite의 image 레이어에 motion을 지정한다. preset은 none/crystal/metal/smoke/plasma, intensity와 speed는 0–2다. 기본은 변형 없음이다.
region=[x,y,w,h]는 0–1 정규화 영역, pins=[[x,y,radius]]는 보호 영역이다. 로고·문자는 별도 text/SVG 레이어로 유지한다. 결정은 내부 하이라이트, 금속은 표면·윤곽 변형, 연기는 국소 회전, 플라스마는 복합 파동을 사용한다. 시뮬레이션이나 새로운 물질 생성은 아니다.
클립은 원본 이미지에 먼저 적용하고, 이미지와 투명 마스크에 같은 좌표 변형을 사용한다. 절대 시간만으로 960×540 파생 이미지를 만들며 원본 파일을 덮어쓰지 않는다. 격자는 28×16, 삼각형 896개다. 접힘이 생기면 강도를 줄여 양의 면적을 유지한다. 강도·속도·영역·보호점 변경은 컷 캐시를 무효화한다.
legacy material_flow=true는 포함된 4재질 비교 예제에만 쓰인다. 새로운 프로젝트는 명시적인 layer.motion을 사용한다. examples/flow-transfer.project.json은 기존 재질 이름과 다른 자산 ID에 적용한 예제다.
구현의 재현성과 미감은 따로 검수한다. 격자 경계, 마스크 어긋남, 확대 시 세부 손실, 단단한 물체의 고무 같은 변형을 확인한다. 소용돌이 움직임은 원화 구조의 근사다. 새 연기의 생성/소멸, 액체의 분열/병합, 가려진 면의 복원, 체적 유체 물리는 지원했다고 주장하지 않는다.
CPU 성능과 검증 상태는 VALIDATION.md에 기록한다. 실제 일반 노트북의 측정과 고성능 호스트에서 GPU를 끈 시험을 구분한다.
참조: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
