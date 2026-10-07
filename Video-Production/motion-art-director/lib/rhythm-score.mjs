import {hash} from './io.mjs';

export const RHYTHM_VERSION='music-impact-v1';
const clone=p=>{const q=structuredClone(p);if(p.__projectDir)Object.defineProperty(q,'__projectDir',{value:p.__projectDir});return q;};
const finite=Number.isFinite;
const keys=['x','y','scale','scaleX','scaleY','rotation','opacity','draw','reveal','tracking','weight'];
const timing=c=>({asset_id:c?.asset_id,start:c?.start,source_in:c?.source_in,duration:c?.duration,speed:c?.speed??1});
export function rhythmSignature(p){const {materialized,...score}=p.rhythm_score;return hash({score,fps:p.output.fps,music:timing(p.audio.clips[score.music.clip_index]),asset:p.assets.find(a=>a.asset_id===score.music.asset_id)?.sha256,scenes:p.scenes.map(s=>({id:s.id,start:s.start,end:s.end,...(score.bindings?.some(b=>b.scene_id===s.id&&b.target?.phase==='arrival')?{arrival_transition:s.transition_in}:{} )}))});}
const leadFrames=(s,t)=>t.phase==='arrival'?Math.round((s.transition_in?.duration||0)*30):0;
function setup(p){
 const errors=[],warnings=[],events=[],bindings=[],r=p.rhythm_score;
 const check=(ok,m)=>{if(!ok)errors.push(m);};
 if(r===undefined)return {ok:true,errors,warnings,events,bindings,status:'not-requested'};
 if(!r||typeof r!=='object')return {ok:false,errors:['rhythm_score object required'],warnings,events,bindings};
 check(r?.version===RHYTHM_VERSION,'Unsupported rhythm version');
 check(Number.isInteger(r.tolerance_frames)&&r.tolerance_frames>=0&&r.tolerance_frames<=4,'rhythm tolerance must be 0..4 frames');
 check(p.schema_version==='3.1.0'&&p.output?.fps===30,'rhythm requires project3.1 and30fps');
 check(Array.isArray(r.events)&&r.events.length>0&&Array.isArray(r.bindings),'rhythm events/bindings required');
 check(r.holds===undefined||Array.isArray(r.holds),'rhythm holds must be an array');
 check(Array.isArray(p.scenes)&&Array.isArray(p.assets)&&Array.isArray(p.audio?.clips),'rhythm project arrays required');
 if(errors.length)return {ok:false,errors,warnings,events,bindings};
 const c=p.audio.clips[r.music?.clip_index],a=p.assets.find(x=>x.asset_id===r.music?.asset_id),speed=c?.speed??1;
 check(Number.isInteger(r.music?.clip_index)&&c?.bus==='music'&&c.asset_id===a?.asset_id&&a?.kind==='audio','rhythm music binding missing');
 check(a?.sha256===r.music?.sha256&&/^[a-f0-9]{64}$/.test(a?.sha256||''),'rhythm source hash changed');
 check([c?.start,c?.source_in,c?.duration,speed].every(finite)&&c.start>=0&&c.source_in>=0&&c.duration>0&&speed>0,'rhythm music clock invalid');
 if(errors.length)return {ok:false,errors,warnings,events,bindings};
 const ids=new Set();
 for(const e of r.events){
  const ok=e&&typeof e.id==='string'&&!ids.has(e.id)&&finite(e.source_seconds)&&e.source_seconds>=c.source_in&&e.source_seconds<c.source_in+c.duration*speed;
  check(ok,'rhythm event missing/duplicate/outside music');if(!ok)continue;ids.add(e.id);
  check(['pulse','onset','accent','phrase','release'].includes(e.role),'rhythm event role invalid');
  check(['measured-onset','estimated-grid','authored','listening-corrected'].includes(e.method)&&finite(e.confidence)&&e.confidence>=0&&e.confidence<=1&&typeof e.evidence==='string'&&e.evidence.length>0,'rhythm evidence required');
  const sec=c.start+(e.source_seconds-c.source_in)/speed,frame=Math.round(sec*30);
  events.push({...e,output_seconds:sec,frame,quantization_ms:(frame/30-sec)*1000});
 }
 if(events.some(e=>e.method!=='listening-corrected'))warnings.push('Music anchors are not all listening-verified; numerical synchronization is not groove approval');
 const owners=new Set(),bid=new Set();
 for(const b of r.bindings){
  const e=events.find(e=>e.id===b?.event_id),s=p.scenes.find(s=>s.id===b?.scene_id),t=b?.target;
  check(b&&typeof b.id==='string'&&!bid.has(b.id),'rhythm binding id missing/duplicate');bid.add(b?.id);
  check(!!e&&!!s&&['cut','layer','camera','video'].includes(t?.kind),'rhythm target/event missing');if(!e||!s||!['cut','layer','camera','video'].includes(t?.kind))continue;
  const owner=s.id+'/'+t.kind+'/'+(t.layer_id||'');check(!owners.has(owner),'rhythm duplicate target ownership');owners.add(owner);
  check(typeof b.reason==='string'&&b.reason.length>=8,'rhythm narrative reason required');
  const offset=b.impact_offset_frames??0;check(Number.isInteger(offset)&&Math.abs(offset)<=30,'rhythm offset invalid');
  check(!s.portrait_composition,'rhythm v1 binds landscape only; author a separate portrait project');
  const f=e.frame+offset, l=t.layer_id?s.composition?.layers.find(l=>l.id===t.layer_id):null;
  check(t.phase===undefined||t.kind==='cut'&&['start','arrival'].includes(t.phase),'transition phase only supports cut start/arrival');
  if(t.kind==='cut'){check(p.scenes.indexOf(s)>0,'cannot move initial scene');if(t.phase==='arrival')check(Number.isFinite(s.transition_in?.duration)&&Number.isInteger(s.transition_in.duration*30)&&s.transition_in.duration>0,'arrival cut needs an actual whole-frame transition');check(f-leadFrames(s,t)===s.start,'cut/transition arrival is not on selected music anchor');}
  else check(f>=s.start&&f<s.end,'rhythm impact outside scene');
  if(t.kind==='layer'){
   check(!(p.sync_score?.cues||[]).some(c=>c.scene_id===s.id&&c.layer_id===t.layer_id),'word/rhythm target ownership conflict');
   check(!!l&&['svg','text','procedural'].includes(l.kind),'rhythm graphic layer missing');
   const props=Object.keys(b.before||{});check(props.length>0&&props.every(k=>keys.includes(k)&&finite(b.before[k])&&finite(b.after?.[k]))&&Object.keys(b.after||{}).length===props.length,'rhythm poses must have matching supported properties');
   for(const pose of [b.before,b.after])for(const [k,v]of Object.entries(pose||{})){if(['opacity','draw','reveal'].includes(k))check(v>=0&&v<=1,'rhythm unit property outside0..1');if(['scale','scaleX','scaleY'].includes(k))check(v>0,'rhythm scale must be positive');}
  }
  if(t.kind==='camera')check(b.before&&b.after&&[b.before,b.after].every(v=>finite(v.zoom)&&v.zoom>=1&&v.zoom<=4&&Array.isArray(v.focus)&&v.focus.length===2&&v.focus.every(x=>finite(x)&&x>=0&&x<=1)),'rhythm camera pose invalid');
  if(['layer','camera'].includes(t.kind)){
   check(Number.isInteger(b.prepare_frames)&&b.prepare_frames>=0&&f-b.prepare_frames>=s.start,'rhythm preparation clipped');
   check(Number.isInteger(b.hold_frames)&&b.hold_frames>=0&&f+b.hold_frames<s.end,'rhythm hold clipped');
  }
  if(t.kind==='video'){
   const va=p.assets.find(a=>a.asset_id===l?.asset_id);
   check(l?.kind==='video'&&va?.sha256===b.source_sha256,'rhythm video source missing/changed');
   check(finite(b.source_event_seconds)&&b.source_event_seconds>=0&&b.source_event_seconds<va?.duration,'rhythm source action outside video');
   if(l?.kind==='video'&&va){const start=b.source_event_seconds-(f-s.start)/30*(l.speed??1),index=p.scenes.indexOf(s),frames=s.end-s.start+Math.round((p.scenes[index+1]?.transition_in?.duration||0)*30);check(start>=0&&start+frames/30*(l.speed??1)<=va.duration+.001,'rhythm source action leaves insufficient clip handles');}
  }
  check(Math.abs(offset)<=(r.tolerance_frames??0),'rhythm intentional offset exceeds explicit tolerance');
  bindings.push({id:b.id,scene_id:s.id,kind:t.kind,layer_id:t.layer_id,event_id:e.id,anchor_frame:e.frame,impact_frame:f,...(t.kind==='cut'?{cut_start_frame:f-leadFrames(s,t),phase:t.phase||'start'}:{}),quantization_ms:e.quantization_ms});
 }
 for(const h of r.holds||[]){const s=p.scenes.find(s=>s.id===h.scene_id);check(s&&Number.isInteger(h.start_frame)&&Number.isInteger(h.end_frame)&&h.start_frame>=s.start&&h.end_frame<=s.end&&h.end_frame>h.start_frame&&typeof h.reason==='string'&&h.reason.length>=8,'intentional sustained window broken');}
 return {ok:errors.length===0,errors,warnings,events,bindings,status:'structural-only; story and listening review separate'};
}
function frames(b,row,s){const at=(row.impact_frame-s.start)/30,out=[];if(b.prepare_frames>0)out.push({at:(row.impact_frame-b.prepare_frames-s.start)/30,...b.before,ease:'hold'});out.push({at,...b.after,ease:b.prepare_frames?'out':'hold'});if(b.hold_frames>0)out.push({at:at+b.hold_frames/30,...b.after,ease:'hold'});return out;}
function expected(p,b,row){
 const s=p.scenes.find(s=>s.id===b.scene_id),t=b.target;
 if(t.kind==='cut')return {start:row.cut_start_frame,previousEnd:row.cut_start_frame};
 if(t.kind==='layer')return {...b.before,keyframes:frames(b,row,s)};
 if(t.kind==='camera')return {keyframes:frames(b,row,s)};
 const l=s.composition.layers.find(l=>l.id===t.layer_id);
 return {source_in:b.source_event_seconds-(row.impact_frame-s.start)/30*(l.speed??1)};
}
function actual(p,b){
 const s=p.scenes.find(s=>s.id===b.scene_id),t=b.target,l=s.composition?.layers.find(l=>l.id===t.layer_id);
 if(t.kind==='cut')return {start:s.start,previousEnd:p.scenes[p.scenes.indexOf(s)-1]?.end};
 if(t.kind==='camera')return s.composition.camera;
 if(t.kind==='video')return {source_in:l?.source_in};
 return {...Object.fromEntries(Object.keys(b.before).map(k=>[k,l?.[k]])),keyframes:l?.keyframes};
}
export function rhythmCheck(p,{requireCompiled=true}={}){
 const r=setup(p);if(!p.rhythm_score||!r.ok||!requireCompiled)return r;
 if(p.rhythm_score.materialized?.signature!==rhythmSignature(p))r.errors.push('rhythm materialization stale');
 for(const b of p.rhythm_score.bindings){const row=r.bindings.find(r=>r.id===b.id);if(hash(expected(p,b,row))!==hash(actual(p,b)))r.errors.push('rhythm actual target differs: '+b.id);}
 r.ok=!r.errors.length;return r;
}
export function compileRhythm(p){
 const q=clone(p),r=q.rhythm_score;
 if(!r||!Array.isArray(r.bindings))throw Error('rhythm_score required');
 // Explicit cut ownership changes adjacent boundaries together. Other shot clocks remain authored.
 for(const b of r.bindings.filter(b=>b.target?.kind==='cut')){
  const e=r.events?.find(e=>e.id===b.event_id),c=q.audio?.clips?.[r.music?.clip_index],i=q.scenes.findIndex(s=>s.id===b.scene_id);
  if(!e||!c||i<1)throw Error('invalid cut binding');
  const f=Math.round((c.start+(e.source_seconds-c.source_in)/(c.speed??1))*30)+(b.impact_offset_frames??0)-leadFrames(q.scenes[i],b.target);
  q.scenes[i].start=f;q.scenes[i-1].end=f;
 }
 const review=setup(q);if(!review.ok)throw Error(review.errors.join('\n'));
 if(!r.materialized)for(const b of r.bindings){const s=q.scenes.find(s=>s.id===b.scene_id);if(b.target.kind==='layer'&&s.composition.layers.find(l=>l.id===b.target.layer_id)?.keyframes?.length)throw Error('rhythm refuses to overwrite authored layer animation');if(b.target.kind==='camera'&&s.composition.camera)throw Error('rhythm refuses to overwrite authored camera');}
 for(const b of r.bindings){
  const s=q.scenes.find(s=>s.id===b.scene_id),row=review.bindings.find(r=>r.id===b.id),state=expected(q,b,row);
  if(b.target.kind==='camera')s.composition.camera=state;
  else if(b.target.kind!=='cut'){const l=s.composition.layers.find(l=>l.id===b.target.layer_id);Object.assign(l,state);}
 }
 delete q.approval;
 r.materialized={signature:rhythmSignature(q),status:'compiled; perceptual review pending'};
 return q;
}
export function rhythmReviewFrames(p){const r=rhythmCheck(p);return [...new Set(r.bindings.flatMap(b=>[b.impact_frame-1,b.impact_frame,b.impact_frame+1,...(b.phase==='arrival'?[b.cut_start_frame-1,b.cut_start_frame,b.cut_start_frame+1]:[])]))].filter(f=>f>=0&&f<p.output.total_frames).sort((a,b)=>a-b).slice(0,300);}
