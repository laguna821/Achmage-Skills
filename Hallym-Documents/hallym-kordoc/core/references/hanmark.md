# Optional HanMark receiver

The independent engine is 4.18.13. The receiver change is based on HanMark2.7.0 with engine4.15.7; it does not upgrade that engine.

Local `scripts/hanmark.mjs` discovers registered Obsidian vaults and queues a validated pack into the plugin's template-inbox. One vault is automatic; multiple vaults require a first saved target choice. Running settings data.json is never edited externally.

The selected vault and private local library live in `~/.kordoc-workbench` across local clients. Set `KORDOC_WORKBENCH_STATE` to choose another state directory. Do not store private packs inside public skill archives.

Status: registered / exists / incompatible / pending (Korean UI equivalents 등록됨 / 이미 있음 / 호환 불가 / 연동 대기). A queued pack is pending until a receiver acknowledgment exists. Content hashes deduplicate; variants remain separate. Active general and official selections remain unchanged.

The next-version receiver migrates the template library to schema3 and stores optional pack metadata. It accepts styling that engine4.15.7 and its existing exports can represent. Required external assets or unsupported official options are reported incompatible. A downloaded web pack may be queued by the optional local download-folder watcher; this does not participate in web engine execution.
