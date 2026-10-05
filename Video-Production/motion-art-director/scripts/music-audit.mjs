import {readProject} from '../lib/io.mjs';import {musicDirectionAudit} from '../lib/music-direction.mjs';
if(!process.argv[2])throw Error('Usage: node scripts/music-audit.mjs PROJECT.json');const result=musicDirectionAudit(readProject(process.argv[2]));console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;
