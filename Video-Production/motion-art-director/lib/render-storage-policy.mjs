// Keep one working film's tracks and receipts when they fit the byte budget.
// A fixed file cap otherwise evicts short-shot projects even far below8GiB.
export function renderStoragePolicy(project,configured={}){
 let workingFiles=80; // Audio buses, assembly and their verification metadata.
 for(const scene of project.scenes||[]){
  let groups=0,last=null;
  for(const layer of scene.composition?.layers||[]){const kind=layer.kind==='video'?'video':'graphics';if(kind==='video'||last!==kind)groups++;last=kind;}
  // Track + receipt per group, final composite + receipt, optional video masks.
  workingFiles+=Math.max(1,groups)*2+2+(scene.composition?.layers||[]).filter(l=>l.kind==='video'&&l.mask).length;
 }
 return {...configured,duration:project.output.total_frames/30,keepCacheFiles:configured.keepCacheFiles??Math.max(120,workingFiles)};
}
