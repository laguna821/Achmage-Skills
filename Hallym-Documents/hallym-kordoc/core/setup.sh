#!/bin/sh
set -eu
task_root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
task_node=$(command -v node || true)
if [ -n "$task_node" ] && ! "$task_node" -e 'process.exit(Number(process.versions.node.split(".")[0])>=20?0:1)'; then task_node=''; fi
if [ -z "$task_node" ]; then
 [ "${KORDOC_OFFLINE:-0}" != 1 ] || { echo 'Node >=20 missing in offline environment' >&2; exit 1; }
 case $(uname -s) in Linux) task_os=linux;; Darwin) task_os=darwin;; *) echo 'Unsupported OS' >&2; exit 1;; esac
 case $(uname -m) in x86_64) task_arch=x64;; aarch64|arm64) task_arch=arm64;; *) echo 'Unsupported CPU' >&2; exit 1;; esac
 case "$task_os-$task_arch" in
 linux-x64) task_sha=1084aa36196bba4c3a5e69a1ee388a6e4ff729dad09445fbcd434b28fe3c24af;;
 linux-arm64) task_sha=5ced2d48d1d7198739b7f86804de0171aefb6823b684b12341d3321afc3cb0b2;;
 darwin-x64) task_sha=8a677b0219178efd6eb0e475457c4afb452b521a92f6e67845a73bd85727f2a8;;
 darwin-arm64) task_sha=23b25245dcfb9af7262f8ff142e9e2e0af025368117329e7a7458a51e5922f53;;
 esac
 task_runtime="$HOME/.kordoc-workbench/runtimes/v22.23.3"
 task_name="node-v22.23.3-$task_os-$task_arch"
 task_node="$task_runtime/$task_name/bin/node"
 if [ ! -x "$task_node" ]; then
  mkdir -p "$task_runtime"
  task_archive="$task_runtime/$task_name.tar.gz"
  curl --fail --location --output "$task_archive" "https://nodejs.org/dist/v22.23.3/$task_name.tar.gz"
  if command -v sha256sum >/dev/null 2>&1; then task_actual=$(sha256sum "$task_archive" | cut -d ' ' -f1); else task_actual=$(shasum -a 256 "$task_archive" | cut -d ' ' -f1); fi
  [ "$task_actual" = "$task_sha" ] || { echo 'Node download hash mismatch' >&2; exit 1; }
  tar -xzf "$task_archive" -C "$task_runtime"
 fi
fi
if [ "${1:-}" = '--install' ]; then exec "$task_node" "$task_root/scripts/install.mjs" --codex --claude; fi
printf '%s\n' "$task_node"
