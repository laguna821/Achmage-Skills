import {readFile,mkdir,cp,lstat,realpath,rename,symlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {homedir} from 'node:os';
import {resolve,join,dirname,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
const source=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await readFile(join(source,'PACKAGE-MANIFEST.json'),'utf8'));
if(manifest.version!=='0.2.0'||manifest.engine.version!=='4.18.13')throw Error('Unexpected release');
async function verify(dir,expected=manifest){for(const item of expected.files){const file=resolve(dir,item.path),rel=relative(dir,file);if(rel.startsWith('..')||isAbsolute(rel))throw Error('Unsafe manifest');const bytes=await readFile(file);if(bytes.length!==item.bytes||createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw Error('Release verification failed: '+item.path);}}
await verify(source);
const target=join(homedir(),'.kordoc-workbench/releases/0.2.0/core');
let exists=false;try{await lstat(target);exists=true;}catch(e){if(e.code!=='ENOENT')throw e;}
let unchanged=false;
if(exists){try{await verify(target);unchanged=true;}catch(e){if(!process.argv.includes('--update'))throw Error(e.message+'; use --update to preserve and replace a verified managed release');await verify(target,JSON.parse(await readFile(join(target,'PACKAGE-MANIFEST.json'),'utf8')));}}
if(!unchanged){
 const stage=target+'.install-'+process.pid;await mkdir(stage,{recursive:true});
 for(const item of [...manifest.files,{path:'PACKAGE-MANIFEST.json'},{path:'THIRD-PARTY-PACKAGES.json'}]){await mkdir(dirname(join(stage,item.path)),{recursive:true});await cp(join(source,item.path),join(stage,item.path));}
 await verify(stage);
 if(exists){const backup=target+'.previous-'+Date.now();const rel=relative(join(homedir(),'.kordoc-workbench/releases'),backup);if(rel.startsWith('..')||isAbsolute(rel))throw Error('Unsafe backup target');await rename(target,backup);try{await rename(stage,target);}catch(e){await rename(backup,target);throw e;}}else await rename(stage,target);
}
const roots=[];if(process.argv.includes('--codex'))roots.push(join(process.env.CODEX_HOME||join(homedir(),'.codex'),'skills'));
if(process.argv.includes('--claude'))roots.push(join(homedir(),'.claude/skills'));
const links=[];
for(const root of roots){await mkdir(root,{recursive:true});const link=join(root,'kordoc-workbench');let old;
 try{old=await lstat(link);}catch(e){if(e.code!=='ENOENT')throw e;}
 if(old){if(await realpath(link)===await realpath(target)){links.push(link);continue;}if(!old.isSymbolicLink())throw Error('Existing skill is a real folder; preserved: '+link);const previous=await realpath(link);if(!previous.startsWith(join(homedir(),'.kordoc-workbench/releases')+'/')&&!previous.startsWith(join(homedir(),'.kordoc-workbench/releases')+'\\'))throw Error('Unmanaged skill link preserved: '+link);const backups=join(homedir(),'.kordoc-workbench/link-backups');await mkdir(backups,{recursive:true});await rename(link,join(backups,(root.includes('.claude')?'claude':'codex')+'-'+Date.now()));}
 await symlink(target,link,process.platform==='win32'?'junction':'dir');links.push(link);
}
console.log(JSON.stringify({status:'installed',release:target,links,engine:manifest.engine,verification:'Installation only; see validation report for session certification'},null,2));
