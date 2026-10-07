import fs from 'node:fs';import path from 'node:path';
import {hash,write,read,settings} from './io.mjs';
import {withStorage,ownedReserve,ownedComplete,currentStorage,expectedWavBytes} from './storage.mjs';
const rate=48000;
export async function soundbed(spec,file){
 const {kind,duration,seed=1,gain_db=-12}=spec;
 if(!['river','wind','street','room'].includes(kind)||!Number.isFinite(duration)||duration<=0||duration>600||!Number.isInteger(seed)||!Number.isFinite(gain_db)||gain_db< -60||gain_db>0)throw Error('Invalid soundbed contract');
 file=path.resolve(file);const identity=hash({engine:hash(fs.readFileSync(new URL(import.meta.url))),kind,duration,seed,gain_db}),receipt=file+'.json';
 if(fs.existsSync(file)&&fs.existsSync(receipt)){const prior=read(receipt);if(prior.identity===identity&&prior.sha256===hash(fs.readFileSync(file)))return {...prior,reused:true};throw Error('Preserve existing soundbed; use a new asset path');}
 return withStorage(path.dirname(file),{...settings().storage,duration},async()=>{
  const samples=Math.round(duration*rate),bytes=samples*4,h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(bytes+36,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(2,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*4,28);h.writeUInt16LE(4,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(bytes,40);
  ownedReserve(file,{kind:'final',maxBytes:expectedWavBytes(duration)});const fd=fs.openSync(file,'w');let state=seed|0,low=[0,0],mid=[0,0],peak=0;const gain=10**(gain_db/20),rnd=()=>{state=Math.imul(state,1664525)+1013904223|0;return (state>>>0)/2147483648-1;};
  try{fs.writeSync(fd,h);for(let start=0;start<samples;start+=4096){const count=Math.min(4096,samples-start),block=Buffer.alloc(count*4);for(let j=0;j<count;j++){const t=(start+j)/rate,edge=Math.min(1,t/.8,(duration-t)/1.2);for(let c=0;c<2;c++){const n=rnd();low[c]+=.008*(n-low[c]);mid[c]+=.15*(n-mid[c]);let v;
   if(kind==='river')v=(mid[c]*.7+low[c]*1.1)*(.65+.18*Math.sin(t*1.7+c)+.1*Math.sin(t*8.3+c));
   else if(kind==='wind')v=low[c]*3*(.55+.3*Math.sin(t*.52+c*.5));
   else if(kind==='street')v=low[c]*1.8+mid[c]*.13+Math.sin(2*Math.PI*(49*t+.32*Math.sin(t*.6)))*.03;
   else v=low[c]*.8+mid[c]*.06;
   v=Math.max(-.95,Math.min(.95,v*gain*edge));peak=Math.max(peak,Math.abs(v));block.writeInt16LE(Math.round(v*32767),j*4+c*2);}}
   fs.writeSync(fd,block);currentStorage()?.check();}
  }finally{fs.closeSync(fd);}
  ownedComplete(file);const result={identity,spec:{kind,duration,seed,gain_db},path:file,sha256:hash(fs.readFileSync(file)),bytes:fs.statSync(file).size,peak_dbfs:20*Math.log10(peak||1e-12),provenance:'Original deterministic procedural ambience. Not a field recording.',listening:'pending'};write(receipt,result);return result;
 });
}
