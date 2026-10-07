import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
import {StorageSession} from '../lib/storage.mjs';import {cachePlan,cachePrune} from '../lib/cache-cleanup.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'motion-cleanup-'));
fs.mkdirSync(path.join(dir,'hybrid-cache'));const s=new StorageSession(dir);
for(const [rel,kind]of [['hybrid-cache/test.mkv','cache'],['final.mp4','final'],['source.mp4','metadata']]){const f=path.join(dir,rel);s.reserve(f,{kind});fs.writeFileSync(f,'test');s.complete(f);}
fs.unlinkSync(s.lock);
const p=cachePlan(dir);assert.equal(p.candidates.length,1);assert.equal(cachePrune(p).dryRun,true);assert.ok(fs.existsSync(path.join(dir,'hybrid-cache/test.mkv')));
assert.throws(()=>cachePrune({...p,bytes:99},{apply:true}),/signature/);
fs.appendFileSync(path.join(dir,'hybrid-cache/test.mkv'),'changed');assert.throws(()=>cachePrune(p,{apply:true}),/stale/);
const p2=cachePlan(dir);fs.writeFileSync(path.join(dir,'.motion-storage/lease.json'),JSON.stringify({host:os.hostname(),pid:process.pid}));assert.throws(()=>cachePrune(p2,{apply:true}),/lease/);fs.unlinkSync(path.join(dir,'.motion-storage/lease.json'));
const result=cachePrune(p2,{apply:true});assert.equal(result.files,1);assert.ok(fs.existsSync(path.join(dir,'final.mp4')));assert.ok(fs.existsSync(path.join(dir,'source.mp4')));assert.equal(cachePlan(dir).candidates.length,0);
console.log('cache-cleanup: dry-run, tamper, stale, active lease, protected outputs, apply passed');
