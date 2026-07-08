<#
  export-cards.ps1 — render each .card in a cardnews-proof.html to a 1080x1440 PNG.

  Usage:
    ./export-cards.ps1                                  # exports the bundled example
    ./export-cards.ps1 -Proof path\to\cardnews-proof.html
    ./export-cards.ps1 -Proof ... -OutDir ...\export -Chrome "C:\path\chrome.exe"

  Model: Chrome CLI can't clip by selector, so each <section class="card">..</section>
  is wrapped in a standalone 1080x1440 doc (reusing the proof's <style>) and screenshotted.
  Temp docs are written next to the proof so relative cards/*.png paths still resolve.
  Input photos live in <proof>/cards/ ; exported cards go to <proof>/export/ (no collision).
#>
param(
  [string]$Proof = "$PSScriptRoot\examples\placeholder-proof.html",
  [string]$OutDir,
  [string]$Chrome,
  [int]$TimeBudget = 3000
)
$ErrorActionPreference = 'Stop'

$Proof = (Resolve-Path $Proof).Path
$proofDir = Split-Path $Proof -Parent
if (-not $OutDir) { $OutDir = Join-Path $proofDir 'export' }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

if (-not $Chrome) {
  $cands = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
  )
  $Chrome = $cands | Where-Object { Test-Path $_ } | Select-Object -First 1
}
if (-not $Chrome) { throw "Chrome/Edge not found. Pass -Chrome 'C:\path\to\chrome.exe'." }
Write-Host "Chrome : $Chrome"
Write-Host "Proof  : $Proof"
Write-Host "Output : $OutDir"

$html  = Get-Content -Raw -Encoding UTF8 $Proof
$style = [regex]::Match($html, '(?s)<style.*?</style>').Value
$cards = [regex]::Matches($html, '(?s)<section class="card.*?</section>')
if ($cards.Count -eq 0) { throw "No <section class=""card""> blocks found." }
Write-Host "Cards  : $($cards.Count)`n"

$enc = New-Object System.Text.UTF8Encoding($false)
$i = 0
foreach ($m in $cards) {
  $i++
  $n = '{0:D2}' -f $i
  $doc = "<!doctype html><html lang=""ko""><head><meta charset=""utf-8"">$style" +
         "<style>html,body{margin:0;padding:0}body{width:1080px;height:1440px;overflow:hidden;background:#0b0b0c}</style>" +
         "</head><body>$($m.Value)</body></html>"
  $tmp = Join-Path $proofDir "__export_tmp_$n.html"
  [System.IO.File]::WriteAllText($tmp, $doc, $enc)
  $out = Join-Path $OutDir "card$n.png"
  if (Test-Path $out) { Remove-Item $out -Force }
  $url = ([Uri]$tmp).AbsoluteUri
  # Start-Process avoids PS 5.1 treating Chrome's native stderr as a terminating error.
  $argList = "--headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 " +
             "--virtual-time-budget=$TimeBudget --screenshot=`"$out`" --window-size=1080,1440 `"$url`""
  Start-Process -FilePath $Chrome -ArgumentList $argList -Wait -NoNewWindow
  Remove-Item $tmp -Force
  if (Test-Path $out) { Write-Host "  OK  card$n.png" } else { Write-Host "  FAIL card$n.png" }
}
Write-Host "`nDone -> $OutDir ($($cards.Count) cards, 1080x1440)"
