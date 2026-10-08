import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve,relative,isAbsolute} from 'node:path';
export const ENGINE={name:'kordoc',version:'4.18.13',commit:'969526345dde7d6acd2f2bfd3c8e592069333355'};
export const RESEARCH='research:rr-d6b4ac8b9f4584f41514e9fae7c70d2d:809a0e35ac5041d47e55f9d24b23f28bfa19b6db16bee53eaec214e3607dd22c';
export const hash=x=>createHash('sha256').update(x).digest('hex');
export const stable=x=>JSON.stringify(x,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
export function packHash(p){const {contentHash,validation,createdAt,...body}=p;return hash(stable(body));}
export function fail(code,message,details){throw Object.assign(new Error(message),{code,details});}
export const json=async p=>JSON.parse(await readFile(p,'utf8'));
export async function save(p,value){await mkdir(dirname(p),{recursive:true});await writeFile(p,JSON.stringify(value,null,2)+'\n',{flag:'wx'});}
export function inside(root,p){const out=resolve(root,p),rel=relative(resolve(root),out);if(rel.startsWith('..')||isAbsolute(rel))fail('UNSAFE_PATH','Path leaves package');return out;}
export const escapeXml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const cell=s=>escapeXml(s??'').replaceAll('|','&#124;').replaceAll('\n','<br>');
export const isEmpty=v=>v===undefined||v===null||String(v).trim()==='';
