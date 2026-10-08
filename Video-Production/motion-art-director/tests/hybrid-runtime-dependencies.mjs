import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from '../lib/io.mjs';
import {hybridRuntimeHash} from '../lib/hybrid.mjs';
const read=f=>fs.readFileSync(path.join(ROOT,f));
const baseline=hybridRuntimeHash(read);
assert.equal(hybridRuntimeHash(),baseline);
for(const dependency of ['lib/automotive-audio.mjs','lib/audio.mjs','lib/audio31.mjs','lib/foley.mjs','lib/pcm-duck.mjs','lib/audio-edit.mjs','lib/ending31.mjs']){
 const changed=hybridRuntimeHash(f=>f===dependency?Buffer.concat([read(f),Buffer.from('\n// changed synthesis')]):read(f));
 assert.notEqual(changed,baseline,dependency+' must invalidate completed final reuse');
}
assert.equal(hybridRuntimeHash(read),baseline,'read-only experiment must preserve engine files');
console.log('hybrid runtime dependencies: seven audio-only mutations invalidate completed-run cache; unchanged runtime stable');
