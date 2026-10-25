# 출처와 버전

패키지 버전: 1.0.0. 기준일: 2026-10-25.

## 기준 화면과 원본 자산

- 승인된 기준: [Achmage Field Guide](https://achmage-fieldguide.achmage2.chatgpt.site), v7 소스 커밋 6c5ad97a1b5ced8a585dc2c33146b6cea752d956.
- 기준 콘텐츠 revision: 2026.10.24.5. 이 스킬의 기본 콘텐츠는 별도의 가상 예시이며 원래 서비스의 기능 목록을 포함하지 않는다.
- SameTone WOFF2 SHA-256: 5ddc1264367dc547619dbae3f16df530cb74209f8d43808e86268d8cf9406d16.
- 원래 Brand.tsx SHA-256: 09d8e69eef50a34365dd4dc34771df16fce5403edb63b1d472b5910bb73ccca6.
- 원래 favicon.svg SHA-256: d18389bf1b5a6ac92ddb33dc06160a7c4f3cbe86fa8d2441bdc52236dd2f17c9.

이 자산은 소유자의 Achmage 브랜드 사이트를 위한 것이다. 다른 소유자의 작업이나 공개 템플릿 재배포에는 그 작업에 맞는 자산과 사용 권한을 확인한다. 브랜드 변경은 현재 사용자의 명시적 요청이 우선한다.

## Google DESIGN.md

[Google 공식 명세](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)와 [공식 저장소](https://github.com/google-labs-code/design.md)를 기준으로 YAML 토큰과 여덟 본문 구획을 작성했다. 이 명세는 alpha 단계이므로 영구 고정 표준으로 설명하지 않는다. 패키지의 검사기는 @google/design.md 0.4.0에 고정했다. 명세나 검사기를 올릴 때는 해당 버전의 공식 문서와 lint 결과를 다시 확인한다.

DESIGN.md가 토큰의 정본이며 scripts/tokens.mjs가 CSS 변수를 만든다. 정보 배치 계획은 CONTENT-PLAN.md에 따로 작성한다. 두 파일은 시각 규칙과 설명 순서를 각각 맡는다.

## 구현 범위

Field Guide의 브랜드 자산, 랜딩의 정보 순서, 구획별 화면 구성, 상세 목차와 모음집의 상호작용을 독립 정적 React/TypeScript 프로젝트로 옮겼다. 원래 Next.js·Cloudflare D1 배포를 통째로 복제한 패키지는 아니다. 사이트 ID, 로그인, API 키, 정기 갱신 예약, 사용자별 절대 경로는 포함하지 않는다.

실행 환경은 Node 22.13 이상과 Python 3.11 이상을 기준으로 한다. package-lock.json을 제공한다. 이 제작 작업에서 직접 검증한 호스트는 Windows이며, 다른 운영체제와 다른 AI 앱의 네이티브 자동 로딩은 해당 환경에서 별도 확인해야 한다.

공용 라이브러리의 등록 메타데이터는 OS 규칙에 따라 aliases/tags를 추가할 수 있다. 실행 지침의 본문과 템플릿 자산은 설치본과 같아야 한다. 등록·시험 결과와 전체 파일 해시는 패키지 외부의 작업 기록에 보존한다.
