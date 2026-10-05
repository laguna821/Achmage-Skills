import {escape,write} from './io.mjs';
import {requireValid,approvalHash} from './contract.mjs';
const e=x=>escape(x??'');
const list=items=>'<ul>'+items.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>';
function scenePlan(p,s){
 const v=s.visual_plan,units=s.content_ids.map(id=>p.content_units.find(c=>c.content_id===id));
 let out='<section><p class="eyebrow">'+e(s.id)+' · '+s.start/p.output.fps+'–'+s.end/p.output.fps+'초</p><h2>'+e(v?.viewer_takeaway||'대상 중심 연출안 미작성')+'</h2><h3>전달할 내용</h3>'+list(units.map(c=>c.display_text));
 if(!v)return out+'<p class="warning">이 장면은 이전 기술 예제입니다. mode='+e(s.mode)+'만으로 실제로 무엇을 그려 보여줄지 판단할 수 없습니다. 대상·식별 특징·정보·행동·장면 연결을 작성하고 스타일프레임과 대조해야 합니다.</p></section>';
 out+='<h3>그릴 대상과 식별 특징</h3>';
 for(const o of v.objects){out+='<article><h4>'+e(o.depicts)+' <small>'+e(o.id)+' / '+e(o.kind)+'</small></h4>'+list(o.features)+'<p class="binding">실제 레이어: '+o.bindings.map(e).join(', ')+'</p>';
  if(o.information?.length)out+='<div class="scroll"><table><tr><th>표시할 정보</th><th>값</th><th>근거</th><th>레이어</th></tr>'+o.information.map(f=>'<tr><td>'+e(f.name)+'</td><td>'+e(f.value)+'</td><td>'+e(f.basis)+'</td><td>'+e(f.layer_id)+'</td></tr>').join('')+'</table></div>';
  out+='</article>';
 }
 out+='<h3>내용과 그림의 대응</h3>'+list(v.content_links.map(c=>c.content_id+' → '+c.shown_by.join(', ')+' : '+c.reason));
 out+='<h3>실제 화면에서 일어날 일</h3><ol>'+v.beats.map(b=>'<li><strong>'+e(b.window.join('–'))+'초 · '+e(b.action)+'</strong><p>'+e(b.before)+' → '+e(b.after)+'</p><small>대상: '+e(b.object_ids.join(', '))+'</small></li>').join('')+'</ol><h3>다음 화면까지 유지할 관계</h3>'+list(v.continuity);
 const cues=(p.audio.cues||[]).filter(c=>c.time>=s.start/p.output.fps&&c.time<s.end/p.output.fps);
 out+='<h3>장면 소리</h3>'+list(cues.map(c=>c.kind+' @ '+c.time+'초'))+'<p class="warning">검토: 대상이 식별되는가 · 정보가 일치하는가 · 행동과 원인이 보이는가 · 다음 장면까지 대상이 이어지는가. 레이어 대응 통과는 이 판단을 대신하지 않습니다.</p></section>';
 return out;
}
export function plan(p,file){
 const validation=requireValid(p),h=approvalHash(p);
 const markup='<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+e(p.title)+' · 연출안</title><style>body{font:17px system-ui;line-height:1.7;max-width:1120px;margin:30px auto;padding:24px;color:#193b40;background:#f2eee5}h1{font-size:40px;line-height:1.25}h2{font-size:27px}h3{margin-top:28px}h4{font-size:20px;margin:8px 0}section{background:#fffdf7;padding:30px;margin:28px 0;border-top:4px solid #32686b}article{border-top:1px solid #c9d4ce;padding:18px 0}.eyebrow,.binding,small{color:#567272;font-size:14px}table{border-collapse:collapse;width:100%}td,th{padding:12px;border-bottom:1px solid #c9d4ce;text-align:left;vertical-align:top}code{overflow-wrap:anywhere}.scroll{overflow:auto}.warning{border-left:3px solid #947348;padding:12px 18px;background:#f4eddf}li{margin:10px 0}li p{margin:4px 0}@media(max-width:600px){body{padding:16px}section{padding:18px}h1{font-size:30px}}</style><h1>'+e(p.title)+'</h1><p>'+e(p.direction)+'</p><p>출력: '+p.routes.map(e).join(', ')+' · 1080p30 · GPU 비활성화 · 동시 렌더 1개</p><p>기획 계약: '+e(p.direction_contract||'legacy: 대상 명세 미강제')+' · '+e(p.profile.rasterizer||'chromium')+'</p>'+ (validation.warnings.length?'<aside class="warning">'+list(validation.warnings)+'</aside>':'')+p.scenes.map(s=>scenePlan(p,s)).join('')+'<h2>음악 계획</h2><p>'+e(p.audio.description)+'</p><p>'+p.audio.bpm+' BPM · 동기 '+e(p.audio.motif.join(', '))+'</p><h2>출처와 생략</h2>'+list((p.sources||[]).map(s=>s.title+' ('+s.retrieval_state+')'))+list((p.omissions||[]).map(o=>o.content_id+': '+o.reason))+'<p>연출안 hash: <code>'+h+'</code></p><p>확인 기록: '+e(p.approval?.note||'사용자 확인 대기')+'</p><p>명시적으로 요청한 구현 시험의 제작 권한과 작품의 미감 승인은 별도로 기록합니다.</p></html>';
 write(file,markup);return {file,hash:h,direction:validation.direction};
}
