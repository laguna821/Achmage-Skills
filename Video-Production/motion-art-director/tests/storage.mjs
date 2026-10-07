import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
import {once} from 'node:events';
import {StorageSession,withStorage,expectedWavBytes,guardedSpawn} from '../lib/storage.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'motion-storage-test-')),outside=path.join(path.dirname(root),path.basename(root)+'-source.txt');fs.writeFileSync(outside,'source');
const original=path.join(root,'original.mp4');fs.writeFileSync(original,'untouched user source');let count=0;
assert.equal(expectedWavBytes(28),5376044);count++;
await withStorage(root,{minFreeBytes:0,cacheBudgetBytes:128,keepCacheFiles:1},async s=>{
 assert.throws(()=>s.reserve(original),/unowned/);assert.throws(()=>s.reserve(outside),/outside/);count+=2;
 assert.throws(()=>new StorageSession(root,{minFreeBytes:0}),/active/);count++;
 for(const [name,kind]of [['final.mp4','final'],['cache/a.mp4','cache'],['cache/b.mp4','cache'],['failed.partial.mp4','temporary']]){const f=path.join(root,name);fs.mkdirSync(path.dirname(f),{recursive:true});s.reserve(f,{kind});fs.writeFileSync(f,Buffer.alloc(100));s.capture(f);if(kind!=='temporary')s.complete(f);}
});
assert(fs.existsSync(path.join(root,'final.mp4')));assert(!fs.existsSync(path.join(root,'failed.partial.mp4')));assert.equal(fs.readdirSync(path.join(root,'cache')).length,1);count+=3;
assert.equal(fs.readFileSync(original,'utf8'),'untouched user source');assert.equal(fs.readFileSync(outside,'utf8'),'source');count+=2;
for(let i=0;i<3;i++){
 const f=path.join(root,'oversize-'+i+'.wav');
 await assert.rejects(withStorage(root,{duration:.01,minFreeBytes:0,pollMs:10},async s=>{const child=guardedSpawn(process.execPath,['-e',"const fs=require('fs');setInterval(()=>fs.appendFileSync(process.argv[1],Buffer.alloc(32768)),2)",f],{managedOutput:f});await once(child,'close');s.check();}),/expected size/);
 assert(!fs.existsSync(f));count++;
}
await assert.rejects(withStorage(root,{minFreeBytes:Number.MAX_SAFE_INTEGER},async()=>{}),/reserve/);count++;
assert(!fs.existsSync(path.join(root,'.motion-storage/lease.json')));count++;
const entries=fs.readFileSync(path.join(root,'.motion-storage/events.jsonl'),'utf8').trim().split('\n').map(JSON.parse);assert(entries.some(e=>e.event==='guard-stop'));assert(entries.some(e=>e.event==='removed'&&e.bytes>0));count++;
await withStorage(root,{minFreeBytes:0},async s=>{
 const temp=path.join(root,'replacement.partial.mp4');s.reserve(temp);fs.writeFileSync(temp,'replacement');
 assert.throws(()=>s.move(temp,path.join(root,'final.mp4')),/completed final/);count++;
 assert.throws(()=>s.move(original,path.join(root,'user-destination.mp4')),/unowned/);count++;
 assert.throws(()=>new StorageSession(path.join(root,'nested'),{minFreeBytes:0}),/ancestor/);count++;
 const {write}=await import('../lib/io.mjs');assert.throws(()=>write(original,'changed'),/unowned/);count++;
});
const broken=path.join(root,'broken-manifest');fs.mkdirSync(path.join(broken,'.motion-storage'),{recursive:true});fs.writeFileSync(path.join(broken,'.motion-storage/owned.json'),'not JSON');
assert.throws(()=>new StorageSession(broken,{minFreeBytes:0}));assert(!fs.existsSync(path.join(broken,'.motion-storage/lease.json')));count++;
const retry=path.join(root,'retry-audio'),{audio}=await import('../lib/audio.mjs');
const p={schema_version:'3.1.0',seed:1,output:{total_frames:30},scenes:[],assets:[],audio:{bpm:80,motif:[60],sections:[{start:0,end:1,energy:0}],loudness:{integrated:-16,true_peak:-1.5}}};
await assert.rejects(withStorage(retry,{duration:1,minFreeBytes:0},()=>audio(p,retry)),/silent/);assert.equal(fs.readdirSync(retry).filter(x=>x.endsWith('.wav')).length,0);count++;
delete p.audio.loudness;const sound=await withStorage(retry,{duration:1,minFreeBytes:0},()=>audio(p,retry));assert.equal(Object.keys(sound.stems).length,5);assert(Object.values(sound.stems).every(x=>fs.existsSync(x.file)));count++;
console.log(JSON.stringify({passed:count,root,sourceAndFinalPreserved:true,oversizedRetryAccumulation:0,audioFailureRetry:true}));
