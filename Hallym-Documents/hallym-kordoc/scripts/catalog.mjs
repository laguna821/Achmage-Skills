import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {JSZip} from './xml.mjs';
import {json,fail} from './common.mjs';
export const root=fileURLToPath(new URL('..',import.meta.url));
const catalog=await json(new URL('../catalog.json',import.meta.url));
let archive;
export const routes=catalog.routes;
export async function publicPack(id){
 const route=routes.find(x=>x.id===id);if(!route)fail('UNKNOWN_FAMILY','알 수 없는 문서군: '+id);
 archive ||= await JSZip.loadAsync(await readFile(new URL('../assets/templates.zip',import.meta.url)));
 const entry=archive.file(route.archiveEntry);if(!entry)fail('MISSING_TEMPLATE','양식이 패키지에 없습니다.');
 const pack=JSON.parse(await entry.async('string'));if(pack.contentHash!==route.packHash)fail('HASH_MISMATCH','카탈로그와 양식 해시가 다릅니다.');
 return pack;
}
const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,'');
const programs=[['pbl',/pbl|hi.?flex|지역사회\s*문제해결/i],['glocal',/글로컬|glocal/i],['rise',/rise|라이즈/i]];
export function routeRequest(req){
 if(req.familyId){const r=routes.find(x=>x.id===req.familyId);if(!r)fail('UNKNOWN_FAMILY','알 수 없는 문서군: '+req.familyId);return {familyId:r.id,reason:'사용자 또는 확인된 요청이 지정한 문서군',candidates:[{id:r.id,score:100}],needsClarification:false};}
 const text=[req.prompt,req.context?.program,req.context?.department,req.context?.purpose,req.context?.stage,req.context?.level].filter(Boolean).join(' '),q=norm(text);
 if(!q)fail('INVALID_REQUEST','prompt 또는 familyId가 필요합니다.');
 const explicit=programs.filter(([,re])=>re.test(text)).map(([id])=>id);
 const funding=norm(req.context?.program);
 const selectedProgram=programs.find(([id])=>norm(id)===funding||id==='glocal'&&funding==='글로컬'||id==='rise'&&funding==='라이즈')?.[0];
 if(explicit.length>1&&!selectedProgram)return {familyId:null,reason:'여러 사업명이 포함되어 적용 사업 확인이 필요합니다.',needsClarification:true,question:'어느 사업의 제출 양식을 적용할까요?',candidates:routes.filter(r=>explicit.includes(r.id.split('.')[0])).map(r=>({id:r.id,title:r.title}))};
 if(/회의록|회의비/.test(text)&&!explicit.length&&!/미디어|학과|학부/.test(text))return {familyId:null,needsClarification:true,reason:'회의록은 사업에 따라 양식이 다릅니다.',question:'학과 일반 회의록인가요, PBL·글로컬·RISE 등 사업 회의록인가요?',candidates:['meeting.media','pbl.meeting','glocal.meeting','rise.program'].map(id=>({id}))};
 const scopeProgram=selectedProgram||explicit[0];
 const scored=routes.map(r=>{
  let score=0;const reasons=[];
  for(const hint of r.hints){const words=hint.toLowerCase().split(/\s+/),n=words.filter(w=>q.includes(norm(w))).length;const s=n===words.length?30+norm(hint).length:n? n*3:0;if(s>score){score=s;reasons[0]=hint;}}
  if(scopeProgram){if(r.id.startsWith(scopeProgram+'.'))score+=18;else if(['pbl','glocal','rise'].includes(r.id.split('.')[0]))score=-100;}
  if(/대학원|박사|석사/.test(text)){if(r.id.startsWith('grad.'))score+=8;else if(r.id.startsWith('central.'))score=-100;}
  if(/학부/.test(text)&&r.id.startsWith('grad.'))score=-100;
  return {id:r.id,title:r.title,score,reasons};
 }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const top=scored[0],next=scored[1];
 if(top.score<20)return {familyId:'report.hallym',needsClarification:false,draftOnly:true,reason:'정확히 대응하는 양식이 없어 공통 보고서 초안으로 진행',candidates:scored.slice(0,3)};
 if(next.score===top.score)return {familyId:null,needsClarification:true,question:'어떤 업무의 문서인가요?',reason:'서로 다른 문서군이 같은 우선순위로 일치합니다.',candidates:scored.filter(x=>x.score===top.score)};
 return {familyId:top.id,needsClarification:false,reason:top.reasons.join(', '),candidates:scored.slice(0,3)};
}
export function effectiveRecipe(pack,req,selection){
 const r=structuredClone(pack.hallym.recipe),q=String(req.prompt||'');
 const variant=!!(q&&r.source&&(r.excludedTerms?.some(x=>q.includes(x))||(r.representativeTerms?.length&&!r.representativeTerms.some(x=>q.includes(x)))));
 const term=req.context?.term||req.values?.term;
 if(variant){
  r.title=req.title||routes.find(x=>x.id===r.id).title+' — 다른 업무 초안';r.strategy='report';r.source=undefined;r.notes=[];r.signatures=[];
  r.fields=[{id:'request.type',label:'요청 업무',required:true},{id:'department',label:'소속',required:true}];r.sections=['요청 내용','신청 사유','필요 서류'];r.templateStatus='common-draft';
 }
 if(variant||selection.draftOnly||r.sourceTerm&&term&&r.sourceTerm!==term){r.templateStatus='common-draft';r.limitations=[...(r.limitations||[]),'공식 양식 미적용: 요청한 업무/학기에 맞는 서식 확인이 필요합니다.'];}
 return r;
}
