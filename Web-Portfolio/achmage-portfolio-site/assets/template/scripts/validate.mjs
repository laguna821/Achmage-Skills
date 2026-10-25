export function validate(p){
 const errors=[],fail=(at,msg)=>errors.push(at+": "+msg);
 const pair=(v,at)=>{for(const lang of ["ko","en"])if(typeof v?.[lang]!=="string"||!v[lang].trim())fail(at+"."+lang,"nonempty text required");};
 const array=(v,at)=>{if(!Array.isArray(v)){fail(at,"array required");return [];}return v;};
 const id=(v,at)=>{if(typeof v!=="string"||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v))fail(at,"stable lowercase ID required");};
 const unique=(items,at)=>{const seen=new Set();for(const item of items){id(item?.id,at);if(seen.has(item?.id))fail(at,"duplicate ID "+item?.id);seen.add(item?.id);}return seen;};
 const url=(v,at)=>{if(typeof v!=="string"||(!/^https:\/\//.test(v)&&!/^\/(?!\/)/.test(v))||/[\\\u0000-\u001f]/.test(v)||v.split("/").includes(".."))fail(at,"HTTPS or root-relative URL required");};
 if(!p||p.schemaVersion!==1)return ["schemaVersion: expected 1"];
 if(typeof p.sample!=="boolean")fail("sample","boolean required");
 for(const k of ["title","tagline","intro","catalogLabel"])pair(p[k],k);
 for(const k of ["shortName","revision","updatedAt"])if(typeof p[k]!=="string"||!p[k].trim())fail(k,"text required");
 const groups=array(p.groups,"groups"),chapters=array(p.chapters,"chapters"),entries=array(p.entries,"entries"),sources=array(p.sources,"sources"),originals=array(p.originals,"originals"),history=array(p.history,"history");
 const groupIds=unique(groups,"groups"),chapterIds=unique(chapters,"chapters"),sourceIds=unique(sources,"sources");unique(entries,"entries");unique(originals,"originals");
 const validRoutes=new Set(["/","/all",...(entries.length?["/catalog"]:[]),...(history.length?["/history"]:[]),...(sources.length||originals.length?["/sources"]:[]),...chapters.map(c=>"/guide/"+c.id),...originals.map(o=>"/originals/"+o.id)]);
 for(const g of groups){pair(g.title,"group.title");pair(g.description,"group.description");}
 if(!chapters.length)fail("chapters","at least one chapter required");
 const refs=(ids,at)=>{for(const v of array(ids,at))if(!sourceIds.has(v))fail(at,"unknown source "+v);};
 for(const c of chapters){pair(c.title,"chapter.title");pair(c.subtitle,"chapter.subtitle");if(!groupIds.has(c.group))fail(c.id,"unknown group");refs(c.sourceIds,c.id+".sourceIds");const sections=array(c.sections,c.id+".sections");unique(sections,c.id+".sections");if(!sections.length)fail(c.id,"empty chapter");
 for(const s of sections){pair(s.title,"section.title");pair(s.body,"section.body");if(s.list)for(const v of array(s.list,"section.list"))pair(v,"list");if(s.code!==undefined&&typeof s.code!=="string")fail(s.id,"code must be text");
 if(s.evidence){if(!["source","example","proposal"].includes(s.evidence.kind))fail(s.id,"invalid evidence kind");pair(s.evidence.note,"evidence.note");}if(s.figure){const f=s.figure;for(const k of ["title","alt","caption","source"])pair(f[k],"figure."+k);if(typeof f.src==="string")url(f.src,"figure.src");else{pair(f.src,"figure.src");for(const l of ["ko","en"])url(f.src?.[l],"figure.src."+l);}if(!["diagram","illustration","screenshot"].includes(f.kind))fail(s.id,"invalid figure kind");if(!(f.width>0&&f.height>0))fail(s.id,"figure dimensions required");if(f.sha256&&!/^[a-f0-9]{64}$/.test(f.sha256))fail(s.id,"invalid figure hash");}}}
 for(const e of entries){pair(e.title,"entry.title");pair(e.description,"entry.description");if(!groupIds.has(e.category))fail(e.id,"unknown category");if(e.chapterId&&!chapterIds.has(e.chapterId))fail(e.id,"unknown chapter");for(const k of ["label","details"])if(e[k])pair(e[k],"entry."+k);if(e.command!==undefined&&typeof e.command!=="string")fail(e.id,"command must be text");}
 for(const s of sources){pair(s.title,"source.title");pair(s.note,"source.note");if(s.url)url(s.url,"source.url");}
 for(const o of originals){pair(o.title,"original.title");pair(o.note,"original.note");if(typeof o.text!=="string"||!o.text.trim())fail(o.id,"full original text required");}
 for(const h of history){pair(h.title,"history.title");pair(h.body,"history.body");refs(h.sourceIds,"history.sourceIds");}
 if(p.copy)for(const [k,v] of Object.entries(p.copy))pair(v,"copy."+k);if(p.hero?.disclosure)pair(p.hero.disclosure,"hero.disclosure");pair(p.hero?.request,"hero.request");pair(p.hero?.outcome,"hero.outcome");
 for(const s of array(p.hero?.steps,"hero.steps")){pair(s.title,"step.title");pair(s.body,"step.body");if(s.chapterId&&!chapterIds.has(s.chapterId))fail("hero","unknown chapter");}
 for(const r of array(p.readingPaths,"readingPaths")){pair(r.title,"readingPath.title");pair(r.description,"readingPath.description");if(!validRoutes.has(r.path))fail("readingPaths","unavailable route "+r.path);}
 return errors;
}
