import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
import {fixture} from './extensions-fixtures.mjs';import {render,probe} from '../lib/render.mjs';import {approvalHash} from '../lib/contract.mjs';import {reviewMovie} from '../lib/output-review.mjs';import {write,hash,run,tool} from '../lib/io.mjs';
const out=process.env.MOTION_RENDER_TEST_OUTPUT||fs.mkdtempSync(path.join(os.tmpdir(),'motion-ext-render-'));
function approve(p){p.approval={hash:approvalHash(p),by:'automated-test',note:'Synthetic technical fixture; not human direction/aesthetic approval'};return p;}
const p=fixture('odometer',1);p.output.total_frames=60;p.audio.sections[0].end=2;
p.scenes.push({...structuredClone(p.scenes[0]),id:'second',start:30,end:60});p.scenes[1].composition.layers[0].extension.inputs={from:8,to:10,decimals:1};p.scenes[0].motion_blur={samples:4,shutter:.5};
const first=await render(approve(p),path.join(out,'render'),{draft:true});const originalHash=hash(fs.readFileSync(first.final));
assert.equal(first.log.totalFrames,60);const media=await probe(first.final);assert.equal(media.streams[0].r_frame_rate,'30/1');assert.equal(media.streams[0].nb_frames,'60');assert(Math.abs(Number(media.format.duration)-2)<.1);
const r=structuredClone(p);delete r.approval;r.scenes[0].composition.layers[0].extension.inputs.to=111;const revised=await render(approve(r),path.join(out,'render'),{draft:true});assert.equal(revised.log.clips[0].reused,false);assert.equal(revised.log.clips[1].reused,true);assert.equal(originalHash,hash(fs.readFileSync(first.final)));
const resume=await render(r,path.join(out,'render'),{draft:true});assert.equal(resume.reusedRun,true);
const reviewed=await reviewMovie(first.final,p);assert.equal(reviewed.frames,60);
const frame=path.join(out,'boundary.png');await run(tool('ffmpeg'),['-y','-v','error','-i',first.final,'-vf','select=eq(n\\,30)','-frames:v','1',frame]);assert(fs.statSync(frame).size>0);
write(path.join(out,'render-results.json'),{passed:true,totalFrames:60,partialRevision:'first only',priorPreserved:true,reuse:true,outputReview:reviewed,review:'technical only; boundary PNG needs visual comparison',first:first.final,revised:revised.final});console.log(JSON.stringify({passed:true,out,final:first.final}));
