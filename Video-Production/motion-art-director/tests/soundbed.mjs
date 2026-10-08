import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {soundbed} from '../lib/soundbed.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'motion-soundbed-'));let passed=0;
for(const kind of ['river','wind','street','room']){const spec={kind,duration:.2,seed:17},a=await soundbed(spec,path.join(root,kind+'-a.wav')),b=await soundbed(spec,path.join(root,kind+'-b.wav'));assert.equal(a.sha256,b.sha256);assert.equal(a.bytes,38444);assert(a.peak_dbfs<0);assert((await soundbed(spec,a.path)).reused);passed++;}
await assert.rejects(soundbed({kind:'river',duration:Infinity},path.join(root,'bad.wav')));passed++;console.log(JSON.stringify({passed,root}));
