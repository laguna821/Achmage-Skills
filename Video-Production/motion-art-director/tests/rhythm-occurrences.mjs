import assert from 'node:assert/strict';
import {compileRhythm,rhythmCheck,eventOutputSeconds} from '../lib/rhythm-score.mjs';
import {eventCorrection,applyEventCorrections,reviewIdentity} from '../lib/rhythm-review.mjs';
const sha='a'.repeat(64);
const event=(id,clip_index)=>({id,clip_index,source_seconds:40,role:'accent',method:'measured-onset',confidence:.8,evidence:'Synthetic occurrence test, not listening certification'});
const fixture=()=>({
 schema_version:'3.1.0',output:{fps:30,total_frames:5400},
 assets:[{asset_id:'song',kind:'audio',sha256:sha},{asset_id:'other',kind:'audio',sha256:'b'.repeat(64)}],
 audio:{clips:[{asset_id:'song',bus:'music',start:0,source_in:0,duration:85.82},{asset_id:'song',bus:'music',start:85.82,source_in:38.21673469387755,duration:89.0073,speed:1}]},
 scenes:[{id:'first',start:0,end:2400,composition:{layers:[{kind:'text',id:'a'}]}},{id:'repeat',start:2400,end:5400,composition:{layers:[{kind:'text',id:'b'}]}}],
 rhythm_score:{version:'music-impact-v1',music:{asset_id:'song',clip_index:0,sha256:sha},tolerance_frames:0,
 events:[event('original',0),event('repeated',1)],
 bindings:[{id:'late',event_id:'repeated',scene_id:'repeat',target:{kind:'layer',layer_id:'b'},before:{opacity:0},after:{opacity:1},prepare_frames:3,hold_frames:6,reason:'The repeated source strike belongs to its second output occurrence'}]}
});
let n=0;const test=(name,fn)=>{fn();n++;console.log('PASS occurrences '+name)};
test('same source timestamp lands twice at independent output clocks',()=>{
 const p=fixture(),q=compileRhythm(p),r=rhythmCheck(q);
 assert(r.ok,JSON.stringify(r.errors));
 assert.equal(r.events[0].frame,1200);
 assert.equal(r.events[1].frame,2628);
 assert.equal(q.scenes[1].composition.layers[0].keyframes[1].at,228/30);
 assert.deepEqual(compileRhythm(p),q);
});
test('secondary trim, placement, speed, bus and source tampering rejected',()=>{
 for(const mutate of [p=>p.audio.clips[1].source_in+=1,p=>p.audio.clips[1].start+=1,p=>p.audio.clips[1].speed=1.01,p=>p.audio.clips[1].bus='sfx',p=>p.audio.clips[1].asset_id='other']){
  const q=compileRhythm(fixture());mutate(q);assert.equal(rhythmCheck(q).ok,false);
 }
});
test('gain edits do not invalidate picture; unrelated clips do not own its clock',()=>{
 const q=compileRhythm(fixture());q.audio.clips[1].gain_db=-6;q.audio.clips.push({bus:'sfx',start:1,duration:1});assert(rhythmCheck(q).ok);
});
test('invalid indices and source ranges cannot fall back to first occurrence',()=>{
 for(const index of [-1,2,1.2,'1']){const p=fixture();p.rhythm_score.events[1].clip_index=index;assert.throws(()=>compileRhythm(p));}
 const p=fixture();p.rhythm_score.events[1].source_seconds=20;assert.throws(()=>compileRhythm(p),/outside/);
});
test('cut compiler uses secondary occurrence too',()=>{
 const p=fixture();p.rhythm_score.bindings=[{id:'cut',event_id:'repeated',scene_id:'repeat',target:{kind:'cut'},reason:'Scene begins at the repeated source strike'}];
 const q=compileRhythm(p);assert.equal(q.scenes[1].start,2628);assert.equal(q.scenes[0].end,2628);assert(rhythmCheck(q).ok);
});
test('review roundtrip changes correct occurrence; original stays unchanged',()=>{
 const q=compileRhythm(fixture()),before=JSON.stringify(q),d=eventCorrection(q);d.events[1].source_seconds+=1/30;
 const next=compileRhythm(applyEventCorrections(q,d));assert.equal(rhythmCheck(next).events[1].frame,2629);assert.equal(JSON.stringify(q),before);
 const stale=structuredClone(q);stale.audio.clips[1].source_in+=.1;assert.throws(()=>applyEventCorrections(stale,d),/identity/);
 d.events[1].clip_index=0;assert.throws(()=>applyEventCorrections(q,d),/occurrence/);
});
test('legacy default clock and identity shape remain unchanged',()=>{
 const p=fixture();p.rhythm_score.events=[event('original',undefined)];p.rhythm_score.bindings=[];
 assert.equal(eventOutputSeconds(p,p.rhythm_score.events[0]),40);assert(!('occurrences' in reviewIdentity(p)));assert(rhythmCheck(compileRhythm(p)).ok);
});
test('final-frame rounding and out-of-output occurrence rejected',()=>{
 for(const t of [179.999,181]){const p=fixture();p.audio.clips[1].start=t;p.rhythm_score.events[1].source_seconds=p.audio.clips[1].source_in;assert.throws(()=>compileRhythm(p));}
});
console.log(JSON.stringify({suite:'rhythm-occurrences',passed:n,scope:'Music-clock identity and adversarial timing; no listening claim'}));
