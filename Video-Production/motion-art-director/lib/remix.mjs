import fs from 'node:fs';import path from 'node:path';
import {read,write,hash,run,tool,settings} from './io.mjs';
import {requireValid,approvalHash} from './contract.mjs';
import {hybridRuntimeHash} from './hybrid.mjs';
import {verifyMedia,fileHash} from './media.mjs';
import {imageAssets} from './assets.mjs';
import {audio} from './audio.mjs';
import {probe} from './render.mjs';
import {withStorage} from './storage.mjs';
const metadata=new Set(['audio','project_id','approval','status','revision','production_review']);
function canonical(x){if(Array.isArray(x))return x.map(canonical);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));return x;}
export function pictureIdentity(p){return hash(canonical(Object.fromEntries(Object.entries(p).filter(([k])=>!metadata.has(k)))));}
export function checkPictureReuse(p,prior,receipt,folder,runtime=hybridRuntimeHash()){
 requireValid(p,true);requireValid(prior,true);
 if(p.renderer!=='hybrid-composite'||p.scenes.some(s=>s.renderer&&s.renderer!=='hybrid-composite'))throw Error('Remix requires homogeneous hybrid picture; use normal render for other engines');
 if(receipt.state!=='final_rendered'||receipt.runtime!==runtime)throw Error('Completed matching picture runtime required');
 const priorApproval=approvalHash(prior);
 if(receipt.project!==prior.project_id||receipt.totalFrames!==prior.output.total_frames)throw Error('Prior project/receipt mismatch');
 if(receipt.projectHash?receipt.projectHash!==priorApproval:!path.resolve(folder).split(path.sep).includes(priorApproval.slice(0,16)))throw Error('Prior project does not match render receipt identity');
 if(pictureIdentity(p)!==pictureIdentity(prior))throw Error('Picture inputs changed; use normal render');
 if(receipt.profile?.fps!==30||!receipt.profile.width||!receipt.profile.height)throw Error('Prior profile missing');
 return pictureIdentity(p);
}
async function videoDigest(file){const r=await run(tool('ffmpeg'),['-v','error','-i',file,'-map','0:v:0','-c:v','copy','-an','-f','hash','-hash','sha256','-']);return r.out.trim();}
export async function remix(p,sourceRun,target){
 sourceRun=path.resolve(sourceRun);target=path.resolve(target);
 if(fs.existsSync(target))throw Error('Remix output must be a new directory; preserve prior outputs');
 const prior=read(path.join(sourceRun,'project.json')),receipt=read(path.join(sourceRun,'render-state.json')),runtime=hybridRuntimeHash();
 const identity=checkPictureReuse(p,prior,receipt,sourceRun,runtime),source=path.join(sourceRun,'final.mp4');
 if(await fileHash(source)!==receipt.sha256)throw Error('Prior final hash mismatch');
 await verifyMedia(p);imageAssets(p);
 const sourceMedia=await probe(source),v=sourceMedia.streams.find(s=>s.codec_type==='video');
 if(!v||Number(v.nb_frames)!==p.output.total_frames||v.width!==receipt.profile.width||v.height!==receipt.profile.height)throw Error('Prior encoded picture/profile mismatch');
 const sourceVideo=await videoDigest(source),started=new Date().toISOString();
 return withStorage(target,{...settings().storage,duration:p.output.total_frames/30},async()=>{
  const sound=await audio(p,target),final=path.join(target,'final.mp4');
  if(hybridRuntimeHash()!==runtime)throw Error('Runtime changed during remix');
  await run(tool('ffmpeg'),['-y','-v','error','-i',source,'-i',sound.files[2],'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t',String(p.output.total_frames/30),'-movflags','+faststart',final]);
  const digest=await videoDigest(final);
  if(digest!==sourceVideo||await fileHash(source)!==receipt.sha256||hybridRuntimeHash()!==runtime)throw Error('Picture, source or runtime changed during remix');
  const media=await probe(final),log={project:p.project_id,projectHash:approvalHash(p),profile:receipt.profile,runtime,started,finished:new Date().toISOString(),state:'final_rendered',totalFrames:p.output.total_frames,sha256:await fileHash(final),media,
   pictureReuse:{mode:'verified-final-stream-copy',sourceSha256:receipt.sha256,identity,encodedVideoHash:digest,renderedFrames:0,intermediateCacheRequired:false},
   clips:receipt.clips.map(c=>({scene:c.scene,frames:c.frames,reusedFromFinal:true})),audio:{reused:false},
   review:{visual:'inherited picture; new mix pending',listening:'pending',notebookHardware:'not_measured'}};
  log.deliverables=Object.fromEntries(await Promise.all(['music','sfx','ambience','voice','mix'].map(async n=>[n,await fileHash(path.join(target,n+'.wav'))])));
  write(path.join(target,'project.json'),p);write(path.join(target,'render-state.json'),log);
  return {out:target,final,log};
 });
}

