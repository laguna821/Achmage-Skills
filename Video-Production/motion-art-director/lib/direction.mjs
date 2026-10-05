/* Structural evidence is not semantic recognition or aesthetic approval. */
export function directionCheck(p){
 const errors=[],warnings=[],required=p.direction_contract==='object-first-v1';
 const nonempty=x=>typeof x==='string'&&x.trim().length>0;
 const strings=x=>Array.isArray(x)&&x.length>0&&x.every(nonempty);
 if(p.direction_contract!==undefined&&!required)errors.push('unknown direction contract');
 for(const scene of p.scenes||[]){
  const v=scene.visual_plan,check=(ok,message)=>{if(!ok)(required||v?errors:warnings).push(scene.id+': '+message);};
  if(!v){check(false,'실제 대상·정보·행동의 시각 연출안 없음');continue;}
  const shape=typeof v==='object'&&!Array.isArray(v)&&['objects','content_links','beats','continuity'].every(k=>Array.isArray(v[k]));
  check(shape,'visual_plan objects/content_links/beats/continuity must be arrays');if(!shape)continue;
  if(p.renderer==='spatial-three')for(const l of scene.composition?.layers||[]){if(l.spatial_bindings)check(l.spatial_bindings.every(id=>p.spatial?.nodes?.some(n=>n.id===id)),'공간 노드 대응 누락');if(l.plate_bindings)check(l.plate_bindings.every(id=>scene.spatial?.plates?.some(a=>a.asset_id===id)),'실제 원화 대응 누락');}
  const rawLayers=scene.composition?.layers||[],layers=new Map(rawLayers.filter(l=>l.id).map(l=>[l.id,l]));
  check(layers.size===rawLayers.filter(l=>l.id).length,'중복 레이어 ID');
  check(v.objects.every(o=>o&&typeof o==='object'&&nonempty(o.id)),'대상 ID 필요');
  const objects=new Map(v.objects.filter(o=>o&&nonempty(o.id)).map(o=>[o.id,o]));
  check(nonempty(v.viewer_takeaway),'관객이 보아야 할 내용 없음');
  check(objects.size>0&&objects.size===v.objects.length,'실제 대상의 고유 ID 필요');
  for(const o of objects.values()){
   check(nonempty(o.kind)&&nonempty(o.depicts)&&strings(o.features)&&strings(o.bindings),o.id+': 그릴 대상·식별 특징·레이어 대응 필요');
   check(Array.isArray(o.bindings)&&o.bindings.every(id=>layers.has(id)),o.id+': 명세에만 있고 실제 레이어에 없는 대상');
   if(o.kind!=='typography')check(Array.isArray(o.bindings)&&o.bindings.some(id=>['svg','image','procedural'].includes(layers.get(id)?.kind)),o.id+': 실제 그림 없이 글자만 연결된 대상');
   check(o.information===undefined||Array.isArray(o.information),o.id+': information must be an array');
   for(const f of Array.isArray(o.information)?o.information:[])check(f&&nonempty(f.name)&&f.value!==undefined&&nonempty(f.basis)&&nonempty(f.layer_id)&&layers.has(f.layer_id)&&o.bindings?.includes(f.layer_id),o.id+': 정보의 값·근거·대상에 연결된 표시 레이어 필요');
  }
  for(const c of v.content_links)check(c&&(scene.content_ids||[]).includes(c.content_id)&&strings(c.shown_by)&&c.shown_by.every(id=>objects.has(id))&&nonempty(c.reason),'내용과 실제 대상의 대응 오류');
  for(const id of scene.content_ids||[])check(v.content_links.some(c=>c?.content_id===id),id+': 문구를 무엇으로 보여주는지 누락');
  check(v.beats.length>0,'대상의 상태 변화/관찰 순서 필요');
  for(const b of v.beats){
   check(b&&strings(b.object_ids)&&b.object_ids.every(id=>objects.has(id))&&nonempty(b.action)&&nonempty(b.before)&&nonempty(b.after),'대상·행동·전후 상태 누락');
   check(Array.isArray(b?.window)&&b.window.length===2&&b.window.every(Number.isFinite)&&b.window[0]>=0&&b.window[1]>b.window[0]&&b.window[1]<=(scene.end-scene.start)/(p.output?.fps||30),'행동 시간 범위 오류');
  }
  check(strings(v.continuity),'장면 사이에 유지/변환할 대상과 정보의 관계 필요');
 }
 return {ok:errors.length===0,required,errors,warnings,semanticJudgment:'actual drawings and playback need visual review; structural binding is not recognition'};
}
