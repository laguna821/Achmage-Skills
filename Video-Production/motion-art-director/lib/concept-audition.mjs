import fs from 'node:fs';
import path from 'node:path';
import {ROOT,read,write,hash,run,tool,escape as esc,serial} from './io.mjs';
import {sourceCandidateAudit} from './source-discovery.mjs';
import {messageTrackAudit} from './message-track.mjs';

export function loudnormMeasurement(log){const block=log.match(/\{\s*"input_i"[\s\S]*?\}/)?.[0];if(!block)throw Error('Loudness measurement missing');return JSON.parse(block);}
function wrap(s,n=24){const words=s.split(' '),rows=[];let row='';for(const w of words){if(Array.from(row+' '+w).length>n&&row){rows.push(row);row=w;}else row+=(row?' ':'')+w;}if(row)rows.push(row);return rows.join('\n');}

export function conceptAudit(p){
 const errors=[],pending=[];
 if(p?.version!=='concept-audition-v1')errors.push('concept-audition-v1 required');
 if(typeof p?.title!=='string'||!p.title.trim()||typeof p?.logline!=='string'||!p.logline.trim())errors.push('title/logline required');
 if(!Number.isFinite(p?.duration)||p.duration<=0||p.duration>600)errors.push('film duration must be 0..600 seconds');
 const sections=Array.isArray(p?.sections)?p.sections:[];
 if(sections.length<3||sections.length>16)errors.push('3..16 story sections required');
 let cursor=0;
 for(const s of sections){
  if(s.start!==cursor||!Number.isFinite(s.end)||s.end<=s.start)errors.push('story timeline must be continuous');cursor=s.end;
  for(const k of ['title','action','message','sound','bridge','image'])if(typeof s[k]!=='string'||!s[k].trim())errors.push('section '+k+' required');
  if(!s.source_url||!s.license_url||s.use_verified!==true)errors.push('story still needs source and permitted-use evidence');
  for(const key of ['source_url','license_url'])try{if(!['https:','http:'].includes(new URL(s[key]).protocol))throw 0;}catch{errors.push('story '+key+' requires HTTP URL');}
 }
 if(cursor!==p?.duration)errors.push('timeline must cover entire planned film');
 const music=Array.isArray(p?.music)?p.music:[];
 if(music.length<2||music.length>3)errors.push('2..3 music candidates required');
 for(const c of music){
  const r=sourceCandidateAudit(c);errors.push(...r.errors.map(e=>c.id+': '+e));pending.push(...r.pending.map(e=>c.id+': '+e));
  if(!/^[a-f0-9]{64}$/.test(c.sha256||'')||!c.file)errors.push('local music path and hash required');
  if(!Number.isFinite(c.source_in)||c.source_in<0)errors.push('source_in required');
  if(!c.direction||!c.reject_if)errors.push('music direction and rejection criteria required');
 }
 if(!Number.isFinite(p?.preview_seconds)||p.preview_seconds<15||p.preview_seconds>60)errors.push('preview_seconds 15..60');
 const msg=messageTrackAudit(p?.message_track,{duration:p?.duration,cuts:p?.planned_cuts||[]});errors.push(...msg.errors);
 return {ok:!errors.length,errors,pending,message_track:msg,review_state:'unreviewed',scope:'Early concept, not calibrated edit, finished animation or full-film approval.'};
}
function localFile(root,rel){
 if(typeof rel!=='string'||path.isAbsolute(rel)||rel.split(/[\\/]/).includes('..'))throw Error('Asset must be relative inside concept folder');
 const realRoot=fs.realpathSync(root),f=fs.realpathSync(path.resolve(root,rel)),r=path.relative(realRoot,f);
 if(r.startsWith('..')||path.isAbsolute(r))throw Error('Asset escapes concept folder');return f;
}
export function conceptPage(p,movies){
 const data={duration:p.duration,preview_seconds:p.preview_seconds,sections:p.sections.map(({title,start,end,action,message,sound,bridge},i)=>({title,start,end,action,message,sound,bridge,image:'card-'+i+'.jpg'})),messages:p.message_track.units,movies};
 return `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)} · 기획 시청</title><style>
*{box-sizing:border-box}body{margin:0;background:#f0ece3;color:#252820;font-family:system-ui,'Malgun Gothic',sans-serif}main{max-width:1160px;margin:auto;padding:38px 22px 80px}.eyebrow{font-size:12px;letter-spacing:.18em;color:#6b704f}h1{font-size:clamp(38px,7vw,82px);line-height:1.1;letter-spacing:-.06em;margin:20px 0}h2{font-size:26px;margin-top:38px}.lead{max-width:780px;font-size:21px;line-height:1.7}.note{color:#65695d;line-height:1.65;font-size:14px}.choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}button{font:inherit;cursor:pointer;border:1px solid #bec3ae;background:#fffdf6;border-radius:4px;padding:17px;text-align:left;color:inherit}button[aria-pressed=true]{background:#28352b;color:#fff;border-color:#28352b}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #bd6a3a;outline-offset:3px}button small{display:block;margin-top:10px;line-height:1.5}video{display:block;width:100%;aspect-ratio:16/9;background:#161b17;margin-top:20px;border-radius:4px}.control{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:14px 0}.control button{padding:10px 15px}a{color:#365849}.timeline{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{background:#fffdf7;border:1px solid #d5d7cb;padding:0;text-align:left;overflow:hidden}.card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.card div{padding:15px}.card p{line-height:1.5}.stamp{font:12px monospace;color:#696b5e}.sentence{background:#e1e6d5;padding:22px;line-height:1.9;font-size:18px}.decision{padding:22px;border-top:1px solid #b2b7a6;margin-top:36px}.credits{font-size:13px;line-height:1.8}.playhead{width:100%;accent-color:#3d5b41}#active{font-weight:600}.reader{margin-top:14px;padding:17px;background:#fffdf7}#message{font-size:22px;line-height:1.5;margin:8px 0}.tag{display:inline-block;padding:4px 8px;background:#dedacb;margin-right:7px;font-size:12px}@media(max-width:650px){main{padding:25px 16px 60px}.choices{grid-template-columns:1fr}.timeline{grid-template-columns:1fr 1fr;gap:9px}.card div{padding:10px}.lead{font-size:18px}.card p{font-size:14px}h1{font-size:48px}}
</style><main><div class="eyebrow">MOTION ART DIRECTOR · CONCEPT 01</div><h1>${esc(p.title)}</h1><p class="lead">${esc(p.logline)}</p><p class="note">${p.duration}초 본편을 만들기 전, 음악과 이야기의 방향을 고르는 ${p.preview_seconds}초 기획 시청본입니다. 아래 ${p.sections.length}개 구간은 전체 이야기의 지도이며, 실제 컷 길이와 박자 동기화는 음악 선택 뒤 설계합니다.</p><h2>먼저 음악을 바꿔 들어보세요</h2><div class="choices">${p.music.map((c,i)=>`<button class="choice" data-index="${i}" aria-pressed="${i===0}"><b>${String.fromCharCode(65+i)} · ${esc(c.direction)}</b><small>${esc(c.title)}<br>${esc(c.author||'')} · ${esc(c.provider)}</small><small>탈락 기준: ${esc(c.reject_if)}</small></button>`).join('')}</div><video id="player" controls playsinline preload="none" poster="card-0.jpg" src="${esc(movies[0])}"></video><div class="control"><button id="start">선택한 음악으로 재생</button><button id="stop">일시정지</button><span id="active" aria-live="polite">A · 준비됨</span></div><p class="note">모든 후보는 같은 구성·같은 목표 음량입니다. ${p.preview_seconds}초에 전체 이야기를 압축했으므로 이 시청본의 장면 체류 시간을 최종 편집 속도로 보지 않습니다. 음악은 실제 곡이며, 합성 효과음과 음성은 넣지 않았습니다.</p>
<h2>빠른 컷 위에서도 문장은 이어집니다</h2><div class="reader"><span class="tag">문장 흐름 시험 · 음악과 독립</span><p id="message"></p><input class="playhead" id="reading" aria-label="본편 문장 시간" type="range" min="0" max="${p.duration-.01}" step=".1" value="20"><p class="note" id="reading-time"></p></div><div class="sentence">${esc(p.message_track.units.map(u=>u.text).join(' '))}</div>
<h2>${p.duration}초 전체 구성</h2><p class="note">카드를 누르면 압축 시청본의 해당 장면으로 이동합니다. 이미지는 제공처의 실제 소재 미리보기이며 최종 채택·동작 검수 전입니다.</p><div class="timeline">${p.sections.map((s,i)=>`<button class="card" data-section="${i}"><img loading="lazy" src="card-${i}.jpg" alt="${esc(s.title)}"><div><span class="stamp">${s.start}–${s.end}초</span><h3>${esc(s.title)}</h3><p>${esc(s.action)}</p><p><b>전달할 문장</b><br>${esc(s.message)}</p><p class="note">소리: ${esc(s.sound)}<br>연결: ${esc(s.bridge)}</p></div></button>`).join('')}</div>
<div class="decision"><h2>고를 것은 세 가지입니다</h2><p>① 이 주제로 갈지 ② A·B·C 중 어떤 음악인지 ③ 문장의 톤이 맞는지.</p><p class="note">답은 채팅으로 남겨 주세요. 이 화면은 선택을 자동 제출하거나 제작 승인을 저장하지 않습니다. 방향이 맞으면 실제 동작 소재 확보 → 음악 구조 교정 → 컷·문장 별도 편집 → 대표 컷 → 본편 순서로 진행합니다.</p></div><details class="credits"><summary>음악·영상 출처와 검토 상태</summary>${p.music.map(c=>`<p>${esc(c.title)} — ${esc(c.author||'')} · <a href="${esc(c.source_url)}">원곡</a> · <a href="${esc(c.license_url)}">이용 조건</a><br>${esc(c.rights.attribution||'')} / 원곡 구간 ${c.source_in}초부터 ${p.preview_seconds}초 / 청취 적합성 미확정</p>`).join('')}${p.sections.map(s=>`<p>${esc(s.title)} · <a href="${esc(s.source_url)}">소재</a> · <a href="${esc(s.license_url)}">이용 조건</a></p>`).join('')}<p>기획 자료만 공개합니다. 원본 음원·영상은 배포 패키지에 포함하지 않습니다.</p></details></main><script>
const D=${serial(data)},v=document.querySelector('#player'),a=document.querySelector('#active');let selected=0,revision=0,loaded=-1,job=null;const blobs=new Map();
// Small concept proxies are downloaded before playback: some static hosts ignore HTTP Range.
async function ready(){const i=selected,rev=revision;if(loaded===i&&v.readyState>0)return true;if(job?.id===i&&job.rev===rev)return job.promise;
 const promise=(async()=>{a.textContent=String.fromCharCode(65+i)+' · 작은 시청본 준비 중';let url=blobs.get(i);if(!url){const response=await fetch(D.movies[i]);if(!response.ok)throw Error('download');if(Number(response.headers.get('content-length'))>33554432)throw Error('preview too large');const blob=await response.blob();if(blob.size>33554432)throw Error('preview too large');url=URL.createObjectURL(blob);if(rev!==revision){URL.revokeObjectURL(url);return false;}blobs.set(i,url);}if(rev!==revision)return false;
 await new Promise((resolve,reject)=>{const clear=()=>{v.removeEventListener('loadedmetadata',ok);v.removeEventListener('error',bad);};const ok=()=>{clear();resolve();};const bad=()=>{clear();reject(Error('decode'));};v.addEventListener('loadedmetadata',ok);v.addEventListener('error',bad);v.src=url;v.load();});if(rev!==revision)return false;loaded=i;a.textContent=String.fromCharCode(65+i)+' · 재생 준비됨';return true;})();job={id:i,rev,promise};return promise;}
document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{v.pause();selected=Number(b.dataset.index);revision++;loaded=-1;job=null;v.removeAttribute('src');v.load();document.querySelectorAll('.choice').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));a.textContent=String.fromCharCode(65+selected)+' · 선택됨, 재생을 눌러 주세요';});
const failed=()=>a.textContent='시청본을 준비하지 못했습니다. 새로고침 후 다시 재생해 주세요';document.querySelector('#start').onclick=async()=>{try{if(await ready())await v.play();}catch{failed();}};document.querySelector('#stop').onclick=()=>v.pause();v.onerror=failed;v.onended=()=>a.textContent='기획 시청 완료 · 청취 평가는 채팅으로 남겨 주세요';
document.querySelectorAll('[data-section]').forEach(b=>b.onclick=async()=>{try{if(await ready()){v.currentTime=Number(b.dataset.section)/D.sections.length*D.preview_seconds;a.textContent='선택한 구간 · 재생 버튼으로 계속';}}catch{failed();}});window.addEventListener('pagehide',()=>blobs.forEach(url=>URL.revokeObjectURL(url)));
const r=document.querySelector('#reading');function reading(){const t=Number(r.value),u=D.messages.find(u=>t>=u.start&&t<u.end),f=u?.phrases.find(f=>t>=f.start&&t<f.end);document.querySelector('#message').textContent=f?.text||'글자 없이 화면에 머무는 구간';document.querySelector('#reading-time').textContent=t.toFixed(1)+'초 · 문장 표시는 컷이 바뀌어도 유지됩니다.';}r.oninput=reading;reading();
</script></html>`;
}
export async function createConceptAudition(file,out){
 const start=Date.now(),root=path.dirname(path.resolve(file)),p=read(file),report=conceptAudit(p);
 if(!report.ok||report.pending.length)throw Error([...report.errors,...report.pending].join('\n'));
 if(fs.existsSync(out))throw Error('Preserve prior audition: use a new output directory');
 // Validate all inputs before creating output or invoking FFmpeg.
 const tracks=p.music.map(c=>{const f=localFile(root,c.file);if(hash(fs.readFileSync(f))!==c.sha256)throw Error('Music hash mismatch '+c.id);return f;});
 const stills=p.sections.map(s=>localFile(root,s.image));
 fs.mkdirSync(out,{recursive:true});fs.copyFileSync(path.join(ROOT,'assets/fonts/PretendardVariable.ttf'),path.join(out,'font.ttf'));
 for(let i=0;i<stills.length;i++){
  const s=p.sections[i],info=JSON.parse((await run(tool('ffprobe'),['-v','error','-show_streams','-of','json',stills[i]])).out).streams[0],portrait=info.height>info.width;
  write(path.join(out,'caption.txt'),wrap(s.message,portrait?12:24));write(path.join(out,'title.txt'),s.title+'  /  '+s.start+'–'+s.end+'초');
  const filter=portrait?'scale=480:540:force_original_aspect_ratio=decrease,pad=960:540:480+(480-iw)/2:(oh-ih)/2:color=0x17251e,drawtext=fontfile=font.ttf:textfile=title.txt:fontcolor=white:fontsize=20:x=35:y=145,drawtext=fontfile=font.ttf:textfile=caption.txt:fontcolor=white:fontsize=36:line_spacing=12:x=35:y=195':'scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2:color=0x17251e,drawbox=x=0:y=340:w=iw:h=200:color=black@0.70:t=fill,drawtext=fontfile=font.ttf:textfile=title.txt:fontcolor=white:fontsize=20:x=35:y=360,drawtext=fontfile=font.ttf:textfile=caption.txt:fontcolor=white:fontsize=36:line_spacing=8:x=35:y=394';
  await run(tool('ffmpeg'),['-v','error','-nostdin','-i',stills[i],'-vf',filter,'-frames:v','1','-q:v','3','card-'+i+'.jpg'],{cwd:out});
 }
 const seconds=p.preview_seconds/p.sections.length;write(path.join(out,'stills.txt'),p.sections.map((s,i)=>"file 'card-"+i+".jpg'\nduration "+seconds).join('\n')+"\nfile 'card-"+(p.sections.length-1)+".jpg'\n");
 const movies=[];const receipts=[];
 for(let i=0;i<tracks.length;i++){
  const c=p.music[i],probe=JSON.parse((await run(tool('ffprobe'),['-v','error','-show_format','-of','json',tracks[i]])).out);
  if(Number(probe.format.duration)<c.source_in+p.preview_seconds)throw Error('Music source too short '+c.id);
  const analyzed=await run(tool('ffmpeg'),['-v','info','-nostdin','-ss',String(c.source_in),'-i',tracks[i],'-t',String(p.preview_seconds),'-af','loudnorm=I=-18:TP=-2:LRA=11:print_format=json','-f','null','-']);
  const measurement=loudnormMeasurement(analyzed.err);
  for(const k of ['input_i','input_tp','input_lra','input_thresh','target_offset'])if(!Number.isFinite(Number(measurement[k])))throw Error('Silent/invalid music '+c.id);
  const norm='loudnorm=I=-18:TP=-2:LRA=11:measured_I='+measurement.input_i+':measured_TP='+measurement.input_tp+':measured_LRA='+measurement.input_lra+':measured_thresh='+measurement.input_thresh+':offset='+measurement.target_offset+':linear=true';
  const name='audition-'+String.fromCharCode(97+i)+'.mp4';
  await run(tool('ffmpeg'),['-v','error','-nostdin','-f','concat','-safe','1','-i','stills.txt','-ss',String(c.source_in),'-i',tracks[i],'-map','0:v:0','-map','1:a:0','-t',String(p.preview_seconds),'-vf','fps=5,format=yuv420p','-af',norm,'-c:v','libx264','-preset','ultrafast','-crf','27','-threads','2','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart',name],{cwd:out});
  movies.push(name);receipts.push({id:c.id,source_sha256:c.sha256,source_in:c.source_in,duration:p.preview_seconds,measurement,output_sha256:hash(fs.readFileSync(path.join(out,name))),bytes:fs.statSync(path.join(out,name)).size});
 }
 write(path.join(out,'index.html'),conceptPage(p,movies));
 const result={ok:true,version:'concept-audition-v1',seconds:(Date.now()-start)/1000,chromium_frames:0,pcm_wav_files:0,film_duration:p.duration,preview_seconds:p.preview_seconds,outputs:receipts,audit:report,concept_hash:hash(p),listening:'pending',full_production:'not-started'};write(path.join(out,'receipt.json'),result);return result;
}
