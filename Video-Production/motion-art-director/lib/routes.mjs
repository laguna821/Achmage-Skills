import fs from 'node:fs';
import path from 'node:path';
import {render,snapshot,probe,runtimeHash} from './render.mjs';
import {html} from './scene.mjs';
import {requireValid,approvalHash} from './contract.mjs';
import {ROOT,read,write,mkdir,escape,hash,run,tool,settings} from './io.mjs';
function srt(p){const fmt=f=>{let ms=Math.round(f/30*1000),h=Math.floor(ms/3600000),m=Math.floor(ms/60000)%60,s=Math.floor(ms/1000)%60;return [h,m,s].map(n=>String(n).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0');};return p.scenes.map((s,i)=>(i+1)+'\n'+fmt(s.start)+' --> '+fmt(s.end)+'\n'+s.content_ids.map(id=>p.content_units.find(c=>c.content_id===id).display_text).join('\n')+'\n').join('\n');}
export async function deck(p,out){const cfg=settings().presentation;if(!cfg)throw new Error('presentationPolicy 승인 엔진 adapter 설정 필요: 자동으로 다른 엔진을 사용하지 않음');
 const current=hash(fs.readFileSync(cfg.renderer));if(current!==cfg.rendererSha256)throw new Error('승인 발표 엔진 hash 변경됨');
 const spec={schemaVersion:1,title:p.title,audience:p.audience||'일반 독자',purpose:p.direction,theme:'light',aspect:'16x9',slides:p.scenes.map((s,i)=>({id:s.id,kind:i===0?'cover':i===p.scenes.length-1?'closing':'statement',eyebrow:p.label,title:p.content_units.find(c=>c.content_id===s.content_ids[0]).display_text,body:s.note||p.direction,source:p.footer||'자체 작성 예시',...(s.deck||{})}))};
 if(p.brand)spec.brand=p.brand;
 const input=path.join(out,'deck.json');write(input,spec);
 const helper=path.join(cfg.bundle,'scripts/presentation.py');
 const check=await run(cfg.python,['-B',helper,'doctor','--converter',cfg.converter]);const info=JSON.parse(check.out);
 if(info.engineSha256!==cfg.engineSha256)throw new Error('발표 bundle과 승인 엔진 불일치');
 const outputs=[];for(const theme of ['light','dark']){const target=path.join(out,'deck-'+theme+'.html');await run(cfg.python,['-B',helper,'render',input,'--output',target,'--theme',theme]);outputs.push(target);}
 const pdf=path.join(out,'deck.pdf');await run(cfg.python,['-B',helper,'export-pdf',outputs[0],'--output',pdf,'--converter',cfg.converter]);outputs.push(pdf);
 write(path.join(out,'presentation-pin.json'),{renderer:cfg.renderer,rendererSha256:current,engineSha256:cfg.engineSha256,source:cfg.policyPath,review:'browser-and-PDF-review-required',commonEngineModified:false});
 return outputs;
}
export async function exports(p,base,routes=p.routes){
 base=path.resolve(base);requireValid(p,true);const movieRoutes=['video-editing','promo','shorts','newsletter','infographic'];
 const landscape=routes.some(r=>movieRoutes.includes(r))?await render(p,base):null;
 const out=path.join(base,'exports',approvalHash(p).slice(0,16),runtimeHash());mkdir(out);const manifest={project:p.project_id,approval:p.approval,routes:{},review:'pending'};
 for(const route of routes){if(!p.routes.includes(route))throw new Error('연출안에 없는 출력 루트 '+route);const d=path.join(out,route);mkdir(d);const files=[];
  const copy=(src,name)=>{const target=path.join(d,name);fs.copyFileSync(src,target);files.push(target);return target;};
  write(path.join(d,'project.json'),p);files.push(path.join(d,'project.json'));
  if(['video-editing','promo','infographic'].includes(route))copy(landscape.final,'video.mp4');
  if(route==='video-editing'){write(path.join(d,'captions.srt'),srt(p));files.push(path.join(d,'captions.srt'));copy(path.join(landscape.out,'music.wav'),'music.wav');copy(path.join(landscape.out,'sfx.wav'),'sfx.wav');copy(path.join(landscape.out,'score.json'),'score.json');copy(path.join(landscape.out,'player.html'),'editable-scene.html');copy(path.join(landscape.out,'mix.wav'),'mix.wav');}
  if(route==='promo'){files.push(await snapshot(p,path.join(d,'poster.png')));}
  if(route==='shorts'){const v=await render(p,base,{portrait:true});copy(v.final,'shorts.mp4');files.push(await snapshot(p,path.join(d,'cover.png'),{portrait:true,width:1080,height:1920}));write(path.join(d,'captions.srt'),srt(p));files.push(path.join(d,'captions.srt'));}
  if(route==='newsletter'){const gif=path.join(d,'motion-once.gif');await run(tool('ffmpeg'),['-y','-v','error','-ss','1','-i',landscape.final,'-t','4','-vf','fps=10,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer','-loop','-1',gif]);files.push(gif);files.push(await snapshot(p,path.join(d,'fallback.png')));const fragment='<table role="presentation" width="100%" style="max-width:640px"><tr><td><h2>'+escape(p.title)+'</h2><a href="{{web_url}}"><img src="{{asset_base}}/motion-once.gif" width="640" alt="'+escape(p.title)+'" style="max-width:100%;height:auto"></a></td></tr><tr><td><p>'+escape(p.content_units[0].display_text)+'</p><p><a href="{{asset_base}}/fallback.png">정적 이미지 보기</a> · <a href="{{web_url}}">영상과 전체 내용 보기</a></p></td></tr></table>';write(path.join(d,'email-fragment.html'),fragment);write(path.join(d,'preview.html'),fragment.replaceAll('{{asset_base}}','.').replaceAll('{{web_url}}','../infographic/interactive.html'));files.push(path.join(d,'email-fragment.html'),path.join(d,'preview.html'));}
  if(route==='infographic'){files.push(await snapshot(p,path.join(d,'infographic.svg'),{type:'svg'}));files.push(await snapshot(p,path.join(d,'infographic.png')));write(path.join(d,'interactive.html'),html(p));files.push(path.join(d,'interactive.html'));copy(path.join(landscape.out,'mix.wav'),'mix.wav');}
  if(route==='thumbnail'){for(const [i,t] of [2,p.scenes[Math.min(1,p.scenes.length-1)].start/30+2].entries()){files.push(await snapshot(p,path.join(d,'candidate-'+(i+1)+'.png'),{time:t}));files.push(await snapshot(p,path.join(d,'candidate-'+(i+1)+'.jpg'),{time:t,type:'jpeg'}));files.push(await snapshot(p,path.join(d,'candidate-'+(i+1)+'.svg'),{time:t,type:'svg'}));}}
  if(route==='deck-and-site'){files.push(...await deck(p,d));write(path.join(d,'site.html'),html(p));files.push(path.join(d,'site.html'));if(landscape)copy(path.join(landscape.out,'mix.wav'),'mix.wav');else{const {audio}=await import('./audio.mjs');await audio(p,d);files.push(path.join(d,'mix.wav'));}write(path.join(d,'production.json'),{roles:['message-fit','claim-evidence','brand-and-pattern','design-criticism','interaction-accessibility','render-audit'],reader:p.audience,genre:'개념 소개',beats:p.scenes.map(s=>s.content_ids),claimEvidence:'자체 작성/제공 발췌 구분, 사건 제안과 실제 구분',pattern:'approved native cover/statement/closing',visualReview:'pending',corpusCodeReused:false,motion:'responsive SVG site; common deck engine preserved'});}
  manifest.routes[route]=files.map(f=>({path:f,sha256:hash(fs.readFileSync(f)),bytes:fs.statSync(f).size}));write(path.join(out,'manifest.json'),manifest);
 }
 return {out,manifest};
}
