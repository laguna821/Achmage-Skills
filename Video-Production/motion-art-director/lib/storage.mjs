import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import crypto from 'node:crypto';
import {AsyncLocalStorage} from 'node:async_hooks';import {spawn} from 'node:child_process';
const context=new AsyncLocalStorage(),GiB=1024**3;
const within=(root,file)=>{const r=path.relative(root,file);return r!==''&&!r.startsWith('..')&&!path.isAbsolute(r);};
const alive=pid=>{try{process.kill(pid,0);return true;}catch{return false;}};
const ident=s=>({ino:String(s.ino),birth:s.birthtimeMs});
function metadataSafe(dir){if(fs.existsSync(dir)&&fs.lstatSync(dir).isSymbolicLink())throw Error('Storage metadata symlink/junction rejected');if(fs.existsSync(dir))for(const n of ['owned.json','events.jsonl','lease.json']){const f=path.join(dir,n);if(fs.existsSync(f)&&fs.lstatSync(f).isSymbolicLink())throw Error('Storage metadata symlink/junction rejected');}}
function otherLease(root,file,id){let at=path.dirname(file);while(true){const dir=path.join(at,'.motion-storage');metadataSafe(dir);const f=path.join(dir,'lease.json');if(fs.existsSync(f)){const l=JSON.parse(fs.readFileSync(f));if(l.id!==id&&(l.host!==os.hostname()||alive(l.pid)))return f;}if(at===root||path.dirname(at)===at)break;at=path.dirname(at);}return null;}
async function killOwnedChild(child){if(child.exitCode!==null||child.signalCode!==null)return;const closed=new Promise(resolve=>child.once('close',resolve));if(process.platform==='win32'){await new Promise(resolve=>{const killer=spawn('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});killer.once('error',resolve);killer.once('close',resolve);});}else child.kill('SIGKILL');if(child.exitCode===null&&child.signalCode===null)child.kill('SIGKILL');await closed;}
export const expectedWavBytes=(seconds,rate=48000,channels=2,bits=16)=>{if(![seconds,rate,channels,bits].every(Number.isFinite)||seconds<0||rate<=0||channels<=0||![8,16,24,32,64].includes(bits))throw Error('Invalid PCM size contract');return Math.round(seconds*rate)*channels*bits/8+44;};
export const currentStorage=()=>context.getStore();
export class StorageSession{
 constructor(root,options={}){
  this.root=path.resolve(root);fs.mkdirSync(this.root,{recursive:true});this.root=fs.realpathSync(this.root);
  this.options={minFreeBytes:2*GiB,cacheBudgetBytes:8*GiB,keepCacheFiles:120,duration:0,pollMs:250,...options};
  this.id=crypto.randomUUID();this.children=new Set();this.error=null;this.dir=path.join(this.root,'.motion-storage');metadataSafe(this.dir);if(otherLease(path.parse(this.root).root,this.root,this.id))throw Error('Storage workspace overlaps an active ancestor');fs.mkdirSync(this.dir,{recursive:true});this.manifest=path.join(this.dir,'owned.json');this.lock=path.join(this.dir,'lease.json');this.events=path.join(this.dir,'events.jsonl');
  if(fs.existsSync(this.lock)){const old=JSON.parse(fs.readFileSync(this.lock));if(old.host!==os.hostname()||alive(old.pid))throw Error('Storage workspace is active in another process');fs.unlinkSync(this.lock);}
  fs.writeFileSync(this.lock,JSON.stringify({pid:process.pid,host:os.hostname(),id:this.id}),{flag:'wx'});
  try{this.entries=fs.existsSync(this.manifest)?JSON.parse(fs.readFileSync(this.manifest)).entries:{};
   if(!this.entries||typeof this.entries!=='object'||Array.isArray(this.entries))throw Error('Invalid storage manifest');
   this.record('start',{freeBytes:this.free(),ownedBytes:this.total()});
  }catch(error){if(fs.existsSync(this.lock)&&JSON.parse(fs.readFileSync(this.lock)).id===this.id)fs.unlinkSync(this.lock);throw error;}
 }
 free(){const s=fs.statfsSync(this.root);return Number(s.bavail)*Number(s.bsize);}
 resolve(file){const absolute=path.resolve(file);if(!within(this.root,absolute))throw Error('Output is outside owned workspace');let at=absolute;while(at!==this.root){if(fs.existsSync(at)&&fs.lstatSync(at).isSymbolicLink())throw Error('Symlink/junction output is not owned');at=path.dirname(at);}return absolute;}
 key(file){return path.relative(this.root,this.resolve(file)).replaceAll('\\','/');}
 save(){metadataSafe(this.dir);const tmp=this.manifest+'.'+this.id+'.tmp';fs.writeFileSync(tmp,JSON.stringify({version:1,root:this.root,entries:this.entries}),{flag:'wx'});fs.renameSync(tmp,this.manifest);}
 record(event,extra={}){metadataSafe(this.dir);fs.appendFileSync(this.events,JSON.stringify({at:new Date().toISOString(),session:this.id,event,...extra})+'\n');}
 total(){return Object.values(this.entries||{}).reduce((n,e)=>n+(e.bytes||0),0);}
 reserve(file,{kind,maxBytes}={}){
  const key=this.key(file),old=this.entries[key],exists=fs.existsSync(file);
  if(otherLease(this.root,file,this.id))throw Error('Output overlaps another active storage workspace');
  if(old?.workerPid&&alive(old.workerPid))throw Error('Refusing to overwrite output with a live writer: '+key);
  if(exists&&!old)throw Error('Refusing to claim an existing unowned output: '+key);
  if(old?.kind==='final'&&old.state==='complete'&&old.session!==this.id)throw Error('Preserve verified output; use a new revision path: '+key);
  if(old&&exists&&old.identity&&!this.same(file,old))throw Error('Owned output was replaced externally: '+key);
  kind??=old?.kind??(/(?:^|\/)(?:hybrid-cache|cache)\//.test(key)?'cache':/^(final\.mp4|music\.wav|sfx\.wav|ambience\.wav|voice\.wav|mix\.wav)$/.test(path.basename(file))?'final':'temporary');
  if(!exists){fs.mkdirSync(path.dirname(file),{recursive:true});fs.closeSync(fs.openSync(file,'wx'));}
  this.entries[key]={...old,identity:ident(fs.statSync(file)),path:key,kind,state:'pending',session:this.id,claimed:Date.now(),maxBytes:maxBytes??(/\.wav$/i.test(file)&&this.options.duration>0?expectedWavBytes(this.options.duration)+65536:Infinity),bytes:fs.statSync(file).size};
  this.save();this.check();return key;
 }
 same(file,e){const s=fs.statSync(file);return e.identity?.ino===String(s.ino)&&e.identity?.birth===s.birthtimeMs;}
 capture(file){const key=this.key(file),e=this.entries[key];if(!e||!fs.existsSync(file))return;const s=fs.statSync(file);if(!e.identity)e.identity=ident(s);if(!this.same(file,e))throw Error('Owned file identity changed: '+key);e.bytes=s.size;}
 complete(file){const key=this.key(file),e=this.entries[key];if(!e)return;this.capture(file);if(e.maxBytes!==null&&e.bytes>e.maxBytes)throw Error('Output exceeded expected size: '+key);e.state='complete';e.used=Date.now();this.save();}
 move(from,to){const key=this.key(from),next=this.key(to),e=this.entries[key],dest=this.entries[next];if(!e)throw Error('Refusing unowned move: '+key);if([e,dest].some(v=>v?.workerPid&&alive(v.workerPid)))throw Error('Refusing to move output with a live writer');if(otherLease(this.root,from,this.id)||otherLease(this.root,to,this.id))throw Error('Move overlaps active storage workspace');this.capture(from);if(dest?.kind==='final'&&dest.state==='complete')throw Error('Refusing to replace completed final: '+next);if(fs.existsSync(to)&&(!dest||!dest.identity||!this.same(to,dest)))throw Error('Refusing to replace unowned output: '+next);fs.renameSync(from,to);delete this.entries[key];this.entries[next]={...e,path:next,state:'complete',used:Date.now()};this.save();}
 check(){
  if(this.error)throw this.error;
  if(this.free()<this.options.minFreeBytes)throw Error('Storage reserve reached; render stopped before disk exhaustion');
  let dirty=false;for(const e of Object.values(this.entries)){if(e.session!==this.id||e.state!=='pending')continue;const file=this.resolve(path.join(this.root,e.path));if(!fs.existsSync(file))continue;const had=e.identity;this.capture(file);if(!had)dirty=true;if(e.maxBytes!==null&&e.bytes>e.maxBytes)throw Error('Output exceeded expected size: '+e.path+' ('+e.bytes+' bytes)');}if(dirty)this.save();
 }
 stop(error){if(this.error)return;this.error=error;this.record('guard-stop',{message:error.message});this.stopping=Promise.all([...this.children].map(killOwnedChild));}
 watch(child,files=[],timeout){this.children.add(child);const timer=timeout?setTimeout(()=>this.stop(Error('Generated output process exceeded time budget')),timeout):null;for(const file of files){const e=this.entries[this.key(file)];if(e)e.workerPid=child.pid;}this.save();child.once('close',code=>{clearTimeout(timer);this.children.delete(child);for(const file of files){try{const e=this.entries[this.key(file)];if(e)e.workerPid=null;this.capture(file);if(code===0&&!this.error)this.complete(file);}catch(e){this.stop(e);}}this.save();});return child;}
 remove(e,reason){
  const file=this.resolve(path.join(this.root,e.path));if(!fs.existsSync(file)){delete this.entries[e.path];return 0;}
  if(e.kind==='final'&&e.state==='complete')return 0;
  if(otherLease(this.root,file,this.id)){this.record('cleanup-skipped',{path:e.path,reason:'Another storage lease protects this subtree'});return 0;}
  if(e.workerPid&&alive(e.workerPid)){this.record('cleanup-skipped',{path:e.path,reason:'Recorded writer process is still active'});return 0;}
  if(!e.identity||!this.same(file,e)){this.record('cleanup-skipped',{path:e.path,reason:'Unconfirmed/replaced file identity'});return 0;}
  const bytes=fs.statSync(file).size;
  try{fs.unlinkSync(file);delete this.entries[e.path];this.record('removed',{path:e.path,bytes,reason});return bytes;}catch(error){this.record('cleanup-blocked',{path:e.path,reason:error.code||error.message});return 0;}
 }
 sweep(){
  let freed=0;for(const e of Object.values(this.entries)){if(e.state==='pending'||e.kind==='temporary')freed+=this.remove(e,'failed or temporary generated output');}
  const cache=Object.values(this.entries).filter(e=>e.kind==='cache'&&e.state==='complete').sort((a,b)=>(b.used||0)-(a.used||0));let bytes=0;
  for(let i=0;i<cache.length;i++){bytes+=cache[i].bytes||0;if(i>=this.options.keepCacheFiles||bytes>this.options.cacheBudgetBytes||this.free()<this.options.minFreeBytes)freed+=this.remove(cache[i],'generated cache budget');}
  this.save();this.record('sweep',{freedBytes:freed,freeBytes:this.free(),ownedBytes:this.total()});return freed;
 }
 async run(fn){
  let timer,succeeded=false;try{this.sweep();this.check();timer=setInterval(()=>{try{this.check();}catch(e){this.stop(e);}},this.options.pollMs);const result=await context.run(this,()=>fn(this));this.check();for(const e of Object.values(this.entries))if(e.session===this.id&&e.kind==='final'&&e.state==='complete')e.verified=true;this.save();succeeded=true;return result;}
  catch(error){this.error??=error;this.record('task-failed',{message:error.message});throw error;}
  finally{clearInterval(timer);await this.stopping;await Promise.all([...this.children].map(killOwnedChild));if(!succeeded)for(const e of Object.values(this.entries))if(e.session===this.id&&e.kind==='final'&&!e.verified)e.kind='temporary';this.sweep();this.record('finish',{freeBytes:this.free(),ownedBytes:this.total(),failed:!succeeded});if(fs.existsSync(this.lock)&&JSON.parse(fs.readFileSync(this.lock)).id===this.id)fs.unlinkSync(this.lock);}
 }
}
export function withStorage(root,options,fn){const active=currentStorage();if(active){const resolved=path.resolve(root);if(resolved!==active.root&&!within(active.root,resolved))throw Error('Nested storage root is outside active workspace');return fn(active);}return new StorageSession(root,options).run(fn);}
export function ownedMove(from,to){const s=currentStorage();return s?s.move(from,to):fs.renameSync(from,to);}
export function ownedReserve(file,options){return currentStorage()?.reserve(file,options);}
export function ownedComplete(file){return currentStorage()?.complete(file);}
export function ownedCopy(from,to,options){const s=currentStorage();if(s)s.reserve(to,options);fs.copyFileSync(from,to);if(s)s.complete(to);}
export function guardedSpawn(exe,args,options={}){
 const {managedOutput,...spawnOptions}=options,s=currentStorage();if(!s)return spawn(exe,args,{windowsHide:true,...spawnOptions});
 s.check();const candidate=managedOutput||(args.includes('--out')?args[args.indexOf('--out')+1]:/^ffmpeg(?:\.exe)?$/i.test(path.basename(exe))?args.at(-1):null),files=[];
 if(typeof candidate==='string'&&path.isAbsolute(candidate)&&/\.(wav|mp4|mkv|png|jpg)$/i.test(candidate)){s.reserve(candidate);files.push(candidate);}
 const timeout=spawnOptions.timeout??(files.length?Math.max(60000,s.options.duration*5000):undefined);delete spawnOptions.timeout;delete spawnOptions.killSignal;
 const child=spawn(exe,args,{windowsHide:true,...spawnOptions});return s.watch(child,files,timeout);
}
