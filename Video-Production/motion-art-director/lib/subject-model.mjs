// Validate authored subject reasoning links, never automatically grade understanding.
export function subjectModelAudit(model,{sections=[],music=[],preferred_music_id}={}){
 const errors=[],pending=[];const text=x=>typeof x==='string'&&x.trim();
 if(!model)return {ok:true,errors,pending,scope:'Legacy concept without subject model'};
 if(model.version!=='subject-model-v1')errors.push('subject-model-v1 required');
 for(const k of ['premise','oversimplification','audience_shift'])if(!text(model[k]))errors.push('subject '+k+' required');
 const ids=new Set(sections.map((s,i)=>s.id||String(i))),facets=Array.isArray(model.facets)?model.facets:[];
 if(!facets.length)errors.push('authored relevant subject facets required');
 const seen=new Set();
 for(const f of facets){
  if(!text(f.id)||seen.has(f.id)||!text(f.label)||!text(f.reason))errors.push('unique facet id, label and selection reason required');seen.add(f.id);
  if(!['include','exclude'].includes(f.scope))errors.push('facet scope include/exclude required');
  const links=Array.isArray(f.section_ids)?f.section_ids:[];
  if(f.scope==='include'&&!links.length)errors.push(f.id+': included facet has no scene');
  if(f.scope==='exclude'&&links.length)errors.push(f.id+': excluded facet has scene links');
  for(const id of links)if(!ids.has(id))errors.push(f.id+': unknown section '+id);
 }
 const decisions=Array.isArray(model.decisions)?model.decisions:[];const ds=new Set();
 if(!decisions.length)errors.push('observation/choice/consequence example required');
 for(const d of decisions){
  if(!text(d.id)||ds.has(d.id))errors.push('unique decision id required');ds.add(d.id);
  if(!ids.has(d.section_id))errors.push('decision unknown section');
  for(const k of ['observation','choice','consequence','depiction'])if(!text(d[k]))errors.push(d.id+': '+k+' required');
  if(!['planned','preview-checked','production-checked'].includes(d.evidence_status))errors.push(d.id+': evidence status required');
  if(d.evidence_status!=='planned'&&!text(d.evidence_locator))errors.push(d.id+': checked depiction needs evidence');
  if(d.evidence_status==='planned')pending.push(d.id+': depiction requires source/graphic review');
 }
 const m=model.music_relation||{};
 if(!music.some(c=>c.id===m.id)||preferred_music_id&&preferred_music_id!==m.id)errors.push('music premise must follow current preferred candidate');
 for(const k of ['feeling','editorial_response','avoid'])if(!text(m[k]))errors.push('music relation '+k+' required');
 return {ok:!errors.length,errors,pending,review_state:'requires-editorial-review',scope:'Links and declared evidence only. No automatic semantic, artistic or factual approval; no coverage score.'};
}
