import fs from 'node:fs';
import path from 'node:path';
export function ownedCacheFileCount(root){
 const file=path.join(root,'.motion-storage','owned.json');
 for(const item of [path.dirname(file),file])if(fs.existsSync(item)&&fs.lstatSync(item).isSymbolicLink())throw Error('Storage metadata symlink/junction rejected');
 if(!fs.existsSync(file))return 0;
 const entries=JSON.parse(fs.readFileSync(file,'utf8')).entries;
 if(!entries||typeof entries!=='object'||Array.isArray(entries))throw Error('Invalid existing storage manifest');
 return Object.values(entries).filter(e=>e?.kind==='cache'&&e.state==='complete').length;
}
// A short derivative must not shrink a longer film's allowance. Reserve file
// headroom alongside existing owned caches. Byte/free-space limits still apply;
// an explicit file cap, including zero, takes precedence.
export function renderStoragePolicy(project,configured={},existingCacheFiles=0){
 if(!Number.isSafeInteger(existingCacheFiles)||existingCacheFiles<0)throw Error('Invalid existing cache count');
 let workingFiles=80; // Audio buses, assembly and their verification metadata.
 for(const scene of project.scenes||[]){
  let groups=0,last=null;
  for(const layer of scene.composition?.layers||[]){const kind=layer.kind==='video'?'video':'graphics';if(kind==='video'||last!==kind)groups++;last=kind;}
  // Track + receipt per group, final composite + receipt, optional video masks.
  workingFiles+=Math.max(1,groups)*2+2+(scene.composition?.layers||[]).filter(l=>l.kind==='video'&&l.mask).length;
 }
 return {...configured,duration:project.output.total_frames/30,keepCacheFiles:configured.keepCacheFiles??Math.max(120,existingCacheFiles+workingFiles)};
}
