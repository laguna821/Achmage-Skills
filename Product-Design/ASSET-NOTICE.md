# 상표와 외부 자산

이 패키지의 기본 라이선스는 Apache-2.0이며, 별도 고지가 없는 신규 코드와 글에 적용됩니다. 아래 외부 자산은 각자의 조건을 따릅니다. 스킬 폴더 안의 같은 내용은 [`apple-hig-design/NOTICE.md`](apple-hig-design/NOTICE.md)에 영어로 있습니다.

## Apple Human Interface Guidelines

- 이 스킬에는 Apple의 글, 이미지, 영상이 들어 있지 않습니다. 규칙 요약, 결정 트리, 컴포넌트 카드, 양식은 모두 직접 쓴 문장입니다. 규칙 ID는 해당 규칙의 첫 단어 최대 여섯 개로 만든 짧은 이름이며, Apple의 지침이 있는 HIG 페이지를 가리킵니다.
- 공개 전 검사(`check-public --final`)로 Apple 원문과 9단어 이상 연속으로 같은 문장이 없음을 확인했습니다.
- `scripts/fetch-hig.mjs`는 Apple 공개 사이트의 HIG를 사용자 자신의 컴퓨터(`.hig-local/`, git 제외)로 내려받아 정확한 문장을 확인하게 합니다. 이 사본은 Apple의 콘텐츠이므로 로컬에만 두고 재배포하지 마세요.
- Apple, iPhone, iPad, Mac, macOS, iOS, iPadOS, watchOS, tvOS, visionOS, Apple TV, Apple Vision Pro, Apple Watch, Liquid Glass, SF Symbols, San Francisco는 Apple Inc.의 상표입니다. 이 프로젝트는 Apple Inc.와 관계가 없으며 Apple의 후원, 승인, 보증을 받지 않았습니다. 이름의 "Apple HIG"는 따르는 지침을 밝히기 위한 표현입니다.
- SF Symbols와 San Francisco 글꼴은 사용하지도, 포함하지도 않습니다. 쇼케이스의 기기 외곽선은 일반 도형이며 Apple 기기 이미지가 아닙니다.

## Lucide 아이콘

`apple-hig-design/assets/icons/lucide/`의 SVG 102개는 Lucide(lucide-static 1.67.0)에서 가져와 하우스 선 굵기로 맞춘 것입니다. Lucide는 ISC 라이선스이고, Feather에서 파생된 아이콘은 MIT 라이선스입니다. 전문은 [`LICENSE`](apple-hig-design/assets/icons/lucide/LICENSE)에 있습니다. 부품 갤러리와 쇼케이스에 인라인으로 넣은 아이콘도 같은 세트입니다.

## Pretendard

Pretendard Variable(SIL Open Font License 1.1, orioncactus)은 jsDelivr CDN(`orioncactus/pretendard@v1.3.9`)에서 불러옵니다. 글꼴 파일은 포함하지 않습니다.

## DESIGN.md

`apple-hig-design/assets/templates/DESIGN.md`는 Google Labs의 공개 형식([google-labs-code/design.md](https://github.com/google-labs-code/design.md), alpha)을 따릅니다. Google의 코드는 포함하지 않으며, 검사 도구는 필요할 때 npx로 실행합니다. Google이 이 스킬을 승인하거나 보증한다는 뜻은 아닙니다.

## 쇼케이스 '하루'

`examples/haru/`의 앱, 문구, 화면 캡처는 이 스킬로 만든 가상의 제품입니다. 같은 이름의 실제 서비스와 관계가 없습니다.
