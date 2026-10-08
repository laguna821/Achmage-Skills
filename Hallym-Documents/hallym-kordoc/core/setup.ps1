param([switch]$Install)
$ErrorActionPreference = 'Stop'
$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($taskNode) { $taskVersion = & $taskNode -p 'Number(process.versions.node.split(".")[0])'; if ([int]$taskVersion -lt 20) { $taskNode = $null } }
if (-not $taskNode) {
    if ($env:KORDOC_OFFLINE -eq '1') { throw 'Node >=20 missing; offline setup cannot download it.' }
    $taskManifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'ASSETS.json') -Raw | ConvertFrom-Json
    $taskArch = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }
    $taskSpec = $taskManifest.nodes."win32-$taskArch"
    if (-not $taskSpec) { throw "No pinned Node runtime for win32-$taskArch" }
    $taskRuntime = Join-Path ([Environment]::GetFolderPath('UserProfile')) '.kordoc-workbench/runtimes/v22.23.3'
    $taskNode = Join-Path $taskRuntime $taskSpec.entry
    if (-not (Test-Path -LiteralPath $taskNode)) {
        New-Item -ItemType Directory -Path $taskRuntime -Force | Out-Null
        $taskZip = Join-Path $taskRuntime ($taskSpec.sha256 + '.zip')
        Invoke-WebRequest -Uri $taskSpec.url -OutFile $taskZip
        if ((Get-FileHash -LiteralPath $taskZip -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskSpec.sha256) { throw 'Node download hash mismatch' }
        Expand-Archive -LiteralPath $taskZip -DestinationPath $taskRuntime -Force
    }
}
if ($Install) { & $taskNode (Join-Path $PSScriptRoot 'scripts/install.mjs') --codex --claude; exit $LASTEXITCODE }
Write-Output $taskNode
