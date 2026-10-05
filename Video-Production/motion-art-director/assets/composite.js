/* Generated art remains immutable; SVG composes camera, editable type and traced cuts. */
(function(){
const p=window.PROJECT,portrait=window.PORTRAIT,W=portrait?1080:1920,H=portrait?1920:1080;
const svg=document.getElementById('stage'),art=window.ART_DATA||{};
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);},lerp=(a,b,t)=>a+(b-a)*t;
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function image(id,opacity=1){return '<use href="#art-'+id+'" opacity="'+opacity+'" mask="url(#plate-edge)"/>';}
const frontRight='695,723 741,577 822,332 901,232 1133,72 1339,12 1328,159 1298,253 1021,647 951,735 901,785 790,757';
const frontLeft='164,811 185,722 226,651 478,503 649,421 714,408 818,509 809,603 736,726 630,817 507,891 355,900 260,881';
const map='scale('+(1920/1672)+' '+(1080/941)+')';
let defs=Object.entries(art).map(([id,a])=>'<symbol id="art-'+id+'" viewBox="0 0 1920 1080"><image data-asset="'+id+'" href="'+a.uri+'" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/></symbol>').join('');
defs+='<linearGradient id="plate-edge-gradient"><stop stop-color="black"/><stop offset=".06" stop-color="white"/><stop offset=".94" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient><mask id="plate-edge"><rect width="1920" height="1080" fill="url(#plate-edge-gradient)"/></mask><clipPath id="solar-circle"><circle cx="960" cy="540" r="430"/></clipPath>';
defs+='<clipPath id="canvas"><rect width="'+W+'" height="'+H+'"/></clipPath><clipPath id="crystal-front"><polygon transform="'+map+'" points="'+frontLeft+'"/><polygon transform="'+map+'" points="'+frontRight+'"/></clipPath><mask id="chrome-ring"><rect width="1920" height="1080" fill="black"/><path d="M316 326 C498 171 704 75 935 50 C1233 82 1449 276 1572 411 L1544 472 C1384 308 1144 183 921 194 C699 181 566 278 591 453 C614 662 927 733 1114 718 C1308 703 1409 629 1461 551 L1558 569 C1500 858 1087 1010 775 960 C459 909 264 770 288 530Z" fill="white"/><ellipse cx="1570" cy="239" rx="64" ry="63" fill="white"/><ellipse cx="355" cy="768" rx="58" ry="46" fill="white"/></mask><filter id="smoke-density" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .9 .9 .9 0 -.10"/></filter><mask id="smoke-matte"><use href="#art-gas" filter="url(#smoke-density)"/></mask><linearGradient id="fade-bottom" x2="0" y2="1"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>';
svg.innerHTML='<defs>'+defs+'</defs><g id="composite-frame" clip-path="url(#canvas)"></g>';
const frameNode=document.getElementById('composite-frame');
function camera(scale,x=0,y=0,rotate=0){return 'translate('+(960+x)+' '+(540+y)+') rotate('+rotate+') scale('+scale+') translate(-960 -540)';}
function title(word,u,{size=350,y=655,color='#edece7',opacity=1}={}){return '<g opacity="'+opacity+'" transform="translate(0 '+lerp(34,0,smooth(u/.22))+')"><text x="960" y="'+y+'" text-anchor="middle" font-family="Bodoni" font-weight="400" font-size="'+size+'" letter-spacing="-8" fill="'+color+'">'+esc(word)+'</text></g>';}
function authored(s,t){
 const c=portrait?(s.portrait_composition||s.composition):s.composition;
 function state(l){let v={x:l.x||0,y:l.y||0,scale:l.scale??1,rotation:l.rotation||0,opacity:l.opacity??1};const keys=l.keyframes||[];if(!keys.length)return v;const a=[...keys].reverse().find(k=>k.at<=t)||keys[0],b=keys.find(k=>k.at>t)||a,u=a===b?0:(t-a.at)/(b.at-a.at);for(const k of ['x','y','scale','rotation','opacity'])v[k]=lerp(a[k]??v[k],b[k]??a[k]??v[k],smooth(u));return v;}
 const bw=c.width||1920,bh=c.height||1080,fit=Math.min(W/bw,H/bh),ox=(W-bw*fit)/2,oy=(H-bh*fit)/2;
 let d='',out='<rect width="'+W+'" height="'+H+'" fill="'+esc(c.background||'#050609')+'"/>';
 out+='<g transform="translate('+ox+' '+oy+') scale('+fit+')">';
 for(const [i,l] of c.layers.entries()){
  const v=state(l),r=l.rect||[0,0,bw,bh],clip=l.clip_path&&(!l.motion||l.motion.preset==='none')?' clip-path="url(#layer-clip-'+i+')"':'';
  if(l.clip_path)d+='<clipPath id="layer-clip-'+i+'"><path d="'+esc(l.clip_path)+'"/></clipPath>';
  out+='<g opacity="'+v.opacity+'" transform="translate('+v.x+' '+v.y+') rotate('+v.rotation+' '+(l.pivot?.[0]??bw/2)+' '+(l.pivot?.[1]??bh/2)+') translate('+(l.pivot?.[0]??bw/2)+' '+(l.pivot?.[1]??bh/2)+') scale('+v.scale+') translate('+(-(l.pivot?.[0]??bw/2))+' '+(-(l.pivot?.[1]??bh/2))+')" style="mix-blend-mode:'+esc(l.blend||'normal')+'"><g'+clip+'>';
  if(l.kind==='image'&&l.motion&&l.motion.preset!=='none'){out+='<image data-asset="'+esc(l.asset_id)+'" data-derived="cpu-material-flow-v2" href="'+window.__flowImage(l.asset_id,t,l.motion,l.clip_path,r)+'" x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'"/>';}else if(l.kind==='image')out+='<use href="#art-'+esc(l.asset_id)+'" x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'"/>';
  else{const text=l.content_id?p.content_units.find(c=>c.content_id===l.content_id)?.display_text:l.text;out+='<text '+(l.content_id?'data-copy="true" ':'')+'x="'+(l.position?.[0]??bw/2)+'" y="'+(l.position?.[1]??bh/2)+'" text-anchor="'+esc(l.align||'middle')+'" font-family="'+esc(l.font||'Pretendard')+'" font-size="'+(l.size||60)+'" font-weight="'+(l.weight||400)+'" fill="'+esc(l.color||'#f4efe5')+'" letter-spacing="'+(l.tracking||0)+'">'+esc(text||'')+'</text>';}
  out+='</g></g>';
 }
 return '<defs>'+d+'</defs>'+out+'</g>';
}
function scene(s,t,d){const u=t/d,enter=smooth(t/.65),end=1-smooth((t-(d-.4))/.4),alpha=Math.min(enter,end),i=p.scenes.indexOf(s);let body='';
 if(s.composition)return authored(s,t);
 if(s.mode==='crystal'){
  const scale=lerp(1.28,.84,smooth(u/.85)),x=lerp(-40,20,u),y=lerp(22,-10,u);
  body='<g transform="'+camera(scale*.96,x*.4,y*.4,-.8*u)+'">'+image('crystal-rear')+'</g>'+title(s.hero||'SOLID',u,{size:390,y:676})+'<g transform="'+camera(scale,x,y,1.3*u)+'"><g clip-path="url(#crystal-front)">'+image('crystal')+'</g></g>';
 }else if(s.mode==='liquid'){
  const scale=lerp(.88,1.08,smooth(u)),x=Math.sin(u*Math.PI)*24;
  body='<g transform="'+camera(scale,x,0,-2+4*u)+'">'+image('liquid')+'</g>'+title(s.hero||'LIQUID',u,{size:355,y:658})+'<g transform="'+camera(scale,x,0,-2+4*u)+'" mask="url(#chrome-ring)">'+image('liquid')+'</g>';
 }else if(s.mode==='smoke'){
  const scale=lerp(1.02,1.28,smooth(u)),x=lerp(75,-70,u);
  body='<g transform="'+camera(scale,x,lerp(18,-22,u))+'">'+image('gas')+'</g>'+title(s.hero||'GAS',u,{size:440,y:656,opacity:.95})+'<g transform="'+camera(scale,x,lerp(18,-22,u))+'" mask="url(#smoke-matte)">'+image('gas')+'</g>';
 }else{
  const endPull=smooth((t-(d-2.4))/2.1),zoom=lerp(1.45,1.02,smooth(u));
  const texture='<g transform="'+camera(zoom,lerp(-80,65,u),lerp(30,-20,u))+'">'+image('plasma')+'</g>'+title(s.hero||'PLASMA',u,{size:330,y:650,color:'#fff3d1',opacity:.65});
  let stars='';for(let j=0;j<78;j++){const x=(j*641+123)%1920,y=(j*347+187)%1080;stars+='<circle cx="'+x+'" cy="'+y+'" r="'+(j%4===0?1.8:.9)+'" fill="#fff" opacity="'+(.15+(j%8)/14)+'"/>';}
  body='<g opacity="'+(1-endPull)+'">'+texture+'</g><g opacity="'+endPull+'"><rect width="1920" height="1080" fill="#04050b"/>'+stars+'<circle cx="960" cy="500" r="'+lerp(420,58,endPull)+'" fill="#f2b75a"/><g transform="translate(960 500) scale('+lerp(1.4,.062,endPull)+') translate(-960 -540)" clip-path="url(#solar-circle)"><circle cx="960" cy="540" r="430" fill="#d97c32"/>'+image('plasma')+'</g><text x="960" y="'+lerp(720,695,endPull)+'" text-anchor="middle" font-family="Bodoni" font-size="'+lerp(90,120,endPull)+'" fill="#f5efe3">'+esc(p.end_title||'MATTER')+'</text></g>';
 }
 const copy=s.content_ids.map(id=>p.content_units.find(c=>c.content_id===id)?.display_text||'').join(' '),copyAlpha=smooth((t-.55)/.6)*Math.min(1,(d-t)/.45);
 const scale=portrait?.56:1,px=portrait?-W*.0:0,py=portrait?H*.26:0;
 let result='<rect width="'+W+'" height="'+H+'" fill="'+(s.mode==='smoke'?'#0b030b':'#03070c')+'"/><g opacity="'+alpha+'" transform="translate('+px+' '+py+') scale('+scale+')">'+body+'</g>';
 result+='<rect width="'+W+'" height="'+H+'" fill="url(#fade-bottom)"/><text data-copy="true" x="'+W/2+'" y="'+(portrait?H*.83:970)+'" text-anchor="middle" font-family="Pretendard" font-size="'+(portrait?48:32)+'" font-weight="400" letter-spacing="2" opacity="'+copyAlpha+'" fill="#f3eee7">'+esc(copy)+'</text>';
 result+='<rect width="'+W+'" height="'+(portrait?92:56)+'" fill="#020304"/><rect y="'+(H-(portrait?88:55))+'" width="'+W+'" height="'+(portrait?88:55)+'" fill="#020304"/><text x="52" y="'+(portrait?55:35)+'" fill="#aeb8bd" font-family="Pretendard" font-size="'+(portrait?17:14)+'" letter-spacing="3">'+esc(p.label||'STATES OF MATTER')+'</text><text x="'+(W-52)+'" y="'+(portrait?55:35)+'" text-anchor="end" fill="#aeb8bd" font-family="Pretendard" font-size="14" letter-spacing="2">'+String(i+1).padStart(2,'0')+' / '+String(p.scenes.length).padStart(2,'0')+'</text><path d="M52 '+(H-26)+' H'+(W-52)+'" stroke="#697274" stroke-opacity=".35"/><path d="M52 '+(H-26)+' H'+(52+(W-104)*(s.start+t*30)/p.output.total_frames)+'" stroke="#d4cfb9"/>';
 return result;
}
window.__compositeRender=sec=>{const frame=Math.min(p.output.total_frames-1,Math.max(0,Math.floor(sec*30+1e-5))),s=p.scenes.find(s=>frame>=s.start&&frame<s.end)||p.scenes.at(-1);frameNode.innerHTML=scene(s,(frame-s.start)/30,(s.end-s.start)/30);window.__state={frame,scene:s.id,time:frame/30,renderer:'image-composite'};return window.__state;};
window.__artReady=Promise.all(Object.values(art).map(a=>{const img=new Image();img.src=a.uri;return img.decode().then(()=>{if(img.naturalWidth!==a.width||img.naturalHeight!==a.height)throw new Error('Image geometry mismatch');});}));
})();
