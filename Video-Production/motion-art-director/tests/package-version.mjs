import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {ROOT,read} from '../lib/io.mjs';
const version=read(path.join(ROOT,'package.json')).version;
assert.equal(version,'4.0.0');
for(const v of [read(path.join(ROOT,'package-lock.json')).version,read(path.join(ROOT,'package-lock.json')).packages[''].version,read(path.join(ROOT,'.claude-plugin/plugin.json')).version])assert.equal(v,version);
const manifest=path.join(ROOT,'package-manifest.json');if(fs.existsSync(manifest))assert.equal(read(manifest).version,version);
for(const f of ['references/activation.md','references/release-4.md','contracts/project-3.1.schema.json','contracts/project.schema.json'])assert(fs.existsSync(path.join(ROOT,f)),f);
assert(read(path.join(ROOT,'contracts/project-3.1.schema.json')));
console.log('PASS package version and required release components');
