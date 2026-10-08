import {sequenceCheck} from './sequences.mjs';
// Evidence about intent and bindings is not perceptual or aesthetic approval.
import {hash} from './io.mjs';
const arr=x=>Array.isArray(x)?x:[];
const text=x=>typeof x==='string'&&x.trim().length>0;
const point=x=>Array.isArray(x)&&x.length===2&&x.every(Number.isFinite);
const norm=x=>point(x)&&x.every(n=>n>=0&&n<=1);
const generic=x=>/등장과 이동[·・]변화를 관찰|장면 진입|다음 장면에 연결되는 완결 상태|동작의 방향 또는 형태를 다음 컷에 연결/.test(x||'');
const defaults={x:0,y:0,rotation:0,scale:1,scaleX:1,scaleY:1,opacity:1,draw:1,tracking:0,weight:400,reveal:1,dash_offset:0};
const moving=l=>{
 if(!l)return false;
 if(l.kind==='video'||l.kind==='procedural'||arr(l.morph).length>1)return true;
 const state={...defaults,...l};
 for(const k of arr(l.keyframes))for(const key of Object.keys(k))if(Object.hasOwn(defaults,key)){
  if(k.at>0&&JSON.stringify(k[key])!==JSON.stringify(state[key]))return true;
  state[key]=k[key];
 }
 return false;
};
export const ambienceFingerprint=(p,s)=>hash({shot:[s.id,s.start,s.end],audio:p.audio,assets:arr(p.assets).map(a=>[a.asset_id,a.sha256]),source:arr(s.composition?.layers).filter(l=>l.kind==='video'&&l.sound==='source')});
export function editorialCheck(p){
 const e=p.editorial_plan,errors=[],warnings=[],required=e!==undefined;
 if(!required)return {ok:true,required:false,errors,warnings,review:'not authored'};
 const error=(ok,msg)=>{if(!ok)errors.push(msg);};
 if(!e||e.version!=='shot-intent-v1'||!Array.isArray(e.shots))return {ok:false,required:true,errors:['editorial_plan requires shot-intent-v1 and shots array'],warnings};
 errors.push(...sequenceCheck(p).errors);
 const scenes=arr(p.scenes),fps=p.output?.fps||30,ids=new Map(e.shots.map(x=>[x?.scene_id,x]));
 error(ids.size===e.shots.length,'editorial shots must have unique scene_id');
 error(e.shots.length===scenes.length&&e.shots.every(x=>scenes.some(s=>s.id===x?.scene_id)),'editorial plan must cover exactly the actual scenes');
 const cueIds=new Map(arr(p.audio?.cues).map(c=>[c.id,c]));
 for(const [i,s] of scenes.entries()){
  const q=ids.get(s.id);if(!q){errors.push(s.id+': missing shot intent');continue;}
  const fail=(ok,msg)=>error(ok,s.id+': '+msg),dur=(s.end-s.start)/fps,layers=new Map(arr(s.composition?.layers).map(l=>[l.id,l]));
  fail(['action','observation','type','pause'].includes(q.role),'role must distinguish action, observation, type or pause');
  fail(text(q.framing)&&text(q.layout)&&text(q.purpose),'framing/layout/purpose required');
  fail(Array.isArray(q.subject_layers)&&q.subject_layers.length>0&&q.subject_layers.every(id=>layers.has(id)),'subject must bind actual layers');
  const a=q.action,stages=['before','contact','after'];
  fail(a&&text(a.verb)&&!generic(a.verb),'concrete action verb required');
  if(!a)continue;
  for(const k of stages)fail(a[k]&&Number.isFinite(a[k].at)&&a[k].at>=0&&a[k].at<dur&&text(a[k].state)&&!generic(a[k].state),k+': exact local time and specific visible state required');
  fail(stages.every(k=>Number.isFinite(a[k]?.at))&&a.before.at<a.contact.at&&a.contact.at<a.after.at,'before/contact/after times must be ordered');
  if(['observation','pause'].includes(q.role))fail(text(a.hold_reason),'observation/pause needs reason for holding');
  else{
   fail(Array.isArray(a.changed_layers)&&a.changed_layers.length>0&&a.changed_layers.every(id=>layers.has(id)),'changed object must bind actual layers');
   fail(arr(a.changed_layers).some(id=>moving(layers.get(id))),'claimed action has no changing bound layer');
  }
  const m=q.motion;
  fail(m&&['subject','type','camera','none'].includes(m.driver)&&text(m.reason),'motion driver and reason required');
  fail(Array.isArray(m?.steady_windows)&&m.steady_windows.every(w=>point(w)&&w[0]>=0&&w[1]>w[0]&&w[1]<=dur),'steady windows must fit shot');
  if(m?.driver==='camera')fail(!!s.composition?.camera&&text(m.subject_layer)&&layers.has(m.subject_layer)&&text(m.end_framing),'camera requires implemented camera, bound subject and end framing');
  if(s.composition?.camera&&m?.driver!=='camera')warnings.push(s.id+': camera exists but intent assigns another driver; review relationship');
  const t=q.typography;
  fail(t&&['meaning','information','accent','none'].includes(t.role)&&text(t.reason)&&Array.isArray(t.layers)&&t.layers.every(id=>layers.get(id)?.kind==='text'),'typography role must bind text layers');
  if(t?.role!=='none')fail(arr(t?.layers).length>0,'typography role requires visible text');
  const snd=q.sound;
  fail(snd&&text(snd.music_role)&&text(snd.ambience_role)&&Array.isArray(snd.events),'sound roles and events required');
  if(!arr(snd?.events).length)fail(text(snd?.no_sync_reason),'no event cue needs a deliberate reason');
  const beds=arr(p.audio?.clips).filter(c=>c.bus==='ambience'&&c.start<s.end/fps&&c.start+c.duration>s.start/fps),sourceBeds=arr(s.composition?.layers).filter(l=>l.kind==='video'&&l.sound==='source');
  if(beds.length||sourceBeds.length){
   const tx=snd?.texture,assets=[...beds,...sourceBeds].map(c=>c.asset_id);
   fail(tx&&text(tx.intended)&&text(tx.avoid)&&['synthetic','recording','mixed'].includes(tx.source_kind)&&Array.isArray(tx.asset_ids)&&assets.every(id=>tx.asset_ids.includes(id)),'ambience needs intended texture, avoided texture, provenance and actual assets');
   fail(tx&&['pending','accepted','rejected'].includes(tx.status),'ambience listening status required');
   if(tx?.status==='accepted'||tx?.status==='rejected'){
    fail(text(tx.evidence),'listening decision requires recorded evidence');
    fail(tx.signature===ambienceFingerprint(p,s),'listening decision is stale or missing its audio/asset fingerprint');
   }
   if(tx?.status!=='accepted')warnings.push(s.id+': ambience texture '+(tx?.status||'unreviewed')+'; delivery listening gate unresolved');
  }
  for(const ev of arr(snd?.events)){
   const c=cueIds.get(ev?.cue_id),tol=ev?.tolerance??.08;
   fail(!!c&&text(ev?.visible_event)&&Number.isFinite(ev.at)&&ev.at>=0&&ev.at<dur&&Number.isFinite(tol)&&tol>=0&&tol<=.25,'sound event needs actual cue, visible event, local time and bounded tolerance');
   if(c&&Number.isFinite(ev.at))fail(Math.abs(c.time-(s.start/fps+ev.at))<=tol+1e-7,'cue '+ev.cue_id+' is outside visible event tolerance');
  }
  const b=q.bridge,next=scenes[i+1];
  if(!next){fail(b?.kind==='end','last shot must end rather than claim a next shot');continue;}
  fail(b&&b.next_scene===next.id&&text(b.reason),'bridge must target actual next scene with reason');
  fail(['match-action','match-shape','sound-bridge','contrast-cut','hold-cut'].includes(b?.kind),'unknown bridge kind');
  if(['match-action','match-shape'].includes(b?.kind)){
   const nl=new Map(arr(next.composition?.layers).map(l=>[l.id,l]));
   for(const [k,map,len]of [['outgoing',layers,dur],['incoming',nl,(next.end-next.start)/fps]]){
    const v=b[k];fail(v&&map.has(v.layer_id)&&norm(v.anchor)&&point(v.velocity)&&Number.isFinite(v.at)&&v.at>=0&&v.at<len,k+': bound layer, local frame time, normalized anchor and velocity required');
   }
   if(b.kind==='match-action'&&point(b.outgoing?.velocity)&&point(b.incoming?.velocity)){
    const u=b.outgoing.velocity,v=b.incoming.velocity,dot=u[0]*v[0]+u[1]*v[1];
    fail(Math.hypot(...u)>0&&Math.hypot(...v)>0,'match-action requires measured nonzero travel on both sides');
    fail(dot>=0||text(b.reversal_reason),'match-action reverses direction without an intentional reversal');
   }
   fail(['same-object','visual-analogy'].includes(b.relationship),'state whether actual same object or visual analogy');
  }
  if(b?.kind==='sound-bridge'){
   const c=cueIds.get(b.cue_id),boundary=s.end/fps;
   fail(c&&c.time<=boundary&&c.duration>0&&c.time+c.duration>boundary,'sound bridge cue must actually cross the cut');
  }
  if(i>=2&&ids.get(scenes[i-1].id)?.layout===q.layout&&ids.get(scenes[i-2].id)?.layout===q.layout&&!text(q.repetition_reason))warnings.push(s.id+': three identical layout labels; justify motif or recompose');
 }
 return {ok:errors.length===0,required,errors,warnings,review:'structural only; actual frame, motion, hearing and user taste remain separate'};
}
export function editorialInventory(p){
 const fps=p.output?.fps||30,findings=[],scenes=arr(p.scenes),media=[];
 for(const [i,s] of scenes.entries()){
  const v=s.visual_plan||{};
  if(arr(v.beats).some(b=>generic(b?.action)||generic(b?.before)||generic(b?.after)))findings.push({code:'GENERIC_ACTION',scene:s.id,severity:'review',time:s.start/fps,message:'Action states are boilerplate; write what visibly changes before/contact/after.'});
  if(!p.editorial_plan)findings.push({code:'NO_SHOT_INTENT',scene:s.id,severity:'missing',time:s.start/fps,message:'No explicit motion/type/sound/bridge intent. Legacy rendering remains valid.'});
  for(const l of arr(s.composition?.layers).filter(l=>l.kind==='video')){
   const end=l.source_in+(s.end-s.start)/fps*(l.speed??1),prior=media.filter(x=>x.asset===l.asset_id);
   const overlap=prior.reduce((n,x)=>Math.max(n,Math.max(0,Math.min(end,x.end)-Math.max(l.source_in,x.start))),0);
   if(overlap>=2)findings.push({code:'SOURCE_REUSE',scene:s.id,severity:'review',time:s.start/fps,seconds:overlap,message:'Source range overlaps an earlier shot by at least2s; inspect framing and narrative role, not an automatic failure.'});
   media.push({scene:s.id,asset:l.asset_id,start:l.source_in,end});
  }
  if(i&&s.composition?.camera&&scenes[i-1].composition?.camera)findings.push({code:'CAMERA_RUN',scene:s.id,severity:'review',time:s.start/fps,message:'Consecutive camera moves: confirm a motivated endpoint and steady contrast.'});
 }
 const check=editorialCheck(p);
 return {version:'editorial-review-v1',project:p.project_id,shots:scenes.length,authoredIntent:!!p.editorial_plan,contract:check,findings,counts:Object.fromEntries([...new Set(findings.map(f=>f.code))].map(k=>[k,findings.filter(f=>f.code===k).length])),qualityDecision:'not determined by this report',listening:'pending unless separately observed and recorded'};
}
