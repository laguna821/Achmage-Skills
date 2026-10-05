import fs from 'node:fs';
import path from 'node:path';
import {ROOT,hash} from './io.mjs';
export function imageAssets(p){
 const data={};
 for(const a of p.assets||[]){if(a.kind!=='raster')continue;
  const relative=p.__projectDir?path.resolve(p.__projectDir,a.path):null;
  const file=a.path.startsWith('skill:')?path.resolve(ROOT,a.path.slice(6)):path.isAbsolute(a.path)?a.path:relative&&fs.existsSync(relative)?relative:path.resolve(ROOT,a.path),bytes=fs.readFileSync(file),mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[path.extname(file).toLowerCase()];
  if(!mime||hash(bytes)!==a.sha256)throw new Error('Image asset type/hash mismatch: '+a.asset_id);
  if(!a.width||!a.height||a.width*a.height>8388608||bytes.length>12*1048576)throw new Error('Image asset exceeds baseline budget: '+a.asset_id);
  if(a.origin==='generated'&&(!a.provider||!a.prompt))throw new Error('Generated asset provider/prompt missing: '+a.asset_id);
  data[a.asset_id]={uri:'data:'+mime+';base64,'+bytes.toString('base64'),sha256:a.sha256,width:a.width,height:a.height};
 }
 return data;
}
