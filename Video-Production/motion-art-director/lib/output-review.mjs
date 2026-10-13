import {guardedSpawn as spawn} from './storage.mjs';
import {tool} from './io.mjs';
// A bounded heuristic, not a photosensitive-epilepsy or accessibility certification.
export function frameReviewer({fps=30,holdSeconds=2,intentionalHolds=[]}={}){
 let previous=null,frame=0,stillStart=null,lastSign=0,transitions=[],findings=[];
 const intentional=t=>intentionalHolds.some(q=>t>=q.start&&t<q.end);
 function endStill(){if(stillStart!==null&&(frame-stillStart)/fps>=holdSeconds&&!intentional(stillStart/fps))findings.push({code:'STATIC_RUN',start:stillStart/fps,end:frame/fps,severity:'review'});stillStart=null;}
 return {push(data){let sum=0,changed=0,delta=0,absolute=0;for(let k=0;k<data.length;k++){sum+=data[k];if(previous){const d=data[k]-previous[k];delta+=d;absolute+=Math.abs(d);if(Math.abs(d)>26)changed++;}}
  if(sum/data.length<3&&!intentional(frame/fps)&&frame%fps===0)findings.push({code:'DARK_FRAME',time:frame/fps,severity:'review'});
  if(previous){if(absolute/data.length<.25){if(stillStart===null)stillStart=frame-1;}else endStill();if(changed/data.length>.1){const sign=Math.sign(delta);if(sign&&lastSign&&sign!==lastSign){transitions.push(frame);transitions=transitions.filter(x=>x>frame-fps);if(transitions.length>6&&(!findings.length||findings.at(-1).code!=='BRIGHTNESS_RISK'||frame/fps-findings.at(-1).time>1))findings.push({code:'BRIGHTNESS_RISK',time:frame/fps,severity:'fix'});}if(sign)lastSign=sign;}}
  previous=Buffer.from(data);frame++;
 },finish(){endStill();return {frames:frame,findings,status:findings.some(x=>x.severity==='fix')?'fix-required':findings.length?'human-review-required':'pass',scope:'low-resolution luminance/static heuristics only; color flashes, semantics and listening require separate review'};}};
}
export async function reviewMovie(file,p){
 const width=96,height=54,review=frameReviewer({intentionalHolds:p.production_review?.intentional_holds||[]});
 const ff=spawn(tool('ffmpeg'),['-v','error','-i',file,'-vf',`scale=${width}:${height},fps=30,format=gray`,'-an','-f','rawvideo','-'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
 let pending=Buffer.alloc(0),err='';ff.stderr.on('data',b=>err=(err+b).slice(-4096));
 ff.stdout.on('data',b=>{pending=Buffer.concat([pending,b]);while(pending.length>=width*height){review.push(pending.subarray(0,width*height));pending=pending.subarray(width*height);}});
 await new Promise((resolve,reject)=>{ff.on('error',reject);ff.on('close',code=>code===0?resolve():reject(Error(err)));});
 const r=review.finish();if(!r.frames||pending.length)throw Error('Incomplete output review decode');
 return {...r,ok:r.status!=='fix-required',reviewedFile:file,listening:'pending',aesthetic:'pending'};
}
export function contrastReview(p){
 const rgb=h=>[1,3,5].map(k=>parseInt(h.slice(k,k+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4),lum=h=>rgb(h).reduce((n,v,k)=>n+v*[.2126,.7152,.0722][k],0),rows=[];
 for(const s of p.scenes||[])for(const c of [s.composition,s.portrait_composition].filter(Boolean))for(const l of c.layers||[])if(l.kind==='text'){
  const background=c.background,foreground=l.color||'#173d48',simple=(c.layers||[]).every(q=>q.kind==='text');
  if(!simple||!/^#[a-f0-9]{6}$/i.test(background||'')||!/^#[a-f0-9]{6}$/i.test(foreground))rows.push({scene:s.id,layer:l.id,status:'not-measured',reason:'complex background or non-hex color'});
  else{const a=lum(background),b=lum(foreground),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);rows.push({scene:s.id,layer:l.id,ratio,status:ratio<4.5?'review':'pass'});}
 }return rows;
}
