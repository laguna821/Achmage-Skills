---
name: achmage-portfolio-site
description: "Build or refine Achmage-branded personal portfolio and learning websites (포트폴리오 사이트, 필드 가이드 스타일 웹사이트, 학습 사이트) using the approved Field Guide template, from source-backed information architecture and Google DESIGN.md to bilingual implementation and browser review. Use for the owner's portfolio-style websites or an explicit request for the Field Guide style; preserve an explicitly requested different brand or existing stack."
metadata:
  version: "1.0.0"
  short-description: "Achmage 포트폴리오의 정보 설계·제작·화면 검수"
---

# Achmage Portfolio Site

2026-10-25 사용자가 선택한 기본값: 기획부터 구현·검수까지, Field Guide v7을 표준 템플릿으로, Achmage 공용 스킬로 사용한다.

**Design.md posture**: produces and consumes.

## 시작

1. 현재 요청, 대상 프로젝트, 독자, 제공 자료와 기존 화면을 확인한다. 이미 정한 브랜드·배포 요청은 다시 묻지 않는다.
2. 새 사이트는 아래 템플릿을 사용한다. 기존 프로젝트는 기술 환경을 유지하며 필요한 화면과 토큰을 이식한다. Field Guide의 서비스 설정이나 내용을 복제하지 않는다.
3. 먼저 [[references/information-and-writing|정보 배치·글쓰기]]를 읽고 프로젝트에 정보 배치표를 만든다. 자료에서 확인되지 않는 성과·수치·날짜를 채워 넣지 않는다.
4. 동봉한 assets/template/DESIGN.md를 프로젝트의 DESIGN.md로 사용하고 [[references/design-and-responsive|디자인·반응형 규칙]]을 읽는다. 현재 사용자의 명시적 선택 → 이 프로젝트 DESIGN.md → 이 템플릿 → 일반 참고 스킬 순으로 판단한다.

## 만드는 순서

### 자료에서 화면으로

자료별로 출처, 공개 가능한 범위, 독자에게 설명할 내용을 정리한다. 각 페이지의 구획마다 독자의 질문 → 설명 → 구체적 사례 → 근거 → 다음 링크를 계획한다.

기본 흐름은 소개/구체적 사용 장면 → 전체 모음집 → 읽기 경로 → 전체 구조 → 상세 목차 → 제작 과정/원문이다. 자료가 없는 선택 메뉴는 숨긴다. 내용을 줄여 빈 카드를 채우거나 같은 카드 구성을 모든 절에 반복하지 않는다.

상세 설명은 초보자에게도 상황·주체·행동·결과가 이어지게 쓴다. 보조 도구가 필요하면 설치된 ach-writing-system-v7과 Korean humanizer의 해당 지침을 읽어 적용한다. 이 스킬의 [[references/information-and-writing|글쓰기 계약]]은 외부 스킬이 없어도 적용할 수 있다.

### 구현

새 폴더를 만드는 명령:

    python /path/to/achmage-portfolio-site/scripts/scaffold.py --dest /absolute/new-project

목적지가 비어 있지 않으면 스크립트가 중단한다. 기존 프로젝트에는 생성하지 말고 필요한 파일을 개별적으로 이식한다. 출력은 소스이며 의존성 설치나 외부 배포를 자동 실행하지 않는다.

생성한 프로젝트에서 content/portfolio.json을 수정한다. src/model.ts가 콘텐츠 형식을 정의한다. 콘텐츠, 목차, 검색, Markdown과 원문 다운로드는 같은 데이터에서 만들어진다. src/Portfolio.tsx의 페이지별 구성과 스타일은 기본값으로 유지한다.

Node 22.13+ 환경에서 package-lock.json에 고정된 의존성을 설치하고 다음을 실행한다. Windows는 npm.cmd를 사용할 수 있다.

    npm ci --ignore-scripts --no-audit --no-fund
    npm run check
    npm run design:lint
    npm run build
    npm run dev -- --port 4173

현재 호스트의 자원관리 규약이 있으면 설치·빌드와 임시 미리보기를 그 규약으로 실행한다. 스킬 내부에 사용자의 workId, 실행 ID나 절대 경로를 박아 넣지 않는다.

### 도식과 그림

[[references/visuals|시각자료 지침]]을 필요한 때 읽는다. 구조 도식은 승인된 Pele 흐름, 설명 그림은 실제 CMDS illustration 템플릿, 증거 화면은 실제 캡처로 구분한다. 추상적인 그림으로 설명을 대신하지 않는다. 도구가 없으면 해당 제작 단계를 미완료로 표시하고 설명 글부터 완성한다.

### 검수

[[references/review-and-delivery|검수·전달]]을 읽고 실제 메뉴, 목차, 언어 전환, 검색, 원문, 좁은 화면을 확인한다. UI/UX Pro Max와 Impeccable은 필요한 정보 위계·상호작용·접근성·마감 점검에 한정한다. 별도 폰트·다크 히어로 강제·장식 이미지 수량 규칙이 이 템플릿을 덮어쓰지 않게 한다.

## 산출물과 완료

- 출처가 연결된 정보 배치표와 프로젝트 DESIGN.md.
- 내용이 교체된 실행 가능한 사이트 소스 및 정적 빌드.
- 필요한 도식·이미지와 캡션·대체 텍스트·출처.
- 실제 수행한 검사, 남은 문제, 전달 URL 또는 파일.

배포는 해당 요청과 기존 프로젝트의 배포 규약에 따른다. 배포를 요청받았다면 검수 후 그 작업까지 완료하고 공개 내용을 다시 확인한다. 새 정기 자동화·이미지 보관·외부 계정 연결은 자동으로 추가하지 않는다.

## 패키지 경계

이 스킬은 사용자가 소유한 브랜드의 포트폴리오·학습 사이트용이다. 발표·쇼핑몰·업무 대시보드·다른 기관의 브랜드를 무조건 이 템플릿으로 바꾸지 않는다. 이름에 Achmage MCP를 강제하지 않는다.

[[references/provenance|출처와 버전]]에 템플릿의 기준 공개본·원본 자산 해시·검증 범위를 기록한다. 공용 정본과 설치본의 실행 본문·자산은 같게 유지한다. 공용 OS의 aliases/tags는 등록 메타데이터로만 추가한다. 플러그인 캐시와 기존 Master-Skills 원문을 수정하지 않는다.
