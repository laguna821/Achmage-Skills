import assert from 'node:assert/strict';
import {compileRhythm,rhythmCheck} from '../lib/rhythm-score.mjs';
import {eventCorrection,applyEventCorrections,createRhythmReview} from '../lib/rhythm-review.mjs';
import {sequenceCheck} from '../lib/sequences.mjs';
const sha='a'.repeat(64);
const p={schema_version:'3.1.0',output:{fps:30,total_frames:300},assets:[{asset_id:'music',sha256:sha,kind:'audio'}],audio:{clips:[{asset_id:'music',bus:'music',start:0,source_in:100,duration:10}]},scenes:[{id:'a',start:0,end:150,composition:{layers:[{id:'word',kind:'text'}]}},{id:'b',start:150,end:300,composition:{layers:[]}}],rhythm_score:{version:'music-impact-v1',music:{asset_id:'music',clip_index:0,sha256:sha},tolerance_frames:0,events:[{id:'hit',source_seconds:102,role:'accent',method:'measured-onset',confidence:.7,evidence:'Fixture transient'}],bindings:[{id:'impact',event_id:'hit',scene_id:'a',target:{kind:'layer',layer_id:'word'},prepare_frames:3,hold_frames:3,before:{opacity:0},after:{opacity:1},reason:'Word completes the causal transfer'}]}};
const q=compileRhythm(p),doc=eventCorrection(q),old=JSON.stringify(q);
doc.events[0].source_seconds+=1/30;
const next=compileRhythm(applyEventCorrections(q,doc));
assert(rhythmCheck(next).ok);
assert.equal(JSON.stringify(q),old);
assert.equal(next.scenes[0].composition.layers[0].keyframes[1].at,61/30);
for(const mutate of [d=>d.identity.music.sha256='b'.repeat(64),d=>d.identity.clock.source_in++,d=>d.events.push(d.events[0]),d=>d.events[0].source_seconds=111,d=>d.events[0].method='listening-corrected']){
 const d=eventCorrection(q);mutate(d);assert.throws(()=>applyEventCorrections(q,d));
}
const listened=eventCorrection(q);listened.events[0].method='listening-corrected';listened.review={listening:'reviewed',note:'Synthetic fixture, not real listening approval'};assert(applyEventCorrections(q,listened));
assert(sequenceCheck(p).ok);
p.editorial_plan={sequences:[{id:'one',question:'Where does force go?',consequence:'Wheel moves',musical_role:'Two-part phrase',shot_ids:['a','b']}]};assert(sequenceCheck(p).ok);
for(const shot_ids of [['b','a'],['a'],['a','a'],['a','ghost']]){const r=structuredClone(p);r.editorial_plan.sequences[0].shot_ids=shot_ids;assert(!sequenceCheck(r).ok);}
assert.throws(()=>createRhythmReview(q,'unused-review',{movie:'C:/private/movie.mp4'}));
console.log('rhythm-review: corrections preserve ownership, reject stale clocks/evidence, sequence coverage checked');
const transition=structuredClone(p);transition.rhythm_score.events[0].source_seconds=105;transition.scenes[1].transition_in={kind:'circleopen',duration:4/30};transition.rhythm_score.bindings=[{id:'arrival',event_id:'hit',scene_id:'b',target:{kind:'cut',phase:'arrival'},reason:'New frame arrives on the measured transient'}];
const landed=compileRhythm(transition);assert.equal(landed.scenes[1].start,146);assert.equal(rhythmCheck(landed).bindings[0].impact_frame,150);assert(rhythmCheck(landed).ok);
landed.scenes[1].transition_in.duration=5/30;assert(!rhythmCheck(landed).ok);
delete transition.scenes[1].transition_in;assert.throws(()=>compileRhythm(transition),/arrival/);
console.log('rhythm-review: transition start/arrival and changed-transition counterexample verified');
