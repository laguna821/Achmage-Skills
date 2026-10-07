import path from 'node:path';import {ROOT,settings,run} from '../lib/io.mjs';
const r=await run(settings().python||'python',[path.join(ROOT,'tests/rhythm-refine.py')]);process.stdout.write(r.out);
