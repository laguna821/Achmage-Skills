import path from 'node:path';
import {ROOT,write,mkdir,run,tool,hash} from './io.mjs';
import {ownedCopy} from './storage.mjs';
import {messageTrackAudit} from './message-track.mjs';

// All paths passed to the filter are generated ASCII basenames; user copy is
// UTF-8 textfile data with expansion disabled, never FFmpeg filter source.
export function messageFilterPlan(track,profile,{startFrame=0,frames}={}){
 const check=messageTrackAudit(track,{duration:Infinity});
 if(!check.ok)throw Error(check.errors.join('\n'));
 if(!Number.isInteger(startFrame)||startFrame<0||!Number.isInteger(frames)||frames<1)throw Error('Integer message frame interval required');
 const W=profile.width,H=profile.height,size=Math.round(W*(profile.portrait ? .044 : .025));
 return track.units.flatMap(u=>u.phrases).map((p,i)=>{
  const begin=Math.max(0,Math.ceil(p.start*30-1e-7)-startFrame);
  const end=Math.min(frames,Math.ceil(p.end*30-1e-7)-startFrame);
  const text=(profile.portrait?p.portrait_text:p.landscape_text)||p.text;
  if(text.replace(/\s/g,'')!==p.text.replace(/\s/g,''))throw Error('Layout must preserve message text');
  return {file:`message-${i}.txt`,text,begin,end,filter:
   `drawtext=fontfile=message-font.ttf:textfile=message-${i}.txt:expansion=none:fontsize=${size}:fontcolor=white:borderw=2:bordercolor=black@0.7:x=${Math.round(W*.07)}:y=${Math.round(H*.81)}:enable='gte(n,${begin})*lt(n,${end})'`};
 }).filter(p=>p.end>p.begin);
}
export async function compositeMessages(input,p,file,profile,{startFrame=0,frames=p.output.total_frames}={}){
 if(p.message_track?.render_mode!=='post-composite')return input;
 const plans=messageFilterPlan(p.message_track,profile,{startFrame,frames});
 if(!plans.length)return input;
 // A hash-sized output name plus ".titles" can exceed Windows CreateProcess's
 // cwd limit even though the files themselves exist. Keep the generated cwd
 // short and ASCII-named; user copy remains data in UTF-8 text files.
 const folder=path.join(path.dirname(path.resolve(file)),'.msg-'+hash(path.resolve(file)).slice(0,12));
 if(process.platform==='win32'&&folder.length>=245)throw Error('Message output root is too deep for Windows child cwd; use a shorter --out path');
 mkdir(folder);
 ownedCopy(path.join(ROOT,'assets/fonts/PretendardVariable.ttf'),path.join(folder,'message-font.ttf'));
 for(const item of plans)write(path.join(folder,item.file),item.text);
 write(path.join(folder,'filter.txt'),plans.map(p=>p.filter).join(','));
 await run(tool('ffmpeg'),['-nostdin','-y','-v','error','-i',path.resolve(input),'-vf',plans.map(p=>p.filter).join(','),'-an','-frames:v',String(frames),'-r','30','-c:v','libx264','-threads','2','-preset','fast','-crf',String(profile.crf),'-pix_fmt','yuv420p','-movflags','+faststart',path.resolve(file)],{cwd:folder});
 return file;
}
