import fs from 'node:fs';
import path from 'node:path';
import {guardedSpawn as spawn,ownedMove,ownedCopy,ownedReserve,ownedComplete} from './storage.mjs';
import {once} from 'node:events';
import {ROOT,write,read,hash,mkdir,run,tool,escape,settings} from './io.mjs';
import {assetPath,fileHash,verifyMedia} from './media.mjs';
import {sourceAudioClips} from './audio31.mjs';
import {html} from './scene.mjs';
import {browser,pageFor} from './browser.mjs';
import {approvalHash} from './contract.mjs';
import {cameraFilter} from './camera31.mjs';

const even=n=>Math.max(2,Math.round(n/2)*2);
export function outputVideoRect(rect,sx,sy,ox,oy,W,H){
 const x=Math.round(rect[0]*sx+ox),y=Math.round(rect[1]*sy+oy);
 const right=Math.round((rect[0]+rect[2])*sx+ox),bottom=Math.round((rect[1]+rect[3])*sy+oy);
 const w=right-x,h=bottom-y;
 if(x<0||y<0||right>W||bottom>H||w<1||h<1)throw Error('Video rectangle must fit composition after edge quantization');
 return [x,y,w,h];
}
export function hybridRuntimeHash(){return hash(['assets/gsap.min.js','vendor/awesome-ai-motion/lib/fonts/BodoniModa.ttf','assets/fonts/PretendardVariable.ttf','lib/io.mjs','lib/storage.mjs','lib/audio31.mjs','lib/pcm-duck.mjs','scripts/skia_frames.py','assets/spatial.js','assets/spatial-v2.js','lib/spatial.mjs','lib/ending31.mjs','lib/hybrid.mjs','lib/camera31.mjs','lib/media.mjs','lib/contract.mjs','lib/scene.mjs','lib/browser.mjs','lib/audio.mjs','lib/audio-edit.mjs','assets/vector.js','assets/stage.js','assets/fonts/PretendardVariable.woff2'].map(f=>hash(fs.readFileSync(path.join(ROOT,f))))).slice(0,16);}
export function mediaLayerKey(a,l,frames,profile,geometry={width:1920,height:1080}){return hash({version:hybridRuntimeHash(),source:a.sha256,metadata:[a.rotation,a.color_space,a.color_transfer,a.sample_aspect_ratio],layer:l,geometry,frames,profile});}
export function graphicsKey(p,s,layers,frames,profile){const c=profile.portrait?(s.portrait_composition||s.composition):s.composition;return hash({version:hybridRuntimeHash(),seed:p.seed,semantics:p.timeline_semantics,rasterizer:s.rasterizer||p.profile?.rasterizer||'chromium',scene:{...s,composition:{...c,layers},portrait_composition:undefined,transition_in:undefined},content:p.content_units.filter(c=>layers.some(l=>l.content_id===c.content_id)),frames,profile});}
async function cached(file,key){try{const r=read(file+'.json');return r.key===key&&r.sha256===await fileHash(file);}catch{return false;}}
async function receipt(file,key,extra={}){write(file+'.json',{key,sha256:await fileHash(file),...extra});}
function partial(file){return file.replace(/\.(\w+)$/,'.partial.$1');}
async function alphaTrack(p,s,layers,frames,file,b,profile,budget,startFrame=0){
 const q=structuredClone(p);q.renderer='vector-composite';q.profile={...q.profile,rasterizer:'chromium'};delete q.material_flow;
 const c=profile.portrait?(s.portrait_composition||s.composition):s.composition;
 const local={...s,start:0,end:frames+startFrame,composition:{...c,layers},portrait_composition:undefined,transition_in:undefined};
 q.scenes=[local];q.output={...q.output,total_frames:frames+startFrame};
 if((s.rasterizer||p.profile?.rasterizer)==='skia'){
  const source=file+'.project.json',cfg=settings(),temp=partial(file);write(source,q);
  const args=['-X','utf8',path.join(ROOT,'scripts/skia_frames.py'),'--project',source,'--width',String(profile.width),'--height',String(profile.height),'--start',String(startFrame),'--end',String(startFrame+frames),'--out',temp,'--ffmpeg',tool('ffmpeg'),'--alpha'];
  if(profile.portrait)args.push('--portrait');if(Number.isFinite(budget))args.push('--stop-after',String(budget));
  await run(cfg.python||'python',args,{env:{...process.env,...(cfg.skiaPath?{PYTHONPATH:cfg.skiaPath}:{})}});ownedMove(temp,file);return;
 }
 const f=file+'.html';write(f,html(q,{portrait:profile.portrait,controls:false}));
 const {page,context,errors,denied}=await pageFor(b,f,profile.width,profile.height),temp=partial(file);
 const ff=spawn(tool('ffmpeg'),['-y','-v','error','-threads','2','-f','image2pipe','-vcodec','png','-framerate','30','-i','pipe:0','-an','-c:v','ffv1','-level','3','-threads','2','-pix_fmt','bgra',temp],{windowsHide:true,stdio:['pipe','ignore','pipe']});
 let error='',broken;ff.stderr.on('data',d=>error=(error+d).slice(-12000));ff.stdin.on('error',e=>broken=e);
 const ended=new Promise((resolve,reject)=>{ff.on('error',reject);ff.on('close',c=>c===0?resolve():reject(Error('Alpha encode: '+error)));});ended.catch(()=>{});
 try{
  await page.evaluate(()=>document.body.style.background='transparent');
  for(let frame=0;frame<frames;frame++){
   if(frame>=budget)throw Error('Test interruption requested');
   await page.evaluate(frame=>{document.getElementById('stage').innerHTML=window.__vectorScene(PROJECT.scenes[0],frame,true);},frame+startFrame);
   const png=await page.locator('#stage').screenshot({type:'png',omitBackground:true,animations:'disabled'});
   if(broken)throw broken;if(!ff.stdin.write(png))await once(ff.stdin,'drain');
  }
  ff.stdin.end();await ended;if(errors.length||denied.length)throw Error('Graphic browser errors: '+JSON.stringify({errors,denied}));ownedMove(temp,file);
 }catch(e){ff.kill();throw e;}finally{await context.close();}
}
async function maskImage(l,file,b,W,H,sx,sy,ox=0,oy=0){
 const [x,y,w,h]=outputVideoRect(l.rect,sx,sy,ox,oy,W,H);let shape;
 if(l.mask.kind==='ellipse')shape='<ellipse cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" rx="'+w/2+'" ry="'+h/2+'"/>';
 else if(l.mask.kind==='path')shape='<path d="'+escape(l.mask.d)+'" transform="translate('+ox+' '+oy+') scale('+sx+' '+sy+')"/>';
 else shape='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+((l.mask.radius??32)*sx)+'"/>';
 const temp=file+'.html';write(temp,'<html><style>body{margin:0}</style><svg id="stage" xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><rect width="100%" height="100%" fill="black"/><g fill="white">'+shape+'</g></svg><script>window.__ready=true</script></html>');
 const {page,context}=await pageFor(b,temp,W,H);try{ownedReserve(file,{kind:'temporary',maxBytes:W*H*4+65536});await page.locator('#stage').screenshot({path:file});ownedComplete(file);}finally{await context.close();}
}
async function videoTrack(p,s,l,frames,file,b,profile,startFrame=0){
 const a=p.assets.find(a=>a.asset_id===l.asset_id),c=profile.portrait?(s.portrait_composition||s.composition):s.composition;
 const W=profile.width,H=profile.height,sx=Math.min(W/(c.width||1920),H/(c.height||1080)),sy=sx,ox=(W-(c.width||1920)*sx)/2,oy=(H-(c.height||1080)*sx)/2;
 const [x,y,w,h]=outputVideoRect(l.rect,sx,sy,ox,oy,W,H);
 const speed=l.speed??1;let filter='trim=start='+l.source_in+':duration='+((frames+startFrame)/30*speed)+',setpts=(PTS-STARTPTS)/'+speed+',fps=30';
 if(startFrame)filter+=',trim=start_frame='+startFrame+',setpts=PTS-STARTPTS';
 if(l.crop){const [cx,cy,cw,ch]=l.crop;filter+=',crop=iw*'+cw+':ih*'+ch+':iw*'+cx+':ih*'+cy;}
 filter+=l.fit==='contain'?',scale='+w+':'+h+':force_original_aspect_ratio=decrease,pad='+w+':'+h+':(ow-iw)/2:(oh-ih)/2:color=black@0':',scale='+w+':'+h+':force_original_aspect_ratio=increase,crop='+w+':'+h;
 filter+=',setsar=1,format=rgba,pad='+W+':'+H+':'+x+':'+y+':color=black@0';
 const args=['-y','-v','error','-threads','2','-i',assetPath(p,a)],temp=partial(file);
 if(l.mask){const m=file+'.mask.png';await maskImage(l,m,b,W,H,sx,sy,ox,oy);args.push('-loop','1','-i',m,'-filter_complex_threads','1','-filter_complex','[0:v]'+filter+'[v];[1:v]format=gray[mask];[v][mask]alphamerge,format=bgra[out]','-map','[out]');}
 else args.push('-vf',filter+',format=bgra');
 args.push('-an','-frames:v',String(frames),'-c:v','ffv1','-level','3','-threads','2','-pix_fmt','bgra',temp);await run(tool('ffmpeg'),args);ownedMove(temp,file);
}
async function composite(tracks,s,frames,file,profile,startFrame=0){
 const W=profile.width,H=profile.height,c=profile.portrait?(s.portrait_composition||s.composition):s.composition,bg=/^#[0-9a-f]{6}$/i.test(c.background||'')?c.background:'#07121d';
 const args=['-y','-v','error','-f','lavfi','-i','color=c='+bg+':s='+W+'x'+H+':r=30:d='+frames/30];
 tracks.forEach(f=>args.push('-i',f));let filters='',prior='0:v';
 tracks.forEach((f,i)=>{const label='z'+i;filters+='['+prior+']['+(i+1)+':v]overlay=0:0:format=auto:alpha=straight:eof_action=pass['+label+'];';prior=label;});
 filters+='['+prior+']'+cameraFilter(c.camera,W,H,startFrame)+'scale=out_color_matrix=bt709,format=yuv420p,setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709[out]';
 const temp=partial(file);args.push('-filter_complex_threads','1','-filter_complex',filters,'-map','[out]','-an','-frames:v',String(frames),'-c:v','libx264','-threads','2','-preset','veryfast','-crf',String(profile.crf),'-movflags','+faststart',temp);await run(tool('ffmpeg'),args);ownedMove(temp,file);
}
export async function assembleHybridClips(clips,p,out,profile){
 // Each outgoing cut contains the next transition's handle. Incoming starts at its authored scene time.
 const segments=[];
 for(let i=0;i<clips.length;i++){
  const s=p.scenes[i],D=s.end-s.start,T=Math.round((s.transition_in?.duration||0)*30);
  if(!T||!i){const f=path.join(out,'segment-'+i+'-body.mp4');await run(tool('ffmpeg'),['-y','-v','error','-i',clips[i].path,'-vf','trim=end_frame='+D+',setpts=PTS-STARTPTS','-an','-c:v','libx264','-threads','2','-preset','veryfast','-crf',String(profile.crf),f]);segments.push(f);continue;}
  const prev=p.scenes[i-1],prevD=(prev.end-prev.start)/30,map={'wipe-x':'wipeleft','wipe-y':'wipeup',iris:'circleopen'},kind=map[s.transition_in.kind]||s.transition_in.kind;
  const tr=path.join(out,'segment-'+i+'-transition.mp4');
  const filter='[0:v]trim=start='+prevD+':duration='+T/30+',setpts=PTS-STARTPTS,format=yuv420p[a];[1:v]trim=end_frame='+T+',setpts=PTS-STARTPTS,format=yuv420p[b];[a][b]xfade=transition='+kind+':duration='+T/30+':offset=0,trim=end_frame='+T+',format=yuv420p[v]';
  await run(tool('ffmpeg'),['-y','-v','error','-i',clips[i-1].path,'-i',clips[i].path,'-filter_complex_threads','1','-filter_complex',filter,'-map','[v]','-an','-frames:v',String(T),'-c:v','libx264','-threads','2','-preset','veryfast','-crf',String(profile.crf),tr]);segments.push(tr);
  if(D>T){const body=path.join(out,'segment-'+i+'-body.mp4');await run(tool('ffmpeg'),['-y','-v','error','-i',clips[i].path,'-vf','trim=start_frame='+T+':end_frame='+D+',setpts=PTS-STARTPTS','-an','-c:v','libx264','-threads','2','-preset','veryfast','-crf',String(profile.crf),body]);segments.push(body);}
 }
 const list=path.join(out,'concat.txt');write(list,segments.map(f=>"file '"+f.replaceAll('\\','/').replaceAll("'","'\\''")+"'").join('\n'));
 // Independently encoded cuts can carry different H.264 parameter sets. Stream
 // copy decodes in FFmpeg but can stop native browser playback at a cut. Encode
 // one continuous delivery stream, preserving the authored frame count/timebase.
 const picture=path.join(out,'picture.mp4');await run(tool('ffmpeg'),['-nostdin','-y','-v','error','-f','concat','-safe','0','-i',list,'-an','-c:v','libx264','-threads','2','-preset','fast','-crf',String(profile.crf),'-pix_fmt','yuv420p','-r','30','-fps_mode','cfr','-frames:v',String(p.output.total_frames),'-video_track_timescale','15360','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',picture]);return picture;
}
export async function hybridSnapshot(p,file,{time=2,portrait=false,width=1920,height=1080}={}){
 await verifyMedia(p);
 const frame=Math.max(0,Math.min(p.output.total_frames-1,Math.floor(time*30+1e-5))),index=p.scenes.findIndex(s=>frame>=s.start&&frame<s.end),s=p.scenes[index],local=frame-s.start;
 const profile={width,height,portrait,crf:0,fps:30,gpu:false,jobs:1},folder=file+'.tracks';mkdir(folder);
 const b=await browser();
 async function one(scene,at,name){
  const c=portrait?(scene.portrait_composition||scene.composition):scene.composition,tracks=[];
  if(!['hybrid-composite','vector-composite'].includes(scene.renderer||p.renderer))throw Error('Styleframe for this scene: use its native renderer project');
  let group=[];
  async function flush(){if(!group.length)return;const f=path.join(folder,name+'-'+tracks.length+'.mkv');await alphaTrack(p,scene,group,1,f,b,profile,Infinity,at);tracks.push(f);group=[];}
  for(const l of c.layers){if(l.kind!=='video'){group.push(l);continue;}await flush();const f=path.join(folder,name+'-'+tracks.length+'.mkv');await videoTrack(p,scene,l,1,f,b,profile,at);tracks.push(f);}
  await flush();const f=path.join(folder,name+'.mp4');await composite(tracks,scene,1,f,profile,at);return f;
 }
 try{
  const current=await one(s,local,'current'),T=Math.round((s.transition_in?.duration||0)*30);
  if(index>0&&local<T){
   const prev=p.scenes[index-1],prior=await one(prev,prev.end-prev.start+local,'previous'),map={'wipe-x':'wipeleft','wipe-y':'wipeup',iris:'circleopen'};
   const filter='[0:v]settb=1/15360,setpts=N/(30*TB)[a];[1:v]settb=1/15360,setpts=N/(30*TB)[b];[a][b]xfade=transition='+(map[s.transition_in.kind]||s.transition_in.kind)+':duration='+T/30+':offset=0,select=eq(n\\,'+local+')[v]';
   await run(tool('ffmpeg'),['-y','-v','error','-stream_loop','-1','-i',prior,'-stream_loop','-1','-i',current,'-filter_complex_threads','1','-filter_complex',filter,'-map','[v]','-frames:v','1',file]);
  }else await run(tool('ffmpeg'),['-y','-v','error','-i',current,'-frames:v','1',file]);
  return file;
 }finally{await b.close();}
}
export async function renderHybrid(p,base,options,legacyRender,audio,probe){
 await verifyMedia(p);const {draft=false,portrait=false,limitScenes=Infinity,stopAfterFrames=Infinity}=options;
 const profile={width:draft?(portrait?720:1280):(portrait?1080:1920),height:draft?(portrait?1280:720):(portrait?1920:1080),portrait,crf:draft?24:18,fps:30,gpu:false,jobs:1};
 const runtime=hybridRuntimeHash(),out=path.join(base,'runs',approvalHash(p).slice(0,16),(portrait?'portrait':'landscape')+(draft?'-draft':''),runtime),cache=path.join(base,'hybrid-cache');mkdir(out);mkdir(cache);
 const priorState=path.join(out,'render-state.json'),priorFinal=path.join(out,'final.mp4');
 if(fs.existsSync(priorState)&&fs.existsSync(priorFinal)){
  const prior=read(priorState),names=['music','sfx','ambience','voice','mix'];
  if(prior.state==='final_rendered'&&prior.sha256===await fileHash(priorFinal)&&prior.deliverables&& (await Promise.all(names.map(async n=>{try{return prior.deliverables[n]===await fileHash(path.join(out,n+'.wav'));}catch{return false;}}))).every(Boolean))return {out,final:priorFinal,log:prior,reusedRun:true};
 }
 const log={project:p.project_id,profile,runtime,started:new Date().toISOString(),state:'rendering',clips:[],tracks:[],totalFrames:0},state=path.join(out,'render-state.json');write(state,log);
 let done=0,b;try{b=await browser();
 for(const [i,s]of p.scenes.slice(0,limitScenes).entries()){
  if(hybridRuntimeHash()!==runtime)throw Error('Runtime changed during render; resume with new version');
  const frames=s.end-s.start+Math.round((p.scenes[i+1]?.transition_in?.duration||0)*30),c=portrait?(s.portrait_composition||s.composition):s.composition;
  const renderer=s.renderer||p.renderer;let clip,key;
  if(!['hybrid-composite','vector-composite'].includes(renderer)){
   const q=structuredClone(p);Object.defineProperty(q,'__projectDir',{value:p.__projectDir});q.schema_version='3.0.0';q.renderer=renderer;if(renderer==='spatial-three')q.spatial={...q.spatial,clock_origin:(p.spatial.clock_origin||0)+s.start/30,clock_duration:p.spatial.clock_duration||p.output.total_frames/30};q.scenes=[{...s,renderer:undefined,rasterizer:undefined,start:0,end:frames,transition_in:undefined}];q.profile.rasterizer=s.rasterizer||p.profile.rasterizer;q.output.total_frames=frames;q.content_units=q.content_units.filter(c=>s.content_ids.includes(c.content_id));q.required_content_ids=s.content_ids;q.assets=q.assets.filter(a=>a.kind!=='video');q.audio={bpm:80,motif:[60],sections:[{start:0,end:frames/30,energy:0}]};delete q.approval;q.approval={...p.approval,hash:approvalHash(q),derived_from:approvalHash(p)};
   const r=await legacyRender(q,path.join(cache,'legacy'),{draft,portrait,stopAfterFrames:stopAfterFrames-done});clip=r.final;key=hash({clip,sha:await fileHash(clip)});log.clips.push({scene:s.id,path:clip,key,reused:r.reusedRun||false});done+=s.end-s.start;log.totalFrames=done;write(state,log);continue;
  }
  const groups=[];for(const l of c.layers){if(l.kind==='video')groups.push({kind:'video',layer:l});else if(groups.at(-1)?.kind==='graphics')groups.at(-1).layers.push(l);else groups.push({kind:'graphics',layers:[l]});}
  const tracks=[];for(const g of groups){
   const a=g.kind==='video'?p.assets.find(a=>a.asset_id===g.layer.asset_id):null;
   const k=g.kind==='video'?mediaLayerKey(a,g.layer,frames,profile,{width:c.width||1920,height:c.height||1080}):graphicsKey(p,s,g.layers,frames,profile),f=path.join(cache,k+'.mkv'),reused=await cached(f,k);
   if(!reused){if(done>=stopAfterFrames)throw Error('Test interruption requested');if(g.kind==='video')await videoTrack(p,s,g.layer,frames,f,b,profile);else await alphaTrack(p,s,g.layers,frames,f,b,profile,stopAfterFrames-done);await receipt(f,k,{kind:g.kind,frames});}
   tracks.push(f);log.tracks.push({scene:s.id,kind:g.kind,key:k,reused});
  }
  key=hash({runtime,tracks:tracks.map(f=>path.basename(f)),composition:{...c,layers:undefined},frames,profile});clip=path.join(cache,key+'.mp4');const reused=await cached(clip,key);
  if(!reused){await composite(tracks,s,frames,clip,profile);await receipt(clip,key,{frames});}
  log.clips.push({scene:s.id,path:clip,key,reused,frames});done+=s.end-s.start;log.totalFrames=done;write(state,log);console.log(JSON.stringify({hybrid:s.id,frames:done,total:p.output.total_frames,tracks:groups.length,reused}));
 }
 if(limitScenes<p.scenes.length){log.state='representative_ready';write(state,log);return {out,log};}
 if(hybridRuntimeHash()!==runtime)throw Error('Runtime changed before assembly');
 const assemblyKey=hash({version:runtime,clips:log.clips.map(c=>c.key),transitions:p.scenes.map(s=>({start:s.start,end:s.end,transition:s.transition_in})),profile}),picture=path.join(cache,'assembly-'+assemblyKey+'.mp4');
 const reusedAssembly=await cached(picture,assemblyKey);if(!reusedAssembly){const made=await assembleHybridClips(log.clips,p,out,profile);ownedCopy(made,picture);await receipt(picture,assemblyKey);}log.assembly={key:assemblyKey,reused:reusedAssembly};
 const sourceClips=sourceAudioClips(p,{portrait}),audioIds=new Set([...(p.audio.clips||[]),...sourceClips].map(c=>c.asset_id));
 const audioKey=hash({engine:['lib/audio.mjs','lib/audio31.mjs','lib/pcm-duck.mjs','lib/audio-edit.mjs','lib/ending31.mjs','lib/automotive-audio.mjs','lib/io.mjs','lib/storage.mjs'].map(f=>hash(fs.readFileSync(path.join(ROOT,f)))),seed:p.seed,audio:p.audio,duration:p.output.total_frames,clips:sourceClips,assets:p.assets.filter(a=>audioIds.has(a.asset_id)),driving:p.scenes.filter(s=>s.driving).map(s=>({start:s.start,end:s.end,driving:s.driving}))});
 const audioFolder=path.join(cache,'audio-'+audioKey);let sound,reusedAudio=false;
 try{sound=read(path.join(audioFolder,'audio-report.json'));reusedAudio=(await Promise.all(['music','sfx','ambience','voice','mix'].map(async name=>{const stem=sound.stems?.[name];return !!stem&&stem.file===path.join(audioFolder,name+'.wav')&&await fileHash(stem.file)===stem.sha256;}))).every(Boolean);}catch{}
 if(!reusedAudio)sound=await audio(p,audioFolder,{portrait});
 for(const name of ['music','sfx','ambience','voice','mix'])if(!fs.existsSync(path.join(audioFolder,name+'.wav')))throw Error('Required audio stem missing: '+name);
 for(const name of ['music.wav','sfx.wav','ambience.wav','voice.wav','mix.wav','score.json','audio-report.json','edit-decision-list.json'])if(fs.existsSync(path.join(audioFolder,name)))ownedCopy(path.join(audioFolder,name),path.join(out,name),{kind:'final'});
 log.audio={key:audioKey,reused:reusedAudio};const final=path.join(out,'final.mp4');
 await run(tool('ffmpeg'),['-y','-v','error','-i',picture,'-i',sound.files[2],'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t',String(p.output.total_frames/30),'-movflags','+faststart',final]);
 if(hybridRuntimeHash()!==runtime)throw Error('Runtime changed before finalization');
 log.deliverables=Object.fromEntries(await Promise.all(['music','sfx','ambience','voice','mix'].map(async n=>[n,await fileHash(path.join(out,n+'.wav'))])));log.state='final_rendered';log.finished=new Date().toISOString();log.sha256=await fileHash(final);log.media=await probe(final);log.review={visual:'pending',listening:'pending',notebookHardware:'not_measured'};write(state,log);write(path.join(out,'project.json'),p);
 write(path.join(out,'player.html'),'<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>'+escape(p.title)+'</title><style>body{margin:0;background:#080d12;color:white;font:16px system-ui}video{width:100%;max-height:90vh}p{padding:1rem}</style><video controls playsinline preload="metadata" src="final.mp4"></video><p>'+escape(p.title)+' · 편집 가능한 프로젝트는 project.json</p></html>');
 return {out,final,log};
 }catch(e){log.state='interrupted';log.error=e.message;write(state,log);throw e;}finally{await b?.close();}
}
