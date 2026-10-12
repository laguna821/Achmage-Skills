import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
import {ProjectBudget,measureProject,storageProjectRoot} from '../lib/project-storage.mjs';import {withStorage} from '../lib/storage.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'motion-project-budget-'));
try{
 const branch=path.join(root,'work-abcdef','branch-one');fs.mkdirSync(branch,{recursive:true});fs.writeFileSync(path.join(branch,'.achmage-work.json'),'{}');
 assert.equal(storageProjectRoot(path.join(branch,'production','v2')),root);
 const old=path.join(branch,'old');fs.mkdirSync(old);fs.writeFileSync(path.join(old,'completed.wav'),Buffer.alloc(2500));
 const out=path.join(branch,'new');fs.mkdirSync(out);
 assert.throws(()=>new ProjectBudget(out,{projectBudgetBytes:2000}).check(),/budget reached/,'Sibling finals must count before any new render');
 assert.throws(()=>new ProjectBudget(out,{projectRoot:root,projectBudgetBytes:5000,plannedBytes:3000}).check(),/budget reached/,'Estimated output headroom');
 const budget=new ProjectBudget(out,{projectRoot:root,projectBudgetBytes:5000,projectScanMs:0});budget.check();fs.writeFileSync(path.join(old,'package.zip'),Buffer.alloc(3000));assert.throws(()=>budget.check(),/budget reached/,'Package outside current run must count during render');
 const before=measureProject(root);assert(before.bytes>=5500);assert(fs.existsSync(path.join(old,'completed.wav')));
 await assert.rejects(async()=>withStorage(out,{projectRoot:root,projectBudgetBytes:5000,minFreeBytes:0},async()=>{}),/budget reached/);assert(!fs.existsSync(path.join(out,'.motion-storage','lease.json')),'Rejected preflight releases lease');
 const cleanup=new ProjectBudget(out,{projectRoot:root,projectBudgetBytes:5000,storageOperation:'cleanup'});cleanup.check();assert(fs.existsSync(path.join(old,'completed.wav')),'Inventory/cleanup permission must not delete finals');
 const fail=path.join(root,'failed');await assert.rejects(withStorage(fail,{projectRoot:root,projectBudgetBytes:1000000,minFreeBytes:0},async s=>{const f=path.join(fail,'temporary.mp4');s.reserve(f,{kind:'temporary'});fs.writeFileSync(f,'partial');s.capture(f);throw Error('intentional writer failure');}),/intentional/);assert(!fs.existsSync(path.join(fail,'temporary.mp4')),'Failed owned output collected');
 assert.throws(()=>new ProjectBudget(out,{projectRoot:os.tmpdir()+'-other'}),/must contain/);
 console.log('project-storage: sibling runs/finals/packages, managed-root discovery, pre/during guard, planned headroom, lease cleanup, protected finals and failed output recovery passed');
}finally{fs.rmSync(root,{recursive:true,force:true});}
