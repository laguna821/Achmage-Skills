import fs from 'node:fs';
import path from 'node:path';
import {guardedSpawn as spawn,ownedMove,withStorage,ownedReserve,ownedComplete} from './storage.mjs';
import {once} from 'node:events';
import {html,sceneKey} from './scene.mjs';
import {browser,pageFor,CPU_ARGS,SPATIAL_CPU_ARGS} from './browser.mjs';
import {requireValid,approvalHash} from './contract.mjs';
import {audio} from './audio.mjs';
import {imageAssets} from './assets.mjs';
import {ROOT,write,read,hash,mkdir,run,tool,settings} from './io.mjs';
export function runtimeHash(){return hash(['lib/automotive-audio.mjs','assets/spatial-v2.js','lib/precision.mjs','scripts/skia_frames.py','requirements-skia.txt','assets/fonts/PretendardVariable.woff2','assets/fonts/PretendardVariable.ttf','vendor/awesome-ai-motion/lib/fonts/BodoniModa.ttf','assets/spatial.js','vendor/three/three.module.min.js','vendor/three/three.core.min.js','lib/spatial.mjs','lib/audio-edit.mjs','assets/vector.js','assets/stage.js','assets/cinema.js','assets/composite.js','assets/flow.js','lib/assets.mjs','lib/scene.mjs','lib/audio.mjs','lib/render.mjs','lib/routes.mjs','lib/browser.mjs','lib/io.mjs','lib/storage.mjs','lib/contract.mjs'].map(f=>hash(fs.readFileSync(path.join(ROOT,f))))).slice(0,12);}
export async function probe(file){const r=await run(tool('ffprobe'),['-v','error','-show_streams','-show_format','-of','json',file]);return JSON.parse(r.out);}
export async function renderUnlocked(p,base,{draft=false,portrait=false,limitScenes=Infinity,stopAfterFrames=Infinity}={}){
 requireValid(p,true);if(p.schema_version==='3.1.0'&&(p.renderer==='hybrid-composite'||p.scenes.some(s=>s.renderer))){const {renderHybrid}=await import('./hybrid.mjs');return renderHybrid(p,base,{draft,portrait,limitScenes,stopAfterFrames},renderUnlocked,audio,probe);}imageAssets(p);const pinnedRuntime=runtimeHash();const width=draft?(portrait?720:1280):(portrait?1080:1920),height=draft?(portrait?1280:720):(portrait?1920:1080);
 const profile={width,height,fps:30,codec:'libx264',crf:draft?24:18,gpu:false,jobs:1,rasterizer:p.profile.rasterizer||'chromium'};
 const id=approvalHash(p).slice(0,16),out=path.join(base,'runs',id,(portrait?'portrait':'landscape')+(draft?'-draft':''),pinnedRuntime);mkdir(out);
 const stateFile=path.join(out,'render-state.json'),existing=path.join(out,'final.mp4');
 if(fs.existsSync(stateFile)&&fs.existsSync(existing)){const prior=read(stateFile);if(prior.state==='final_rendered'&&prior.sha256===hash(fs.readFileSync(existing))){return {out,final:existing,log:prior,reusedRun:true};}}
 const skia=p.profile.rasterizer==='skia';const sceneFile=path.join(out,'scene.html');write(sceneFile,html(p,{portrait,controls:false}));
 const cache=path.join(base,'cache');mkdir(cache);const log={project:p.project_id,revision:p.revision||0,approval:p.approval,profile,chromiumArgs:skia?[]:p.renderer==='spatial-three'?SPATIAL_CPU_ARGS:CPU_ARGS,started:new Date().toISOString(),clips:[],state:'rendering',totalFrames:0};
 write(path.join(out,'render-state.json'),log);let b=null,page=null,context=null,errors=[],denied=[],total=0;
 try{if(!skia){b=await browser(p);({page,context,errors,denied}=await pageFor(b,sceneFile,width,height));}if(p.renderer==='spatial-three'){log.spatial=await page.evaluate(()=>window.__state);if(!/SwiftShader/i.test(log.spatial.adapter))throw new Error('CPU spatial profile requires verified SwiftShader adapter');}
 for(const s of p.scenes.slice(0,limitScenes)){if(runtimeHash()!==pinnedRuntime)throw new Error('Runtime changed during render; completed cuts preserved, rerun with new runtime');const key=sceneKey(p,s,profile,portrait),clip=path.join(cache,key+'.mp4'),receipt=clip+'.json',start=performance.now();let reused=false;
  if(fs.existsSync(clip)&&fs.existsSync(receipt)){const r=read(receipt);reused=r.key===key&&r.frames===s.end-s.start&&r.sha256===hash(fs.readFileSync(clip));}
  if(!reused&&skia){const partial=clip+'.partial.mp4',projectFile=path.join(out,'skia-project.json');write(projectFile,p);const cfg=settings();const args=['-X','utf8',path.join(ROOT,'scripts/skia_frames.py'),'--project',projectFile,'--width',String(width),'--height',String(height),'--start',String(s.start),'--end',String(s.end),'--out',partial,'--ffmpeg',tool('ffmpeg'),'--crf',String(profile.crf)];if(portrait)args.push('--portrait');if(Number.isFinite(stopAfterFrames))args.push('--stop-after',String(Math.max(0,stopAfterFrames-total)));await run(cfg.python||'python',args,{env:{...process.env,...(cfg.skiaPath?{PYTHONPATH:cfg.skiaPath}:{})}});total+=s.end-s.start;ownedMove(partial,clip);write(receipt,{key,frames:s.end-s.start,sha256:hash(fs.readFileSync(clip)),elapsedSeconds:(performance.now()-start)/1000,renderer:'Skia CPU'});}else if(!reused){const partial=clip+'.partial.mp4',ff=spawn(tool('ffmpeg'),['-y','-loglevel','error','-threads','2','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-threads','2','-preset','veryfast','-crf',String(profile.crf),'-pix_fmt','yuv420p','-movflags','+faststart',partial],{windowsHide:true,stdio:['pipe','ignore','pipe']});
   let err='';ff.stderr.on('data',x=>{err=(err+x).slice(-10000);});let broken=null;ff.stdin.on('error',e=>broken=e);
   const ended=new Promise((resolve,reject)=>{ff.on('error',reject);ff.on('close',code=>code===0?resolve():reject(new Error('FFmpeg '+code+': '+err)));});ended.catch(()=>{});
   try{for(let frame=s.start;frame<s.end;frame++){if(total>=stopAfterFrames)throw new Error('Test interruption requested');await page.evaluate(t=>window.__seek(t),frame/30);const jpg=await page.locator('#stage').screenshot({type:'jpeg',quality:96,animations:'disabled'});if(broken)throw broken;if(!ff.stdin.write(jpg))await once(ff.stdin,'drain');total++;if(total%150===0)console.log(JSON.stringify({scene:s.id,frame,percent:+(100*frame/p.output.total_frames).toFixed(1),rssMiB:Math.round(process.memoryUsage().rss/1048576)}));}
    ff.stdin.end();await ended;ownedMove(partial,clip);write(receipt,{key,frames:s.end-s.start,sha256:hash(fs.readFileSync(clip)),elapsedSeconds:(performance.now()-start)/1000});
   }catch(e){ff.kill();throw e;}
  }
  log.clips.push({scene:s.id,key,path:clip,reused,elapsedSeconds:(performance.now()-start)/1000,frames:s.end-s.start});log.totalFrames+=s.end-s.start;write(path.join(out,'render-state.json'),log);
 }
 if(runtimeHash()!==pinnedRuntime)throw new Error('Runtime changed during render; cannot finalize stale build');
 if(errors.length||denied.length)throw new Error('Browser error/network denied '+JSON.stringify({errors,denied}));
 if(limitScenes<p.scenes.length){log.state='representative_ready';write(path.join(out,'render-state.json'),log);return {out,log};}
 const list=path.join(out,'concat.txt');write(list,log.clips.map(c=>"file '"+c.path.replaceAll('\\','/').replaceAll("'","'\\''")+"'").join('\n'));
 const silent=path.join(out,'picture.mp4');await run(tool('ffmpeg'),['-y','-v','error','-f','concat','-safe','0','-i',list,'-c','copy',silent]);
 const sound=await audio(p,out);const final=path.join(out,'final.mp4');await run(tool('ffmpeg'),['-y','-v','error','-i',silent,'-i',sound.files[2],'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t',String(p.output.total_frames/30),'-movflags','+faststart',final]);
 const media=await probe(final);log.state='final_rendered';log.finished=new Date().toISOString();log.sha256=hash(fs.readFileSync(final));log.media=media;log.review={visual:'pending',listening:'pending',notebookHardware:'not_measured'};write(path.join(out,'render-state.json'),log);
 write(path.join(out,'project.json'),p);write(path.join(out,'player.html'),html(p,{portrait,audio:path.basename(sound.files[2])}));return {out,final,log};
 }catch(e){log.state='interrupted';log.error=e.message;write(path.join(out,'render-state.json'),log);throw e;}finally{await context?.close();await b?.close();}
}
export async function snapshot(p,file,{time=2,portrait=false,type='png',width=1920,height=1080}={}){
 file=path.resolve(file);return withStorage(path.dirname(file),{...settings().storage,duration:1},async()=>{ownedReserve(file,{kind:'final'});const result=await snapshotUnlocked(p,file,{time,portrait,type,width,height});ownedComplete(file);return result;});
}
async function snapshotUnlocked(p,file,{time=2,portrait=false,type='png',width=1920,height=1080}={}){
 mkdir(path.dirname(file));if(p.schema_version==='3.1.0'&&(p.renderer==='hybrid-composite'||p.scenes.some(s=>s.renderer))){if(type==='svg')throw Error('Hybrid snapshot is raster; export authored vector layers separately');requireValid(p);const {hybridSnapshot}=await import('./hybrid.mjs');return hybridSnapshot(p,file,{time,portrait,width,height});}if(p.profile.rasterizer==='skia'&&type==='png'){const cfg=settings(),source=file+'.project.json';write(source,p);await run(cfg.python||'python',['-X','utf8',path.join(ROOT,'scripts/skia_frames.py'),'--project',source,'--frame',String(Math.min(p.output.total_frames-1,Math.floor(time*30))),'--width',String(width),'--height',String(height),'--out',file,...(portrait?['--portrait']:[])],{env:{...process.env,...(cfg.skiaPath?{PYTHONPATH:cfg.skiaPath}:{})}});return file;}const temp=file+'.html';write(temp,html(p,{portrait,controls:false}));const b=await browser(p);const {page,context}=await pageFor(b,temp,width,height);
 try{await page.evaluate(t=>window.__seek(t),time);if(type==='svg'){let svg=await page.locator('#stage').evaluate(n=>n.outerHTML);svg=svg.replace('<svg','<svg').replace(/(<svg[^>]*>)/,'$1<style>@font-face{font-family:Pretendard;src:url(data:font/woff2;base64,'+fs.readFileSync(new URL('../assets/fonts/PretendardVariable.woff2',import.meta.url)).toString('base64')+')}</style>');svg=svg.replace('</style>','@font-face{font-family:Bodoni;src:url(data:font/ttf;base64,'+fs.readFileSync(path.join(ROOT,'vendor/awesome-ai-motion/lib/fonts/BodoniModa.ttf')).toString('base64')+')}</style>');write(file,svg);}else await page.locator('#stage').screenshot({path:file,type:type==='jpeg'?'jpeg':'png'});return file;}finally{await context.close();await b.close();}
}
export async function render(p,base,options={}){
 base=path.resolve(base);
 mkdir(base);const lock=path.join(base,'render.lock');
 if(fs.existsSync(lock)){const prior=read(lock);let alive=true;try{process.kill(prior.pid,0);}catch{alive=false;}if(alive)throw new Error('Another render is active (jobs=1): PID '+prior.pid);fs.unlinkSync(lock);}
 const fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,JSON.stringify({pid:process.pid,started:new Date().toISOString()}));fs.closeSync(fd);
 try{return await withStorage(base,{...settings().storage,duration:p.output.total_frames/30},()=>renderUnlocked(p,base,options));}finally{if(fs.existsSync(lock)&&read(lock).pid===process.pid)fs.unlinkSync(lock);}
}
