import fs from 'node:fs';
import path from 'node:path';
import {ROOT,serial,escape,hash} from './io.mjs';
import {imageAssets} from './assets.mjs';
import {curve,integral} from './automotive-audio.mjs';
export function html(p,{portrait=false,inline=true,audio='mix.wav',controls=true}={}){
 const font=fs.readFileSync(path.join(ROOT,'assets/fonts/PretendardVariable.woff2')).toString('base64');
 const bpath=path.join(ROOT,'vendor/awesome-ai-motion/lib/fonts/BodoniModa.ttf');
 const bodoni=fs.existsSync(bpath)?'@font-face{font-family:Bodoni;src:url(data:font/ttf;base64,'+fs.readFileSync(bpath).toString('base64')+')}':'';
 const w=portrait?1080:1920,h=portrait?1920:1080;
 const gsap=fs.readFileSync(path.join(ROOT,'assets/gsap.min.js'),'utf8'),stage=fs.readFileSync(path.join(ROOT,'assets/stage.js'),'utf8');
 const cinema=p.renderer==='cinematic'?'<script>'+fs.readFileSync(path.join(ROOT,'assets/cinema.js'),'utf8')+'</script>':'';
 const composite=p.renderer==='image-composite'?'<script>window.ART_DATA='+serial(imageAssets(p))+';</script><script>'+fs.readFileSync(path.join(ROOT,'assets/composite.js'),'utf8')+'</script>':'';
 const flow=(p.material_flow||p.scenes.some(s=>[...(s.composition?.layers||[]),...(s.portrait_composition?.layers||[])].some(l=>l.motion&&l.motion.preset!=='none')))?'<script>'+fs.readFileSync(path.join(ROOT,'assets/flow.js'),'utf8')+'</script>':'';
 const spatial=p.renderer==='spatial-three'?'<script>window.__driveCurve='+curve.toString()+';window.__driveIntegral='+integral.toString()+';window.ART_DATA='+serial(imageAssets(p))+';window.__threeModule=import('+JSON.stringify('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path.join(ROOT,'vendor/three/three.module.min.js'),'utf8').replaceAll('./three.core.min.js','data:text/javascript;base64,'+fs.readFileSync(path.join(ROOT,'vendor/three/three.core.min.js')).toString('base64'))).toString('base64'))+');</script><script>'+fs.readFileSync(path.join(ROOT,p.spatial?.version==='precision-1'?'assets/spatial-v2.js':'assets/spatial.js'),'utf8')+'</script>':'';
 const vector=['vector-composite','spatial-three'].includes(p.renderer)?'<script>'+fs.readFileSync(path.join(ROOT,'assets/vector.js'),'utf8')+'</script>':'';
 return '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(p.title)+'</title><style>@font-face{font-family:Pretendard;src:url(data:font/woff2;base64,'+font+')}' +bodoni+'*{box-sizing:border-box}body{margin:0;background:#090e17;color:#eef3ef;font-family:Pretendard}#stage{display:block;width:100%;height:auto;max-height:calc(100vh - '+(controls?'64':'0')+'px)}nav{height:64px;display:flex;gap:20px;align-items:center;padding:12px 24px}button{background:#dcebe5;color:#102c27;border:0;border-radius:6px;padding:10px 20px;cursor:pointer}input{flex:1}a{color:#a5d8ca}.scroll{height:500vh}.scroll #stage{position:sticky;top:0}.scroll nav{position:fixed;bottom:0;width:100%;background:#0b1b19}@media print{nav{display:none}}</style><svg id="stage" xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+escape(p.title)+'"></svg>'+(controls?'<nav><button id="play" type="button">재생</button><input id="progress" type="range" min="0" max="1" step=".001" value="0" aria-label="장면 진행률"><a href="?scroll">스크롤 보기</a></nav><audio id="music" preload="none" src="'+escape(audio)+'"></audio>':'')+'<script>'+gsap+'</script><script>window.PROJECT='+serial(p)+';window.PORTRAIT='+portrait+';window.__engineReady=new Promise(r=>window.__resolveEngine=r);</script><script>'+stage+'</script>'+cinema+composite+flow+vector+spatial+'</html>';
}
export function sceneKey(p,s,profile,portrait){
 const {scenes,content_units,approval,status,revision,assets,sources,audio,editorial_plan,production_review,sync_score,rhythm_score,...visual}=p;
 const ids=new Set([...(s.composition?.layers||[]),...(s.portrait_composition?.layers||[])].map(l=>l.asset_id));
 for(const l of s.spatial?.plates||[])ids.add(l.asset_id);
 const prior=s.transition_in?p.scenes[p.scenes.indexOf(s)-1]:undefined;
 if(prior)for(const l of [...(prior.composition?.layers||[]),...(prior.portrait_composition?.layers||[])])if(l.asset_id)ids.add(l.asset_id);
 for(const id of ({crystal:['crystal','crystal-rear'],liquid:['liquid'],smoke:['gas'],star:['plasma']}[s.mode]||[]))ids.add(id);
 const engine=['spatial.js','spatial-v2.js','stage.js','vector.js','composite.js','flow.js','cinema.js','gsap.min.js'].map(f=>hash(fs.readFileSync(path.join(ROOT,'assets',f))));
 engine.push(hash(fs.readFileSync(path.join(ROOT,'scripts/skia_frames.py'))));
 if(p.renderer==='spatial-three')for(const f of ['vendor/three/three.module.min.js','vendor/three/three.core.min.js','lib/spatial.mjs'])engine.push(hash(fs.readFileSync(path.join(ROOT,f))));
 for(const f of ['lib/message-track.mjs','lib/automotive-audio.mjs','lib/render.mjs','lib/browser.mjs','lib/assets.mjs','lib/io.mjs'])engine.push(hash(fs.readFileSync(path.join(ROOT,f))));
 const fonts=['assets/fonts/PretendardVariable.woff2','assets/fonts/PretendardVariable.ttf','vendor/awesome-ai-motion/lib/fonts/BodoniModa.ttf','requirements-skia.txt'].map(f=>hash(fs.readFileSync(path.join(ROOT,f))));
 return hash({engine,fonts,visual,scene:s,transitionSource:prior?{scene:prior,content:p.content_units.filter(c=>prior.content_ids.includes(c.content_id))}:undefined,index:p.scenes.indexOf(s),count:p.scenes.length,content:p.content_units.filter(c=>s.content_ids.includes(c.content_id)),assets:(assets||[]).filter(a=>ids.has(a.asset_id)),profile,portrait});
}
