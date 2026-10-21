# Showreel 선택 확장

기획 시청 → 사용자 방향 확인 → 대표 컷 → 본편 → 실제 검수 흐름을 유지한다.
확장 기능은 음악을 분석하거나 좋은 연출을 자동 판정하지 않는다. 실행 권한과 미감 승인은 별개다.

## 연결

프로젝트는 schema_version 3.1.0, extensions ["showreel-v1"]를 선언한다.
기존 `effect PROJECT --id showreel:odometer --spec INPUT --scene SCENE --out NEW_DIR`를 사용한다.
INPUT은 instance, inputs, parameters를 가진다. parameters에는 duration(초), seed, x/y/size,
color/accent/background(hex)를 지정한다. 기존 프로젝트를 덮어쓰지 않는다.
지원 엔진은 Chromium vector-composite/hybrid-composite이며 Skia는 명시적으로 거부한다.
시간/스크롤/정지 출력은 동일한 SVG 계산을 쓴다. 세로 구도는 별도로 작성한다.

## 입력

| ID 접미사 | inputs | 제약 |
|---|---|---|
| odometer | from,to,decimals | 절댓값 1e9 미만, 소수 0..4자리; 부호 전환 포함 |
| data-continuity | items [{id,label,value}],unit,basis | 1..12개, 비음수, actual/hypothetical; 항목과 수치를 유지 |
| device-ui | steps 문자열 배열 | 2..8개 상태; 평면 기기의 원근 표현이며 자유 3D 아님 |
| particle-transfer | from/to 좌표 배열 | 같은 개수, 최대 2048점; 대응 관계는 저자가 지정 |
| glyph-particles | text,from/to 좌표 배열 | 글꼴 윤곽을 샘플링한 좌표 필요; 임의 점을 실제 글자라고 주장하지 않음 |
| jamo-assembly | text | 1..32자; 음절 영역 분할이며 정확한 글리프 자모 분리는 아님. 복합모음/받침/서체 검수 |
| weight-wave,chrome-type | text | 1..32자; 크롬 깊이 제한, angle ±30° |
| isometric | boxes [{x,y,z}] | 최대256개, 서로 다른 정수 격자, z 0..20, angle 0° 초과 90° 미만; 단위 폭 상자만 |
| day-night,prism,dither | {} | 국소 조명/빛/마감용; 디더는 고정 패턴 |
| tilt-shift | svg | 외부참조 없는 안전한 SVG. 위/아래 띠 블러 |
| beat-grid | events 초 배열 | 교정한 음악 사건, 오름차순. 고정 BPM 자동 격자 아님 |
| audio-reactive | envelope [[초,0..1]] | 소리 크기 후보, 박자나 감정의 정답 아님 |
| precomputed-fragments | count,rate | 1..256개, 15..120Hz, 64MiB 상한; 바닥 충돌만, 범용 물리엔진 아님 |

`tests/extensions-fixtures.mjs`는 입력 계약 예제다. 작품 미감의 정답으로 복사하지 않는다.
외부 원문과 22개 대응표는 lib/catalog-sources.mjs 및 vendor/showreel/NOTICE.md를 따른다.

## 마감과 비용

장면 motion_blur: {samples:2 또는 4,shutter:0.5}는 순수 Chromium vector 프로젝트에서만 지원한다.
기본은1회, 하드컷 밖 샘플은 경계 안으로 제한한다. 혼합 엔진/전환 결합은 현재 거부한다.
4회 캡처는 캡처 비용을 늘리므로 대표 컷을 측정하고 사용한다. 시점 교정을 바꾸지 않는다.
사전 계산은 고정 초기값과 단계로 수행하고 시점으로 읽는다. 캐시는 최대64MiB로 제한한다.
전체 렌더 저장 공간 예산과 jobs=1은 그대로다. 코드·설정·폰트·입력 데이터가 캐시 키에 반영된다.

## 비평과 검수

각 장면에 대상/행동, 앞뒤 연결, 기법 선택 이유와 미지원 조합을 적는다.
초안의 가장 약한 장면을 지정하고 문제→변경→같은 시점 비교를 기록한다.
박자마다 전환/줌을 강제하지 않고, 의도한 정지는 production_review.intentional_holds에 시작/끝 초로 적는다.
최종 audit --movie는 선언된 확장에서 밝기 급변/정지/암전 후보를 추가한다.
fix-required와 human-review-required를 구별한다. 휴식/암전이 자동 결함은 아니다.
대비는 단순 단색 배경의 텍스트만 수치화하며 복합 화면은 not-measured다.
검사 통과가 광과민성 안전 인증, 전체 청취, 의미 전달 또는 미감 승인은 아니다.
