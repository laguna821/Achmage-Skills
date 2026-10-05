/* Authored vector layers; all motion is a pure function of absolute scene time. */
(function(){
 const p=window.PROJECT,W=window.PORTRAIT?1080:1920,H=window.PORTRAIT?1920:1080,svg=document.getElementById('stage');
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const smooth=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
 const defaults={x:0,y:0,scale:1,scaleX:1,scaleY:1,rotation:0,opacity:1,draw:1,tracking:0,weight:400,reveal:1};
 function value(l,key,t){let value=l[key]??defaults[key],at=0;for(const k of l.keyframes||[]){if(k[key]===undefined){if(p.timeline_semantics==='segments-v1'){if(t<k.at)return value;at=k.at;}continue;}if(t<k.at){let u=k.at===at?1:Math.max(0,Math.min(1,(t-at)/(k.at-at)));u=k.ease==='linear'?u:k.ease==='hold'?0:k.ease==='out'?1-Math.pow(1-u,3):smooth(u);return value+(k[key]-value)*u;}value=k[key];at=k.at;}return value;}
 function morph(l,t){const ks=l.morph||[];if(!ks.length)return '';let a=ks[0];for(const b of ks.slice(1)){if(t<b.at)return gsap.utils.interpolate(a.d,b.d,smooth((t-a.at)/(b.at-a.at)));a=b;}return a.d;}
 function drawScene(s,frame,transparent=false){
  const t=(frame-s.start)/30;
  const c=window.PORTRAIT?(s.portrait_composition||s.composition):s.composition,bw=c.width||1920,bh=c.height||1080,fit=Math.min(W/bw,H/bh),ox=(W-bw*fit)/2,oy=(H-bh*fit)/2;
  let out='<defs>'+ (c.defs||'')+'</defs>'+(transparent?'':'<rect width="'+W+'" height="'+H+'" fill="'+esc(c.background||'#ede8dc')+'"/>')+'<g transform="translate('+ox+' '+oy+') scale('+fit+')">';
  for(const [i,l] of c.layers.entries()){
   const v=Object.fromEntries(Object.keys(defaults).map(k=>[k,value(l,k,t)])),pivot=l.pivot||[bw/2,bh/2];
   out+='<g data-layer-id="'+esc(l.id||'layer-'+i)+'" opacity="'+v.opacity+'" transform="translate('+v.x+' '+v.y+') rotate('+v.rotation+' '+pivot.join(' ')+') translate('+pivot.join(' ')+') scale('+(v.scale*v.scaleX)+' '+(v.scale*v.scaleY)+') translate('+pivot.map(x=>-x).join(' ')+')"'+(l.clip?' clip-path="url(#'+esc(l.clip)+')"':'')+'>';
   if(l.reveal_rect){const [rx,ry,rw,rh]=l.reveal_rect;out+='<clipPath id="reveal-'+i+'"><rect x="'+rx+'" y="'+ry+'" width="'+(rw*v.reveal)+'" height="'+rh+'"/></clipPath><g clip-path="url(#reveal-'+i+')">';}
   if(l.kind==='text'){const copy=l.content_id?p.content_units.find(c=>c.content_id===l.content_id)?.display_text:l.text;out+='<text '+(l.content_id?'data-copy="true" ':'')+'x="'+(l.position?.[0]??bw/2)+'" y="'+(l.position?.[1]??bh/2)+'" fill="'+esc(l.color||'#173d48')+'" font-family="'+esc(l.font||'Pretendard')+'" font-size="'+(l.size||48)+'" font-weight="'+v.weight+'" letter-spacing="'+v.tracking+'" text-anchor="'+esc(l.align||'middle')+'">'+esc(copy)+'</text>';}
   else if(l.kind==='procedural')out+=window.MOTIONART[l.mode]?.(t,p.seed,s)||'';
   else if(l.morph)out+='<path d="'+esc(morph(l,t))+'" fill="'+esc(l.fill||'none')+'" stroke="'+esc(l.stroke||'#173d48')+'" stroke-width="'+(l.stroke_width||3)+'" pathLength="1" stroke-dasharray="1" stroke-dashoffset="'+(1-v.draw)+'"/>';
   else out+='<g'+(l.draw!==undefined||l.keyframes?.some(k=>k.draw!==undefined)?' stroke-dasharray="1" stroke-dashoffset="'+(1-v.draw)+'"':'')+'>'+l.svg+'</g>';
   if(l.reveal_rect)out+='</g>';
   out+='</g>';
  }
  return (out+'</g>').replace(/(\s)id="([^"]+)"/g,(_,space,id)=>space+'id="'+s.id+'-'+id+'"').replace(/url\(#([^)]+)\)/g,(_,id)=>'url(#'+s.id+'-'+id+')');
 }
 window.__vectorScene=drawScene;
 window.__vectorRender=sec=>{
  const frame=Math.max(0,Math.min(p.output.total_frames-1,Math.floor(sec*30+1e-5))),s=p.scenes.find(s=>frame>=s.start&&frame<s.end)||p.scenes.at(-1),i=p.scenes.indexOf(s),t=(frame-s.start)/30,tr=s.transition_in;
  let out=drawScene(s,frame);
  if(i>0&&tr&&t<tr.duration){const u=smooth(t/tr.duration),prev=p.scenes[i-1];let clip;
   if(tr.kind==='iris')clip='<circle cx="'+(tr.origin?.[0]??W/2)+'" cy="'+(tr.origin?.[1]??H/2)+'" r="'+(Math.hypot(W,H)*u)+'"/>';
   else if(tr.kind==='wipe-y')clip='<rect width="'+W+'" height="'+(H*u)+'"/>';
   else clip='<rect width="'+(W*u)+'" height="'+H+'"/>';
   out=drawScene(prev,prev.end-1)+'<defs><clipPath id="scene-transition">'+clip+'</clipPath></defs><g clip-path="url(#scene-transition)">'+out+'</g>';
  }
  svg.innerHTML=out;window.__state={frame,scene:s.id,time:frame/30,renderer:'vector-composite'};return window.__state;
 };
})();

