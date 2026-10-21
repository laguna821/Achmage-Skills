import assert from 'node:assert/strict';import {renderStoragePolicy,ownedCacheFileCount} from '../lib/render-storage-policy.mjs';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {withStorage} from '../lib/storage.mjs';
const p={output:{total_frames:5400},scenes:Array.from({length:89},()=>({composition:{layers:[{kind:'video'},{kind:'svg'},{kind:'text'}]}}))};
const result=renderStoragePolicy(p);assert.equal(result.duration,180);assert(result.keepCacheFiles>=89*6);assert.equal(result.cacheBudgetBytes,undefined);assert.equal(result.minFreeBytes,undefined);
const explicit=renderStoragePolicy(p,{keepCacheFiles:12,cacheBudgetBytes:123456,minFreeBytes:789});assert.equal(explicit.keepCacheFiles,12);assert.equal(explicit.cacheBudgetBytes,123456);assert.equal(explicit.minFreeBytes,789);
assert.equal(renderStoragePolicy({...p,scenes:p.scenes.slice(0,1)}).keepCacheFiles,120);
assert.equal(renderStoragePolicy(p,{keepCacheFiles:0}).keepCacheFiles,0);
const interleaved={...p,scenes:[{composition:{layers:[{kind:'video',mask:{}},{kind:'text'},{kind:'video'},{kind:'svg'}]}}]};assert.equal(renderStoragePolicy(interleaved).keepCacheFiles,120);
assert.deepEqual(Object.keys(result).sort(),['duration','keepCacheFiles']);console.log('render-storage-policy: working-set retention, explicit limits, byte/free-space preservation, short films and zero-cache override passed');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'motion-working-cache-'));
async function populate(name,options,count){const dir=path.join(root,name);await withStorage(dir,renderStoragePolicy(p,{minFreeBytes:0,...options}),async s=>{for(let i=0;i<count;i++){const f=path.join(dir,'cache',i+'.track');fs.mkdirSync(path.dirname(f),{recursive:true});s.reserve(f,{kind:'cache'});fs.writeFileSync(f,Buffer.alloc(100));s.capture(f);s.complete(f);}});return fs.readdirSync(path.join(dir,'cache')).length;}
assert.equal(await populate('film',{},534),534,'Retain a full working film below byte budget');
assert.equal(await populate('explicit',{keepCacheFiles:12},40),12,'Respect explicit user file cap');
assert.equal(await populate('bytes',{cacheBudgetBytes:1000},40),10,'Byte limit still trims the working film');
console.log('StorageSession integration: full film retained; explicit file and byte limits enforced');
// A long film followed by a short derivative, then a revision of the long film,
// shares one cache. Checking either project in isolation missed this regression.
const shared=path.join(root,'shared'),short={...p,scenes:p.scenes.slice(0,6),output:{total_frames:900}};
async function addShared(project,prefix,count,config={}){
 await withStorage(shared,renderStoragePolicy(project,{minFreeBytes:0,...config},ownedCacheFileCount(shared)),async s=>{
  for(let i=0;i<count;i++){const f=path.join(shared,'cache',prefix+i+'.track');fs.mkdirSync(path.dirname(f),{recursive:true});s.reserve(f,{kind:'cache'});fs.writeFileSync(f,Buffer.alloc(100));s.capture(f);s.complete(f);}
 });
}
await addShared(p,'long-',534);
await addShared(short,'portrait-',40);
assert.equal(ownedCacheFileCount(shared),574,'Short derivative retains the existing long film');
assert(fs.existsSync(path.join(shared,'cache','long-0.track')),'Old first cut survives');
await addShared(p,'revision-',2);
assert.equal(ownedCacheFileCount(shared),576);
await addShared(short,'',0,{keepCacheFiles:12});
assert.equal(ownedCacheFileCount(shared),12,'Explicit limit still wins over existing cache');
await addShared(short,'',0,{cacheBudgetBytes:500});
assert.equal(ownedCacheFileCount(shared),5,'Byte budget still wins over retained working sets');
assert.throws(()=>renderStoragePolicy(p,{},-1),/Invalid existing/);
const malformed=path.join(root,'malformed','.motion-storage');fs.mkdirSync(malformed,{recursive:true});fs.writeFileSync(path.join(malformed,'owned.json'),'{"entries":[]}');
assert.throws(()=>ownedCacheFileCount(path.dirname(malformed)),/Invalid existing/);
console.log('Shared workspace: long→short→revision retention, explicit caps, byte pressure and malformed manifest passed');
