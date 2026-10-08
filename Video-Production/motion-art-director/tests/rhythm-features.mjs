import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
import {ROOT,settings,run,read} from '../lib/io.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'motion-bands-')),rate=22050,N=rate*3;
const wav=Buffer.alloc(44+N*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(N*2,40);
for(let i=0;i<N;i++){let value=0,t=i/rate;for(const [start,f]of [[.5,80],[1.1,700],[1.7,5000]])if(t>=start&&t<start+.1)value+=.5*Math.sin(2*Math.PI*f*(t-start));wav.writeInt16LE(Math.round(value*32767),44+i*2);}
const file=path.join(dir,'fixture.wav'),out=path.join(dir,'features.json');fs.writeFileSync(file,wav);
await run(settings().python||'python',[path.join(ROOT,'scripts/rhythm_features.py'),file,'--bpm','133','--out',out]);
const r=read(out);assert.equal(r.version,'spectral-flux-v2');
for(const [name,t]of [['low',.5],['mid',1.1],['high',1.7]])assert(r.band_onsets[name].some(e=>Math.abs(e.seconds-t)<.04&&e.strength>0),name+' transient missing');
assert.equal(r.onset_density_2s.length,2);assert.match(r.review,/not instrument/);assert.equal(r.energy_1s.length,3);
console.log('rhythm-features: synthetic isolated-band onset windows and density verified; no perceptual instrument claim');
