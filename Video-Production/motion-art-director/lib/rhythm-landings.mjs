// Descriptive inspection only: a late pose may be intentional.
export function landingInventory(p){
 const r=p.rhythm_score,rows=[];
 if(!r)return {rows,review:'No rhythm score'};
 const c=p.audio.clips[r.music.clip_index];
 for(const b of r.bindings.filter(b=>b.target.kind==='cut')){
  const s=p.scenes.find(s=>s.id===b.scene_id),e=r.events.find(e=>e.id===b.event_id);
  if(!s||!e)continue;
  const impact=Math.round((c.start+(e.source_seconds-c.source_in)/(c.speed??1))*30)+(b.impact_offset_frames??0);
  for(const l of s.composition?.layers||[]){
   if(l.kind!=='text')continue;
   const k=(l.keyframes||[]).find(k=>k.at>0&&['x','y','opacity','scale','reveal','tracking'].some(v=>v in k));
   const arrival=k?s.start+Math.round(k.at*30):s.start;
   const owned=r.bindings.some(x=>x.scene_id===s.id&&x.target.kind==='layer'&&x.target.layer_id===l.id);
   rows.push({scene_id:s.id,layer_id:l.id,cut_impact_frame:impact,first_pose_frame:arrival,first_pose_offset_frames:arrival-impact,explicit_layer_binding:owned,review:owned?'Independent layer event':'Review whether first pose or cut is the intended hit; not an automatic error'});
  }
 }
 return {rows,review:'First authored text pose inventory; does not infer perceived arrival or listening approval'};
}
