# 공문서 작성과 확인

9개 프리셋은 official, report, plan, notice, minutes, gaejosik, ministry, bangchim, press다. 사용자 목적에 맞는 프리셋을 먼저 고르고 옵션은 고정 엔진의 실제 타입을 따른다. 세부 옵션이 불확실하면 이 스킬의 node_modules/kordoc/dist/index.d.ts에서 해당 타입을 찾아 확인한다.

report 문서는 제목 직후 인용문(>) 또는 gongmun.summary에 3줄 이내의 보고 목적을 넣는다. 예: “자료 분석 결과를 공유하고 다음 추진 일정을 확정하고자 함”. 요약 누락 경고가 오면 내용을 보완해 새 출력 폴더로 다시 실행한다. plan은 목적·추진 방향·세부 계획·일정, minutes는 회의 정보·안건·결정·후속 조치를 실제 자료에 따라 작성한다. 기관명·결재자·문서 번호·날짜는 사용자가 제공한 값만 쓰고 미확정값은 표시한다.

gaejosik, ministry, bangchim 등 표지 날짜가 자동으로 들어가는 프리셋은 frozenDate 또는 gongmun.cover.date를 반드시 고정한다. 원본 양식을 그대로 유지해야 하면 fill/patch를 선택하고, 분량·목차·표 행 수가 달라지는 보고서는 TemplatePack과 Markdown으로 생성한다.

표·차트·수식·이미지의 조판과 파일 검사는 실행기가 처리한다. 차트는 엔진 chart DSL을 사용한다. 예:

```chart
type: column
cat: 1분기, 2분기
참여자: 30, 45
```

수식 HWPX 개체와 일부 그림·중첩 구조는 미리보기에서 동일하게 재현되지 않을 수 있다. 엔진 경고와 실제 지원 범위를 확인하고, 생략된 개체가 있으면 partial로 전달한다. 한컴 열기·편집·저장은 구조 검사와 별도로 확인한다.

이 지침은 고정 kordoc 커밋 969526345dde7d6acd2f2bfd3c8e592069333355의 공문서 API와 기존 gongmunseo 스킬을 실행 인터페이스에 맞춰 정리했다. upstream MIT 고지는 배포 패키지의 node_modules/kordoc/LICENSE에 있다.

