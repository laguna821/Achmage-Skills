import fs from 'node:fs';import path from 'node:path';
import {read,write,hash,configPath,settings,run} from '../lib/io.mjs';
const [bundle,python,converter]=process.argv.slice(2);if(!bundle||!python||!converter)throw new Error('Usage: connect-presentation.mjs BUNDLE PYTHON PDF_CONVERTER');
const b=path.resolve(bundle),lock=read(path.join(b,'engine.lock.json')),renderer=path.join(b,'engine/render.py');
if(lock.packageSha256!=='35e3ba49b55268f827b12c55ff96223e03586f0887873e1a4793624878aed37d'||hash(fs.readFileSync(renderer))!==lock.files['render.py'])throw new Error('Expected approved achmage-presentation 1.0.0 engine');
const probe=JSON.parse((await run(python,['-B',path.join(b,'scripts/presentation.py'),'doctor','--converter',converter])).out);if(probe.status!=='ready-for-html'||probe.missing?.length||probe.checks?.pdf?.status!=='available'||probe.engineSha256!==lock.packageSha256)throw new Error('Presentation doctor failed: '+JSON.stringify(probe));
write(configPath(),{...settings(),presentation:{bundle:b,renderer,rendererSha256:lock.files['render.py'],engineSha256:lock.packageSha256,python:path.resolve(python),converter:path.resolve(converter),policyPath:'Achmage Presentation 1.0.0 / public pinned adapter'}});console.log(JSON.stringify({config:configPath(),engineSha256:lock.packageSha256}));
