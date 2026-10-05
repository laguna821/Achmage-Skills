import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {read,write,hash,ROOT} from '../lib/io.mjs';
import {validate,approvalHash,revise} from '../lib/contract.mjs';
import {html,sceneKey} from '../lib/scene.mjs';
import {browser,pageFor} from '../lib/browser.mjs';
import {audio,score,CUE_KINDS} from '../lib/audio.mjs';
const p=read(path.join(ROOT,fs.existsSync(path.join(ROOT,'examples-public'))?'examples-public':'examples','book-150.project.json')),out=path.resolve(process.argv[2]||'longform-test-results'),rows=[];
const copy=()=>structuredClone(p),profile={width:1920,height:1080,fps:30,crf:18},keys=q=>q.scenes.map(s=>sceneKey(q,s,profile,false));
async function test(name,fn){try{await fn();rows.push({name,ok:true});console.log('PASS '+name);}catch(e){rows.push({name,ok:false,error:e.message});console.log('FAIL '+name+' '+e.message);}}
await test('150 seconds, 12 contiguous authored subjects, 4500 frames',()=>{assert.ok(validate(p).ok);assert.equal(p.scenes.length,12);assert.equal(p.output.total_frames,4500);assert.equal(p.content_units.length,12);});
for(const [name,mut] of [
 ['unknown sound cue',q=>q.audio.cues[0].kind='any-noise'],
 ['cue beyond movie',q=>q.audio.cues[0].time=151],
 ['cue negative duration',q=>q.audio.cues[0].duration=-1],
 ['invalid pan',q=>q.audio.cues[0].pan=2],
 ['unknown instrument',q=>q.audio.notes[0].instrument='not-real'],
 ['note beyond end',q=>q.audio.notes[0].start=150],
 ['note negative amplitude',q=>q.audio.notes[0].amp=-.1],
 ['NaN audio pitch',q=>q.audio.notes[0].note=NaN],
 ['malformed cue array',q=>q.audio.cues={}],
 ['null note',q=>q.audio.notes=[null]],
 ['unsafe loudness',q=>q.audio.loudness.integrated=-2],
 ['bad timeline easing',q=>q.scenes[0].composition.layers[2].keyframes[0].ease='typo'],
 ['NaN anisotropic transform',q=>q.scenes[0].composition.layers[2].scaleX=NaN],
 ['negative reveal amount',q=>q.scenes[0].composition.layers[2].reveal=-1],
 ['unknown transition',q=>q.scenes[1].transition_in.kind='typo'],
 ['unsupported rasterizer features',q=>q.profile.rasterizer='skia'],
 ['phantom objects',q=>q.scenes[5].visual_plan.objects[0].bindings=['no-machine']],
 ['missing content',q=>q.scenes[0].content_ids=['absent']],
 ['stale approval after note edit',q=>{q.approval={hash:approvalHash(q)};q.audio.notes[0].note+=1;}]
])await test('reject '+name,()=>{const q=copy();mut(q);assert.equal(validate(q).ok,false);});
await test('sound-only revision reuses every picture cut',()=>{const q=copy();q.audio.notes[0].note+=7;q.audio.cues[0].kind='paper';assert.deepEqual(keys(p),keys(q));assert.notEqual(approvalHash(p),approvalHash(q));});
await test('caption revision invalidates its cut and next transition only',()=>{const q=copy();q.content_units[4].display_text='다른 네 색의 점이 한 그림을 만듭니다.';const a=keys(p),b=keys(q),changed=a.flatMap((x,i)=>x===b[i]?[]:[i]);assert.deepEqual(changed,[4,5]);});
await test('same revision preserves source file and approval copy',()=>{const f=path.join(out,'source.json'),dest=path.join(out,'revised.json');write(f,p);const before=hash(fs.readFileSync(f));revise(f,p.content_units[2].content_id,'글자 사이와 줄, 크기를 맞춥니다.',dest);assert.equal(hash(fs.readFileSync(f)),before);assert.equal(read(dest).approval,undefined);});
await test('all cue families synthesize distinct output, seed is deterministic',async()=>{
 const base=copy();base.audio={...p.audio,notes:[{start:.1,duration:.2,note:60,amp:0,instrument:'felt',pan:0}],sections:[{start:0,end:1,energy:0}],cues:[],silence:[]};delete base.audio.loudness;base.output.total_frames=30;
 const hashes=[];for(const kind of CUE_KINDS){base.audio.cues=[{time:.1,kind,duration:.6,amp:1}];const a=await audio(base,path.join(out,'cue-'+kind));hashes.push(a.sha256[1]);}
 assert.equal(new Set(hashes).size,CUE_KINDS.length);
 base.audio.cues=[{time:.1,kind:'paper',duration:.6}];const a=await audio(base,path.join(out,'repeat-a')),b=await audio(base,path.join(out,'repeat-b'));assert.deepEqual(a.sha256,b.sha256);
});
await test('revise reports the next transition dependency',()=>{const source=path.join(out,'dependency-source.json'),dest=path.join(out,'dependency-revised.json');write(source,p);const r=revise(source,p.content_units[4].content_id,'네 가지 점을 겹쳐 그림을 만듭니다.',dest);assert.deepEqual(r.affected,['colour','printing']);});
await test('section energy zero remains silent',()=>{const q=copy();delete q.audio.notes;q.audio.sections=[{start:0,end:1,energy:0,chord:[60,64,67]}];assert.ok(score(q).notes.every(n=>n.amp===0));});
const b=await browser();
try{
 const f=path.join(out,'scene.html');write(f,html(p,{controls:false}));const {page,context,errors,denied}=await pageFor(b,f,960,540);
 await test('all 12 chapters and 11 transitions seek in shuffled order reproducibly',async()=>{const ts=[1,12.3,25.6,36.4,48.5,65.2,78.3,94.7,104.3,116.4,128.4,140.4,149];const expected=new Map();for(const t of ts){await page.evaluate(t=>__seek(t),t);expected.set(t,hash(await page.locator('#stage').screenshot()));}for(const t of ts.toReversed()){await page.evaluate(t=>__seek(t),t);assert.equal(hash(await page.locator('#stage').screenshot()),expected.get(t));}assert.deepEqual(errors,[]);assert.deepEqual(denied,[]);});
 await test('printing cylinders hold their layout until explicit zoom segment',async()=>{await page.evaluate(()=>__seek(65));const m=await page.locator('[data-layer-id="roller-0"]').evaluate(n=>{const m=n.transform.baseVal.consolidate().matrix;return Math.hypot(m.a,m.b)});assert.ok(Math.abs(m-1)<.00001);});
 await test('fold flips face and reading caption stays visible',async()=>{await page.evaluate(()=>__seek(87));assert.ok(Number(await page.locator('[data-layer-id="fold-right-back"]').getAttribute('opacity'))>.9);assert.equal(await page.locator('[data-layer-id="caption"]').textContent(),p.content_units[6].display_text);const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(ids.length,new Set(ids).size);});
 await context.close();
}finally{await b.close();}
const report={ok:rows.every(x=>x.ok),rows,scope:'Adversarial implementation tests; no claim of human listening or aesthetic approval.'};write(path.join(out,'report.json'),report);if(!report.ok)process.exitCode=1;
