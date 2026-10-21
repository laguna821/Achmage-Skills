# 엔진보다 연출
처음 정할 것은 독자가 이해하거나 느껴야 할 것과 그것을 화면에서 일으킬 사건이다. 렌더러는 이 사건을 구현할 수단이다.

| 경로 | 제공 상태 | 적합한 표현 |
|---|---|---|
| SVG + GSAP + CPU Chromium | 공통 렌더/정지/스크롤/영상 | 정밀한 경로·도형·레이어·글자·데이터 |
| Skia CPU glyphs.py | 글자 윤곽을 SVG 자산으로 제작 | 한국어 명조 글자를 분리·가림·외곽선·이동 |
| Canvas2D mesh | 이미지 옵션의 런타임 합성 | 원화 내부의 금속·연기·플라스마 흐름 |
| Skia CPU frames | SVG/text 레이어의 직접 래스터·순차 FFmpeg 출력 | 글자 윤곽·가림·타임라인, Python 선택 의존성 |
| Three.js 0.180.0 + SwiftShader | 선택 spatial-three 개발 시험 경로 | 경량 3D 도로·카메라·접지·가림과 원화 합성, references/spatial.md |
| Blender | 기본 의존성과 기본 검사에서 제외 | 별도로 명시한 고비용 확장 |

glyphs.py는 글꼴 윤곽을 만들고, profile.rasterizer=skia는 skia_frames.py의 시간 함수가 실제 RGBA 프레임을 직접 그려 FFmpeg에 순차 전달한다. SVG/text 레이어만 지원하며 이미지/절차적 물성은 Chromium 경로를 선택한다. 새 엔진을 쓰려면 고정 seed/시점, 장면별 렌더, 캐시·중단·재개, 음원 타임라인, 출력 검사와 비용을 같은 기준으로 검증한다.

Codex는 제공된 내장 이미지 생성 도구가 있을 때 원화를 만들 수 있다. Claude Code는 공통 제작과 제공 자산을 사용한다. 별도 유료 이미지 API나 로컬 생성 모델은 필수로 설치하지 않는다.

# Skia 시간 계약 보강

Skia의 이동·회전·투명도·드로잉 키프레임은 Chromium과 같은
`smooth`, `linear`, `hold`, `out` 계산을 사용한다. 기본값은 기존 `smooth`다.
`timeline_semantics: segments-v1`을 지정한 프로젝트만 속성이 없는 중간
키프레임을 해당 속성의 유지 구간 경계로 취급한다. 기본 프로젝트의 기존
속성별 보간은 유지된다. 순서를 바꾼 시점 계산과 hold 경계는
`tests/skia-timeline.py`에서 검증한다. 이 검사는 렌더된 프레임의 미감 판정이 아니다.
