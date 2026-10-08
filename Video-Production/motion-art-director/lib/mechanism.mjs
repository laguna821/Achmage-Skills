// Editable CPU vector mechanism. The same traveled chain distance drives every rotor.
// This is an illustrative single-ratio transmission, not a measured bicycle specification.
export function beltGeometry({front=[1150,600],rear=[420,600],frontRadius=150,rearRadius=66}={}){
 if(![front,rear].every(v=>Array.isArray(v)&&v.length===2&&v.every(Number.isFinite)))throw Error('Finite shaft centers required');
 const d=Math.hypot(front[0]-rear[0],front[1]-rear[1]),R=frontRadius,r=rearRadius;
 if(![R,r,d].every(Number.isFinite)||r<=0||R<r||d<=R+r)throw Error('Invalid separated pitch radii');
 const k=(R-r)/d,nx=-k,ny=-Math.sqrt(1-k*k),a=Math.atan2(ny,nx),deg=180/Math.PI,ux=(front[0]-rear[0])/d,uy=(front[1]-rear[1])/d;
 const pt=(c,q,sign)=>[c[0]+(nx*ux-sign*ny*uy)*q,c[1]+(nx*uy+sign*ny*ux)*q].map(n=>+n.toFixed(5)).join(' ');
 return {path:'M'+pt(front,R,1)+'A'+R+' '+R+' 0 1 1 '+pt(front,R,-1)+'L'+pt(rear,r,-1)+'A'+r+' '+r+' 0 0 1 '+pt(rear,r,1)+'Z',length:2*Math.sqrt(d*d-(R-r)**2)+R*(-2*a)+r*(2*Math.PI+2*a),ratio:R/r,front, rear,R,r,startDegrees:a*deg};
}
export function gearSvg(cx,cy,r,teeth=48,color='#cbd0cc'){
 if(![cx,cy,r].every(Number.isFinite)||r<=0||!Number.isInteger(teeth)||teeth<8||teeth>120)throw Error('Invalid gear');
 const p=Array.from({length:teeth*4},(_,i)=>{const a=i*Math.PI*2/(teeth*4),q=r+(i%4===1||i%4===2?4:-3);return [(cx+Math.cos(a)*q).toFixed(3),(cy+Math.sin(a)*q).toFixed(3)].join(',');});
 return '<polygon points="'+p.join(' ')+'" fill="'+color+'" stroke="#eef1e9" stroke-width="1"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r*.77+'" fill="#171b1b"/>'+Array.from({length:5},(_,i)=>{const a=i*72;return '<path d="M'+cx+' '+cy+'L'+(cx+r*.83)+' '+cy+'" stroke="'+color+'" stroke-width="'+r*.16+'" transform="rotate('+a+' '+cx+' '+cy+')"/>';}).join('')+'<circle cx="'+cx+'" cy="'+cy+'" r="'+r*.14+'" fill="#edf0e6"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r*.075+'" fill="#111718"/>';
}
export function wheelSvg(cx,cy,r=295){
 return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#090b0b" stroke-width="28"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r-13)+'" fill="none" stroke="#808985" stroke-width="5"/>'+Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,b=a+.2;return '<path d="M'+(cx+12*Math.cos(b))+' '+(cy+12*Math.sin(b))+'L'+(cx+(r-20)*Math.cos(a))+' '+(cy+(r-20)*Math.sin(a))+'" stroke="#a7afab" opacity=".68" stroke-width="1.7"/>';}).join('')+'<circle cx="'+cx+'" cy="'+cy+'" r="18" fill="#8f9692"/><path d="M'+cx+' '+(cy-r)+'a'+r+' '+r+' 0 0 1 '+r*.35+' '+r*.064+'" stroke="#d5ff56" stroke-width="7" fill="none"/>';
}
export function transmission({instance='drive',duration=8,turns=2,phase=0,front=[1150,600],rear=[420,600],frontRadius=150,rearRadius=66,accent='#d5ff56',wheel=false}={}){
 if(!/^[a-z0-9-]+$/.test(instance)||!Number.isFinite(duration)||duration<=0||duration>60||!Number.isFinite(turns)||Math.abs(turns)>120||!Number.isFinite(phase)||!/^#[a-f\d]{6}$/i.test(accent))throw Error('Invalid transmission input');
 const g=beltGeometry({front,rear,frontRadius,rearRadius}),travel=2*Math.PI*g.R*turns,base=2*Math.PI*g.R*phase;
 const svg=(id,body,other={})=>({id:instance+'-'+id,kind:'svg',svg:body,...other});
 const rotor=(id,body,pivot,ratio)=>svg(id,body,{pivot,rotation:phase*360*ratio,keyframes:[{at:duration,rotation:(phase+turns)*360*ratio,ease:'linear'}]});
 const layers=[];
 if(wheel)layers.push(rotor('wheel',wheelSvg(...rear,295),rear,g.ratio));
 layers.push(rotor('rear',gearSvg(...rear,g.r,22),rear,g.ratio),rotor('front',gearSvg(...front,g.R,50),front,1));
 layers.push(svg('chain-bed','<path d="'+g.path+'" fill="none" stroke="#404b45" stroke-width="12"/>'));
 layers.push(svg('chain','<path d="'+g.path+'" fill="none" stroke="'+accent+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="7 7"/>',{dash_offset:-base,keyframes:[{at:duration,dash_offset:-base-travel,ease:'linear'}]}));
 layers.push(rotor('crank','<path d="M'+front.join(' ')+'l0 110" stroke="#e3e8dc" stroke-width="23" stroke-linecap="round"/><path d="M'+(front[0]-36)+' '+(front[1]+110)+'h72" stroke="#717b74" stroke-width="15" stroke-linecap="round"/>',front,1));
 return {layers,receipt:{adapter:'transmission-v1',model:'single ratio at pitch radii; illustrative geometry',parameters:{duration,turns,phase,front,rear,frontRadius,rearRadius,accent,wheel},chain_travel:travel,rear_turns:turns*g.ratio,layer_ids:layers.map(l=>l.id),engines:['chromium'],outputs:['time','scroll','still'],aesthetic_review:'pending'}};
}
