import fs from 'node:fs';
// Only the normalized 48kHz stereo PCM16 stems are accepted. No full-track allocation.
function pcmInfo(file){
 const fd=fs.openSync(file,'r'),header=Buffer.alloc(12);fs.readSync(fd,header,0,12,0);
 if(header.toString('ascii',0,4)!=='RIFF'||header.toString('ascii',8,12)!=='WAVE'){fs.closeSync(fd);throw Error('PCM WAV required');}
 let at=12,format,data;const length=fs.fstatSync(fd).size;
 while(at+8<=length){const chunk=Buffer.alloc(8);fs.readSync(fd,chunk,0,8,at);const name=chunk.toString('ascii',0,4),size=chunk.readUInt32LE(4);
 if(name==='fmt '){const f=Buffer.alloc(size);fs.readSync(fd,f,0,size,at+8);format={codec:f.readUInt16LE(0),channels:f.readUInt16LE(2),rate:f.readUInt32LE(4),bits:f.readUInt16LE(14)};}
 if(name==='data'){data={offset:at+8,size};break;}at+=8+size+(size%2);}
 if(!format||format.codec!==1||format.channels!==2||format.rate!==48000||format.bits!==16||!data||data.offset+data.size>length){fs.closeSync(fd);throw Error('Normalized stereo48kPCM16 required');}
 return {fd,...data};
}
export function duckPCM(music,key,target,{duration,threshold,ratio,attack,release,key_gain_db=0}){
 const m=pcmInfo(music);let k,out;
 try{k=pcmInfo(key);const samples=Math.round(duration*48000),bytes=samples*4;if(m.size!==bytes||k.size!==bytes)throw Error('Ducking stem sample length mismatch');
 const head=Buffer.alloc(44);head.write('RIFF');head.writeUInt32LE(bytes+36,4);head.write('WAVEfmt ',8);head.writeUInt32LE(16,16);head.writeUInt16LE(1,20);head.writeUInt16LE(2,22);head.writeUInt32LE(48000,24);head.writeUInt32LE(192000,28);head.writeUInt16LE(4,32);head.writeUInt16LE(16,34);head.write('data',36);head.writeUInt32LE(bytes,40);
 out=fs.openSync(target,'w');fs.writeSync(out,head);let envelope=0;const a=Math.exp(-1/(48000*attack/1000)),r=Math.exp(-1/(48000*release/1000)),keyGain=10**(key_gain_db/20),musicBuffer=Buffer.alloc(16384),keyBuffer=Buffer.alloc(16384);
 for(let at=0;at<bytes;at+=musicBuffer.length){const n=Math.min(musicBuffer.length,bytes-at);if(fs.readSync(m.fd,musicBuffer,0,n,m.offset+at)!==n||fs.readSync(k.fd,keyBuffer,0,n,k.offset+at)!==n)throw Error('Short PCM input');
 for(let j=0;j<n;j+=4){const l=keyBuffer.readInt16LE(j)/32768*keyGain,right=keyBuffer.readInt16LE(j+2)/32768*keyGain,power=(l*l+right*right)*.5,c=power>envelope?a:r;envelope=c*envelope+(1-c)*power;const level=Math.sqrt(envelope),gain=level>threshold?Math.pow(threshold/level,1-1/ratio):1;
 for(const offset of [0,2])musicBuffer.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(musicBuffer.readInt16LE(j+offset)*gain))),j+offset);}
 fs.writeSync(out,musicBuffer,0,n);}
 }finally{fs.closeSync(m.fd);if(k)fs.closeSync(k.fd);if(out!==undefined)fs.closeSync(out);}
 return target;
}

