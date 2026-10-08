#!/usr/bin/env node
import {readFile,writeFile,mkdir,realpath,readdir} from 'node:fs/promises';
import {resolve,join,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {homedir} from 'node:os';
import {randomUUID} from 'node:crypto';
import {coreExecute,fillHwpx,parse,validateHwpx,renderDocument,toArray} from './engine.mjs';
import {finishGongmunHwpx,finalizeHwpxPackage} from './hallym-helpers.mjs';
import {ENGINE,RESEARCH,hash,fail,isEmpty,escapeXml,json} from './common.mjs';
import {routeRequest,publicPack,routes,effectiveRecipe} from './catalog.mjs';
import {validateTemplate,lookup,listLibrary,matchingBinding,register} from './library.mjs';
import {skeleton,generateStyled} from './layout.mjs';
const missingFont=async()=>{
 if(process.platform!=='win32')return true;
 const dirs=[join(process.env.WINDIR||'C:/Windows','Fonts'),join(process.env.LOCALAPPDATA||join(homedir(),'AppData/Local'),'Microsoft/Windows/Fonts')];
 for(const dir of dirs){try{if((await readdir(dir)).some(f=>/^HallymGothic-Regular\./i.test(f)))return false;}catch{}}
 return true;
};
async function artifact(out,name,bytes,type){
 const b=Buffer.from(bytes);const path=join(out,name);await writeFile(path,b,{flag:'wx'});
 return {path,name,bytes:b.length,sha256:hash(b),mimeType:type};
}
async function newOutputDir(out){await mkdir(dirname(out),{recursive:true});await mkdir(out,{recursive:false});}
export async function execute(req){
 const result={schemaVersion:1,jobId:req?.jobId||randomUUID(),engine:ENGINE,skill:{name:'hallym-kordoc',version:'1.0.0-rc.1'},research:RESEARCH,status:'success',success:true,files:[],warnings:[],skipped:{edits:[],fields:[]},failure:null};
 let out,owned=false;const start=performance.now();
 try{
  if(req?.schemaVersion!==1||typeof req.mode!=='string')fail('INVALID_REQUEST','schemaVersion:1과 mode가 필요합니다.');
  if(Number(process.versions.node.split('.')[0])<20)fail('NODE_VERSION','Node 20 이상이 필요합니다.');
  if(req.outputName&&extname(req.outputName).toLowerCase()==='.hwp'||req.format==='hwp')fail('HWP_OUTPUT_FORBIDDEN','한글 출력은 HWPX만 지원합니다.');
  switch(req.mode){
   case 'catalog':result.data=routes.map(({id,title,hints,templateStatus,representative,sourceTerm})=>({id,title,hints,templateStatus,representative,sourceTerm}));break;
   case 'resolve':{
    result.selection=routeRequest(req);
    if(result.selection.needsClarification){result.status='partial';break;}
    const bound=req.template?await lookup(req.template):await matchingBinding(result.selection.familyId,req.context);
    const p=bound||await publicPack(result.selection.familyId);result.templateSource=req.template?'explicit-private':bound?'private-binding':'public';result.recipe=effectiveRecipe(p,req,result.selection);result.templateHash=p.contentHash;result.templateStatus=result.recipe.templateStatus;break;
   }
   case 'doctor':result.data={node:process.version,platform:process.platform,arch:process.arch,missingFonts:await missingFont()?['한림고딕체 Regular']:[],coreStandalone:true,optional:await coreExecute({schemaVersion:1,mode:'capabilities'})};break;
   case 'library-list':result.data=await listLibrary();break;
   case 'template-register':{
    if(req.binding&&!routes.some(r=>r.id===req.binding.familyId))fail('UNKNOWN_FAMILY','연결할 문서군이 없습니다.');
    result.data=await register(req);break;
   }
   case 'template-export':{
    const p=req.template?await lookup(req.template):await publicPack(req.familyId);await validateTemplate(p);
    out=resolve(req.outputDir||'outputs/'+result.jobId);await newOutputDir(out);owned=true;
    result.files.push(await artifact(out,p.id+'.kordoc-template.json',JSON.stringify(p,null,2),'application/json'));result.templateHash=p.contentHash;break;
   }
   case 'compose':{
    const explicit=req.template?await lookup(req.template):null;
    result.selection=explicit?{familyId:explicit.hallym.familyId||req.familyId||'private',reason:'사용자가 지정한 개인 양식',needsClarification:false}:routeRequest(req);
    if(result.selection.needsClarification){result.status='partial';break;}
    const bound=explicit?null:await matchingBinding(result.selection.familyId,req.context);
    const pack=explicit||bound||await publicPack(result.selection.familyId);await validateTemplate(pack);
    result.templateSource=explicit?'explicit-private':bound?'private-binding':'public';
    const recipe=effectiveRecipe(pack,req,result.selection),values=req.values||{},sections=req.sections||{},tables=req.tables||{};
    if(!values||typeof values!=='object'||Array.isArray(values))fail('INVALID_REQUEST','values는 필드 ID별 값 객체여야 합니다.');
    result.templateHash=pack.contentHash;result.templateStatus=recipe.templateStatus;result.recipe={id:recipe.id,title:recipe.title,version:recipe.version,strategy:recipe.strategy,source:recipe.source};
    result.limitations=recipe.limitations||[];
    const unknown=Object.keys(values).filter(k=>!recipe.fields.some(f=>f.id===k));
    const unknownSections=Object.keys(sections).filter(k=>!recipe.sections.includes(k)),unknownTables=Object.keys(tables).filter(k=>!recipe.sections.includes(k));
    result.skipped.fields=unknown;result.skipped.edits=[...unknownSections.map(key=>({key,reason:'UNKNOWN_SECTION'})),...unknownTables.map(key=>({key,reason:'UNKNOWN_TABLE'}))];
    const missing=recipe.fields.filter(f=>f.required&&isEmpty(values[f.id])).map(f=>({id:f.id,label:f.label}));
    const raw=req.markdown??(req.markdownFile?await readFile(req.markdownFile,'utf8'):null);
    if(recipe.strategy==='fixed'&&(raw||Object.keys(sections).length||Object.keys(tables).length))fail('FIXED_FORM_PLAIN_VALUES_ONLY','고정 신청서는 values로 채웁니다. 긴 본문은 보고서 양식을 선택하세요.');
    for(const name of recipe.sections)if(!(raw?new RegExp('^#{1,6}\\s+'+name.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&')+'\\s*$','m').test(raw):!isEmpty(sections[name])||tables[name]))missing.push({id:'section:'+name,label:name});
    result.missingFields=missing;
    let markdown=skeleton(recipe,values,sections,tables,false,req.title),bytes;
    if(raw){markdown=skeleton({...recipe,sections:[],notes:[],signatures:[]},values,{}, {},false,req.title)+'\n'+raw+'\n'+(recipe.notes||[]).join('\n\n')+'\n'+(recipe.signatures||[]).join('\n\n');}
    if(recipe.templateStatus==='common-draft')result.warnings.push({code:'OFFICIAL_FORM_NOT_APPLIED',message:'공식 양식 미적용: 공통 초안입니다.'});
    if(await missingFont())result.warnings.push({code:'FONT_MISSING',message:'한림고딕체 Regular가 없어 다른 글꼴로 표시될 수 있습니다. 한림대 공식 글꼴을 설치하면 조판 일관성이 좋아집니다.'});
    if(recipe.strategy==='fixed'){
     const clean=Object.fromEntries(recipe.fields.filter(f=>!isEmpty(values[f.id])).map(f=>[f.id,String(values[f.id])]));
     const filled=await fillHwpx(toArray(Buffer.from(pack.hallym.templateBase64,'base64')),clean);
     result.skipped.fields.push(...filled.unmatched||[]);result.warnings.push(...filled.warnings||[]);
     const fitted=await finishGongmunHwpx(filled.buffer,{fitFrames:true});
     bytes=Buffer.from((await finalizeHwpxPackage(fitted.data,{footnoteAutoNumbers:true,repeatHeaderRows:true})).data);
    }else if(recipe.strategy==='profile'){
     out=resolve(req.outputDir||'outputs/'+result.jobId);await newOutputDir(out);owned=true;
     const tmp=join(out,'selected.kordoc-template.json');await writeFile(tmp,JSON.stringify(pack),{flag:'wx'});
     const generated=await coreExecute({schemaVersion:1,mode:'template-apply',template:tmp,markdown,images:req.images,outputDir:join(out,'engine'),frozenDate:req.frozenDate,options:req.options});
     result.warnings.push(...generated.warnings);if(generated.status==='failed')fail(generated.failure.code,generated.failure.message,generated);
     if(generated.status==='partial')result.status='partial';bytes=await readFile(join(out,'engine/document.hwpx'));
    }else{
     const generated=await generateStyled(markdown,recipe,req.images||{},req.frozenDate);bytes=generated.bytes;result.warnings.push(...generated.warnings);
     if(generated.missed.length){result.status='partial';result.warnings.push({code:'STYLE_PARTIAL',message:'스타일 적용 일부 누락',items:generated.missed});}
    }
    result.validation=await validateHwpx(bytes);if(!result.validation.ok)fail('INVALID_HWPX','결과 구조 검사 실패',result.validation);
    const readback=await parse(bytes,{images:false});if(!readback.success)fail('READBACK_FAILED',readback.error);
    const flat=s=>String(s).replace(/<[^>]+>/g,' ').replace(/[\s\\*_]/g,'');
    const absent=recipe.fields.filter(f=>!isEmpty(values[f.id])&&!flat(readback.markdown).includes(flat(values[f.id]))).map(f=>f.id);
    if(absent.length){result.status='partial';result.warnings.push({code:'READBACK_VALUE_MISSING',message:'재읽기에서 값이 확인되지 않은 필드',fields:absent});}
    if(!out){out=resolve(req.outputDir||'outputs/'+result.jobId);await newOutputDir(out);owned=true;}
    result.files.push(await artifact(out,'document.hwpx',bytes,'application/hwp+zip'),await artifact(out,'document.md',markdown,'text/markdown'));
    // Drafts must remain identifiable even when separated from the result JSON.
    if(recipe.templateStatus==='common-draft')result.files.push(await artifact(out,'양식-적용-상태.txt','공식 양식 미적용: 공통 초안입니다.\n'+result.limitations.join('\n'),'text/plain'));
    try{
     const rendered=await renderDocument(bytes,{format:'svg'});result.warnings.push(...rendered.scene.warnings||[]);
     const names=[];
     for(const [i,a] of rendered.assets.entries()){const name='preview-'+(i+1)+'.svg';result.files.push(await artifact(out,name,a.data,'image/svg+xml'));names.push(name);}
     const html='<!doctype html><meta charset="utf-8"><title>'+escapeXml(recipe.title)+'</title><style>body{background:#eee;margin:2rem auto;max-width:860px}img{display:block;width:100%;background:white;margin-bottom:1rem}p{font:16px sans-serif}</style><p>'+escapeXml(recipe.templateStatus==='common-draft'?'공식 양식 미적용 · 공통 초안':'재구성한 HWPX 미리보기 · 한컴 조판과 차이가 있을 수 있음')+'</p>'+names.map(n=>'<img src="'+n+'" alt="문서 미리보기">').join('');
     result.files.push(await artifact(out,'preview.html',html,'text/html'));result.validation.preview='generated';
    }catch(e){result.status='partial';result.warnings.push({code:'PREVIEW_FAILED',message:e.message});}
    result.validation.readback=absent.length?'partial':'passed';result.validation.hancom='unverified';
    if(missing.length||result.skipped.fields.length||result.skipped.edits.length)result.status='partial';
    break;
   }
   case 'batch':{
    if(!Array.isArray(req.jobs)||req.jobs.length>100)fail('INVALID_BATCH','100개 이하의 jobs가 필요합니다.');
    out=resolve(req.outputDir||'outputs/'+result.jobId);await newOutputDir(out);owned=true;
    result.results=[];for(const [i,job] of req.jobs.entries())result.results.push(await execute({...job,schemaVersion:1,outputDir:job.outputDir||join(out,'job-'+(i+1))}));
    result.status=result.results.every(x=>x.status==='success')?'success':result.results.every(x=>x.status==='failed')?'failed':'partial';break;
   }
   default:{
    const allowed=['read','ocr','form-analyze','template-analyze','compare','validate','lint','render','crop','tables','patch','redact','seal','capabilities'];
    if(!allowed.includes(req.mode))fail('UNKNOWN_MODE','지원하지 않는 모드: '+req.mode);
    if(['patch','redact','seal'].includes(req.mode)){const b=await readFile(req.input),v=await validateHwpx(b);if(!v.ok)fail('HWP_REFERENCE_ONLY','수정 작업은 HWPX만 지원합니다. HWP는 read로 참고하세요.');}
    return {...await coreExecute(req),skill:result.skill,research:RESEARCH};
   }
  }
 }catch(e){result.status='failed';result.failure={code:e.code==='EEXIST'?'OUTPUT_CONFLICT':e.code==='ENOENT'?'FILE_NOT_FOUND':e.code||'EXECUTION_ERROR',message:e.message,details:e.details};}
 result.success=result.status==='success';result.elapsedMs=Math.round((performance.now()-start)*10)/10;
 if(owned)await writeFile(join(out,'result.json'),JSON.stringify(result,null,2),{flag:'wx'});
 return result;
}
if(process.argv[1]&&await realpath(resolve(process.argv[1])).catch(()=>null)===await realpath(fileURLToPath(import.meta.url))){
 console.log=(...args)=>console.error(...args);
 try{const text=process.argv[2]?await readFile(process.argv[2],'utf8'):await new Promise((yes,no)=>{let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>yes(s));process.stdin.on('error',no);});const r=await execute(JSON.parse(text));process.stdout.write(JSON.stringify(r,null,2)+'\n');process.exitCode=r.status==='failed'?1:r.status==='partial'?2:0;}
 catch(e){process.stdout.write(JSON.stringify({schemaVersion:1,status:'failed',success:false,files:[],failure:{code:'INVALID_REQUEST',message:e.message}})+'\n');process.exitCode=1;}
}
