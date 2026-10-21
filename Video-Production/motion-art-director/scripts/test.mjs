import fs from 'node:fs';import path from 'node:path';import {ROOT,run} from '../lib/io.mjs';
process.stdout.write((await run(process.execPath,[path.join(ROOT,fs.existsSync(path.join(ROOT,'tests-public'))?'tests-public':'tests','remix.mjs')])).out);
const folder=fs.existsSync(path.join(ROOT,'tests-public'))?'tests-public':'tests';
process.stdout.write((await run(process.execPath,[path.join(ROOT,folder,'composition-review.mjs')])).out);
process.stdout.write((await run(process.execPath,[path.join(ROOT,folder,'process-io.mjs')])).out);
process.stdout.write((await run(process.execPath,[path.join(ROOT,folder,'message-encode.mjs')])).out);
for(const name of ['director-review','media-container','rhythm-occurrences','existing-recording','cases-message-composite','continuity','source-evidence','message-continuity','extensions','extensions-render','package-version','subject-model','preproduction','cache-cleanup','render-storage-policy','source-action','hybrid-runtime-dependencies','audition-choice'])process.stdout.write((await run(process.execPath,[path.join(ROOT,folder,name+'.mjs')])).out);
for(const test of ['music-structure','music-recurrence','release','direction','spatial','automotive','music-direction','ending','publication','hybrid-contract','techniques','hybrid-delivery','camera31','storage','soundbed','hybrid-geometry','editorial','foley','sync-score','rhythm-score','mechanism','pacing','rhythm-review','rhythm-features','rhythm-refine','rhythm-landings','audio-clock']){const r=await run(process.execPath,[path.join(ROOT,folder,test+'.mjs')]);process.stdout.write(r.out);}
