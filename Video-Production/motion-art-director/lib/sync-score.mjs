import {hash} from './io.mjs';

// Compile an explicit audio clock into ordinary, editable vector keyframes.
// No playback history, beat estimation or speech service is required here.
export const SYNC_VERSION = 'word-impact-v1';
const frame = (seconds, fps) => Math.round(seconds * fps);
const number = x => Number.isFinite(x);
const poses = ['x', 'y', 'scale', 'opacity'];
const clone = p => { const q = structuredClone(p); if (p.__projectDir) Object.defineProperty(q, '__projectDir', {value:p.__projectDir}); return q; };

export function syncScoreCheck(p, {requireCompiled=true}={}) {
 const score=p.sync_score, errors=[], warnings=[], cues=[], phrases=[];
 const fail=(ok,message)=>{if(!ok)errors.push(message);};
 if(score===undefined)return {ok:true,errors,warnings,cues,phrases,status:'not-requested'};
 fail(p.schema_version==='3.1.0','sync_score requires project 3.1.0');
 fail(p.output?.fps===30&&Number.isInteger(p.output?.total_frames)&&p.output.total_frames>0,'sync requires a valid 30fps output');
 fail(Array.isArray(p.scenes)&&Array.isArray(p.assets)&&Array.isArray(p.content_units)&&Array.isArray(p.audio?.clips),'sync requires scenes, assets, content and audio clip arrays');
 fail(score?.version===SYNC_VERSION,'unsupported sync score version');
 fail(Array.isArray(score?.cues)&&score.cues.length>0,'sync cues required');
 fail(Array.isArray(score?.phrases),'sync phrases array required');
 fail(Number.isInteger(score?.tolerance_frames)&&score.tolerance_frames>=0&&score.tolerance_frames<=4,'explicit sync tolerance_frames 0..4 required');
 if(errors.length)return {ok:false,errors,warnings,cues,phrases};
 const fps=p.output.fps, ids=new Set(), targets=new Set();
 for(const c of score.cues){
  const prefix='sync '+(c?.id||'?')+': ',before=errors.length;
  if(!c||typeof c!=='object'){errors.push(prefix+'cue object required');continue;}
  fail(typeof c.id==='string'&&c.id.length>0&&!ids.has(c.id),prefix+'unique cue id required');ids.add(c.id);
  const s=p.scenes.find(s=>s.id===c.scene_id), a=p.assets?.find(a=>a.asset_id===c.source?.asset_id), clip=p.audio?.clips?.[c.clip_index];
  const layers=s?.composition?.layers||[], l=layers.find(l=>l.id===c.layer_id),src=c.source;
  fail(!!s&&!!l,prefix+'scene/layer binding missing');
  fail(['vector-composite','hybrid-composite'].includes(s?.renderer||p.renderer),prefix+'requires a vector or hybrid scene');
  fail(l?.kind==='text',prefix+'word cue requires a text layer');
  const displayed=l?.content_id?p.content_units.find(u=>u.content_id===l.content_id)?.display_text:l?.text;
  fail(typeof c.text==='string'&&c.text.length>0&&displayed===c.text,prefix+'word text differs from displayed layer');
  const target=c.scene_id+'/'+c.layer_id;fail(!targets.has(target),prefix+'one cue per layer required');targets.add(target);
  fail(Number.isInteger(c.clip_index)&&c.clip_index>=0&&clip?.bus==='voice'&&clip.asset_id===src?.asset_id,prefix+'voice clip binding missing');
  fail(!!a&&a.kind==='audio'&&a.sha256===src?.sha256&&/^[a-f0-9]{64}$/.test(src?.sha256||''),prefix+'audio hash changed or source missing');
  fail(Number.isInteger(src?.sample_rate)&&src.sample_rate>=8000&&src.sample_rate<=192000,prefix+'sample_rate required');
  fail(['onset_sample','anchor_sample','release_sample'].every(k=>Number.isInteger(src?.[k])&&src[k]>=0)&&src?.onset_sample<=src?.anchor_sample&&src?.anchor_sample<src?.release_sample,prefix+'ordered source onset/anchor/release samples required');
  fail(['isolated-speech','manual-listening','forced-alignment'].includes(src?.method)&&number(src?.confidence)&&src.confidence>=0&&src.confidence<=1&&typeof src?.evidence==='string'&&src.evidence.length>0,prefix+'timing method, confidence and evidence required');
  fail(Number.isInteger(c.prepare_frames)&&c.prepare_frames>=0&&c.prepare_frames<=30&&Number.isInteger(c.exit_frames)&&c.exit_frames>=1&&c.exit_frames<=30,prefix+'prepare/exit frame bounds');
  fail(Number.isInteger(c.hold_until_frame),prefix+'hold_until_frame required');
  fail(c.impact_offset_frames===undefined||Number.isInteger(c.impact_offset_frames)&&Math.abs(c.impact_offset_frames)<=30,prefix+'impact offset frame bounds');
  for(const name of ['anticipation','landing'])fail(c[name]&&poses.every(k=>number(c[name][k]))&&c[name].scale>0&&c[name].opacity>=0&&c[name].opacity<=1,prefix+name+' pose required');
  if(errors.length!==before)continue;
  const speed=clip.speed??1, start=clip.start, sourceIn=clip.source_in;
  fail(number(speed)&&speed>0&&number(start)&&number(sourceIn)&&number(clip.duration)&&clip.duration>0,prefix+'invalid voice time map');
  if(errors.length!==before)continue;
  const onset=src.onset_sample/src.sample_rate,anchor=src.anchor_sample/src.sample_rate,release=src.release_sample/src.sample_rate;
  fail(onset>=sourceIn-1/src.sample_rate&&release<=sourceIn+clip.duration*speed+1/src.sample_rate,prefix+'word outside selected voice interval');
  const map=t=>start+(t-sourceIn)/speed, mapped=map(anchor), expected=frame(mapped,fps),impact=expected+(c.impact_offset_frames??0),prep=impact-c.prepare_frames,releaseFrame=Math.ceil(map(release)*fps-1e-7);
  fail(prep>=s.start&&impact<s.end&&c.hold_until_frame>=Math.max(impact,releaseFrame)&&c.hold_until_frame+c.exit_frames<=s.end,prefix+'word clipped by preparation, release or scene boundary');
  if(Math.abs(c.impact_offset_frames??0)>score.tolerance_frames)errors.push(prefix+'impact differs from audio anchor by '+c.impact_offset_frames+' frames');
  if(src.method!=='manual-listening')warnings.push(prefix+'perceived anchor not listening-verified');
  if(src.confidence<.8)warnings.push(prefix+'low-confidence alignment');
  cues.push({id:c.id,text:c.text,scene_id:s.id,layer_id:l.id,onset_seconds:map(onset),anchor_seconds:mapped,expected_frame:expected,impact_frame:impact,prepare_frame:prep,release_frame:releaseFrame,hold_until_frame:c.hold_until_frame,exit_end_frame:c.hold_until_frame+c.exit_frames,quantization_ms:(expected/fps-mapped)*1000,offset_frames:c.impact_offset_frames??0});
 }
 const phraseIds=new Set();
 for(const ph of score.phrases){
  const prefix='phrase '+(ph?.id||'?')+': ';
  fail(typeof ph?.id==='string'&&!phraseIds.has(ph.id),prefix+'unique id required');phraseIds.add(ph?.id);
  const cs=Array.isArray(ph?.cue_ids)?ph.cue_ids.map(id=>cues.find(c=>c.id===id)):[];
  fail(cs.length>0&&cs.every(Boolean)&&new Set(ph?.cue_ids).size===cs.length,prefix+'valid cue list required');
  if(!cs.length||cs.some(c=>!c))continue;
  const s=p.scenes.find(s=>s.id===cs[0].scene_id),next=p.scenes[p.scenes.indexOf(s)+1];
  fail(cs.every(c=>c.scene_id===s.id),prefix+'phrase must belong to one scene');
  fail(Number.isInteger(ph.release_frame)&&ph.release_frame>=Math.max(...cs.map(c=>c.release_frame))&&ph.release_frame<=s.end,prefix+'last word clipped');
  if(ph.next_scene_id){
   const b=ph.bridge,from=s.composition.layers.find(l=>l.id===b?.out_layer),to=next?.composition?.layers.find(l=>l.id===b?.in_layer);
   fail(next?.id===ph.next_scene_id&&!!from&&!!to,prefix+'next scene/object binding missing');
   fail(Number.isInteger(ph.arrival_frame)&&ph.arrival_frame===next?.start,prefix+'next scene arrives late or at wrong boundary');
   fail(Number.isInteger(ph.transition_start_frame)&&ph.transition_start_frame>=ph.release_frame&&ph.transition_start_frame<ph.arrival_frame,prefix+'transition overlaps unfinished phrase or is empty');
   fail(['same-object','visual-analogy'].includes(b?.relation)&&typeof b?.reason==='string'&&b.reason.length>0,prefix+'bridge meaning required');
   for(const key of ['out_anchor','in_anchor'])fail(Array.isArray(b?.[key])&&b[key].length===2&&b[key].every(v=>number(v)&&v>=0&&v<=1),prefix+'normalized '+key+' required');
   if(b?.out_anchor&&b?.in_anchor)fail(Math.hypot(...b.out_anchor.map((x,i)=>x-b.in_anchor[i]))<=.08,prefix+'bridge anchor discontinuity');
   warnings.push(prefix+'bridge geometry and motion require rendered-frame review');
  }
  phrases.push({id:ph.id,cues:ph.cue_ids,release_frame:ph.release_frame,arrival_frame:ph.arrival_frame});
 }
 if(!errors.length&&requireCompiled){
  fail(score.materialized?.signature===scoreSignature(p),'sync materialization stale; run sync-compile into a new project');
  for(const c of score.cues){
   const s=p.scenes.find(s=>s.id===c.scene_id),l=s.composition.layers.find(l=>l.id===c.layer_id),row=cues.find(r=>r.id===c.id),expected=wordMotion(c,row,s.start,fps);
   fail(hash(pickMotion(l))===hash(expected),'sync '+c.id+': rendered keyframes differ from score');
   if(s.portrait_composition){const pl=s.portrait_composition.layers.find(l=>l.id===c.layer_id);fail(!!pl&&hash(pickMotion(pl))===hash(expected),'sync '+c.id+': portrait timing differs');}
  }
 }
 return {ok:errors.length===0,errors,warnings,cues,phrases,status:'structural-only; listening pending',fps};
}

