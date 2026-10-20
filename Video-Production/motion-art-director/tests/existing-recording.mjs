import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {audio,audioErrors,score} from '../lib/audio.mjs';
import {validate} from '../lib/contract.mjs';
import {run,tool,hash} from '../lib/io.mjs';

const parent=process.env.MOTION_MUSIC_TEST_OUTPUT||os.tmpdir();
fs.mkdirSync(parent,{recursive:true});
const out=fs.mkdtempSync(path.join(parent,'motion-recording-'));
// Non-musical metrology signal only. This is not a soundtrack or demo music.
const raw=Buffer.alloc(2*48000*4);
for(let n=0;n<2*48000;n++){
 const sample=n%12000<32?Math.round(1200*(1-n%12000/32)):0;
 raw.writeInt16LE(sample,n*4);raw.writeInt16LE(-sample,n*4+2);
}
const rawFile=path.join(out,'measurement.s16le'),mp3=path.join(out,'recording.mp3');
fs.writeFileSync(rawFile,raw);
await run(tool('ffmpeg'),['-y','-v','error','-f','s16le','-ar','48000','-ac','2','-i',rawFile,'-c:a','libmp3lame','-b:a','192k',mp3]);
const asset={asset_id:'existing-track',kind:'audio',origin:'existing-recording',path:mp3,
 sha256:hash(fs.readFileSync(mp3)),provenance:'Non-musical test fixture; not a public music candidate',
 rights:{commercial:true,adaptation:true,source_url:'authored:test-signal',license_url:'MIT',attribution:'Test signal'}};
const p={schema_version:'3.1.0',project_id:'recording-contract',title:'Fixture',direction:'Technical test only',
 renderer:'hybrid-composite',visual_policy:'licensed_media',render_network:'local_only',editing_contract:'shot-rhythm-v1',
 profile:{jobs:1,gpu:false},output:{width:1920,height:1080,fps:30,total_frames:60},seed:7,
 sources:[],content_units:[],required_content_ids:[],events:[],routes:['video-editing'],assets:[asset],
 scenes:[{id:'one',start:0,end:60,mode:'composite',shot_role:'action',content_ids:[],composition:{width:1920,height:1080,
 layers:[{id:'shape',kind:'svg',svg:'<rect width="1920" height="1080" fill="#000"/>'}]}}],
 audio:{music_source_policy:'existing-recordings-only',cues:[],
 clips:[{asset_id:'existing-track',bus:'music',source_in:0,start:0,duration:2,gain_db:0}]}};
assert.deepEqual(validate(p).errors,[],'recordings do not require invented BPM/motif/zero-energy synthesis');
assert.equal(score(p).notes.length,0);
assert.equal(score(p).music_generation,'disabled');
let count=3;
for(const [name,mutate] of [
 ['notes',q=>q.audio.notes=[{start:0,duration:1,note:60,amp:.1,instrument:'bell'}]],
 ['sections',q=>q.audio.sections=[{start:0,end:2,energy:0}]],
 ['missing track',q=>q.audio.clips=[]],
 ['only effects',q=>q.audio.clips[0].bus='sfx'],
 ['unknown mode',q=>q.audio.music_source_policy='whatever'],
 ['generated origin',q=>q.assets[0].origin='generated'],
 ['missing origin',q=>delete q.assets[0].origin],
 ['permission absent',q=>delete q.assets[0].rights]
]){
 const bad=structuredClone(p);mutate(bad);
 assert(audioErrors(bad).length,name);
 const forbidden=path.join(out,'reject-'+name.replaceAll(' ','-'));
 await assert.rejects(audio(bad,forbidden));assert(!fs.existsSync(forbidden),'invalid music plan creates no output');
 count++;
}
const withFx=structuredClone(p);withFx.audio.cues=[{kind:'tick',time:.4,duration:.05}];
assert.deepEqual(audioErrors(withFx),[],'music selection does not forbid deliberate graphic SFX');
const old=structuredClone(p);old.audio={bpm:100,motif:[60],sections:[{start:0,end:2,energy:.2}],cues:[]};
assert(score(old).notes.length>0,'unmodified legacy projects retain their composition');
count+=2;
function pcm(file){
 const b=fs.readFileSync(file);let off=12;
 while(off+8<=b.length){const n=b.readUInt32LE(off+4);if(b.toString('ascii',off,off+4)==='data')return b.subarray(off+8,off+8+n);off+=8+n+(n&1);}
 throw Error('PCM data chunk missing');
}
const expected=path.join(out,'expected.wav');
await run(tool('ffmpeg'),['-y','-v','error','-i',mp3,'-t','2','-ar','48000','-ac','2','-c:a','pcm_s16le',expected]);
const reference=pcm(expected);
for(const version of ['3.1.0','3.0.0']){
 const q=structuredClone(p);q.schema_version=version;q.renderer=version==='3.0.0'?'vector-composite':'hybrid-composite';
 assert.deepEqual(validate(q).errors,[]);
 const result=await audio(q,path.join(out,'edited-'+version)),actual=pcm(result.stems.music.file);
 assert.equal(actual.length,reference.length);
 let delta=0,peak=0;
 for(let i=0;i<actual.length;i+=2){delta=Math.max(delta,Math.abs(actual.readInt16LE(i)-reference.readInt16LE(i)));peak=Math.max(peak,Math.abs(actual.readInt16LE(i)));}
 assert(peak>100,'test cannot pass with an all-silent output');assert(delta<=1,'only the decoded recording enters the music bus');
 assert(pcm(result.stems.sfx.file).every(x=>x===0),'no hidden effects');
 assert.equal(result.synthesis.notes.length,0);count+=4;
}
const faded=structuredClone(p);faded.schema_version='3.0.0';faded.renderer='vector-composite';
Object.assign(faded.audio.clips[0],{fade_in:.25,fade_out:.5});
const fadeResult=await audio(faded,path.join(out,'explicit-fades')),fadePcm=pcm(fadeResult.stems.music.file);
assert.equal(fadePcm.readInt16LE(0),0,'an explicit fade-in still works');
const windowPeak=(b,start,end)=>{let value=0;for(let i=Math.floor(start*48000)*4;i<Math.floor(end*48000)*4;i+=2)value=Math.max(value,Math.abs(b.readInt16LE(i)));return value;};
assert(windowPeak(fadePcm,1.74,1.77)<windowPeak(reference,1.74,1.77)*.6,'an explicit fade-out still works');count+=2;
const report={passed:count,out,scope:'Source-only PCM identity, refusal counterexamples, explicit fades, legacy behavior; not subjective listening'};
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
