import fs from 'node:fs';
import path from 'node:path';
import {html} from './scene.mjs';
import {browser,pageFor} from './browser.mjs';
import {validate} from './contract.mjs';
import {probe,snapshot} from './render.mjs';
import {write,hash,mkdir} from './io.mjs';
export async function audit(p,out,{movie=null,portrait=false}={}){
 mkdir(out);const file=path.join(out,'audit-stage.html');write(file,html(p,{portrait,controls:false}));const b=await browser(p),w=portrait?1080:1920,h=portrait?1920:1080;
 const {page,context,errors,denied}=await pageFor(b,file,w,h);const rows=[],times=p.scenes.flatMap(s=>[(s.start+45)/30,(s.start+s.end)/60,(s.end-22)/30]);
 try{for(const t of times){await page.evaluate(t=>window.__seek(t),t);const a=hash(await page.locator('#stage').screenshot({type:'png'}));await page.evaluate(()=>window.__seek(.033));await page.evaluate(t=>window.__seek(t),t);const z=hash(await page.locator('#stage').screenshot({type:'png'}));
  const metrics=await page.evaluate(()=>{const svg=document.querySelector('#stage'),root=svg.getBoundingClientRect();let failures=[];for(const n of svg.querySelectorAll('text[data-copy]')){const r=n.getBoundingClientRect();if(r.left<0||r.top<0||r.right>root.right+.5||r.bottom>root.bottom+.5)failures.push({text:n.textContent,bounds:[r.x,r.y,r.width,r.height]});}const banned=[...svg.querySelectorAll(window.PROJECT.visual_policy==='licensed_media'?'feImage,foreignObject':'image,feImage,foreignObject')].map(n=>n.tagName);const images=[...svg.querySelectorAll('image')].map(n=>({asset:n.dataset.asset,embedded:/^data:image\/(png|jpeg|webp);base64,/.test(n.getAttribute('href')||'')}));const external=[...svg.querySelectorAll('[href],[xlink\\:href]')].filter(n=>{let v=n.getAttribute('href')||n.getAttribute('xlink:href');return v&&!v.startsWith('#')&&!(window.PROJECT.visual_policy==='licensed_media'&&n.tagName==='image'&&/^data:image\/(png|jpeg|webp);base64,/.test(v)&&window.PROJECT.assets.some(a=>a.asset_id===n.dataset.asset));}).map(n=>n.outerHTML);return {failures,banned,external,images,nodes:svg.querySelectorAll('*').length,filters:svg.querySelectorAll('filter').length,fontLoaded:document.fonts.check('48px Pretendard'),state:window.__state};});
  rows.push({time:t,deterministic:a===z,...metrics});
 }
 let media=null,mediaOk=true;
 if(movie){media=await probe(movie);const v=media.streams.find(s=>s.codec_type==='video'),a=media.streams.find(s=>s.codec_type==='audio');mediaOk=!!a&&v?.r_frame_rate==='30/1'&&Math.abs(+media.format.duration-p.output.total_frames/30)<.1;const sizeExpected=v.width===w&&v.height===h;mediaOk&&=sizeExpected;}
 const nativeFrames=[];if(p.profile.rasterizer==='skia'){for(const t of [times[0],times[Math.floor(times.length/2)],times.at(-1),times[0]]){const target=path.join(out,'skia-'+nativeFrames.length+'.png');await snapshot(p,target,{time:t,portrait,width:w,height:h});nativeFrames.push({time:t,sha256:hash(fs.readFileSync(target))});}}
 const nativeOk=!nativeFrames.length||nativeFrames[0].sha256===nativeFrames.at(-1).sha256;
 const result={contract:validate(p),browserErrors:errors,deniedNetwork:denied,frames:rows,nativeFrames,nativeOk,media,mediaOk,ok:validate(p).ok&&mediaOk&&nativeOk&&!errors.length&&!denied.length&&rows.every(r=>r.deterministic&&!r.failures.length&&!r.banned.length&&!r.external.length&&r.fontLoaded),review:{visualComparison:'pending',fullPlayback:'pending',audioListening:'pending',physicalNotebook:'not_measured'}};
 write(path.join(out,'audit.json'),result);return result;
 }finally{await context.close();await b.close();}
}
