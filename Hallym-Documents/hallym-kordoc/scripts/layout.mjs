import {readFile} from 'node:fs/promises';
import {JSZip} from './xml.mjs';
import {markdownToHwpx,validateHwpx,extractClickHereFields,toArray} from './engine.mjs';
import {builtinGongmunStyle,prepareGongmunMarkdown,finishGongmunHwpx,finalizeHwpxPackage} from './hallym-helpers.mjs';
import {cell,escapeXml,fail,isEmpty} from './common.mjs';
export const token=id=>'HALLYM_FIELD_'+id.replaceAll('.','_DOT_');
export function skeleton(recipe,values={},sections={},tables={},blank=false,title){
 const lines=['# '+(title||recipe.title),''];
 if(recipe.strategy==='report')lines.push('> '+cell(values.purpose||((title||recipe.title)+'에 필요한 내용과 근거를 정리하고자 함.')),'');
 if(recipe.templateStatus==='common-draft')lines.push('공식 양식 미적용 · 공통 초안','');
 if(recipe.fields.length)lines.push('| 항목 | 내용 |','| --- | --- |');
 for(const f of recipe.fields)lines.push('| '+cell(f.label)+' | '+(blank?token(f.id):cell(isEmpty(values[f.id])?'[미입력: '+f.label+']':values[f.id]))+' |');
 for(const name of recipe.sections){
  lines.push('','## '+name,'',sections[name]||(!tables[name]?'[작성 필요: '+name+']':''));
  if(tables[name]){
   const columns=recipe.tables?.[name]||tables[name].columns,rows=Array.isArray(tables[name])?tables[name]:tables[name].rows;
   if(!columns?.length||!Array.isArray(rows)||rows.some(row=>!Array.isArray(row)||row.length!==columns.length))fail('TABLE_RULE_MISMATCH','표 열 수가 일치하지 않습니다: '+name);
   lines.push('| '+columns.map(cell).join(' | ')+' |','| '+columns.map(()=>'---').join(' | ')+' |',...rows.map(row=>'| '+row.map(cell).join(' | ')+' |'));
  }
 }
 if(recipe.notes.length)lines.push('','## 안내 및 첨부','',...recipe.notes.flatMap(x=>[x,'']));
 if(recipe.signatures.length)lines.push('','## 서명','',...recipe.signatures.flatMap(x=>[x,'']));
 return lines.join('\n').trim()+'\n';
}
export async function generateStyled(markdown,recipe,images={},frozenDate){
 // Institution-authored notices are literal text. The engine's outline cleanup
 // removes trailing commas/codes; keep these paragraphs outside that transform.
 const literals=[];let authored=markdown;
 for(const text of [...recipe.notes||[],...recipe.signatures||[]]){
  const literalParagraph=new RegExp('^'+text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$','m');
  if(!literalParagraph.test(authored))continue;
  const replacement=text.split('\n').map(line=>{
   if(!line.trim())return '';
   const token='HALLYM_LITERAL_'+String(literals.length).padStart(6,'0');
   if(markdown.includes(token))fail('RESERVED_LITERAL_TOKEN','예약된 내부 표식을 포함한 원고입니다.');
   literals.push({token,line});return token;
  }).join('\n\n');
  authored=authored.replace(literalParagraph,()=>replacement);
 }
 const style=structuredClone(builtinGongmunStyle(recipe.strategy==='report'?'builtin:hallym-aicr':'builtin:hallym-ilsong'));
 // Public defaults use the freely available university Gothic font. Do not bundle fonts.
 style.options.fonts={body:'한림고딕체 Regular',heading:'한림고딕체 Regular',ref:'한림고딕체 Regular',table:'한림고딕체 Regular'};
 for(const l of Object.values(style.options.levels||{}))if(l.font)l.font='한림고딕체 Regular';
 style.options.cover=false;
 const prepared=prepareGongmunMarkdown(authored,{preset:style.preset,numbering:style.options.numbering,h2Marker:style.options.h2Marker,...style.outline});
 const imageBytes={};for(const [name,p] of Object.entries(images))imageBytes[name]=typeof p==='string'?await readFile(p):p;
 for(const m of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g))if(!m[1].startsWith('data:')&&!imageBytes[m[1]])fail('MISSING_ASSET','이미지 파일이 없습니다: '+m[1]);
 const warnings=[];let bytes=await markdownToHwpx(prepared.markdown,{gongmun:{preset:style.preset,...style.options},images:imageBytes,warnings});
 if(literals.length){
  const zip=await JSZip.loadAsync(bytes),counts=new Map(literals.map(x=>[x.token,0]));
  for(const entry of Object.values(zip.files).filter(f=>/^Contents\/section\d+\.xml$/.test(f.name))){
   let xml=await entry.async('string');
   for(const {token,line} of literals){const needle='<hp:t>'+token+'</hp:t>';counts.set(token,counts.get(token)+xml.split(needle).length-1);xml=xml.replaceAll(needle,'<hp:t>'+escapeXml(line)+'</hp:t>');}
   zip.file(entry.name,xml);
  }
  if([...counts.values()].some(n=>n!==1))fail('LITERAL_TEXT_NOT_APPLIED','필수 문구의 정확한 적용을 확인하지 못했습니다.',Object.fromEntries(counts));
  bytes=await zip.generateAsync({type:'nodebuffer'});
 }
 const spec={...style.finish,fitFrames:true};delete spec.cover;
 // HanMark's substitutions target particular engine marker classes, not all lists.
 if(spec.markers){
  const markerPatterns={legal1:/^[가-힣]\.$/u,legal2:/^\d{1,2}\)$/u,legal3:/^[가-힣]\)$/u,legal4:/^\(\d{1,2}\)$/u,legal5:/^\([가-힣]\)$/u,legal6:/^[①-⑳]$/u,legal7:/^[㉮-㉻]$/u,box0:/^□$/u,box1:/^[○ㅇ]$/u,box2:/^-$/u,box3:/^ㆍ$/u};
  const zip=await JSZip.loadAsync(bytes);let applies=false;
  for(const entry of Object.values(zip.files).filter(f=>/^Contents\/section\d+\.xml$/.test(f.name))){
   const xml=await entry.async('string');
   for(const match of xml.matchAll(/<hp:p\b[^>]*><hp:run charPrIDRef="\d+"><hp:t>([^<]{1,6})<hp:tab\b/g))if(Object.keys(spec.markers).some(k=>markerPatterns[k]?.test(match[1])))applies=true;
  }
  if(!applies)delete spec.markers;
 }
 if(prepared.paragraphs.some(p=>p.depth>0))spec.paragraphs=prepared.paragraphs;
 const finished=await finishGongmunHwpx(toArray(Buffer.from(bytes)),spec);
 const missed=finished.missed.filter(x=>x!=='tableHeader'||/^\s*\|.*\|/m.test(markdown)||/<table\b/i.test(markdown));
 const finalized=await finalizeHwpxPackage(finished.data,{footnoteAutoNumbers:true,repeatHeaderRows:true});
 const result=Buffer.from(finalized.data),validation=await validateHwpx(result);
 if(!validation.ok)fail('INVALID_HWPX','생성된 HWPX 구조 검사 실패',validation);
 return {bytes:result,warnings,missed,validation,frozenDate};
}
export async function fixedTemplate(recipe){
 const built=await generateStyled(skeleton(recipe,{}, {},{},true),recipe);
 const zip=await JSZip.loadAsync(built.bytes);let seq=700000;
 const counts=new Map(recipe.fields.map(f=>[f.id,0]));
 for(const entry of Object.values(zip.files).filter(x=>/^Contents\/section\d+\.xml$/.test(x.name))){
  let xml=await entry.async('string');
  for(const f of recipe.fields){
   const literal='<hp:t>'+token(f.id)+'</hp:t>';
   const id=++seq,field='<hp:ctrl><hp:fieldBegin id="'+id+'" type="CLICK_HERE" name="'+escapeXml(f.id)+'" editable="1" dirty="0"/></hp:ctrl><hp:t> </hp:t><hp:ctrl><hp:fieldEnd beginIDRef="'+id+'"/></hp:ctrl>';
   const count=xml.split(literal).length-1;counts.set(f.id,counts.get(f.id)+count);xml=xml.replaceAll(literal,field);
  }
  zip.file(entry.name,xml);
 }
 if([...counts.values()].some(n=>n!==1))fail('FIELD_AUTHORING_FAILED','각 필드는 하나의 텍스트 run이어야 합니다.',Object.fromEntries(counts));
 const finalized=await finalizeHwpxPackage(toArray(await zip.generateAsync({type:'nodebuffer'})),{footnoteAutoNumbers:true,repeatHeaderRows:true});
 const bytes=Buffer.from(finalized.data),fields=await extractClickHereFields(toArray(bytes));
 if(fields.length!==recipe.fields.length||new Set(fields.map(f=>f.name)).size!==fields.length)fail('DUPLICATE_FIELD','누름틀 고유성 검사 실패',fields);
 const v=await validateHwpx(bytes);if(!v.ok)fail('INVALID_HWPX','누름틀 양식 검사 실패',v);
 return bytes;
}
