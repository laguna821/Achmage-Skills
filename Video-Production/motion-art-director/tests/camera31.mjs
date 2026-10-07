import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {cameraFilter,cameraErrors,cameraState} from '../lib/camera31.mjs';
import {run,tool,write} from '../lib/io.mjs';
const out=fs.mkdtempSync(path.join(os.tmpdir(),'motion-camera-'));
const camera={keyframes:[{at:0,zoom:1,focus:[.5,.5]},{at:.4,zoom:1.8,focus:[.7,.4],ease:'in'},{at:1.2,zoom:1.1,focus:[.2,.6],ease:'out'},{at:2,zoom:2.1,focus:[.5,.5]}]};
assert.deepEqual(cameraErrors(camera),[]);assert(cameraErrors({keyframes:[{at:0,zoom:.5,focus:[.5,.5]}]}).length);
assert.deepEqual(cameraState(camera,36),{zoom:1.1,focus:[.2,.6]});
const input=['-f','lavfi','-i','testsrc2=s=320x180:r=30:d=2'];
const all=await run(tool('ffmpeg'),['-nostdin','-v','error',...input,'-vf',cameraFilter(camera,160,90)+'format=rgb24','-frames:v','60','-f','framemd5','-']);
const sums=all.out.split('\n').filter(s=>/^0,/.test(s)).map(s=>s.split(',').at(-1).trim());assert.equal(sums.length,60);
for(const frame of [46,9,36,17,46]){
 const single=await run(tool('ffmpeg'),['-nostdin','-v','error',...input,'-vf',"select='eq(n,"+frame+")',"+cameraFilter(camera,160,90,frame)+'format=rgb24','-frames:v','1','-f','framemd5','-']);
 const md5=single.out.split('\n').find(s=>/^0,/.test(s)).split(',').at(-1).trim();assert.equal(md5,sums[frame],'Absolute camera seek parity at frame'+frame);
}
write(path.join(out,'verification.json'),{frames:60,reordered:[46,9,36,17,46],exactRGBParity:true,camera});console.log(JSON.stringify({passed:true,out,exactSeekFrames:5}));
