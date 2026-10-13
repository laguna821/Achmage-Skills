/* Selective Showreel adaptations, MIT; see vendor/showreel/NOTICE.md.
 * SVG output is evaluated from absolute time; no external resources or frame history. */
(function (global) {
 'use strict';
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), mix=(a,b,u)=>a+(b-a)*u;
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=x=>Number(x.toFixed(4));
 const rnd=(i,seed)=>{let n=(i+1)^seed;n=Math.imul(n^(n>>>16),0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return ((n^(n>>>16))>>>0)/4294967296;};
 const specs={
  'odometer':['T12','기계식 카운터','data','low'],
  'data-continuity':['T11','연속 데이터 도해','data','low'],
  'device-ui':['T14','기기 UI와 공유 카드','ui','low'],
  'particle-transfer':['T13','형상 입자 인계','transitions','medium'],
  'jamo-assembly':['T05','한글 영역 조립','type','low'],
  'weight-wave':['T06','활자 굵기 파동','type','low'],
  'chrome-type':['T08','크롬 활자','type','medium'],
  'glyph-particles':['T04','활자 입자 재구성','type','medium'],
  'day-night':['T02','낮과 밤의 조명','texture','low'],
  'isometric':['T01','아이소메트릭 공간','depth','medium'],
  'tilt-shift':['T03','국소 초점','depth','medium'],
  'prism':['T09','프리즘 하이라이트','texture','low'],
  'beat-grid':['T10','음악 사건 그리드','generative','medium'],
  'dither':['T21','고정 디더','texture','low'],
  'audio-reactive':['engine:envelope','음량 반응','emphasis','low'],
  'precomputed-fragments':['engine:simulation','사전 계산 조각','generative','medium']
 };
 function check(e) {
  const errors=[],ok=(v,m)=>{if(!v)errors.push(m);},p=e?.parameters||{},i=e?.inputs||{};
  ok(e?.version===1,'extension version must be 1');ok(!!specs[e?.type],'unknown extension');
  ok(Number.isFinite(e?.duration)&&e.duration>0&&e.duration<=180,'duration must be 0..180 seconds');
  ok(Number.isInteger(e?.seed),'integer seed required');
  for(const k of ['color','background','accent'])ok(p[k]===undefined||/^#[0-9a-f]{6}$/i.test(p[k]),k+' must be hex');
  for(const k of ['x','y','width','height','size','amount','angle'])ok(p[k]===undefined||Number.isFinite(p[k]),'finite '+k+' required');
  for(const k of ['width','height','size'])ok(p[k]===undefined||p[k]>0&&p[k]<=4096,'positive bounded '+k+' required');
  if(['jamo-assembly','weight-wave','chrome-type','glyph-particles'].includes(e?.type))ok(typeof i.text==='string'&&i.text.length>0&&Array.from(i.text).length<=32,'1..32 text characters required');
  if(e?.type==='odometer'){ok([i.from,i.to].every(Number.isFinite),'finite counter endpoints required');ok(Math.max(Math.abs(i.from||0),Math.abs(i.to||0))<1e9,'counter magnitude < 1e9');ok(Number.isInteger(i.decimals??0)&&(i.decimals??0)>=0&&(i.decimals??0)<=4,'0..4 decimals');}
  if(e?.type==='data-continuity'){ok(Array.isArray(i.items)&&i.items.length>0&&i.items.length<=12,'1..12 data items required');const a=Array.isArray(i.items)?i.items:[];ok(a.every(x=>x&&typeof x.id==='string'&&typeof x.label==='string'&&Number.isFinite(x.value)&&x.value>=0),'labelled nonnegative data required');ok(new Set(a.map(x=>x?.id)).size===a.length,'unique data identity required');ok(typeof i.unit==='string'&&['actual','hypothetical'].includes(i.basis),'unit and factual basis required');}
  if(e?.type==='device-ui')ok(Array.isArray(i.steps)&&i.steps.length>=2&&i.steps.length<=8&&i.steps.every(x=>typeof x==='string'&&x.length<=60),'2..8 UI states required');
  if(['particle-transfer','glyph-particles'].includes(e?.type)){for(const k of ['from','to'])ok(Array.isArray(i[k])&&i[k].length>0&&i[k].length<=2048&&i[k].every(q=>Array.isArray(q)&&q.length===2&&q.every(Number.isFinite)),'bounded '+k+' points required');ok(i.from?.length===i.to?.length,'matched point counts required');}
  if(e?.type==='isometric')ok(Number.isFinite(p.angle??45)&&(p.angle??45)>0&&(p.angle??45)<90,'isometric angle must be between 0 and 90 degrees');
    if(e?.type==='isometric')ok(Array.isArray(i.boxes)&&i.boxes.length>0&&i.boxes.length<=256&&i.boxes.every(b=>b&&[b.x,b.y,b.z].every(Number.isFinite)&&b.z>=0&&b.z<=20),'bounded unit-grid boxes required');
  if(e?.type==='isometric'&&Array.isArray(i.boxes))ok(new Set(i.boxes.map(b=>b?.x+','+b?.y)).size===i.boxes.length&&i.boxes.every(b=>b&&Number.isInteger(b.x)&&Number.isInteger(b.y)),'nonoverlapping integer cells required');
  if(e?.type==='beat-grid')ok(Array.isArray(i.events)&&i.events.length<=2048&&i.events.every((t,n)=>Number.isFinite(t)&&t>=0&&t<=e.duration&&(n===0||t>i.events[n-1])),'ordered corrected event times required');
  if(e?.type==='audio-reactive')ok(Array.isArray(i.envelope)&&i.envelope.length>1&&i.envelope.length<=36000&&i.envelope.every((q,n)=>Array.isArray(q)&&q.length===2&&q.every(Number.isFinite)&&q[0]>=0&&q[0]<=e.duration&&q[1]>=0&&q[1]<=1&&(n===0||q[0]>i.envelope[n-1][0])),'ordered bounded envelope required');
  if(e?.type==='precomputed-fragments'){const n=i.count??24,rate=i.rate??30;ok(Number.isInteger(n)&&n>=1&&n<=256,'1..256 fragments');ok(Number.isInteger(rate)&&rate>=15&&rate<=120,'15..120 simulation rate');ok(Math.ceil((e.duration+1)*rate)*n*2*4<=64*1024*1024,'simulation exceeds 64MiB');}
  if(e?.type==='chrome-type')ok(Math.abs(p.angle??15)<=30,'chrome angle must be within 30 degrees');
  if(e?.type==='tilt-shift')ok(typeof i.svg==='string'&&i.svg.length<200000&&!/<(?:script|image|feImage|foreignObject|iframe|style)\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)/i.test(i.svg),'safe local SVG subject required');
  return errors;
 }
 function curve(points,t){if(t<=points[0][0])return points[0][1];for(let n=1;n<points.length;n++)if(t<points[n][0])return mix(points[n-1][1],points[n][1],(t-points[n-1][0])/(points[n][0]-points[n-1][0]));return points.at(-1)[1];}
 function regions(ch){const c=ch.charCodeAt(0)-0xac00;if(c<0||c>11171)return [[0,0,1,1]];const v=Math.floor(c%588/28),b=c%28?0.62:1;const a=[0,1,2,3,4,5,6,7,20].includes(v)?[[0,0,.5,b],[.5,0,1,b]]:[9,10,11,14,15,16,19].includes(v)?[[0,0,.55,b*.58],[.55,0,1,b],[0,b*.58,.55,b]]:[[0,0,1,b*.5],[0,b*.5,1,b]];if(b<1)a.push([0,b,1,1]);return a;}
 function lin(v){v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}
 function srgb(v){return Math.round(255*(v<=.0031308?v*12.92:1.055*v**(1/2.4)-.055));}
 function colorMix(a,b,u){return '#'+[1,3,5].map(k=>srgb(mix(lin(parseInt(a.slice(k,k+2),16)),lin(parseInt(b.slice(k,k+2),16)),u)).toString(16).padStart(2,'0')).join('');}
 const simulations=new Map();let simulationBytes=0;
 function simulation(e){const key=JSON.stringify(e);if(simulations.has(key))return simulations.get(key);const n=e.inputs.count??24,rate=e.inputs.rate??30,frames=Math.ceil(e.duration*rate)+1,bytes=frames*n*2*4;if(bytes>64*1024*1024)throw Error('simulation exceeds 64MiB');while(simulationBytes+bytes>64*1024*1024&&simulations.size){const k=simulations.keys().next().value;simulationBytes-=simulations.get(k).data.byteLength;simulations.delete(k);}const data=new Float32Array(frames*n*2),state=Array.from({length:n},(_,j)=>[180+rnd(j,e.seed)*1500,50+rnd(j,e.seed+1)*160,(rnd(j,e.seed+2)-.5)*240,0]);for(let f=0;f<frames;f++)for(let j=0;j<n;j++){const q=state[j];data[(f*n+j)*2]=q[0];data[(f*n+j)*2+1]=q[1];q[3]+=680/rate;q[0]+=q[2]/rate;q[1]+=q[3]/rate;if(q[1]>900){q[1]=900;q[3]=-Math.abs(q[3])*.52;q[2]*=.8;}}const result={data,n,rate,frames};simulations.set(key,result);simulationBytes+=bytes;return result;}
 function draw(e,t,id='extension') {
  const errors=check(e);if(errors.length)throw Error(errors.join('; '));
  const i=e.inputs||{},p=e.parameters||{},u=smooth(t/e.duration),x=p.x??960,y=p.y??540,w=p.width??1500,h=p.height??760,size=p.size??140,c=p.color||'#dbf0e8',a=p.accent||'#b4e34c';
  id=String(id).replace(/[^a-zA-Z0-9_-]/g,'_');
  const text=(s,xx=x,yy=y,sz=size,fill=c,weight=600)=>'<text x="'+num(xx)+'" y="'+num(yy)+'" font-family="Pretendard" font-size="'+sz+'" font-weight="'+weight+'" text-anchor="middle" fill="'+fill+'">'+esc(s)+'</text>';
  if(e.type==='odometer'){
   const d=i.decimals??0,factor=10**d,v=mix(i.from,i.to,u)*factor,abs=Math.abs(v),digits=Math.max(1,String(Math.floor(Math.max(Math.abs(i.from),Math.abs(i.to))*factor)).length,d+1),gap=size*.68;
   let out='<g font-variant-numeric="tabular-nums">';
   for(let k=0;k<digits;k++){const place=digits-1-k,base=10**place,lo=abs%base,pos=place===0?abs:Math.floor(abs/base)+clamp(lo-(base-1)),r=pos%10,xx=x+(k-(digits-1)/2)*gap+(d&&place<d?gap*.28:0),clip=id+'-'+k;out+='<clipPath id="'+clip+'"><rect x="'+(xx-gap/2)+'" y="'+(y-size*.82)+'" width="'+gap+'" height="'+size+'"/></clipPath><g clip-path="url(#'+clip+')">';for(let j=-1;j<=1;j++){const digit=((Math.floor(r)+j)%10+10)%10;out+=text(digit,xx,y+(j-(r-Math.floor(r)))*size);}out+='</g>';if(d&&place===d)out+=text('.',xx+gap*.65,y,size);}
   if(v<0)out+=text('−',x-(digits+1)*gap/2,y,size);return out+'</g>';
  }
  if(e.type==='data-continuity'){const max=Math.max(1,...i.items.map(q=>q.value)),q=smooth((u-.2)/.7),gap=w/i.items.length;let out='<path d="M'+(x-w/2)+' '+(y+h/2)+'h'+w+'" stroke="'+c+'"/>';const pts=[];i.items.forEach((item,n)=>{const xx=x-w/2+gap*(n+.5),yy=y+h/2-item.value/max*h*.8,bh=Math.max(4,(y+h/2-yy)*(1-q));out+='<g data-item="'+esc(item.id)+'"><rect x="'+(xx-gap*.25)+'" y="'+yy+'" width="'+mix(gap*.5,8,q)+'" height="'+bh+'" rx="4" fill="'+a+'"/><circle cx="'+xx+'" cy="'+yy+'" r="'+(8*q)+'" fill="'+c+'"/>'+text(item.label,xx,y+h/2+50,30)+text(item.value+' '+i.unit,xx,yy-24,28)+'</g>';pts.push([xx,yy]);});return out+'<polyline points="'+pts.map(q=>q.join(',')).join(' ')+'" fill="none" stroke="'+a+'" stroke-width="4" opacity="'+q+'"/>';}
  if(e.type==='device-ui'){const step=Math.min(i.steps.length-1,Math.floor(clamp(t/e.duration)*i.steps.length)),grow=smooth((u-.6)/.4),ww=mix(510,w,grow),hh=mix(720,h,grow);return '<g transform="translate('+x+' '+y+') skewY('+mix(-8,0,grow)+')"><rect x="'+(-ww/2)+'" y="'+(-hh/2)+'" width="'+ww+'" height="'+hh+'" rx="'+mix(42,12,grow)+'" fill="'+(p.background||'#18312f')+'" stroke="'+c+'" stroke-width="3"/><rect x="'+(-ww*.38)+'" y="'+(-hh*.32)+'" width="'+ww*.76+'" height="'+hh*.12+'" rx="12" fill="'+a+'"/>'+text(i.steps[step],0,20,Math.min(size,52))+text((step+1)+' / '+i.steps.length,0,hh*.35,24)+'</g>';}
  if(['particle-transfer','glyph-particles'].includes(e.type)){return i.from.map((q,n)=>{const b=i.to[n],v=smooth(clamp((t/e.duration-n/i.from.length*.12)/.88)),cx=(q[0]+b[0])/2,cy=(q[1]+b[1])/2+(rnd(n,e.seed)-.5)*(p.amount??300),px=(1-v)**2*q[0]+2*(1-v)*v*cx+v*v*b[0],py=(1-v)**2*q[1]+2*(1-v)*v*cy+v*v*b[1];return '<circle cx="'+num(px)+'" cy="'+num(py)+'" r="'+(p.size??3)+'" fill="'+c+'"/>';}).join('');}
  if(e.type==='jamo-assembly'){return Array.from(i.text).map((ch,n)=>{const xx=x+(n-(Array.from(i.text).length-1)/2)*size;return regions(ch).map((r,j)=>{const v=smooth((t/e.duration-n*.015-j*.035)/.6),clip=id+'-'+n+'-'+j;return '<clipPath id="'+clip+'"><rect x="'+(xx-size/2+r[0]*size)+'" y="'+(y-size*.85+r[1]*size)+'" width="'+((r[2]-r[0])*size)+'" height="'+((r[3]-r[1])*size)+'"/></clipPath><g opacity="'+v+'" transform="translate('+((1-v)*(j%2?80:-80))+' '+((1-v)*(j-1)*90)+')"><g clip-path="url(#'+clip+')">'+text(ch,xx,y)+'</g></g>';}).join('');}).join('');}
  if(e.type==='weight-wave')return Array.from(i.text).map((ch,n)=>text(ch,x+(n-(Array.from(i.text).length-1)/2)*size,y,size,c,Math.round(200+650*(.5+.5*Math.sin(t*3-n*.55))))).join('');
  if(e.type==='chrome-type'){let out='<defs><linearGradient id="'+id+'"><stop stop-color="#101b2a"/><stop offset="'+(.3+.1*Math.sin(t))+'" stop-color="#f6faff"/><stop offset=".58" stop-color="#53647d"/><stop offset=".8" stop-color="#e3edff"/><stop offset="1" stop-color="#15253d"/></linearGradient></defs>';for(let n=12;n>0;n--)out+=text(i.text,x+n*(p.angle??15)/30,y+n,size,'#263849',800);return out+text(i.text,x,y,size,'url(#'+id+')',800);}
  if(e.type==='day-night'){const sky=colorMix('#c6e4f0','#071327',u),horizon=colorMix('#f4d9a5','#172948',u);return '<defs><linearGradient id="'+id+'" x2="0" y2="1"><stop stop-color="'+sky+'"/><stop offset="1" stop-color="'+horizon+'"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#'+id+')"/><circle cx="'+mix(350,1600,u)+'" cy="'+mix(200,1030,u)+'" r="90" fill="'+colorMix('#fff5ce','#e98759',u)+'"/>';}
  if(e.type==='isometric'){const az=(p.angle??45)*Math.PI/180,cs=Math.cos(az),sn=Math.sin(az),scale=p.size??85,pr=(xx,yy,z)=>[x+(xx*cs-yy*sn)*scale,y+(xx*sn+yy*cs)*scale*.577-z*scale*.816];return [...i.boxes].sort((a,b)=>(a.x*sn+a.y*cs)-(b.x*sn+b.y*cs)).map((b,n)=>{const z=b.z*smooth((t/e.duration-n/i.boxes.length*.25)/.5),poly=(pts,fill)=>'<polygon points="'+pts.map(q=>pr(...q).join(',')).join(' ')+'" fill="'+fill+'" stroke="'+fill+'" stroke-width=".6"/>';return poly([[b.x,b.y+1,0],[b.x+1,b.y+1,0],[b.x+1,b.y+1,z],[b.x,b.y+1,z]],'#264e50')+poly([[b.x+1,b.y,0],[b.x+1,b.y+1,0],[b.x+1,b.y+1,z],[b.x+1,b.y,z]],'#376f6a')+poly([[b.x,b.y,z],[b.x+1,b.y,z],[b.x+1,b.y+1,z],[b.x,b.y+1,z]],a);}).join('');}
  if(e.type==='tilt-shift'){const top=id+'-top',bottom=id+'-bottom',center=id+'-center',blur=id+'-blur';return '<defs><filter id="'+blur+'" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="4"/></filter><clipPath id="'+top+'"><rect width="1920" height="238"/></clipPath><clipPath id="'+bottom+'"><rect y="886" width="1920" height="194"/></clipPath><clipPath id="'+center+'"><rect y="238" width="1920" height="648"/></clipPath></defs><g clip-path="url(#'+center+')">'+i.svg+'</g><g clip-path="url(#'+top+')"><g filter="url(#'+blur+')">'+i.svg+'</g></g><g clip-path="url(#'+bottom+')"><g filter="url(#'+blur+')">'+i.svg+'</g></g>';}
  if(e.type==='prism'){const xx=mix(-w/2,w/2,u)+x;return Array.from({length:12},(_,n)=>'<path d="M'+(xx-350)+' '+(y+(n-6)*2)+'h700" stroke="hsl('+n*26+',90%,70%)" opacity=".18" stroke-width="2"/>').join('')+'<path d="M'+(xx-130)+' '+y+'h260" stroke="white" stroke-width="3"/>';}
  if(e.type==='beat-grid'){return Array.from({length:96},(_,n)=>{const col=n%12,row=Math.floor(n/12),delay=rnd(n,e.seed)*.14,tt=t-delay,ev=i.events.filter(q=>q<=tt).at(-1),pulse=ev===undefined?0:Math.exp(-(tt-ev)*10),cx=x-w/2+(col+.5)*w/12,cy=y-h/2+(row+.5)*h/8;return '<rect x="'+(-w/30)+'" y="'+(-h/22)+'" width="'+w/15+'" height="'+h/11+'" rx="'+(n%3?4:22)+'" fill="'+(n%5?a:c)+'" transform="translate('+cx+' '+cy+') rotate('+pulse*30+') scale('+(1+pulse*.12)+')"/>';}).join('');}
  if(e.type==='dither')return '<defs><pattern id="'+id+'" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h2v2H0zM2 2h2v2H2z" fill="#fff" opacity=".012"/><path d="M2 0h2v2H2zM0 2h2v2H0z" fill="#000" opacity=".012"/></pattern></defs><rect width="1920" height="1080" fill="url(#'+id+')"/>';
  if(e.type==='audio-reactive'){const q=curve(i.envelope,t);return '<circle cx="'+x+'" cy="'+y+'" r="'+(size*(1+q*.15))+'" fill="none" stroke="'+a+'" stroke-width="'+(2+q*12)+'"/>';}
  if(e.type==='precomputed-fragments'){const s=simulation(e),f=clamp(t*s.rate,0,s.frames-1),lo=Math.floor(f),hi=Math.min(s.frames-1,lo+1);return Array.from({length:s.n},(_,n)=>{const xx=mix(s.data[(lo*s.n+n)*2],s.data[(hi*s.n+n)*2],f-lo),yy=mix(s.data[(lo*s.n+n)*2+1],s.data[(hi*s.n+n)*2+1],f-lo);return '<rect x="'+xx+'" y="'+yy+'" width="22" height="14" rx="2" fill="'+a+'"/>';}).join('');}
  return '';
 }
 global.MAD_EXT={specs,check,draw,regions,colorMix,simulation};
})(globalThis);
