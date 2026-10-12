import fs from 'node:fs';import path from 'node:path';
const GiB=1024**3;
const inside=(r,p)=>{const v=path.relative(r,p);return v===''||(!v.startsWith('..')&&!path.isAbsolute(v));};
export function storageProjectRoot(output,explicit){
 const absolute=path.resolve(output);
 if(explicit){const r=path.resolve(explicit);if(!inside(r,absolute))throw Error('Storage project root must contain output');return r;}
 let at=absolute;
 while(true){
  if(fs.existsSync(path.join(at,'.achmage-work.json'))){const work=path.dirname(at);return /^work-[a-f0-9]+$/i.test(path.basename(work))?path.dirname(work):at;}
  const next=path.dirname(at);if(next===at)break;at=next;
 }
 return absolute;
}
export function measureProject(root,{maxFiles=250000}={}){
 root=path.resolve(root);let bytes=0,files=0;const redirects=[],stack=[root];
 while(stack.length){const dir=stack.pop();const stat=fs.lstatSync(dir);if(stat.isSymbolicLink()){redirects.push(dir);continue;}
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isSymbolicLink()){redirects.push(file);continue;}if(e.isDirectory()){stack.push(file);continue;}if(!e.isFile())continue;
   try{bytes+=fs.lstatSync(file).size;files++;}catch(error){if(error.code!=='ENOENT')throw error;}
   if(files>maxFiles)throw Error('Storage inventory exceeds bounded file count; review project before production');
  }
 }
 return {root,bytes,files,redirects,measuredAt:new Date().toISOString()};
}
export class ProjectBudget{
 constructor(output,options={}){this.root=storageProjectRoot(output,options.projectRoot);this.limit=options.projectBudgetBytes??24*GiB;this.interval=options.projectScanMs??5000;this.planned=options.plannedBytes??0;this.measured=null;this.last=0;this.cleanupOnly=options.storageOperation==='cleanup';
  if(!Number.isFinite(this.limit)||this.limit<=0||!Number.isFinite(this.interval)||this.interval<0||!Number.isFinite(this.planned)||this.planned<0)throw Error('Invalid project storage budget');
  let at=this.root;while(true){if(fs.existsSync(at)&&fs.lstatSync(at).isSymbolicLink())throw Error('Storage project root has redirected ancestor');const n=path.dirname(at);if(n===at)break;at=n;}
 }
 check({force=false,reserve=0}={}){if(force||!this.measured||Date.now()-this.last>=this.interval){this.measured=measureProject(this.root);this.last=Date.now();}
  if(!this.cleanupOnly&&this.measured.bytes+Math.max(this.planned,reserve)>this.limit)throw Error('Project storage budget reached ('+this.measured.bytes+' / '+this.limit+' bytes). Preserve final/source; review obsolete runs with cache-plan before continuing.');
  return this.measured;
 }
}
