/* Authoring primitives shared by Codex/Claude. Output is ordinary scene data. */
export class PrecisionBuilder {
 constructor(){this.nodes=[];this.serial=0;}
 group(id,parent,extra={}){this.nodes.push({id,...(parent?{parent}:{}),...extra});return id;}
 add(parent,geometry,material,position=[0,0,0],rotation=[0,0,0],extra={}){
  const id=extra.id||'part-'+this.serial++;this.nodes.push({id,...(parent?{parent}:{}),geometry,material,position,rotation,...extra});return id;
 }
 box(parent,size,position,material,extra={}){return this.add(parent,{type:'box',size},material,position,extra.rotation||[0,0,0],extra);}
 mesh(parent,vertices,indices,material,extra={}){return this.add(parent,{type:'mesh',vertices:vertices.flat(),indices,...(extra.uv?{uv:extra.uv.flat()}:{})},material,[0,0,0],[0,0,0],extra);}
 surface(parent,fn,nu,nv,material,extra={}){
  if(!Number.isInteger(nu)||!Number.isInteger(nv)||nu<1||nv<1||nu*nv>100000)throw Error('Invalid surface resolution');
  const v=[],uv=[],idx=[];for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const point=fn(i/nu,j/nv);if(point.length!==3||!point.every(Number.isFinite))throw Error('Non-finite precision surface');v.push(point);uv.push([i/nu,j/nv]);}
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,b=a+nv+1;idx.push(...(extra.flip?[a,a+1,b,a+1,b+1,b]:[a,b,a+1,a+1,b,b+1]));}
  return this.mesh(parent,v,idx,material,{...extra,uv});
 }
 quad(parent,a,b,c,d,material,extra={}){return this.mesh(parent,[a,b,c,d],[0,1,2,0,2,3],material,{uv:[[0,0],[1,0],[1,1],[0,1]],...extra});}
 curve(parent,points,radius,material,extra={}){return this.add(parent,{type:'tube',points,radius,segments:Math.min(160,Math.max(12,points.length*4))},material,[0,0,0],[0,0,0],extra);}
 rounded(parent,size,radius,position,material,extra={}){
  const half=size.map(x=>x/2),core=half.map(x=>Math.max(0,x-radius)),vertices=[],indices=[],N=5;
  // Six independently wound faces, projected onto a rounded box.
  for(const axis of [0,1,2])for(const sign of [-1,1]){const base=vertices.length,other=[0,1,2].filter(x=>x!==axis);for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){
    const q=[0,0,0];q[axis]=sign*half[axis];q[other[0]]=(2*i/N-1)*half[other[0]];q[other[1]]=(2*j/N-1)*half[other[1]];
    const anchor=q.map((v,k)=>Math.max(-core[k],Math.min(core[k],v))),d=q.map((v,k)=>v-anchor[k]),len=Math.hypot(...d)||1;vertices.push(anchor.map((v,k)=>v+d[k]/len*radius));
   }for(let i=0;i<N;i++)for(let j=0;j<N;j++){const a=base+i*(N+1)+j,b=a+N+1;const forward=(axis===1?-1:1)*sign>0;indices.push(...(forward?[a,b,a+1,a+1,b,b+1]:[a,a+1,b,a+1,b+1,b]));}}
  return this.add(parent,{type:'mesh',vertices:vertices.flat(),indices},material,position,extra.rotation||[0,0,0],extra);
 }
}
export function interpolateProfile(rows,z){
 if(z<=rows[0][0])return rows[0].slice(1);if(z>=rows.at(-1)[0])return rows.at(-1).slice(1);
 const i=rows.findIndex(r=>r[0]>=z),a=rows[i-1],b=rows[i],u=(z-a[0])/(b[0]-a[0]),s=u*u*(3-2*u);return a.slice(1).map((v,k)=>v+(b[k+1]-v)*s);
}
export function bezier(a,b,c,d,count=24){return Array.from({length:count+1},(_,i)=>{const t=i/count,s=1-t;return a.map((v,k)=>s*s*s*v+3*s*s*t*b[k]+3*s*t*t*c[k]+t*t*t*d[k]);});}
export function cameraOrbit({target=[0,.7,0],radius=6,height=2,start=0,end=Math.PI,duration=4,steps=12}){
 const points=Array.from({length:steps+1},(_,i)=>{const u=i/steps,a=start+(end-start)*u;return {at:duration*u,position:[target[0]+Math.sin(a)*radius,height,target[2]+Math.cos(a)*radius],target:[...target],ease:'linear'};});
 return {position:points[0].position,target,fov:40,keyframes:points.slice(1)};
}
