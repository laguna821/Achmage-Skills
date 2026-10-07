import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {validate} from '../lib/contract.mjs';
import {mediaLayerKey,graphicsKey,outputVideoRect} from '../lib/hybrid.mjs';
import {inspectMedia} from '../lib/media.mjs';
import {run,tool,hash,write} from '../lib/io.mjs';
import {audio} from '../lib/audio.mjs';
import {choreographyErrors} from '../lib/audio-edit.mjs';
const out=fs.mkdtempSync(path.join(os.tmpdir(),'motion-hybrid-test-'));
let count=0;async function test(name,fn){await fn();count++;console.log('PASS '+name);}
const a={asset_id:'v',kind:'video',path:'fixture.mp4',duration:4,width:160,height:90,sha256:'a'.repeat(64),provenance:'test fixture',audio:{index:1,sample_rate:48000,channels:2},rights:{commercial:true,adaptation:true,source_url:'authored:fixture',license_url:'MIT',attribution:'Synthetic test only'}};
const video={id:'footage',kind:'video',asset_id:'v',source_in:0,rect:[0,0,1920,1080]};
const p={schema_version:'3.1.0',project_id:'hybrid-fixture',title:'Fixture',direction:'Executable technical counterexamples',renderer:'hybrid-composite',visual_policy:'licensed_media',render_network:'local_only',editing_contract:'shot-rhythm-v1',profile:{jobs:1,gpu:false},output:{width:1920,height:1080,fps:30,total_frames:90},seed:1,sources:[],content_units:[],required_content_ids:[],events:[],routes:['video-editing'],assets:[a],scenes:[{id:'cut',start:0,end:90,mode:'composite',content_ids:[],shot_role:'action',composition:{width:1920,height:1080,layers:[video,{id:'shape',kind:'svg',svg:'<circle cx="960" cy="540" r="100" fill="white"/>'}]}}],audio:{bpm:128,motif:[60],sections:[{start:0,end:3,energy:0}]}};
await test('3.1 valid video contract',()=>assert.deepEqual(validate(p).errors,[]));
for(const [label,mutate]of [
 ['missing composition',q=>delete q.scenes[0].composition],
 ['unknown rasterizer',q=>q.scenes[0].rasterizer='unknown'],
 ['unsupported video transform',q=>q.scenes[0].composition.layers[0].rotation=90],
 ['unsupported graphic blend',q=>q.scenes[0].composition.layers[1].blend='multiply'],
 ['source out of range',q=>q.scenes[0].composition.layers[0].source_in=2],
 ['sound claimed on silent source',q=>{delete q.assets[0].audio;q.scenes[0].composition.layers[0].sound='source';}],
 ['rectangle outside canvas',q=>q.scenes[0].composition.layers[0].rect=[100,0,1920,1080]],
 ['transition exceeds incoming scene',q=>{q.scenes[0].end=82;q.scenes.push({...structuredClone(q.scenes[0]),id:'b',start:82,end:90,transition_in:{kind:'fade',duration:1}});}],
 ['subframe transition',q=>q.scenes[0].transition_in={kind:'fade',duration:.001}]
])await test(label,()=>{const q=structuredClone(p);mutate(q);assert(validate(q).errors.length);});
const profile={width:1280,height:720,portrait:false};
await test('draft right-edge panel does not overflow by one pixel',()=>assert.deepEqual(outputVideoRect([1282,0,638,1080],2/3,2/3,0,0,1280,720),[855,0,425,720]));
await test('draft bottom-edge panel preserves exact edge',()=>assert.deepEqual(outputVideoRect([0,722,1920,358],2/3,2/3,0,0,1280,720),[0,481,1280,239]));
await test('genuinely out-of-canvas rectangles still rejected',()=>assert.throws(()=>outputVideoRect([1282,0,650,1080],2/3,2/3,0,0,1280,720)));
await test('video geometry invalidates source track',()=>assert.notEqual(mediaLayerKey(a,video,90,profile,{width:1920,height:1080}),mediaLayerKey(a,video,90,profile,{width:3840,height:2160})));
await test('procedural scene values invalidate graphics',()=>{const s=structuredClone(p.scenes[0]),layers=[{id:'d',kind:'procedural',mode:'data'}];s.values=[1,2];const k=graphicsKey(p,s,layers,90,profile);s.values=[2,3];assert.notEqual(k,graphicsKey(p,s,layers,90,profile));});
await test('portrait defs invalidate graphics',()=>{const s=structuredClone(p.scenes[0]);s.portrait_composition={...s.composition,defs:'<g id="a"/>'};const k=graphicsKey(p,s,s.composition.layers,90,{...profile,portrait:true});s.portrait_composition.defs='<g id="b"/>';assert.notEqual(k,graphicsKey(p,s,s.composition.layers,90,{...profile,portrait:true}));});
await test('music data does not invalidate graphic tracks',()=>{const q=structuredClone(p),s=q.scenes[0],k=graphicsKey(q,s,s.composition.layers,90,profile);q.audio.bpm=140;assert.equal(k,graphicsKey(q,s,s.composition.layers,90,profile));});
const source=path.join(out,'short-picture-long-audio.mp4');
await run(tool('ffmpeg'),['-y','-v','error','-f','lavfi','-i','color=c=red:s=160x90:r=30000/1001:d=0.267','-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=3','-c:v','libx264','-threads','1','-pix_fmt','yuv420p','-c:a','aac',source]);
await test('video duration excludes long audio tail',async()=>{const m=await inspectMedia(source);assert(m.duration<.31);assert(m.avg_frame_rate==='30000/1001');});
const tone=path.join(out,'source.mp4');
await run(tool('ffmpeg'),['-y','-v','error','-f','lavfi','-i','color=c=blue:s=160x90:r=30:d=4','-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=4','-c:v','libx264','-threads','1','-pix_fmt','yuv420p','-c:a','aac',tone]);
const q=structuredClone(p);q.assets[0]={...q.assets[0],...await inspectMedia(tone),path:tone};delete q.assets[0].probe;
q.scenes[0].composition.layers[0].sound='source';q.scenes[0].composition.layers[0].speed=.5;
q.scenes[0].composition.layers.push({id:'pulse',kind:'svg',svg:'<circle r="1"/>',opacity:1,keyframes:[{at:1,opacity:0},{at:3,opacity:0}]},{id:'title',kind:'text',text:'END',opacity:0,keyframes:[{at:2,opacity:0},{at:2.1,opacity:1}]});
q.audio.cues=[{id:'lock',kind:'chime',time:2,duration:.2}];
q.audio.bus_envelopes={music:[[0,1],[.98,1],[1,0],[3,0]],sfx:[[0,1],[1.1,0],[2,0],[2.004,1],[2.3,1],[2.4,0],[3,0]],ambience:[[0,1],[1,1],[1.1,0],[3,0]],voice:[[0,1],[1,1],[1.1,0],[3,0]]};
q.audio.ending={version:'event-ending-v2',event_time:1,music_stop:1,quiet_time:1.1,title_time:2,tail_silence:2.4,event_scene:'cut',event_layer:'pulse',event_property:'opacity',event_value:0,title_scene:'cut',title_layer:'title',title_cue_ids:['lock']};
await test('generic ending binds an ordinary graphic event',()=>assert.deepEqual(choreographyErrors(q),[]));
for(const bus of ['music','ambience','voice','sfx'])await test(bus+' tail leak rejected',()=>{const bad=structuredClone(q);bad.audio.bus_envelopes[bus].at(-1)[1]=1;assert(choreographyErrors(bad).length);});
const score=await audio(q,path.join(out,'sound'));
function pcm(file){const b=fs.readFileSync(file);let i=12;while(i<b.length){const n=b.readUInt32LE(i+4);if(b.toString('ascii',i,i+4)==='data')return b.subarray(i+8,i+8+n);i+=8+n+n%2;}throw Error('PCM missing');}
function peak(b,start,end){let max=0;for(let i=Math.ceil(start*48000)*4;i<Math.floor(end*48000)*4;i+=2)max=Math.max(max,Math.abs(b.readInt16LE(i)));return max;}
const ambient=pcm(path.join(out,'sound/ambience.wav')),mix=pcm(score.files[2]);
await test('source audio actually enters ambience stem',()=>assert(peak(ambient,.15,.8)>100));
await test('all buses silent in pause',()=>assert.equal(peak(mix,1.2,1.95),0));
await test('identified title effect audible after pause',()=>assert(peak(mix,2.02,2.15)>100));
await test('all buses silent after ending',()=>assert.equal(peak(mix,2.5,2.95),0));
const boundary=structuredClone(q);
boundary.scenes[0].composition.layers.find(l=>l.id==='title').keyframes=[{at:1.6,opacity:0},{at:1.7,opacity:1}];
boundary.audio.cues=[{id:'lock',kind:'chime',time:1.6,duration:.8}];
boundary.audio.bus_envelopes.sfx=[[0,1],[1.1,0],[1.6,0],[1.604,1],[2.3,1],[2.4,0],[3,0]];
boundary.audio.ending.title_time=1.6;
boundary.audio.loudness={integrated:-16,true_peak:-1.5};
await test('ending cue boundary tolerates arithmetic roundoff',()=>assert.deepEqual(choreographyErrors(boundary),[]));
const mastered=await audio(boundary,path.join(out,'mastered-boundary')),masterPcm=pcm(mastered.files[2]);
await test('mastering preserves exact pause boundary',()=>assert.equal(peak(masterPcm,1.1,1.6),0));
await test('mastering preserves exact final-silence boundary',()=>assert.equal(peak(masterPcm,2.4,3),0));
await test('exact gating preserves intended title cue',()=>assert(peak(masterPcm,1.62,1.8)>100));
write(path.join(out,'result.json'),{passed:count,review:'automated only',notebook:'not measured'});console.log(JSON.stringify({passed:count,out}));
