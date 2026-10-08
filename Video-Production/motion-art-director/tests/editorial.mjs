import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
import {ROOT,read,write,run,tool} from '../lib/io.mjs';
import {editorialCheck,editorialInventory,ambienceFingerprint} from '../lib/editorial.mjs';
import {reviewFrames,extractReviewFrames,frameSelection} from '../lib/review-evidence.mjs';
import {validate,approvalHash} from '../lib/contract.mjs';
import {plan} from '../lib/plan.mjs';
import {sceneKey} from '../lib/scene.mjs';
const out=process.argv[2]||fs.mkdtempSync(path.join(os.tmpdir(),'motion-editorial-')),rows=[];
async function test(name,fn){try{await fn();rows.push({name,ok:true});console.log('PASS '+name);}catch(e){rows.push({name,ok:false,error:e.message});console.log('FAIL '+name+': '+e.message);}}
const shot=id=>({scene_id:id,role:'action',framing:'Object traverses lower third',layout:'low lateral',purpose:'Follow the carriage crossing the seam',subject_layers:['train'],
action:{verb:'Pass the platform marker',before:{at:0,state:'Nose right of marker'},contact:{at:1,state:'Nose aligned with marker'},after:{at:2.9,state:'Tail left of marker'},changed_layers:['train']},
motion:{driver:'subject',reason:'Movement belongs to train',steady_windows:[[0,3]]},typography:{role:'none',reason:'Shape carries direction',layers:[]},
sound:{music_role:'Maintain pulse',ambience_role:'Rail texture',events:[{cue_id:'contact',visible_event:'Nose meets platform marker',at:1}]},
bridge:{kind:'end'}});
function fixture(){
 const p={project_id:'review-test',output:{fps:30,total_frames:180},audio:{cues:[{id:'contact',time:1}]},scenes:['a','b'].map((id,i)=>({id,start:i*90,end:(i+1)*90,composition:{layers:[{id:'train',kind:'svg',x:900,keyframes:[{at:0,x:900},{at:2.9,x:-300}]}]}})),editorial_plan:{version:'shot-intent-v1',shots:[shot('a'),shot('b')]}};
 p.editorial_plan.shots[0].bridge={kind:'match-action',next_scene:'b',reason:'Carry leftward travel into diagram',relationship:'visual-analogy',outgoing:{layer_id:'train',at:2.9,anchor:[.5,.6],velocity:[-1,0]},incoming:{layer_id:'train',at:0,anchor:[.5,.6],velocity:[-1,0]}};
 p.editorial_plan.shots[1].sound={music_role:'Pulse continues',ambience_role:'Rail recedes',events:[],no_sync_reason:'No new collision or contact'};
 return p;
}
await test('specific moving subjects and matched direction pass',()=>assert.equal(editorialCheck(fixture()).ok,true));
for(const [name,mutate]of [
 ['missing scene coverage',p=>p.editorial_plan.shots.pop()],
 ['duplicate scene intent',p=>p.editorial_plan.shots[1].scene_id='a'],
 ['phantom subject',p=>p.editorial_plan.shots[0].subject_layers=['ghost']],
 ['generic action state',p=>p.editorial_plan.shots[0].action.before.state='장면 진입'],
 ['equal event times',p=>p.editorial_plan.shots[0].action.contact.at=0],
 ['end-exclusive timestamp',p=>p.editorial_plan.shots[0].action.after.at=3],
 ['static changed object',p=>p.scenes[0].composition.layers[0].keyframes=[{at:0,x:900,opacity:1},{at:2,x:900,opacity:1}]],
 ['static frame-zero override',p=>p.scenes[0].composition.layers[0].keyframes=[{at:0,x:400},{at:2,x:400}]],
 ['phantom cue',p=>p.editorial_plan.shots[0].sound.events[0].cue_id='ghost'],
 ['cue outside contact tolerance',p=>p.audio.cues[0].time=1.3],
 ['excessive sync tolerance',p=>p.editorial_plan.shots[0].sound.events[0].tolerance=9],
 ['text bound to drawing',p=>p.editorial_plan.shots[0].typography={role:'meaning',reason:'Read word',layers:['train']}],
 ['camera intent without camera',p=>Object.assign(p.editorial_plan.shots[0].motion,{driver:'camera',subject_layer:'train',end_framing:'Wide'})],
 ['wrong next scene',p=>p.editorial_plan.shots[0].bridge.next_scene='ghost'],
 ['reversed match-action',p=>p.editorial_plan.shots[0].bridge.incoming.velocity=[1,0]],
 ['stationary match-action',p=>p.editorial_plan.shots[0].bridge.incoming.velocity=[0,0]],
 ['anchor outside frame',p=>p.editorial_plan.shots[0].bridge.outgoing.anchor=[1.2,.5]],
 ['phantom bridge layer',p=>p.editorial_plan.shots[0].bridge.incoming.layer_id='ghost'],
 ['unexplained silence',p=>delete p.editorial_plan.shots[1].sound.no_sync_reason],
 ['null shot data',p=>p.editorial_plan.shots[0]=null]
])await test(name+' rejected',()=>{const p=fixture();mutate(p);assert.equal(editorialCheck(p).ok,false);});
await test('intentional direction reversal accepted with reason',()=>{const p=fixture();const b=p.editorial_plan.shots[0].bridge;b.incoming.velocity=[1,0];b.reversal_reason='Opposing flow shown as a new axis';assert.equal(editorialCheck(p).ok,true);});
await test('sound bridge must cross actual cut',()=>{const p=fixture(),b=p.editorial_plan.shots[0].bridge;p.editorial_plan.shots[0].bridge={kind:'sound-bridge',next_scene:'b',reason:'Rail resonance continues',cue_id:'contact'};p.audio.cues[0].duration=.5;assert.equal(editorialCheck(p).ok,false);p.audio.cues[0].duration=3;assert.equal(editorialCheck(p).ok,true);});
await test('ambience requires texture intent and keeps listening distinct',()=>{
 const p=fixture();p.audio.clips=[{bus:'ambience',asset_id:'river',start:0,duration:2}];assert.equal(editorialCheck(p).ok,false);
 const tx={intended:'Soft separated water droplets',avoid:'Broadband TV static',source_kind:'synthetic',asset_ids:['river'],status:'pending'};p.editorial_plan.shots[0].sound.texture=tx;
 assert.equal(editorialCheck(p).ok,true);assert.ok(editorialCheck(p).warnings.some(x=>x.includes('listening gate')));
 tx.status='accepted';assert.equal(editorialCheck(p).ok,false);tx.evidence='Fixture only: synthetic listener record, not actual approval';tx.signature=ambienceFingerprint(p,p.scenes[0]);assert.equal(editorialCheck(p).ok,true);
 tx.status='rejected';assert.ok(editorialCheck(p).warnings.some(x=>x.includes('rejected')));
 p.audio.clips[0].gain_db=-8;assert.equal(editorialCheck(p).ok,false);
});
await test('observation can be motionless and silent with purpose',()=>{const p=fixture(),q=p.editorial_plan.shots[1];q.role='observation';q.action.hold_reason='Allow horizon to settle after train passes';p.scenes[1].composition.layers[0].keyframes=[];q.motion.driver='none';assert.equal(editorialCheck(p).ok,true);});
await test('legacy input remains renderable but reports missing intent',()=>{const p=fixture();delete p.editorial_plan;assert.equal(editorialCheck(p).ok,true);assert.equal(editorialInventory(p).counts.NO_SHOT_INTENT,2);});
await test('review picks exact authored local times',()=>assert.deepEqual(reviewFrames(fixture()),[0,30,87,90,120,177]));
await test('listening and intent notes do not invalidate unchanged picture caches',()=>{
 const examples=fs.existsSync(path.join(ROOT,'examples-public'))?'examples-public':'examples',p=read(path.join(ROOT,examples,'object-flight.project.json')),q=structuredClone(p),profile={width:1280,height:720};
 q.editorial_plan={version:'shot-intent-v1',shots:[]};q.production_review={listening:'pending comparison'};q.audio.bpm++;
 assert.equal(sceneKey(p,p.scenes[0],profile,false),sceneKey(q,q.scenes[0],profile,false));assert.notEqual(approvalHash(p),approvalHash(q));
});
await test('empty selection rejected without recursion',()=>assert.throws(()=>frameSelection([]),/empty/));
await test('both project schemas embed the same offline editorial contract',()=>{
 const e=read(path.join(ROOT,'contracts/editorial.schema.json'));delete e.$id;delete e.$schema;
 for(const name of ['project.schema.json','project-3.1.schema.json']){const p=read(path.join(ROOT,'contracts',name));assert.equal(p.properties.editorial_plan.$ref,'#/$defs/editorial');assert.deepEqual(p.$defs.editorial,e);}
});
await test('intent changes invalidate approval and render into planning document',()=>{
 const examples=fs.existsSync(path.join(ROOT,'examples-public'))?'examples-public':'examples',p=read(path.join(ROOT,examples,'object-flight.project.json'));
 const q=shot(p.scenes[0].id);q.subject_layers=q.action.changed_layers=['departure-board'];q.action.verb='Reveal the departure board';q.action.before={at:0,state:'Panel transparent'};q.action.contact={at:.6,state:'Panel fully visible'};q.action.after={at:2.9,state:'Departures readable'};q.sound={music_role:'Arrival pulse',ambience_role:'Terminal air',events:[],no_sync_reason:'No impact required for a dissolve'};
 p.editorial_plan={version:'shot-intent-v1',shots:[q]};assert.equal(validate(p).ok,true,JSON.stringify(validate(p).errors));
 const file=path.join(out,'plan.html');plan(p,file);assert.ok(fs.readFileSync(file,'utf8').includes('Panel fully visible'));
 p.approval={hash:approvalHash(p)};q.purpose='Different purpose';assert.equal(validate(p).ok,false);
});
await test('135 selected output frames retain exact black/white boundary',async()=>{
 const movie=path.join(out,'boundary.mp4');fs.mkdirSync(out,{recursive:true});
 await run(tool('ffmpeg'),['-nostdin','-v','error','-f','lavfi','-i',"nullsrc=s=128x72:r=30,geq=lum='if(lt(N,67),16,235)':cb=128:cr=128",'-frames:v','135','-c:v','libx264','-preset','ultrafast','-crf','0','-pix_fmt','yuv420p','-y',movie]);
 const p={output:{fps:30,total_frames:135},scenes:[{id:'boundary',start:0,end:135}]},dir=path.join(out,'indexed');
 const evidence=await extractReviewFrames(p,movie,dir,{frames:Array.from({length:135},(_,i)=>i),width:128});assert.equal(evidence.frames.length,135);
 for(const n of [0,1,66,67,134]){
  assert.equal(evidence.frames[n].frame,n);
  const r=spawnSync(tool('ffmpeg'),['-v','error','-i',path.join(dir,evidence.frames[n].file),'-vf','scale=1:1','-f','rawvideo','-pix_fmt','rgb24','pipe:1'],{windowsHide:true});
  assert.equal(r.status,0,r.stderr.toString());assert.ok(n<67?r.stdout[0]<3:r.stdout[0]>252,'boundary frame '+n);
 }
 await assert.rejects(()=>extractReviewFrames(p,movie,dir),/Preserve prior/);
 await assert.rejects(()=>extractReviewFrames(p,movie,path.join(out,'invalid'),{frames:[135]}),/indices/);
});
write(path.join(out,'editorial-tests.json'),{ok:rows.every(x=>x.ok),rows,scope:'Intent bindings and exact output-frame evidence; no aesthetic or listening approval'});
if(rows.some(x=>!x.ok))process.exitCode=1;
