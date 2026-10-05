/* Experimental CPU-only material flow. Source art is immutable. Absolute time, no feedback. */
(function(){
const p=window.PROJECT,art=window.ART_DATA,canvases=new Map(),source=new Map(),cols=28,rows=16,CW=960,CH=540;
const clamp=x=>Math.max(0,Math.min(1,x));
function strength(u,v,opt){const r=opt.region||[0,0,1,1];let weight=opt.intensity??1;if(u<r[0]||u>r[0]+r[2]||v<r[1]||v>r[1]+r[3])return 0;if(opt.region)weight*=Math.sin(Math.PI*(u-r[0])/r[2])*Math.sin(Math.PI*(v-r[1])/r[3]);for(const pin of opt.pins||[])weight*=clamp(Math.hypot(u-pin[0],v-pin[1])/pin[2]);return weight;}
const imageReady=Promise.all(Object.entries(art).map(async([id,a])=>{const img=new Image();img.src=a.uri;await img.decode();const c=document.createElement('canvas');c.width=CW;c.height=CH;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,CW,CH);source.set(id,{canvas:c,pixels:ctx.getImageData(0,0,CW,CH)});const dest=document.createElement('canvas');dest.width=CW;dest.height=CH;canvases.set(id,dest);}));
window.__artReady=Promise.all([window.__artReady,imageReady]);
function field(x,y,t,mode){const u=x/CW,v=y/CH;let xx=u,yy=v;const taper=Math.pow(Math.sin(Math.PI*u)*Math.sin(Math.PI*v),.7);
 if(mode==='smoke'){
  for(const [cx,cy,r,rate,phase] of [[.28,.35,.33,.72,0],[.65,.58,.32,-.86,.4],[.81,.25,.23,1.08,1.2]]){const dx=xx-cx,dy=yy-cy,weight=Math.exp(-(dx*dx+dy*dy)/(r*r)),angle=.8*(Math.sin(t*rate+phase)-Math.sin(phase))*weight*taper;xx=cx+dx*Math.cos(angle)-dy*Math.sin(angle);yy=cy+dx*Math.sin(angle)+dy*Math.cos(angle);}
  xx+=.026*taper*(Math.sin(v*11-t*1.05)-Math.sin(v*11));yy+=.036*taper*(Math.sin(u*10-t*.76)-Math.sin(u*10));
 }else if(mode==='liquid'){
  xx+=.055*taper*(Math.sin(v*9-t*1.15)-Math.sin(v*9));yy+=.06*taper*(Math.sin(u*8-t*.93)-Math.sin(u*8));
  const dx=xx-.5,dy=yy-.5,a=.12*Math.sin(t*.9)*Math.exp(-Math.hypot(dx,dy)*2);xx=.5+dx*Math.cos(a)-dy*Math.sin(a);yy=.5+dx*Math.sin(a)+dy*Math.cos(a);
 }else{
  xx+=.04*taper*(Math.sin(v*20+u*8-t*1.8)-Math.sin(v*20+u*8));yy+=.038*taper*(Math.sin(u*21-v*7-t*1.3)-Math.sin(u*21-v*7));
 }
 return [xx*CW,yy*CH];
}
function triangle(ctx,img,s,d){const [s0,s1,s2]=s,[d0,d1,d2]=d,ux=s1[0]-s0[0],uy=s1[1]-s0[1],vx=s2[0]-s0[0],vy=s2[1]-s0[1],det=ux*vy-uy*vx,dx1=d1[0]-d0[0],dy1=d1[1]-d0[1],dx2=d2[0]-d0[0],dy2=d2[1]-d0[1],a=(dx1*vy-dx2*uy)/det,c=(dx2*ux-dx1*vx)/det,b=(dy1*vy-dy2*uy)/det,f=(dy2*ux-dy1*vx)/det;
 const cx=(d0[0]+d1[0]+d2[0])/3,cy=(d0[1]+d1[1]+d2[1])/3;ctx.save();ctx.beginPath();d.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x+(x-cx)*.025,y+(y-cy)*.025));ctx.closePath();ctx.clip();ctx.setTransform(a,b,c,f,d0[0]-a*s0[0]-c*s0[1],d0[1]-b*s0[0]-f*s0[1]);ctx.drawImage(img,0,0);ctx.restore();
}
function renderFlow(id,t,mode,opt={}){const c=canvases.get(id),src=source.get(id);if(!src||!c)throw new Error('Flow source not decoded');const ctx=c.getContext('2d');t*=opt.speed??1;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,CW,CH);
 if(mode==='crystal'){
  const pixels=new ImageData(new Uint8ClampedArray(src.pixels.data),CW,CH),d=pixels.data,center=(.15+(Math.sin(t*.9)*.5+.5)*.7)*CW;
  for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=(y*CW+x)*4,l=(d[i]+d[i+1]+d[i+2])/765,band=Math.exp(-Math.pow((x+.2*y-center)/95,2)),gain=1+1.3*band*l*strength(x/CW,y/CH,opt);d[i]*=gain;d[i+1]*=gain;d[i+2]*=gain;}ctx.putImageData(pixels,0,0);
 }else{
  const grid=[];for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const s=[i*CW/cols,j*CH/rows],target=field(...s,t,mode),u=i/cols,v=j/rows,r=opt.region||[0,0,1,1];let weight=opt.intensity??1;if(u<r[0]||u>r[0]+r[2]||v<r[1]||v>r[1]+r[3])weight=0;else if(opt.region)weight*=Math.sin(Math.PI*(u-r[0])/r[2])*Math.sin(Math.PI*(v-r[1])/r[3]);for(const pin of opt.pins||[])weight*=clamp(Math.hypot(u-pin[0],v-pin[1])/pin[2]);grid.push({s,d:s.map((x,k)=>x+(target[k]-x)*weight)});}
  const area=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);let corrections=0;for(;corrections<20;corrections++){let valid=true;for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*(cols+1)+i,a=grid[k],b=grid[k+1],d=grid[k+cols+1],e=grid[k+cols+2];if(area(a.d,b.d,d.d)<5||area(b.d,e.d,d.d)<5)valid=false;}if(valid)break;for(const point of grid)point.d=point.d.map((v,i)=>(v+point.s[i])/2);}window.__flowStats={triangles:896,foldover:false,corrections};
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*(cols+1)+i,a=grid[k],b=grid[k+1],d=grid[k+cols+1],e=grid[k+cols+2];triangle(ctx,src.canvas,[a.s,b.s,d.s],[a.d,b.d,d.d]);triangle(ctx,src.canvas,[b.s,e.s,d.s],[b.d,e.d,d.d]);}
 }
 const uri=c.toDataURL('image/png');if(!opt.detached){const n=document.querySelector('#art-'+id+' image');if(n){n.setAttribute('href',uri);n.dataset.derived='cpu-material-flow-v2';}}return uri;
}
window.__flowImage=(id,t,motion,clip=null,rect=[0,0,1920,1080])=>{let key=id;if(clip){key=JSON.stringify([id,clip,rect]);if(!source.has(key)){const c=document.createElement('canvas');c.width=CW;c.height=CH;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.save();ctx.scale(CW/rect[2],CH/rect[3]);ctx.translate(-rect[0],-rect[1]);ctx.clip(new Path2D(clip));ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(source.get(id).canvas,0,0);ctx.restore();source.set(key,{canvas:c,pixels:ctx.getImageData(0,0,CW,CH)});const dest=document.createElement('canvas');dest.width=CW;dest.height=CH;canvases.set(key,dest);}}return renderFlow(key,t,motion.preset==='metal'?'liquid':motion.preset,{...motion,detached:true});};
const original=window.__compositeRender;
const chromePath=document.querySelector('#chrome-ring path')?.getAttribute('d');
window.__compositeRender=sec=>{const f=Math.min(p.output.total_frames-1,Math.max(0,Math.floor(sec*30+1e-5))),s=p.scenes.find(s=>f>=s.start&&f<s.end)||p.scenes.at(-1),t=(f-s.start)/30;
 if(s.composition||!p.material_flow)return original(sec);
 const id={crystal:'crystal',liquid:'liquid',smoke:'gas',star:'plasma'}[s.mode];renderFlow(id,t,s.mode==='star'?'plasma':s.mode);if(s.mode==='crystal'&&!p.flow_preview)renderFlow('crystal-rear',t,'crystal');
 if(s.mode==='liquid'&&chromePath){const mask=document.getElementById('chrome-ring');mask.setAttribute('style','mask-type:alpha');mask.innerHTML='<image data-asset="liquid" data-derived="cpu-material-flow-v2" width="1920" height="1080" href="'+window.__flowImage('liquid',t,{preset:'metal'},chromePath)+'"/>';}
 if(!p.flow_preview)return original(sec);
 const frame=document.getElementById('composite-frame');if(!document.getElementById('still-'+id)){const defs=document.querySelector('#stage>defs'),n=document.createElementNS('http://www.w3.org/2000/svg','symbol');n.id='still-'+id;n.setAttribute('viewBox','0 0 1920 1080');n.innerHTML='<image data-asset="'+id+'" href="'+art[id].uri+'" width="1920" height="1080"/>';defs.append(n);}
 const name={crystal:'결정 · 이동하는 반사',liquid:'금속 · 윤곽과 표면',smoke:'연기 · 국소 소용돌이',star:'플라즈마 · 내부 열 흐름'}[s.mode];
 frame.innerHTML='<rect width="1920" height="1080" fill="#030509"/><text x="64" y="80" fill="#f6efe4" font-size="34" font-family="Pretendard">'+name+'</text><svg x="32" y="175" width="920" height="640" viewBox="0 0 1920 1080"><use href="#still-'+id+'"/></svg><svg x="968" y="175" width="920" height="640" viewBox="0 0 1920 1080"><use href="#art-'+id+'"/></svg><text x="490" y="925" text-anchor="middle" fill="#bbc3c7" font-family="Pretendard" font-size="30">정지 원화</text><text x="1430" y="925" text-anchor="middle" fill="#eee4cf" font-family="Pretendard" font-size="30">내부 움직임 · CPU 2D 시험</text><path d="M64 1010 H1856" stroke="#435057"/><path d="M64 1010 H'+(64+1792*f/p.output.total_frames)+'" stroke="#d8c291"/>';
 window.__state={frame:f,scene:s.id,time:f/30,renderer:'image-composite',materialFlow:'cpu-v1',warpPixels:[CW,CH],triangles:cols*rows*2};return window.__state;
};
})();
