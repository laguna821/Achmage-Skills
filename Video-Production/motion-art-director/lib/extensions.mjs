import '../assets/extensions.js';
import {hash} from './io.mjs';
export const EXTENSION_VERSION='showreel-v1';
export const extensionRegistry=Object.fromEntries(Object.entries(globalThis.MAD_EXT.specs).map(([type,[source,title,family,cost]])=>['showreel:'+type,{id:'showreel:'+type,type,source_id:'showreel:'+source,title,family,cost,version:1,engines:['chromium'],renderers:['vector-composite','hybrid-composite'],outputs:['time','scroll','still'],implementation:'executable',automated_review:'pending',aesthetic_review:'pending'}]));
export const drawExtension=globalThis.MAD_EXT.draw;
export const extensionCheck=globalThis.MAD_EXT.check;
export function extensionTechnique({id,instance,inputs={},parameters={}}){
 const spec=extensionRegistry[id];if(!spec)throw Error('Unknown extension adapter');
 if(!/^[a-z0-9-]+$/.test(instance||''))throw Error('Safe instance ID required');
 const {duration=2,seed=1,...rest}=parameters;
 const extension={version:1,type:spec.type,duration,seed,inputs:structuredClone(inputs),parameters:rest};
 const errors=extensionCheck(extension);if(errors.length)throw Error(errors.join('; '));
 return {layers:[{id:instance,kind:'svg',svg:'',extension}],receipt:{instance,card_id:id,source_id:spec.source_id,adapter_version:1,family:spec.family,parameters,selection_reason:inputs.reason||null,input_hash:hash(inputs),layer_ids:[instance],review:{automated:'pending',aesthetic:'pending'}}};
}
export function extensionProjectErrors(p){
 const errors=[],declared=p.extensions?.includes(EXTENSION_VERSION),used=p.scenes?.some(s=>[s.composition,s.portrait_composition].some(c=>c?.layers?.some(l=>l.extension)));
 if(p.extensions!==undefined&&(!Array.isArray(p.extensions)||p.extensions.some(x=>x!==EXTENSION_VERSION)||new Set(p.extensions).size!==p.extensions.length))errors.push('Unknown or duplicate project extension');
 if(used&&(!declared||p.schema_version!=='3.1.0'))errors.push('Extension layers require 3.1.0 and showreel-v1 declaration');
 for(const s of p.scenes||[]){const renderer=s.renderer||p.renderer,skia=(s.rasterizer||p.profile?.rasterizer)==='skia';
  for(const c of [s.composition,s.portrait_composition].filter(Boolean))for(const l of c.layers||[])if(l.extension){
   if(l.kind!=='svg'||!['vector-composite','hybrid-composite'].includes(renderer)||skia)errors.push('Extension requires Chromium vector/hybrid layer');
   errors.push(...extensionCheck(l.extension).map(x=>s.id+'/'+l.id+': '+x));
  }
  if(s.motion_blur){const b=s.motion_blur;if(!declared||skia||renderer!=='vector-composite'||p.renderer!=='vector-composite'||p.scenes.some(x=>x.renderer)||![1,2,4].includes(b.samples)||!Number.isFinite(b.shutter)||b.shutter<0||b.shutter>1)errors.push('Motion blur requires declared Chromium vector project, samples 1/2/4 and shutter 0..1');if(s.transition_in)errors.push('Motion blur with overlapping transition unsupported');}
 }
 return errors;
}
