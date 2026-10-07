// Analytic, order-independent object sounds. No recording or naturalness claim.
const TAU=2*Math.PI;
const rand=(i,seed)=>{let x=Math.imul(i+seed,374761393);x=Math.imul(x^x>>>13,1274126177);return((x^x>>>16)>>>0)/4294967296;};
export function objectFoley(kind,t,duration,seed=1){
 if(!Number.isFinite(t)||t<=0||t>=duration)return 0;
 const edge=Math.min(1,t/.035,(duration-t)/.065);let v=0;
 if(kind==='pedal-click'){
  const strike=(dt,f,a)=>dt>0?a*(Math.sin(TAU*f*dt)+.35*Math.sin(TAU*f*2.31*dt))*Math.exp(-dt*95)*Math.min(1,dt/.0008):0;
  return (strike(t,940,.34)+strike(t-.028,510,.17))*Math.min(1,(duration-t)/.015);
 }
 if(kind==='ratchet'){
  const rate=42,k=Math.floor(t*rate),dt=t-(k+.08*rand(k,seed))/rate;
  return dt<0?0:(Math.sin(TAU*(1100+450*rand(k,seed+4))*dt)+.22*Math.sin(TAU*3100*dt))*Math.exp(-dt*450)*.075*edge;
 }
 if(kind==='tire-roll'){
  // Authored contact texture, kept low and bounded; not labelled a field recording.
  const k=Math.floor(t*1300),n=rand(k,seed)*2-1;
  return (.008*n+.01*Math.sin(TAU*73*t)+.006*Math.sin(TAU*147*t))*(.65+.35*Math.sin(TAU*.8*t)**2)*edge;
 }
 if(kind==='pour'){
  // Isolated, overlapping bubble resonances instead of a white-noise river bed.
  const rate=29,k=Math.floor(t*rate);
  for(let i=Math.max(0,k-5);i<=k;i++){
   const dt=t-(i+.28*rand(i,seed))/rate;if(dt<0)continue;
   const f=310+1100*rand(i,seed+41),a=.2+.8*rand(i,seed+83);
   v+=a*Math.sin(TAU*f*(dt+.8*dt*dt))*Math.exp(-dt*43)*Math.min(1,dt/.002);
  }
  return v*.055*edge;
 }
 if(kind==='grind'){
  const drive=Math.sin(TAU*92*t)+.28*Math.sin(TAU*184*t)+.13*Math.sin(TAU*368*t);
  const k=Math.floor(t*37),dt=t-k/37,f=450+1200*rand(k,seed);
  const grit=Math.sin(TAU*f*dt)*Math.exp(-dt*170)*Math.min(1,dt/.0015);
  return(drive*.025+grit*.035)*edge;
 }
 throw Error('Unknown object foley '+kind);
}
