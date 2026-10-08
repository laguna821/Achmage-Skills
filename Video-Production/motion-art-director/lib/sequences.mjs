// A sequence owns contiguous shots; its narrative can continue across short cuts.
export function sequenceCheck(p){
 const groups=p.editorial_plan?.sequences,errors=[];
 if(groups===undefined)return {ok:true,required:false,errors};
 const nonempty=x=>typeof x==='string'&&x.trim().length>0,seen=new Set(),flat=[];
 if(!Array.isArray(groups)||!groups.length)return {ok:false,required:true,errors:['sequences must be a nonempty array']};
 for(const g of groups){
  if(!g||!nonempty(g.id)||seen.has(g.id)){errors.push('Sequence ID missing/duplicate');continue;}
  seen.add(g.id);
  if(!['question','consequence','musical_role'].every(k=>nonempty(g[k])))errors.push(g.id+': question/consequence/musical_role required');
  if(!Array.isArray(g.shot_ids)||!g.shot_ids.length||!g.shot_ids.every(nonempty))errors.push(g.id+': actual shot IDs required');
  else flat.push(...g.shot_ids);
 }
 const actual=(p.scenes||[]).map(s=>s.id);
 if(JSON.stringify(flat)!==JSON.stringify(actual))errors.push('Sequences must cover every actual shot exactly once in contiguous timeline order');
 return {ok:errors.length===0,required:true,errors,groups:groups.length,review:'membership only; causality, variety and musical flow need playback review'};
}
