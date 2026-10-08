import {readFile,writeFile,mkdir,readdir,rename} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {homedir} from 'node:os';
import {coreExecute,extractClickHereFields,validateHwpx,toArray,loadPack} from './engine.mjs';
import {hash,stable,packHash,save,json,fail,ENGINE} from './common.mjs';
export const libraryRoot=()=>resolve(process.env.HALLYM_KORDOC_HOME||join(homedir(),'.hallym-kordoc'),'library');
const safeId=s=>{if(typeof s!=='string'||!/^[a-zA-Z0-9_.-]{1,100}$/.test(s))fail('INVALID_TEMPLATE_ID','양식 ID가 올바르지 않습니다.');return s;};
export async function validateTemplate(pack){
 if(!pack||pack.kind!=='kordoc-template-pack'||pack.schemaVersion!==1||pack.contentHash!==packHash(pack))fail('INVALID_TEMPLATE_PACK','TemplatePack 형식 또는 내용 해시가 올바르지 않습니다.');
 safeId(pack.id);
 if(pack.engine?.version!==ENGINE.version||pack.engine?.commit!==ENGINE.commit)fail('ENGINE_VERSION_MISMATCH','양식 엔진 버전 또는 커밋이 고정 버전과 다릅니다.');
 const h=pack.hallym;if(!h?.recipe||!Array.isArray(h.recipe.fields)||!Array.isArray(h.recipe.sections)||!Array.isArray(h.recipe.notes)||!Array.isArray(h.recipe.signatures))fail('INVALID_TEMPLATE_PACK','한림대 작성 규칙이 없습니다.');
 if(!['fixed','report','minutes','profile'].includes(h.recipe.strategy))fail('INVALID_TEMPLATE_PACK','알 수 없는 생성 방식입니다.');
 if(h.templateBase64){
  const bytes=Buffer.from(h.templateBase64,'base64');if(hash(bytes)!==h.templateSha256)fail('HASH_MISMATCH','HWPX 양식 해시가 다릅니다.');
  const v=await validateHwpx(bytes);if(!v.ok)fail('INVALID_HWPX','양식 HWPX가 손상되었습니다.',v);
  if(h.recipe.strategy==='fixed'){
   const fields=await extractClickHereFields(toArray(bytes)),names=fields.map(f=>f.name);
   if(new Set(names).size!==names.length||new Set(h.recipe.fields.map(f=>f.id)).size!==h.recipe.fields.length)fail('DUPLICATE_FIELD','동일한 이름의 누름틀을 고유 이름으로 변경해야 합니다.');
   if(h.recipe.fields.some(f=>!names.includes(f.id)))fail('UNBOUND_FIELD','누름틀에 연결되지 않은 필드가 있습니다.');
  }
 }else if(h.recipe.strategy==='fixed')fail('INVALID_TEMPLATE_PACK','고정 양식에는 HWPX 원본이 필요합니다.');
 for(const a of pack.assets||[])if(a.name!==a.name.split(/[\\/]/).pop()||hash(Buffer.from(a.base64,'base64'))!==a.sha256)fail('INVALID_ASSET','자산 경로 또는 해시가 올바르지 않습니다.');
 return pack;
}
export async function lookup(ref){
 if(typeof ref==='string'&&/^[a-f0-9]{64}$/.test(ref))return validateTemplate(await json(join(libraryRoot(),'packs',ref+'.json')));
 return validateTemplate(await json(resolve(ref)));
}
export async function listLibrary(){
 const dir=join(libraryRoot(),'packs');let names;try{names=await readdir(dir);}catch(e){if(e.code==='ENOENT')return [];throw e;}
 const out=[];for(const name of names.filter(n=>/^[a-f0-9]{64}\.json$/.test(n))){const p=await validateTemplate(await json(join(dir,name)));out.push({id:p.id,name:p.name,version:p.version,hash:p.contentHash,familyId:p.hallym.familyId});}return out;
}
export async function matchingBinding(familyId,context={}){
 const dir=join(libraryRoot(),'bindings');let names;try{names=await readdir(dir);}catch(e){if(e.code==='ENOENT')return null;throw e;}
 const matches=[];
 for(const name of names){const b=await json(join(dir,name));if(b.familyId===familyId&&Object.entries(b.context).every(([k,v])=>context[k]===v))matches.push(b);}
 if(!matches.length)return null;
 matches.sort((a,b)=>Object.keys(b.context).length-Object.keys(a.context).length);
 const best=matches.filter(b=>Object.keys(b.context).length===Object.keys(matches[0].context).length);
 if(new Set(best.map(b=>b.hash)).size>1)fail('AMBIGUOUS_BINDING','개인 양식 연결이 겹칩니다. 양식 해시를 지정해 주세요.',best);
 return lookup(best[0].hash);
}
export async function register(req){
 let pack;
 if(req.template)pack=await lookup(req.template);
 else{
  const input=resolve(req.input||'');
  const bytes=await readFile(input),v=await validateHwpx(bytes);if(!v.ok)fail('HWPX_REQUIRED','개인 양식 등록은 HWPX만 지원합니다. HWP는 읽기 참고 후 새 HWPX를 작성하세요.');
  const result=await coreExecute({schemaVersion:1,mode:'template-analyze',input,outputDir:req.analysisDir,templateId:safeId(req.templateId),name:req.name,tableRules:req.tableRules||[],roleBindings:req.roleBindings});
  if(result.status==='failed')fail(result.failure.code,result.failure.message,result);
  pack=result.data;
  const click=await extractClickHereFields(toArray(bytes));
  const usage=req.usage||(click.length?'fixed':'profile');
  const fields=req.fields||(usage==='fixed'?click.map(f=>({id:f.name,label:f.name,required:true})):[]);
  if(!['fixed','profile'].includes(usage))fail('INVALID_REQUEST','usage는 fixed 또는 profile입니다.');
  const recipe={id:req.familyId||'private',title:req.name||pack.name,version:req.version||'1.0.0',strategy:usage,fields,sections:req.sections||[],notes:[],signatures:[],templateStatus:'private-unreviewed',limitations:pack.limitations};
  // Never reuse populated reference prose as a default new draft.
  pack.markdownSkeleton=req.markdownSkeleton||'# '+recipe.title+'\n';
  pack.version=recipe.version;pack.hallym={familyId:req.familyId||null,recipe,templateBase64:bytes.toString('base64'),templateSha256:hash(bytes),analysisStatus:result.status};
  pack.contentHash=packHash(pack);await validateTemplate(pack);
 }
 const dir=join(libraryRoot(),'packs');await mkdir(dir,{recursive:true});
 const dest=join(dir,pack.contentHash+'.json');let state='registered';
 try{await save(dest,pack);}catch(e){if(e.code!=='EEXIST')throw e;await lookup(pack.contentHash);state='already-exists';}
 if(req.binding){
  if(!req.binding.familyId)fail('INVALID_BINDING','연결할 문서군이 필요합니다.');
  const binding={familyId:req.binding.familyId,context:req.binding.context||{},hash:pack.contentHash};
  const key=hash(stable({familyId:binding.familyId,context:binding.context})),dir=join(libraryRoot(),'bindings');await mkdir(dir,{recursive:true});
  const path=join(dir,key+'.json'),stage=path+'.'+process.pid+'.tmp';await writeFile(stage,JSON.stringify(binding),{flag:'wx'});await rename(stage,path);
 }
 return {state,hash:pack.contentHash,id:pack.id,library:dest,validation:pack.validation,binding:req.binding||null};
}