function pickMotion(l){return {x:l.x,y:l.y,scale:l.scale,opacity:l.opacity,keyframes:l.keyframes};}
function scoreSignature(p){const {materialized,...spec}=p.sync_score;return hash({spec,fps:p.output.fps,bindings:spec.cues.map(c=>({clip:p.audio.clips[c.clip_index],asset:p.assets.find(a=>a.asset_id===c.source.asset_id)?.sha256,scene:p.scenes.filter(s=>s.id===c.scene_id).map(s=>[s.id,s.start,s.end])}))});}
function wordMotion(c,row,start,fps){
 const sec=f=>(f-start)/fps, a=c.anticipation, b=c.landing;
 const keyframes=[];
 if(c.prepare_frames>0&&row.prepare_frame>start)keyframes.push({at:sec(row.prepare_frame),...a,ease:'hold'});
 // Instant reveal has one discrete keyframe; no zero-length interpolation.
 keyframes.push({at:sec(row.impact_frame),...b,ease:c.prepare_frames?'out':'hold'});
 if(row.hold_until_frame>row.impact_frame)keyframes.push({at:sec(row.hold_until_frame),...b,ease:'hold'});
 keyframes.push({at:sec(row.exit_end_frame),...b,opacity:0,ease:'smooth'});
 return {...a,keyframes};
}

