/* Precision scene graph: authored surfaces, camera-relative shots, deterministic travel. */
window.__artReady=(async function(){
 const THREE=await window.__threeModule,p=window.PROJECT,W=1920,H=1080;
 const host=document.createElement('div');host.id='stage';host.style.cssText='position:relative;aspect-ratio:16/9;width:100%;overflow:hidden';document.getElementById('stage').replaceWith(host);
 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
 renderer.setSize(Math.round(innerWidth),Math.round(innerWidth*H/W),false);renderer.setPixelRatio(1);renderer.domElement.style.cssText='display:block;width:100%;height:100%';host.append(renderer.domElement);
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.outputColorSpace=THREE.SRGBColorSpace;
 const overlay=document.createElementNS('http://www.w3.org/2000/svg','svg');overlay.setAttribute('viewBox','0 0 1920 1080');overlay.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';host.append(overlay);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,16/9,.04,800),world=new THREE.Group();scene.add(world);
 const hemi=new THREE.HemisphereLight(0xd9eaff,0x10111e,1),key=new THREE.DirectionalLight(0xffe9d3,3),rim=new THREE.DirectionalLight(0x99caff,2);key.position.set(-5,8,-6);rim.position.set(6,3,4);scene.add(hemi,key,rim);
 // A photographic lighting vocabulary made entirely from generated vectors.
 const envC=document.createElement('canvas');envC.width=1024;envC.height=512;const ec=envC.getContext('2d'),g=ec.createLinearGradient(0,0,0,512);
 g.addColorStop(0,'#050b18');g.addColorStop(.35,'#223a57');g.addColorStop(.49,'#74889b');g.addColorStop(.51,'#91a0a5');g.addColorStop(.57,'#101420');g.addColorStop(1,'#020309');ec.fillStyle=g;ec.fillRect(0,0,1024,512);
 for(const [x,y,w,h] of [[45,35,150,125],[330,80,28,240],[500,40,270,120],[890,30,32,250]]){const lg=ec.createLinearGradient(x,0,x+w,0);lg.addColorStop(0,'#4b6270');lg.addColorStop(.2,'#cbdbe0');lg.addColorStop(.6,'#f6f0de');lg.addColorStop(1,'#172433');ec.fillStyle=lg;ec.fillRect(x,y,w,h);}
 const envTex=new THREE.CanvasTexture(envC);envTex.mapping=THREE.EquirectangularReflectionMapping;envTex.colorSpace=THREE.SRGBColorSpace;const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(envTex).texture;pmrem.dispose();
 const textures=new Map();
 for(const [id,d] of Object.entries(p.spatial.textures||{})){
  const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(d.svg);await im.decode();const canvas=document.createElement('canvas');canvas.width=d.width||1024;canvas.height=d.height||512;canvas.getContext('2d').drawImage(im,0,0,canvas.width,canvas.height);const tx=new THREE.CanvasTexture(canvas);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=2;if(d.repeat){tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(...d.repeat);}textures.set(id,tx);
 }
 const materials=new Map(),geometries=new Map(),registry=new Map();
 function material(d={}){const k=JSON.stringify(d);if(materials.has(k))return materials.get(k);const opts={color:d.color??'#777777',side:d.doubleSide?THREE.DoubleSide:THREE.FrontSide,transparent:d.opacity!==undefined||d.texture_alpha===true,opacity:d.opacity??1,depthWrite:d.depthWrite!==false,...(d.texture?{map:textures.get(d.texture)}:{})};
  const m=d.unlit?new THREE.MeshBasicMaterial(opts):new THREE.MeshPhysicalMaterial({...opts,metalness:d.metalness??0,roughness:d.roughness??.4,clearcoat:d.clearcoat??0,clearcoatRoughness:d.clearcoatRoughness??.14,envMapIntensity:d.envIntensity??1,emissive:d.emissive??'#000000',emissiveIntensity:d.emissiveIntensity??1});if(d.wireframe)m.wireframe=true;materials.set(k,m);return m;
 }
 function geometry(g){const k=JSON.stringify(g);if(geometries.has(k))return geometries.get(k);let o;switch(g.type){
  case 'box':o=new THREE.BoxGeometry(...g.size);break;
  case 'sphere':o=new THREE.SphereGeometry(g.radius,24,12);break;
  case 'cylinder':o=new THREE.CylinderGeometry(g.top??g.radius,g.bottom??g.radius,g.height,g.segments||40);break;
  case 'torus':o=new THREE.TorusGeometry(g.radius,g.tube,12,64);break;
  case 'plane':o=new THREE.PlaneGeometry(...g.size);break;
  case 'tube':o=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(g.points.map(v=>new THREE.Vector3(...v))),g.segments??48,g.radius,6,false);break;
  case 'mesh':o=new THREE.BufferGeometry();o.setAttribute('position',new THREE.Float32BufferAttribute(g.vertices,3));if(g.indices)o.setIndex(g.indices);if(g.uv)o.setAttribute('uv',new THREE.Float32BufferAttribute(g.uv,2));o.computeVertexNormals();break;
  default:throw Error('Unsupported geometry '+g.type);
 }geometries.set(k,o);return o;}
 for(const n of p.spatial.nodes){const o=n.geometry?new THREE.Mesh(geometry(n.geometry),material(n.material)):new THREE.Group();o.name=n.id;registry.set(n.id,{o,n});}
 for(const {o,n}of registry.values())(n.parent?registry.get(n.parent).o:world).add(o);
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 function sample(keys,t,defaults){let a={at:0,...defaults};for(const k of keys||[]){const b={...a,...k};if(t<k.at){let u=clamp((t-a.at)/(k.at-a.at));u=k.ease==='linear'?u:k.ease==='hold'?0:k.ease==='out'?1-(1-u)**3:smooth(u);const r={...a};for(const name of Object.keys(defaults)){if(Array.isArray(a[name]))r[name]=a[name].map((v,i)=>v+(b[name][i]-v)*u);else if(typeof a[name]==='number')r[name]=a[name]+(b[name]-a[name])*u;}return r;}a=b;}return a;}
 const smokeCanvas=document.createElement('canvas');smokeCanvas.width=smokeCanvas.height=64;const sc=smokeCanvas.getContext('2d'),sg=sc.createRadialGradient(32,32,0,32,32,32);sg.addColorStop(0,'rgba(209,218,226,.5)');sg.addColorStop(.45,'rgba(181,194,207,.25)');sg.addColorStop(1,'rgba(150,170,192,0)');sc.fillStyle=sg;sc.fillRect(0,0,64,64);const smokeTex=new THREE.CanvasTexture(smokeCanvas),smoke=[];
 for(let i=0;i<52;i++){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,transparent:true,depthWrite:false,opacity:0}));scene.add(sprite);smoke.push(sprite);}
 function render(sec){
  const frame=Math.max(0,Math.min(p.output.total_frames-1,Math.floor(sec*30+1e-5))),s=p.scenes.find(s=>frame>=s.start&&frame<s.end),t=(frame-s.start)/30,c=s.spatial;
  const travel=c.travel||{},dist=(travel.offset??0)+(s.driving?window.__driveIntegral(s.driving.speed,t):(travel.speed??0)*t+.5*(travel.acceleration??0)*t*t);
  const visible=new Set(c.show||[]),transforms=[];
  for(const {o,n}of registry.values()){
   const q=c.transforms?.[n.id]||{},tr=sample(q.keyframes||n.keyframes,q.keyframes?t:frame/30+(p.spatial.clock_origin||0),{position:q.position||n.position||[0,0,0],rotation:q.rotation||n.rotation||[0,0,0],scale:q.scale||n.scale||[1,1,1]});o.position.fromArray(tr.position);o.rotation.set(...tr.rotation);o.scale.fromArray(tr.scale);
   o.visible=!(n.tags||[]).some(tag=>(c.hide||[]).includes(tag))&&(!n.variant||visible.has(n.variant));
   if(n.motion?.kind==='wheel')o.rotation[n.motion.axis||'x']+=(c.wheel_distance??dist)/n.motion.radius*(n.motion.sign??1);
   if(n.motion?.kind==='repeat'){const a=n.motion.min,b=n.motion.max,axis=n.motion.axis||'z';o.position[axis]=a+((o.position[axis]-a+dist)%(b-a)+(b-a))%(b-a);}
   if(n.motion?.kind==='oscillate')o.position[n.motion.axis||'y']+=Math.sin((frame/30+(p.spatial.clock_origin||0))*n.motion.frequency+p.seed)*n.motion.amplitude;
   if(n.id===p.spatial.subject)transforms.push({id:n.id,position:[...tr.position],rotation:[...tr.rotation]});
  }
  world.updateMatrixWorld(true);
  // Reconstruct each puff at its birth time; arbitrary seeks need no previous frame.
  const carRecord=registry.get(p.spatial.subject),track=c.transforms?.[p.spatial.subject],step=.085;
  for(let i=0;i<smoke.length;i++){const puff=smoke[i],birth=(Math.floor(t/step)-Math.floor(i/2))*step,age=t-birth,slip=s.driving?window.__driveCurve(s.driving.slip,birth):0;puff.visible=!!c.tyre_smoke&&birth>=0&&age<2.15&&slip>.1;
   if(!puff.visible)continue;const tr=sample(track?.keyframes,birth,{position:track?.position||carRecord.n.position||[0,0,0],rotation:track?.rotation||[0,0,0],scale:[1,1,1]}),yaw=tr.rotation[1],x=i%2?-.81:.81,z=1.375,drift=c.tyre_smoke.drift||[.3,0,.4];
   puff.position.set(tr.position[0]+x*Math.cos(yaw)+z*Math.sin(yaw)+age*drift[0],.13+age*.37,tr.position[2]-x*Math.sin(yaw)+z*Math.cos(yaw)+age*drift[2]);const size=.3+age*1.6;puff.scale.set(size,size,1);puff.material.opacity=.52*slip*Math.min(1,age/.15)*(1-age/2.15);puff.material.rotation=Math.sin(i*17+p.seed)*2+age*.12;
  }
  const v=sample(c.camera.keyframes,t,{position:c.camera.position,target:c.camera.target,fov:c.camera.fov??42,roll:c.camera.roll??0});
  if(c.camera.relative_to){const o=registry.get(c.camera.relative_to).o;v.position=o.localToWorld(new THREE.Vector3(...v.position)).toArray();v.target=o.localToWorld(new THREE.Vector3(...v.target)).toArray();}
  camera.position.fromArray(v.position);camera.up.set(Math.sin(v.roll),Math.cos(v.roll),0);camera.lookAt(...v.target);camera.fov=v.fov;camera.updateProjectionMatrix();
  scene.background=new THREE.Color(c.background||'#050c14');scene.fog=new THREE.Fog(c.fog?.color||c.background||'#050c14',c.fog?.near??50,c.fog?.far??230);renderer.toneMappingExposure=c.exposure??1.1;
  hemi.intensity=c.ambient??1;key.intensity=c.key??3;rim.intensity=c.rim??2;key.position.fromArray(c.key_position||[-5,8,-6]);key.color.set(c.key_color||'#ffe9d3');rim.color.set(c.rim_color||'#99caff');scene.environmentRotation.y=c.environment_rotation??0;
  renderer.render(scene,camera);
  // The same vector renderer drives type, masks, paths, reveal, weight and tracking.
  let out=window.__vectorScene(s,frame,true);
  if(c.vignette!==false)out+='<defs><radialGradient id="film-edge"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#film-edge)"/>';
  const tr=s.spatial_transition;if(tr&&t<tr.duration){const u=1-smooth(t/tr.duration);if(tr.kind==='shutter')out+='<rect width="'+(W*u)+'" height="1080" fill="'+(tr.color||'#07121d')+'"/>';else if(tr.kind==='iris')out+='<rect width="1920" height="1080" fill="'+(tr.color||'#07121d')+'" opacity="'+u+'"/>';}
  if(c.letterbox!==false)out+='<rect width="1920" height="58" fill="#020306"/><rect y="1022" width="1920" height="58" fill="#020306"/>';
  overlay.innerHTML=out;
  const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');window.__state={frame,scene:s.id,time:frame/30,renderer:'spatial-three',version:'precision-1',adapter:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),travel:dist,driving:s.driving?Object.fromEntries(['speed','rpm','throttle','slip','pan'].map(k=>[k,window.__driveCurve(s.driving[k],t)])):null,smoke:smoke.filter(x=>x.visible).map(x=>({position:x.position.toArray(),opacity:x.material.opacity})),camera:v,subjects:transforms,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,geometryCount:geometries.size};return window.__state;
 }
 window.__spatialRender=render;window.__spatialSample=sample;window.__spatialReady=true;window.__resolveEngine();
})().catch(e=>{window.__engineError=e.message;throw e;});
