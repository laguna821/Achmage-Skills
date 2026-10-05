#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {ROOT,inside} from '../lib/io.mjs';
const args=process.argv.slice(2),get=(k,d)=>{const i=args.indexOf('--'+k);return i<0?d:args[i+1];};
const agent=get('agent','codex');if(!['codex','claude'].includes(agent))throw new Error('agent must be codex or claude');
const base=get('dest',agent==='codex'?path.join(process.env.CODEX_HOME||path.join(os.homedir(),'.codex'),'skills'):path.join(os.homedir(),'.claude','skills'));
const target=path.resolve(base,'motion-art-director');if(inside(ROOT,target))throw new Error('Install target must be outside source');if(fs.existsSync(target))throw new Error('Existing installation preserved: '+target);
fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(ROOT,target,{recursive:true,filter:f=>!/(?:^|[/\\])(?:node_modules|local\.config\.json|\.git)(?:[/\\]|$)/.test(f)});console.log(JSON.stringify({agent,target,next:'npm ci; npx playwright install chromium; node scripts/setup.mjs --ffmpeg-dir <bin>; node scripts/motion.mjs doctor'}));
