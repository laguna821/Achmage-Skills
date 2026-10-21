import path from 'node:path';
import {ROOT,run,settings} from '../lib/io.mjs';
const r=await run(settings().python||'python',['-X','utf8',path.join(ROOT,'tests','skia-timeline.py')]);
process.stdout.write(r.out+r.err);
