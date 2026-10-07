import {readFile,mkdir,cp,lstat,realpath,rename,symlink} from 'node:fs/promises';
import {resolve,join,dirname,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {homedir} from 'node:os';
import {hash,fail} from './common.mjs';
const source=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await readFile(join(source,'PACKAGE-MANIFEST.json'),'utf8'));
if(manifest.name!=='hallym-kordoc'||manifest.engine.version!=='4.18.13')fail('INVALID_RELEASE','릴리스 정보가 다릅니다.');
async function verify(dir){
 for(const f of manifest.files){const p=resolve(dir,f.path),r=relative(dir,p);if(r.startsWith('..')||isAbsolute(r))fail('UNSAFE_PATH','매니페스트 경로 오류');if(hash(await readFile(p))!==f.sha256)fail('HASH_MISMATCH',f.path);}
}
await verify(source);
const args=process.argv.slice(2),arg=name=>args.includes(name)?args[args.indexOf(name)+1]:null;
const state=resolve(process.env.HALLYM_KORDOC_HOME||join(homedir(),'.hallym-kordoc'));
const target=join(state,'releases',manifest.version,hash(JSON.stringify(manifest)).slice(0,12));
let exists=false;try{await lstat(target);exists=true;}catch(e){if(e.code!=='ENOENT')throw e;}
if(exists)await verify(target);else{
 const stage=target+'.install-'+process.pid;await mkdir(stage,{recursive:true});
 for(const f of [...manifest.files,{path:'PACKAGE-MANIFEST.json'}]){await mkdir(dirname(join(stage,f.path)),{recursive:true});await cp(join(source,f.path),join(stage,f.path));}
 await verify(stage);await rename(stage,target);
}
const project=arg('--project'),roots=[];
if(args.includes('--codex'))roots.push(project?join(resolve(project),'.agents/skills'):join(process.env.CODEX_HOME||join(homedir(),'.codex'),'skills'));
if(args.includes('--claude'))roots.push(project?join(resolve(project),'.claude/skills'):join(homedir(),'.claude/skills'));
const links=[];
for(const root of roots){
 await mkdir(root,{recursive:true});const link=join(root,'hallym-kordoc');let previous;
 try{previous=await lstat(link);}catch(e){if(e.code!=='ENOENT')throw e;}
 if(previous){
  if(await realpath(link)===await realpath(target)){links.push(link);continue;}
  if(!previous.isSymbolicLink())fail('EXISTING_UNMANAGED_SKILL','기존 폴더를 보존했습니다: '+link);
  const actual=await realpath(link),rel=relative(join(state,'releases'),actual);
  if(rel.startsWith('..')||isAbsolute(rel))fail('EXISTING_UNMANAGED_SKILL','다른 설치의 링크를 보존했습니다: '+link);
  if(!args.includes('--update'))fail('UPDATE_REQUIRED','기존 설치 업데이트에는 --update가 필요합니다.');
  const backups=join(state,'link-backups');await mkdir(backups,{recursive:true});await rename(link,join(backups,hash(link).slice(0,8)+'-'+Date.now()));
 }
 await symlink(target,link,process.platform==='win32'?'junction':'dir');links.push(link);
}
console.log(JSON.stringify({status:'installed',release:target,links,library:join(state,'library'),certification:manifest.certification},null,2));
