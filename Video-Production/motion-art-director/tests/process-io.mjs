import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
import {run,tool} from '../lib/io.mjs';
const root=fs.mkdtempSync(path.join(process.env.MOTION_TEST_ROOT||os.tmpdir(),'process-io-'));
for(let i=0;i<8;i++){
 const file=path.join(root,'clip-'+i+'.mp4');
 // Deliberately omit -nostdin: run() must provide EOF, not an unused Windows pipe.
 await run(tool('ffmpeg'),['-y','-v','error','-f','lavfi','-i','color=red:s=64x64:r=30:d=0.1','-c:v','libx264','-threads','1',file]);
 assert(fs.statSync(file).size>0);
}
const result=await run(process.execPath,['-e','process.stdout.write("out");process.stderr.write("err")']);
assert.equal(result.out,'out');assert.equal(result.err,'err');
await assert.rejects(run(process.execPath,['-e','process.stderr.write("expected");process.exit(7)']),/exited 7/);
console.log('PASS noninteractive child stdin, actual FFmpeg encodes, stdout/stderr and rejected exit');
