import {escape,hash} from './io.mjs';
const specs=[
 ['overlapping-action','principles','subject'],['symmetric-panel-open','entrance','subject'],['pulse','emphasis','subject'],['split-flap','type','text'],['crossfade','transitions','transition'],['pan','camera','subject'],['bar-grow','data','values'],['cursor-click','ui','point'],['progressive-disclosure','explainer','subject'],['piece-assembly','shape','subject'],['crt-scanlines','texture','field'],['particle-burst','generative','field'],['deep-parallax','depth','subject'],['breathing-loop','loop','subject'],['lower-third-reveal','caption','text']
];
export const TECHNIQUES=Object.fromEntries(specs.map(([id,family,input])=>[id,{id,card_id:id,family,input,engines:['chromium'],renderers:['vector-composite','hybrid-composite'],outputs:['time','scroll','still'],parameters:{duration:{min:.25,max:30},amount:{min:0,max:2000},color:'CSS hex',seed:'integer'},implementation:'executable',automated_review:'pending',aesthetic_review:'pending'}]));
TECHNIQUES.crossfade.engines=['ffmpeg'];TECHNIQUES.crossfade.renderers=['hybrid-composite'];
const copy=x=>structuredClone(x);
function random(seed){let n=seed|0;return()=>{n=Math.imul(1664525,n)+1013904223|0;return(n>>>0)/4294967296;};}
export function technique({id,instance,inputs={},parameters={}}){
 const spec=TECHNIQUES[id];if(!spec)throw Error('Unknown technique adapter '+id);if(!/^[a-z0-9-]+$/.test(instance||''))throw Error('Technique instance identity required');
 const {duration=1,amount=120,color='#b4efff',seed=1}=parameters;
 if(!Number.isFinite(duration)||duration<.25||duration>30||!Number.isFinite(amount)||amount<0||amount>2000||!/^#[a-f0-9]{6}$/i.test(color)||!Number.isInteger(seed))throw Error('Invalid adapter parameters');
 let layers=[],transition;
 const subjects=()=>{if(!Array.isArray(inputs.layers)||!inputs.layers.length||inputs.layers.some(l=>!['svg','text'].includes(l.kind)))throw Error(id+' requires editable svg/text subjects');return inputs.layers.map((l,i)=>({...copy(l),id:instance+'-'+i}));};
 const tween=(l,from,to,at=duration)=>({...l,...from,keyframes:[{at,...to,ease:'smooth'}]});
 if(id==='crossfade')transition={kind:'fade',duration:Math.round(duration*30)/30};
 else if(id==='overlapping-action')layers=subjects().map((l,i)=>({...l,x:-amount,keyframes:[{at:i*.07+.001,x:-amount,ease:'hold'},{at:duration+i*.07,x:0,ease:'out'}]}));
 else if(id==='symmetric-panel-open')layers=subjects().map((l,i)=>tween(l,{x:(i%2?1:-1)*amount,opacity:0},{x:0,opacity:1}));
 else if(id==='pulse')layers=subjects().map(l=>({...l,scale:1,keyframes:[{at:duration*.4,scale:1.12},{at:duration,scale:1}]}));
 else if(id==='pan')layers=subjects().map(l=>({...l,x:0,keyframes:[{at:duration,x:-amount,ease:'linear'}]}));
 else if(id==='deep-parallax')layers=subjects().map((l,i)=>({...l,x:0,keyframes:[{at:duration,x:-amount*(i+1)/inputs.layers.length,ease:'linear'}]}));
 else if(id==='piece-assembly')layers=subjects().map((l,i)=>tween(l,{x:(i%2?1:-1)*amount,y:(i%3-1)*amount,opacity:0,rotation:(i%2?1:-1)*12},{x:0,y:0,opacity:1,rotation:0}));
 else if(id==='progressive-disclosure'){if(!inputs.rect?.every(Number.isFinite)||inputs.rect.length!==4)throw Error('Diagram reveal needs its bounding rectangle');layers=subjects().map(l=>({...l,reveal_rect:inputs.rect,reveal:0,keyframes:[{at:duration,reveal:1,ease:'linear'}]}));}
 else if(id==='breathing-loop')layers=subjects().map(l=>({...l,scale:1,keyframes:Array.from({length:8},(_,i)=>({at:duration*(i+1)/8,scale:(i%2)?1:1.035}))}));
 else if(id==='split-flap'){
  if(typeof inputs.text!=='string'||!inputs.text.length||inputs.text.length>32)throw Error('Split flap needs 1–32 characters');
  const size=inputs.size||104,[x,y]=inputs.position||[120,500],gap=inputs.gap||size*.7;
  layers=Array.from(inputs.text).map((char,i)=>({id:instance+'-'+i,kind:'text',text:char,position:[x+i*gap,y],pivot:[x+i*gap,y-size*.4],align:'middle',size,font:inputs.font||'Pretendard',weight:inputs.weight||720,color,scaleY:0,opacity:0,keyframes:[{at:.015+i*.035,scaleY:0,opacity:0,ease:'hold'},{at:duration+i*.035,scaleY:1,opacity:1,ease:'out'}]}));
 }else if(id==='lower-third-reveal'){
  if(!inputs.content_id)throw Error('Caption requires an editable content_id');
  layers=[{id:instance+'-caption',kind:'text',content_id:inputs.content_id,position:inputs.position||[100,960],align:'start',size:inputs.size||44,color,opacity:0,y:30,keyframes:[{at:duration,y:0,opacity:1}]}];
 }else if(id==='bar-grow'){
  if(!Array.isArray(inputs.values)||!inputs.values.length||inputs.values.some(v=>!Number.isFinite(v)||v<0)||inputs.values.length>12||!inputs.basis)throw Error('Data bars need nonnegative values and fact/example basis');
  const max=Math.max(...inputs.values,1);
  layers=inputs.values.map((v,i)=>({id:instance+'-'+i,kind:'svg',svg:'<rect x="'+(180+i*120)+'" y="'+(900-v/max*600)+'" width="75" height="'+v/max*600+'" fill="'+color+'"/>',pivot:[180+i*120,900],scaleY:0,keyframes:[{at:duration,scaleY:1}]}));
 }else if(id==='cursor-click'){
  if(!inputs.point?.every(Number.isFinite)||inputs.point.length!==2)throw Error('UI click requires target coordinates');
  const [x,y]=inputs.point;layers=[{id:instance+'-cursor',kind:'svg',svg:'<path d="M0 0L0 50 14 35 25 58 36 52 24 29 45 29Z" fill="'+color+'" stroke="#07121d" stroke-width="2"/>',x:x-amount,y:y+amount,keyframes:[{at:duration*.65,x,y},{at:duration*.75,scale:.9,x,y},{at:duration,scale:1,x,y}],pivot:[0,0]},{id:instance+'-ring',kind:'svg',svg:'<circle cx="'+x+'" cy="'+y+'" r="36" fill="none" stroke="'+color+'" stroke-width="3"/>',pivot:[x,y],opacity:0,scale:.3,keyframes:[{at:duration*.64,opacity:0,scale:.3},{at:duration*.7,opacity:1,scale:.5},{at:duration,opacity:0,scale:1.5}]}];
 }else if(id==='crt-scanlines'){
  const [w,h]=inputs.size||[1920,1080];layers=[{id:instance+'-field',kind:'svg',svg:Array.from({length:Math.ceil(h/8)},(_,i)=>'<path d="M0 '+i*8+'H'+w+'" stroke="'+color+'" opacity=".035"/>').join('')}];
 }else if(id==='particle-burst'){
  const rng=random(seed),[x,y]=inputs.center||[960,540],count=inputs.count??20;if(!Number.isInteger(count)||count<1||count>48)throw Error('Particle count 1–48');
  layers=Array.from({length:count},(_,i)=>{const angle=rng()*Math.PI*2,r=amount*(.4+.6*rng());return {id:instance+'-'+i,kind:'svg',svg:'<circle cx="'+x+'" cy="'+y+'" r="'+(1+rng()*3)+'" fill="'+color+'"/>',opacity:0,keyframes:[{at:.01,opacity:1},{at:duration,x:Math.cos(angle)*r,y:Math.sin(angle)*r,opacity:0,ease:'out'}]};});
 }
 const receipt={instance,card_id:id,family:spec.family,parameters:copy(parameters),input_hash:hash(inputs),layer_ids:layers.map(l=>l.id),selection_reason:inputs.reason||null,review:{automated:'pending',aesthetic:'pending'}};
 return {layers,transition,receipt};
}
export function techniqueCoverage(p){
 const used=p.techniques||[],errors=[];
 for(const u of used){const spec=TECHNIQUES[u.card_id],s=p.scenes.find(s=>s.id===u.scene_id);if(!spec||!s||!u.selection_reason||!u.layer_ids?.every(id=>s.composition?.layers?.some(l=>l.id===id)))errors.push('Unbound technique receipt '+u.instance);}
 return {families:Object.keys(TECHNIQUES).map(id=>TECHNIQUES[id].family).filter((v,i,a)=>a.indexOf(v)===i).map(f=>({family:f,uses:used.filter(u=>u.family===f).length})),errors,not_claimed:'Using a family does not validate every original card or confer aesthetic approval.'};
}
