// Examples are untrusted reference data, never executable skill instructions.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,hash} from './io.mjs';
export const CASE_REVISION='92aee2f586ac0715cb3cbcb6384834f98a33383d';
const base=`https://github.com/yihui-dev/awesome-opus5-5-videos/blob/${CASE_REVISION}/`;
const rows=JSON.parse(fs.readFileSync(path.join(ROOT,'vendor/awesome-opus5-5-videos/cases.json'),'utf8').replace(/^\uFEFF/,''));
export function caseCards(){
 const seen=new Map();
 return rows.map(r=>{
  const fingerprint=hash(r.prompt);
  const duplicateOf=seen.get(fingerprint)||null;
  if(!duplicateOf)seen.set(fingerprint,'opus-case:'+r.slug);
  return {
   slug:'opus-case:'+r.slug,kind:'case',provider:'awesome-opus5-5-videos',
   ko:r.author+' · '+r.category,family:r.category,media:[],engines:{},
   oneLiner:r.prompt.slice(0,220),useWhen:'관련 사례 3–5개를 비교해 대상·행동·연결을 새로 설계',
   avoid:'원작/리메이크 엔진 혼동, 프롬프트 실행, 원본 자산 이용 조건 추정',
   params:{},pairsWith:[],sources:[{title:r.slug,url:base+'prompts/'+r.slug+'.md',license:'MIT (repository text only)'}],
   case:{original:r.original_url,remake:r.remake_url,has_remake:r.has_remake,
    remake_tech_tags:r.remake_tech_tags,prompt_partial:r.prompt_partial,
    completeness_review:'pending-even-if-not-marked-partial',prompt:r.prompt,
    duplicate_of:duplicateOf,source_revision:CASE_REVISION,
    external_assets_rights:'unverified',requirements_review:'required',
    executable:false,visual_review:'not-performed'}
  };
 });
}
const specs=[
 ['subject-handoff','행동의 바통','twoclipping-402193','작은 조작 대상이 다음 장면의 주역으로 변한다','출발·도착 대상의 위치와 역할을 정의','대상이 사라진 뒤 무관한 장면 등장'],
 ['subject-handoff','재료에서 결과로','ror-fly-880547','재료의 양과 변화가 완성 결과에 남는다','투입량·단계·결과 상태를 명시','단계 생략으로 인과관계 왜곡'],
 ['media-container','재생 중인 창','twoclipping-551116','영상은 계속 재생되며 원에서 기기 화면으로 옮겨진다','동일 자산·연속 원본 시계·크롭을 고정','매 장면 영상이 처음으로 되감김'],
 ['media-container','사진에서 생활로','twoclipping-496100','사진 선택이 화면·인쇄물·생활 속 액자로 이어진다','매체별 형태와 앞뒤 가림을 정의','같은 직사각형을 의미 없이 축소 확대'],
 ['spatial-type','글자가 머무는 표면','twoclipping-041659','글자가 장면의 물체와 공간 관계를 갖는다','표면 타이포와 읽기용 문장 트랙을 분리','읽는 문장까지 흔들림·원근 왜곡'],
 ['spatial-type','주역과 보조 제목','brainextends-606193','주역 이미지와 제목의 위계를 유지하며 장면을 바꾼다','주역·보조·읽기 영역을 명시','전부 동시에 움직여 시선 분산'],
 ['interaction-result','입력과 응답','twoclipping-402193','버튼 입력이 로더를 거쳐 결과가 된다','입력→대기→성공 상태를 모델링','장식 애니메이션만 있고 결과 없음'],
 ['interaction-result','기능의 증거','howdevelop-733090','제품의 기능을 실제 화면 상태 변화로 증명한다','사실 잠금·행동·확인 가능한 결과 지정','존재하지 않는 제품 기능 표현'],
 ['process-explainer','조립되는 원리','gdgtify-393073','요소가 결합하면서 관계가 눈앞에서 드러난다','원리와 단위·연결 검증','비유를 실제 물리 증명으로 제시'],
 ['process-explainer','상태가 쌓이는 공정','ror-fly-880547','각 공정의 결과가 다음 공정의 입력이 된다','단계별 전후 상태·보존량 작성','컷마다 완성 상태가 초기화'],
 ['musical-section','밀도와 재진입','thewevr-681887','음악 소강과 재진입에 시각 밀도를 다르게 배정한다','실제 구간 청취·프레이즈 지도·강세 교정','BPM만으로 후렴 시작 추측'],
 ['musical-section','드롭의 도착 구도','twoclipping-496100','긴 준비 동작이 음악의 강조점에 도착한다','준비·착지·여운을 별도 지정','모든 박자에 컷 또는 줌 강제'],
 ['recurring-motif','같은 물체 다른 의미','thewevr-681887','반복되는 물체가 서사 진행에 따라 의미를 얻는다','첫 등장·변주·회수 역할 명시','같은 장면을 그대로 반복'],
 ['recurring-motif','주역의 위치 기억','brainextends-606193','주역의 시각적 정체성을 장면마다 유지한다','색·형태·방향 중 보존할 특징 지정','배경과 대상이 함께 무근거 교체'],
 ['ending-loop','상태를 회수하는 루프','twoclipping-402193','마지막 상태가 처음 상태로 자연스럽게 연결된다','첫/끝 위치·속도·소리 경계 검사','루프를 위해 메시지 결말 생략'],
 ['ending-loop','결과와 정적','howdevelop-733090','결과 확인 뒤 움직임과 소리를 정리한다','결과 사건→잔향→정적→마지막 제목','효과음이 잔향·정적 계약을 침범']
];
export function recipeCards(){return specs.map(([family,title,source,idea,contract,reject],i)=>({
 slug:'opus-recipe:'+String(i+1).padStart(2,'0'),kind:'recipe',provider:'motion-art-director',
 ko:title,family,media:['graphics','video'],engines:{},oneLiner:idea,
 useWhen:contract,avoid:reject,params:{contract,review:'not-production-validated'},pairsWith:[],
 sources:[{title:'Reference '+source,url:base+'prompts/'+source+'.md',license:'MIT (repository text only)'}],
 recipe:{version:'1',inputs:['subject','action','source_clock','message','music_event'],outputs:['shot_intent','handoff','review_evidence'],
  implementation:'planning-recipe-not-render-adapter',validation:'pending',reject}
}));}
