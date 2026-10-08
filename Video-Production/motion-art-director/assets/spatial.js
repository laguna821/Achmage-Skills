/* Optional software-WebGL scene graph. No vehicle or brand is built into the engine. */
window.__artReady=(async function(){
 const THREE=await window.__threeModule,p=window.PROJECT,old=document.getElementById('stage');
 const W=window.PORTRAIT?1080:1920,H=window.PORTRAIT?1920:1080,host=document.createElement('div');
 host.id='stage';host.style.cssText='position:relative;aspect-ratio:'+W+'/'+H+';width:100%;overflow:hidden';old.replaceWith(host);
 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
 const rw=Math.round(innerWidth),rh=Math.round(rw*H/W);renderer.setSize(rw,rh,false);renderer.setPixelRatio(1);renderer.domElement.style.cssText='position:absolute;width:100%;height:100%';host.append(renderer.domElement);
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;renderer.outputColorSpace=THREE.SRGBColorSpace;
 const overlay=document.createElementNS('http://www.w3.org/2000/svg','svg');overlay.setAttribute('viewBox','0 0 '+W+' '+H);overlay.style.cssText='position:absolute;inset:0;width:100%;height:100%';host.append(overlay);
 const plateCanvas=document.createElement('canvas');plateCanvas.width=rw;plateCanvas.height=rh;plateCanvas.style.cssText='position:absolute;inset:0;width:100%;height:100%';host.insertBefore(plateCanvas,overlay);const pc=plateCanvas.getContext('2d');
 const plateImages={};for(const [id,a] of Object.entries(window.ART_DATA||{})){const im=new Image();im.src=a.uri;await im.decode();plateImages[id]=im;}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,W/H,.04,500),world=new THREE.Group();scene.add(world);
 const hemi=new THREE.HemisphereLight(0xc9ddff,0x39303a,2.3);scene.add(hemi);
 const key=new THREE.DirectionalLight(0xffe1cc,3.8);key.position.set(-5,9,-4);scene.add(key);
 const rim=new THREE.DirectionalLight(0x6bafff,2);rim.position.set(6,4,5);scene.add(rim);
 // Original synthetic reflection map: no downloaded HDRI or scene-specific imagery.
 const envCanvas=document.createElement('canvas');envCanvas.width=1024;envCanvas.height=512;const ec=envCanvas.getContext('2d'),grad=ec.createLinearGradient(0,0,0,512);
 grad.addColorStop(0,'#081222');grad.addColorStop(.45,'#839da9');grad.addColorStop(.52,'#d0d8db');grad.addColorStop(.6,'#121821');grad.addColorStop(1,'#070c12');ec.fillStyle=grad;ec.fillRect(0,0,1024,512);
 for(const [x,w] of [[30,90],[300,16],[540,160],[820,25]]){ec.fillStyle='#f0f6ff';ec.fillRect(x,60,w,180);}
 const env=new THREE.CanvasTexture(envCanvas);env.mapping=THREE.EquirectangularReflectionMapping;env.colorSpace=THREE.SRGBColorSpace;scene.environment=env;
 const registry=new Map(),materials=new Map();
 function mat(d={}){const k=JSON.stringify(d);if(!materials.has(k))materials.set(k,new THREE.MeshStandardMaterial({color:d.color??'#777777',metalness:d.metalness??0,roughness:d.roughness??.4,emissive:d.emissive??'#000000',emissiveIntensity:d.emissiveIntensity??1,side:d.doubleSide?THREE.DoubleSide:THREE.FrontSide,transparent:d.opacity!==undefined,opacity:d.opacity??1,depthWrite:d.depthWrite!==false}));return materials.get(k);}
 function geo(g){switch(g.type){case 'box':return new THREE.BoxGeometry(...g.size);case 'sphere':return new THREE.SphereGeometry(g.radius,24,12);case 'cylinder':return new THREE.CylinderGeometry(g.top??g.radius,g.bottom??g.radius,g.height,32);case 'torus':return new THREE.TorusGeometry(g.radius,g.tube,10,48);case 'plane':return new THREE.PlaneGeometry(...g.size);case 'tube':return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(g.points.map(v=>new THREE.Vector3(...v))),g.segments??48,g.radius,5,false);case 'mesh':{const b=new THREE.BufferGeometry();b.setAttribute('position',new THREE.Float32BufferAttribute(g.vertices,3));if(g.indices)b.setIndex(g.indices);b.computeVertexNormals();return b;}default:throw Error('Unsupported spatial geometry '+g.type);}}
 for(const n of p.spatial.nodes){const o=n.geometry?new THREE.Mesh(geo(n.geometry),mat(n.material)):new THREE.Group();o.name=n.id;o.position.fromArray(n.position||[0,0,0]);o.rotation.fromArray([...(n.rotation||[0,0,0]),'XYZ']);o.scale.fromArray(n.scale||[1,1,1]);if(n.foreground)o.layers.set(1);registry.set(n.id,{object:o,source:n});}
 for(const {object:o,source:n} of registry.values())(n.parent?registry.get(n.parent).object:world).add(o);
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);},lerp=(a,b,u)=>a+(b-a)*u;
 function sample(keys,t,defaults){if(!keys?.length)return {...defaults};let a={at:0,...defaults};for(const k of keys){const b={...a,...k};if(t<k.at){let u=clamp((t-a.at)/(k.at-a.at));u=k.ease==='linear'?u:k.ease==='hold'?0:smooth(u);const v={...a};for(const name of Object.keys(defaults)){if(Array.isArray(a[name]))v[name]=a[name].map((q,i)=>lerp(q,b[name][i],u));else if(typeof a[name]==='number')v[name]=lerp(a[name],b[name],u);else v[name]=a[name];}return v;}a=b;}return a;}
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(sec){
  const frame=Math.max(0,Math.min(p.output.total_frames-1,Math.floor(sec*30+1e-5))),s=p.scenes.find(s=>frame>=s.start&&frame<s.end),t=(frame-s.start)/30,c=s.spatial;
  const travel=c.travel||{},speed=travel.speed??0,acc=travel.acceleration??0,dist=(travel.offset??0)+speed*t+.5*acc*t*t;
  for(const {object:o,source:n} of registry.values()){
   const tr=sample(n.keyframes,frame/30+(p.spatial.clock_origin||0),{position:n.position||[0,0,0],rotation:n.rotation||[0,0,0],scale:n.scale||[1,1,1]});o.position.fromArray(tr.position);o.rotation.set(...tr.rotation);o.scale.fromArray(tr.scale);o.visible=!(n.tags||[]).some(tag=>(c.hide||[]).includes(tag));
   if(n.motion?.kind==='wheel')o.rotation[n.motion.axis||'x']+=(dist/(n.motion.radius||.36))*(n.motion.sign??1);
   if(n.motion?.kind==='repeat'){const axis=n.motion.axis||'z',a=n.motion.min,b=n.motion.max;o.position[axis]=a+((o.position[axis]-a+dist)%(b-a)+(b-a))%(b-a);}
   if(n.motion?.kind==='oscillate')o.position[n.motion.axis||'y']+=Math.sin((frame/30+(p.spatial.clock_origin||0))*(n.motion.frequency||1)+p.seed)*n.motion.amplitude;
  }
  const v=sample(c.camera.keyframes,t,{position:c.camera.position,target:c.camera.target,fov:c.camera.fov??45,roll:c.camera.roll??0});camera.position.fromArray(v.position);camera.fov=v.fov;camera.up.set(Math.sin(v.roll),Math.cos(v.roll),0);camera.lookAt(...v.target);camera.updateProjectionMatrix();
  scene.background=new THREE.Color(c.background||'#080d16');scene.fog=new THREE.Fog(c.fog?.color||c.background||'#080d16',c.fog?.near??35,c.fog?.far??160);renderer.toneMappingExposure=c.exposure??1.2;hemi.intensity=c.ambient??2.3;key.intensity=c.key??3.8;rim.intensity=c.rim??2;
  camera.layers.set(0);renderer.setClearAlpha(1);renderer.render(scene,camera);pc.setTransform(rw/W,0,0,rh/H,0,0);pc.clearRect(0,0,W,H);pc.drawImage(renderer.domElement,0,0,W,H);
  const baseInfo={triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls};const anchorChecks=[];
  for(const l of c.plates||[]){const im=plateImages[l.asset_id];if(!im)throw Error('Missing plate '+l.asset_id);const q=sample(l.keyframes,t,{rect:l.rect,opacity:l.opacity??1,roll:l.roll??0});const [x,y,w,h]=q.rect,[sx,sy,sw,sh]=l.source_rect||[0,0,im.width,im.height];pc.save();pc.globalAlpha=q.opacity;
   if(l.ground_anchors){const [a,b]=l.ground_anchors,project=point=>{const v=new THREE.Vector3(...point).project(camera);return [(v.x+1)*W/2,(1-v.y)*H/2];},A=project(a.world),B=project(b.world),src=point=>[(point[0]-sx)/sw*w,(point[1]-sy)/sh*h],S=src(a.source),T=src(b.source),dx=T[0]-S[0],dy=T[1]-S[1],den=dx*dx+dy*dy,ux=B[0]-A[0],uy=B[1]-A[1],aa=(ux*dx+uy*dy)/den,bb=(uy*dx-ux*dy)/den,tx=A[0]-aa*S[0]+bb*S[1],ty=A[1]-bb*S[0]-aa*S[1];pc.transform(aa,bb,-bb,aa,tx,ty);anchorChecks.push({asset:l.asset_id,screen:[A,B],scale:Math.hypot(aa,bb),rotation:Math.atan2(bb,aa)});}
   else {pc.translate(x+w/2,y+h/2);pc.rotate(q.roll);pc.translate(-w/2,-h/2);}
   if(l.shadow){pc.save();pc.fillStyle='rgba(0,0,0,.5)';pc.filter='blur(14px)';pc.beginPath();pc.ellipse(w*.5,h*.96,w*.32,h*.06,0,0,Math.PI*2);pc.fill();pc.restore();}
   if(l.source_clip){pc.beginPath();l.source_clip.forEach(([a,b],i)=>pc[i?'lineTo':'moveTo']((a-sx)/sw*w,(b-sy)/sh*h));pc.closePath();pc.clip();}
   // Mirrors render the world behind the vehicle. Transparent mirror apertures must
   // never accidentally show the forward camera through the cabin plate.
   for(const m of l.mirrors||[]){const pts=m.polygon.map(([a,b])=>[(a-sx)/sw*w,(b-sy)/sh*h]),xs=pts.map(v=>v[0]),ys=pts.map(v=>v[1]),mx=Math.min(...xs),my=Math.min(...ys),mw=Math.max(...xs)-mx,mh=Math.max(...ys)-my;
    const mc=new THREE.PerspectiveCamera(m.camera.fov||60,mw/mh,.04,500);mc.position.fromArray(m.camera.position);mc.lookAt(...m.camera.target);mc.layers.set(0);renderer.render(scene,mc);pc.save();pc.beginPath();pts.forEach(([a,b],i)=>pc[i?'lineTo':'moveTo'](a,b));pc.closePath();pc.clip();pc.translate(mx+mw,my);pc.scale(-1,1);pc.drawImage(renderer.domElement,0,0,mw,mh);pc.fillStyle='rgba(6,13,20,.38)';pc.fillRect(0,0,mw,mh);pc.restore();
   }
   pc.drawImage(im,sx,sy,sw,sh,0,0,w,h);
   for(const wheel of l.wheels||[]){const [cx,cy,rx,ry]=wheel,dx=(cx-sx)/sw*w,dy=(cy-sy)/sh*h,wx=rx/sw*w,wy=ry/sh*h,radius=p.spatial.wheel_radius||.37,shutter=l.wheel_shutter??.5,samples=Math.abs(speed+acc*t)>.1&&shutter>0?8:1;
    pc.save();pc.translate(dx,dy);pc.scale(wx,wy);pc.beginPath();pc.arc(0,0,1,0,Math.PI*2);pc.clip();
    // Absolute-time shutter integration; accumulate into the opaque rim only.
    // Tyres, brake/fender silhouettes and contact points do not rotate as a tile.
    for(let i=0;i<samples;i++){const dt=samples===1?0:((i+.5)/samples-.5)*shutter/30,angle=-(dist+(speed+acc*t)*dt+.5*acc*dt*dt)/radius;pc.save();pc.globalAlpha=q.opacity/(i+1);pc.rotate(angle);pc.drawImage(im,cx-rx,cy-ry,rx*2,ry*2,-1,-1,2,2);pc.restore();}pc.restore();}
   pc.restore();
  }
  if(p.spatial.nodes.some(n=>n.foreground)){const bg=scene.background;scene.background=null;renderer.setClearAlpha(0);camera.layers.set(1);hemi.layers.enable(1);key.layers.enable(1);rim.layers.enable(1);renderer.render(scene,camera);pc.drawImage(renderer.domElement,0,0,W,H);scene.background=bg;camera.layers.set(0);}
  let out='<rect width="1920" height="70" fill="#000"/><rect y="1010" width="1920" height="70" fill="#000"/>';
  for(const l of s.composition?.layers||[]){const k=sample(l.keyframes,t,{x:l.x??0,y:l.y??0,scale:l.scale??1,opacity:l.opacity??1,tracking:l.tracking??0});if(l.kind==='text'){const txt=l.content_id?p.content_units.find(x=>x.content_id===l.content_id)?.display_text:l.text;out+='<g opacity="'+k.opacity+'" transform="translate('+k.x+' '+k.y+')"><text x="'+(l.position?.[0]??110)+'" y="'+(l.position?.[1]??820)+'" fill="'+esc(l.color||'#eef5ff')+'" font-family="Pretendard" font-weight="'+(l.weight??650)+'" font-size="'+(l.size??85)+'" letter-spacing="'+k.tracking+'" text-anchor="'+(l.align||'start')+'">'+esc(txt)+'</text></g>';}else if(l.kind==='svg')out+='<g opacity="'+k.opacity+'" transform="translate('+k.x+' '+k.y+') scale('+k.scale+')">'+l.svg+'</g>';}
  overlay.innerHTML=out;const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');window.__state={frame,scene:s.id,time:frame/30,renderer:'spatial-three',adapter:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),travel:dist,wheelPhase:dist/(p.spatial.wheel_radius||.36),camera:{position:v.position,target:v.target},anchors:anchorChecks,triangles:baseInfo.triangles+(p.spatial.nodes.some(n=>n.foreground)?renderer.info.render.triangles:0),drawCalls:baseInfo.drawCalls+(p.spatial.nodes.some(n=>n.foreground)?renderer.info.render.calls:0)};return window.__state;
 }
 window.__spatialRender=render;window.__spatialSample=sample;window.__spatialReady=true;window.__resolveEngine();
})().catch(e=>{window.__engineError=e.message;throw e;});