export function compileSyncScore(p) {
 const check=syncScoreCheck(p,{requireCompiled:false});
 if(!check.ok)throw Error(check.errors.join('\n'));
 if(!p.sync_score)throw Error('sync score required');
 const q=clone(p);delete q.approval;
 for(const c of q.sync_score.cues){
  const s=q.scenes.find(s=>s.id===c.scene_id),row=check.cues.find(r=>r.id===c.id);
  for(const comp of [s.composition,s.portrait_composition].filter(Boolean)){
   const l=comp.layers.find(l=>l.id===c.layer_id);if(!l)throw Error('Missing portrait word layer '+c.layer_id);
   Object.assign(l,wordMotion(c,row,s.start,q.output.fps));
  }
 }
 q.sync_score.materialized={version:SYNC_VERSION,signature:scoreSignature(q)};
 return q;
}

export function syncReviewFrames(p) {
 const r=syncScoreCheck(p),max=p.output.total_frames-1;
 const words=r.cues.flatMap(c=>[c.prepare_frame,c.impact_frame-1,c.impact_frame,c.impact_frame+1,c.release_frame,c.exit_end_frame-1]);
 const boundaries=r.phrases.flatMap(c=>c.arrival_frame===undefined?[]:[c.arrival_frame-1,c.arrival_frame]);
 return [...new Set([...words,...boundaries])].filter(n=>Number.isInteger(n)&&n>=0&&n<=max).sort((a,b)=>a-b);
}
