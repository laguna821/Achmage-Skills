import fs from 'node:fs';import path from 'node:path';
import {run,tool,write,hash,settings} from './io.mjs';
import {fileHash} from './media.mjs';
import {withStorage,ownedReserve,ownedComplete} from './storage.mjs';
export function frameSelection(indices){if(!indices.length)throw Error('Frame selection cannot be empty');if(indices.length===1)return 'eq(n\\,'+indices[0]+')';const m=Math.floor(indices.length/2);return '('+frameSelection(indices.slice(0,m))+'+'+frameSelection(indices.slice(m))+')';}
export function reviewFrames(p){
 const total=p.output.total_frames,fps=p.output.fps,byId=new Map((p.editorial_plan?.shots||[]).map(x=>[x.scene_id,x]));
 return [...new Set(p.scenes.flatMap(s=>{const a=byId.get(s.id)?.action;return a?['before','contact','after'].map(k=>s.start+Math.floor(a[k].at*fps+1e-5)):[s.start,Math.floor((s.start+s.end-1)/2),s.end-1];}))].filter(n=>Number.isInteger(n)&&n>=0&&n<total).sort((a,b)=>a-b);
}
export async function extractReviewFrames(p,movie,out,{frames=reviewFrames(p),width=480}={}){
 if(!Array.isArray(frames)||!frames.length||frames.length>300||!frames.every(n=>Number.isInteger(n)&&n>=0&&n<p.output.total_frames))throw Error('1–300 valid output frame indices required');
 if(!Number.isInteger(width)||width<128||width>960)throw Error('Review width must be128–960');
 const indices=[...new Set(frames)].sort((a,b)=>a-b);
 movie=path.resolve(movie);out=path.resolve(out);
 if(fs.existsSync(path.join(out,'evidence.json')))throw Error('Preserve prior review evidence; use a new output directory');
 const info=JSON.parse((await run(tool('ffprobe'),['-v','error','-select_streams','v:0','-show_entries','stream=nb_frames,r_frame_rate,duration,width,height','-of','json',movie])).out).streams[0];
 const [n,d]=info.r_frame_rate.split('/').map(Number);
 if(n/d!==p.output.fps||+info.nb_frames!==p.output.total_frames)throw Error('Review requires the exact CFR final frame count and fps');
 return withStorage(out,{...settings().storage,duration:p.output.total_frames/p.output.fps},async()=>{
  const files=indices.map((n,i)=>path.join(out,'frame-'+String(i).padStart(4,'0')+'.png'));
  for(const f of files)ownedReserve(f,{kind:'final',maxBytes:width*Math.ceil(info.height/info.width*width+2)*4+65536});
  // Sequential decode + frame index, not input -ss. Some seek paths yielded
  // a different picture in the 180s final despite reporting the requested time.
  await run(tool('ffmpeg'),['-nostdin','-v','error','-i',movie,'-vf','select='+frameSelection(indices)+',scale='+width+':-2','-fps_mode','vfr','-start_number','0','-frames:v',String(indices.length),'-y',path.join(out,'frame-%04d.png')]);
  const rows=indices.map((frame,i)=>{if(!fs.existsSync(files[i]))throw Error('Missing indexed review frame '+frame);ownedComplete(files[i]);return {frame,time:frame/p.output.fps,file:path.basename(files[i]),sha256:hash(fs.readFileSync(files[i]))};});
  const result={version:'indexed-review-v1',movie_sha256:await fileHash(movie),project_hash:hash(p),method:'sequential decode then select exact zero-based output frame; no input seek',width,frames:rows,perceptual_review:'pending'};
  write(path.join(out,'evidence.json'),result);return result;
 });
}
