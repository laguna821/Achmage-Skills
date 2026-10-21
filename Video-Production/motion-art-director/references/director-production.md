# 장면을 설계하고 구현을 선택하는 제작

이 문서는 기존 directing/editorial 계약을 대체하지 않고 제작 순서를 연결한다. 새 장편은 기획 단계에서 이 문서와 subject-understanding, preproduction만 먼저 적용한다. 구현을 시작할 때 선택 엔진·매체 문서를 읽고, 검토 시 editorial-review와 quality를 읽는다. 도감 전체를 기획 컨텍스트에 넣지 않는다.

## 1. 이야기와 장면
질문 → 관객의 이해 변화 → 결말을 `director_brief`에 기록한다(version: director-brief-v1; question, audience_change, resolution). 컷 목록은 기존 editorial_plan.shots 하나만 유지한다. 각 shot.direction에 composition_reason, medium_reason, attention_from, attention_to, omission_cost를 작성한다. 새 구도 후보는 도입·원리·절정·결말처럼 중요한 판단에만 만든다. 후보 이미지는 글로만 설명하지 않고 실제 대상 위치와 글자 크기를 그린다.

반복을 금지하거나 배치 종류 수를 채우지 않는다. 같은 대상의 새 상태를 보여주는가, 이 컷을 빼거나 옮겼을 때 이해가 달라지는가를 확인한다. 변형 함수나 완성 패널부터 배정하고 의미를 사후 작성하지 않는다. 경로·가림·글자·원근·시간 계산은 재사용해도 장면의 완성 구도를 기본 템플릿으로 강제하지 않는다.

## 2. 음악과 콘티
새 작화에서는 텍스트의 align과 확대·회전의 pivot을 의도한 좌표로 명시한다. 생략 시 런타임은 각각 가운데 정렬과 캔버스 중심을 사용한다. 이는 자동 오류 판정 대신 실제 경계 확인을 요청하는 경고다. 소재 이름도 화면의 사실로 취급하지 않는다. 장치의 실제 동작이 설명과 다르면 장면의 역할을 수정한다.

이미 선택한 음악은 concept의 music_selection={status:'selected',by:'user'|'delegated-direction',reason:...}, preferred_music_id로 보존한다. 이 경우 한 곡도 유효하며 후보를 다시 고르도록 강제하지 않는다. 직접 그린 콘티는 section.origin='authored-storyboard', creator, authorship_note로 출처를 기록한다. image_mode='authored-frame'이면 제목 상자나 사진 패널을 덧씌우지 않고 그린 화면 그대로 축소한다. 이미지에 인용·외부 자산이 있으면 그 권리 기록은 별도로 유지한다.

압축 개요 영상은 시퀀스 비율을 보존하지만 최종 컷 타이밍을 검증하지 않는다. 본편의 구체 컷은 실제 음악의 프레이즈와 동작·문장 시간을 따로 설계한다. 중요한 변화는 전·접촉·후의 실제 프레임과 연속 움직임으로 확인한다. 소재가 작거나 동작이 틀리면 재탐색/재설계하고, 작게 넣는 패널을 자동 처방하지 않는다.

## 3. 설명을 가리고 검토
`director-review PROJECT --movie FINAL.mp4 --out NEW_FOLDER`는 실제 인코딩 영상에서 해당 프레임을 순차 디코딩해 대조표에 붙인다. 입력 fps와 총 프레임 수가 프로젝트와 맞아야 하며 이전 증거를 덮어쓰지 않는다. 이 경우 관찰 파일에도 movie_sha256을 기록한다. 프로젝트나 영상 해시가 다르거나 증거가 누락된 관찰은 완료 수에서 제외한다.

`director-review PROJECT --out NEW_FOLDER`는 기존 shot intent의 전/접촉/후를 실제 프레임 번호로 추출한 대조표를 만든다. 새 JSON 스키마를 채웠다는 사실이 미감 합격은 아니다. 실제 컷을 먼저 보고 관찰한 사건을 기록한 뒤 기획 의도를 펼쳐 비교한다. 프레임뿐 아니라 해당 연속 구간과 전편도 재생한다. 텍스트 자체가 정보인 장면은 숨김 검사와 별도로 읽기를 확인한다.

선택 observations 파일(version: director-observations-v1)은 report.fingerprint와 shots를 가진다. 각 기록은 scene_id, observed_without_copy, intent_comparison, status(observed/needs-revision/not-observed), evidence, reviewer를 담는다. `--observations FILE`로 대조한다. 소스·화면·음악이 바뀌면 기존 관찰은 stale로 처리한다. observed는 관찰 수행이며 사용자 승인이나 예술적 합격이라는 뜻이 아니다.

절단/봉합/수정 주장이 전체 물체의 위치·크기만 바꾼 레이어에 연결되면 검토 후보로 표시한다. 여러 조각을 실제로 맞추는 번역 이동도 있으므로 자동 실패시키지 않는다. 기하 겹침, 의미 전달, 전체 리듬과 실제 청취를 별도로 남긴다.

명시적 자율 제작 위임이 있으면 이 판단을 내부에서 수행한다. 사용자 검토를 추가 요구하거나 자체 판단을 사용자 미감 승인으로 기록하지 않는다. 최종 작품과 비교 근거를 함께 전달한다.
