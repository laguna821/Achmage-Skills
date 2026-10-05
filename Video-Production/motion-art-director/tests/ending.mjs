import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {choreographyErrors,envelopeGain,editAudio} from '../lib/audio-edit.mjs';import {run,tool} from '../lib/io.mjs';
const p={output:{total_frames:90},spatial:{nodes:[{id:'object'}]},scenes:[
 {id:'stop',start:0,end:45,driving:{speed:[[0,10],[1,0],[1.5,0]]},spatial:{transforms:{object:{keyframes:[{at:1,position:[0,0,0]},{at:1.5,position:[0,0,0]}]}}}},
 {id:'logo',start:45,end:90,composition:{layers:[{id:'logo',opacity:0,keyframes:[{at:.5,opacity:0},{at:.8,opacity:1}]}]}}
],audio:{clips:[],cues:[{id:'lock',kind:'chime',time:2,duration:.3}],bus_envelopes:{music:[[0,1],[.98,1],[1,0],[3,0]],sfx:[[0,1],[1,1],[1.1,0],[2,0],[2.004,1],[2.4,1],[2.5,0],[3,0]]},ending:{version:'event-ending-v1',stop_time:1,stop_scene:'stop',subject_id:'object',mechanical_quiet:1.1,logo_time:2,logo_scene:'logo',logo_layer:'logo',logo_cue_ids:['lock'],tail_silence:2.5}}};
delete p.audio.clips;
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name);};
test('complete event contract',()=>assert.deepEqual(choreographyErrors(p),[]));
test('sample envelope exact endpoints',()=>{assert.equal(envelopeGain(p.audio.bus_envelopes.music,1),0);assert.equal(envelopeGain(p.audio.bus_envelopes.music,.99),.5);});
for(const[name,mut]of [
 ['music returns under logo',q=>q.audio.bus_envelopes.music=[[0,1],[1,0],[2,1],[3,0]]],
 ['engine leaks into pause',q=>q.audio.bus_envelopes.sfx[3][1]=.1],
 ['moving after stop',q=>q.scenes[0].driving.speed[2][1]=3],
 ['geometry moves despite zero speed',q=>q.scenes[0].spatial.transforms.object.keyframes[1].position[2]=2],
 ['unbound vehicle',q=>q.audio.ending.subject_id='missing'],
 ['logo visible before event',q=>q.scenes[1].composition.layers[0].opacity=1],
 ['logo layer missing',q=>q.audio.ending.logo_layer='missing'],
 ['unknown ending version',q=>q.audio.ending.version='future'],
 ['reversed narrative order',q=>q.audio.ending.logo_time=.5],
 ['extra whoosh over logo',q=>q.audio.cues.push({time:2.1,duration:.2,kind:'whoosh'})],
 ['duplicate logo cue identity',q=>q.audio.cues.push({...q.audio.cues[0]})],
 ['external sound under logo',q=>q.audio.clips=[{bus:'sfx',start:0,duration:3}]],
 ['effect has long tail',q=>q.audio.cues[0].duration=1],
 ['no final silence',q=>q.audio.bus_envelopes.sfx.at(-1)[1]=.2],
 ['unknown audio bus',q=>q.audio.bus_envelopes.voice=[[0,1],[3,1]]],
 ['malformed envelope',q=>q.audio.bus_envelopes.music=[null,[3,1]]],
 ['nonfinite envelope',q=>q.audio.bus_envelopes.music[0][1]=NaN],
 ['unordered envelope',q=>q.audio.bus_envelopes.music[2][0]=.5]
])test(name,()=>{const q=structuredClone(p);mut(q);assert(choreographyErrors(q).length>0);});
// Exercise the real FFmpeg bus mix with continuous source tones. Verify the delivered PCM,
// rather than only a planner label, including a silent gap surrounded by audible sound.
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'motion-ending-')),paths=['music','sfx','mix'].map(n=>path.join(dir,n+'.wav'));
for(let i=0;i<2;i++)await run(tool('ffmpeg'),['-y','-v','error','-f','lavfi','-i','sine=frequency='+(i?880:440)+':duration=3:sample_rate=48000','-ac','2','-c:a','pcm_s16le',paths[i]]);
await editAudio(p,dir,paths);
function pcm(file){const b=fs.readFileSync(file);let off=12;while(off<b.length){const tag=b.toString('ascii',off,off+4),len=b.readUInt32LE(off+4);if(tag==='data')return b.subarray(off+8,off+8+len);off+=8+len+(len%2);}throw Error('WAV data missing');}
function peak(b,start,end){let max=0;for(let n=Math.ceil(start*48000)*4;n<Math.floor(end*48000)*4;n+=2)max=Math.max(max,Math.abs(b.readInt16LE(n)));return max;}
const m=pcm(paths[0]),s=pcm(paths[1]),mix=pcm(paths[2]);
test('rendered music actually ends at event sample',()=>{assert(peak(m,.8,.95)>100);assert.equal(peak(m,1.0001,3),0);});
test('rendered pause excludes SFX and music',()=>assert.equal(peak(mix,1.2,1.9),0));
test('only SFX can reenter during logo',()=>{assert.equal(peak(m,2.01,2.3),0);assert(peak(s,2.01,2.3)>100);assert(peak(mix,2.01,2.3)>100);});
test('rendered final silence',()=>assert.equal(peak(mix,2.6,2.99),0));
console.log(JSON.stringify({passed:count,fixture:dir}));
