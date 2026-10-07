import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import os from 'node:os';
import {StorageSession} from './storage.mjs';
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
function safe(root,rel){const file=path.resolve(root,rel),r=path.relative(root,file);if(!r||r.startsWith('..')||path.isAbsolute(r))throw Error('Cache path outside root');let p=file;while(p!==root){if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw Error('Cache symlink/junction rejected');p=path.dirname(p);}return file;}
function idle(root){let p=root;while(true){const f=path.join(p,'.motion-storage','lease.json');if(fs.existsSync(f)){const l=JSON.parse(fs.readFileSync(f));let live=true;try{process.kill(l.pid,0);}catch(e){live=e.code!=='ESRCH';}if(l.host!==os.hostname()||live)throw Error('Active storage lease');}if(p===path.dirname(p))break;p=path.dirname(p);}}
function signature(p){const {signature,...body}=p;return digest(JSON.stringify(body));}
export function cachePlan(input){const root=fs.realpathSync(input);idle(root);const manifest=path.join(root,'.motion-storage','owned.json');safe(root,'.motion-storage/owned.json');const bytes=fs.readFileSync(manifest),m=JSON.parse(bytes),candidates=[],protectedFiles=[];
for(const [rel,e]of Object.entries(m.entries)){const file=safe(root,rel);if(!fs.existsSync(file))continue;const s=fs.statSync(file);if(!s.isFile())continue;
if(e.kind!=='cache'||e.state!=='complete'||!/^hybrid-cache\//.test(rel)){protectedFiles.push(rel);continue;}
if(e.workerPid)throw Error('Cache writer recorded; inspect before cleanup');
if(e.identity?.ino!==String(s.ino)||e.identity?.birth!==s.birthtimeMs)throw Error('Cache identity changed: '+rel);
candidates.push({path:rel,bytes:s.size,sha256:digest(fs.readFileSync(file)),identity:e.identity});}
const p={version:1,root,manifestSha256:digest(bytes),candidates,protectedFiles,bytes:candidates.reduce((n,x)=>n+x.bytes,0)};return {...p,signature:signature(p)};}
export function cachePrune(plan,{apply=false}={}){if(plan.signature!==signature(plan))throw Error('Cache plan signature mismatch');const current=cachePlan(plan.root);if(current.signature!==plan.signature)throw Error('Cache plan stale; rebuild before deletion');if(!apply)return {dryRun:true,files:plan.candidates.length,bytes:plan.bytes};
const session=new StorageSession(plan.root),removed=[];try{if(digest(fs.readFileSync(session.manifest))!==plan.manifestSha256)throw Error('Manifest changed before cleanup');
for(const c of plan.candidates){const f=session.resolve(path.join(plan.root,c.path));if(digest(fs.readFileSync(f))!==c.sha256)throw Error('Cache changed before cleanup');}
for(const c of plan.candidates){const n=session.remove(session.entries[c.path],'explicit verified cache-prune');if(n!==c.bytes||fs.existsSync(path.join(plan.root,c.path)))throw Error('Cache removal incomplete: '+c.path);removed.push(c);}
session.save();return {dryRun:false,files:removed.length,bytes:removed.reduce((n,x)=>n+x.bytes,0),removed};
}finally{session.save();if(fs.existsSync(session.lock)&&JSON.parse(fs.readFileSync(session.lock)).id===session.id)fs.unlinkSync(session.lock);}}
