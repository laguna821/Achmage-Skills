import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  fail,
  loadPack
} from "./chunk-NVQKGGHQ.mjs";
import "./chunk-VJBJ2GTC.mjs";
import "./chunk-WT3MK4B4.mjs";
import "./chunk-HW7SKSEC.mjs";
import "./chunk-PZTNOUTU.mjs";
import "./chunk-3T6O35FL.mjs";

// skill/kordoc-workbench/scripts/hanmark.mjs
import { readFile, writeFile, mkdir, rename, readdir, stat, unlink } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { homedir } from "node:os";
import { pathToFileURL } from "node:url";
var base = process.env.KORDOC_WORKBENCH_STATE || join(homedir(), ".kordoc-workbench");
var configPath = join(base, "hanmark-target.json");
async function discoverVaults(registryPath) {
  const registry = registryPath || join(process.env.APPDATA || join(homedir(), ".config"), "obsidian", "obsidian.json");
  let data;
  try {
    data = JSON.parse(await readFile(registry, "utf8"));
  } catch {
    return [];
  }
  const vaults = [];
  for (const [id, v] of Object.entries(data.vaults || {})) {
    if (typeof v.path !== "string") continue;
    try {
      const manifest = JSON.parse(await readFile(join(v.path, ".obsidian/plugins/hanmark/manifest.json"), "utf8"));
      if (manifest.id === "hanmark") vaults.push({ id, path: resolve(v.path), version: manifest.version });
    } catch {
    }
  }
  return vaults;
}
async function selectVault(path, registryPath) {
  const candidates = await discoverVaults(registryPath);
  const selected = candidates.find((v) => v.path === resolve(path));
  if (!selected) fail("INVALID_VAULT", "Selected vault is not a registered HanMark vault");
  await mkdir(base, { recursive: true });
  await writeFile(configPath, JSON.stringify(selected, null, 2));
  return selected;
}
async function queueTemplate(path, options = {}) {
  const pack = await loadPack(path);
  await mkdir(join(base, "templates", pack.id), { recursive: true });
  const libraryFile = join(base, "templates", pack.id, pack.contentHash + ".kordoc-template.json");
  try {
    await writeFile(libraryFile, JSON.stringify(pack, null, 2), { flag: "wx" });
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
  }
  const candidates = await discoverVaults(options.registryPath);
  let target;
  if (options.vaultPath) target = await selectVault(options.vaultPath, options.registryPath);
  else {
    try {
      const saved = JSON.parse(await readFile(configPath, "utf8"));
      target = candidates.find((v) => v.path === saved.path);
    } catch {
    }
    if (!target && candidates.length === 1) target = await selectVault(candidates[0].path, options.registryPath);
  }
  if (!target) return { status: "pending", label: "\uC5F0\uB3D9 \uB300\uAE30", libraryFile, reason: candidates.length ? "SELECT_VAULT_REQUIRED" : "HANMARK_NOT_FOUND", candidates };
  const inbox = join(target.path, ".obsidian/plugins/hanmark/template-inbox");
  await mkdir(inbox, { recursive: true });
  const destination = join(inbox, pack.contentHash + ".kordoc-template.json"), ack = destination + ".result.json";
  try {
    return { ...JSON.parse(await readFile(ack, "utf8")), vault: target.path, libraryFile };
  } catch {
  }
  const temporary = destination + "." + process.pid + ".tmp";
  try {
    await writeFile(temporary, JSON.stringify(pack, null, 2), { flag: "wx" });
    try {
      await stat(destination);
      await unlink(temporary);
    } catch (e) {
      if (e.code === "ENOENT") await rename(temporary, destination);
      else throw e;
    }
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
  }
  return { status: "pending", label: "\uC5F0\uB3D9 \uB300\uAE30", contentHash: pack.contentHash, vault: target.path, inbox: destination, ack, libraryFile };
}
async function watchDownloads(directory, options = {}) {
  const { setTimeout: sleep } = await import("node:timers/promises");
  const seen = /* @__PURE__ */ new Map();
  for (; ; ) {
    for (const e of await readdir(directory, { withFileTypes: true })) {
      if (!e.isFile() || !e.name.endsWith(".kordoc-template.json")) continue;
      const p = join(directory, e.name), s = await stat(p), key = s.size + ":" + s.mtimeMs;
      if (seen.get(p) === key) continue;
      try {
        const result = await queueTemplate(p, options);
        seen.set(p, key);
        process.stdout.write(JSON.stringify({ file: p, ...result }) + "\n");
      } catch (e2) {
        process.stderr.write(JSON.stringify({ file: p, code: e2.code, message: e2.message }) + "\n");
      }
    }
    await sleep(options.intervalMs || 3e3);
  }
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const [action, path] = process.argv.slice(2);
  if (action === "watch") await watchDownloads(resolve(path));
  else if (action === "select") console.log(JSON.stringify(await selectVault(path)));
  else if (action === "queue") console.log(JSON.stringify(await queueTemplate(path)));
  else console.log(JSON.stringify(await discoverVaults()));
}
export {
  discoverVaults,
  queueTemplate,
  selectVault,
  watchDownloads
};
