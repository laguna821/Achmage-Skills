export type Lang = "ko" | "en";
export type Pair = {ko: string; en: string};
export type Figure = {kind: "diagram" | "illustration" | "screenshot"; src: string | Pair; width: number; height: number; title: Pair; alt: Pair; caption: Pair; source: Pair; sha256?: string};
export type Section = {id: string; title: Pair; body: Pair; evidence?: {kind: "source" | "example" | "proposal"; note: Pair}; list?: Pair[]; code?: string; figure?: Figure};
export type Chapter = {id: string; group: string; title: Pair; subtitle: Pair; sections: Section[]; sourceIds: string[]};
export type Entry = {id: string; category: string; title: Pair; description: Pair; label?: Pair; command?: string; details?: Pair; chapterId?: string};
export type Source = {id: string; title: Pair; note: Pair; date?: string; url?: string};
export type Original = {id: string; title: Pair; note: Pair; text: string};
export type Portfolio = {
  schemaVersion: 1; sample: boolean; title: Pair; shortName: string; tagline: Pair; intro: Pair; revision: string; updatedAt: string;
  catalogLabel: Pair; copy?: {catalogSearch?: Pair; catalogIntro?: Pair; catalogCountNote?: Pair}; hero: {request: Pair; steps: {title: Pair; body: Pair; chapterId?: string}[]; outcome: Pair; disclosure?: Pair};
  groups: {id: string; title: Pair; description: Pair}[];
  readingPaths: {title: Pair; description: Pair; path: string}[];
  chapters: Chapter[]; entries: Entry[];
  history: {date: string; title: Pair; body: Pair; sourceIds: string[]}[];
  sources: Source[]; originals: Original[];
};
export const pair=(ko: string,en: string): Pair=>({ko,en});
export function routes(p:Portfolio): string[] {
  return ["/","/all",...(p.entries.length?["/catalog"]:[]),...p.chapters.map(c=>"/guide/"+c.id),...(p.history.length?["/history"]:[]),...(p.sources.length||p.originals.length?["/sources"]:[]),...p.originals.map(o=>"/originals/"+o.id)];
}
export function href(lang:Lang,path:string){return "/"+lang+(path==="/"?"/":path+"/");}
export function fullMarkdown(p:Portfolio,lang:Lang) {
  const text=["# "+p.title[lang],p.intro[lang],"Revision: "+p.revision,"Updated: "+p.updatedAt];
  for(const c of p.chapters){text.push("\n## "+c.title[lang],c.subtitle[lang]);for(const s of c.sections){text.push("\n### "+s.title[lang],s.evidence?.note[lang]||"",s.body[lang]);if(s.list)text.push(s.list.map(v=>"- "+v[lang]).join("\n"));if(s.code)text.push("\x60\x60\x60\n"+s.code+"\n\x60\x60\x60");if(s.figure)text.push("!["+s.figure.alt[lang]+"]("+(typeof s.figure.src==="string"?s.figure.src:s.figure.src[lang])+")",s.figure.caption[lang],s.figure.source[lang]);}}
  if(p.entries.length)text.push("\n## "+p.catalogLabel[lang]);
  for(const e of p.entries)text.push("\n### "+e.title[lang],e.description[lang],e.command||"",e.details?.[lang]||"");
  for(const h of p.history)text.push("\n## "+h.date+" — "+h.title[lang],h.body[lang]);
  for(const s of p.sources)text.push("\n## "+s.title[lang],s.note[lang],s.url||"");
  for(const o of p.originals)text.push("\n## "+o.title[lang],o.note[lang],o.text);
  text.push("\nEND OF PORTFOLIO | "+p.revision+" | "+lang);
  return text.join("\n\n")+"\n";
}
