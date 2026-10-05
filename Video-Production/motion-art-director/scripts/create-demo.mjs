import fs from 'node:fs';import path from 'node:path';
import {ROOT,read,write} from '../lib/io.mjs';
const [out,name='object-flight']=process.argv.slice(2);
if(!out||!['object-flight','object-water'].includes(name))throw new Error('Usage: node scripts/create-demo.mjs OUTPUT [object-flight|object-water]');
const source=path.join(ROOT,fs.existsSync(path.join(ROOT,'examples-public'))?'examples-public':'examples',name+'.project.json');
const target=path.join(path.resolve(out),name+'.project.json');
if(fs.existsSync(target))throw new Error('Example output already exists; use a new directory');
const p=read(source);delete p.approval;p.status='draft';write(target,p);
console.log(JSON.stringify({project:target,approval:'not approved',purpose:'Authored example, not automatic planning. For new content, choose and draw new subjects using references/show-the-subject.md.'}));
