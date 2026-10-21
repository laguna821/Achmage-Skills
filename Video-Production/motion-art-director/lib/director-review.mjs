import {hash,escape as esc} from './io.mjs';
const arr=x=>Array.isArray(x)?x:[];
const text=x=>typeof x==='string'&&x.trim().length>0;

// Production intent is already in editorial_plan. Do not create a second shot list.
// Bind critique to the actual composition, media identities and audio, not layout labels.
export function directorFingerprint(p){
 return hash({scenes:p.scenes,editorial:p.editorial_plan,brief:p.director_brief,
  assets:p.assets,audio:p.audio,messages:p.message_track,output:p.output});
}
export function directorReview(p,observations,actualEvidence){
 const errors=[],findings=[],requests=[],fps=p.output?.fps||30,shots=arr(p.editorial_plan?.shots);
 const brief=p.director_brief;
 if(brief!==undefined){
  if(brief?.version!=='director-brief-v1')errors.push('director_brief requires director-brief-v1');
  for(const key of ['question','audience_change','resolution'])if(!text(brief?.[key]))errors.push('director_brief.'+key+' required');
 }
 for(const s of arr(p.scenes)){
  const q=shots.find(q=>q.scene_id===s.id),layers=arr(s.composition?.layers),decision=q?.direction;
  if(brief)for(const l of layers){
   if(l.kind==='text'&&!l.align)findings.push({code:'IMPLICIT_TEXT_ANCHOR',scene:s.id,layer:l.id,severity:'review',message:'Renderer defaults to centered text; explicitly author alignment and inspect actual bounds.'});
   if(!l.pivot&&([l.scale,l.scaleX,l.scaleY].some(x=>x!==undefined&&x!==1)||l.rotation||arr(l.keyframes).some(k=>['scale','scaleX','scaleY','rotation'].some(x=>k[x]!==undefined))))findings.push({code:'IMPLICIT_TRANSFORM_PIVOT',scene:s.id,layer:l.id,severity:'review',message:'Renderer transforms around the canvas center; explicitly author the intended pivot.'});
  }
  if(brief){
   for(const k of ['composition_reason','medium_reason','attention_from','attention_to','omission_cost'])
    if(!text(decision?.[k]))errors.push(s.id+': direction.'+k+' required');
  }
  const changed=arr(q?.action?.changed_layers).map(id=>layers.find(l=>l.id===id)).filter(Boolean);
  // This is a deliberately narrow counterexample: a material/process claim represented
  // only by whole-object transforms. It requests observation, never semantic auto-failure.
  if(/절단|자르|조립|봉합|꿰매|수정|접[는기]|cut|assemble|sew|repair/i.test(q?.action?.verb||'')&&changed.length&&
    changed.every(l=>l.kind==='svg'&&!arr(l.morph).length&&!l.extension&&
      arr(l.keyframes).every(k=>Object.keys(k).every(n=>['at','x','y','scale','scaleX','scaleY','rotation','opacity','ease'].includes(n)))))
   findings.push({code:'PROCESS_MAY_BE_TRANSFORM_ONLY',scene:s.id,severity:'review',message:'Inspect contact and result: transforms alone may not show the claimed process. Multiple parts can legitimately assemble by translation.'});
  requests.push({scene_id:s.id,question:s.visual_plan?.viewer_takeaway||q?.purpose||'',
   verb:q?.action?.verb||'',composition_reason:decision?.composition_reason||'',
   evidence:['before','contact','after'].filter(k=>Number.isFinite(q?.action?.[k]?.at)).map(k=>({
    phase:k,frame:Math.round(s.start+q.action[k].at*fps),expected:q.action[k].state})),
   bridge:q?.bridge||null,review_order:'Observe frames/motion without the explanation first, then compare intent.'});
 }
 const fingerprint=directorFingerprint(p),reviewErrors=[];
 if(observations!==undefined){
  if(actualEvidence&&observations.movie_sha256!==actualEvidence.movie_sha256)reviewErrors.push('Observation movie hash mismatch; review this encoded output');
  if(observations?.version!=='director-observations-v1'||observations.fingerprint!==fingerprint)reviewErrors.push('Observation version/fingerprint mismatch; re-review changed output');
  const seen=new Set();
  for(const r of arr(observations?.shots)){
   if(seen.has(r.scene_id)||!requests.some(q=>q.scene_id===r.scene_id))reviewErrors.push('Unknown/duplicate observation '+r.scene_id);
   seen.add(r.scene_id);
   if(!text(r.observed_without_copy)||!text(r.intent_comparison)||!['needs-revision','observed','not-observed'].includes(r.status))reviewErrors.push(r.scene_id+': observation and comparison required');
   if(r.status!=='not-observed'&&(!text(r.evidence)||!text(r.reviewer)))reviewErrors.push(r.scene_id+': actual evidence and reviewer required');
  }
 }
 return {version:'director-review-v1',ok:!errors.length&&!reviewErrors.length,authored:!!brief,
  fingerprint,actual_evidence:actualEvidence,errors:[...errors,...reviewErrors],findings,requests,
  observed_shots:reviewErrors.length?0:arr(observations?.shots).filter(r=>r.status==='observed').length,
  pending_shots:requests.filter(q=>reviewErrors.length||!arr(observations?.shots).some(r=>r.scene_id===q.scene_id&&r.status==='observed')).map(q=>q.scene_id),
  aesthetic_status:'not automatically determined',listening:'requires separate actual listening record'};
}
export function directorReviewPage(r){
 const e=x=>esc(String(x??''));
 const frames=q=>q.evidence.map(v=>{const f=r.actual_evidence?.frames.find(f=>f.frame===v.frame);return f?'<figure style="display:inline-block;width:30%;margin:1%"><img style="width:100%" src="frames/'+encodeURIComponent(f.file)+'" alt="'+e(v.phase)+' frame '+v.frame+'"><figcaption>'+e(v.phase)+' · '+v.frame+'</figcaption></figure>':'';}).join('');
 return '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>디렉팅 대조</title><style>body{font:17px system-ui;background:#eeeae1;color:#222;max-width:1100px;margin:30px auto;padding:20px}section{background:white;padding:24px;margin:18px 0}li{margin:12px 0}code{overflow-wrap:anywhere}</style><h1>기획과 실제 화면 대조</h1><p>화면을 먼저 관찰하고 아래 의도를 펼쳐 비교합니다. 이 문서는 미감 승인이나 청취 기록이 아닙니다.</p><p>검토 대기 '+r.pending_shots.length+'컷 · <code>'+r.fingerprint+'</code></p>'+r.requests.map(q=>'<section><h2>'+e(q.scene_id)+'</h2>'+frames(q)+'<p>먼저: 글자를 가린 상태에서 실제로 무엇이 변하는지 기록합니다.</p><details><summary>기획 의도와 비교</summary><p>'+e(q.question)+'</p><p>'+e(q.composition_reason)+'</p><ul>'+q.evidence.map(v=>'<li>'+e(v.phase)+' · frame '+v.frame+' · '+e(v.expected)+'</li>').join('')+'</ul><p>다음 장면: '+e(q.bridge?.reason)+'</p></details></section>').join('')+'</html>';
}
