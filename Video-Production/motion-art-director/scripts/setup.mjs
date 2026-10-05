import fs from 'node:fs';
import path from 'node:path';
import {ROOT,write,hash,configPath,settings} from '../lib/io.mjs';
const argv=process.argv.slice(2),option=n=>{const i=argv.indexOf('--'+n);return i>=0?argv[i+1]:null;};
const dir=option('ffmpeg-dir');if(!dir)throw new Error('설치한 FFmpeg/ffprobe의 bin 경로를 --ffmpeg-dir로 지정하세요');
const executable=n=>path.join(path.resolve(dir),n+(process.platform==='win32'?'.exe':''));
for(const n of ['ffmpeg','ffprobe'])if(!fs.existsSync(executable(n)))throw new Error('Missing '+n);
write(configPath(),{...settings(),...(option('python')?{python:option('python')}:{ }),...(option('skia-path')?{skiaPath:option('skia-path')}:{ }),ffmpeg:executable('ffmpeg'),ffprobe:executable('ffprobe'),playwright:option('playwright'),dependencyHashes:{ffmpeg:hash(fs.readFileSync(executable('ffmpeg'))),ffprobe:hash(fs.readFileSync(executable('ffprobe')))}});console.log(configPath()+' 저장. doctor로 확인하세요.');
