import {mediaErrors} from './media.mjs';
import {cameraErrors} from './camera31.mjs';
import {spatialErrors} from './spatial.mjs';
import path from 'node:path';
import fs from 'node:fs';
import {hash,read,write,ROOT} from './io.mjs';
import {directionCheck} from './direction.mjs';
import {editorialCheck} from './editorial.mjs';
import {audioErrors} from './audio.mjs';
import {musicDirectionAudit} from './music-direction.mjs';
export const ROUTES=['video-editing','promo','shorts','newsletter','infographic','thumbnail','deck-and-site'];
export const MODES=['crystal','liquid','smoke','star','flight','network','board','route','door','proposal','rebuke','path','data','composite'];
const safeSvg=x=>typeof x==='string'&&!/<(?:script|image|feImage|foreignObject|iframe|style)\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)/i.test(x);
export const approvalHash=p=>hash({...p,approval:undefined,status:undefined});
export function validate(p){
 const errors=[],warn=[],check=(v,m)=>{if(!v)errors.push(m);};
 if(!p||typeof p!=='object')return {ok:false,errors:['project object required'],warnings:[]};
 for(const name of ['scenes','content_units','sources','events','routes','required_content_ids'])check(Array.isArray(p[name]),name+' must be an array');
 if(p.assets!==undefined)check(Array.isArray(p.assets),'assets must be an array');
 if(errors.length)return {ok:false,errors,warnings:warn};
 check(typeof p.title==='string'&&p.title.length>0&&typeof p.direction==='string'&&p.direction.length>0,'title and direction required');
 check(p.renderer===undefined||['cinematic','vector-composite','image-composite','spatial-three','hybrid-composite'].includes(p.renderer),'unknown renderer');
 check(p.timeline_semantics===undefined||['segments-v1'].includes(p.timeline_semantics),'unknown timeline semantics');
 check(p.profile?.rasterizer===undefined||['chromium','skia'].includes(p.profile.rasterizer),'unknown rasterizer');
 check(['3.0.0','3.1.0'].includes(p.schema_version),'schema_version must be 3.0.0 or 3.1.0');check(p.renderer!=='hybrid-composite'||p.schema_version==='3.1.0','hybrid requires 3.1.0');check(/^[a-z0-9-]+$/.test(p.project_id),'safe project_id required');
 check(['strict_svg','procedural_only','licensed_media'].includes(p.visual_policy),'visual_policy required');
 check(p.renderer!=='image-composite'||p.visual_policy==='licensed_media','image composite requires licensed_media');
 check(p.render_network==='local_only','baseline requires local_only');check(Number.isInteger(p.seed),'integer seed required');
 check(p.profile?.jobs===1&&p.profile?.gpu===false,'baseline: jobs=1, gpu=false');
 check(p.output?.fps===30&&p.output?.width===1920&&p.output?.height===1080,'default final must be 1080p30; use explicit alternative profile for changes');
 check(Array.isArray(p.routes)&&p.routes.length>0&&p.routes.every(r=>ROUTES.includes(r)),'valid output routes required');
 check(new Set((p.assets||[]).map(a=>a.asset_id)).size===(p.assets||[]).length,'duplicate asset identity');
 const units=new Map((p.content_units||[]).map(c=>[c.content_id,c])),events=new Map((p.events||[]).map(e=>[e.event_id,e]));
 check(units.size===(p.content_units||[]).length,'duplicate content id');check(events.size===(p.events||[]).length,'duplicate event id');
 for(const c of units.values()){check(typeof c.display_text==='string'&&c.display_text.length>0,'empty text '+c.content_id);check(!c.copy_lock||c.display_text===c.source_text,'locked text changed '+c.content_id);check((p.sources||[]).some(s=>s.source_id===c.source_ref),'missing source '+c.content_id);}
 let cursor=0;const covered=new Set();
 for(const s of p.scenes||[]){
  const renderer=s.renderer||p.renderer,rasterizer=s.rasterizer||p.profile?.rasterizer;check(p.schema_version==='3.1.0'||s.renderer===undefined,'scene renderer requires 3.1.0');
  check(s.rasterizer===undefined||['chromium','skia'].includes(s.rasterizer),'unknown scene rasterizer');
  if(['vector-composite','hybrid-composite'].includes(renderer))check(!!s.composition,'vector renderer needs a composition');
  if(rasterizer==='skia')check(['vector-composite','hybrid-composite'].includes(renderer)&&!!s.composition,'Skia needs a vector composition');
  check(s.start===cursor&&Number.isInteger(s.end)&&s.end>s.start,'scene continuity '+s.id);cursor=s.end;
  if(s.transition_in){check((renderer==='hybrid-composite'?['fade','wipeleft','wiperight','circleopen','wipe-x','wipe-y','iris']:['wipe-x','wipe-y','iris']).includes(s.transition_in.kind)&&Number.isFinite(s.transition_in.duration)&&s.transition_in.duration>0&&s.transition_in.duration<=2,'invalid scene transition');check(['vector-composite','hybrid-composite'].includes(renderer)&&(renderer==='hybrid-composite'||rasterizer!=='skia'),'authored transitions require Chromium vector or hybrid compositor');}
  check(MODES.includes(s.mode)||s.custom_svg,'unknown scene mode '+s.id);
  if(renderer==='image-composite'){check(['crystal','liquid','smoke','star'].includes(s.mode)||s.composition,'image renderer needs an authored composition');if(!s.composition)check((p.assets||[]).some(a=>a.asset_id===s.art_asset&&a.kind==='raster'),'missing scene art asset '+s.id);}

  for(const composition of [s.composition,s.portrait_composition].filter(Boolean)){
   if(composition.camera){check(p.schema_version==='3.1.0'&&renderer==='hybrid-composite','common footage/graphic camera requires 3.1 hybrid compositor');for(const error of cameraErrors(composition.camera))check(false,error);}
   const layers=Array.isArray(composition.layers)?composition.layers:[];
   if(rasterizer==='skia')check(['vector-composite','hybrid-composite'].includes(renderer)&&layers.every(l=>['svg','text','video'].includes(l.kind)),'Skia supports vector svg/text compositions');
   check(['image-composite','vector-composite','spatial-three','hybrid-composite'].includes(renderer)&&Array.isArray(composition.layers)&&composition.layers.length>0&&composition.layers.length<=64,'composition requires supported renderer and at most 64 layers');
   if(composition.defs)check(safeSvg(composition.defs),'unsafe SVG definitions');
   check((s.content_ids||[]).every(id=>layers.some(l=>l.kind==='text'&&l.content_id===id)),'composition must show editable required text '+s.id);
   for(const l of layers){
    check((renderer==='hybrid-composite'?['svg','text','procedural','video']:['vector-composite','spatial-three'].includes(renderer)?['svg','text','procedural']:['image','text']).includes(l.kind),'invalid layer kind');
    if(renderer==='spatial-three'&&p.spatial?.version!=='precision-1'){
     check(!composition.defs,'spatial overlay definitions are not implemented');
     check(['svg','text'].includes(l.kind),'spatial overlay supports svg/text only');
     check(!l.morph&&!l.clip_path&&!l.blend&&!l.reveal_rect,'spatial overlay does not implement morph/clip/blend/reveal');
     const unsupported=['scaleX','scaleY','rotation','draw','reveal','pivot'];
     check(unsupported.every(n=>l[n]===undefined&&(l.keyframes||[]).every(k=>k[n]===undefined)),'unsupported spatial overlay transform');
     check((l.keyframes||[]).every(k=>k.weight===undefined&&k.size===undefined),'spatial overlay has static weight/size');
     check((l.keyframes||[]).every(k=>k.ease!=='out'),'spatial overlay out easing is not implemented');
     check(l.kind!=='text'||l.scale===undefined&&(l.keyframes||[]).every(k=>k.scale===undefined),'spatial text scale not implemented');
    }
    if(['vector-composite','spatial-three','hybrid-composite'].includes(renderer))check(l.clip_path===undefined&&l.blend===undefined,'vector overlays do not implement clip_path/blend; author SVG defs and clip instead');
    if(l.kind==='svg'&&!l.morph)check(safeSvg(l.svg),'unsafe vector layer');
    if(l.kind==='procedural')check(MODES.includes(l.mode)&&l.mode!=='composite','unknown procedural layer');
    if(l.morph){let previous=-1,signature=null;for(const k of l.morph){const sig=String(k.d).replace(/-?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi,'#').replace(/[\s,]+/g,'');check(Number.isFinite(k.at)&&k.at>=0&&k.at>previous&&/^[MmLlHhVvCcSsQqTtAaZz0-9., +\-]+$/.test(k.d),'invalid path morph');check(signature===null||sig===signature,'morph topology must match');signature=sig;previous=k.at;}}
    for(const name of ['x','y','scale','scaleX','scaleY','rotation','opacity','size','weight','tracking','draw','reveal'])check(l[name]===undefined||Number.isFinite(l[name]),'non numeric layer value');
    for(const candidate of [l,...(l.keyframes||[])])for(const name of ['opacity','draw','reveal'])check(candidate[name]===undefined||Number.isFinite(candidate[name])&&candidate[name]>=0&&candidate[name]<=1,'layer '+name+' outside 0..1');
    if(l.reveal_rect)check(Array.isArray(l.reveal_rect)&&l.reveal_rect.length===4&&l.reveal_rect.every(Number.isFinite)&&l.reveal_rect[2]>0&&l.reveal_rect[3]>0,'invalid reveal rectangle');
    if(rasterizer==='skia')check(!l.reveal_rect&&!['scaleX','scaleY','reveal'].some(n=>l[n]!==undefined||(l.keyframes||[]).some(k=>k[n]!==undefined)),'Skia does not yet support anisotropic/reveal layers; select Chromium');
    for(const [name,length] of [['rect',4],['position',2],['pivot',2]])check(l[name]===undefined||Array.isArray(l[name])&&l[name].length===length&&l[name].every(Number.isFinite),'invalid layer geometry');
    if(l.kind==='text'&&l.content_id)check(units.has(l.content_id),'unknown editable text reference');
    check(!l.clip_path||/^[MmLlHhVvCcSsQqTtAaZz0-9., +\\-]+$/.test(l.clip_path),'invalid clip path');
    check(!l.blend||['normal','screen','multiply','overlay'].includes(l.blend),'invalid blend');
    if(l.kind==='image')check((p.assets||[]).some(a=>a.asset_id===l.asset_id&&a.kind==='raster'),'layer image asset missing');
    if(l.motion){check(l.kind==='image'&&['none','crystal','metal','smoke','plasma'].includes(l.motion.preset),'image motion preset required');for(const n of ['intensity','speed'])check(l.motion[n]===undefined||Number.isFinite(l.motion[n])&&l.motion[n]>=0&&l.motion[n]<=2,'motion '+n+' outside 0..2');if(l.motion.region){const r=l.motion.region;check(Array.isArray(r)&&r.length===4&&r.every(Number.isFinite)&&r[0]>=0&&r[1]>=0&&r[2]>0&&r[3]>0&&r[0]+r[2]<=1&&r[1]+r[3]<=1,'normalized motion region required');}if(l.motion.pins)check(Array.isArray(l.motion.pins)&&l.motion.pins.every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite)&&a[0]>=0&&a[0]<=1&&a[1]>=0&&a[1]<=1&&a[2]>0),'invalid motion pins');}
    let previous=-1;for(const k of l.keyframes||[]){check(Number.isFinite(k.at)&&k.at>=0&&k.at>previous&&k.at<=(s.end-s.start)/30,'invalid absolute keyframe times');previous=k.at;for(const name of ['x','y','scale','scaleX','scaleY','rotation','opacity','draw','reveal','tracking','weight'])check(k[name]===undefined||Number.isFinite(k[name]),'non numeric transform');check(k.ease===undefined||['smooth','linear','hold','out'].includes(k.ease),'unknown keyframe ease');}
   }
  }
  if(s.custom_svg){check(typeof s.custom_svg==='string'&&!/<(?:script|image|feImage|foreignObject|iframe|style)\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)/i.test(s.custom_svg),'unsafe/non-vector custom SVG '+s.id);}
  if(s.layout)check(Object.values(s.layout).every(v=>typeof v==='number'&&Number.isFinite(v)),'layout numeric values required');
  check((s.content_ids||[]).every(id=>units.has(id)),'unknown content '+s.id);s.content_ids?.forEach(id=>covered.add(id));
  const length=(s.content_ids||[]).reduce((n,id)=>n+(units.get(id)?.display_text.length||0),0);
  const minimum=Math.max(1.5,length/7+0.8);if(p.editing_contract==='shot-rhythm-v1'){
   const duration=(s.end-s.start)/30;check(duration>=.25,'shot must contain at least 8 frames');
   check(['action','reading'].includes(s.shot_role),'shot role required');
   if(s.shot_role==='action')check(s.content_ids.length===0,'action insert cannot hide reading requirements');
   const windows=s.reading_windows||[];check(Array.isArray(windows),'reading windows array');
   for(const id of s.content_ids){const w=Array.isArray(windows)?windows.find(w=>w.content_id===id):null,len=units.get(id)?.display_text.length||0;check(w&&Number.isFinite(w.start)&&Number.isFinite(w.end)&&w.start>=0&&w.end<=duration&&w.end-w.start>=Math.max(.75,len/10+.35),'explicit reading window too short '+id);}
  }else check((s.end-s.start)/30-1.2>=minimum,'insufficient reading time '+s.id);
  for(const e of s.event_depictions||[]){check(events.get(e.event_id)?.kind===e.presented_as,'event distinction '+s.id);if(e.presented_as==='proposed')check(s.mode==='proposal','proposed event must remain visibly a proposal '+s.id);}
 }
 check(cursor===p.output?.total_frames,'total frame mismatch');
 check(new Set(p.scenes?.map(s=>s.id)).size===p.scenes?.length,'duplicate scene id');
 for(const id of p.required_content_ids||[])check(covered.has(id),'required content omitted '+id);
 for(const id of units.keys())check(covered.has(id)||(p.omissions||[]).some(o=>o.content_id===id&&o.reason),'unexplained omission '+id);
 for(const a of p.assets||[]){check(a.provenance&&/^[a-f0-9]{64}$/.test(a.sha256),'asset provenance/hash required');if(a.kind==='raster'){check(/^[a-z0-9-]+$/.test(a.asset_id)&&typeof a.path==='string'&&a.width>0&&a.height>0,'raster identity/geometry required');if(a.origin==='generated')check(a.provider&&a.prompt,'generated asset provider/prompt required');}if(p.visual_policy==='strict_svg'&&a.kind!=='audio')check(a.kind==='svg','non SVG visual source');if(p.visual_policy==='procedural_only'&&a.kind!=='audio')check(['svg','procedural'].includes(a.kind),'raster/media not procedural');}
 check(p.audio?.sections?.length>0&&Array.isArray(p.audio?.motif)&&p.audio.motif.length>0,'authored audio plan required');
 check(Number.isFinite(p.audio?.bpm)&&p.audio.bpm>=30&&p.audio.bpm<=200,'audio bpm outside 30..200');
 check(p.audio?.master_gain_db===undefined||Number.isFinite(p.audio.master_gain_db)&&p.audio.master_gain_db>=-12&&p.audio.master_gain_db<=18,'master gain outside -12..18 dB');
 if(p.schema_version==='3.1.0')errors.push(...mediaErrors(p));
 errors.push(...audioErrors(p),...spatialErrors(p));
 if(p.audio?.music_brief){const music=musicDirectionAudit(p);errors.push(...music.errors);warn.push(...music.pending);}
 if(p.approval)check(p.approval.hash===approvalHash(p),'approval is stale: changed direction requires confirmation');
 if((p.sources||[]).some(s=>s.retrieval_state==='web_excerpt'))warn.push('원 웹 본문 스냅샷 없음: 제공된 발췌만 근거로 사용');
 const direction=directionCheck(p);errors.push(...direction.errors);warn.push(...direction.warnings);
 const editorial=editorialCheck(p);errors.push(...editorial.errors);warn.push(...editorial.warnings);
 return {ok:!errors.length,errors,warnings:warn,direction,editorial};
}
export function requireValid(p,approved=false){const v=validate(p);if(!v.ok)throw new Error(v.errors.join('\n'));if(approved&&!p.approval)throw new Error('연출안 사용자 확인이 필요합니다. approve --by --note --expected-hash 사용');return v;}
export function approve(file,by,note,expected){const p=read(file);requireValid(p);const h=approvalHash(p);if(expected!==h||!by||!note)throw new Error('현재 연출안 hash와 확인 주체·확인 근거가 필요합니다');p.approval={hash:h,by,note,at:new Date().toISOString()};p.status='direction_approved';write(file,p);return p.approval;}
export function revise(file,id,text,out){const p=read(file),c=p.content_units.find(c=>c.content_id===id);if(!c)throw new Error('unknown content id');if(c.copy_lock&&text!==c.source_text)throw new Error('원문 잠금: 원문 수정 불가');
 for(const a of p.assets||[]){if(!a.path||a.path.startsWith('skill:')||path.isAbsolute(a.path))continue;const local=path.resolve(path.dirname(file),a.path),source=fs.existsSync(local)?local:path.resolve(ROOT,a.path);a.path=path.relative(path.dirname(out),source).replaceAll('\\','/');}
 c.display_text=text;p.approval=undefined;p.status='revision';p.revision=(p.revision||0)+1;requireValid(p);write(out,p);return {affected:p.scenes.filter((s,i)=>s.content_ids.includes(id)||(s.transition_in&&i>0&&p.scenes[i-1].content_ids.includes(id))).map(s=>s.id),hash:approvalHash(p)};}
