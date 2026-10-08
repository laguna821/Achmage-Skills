// A common camera moves footage and graphics after composition. Pure absolute
// frame evaluation keeps preview, render, out-of-order seek and handles aligned.
export function cameraErrors(camera){
 if(camera===undefined)return [];
 const e=[],ks=camera?.keyframes;
 if(!Array.isArray(ks)||ks.length<1||ks.length>16)return ['camera requires 1–16 keyframes'];
 let previous=-1;
 for(const k of ks){
  if(!Number.isFinite(k.at)||k.at<0||k.at<=previous)e.push('camera keyframes must have increasing nonnegative times');previous=k.at;
  if(!Number.isFinite(k.zoom)||k.zoom<1||k.zoom>4)e.push('camera zoom must be 1–4');
  if(!Array.isArray(k.focus)||k.focus.length!==2||!k.focus.every(v=>Number.isFinite(v)&&v>=0&&v<=1))e.push('camera focus must be normalized x/y');
  if(k.ease!==undefined&&!['linear','smooth','in','out','hold'].includes(k.ease))e.push('unknown camera easing');
 }
 return e;
}
function eased(u,ease){u=Math.min(1,Math.max(0,u));return ease==='linear'?u:ease==='in'?u*u*u:ease==='out'?1-(1-u)**3:ease==='hold'?0:u*u*(3-2*u);}
export function cameraState(camera,frame){
 if(!camera)return {zoom:1,focus:[.5,.5]};
 const errors=cameraErrors(camera);if(errors.length)throw Error(errors.join('; '));
 let a={at:0,zoom:1,focus:[.5,.5]};const t=frame/30;
 for(const b of camera.keyframes){if(t<b.at){const u=eased((t-a.at)/(b.at-a.at),b.ease);return {zoom:a.zoom+(b.zoom-a.zoom)*u,focus:a.focus.map((v,i)=>v+(b.focus[i]-v)*u)};}a=b;}
 return {zoom:a.zoom,focus:[...a.focus]};
}
export function cameraFilter(camera,width,height,startFrame=0){
 if(!camera)return '';
 const errors=cameraErrors(camera);if(errors.length)throw Error(errors.join('; '));
 const time='((on+'+startFrame+')/30)',ks=[{at:0,zoom:1,focus:[.5,.5]},...camera.keyframes];
 function expression(get){let expr=String(get(ks.at(-1)));for(let i=ks.length-1;i>0;i--){const b=ks[i],a=ks[i-1];if(b.at===a.at)continue;const u='clip(('+time+'-'+a.at+')/'+(b.at-a.at)+',0,1)',e=b.ease==='linear'?u:b.ease==='hold'?'0':b.ease==='in'?'pow('+u+',3)':b.ease==='out'?'(1-pow(1-'+u+',3))':'('+u+'*'+u+'*(3-2*'+u+'))';expr='if(lt('+time+','+b.at+'),'+get(a)+'+('+get(b)+'-'+get(a)+')*'+e+','+expr+')';}return expr;}
 const z=expression(k=>k.zoom),x=expression(k=>k.focus[0]),y=expression(k=>k.focus[1]);
 return "zoompan=z='"+z+"':x='clip(("+x+")*iw-iw/zoom/2,0,iw-iw/zoom)':y='clip(("+y+")*ih-ih/zoom/2,0,ih-ih/zoom)':d=1:s="+width+'x'+height+':fps=30,';
}
