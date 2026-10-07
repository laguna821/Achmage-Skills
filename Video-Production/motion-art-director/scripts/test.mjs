import fs from 'node:fs';import path from 'node:path';import {ROOT,run} from '../lib/io.mjs';
const folder=fs.existsSync(path.join(ROOT,'tests-public'))?'tests-public':'tests';
for(const test of ['release','direction','spatial','automotive','music-direction','ending','publication','hybrid-contract','techniques','hybrid-delivery','camera31','storage','soundbed','hybrid-geometry']){const r=await run(process.execPath,[path.join(ROOT,folder,test+'.mjs')]);process.stdout.write(r.out);}
