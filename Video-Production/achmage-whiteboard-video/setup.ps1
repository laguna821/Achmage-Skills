$ErrorActionPreference = "Stop"
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
$SkillRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$VenvPath = Join-Path $SkillRoot ".venv"
$VenvPython = Join-Path $VenvPath "Scripts\python.exe"

if ((Test-Path $VenvPath) -and -not (Test-Path $VenvPython)) {
    $ResolvedVenv = [System.IO.Path]::GetFullPath($VenvPath)
    if (-not $ResolvedVenv.StartsWith([System.IO.Path]::GetFullPath($SkillRoot))) { throw "가상환경 경로가 안전하지 않습니다." }
    Remove-Item -LiteralPath $ResolvedVenv -Recurse -Force
}

if (Get-Command uv -ErrorAction SilentlyContinue) {
    if (-not (Test-Path $VenvPath)) {
        uv venv $VenvPath
        if ($LASTEXITCODE -ne 0) { throw "가상환경을 만들지 못했습니다." }
    }
    uv pip install --python $VenvPython -r (Join-Path $SkillRoot "requirements.lock")
    if ($LASTEXITCODE -ne 0) { throw "Python 의존성을 설치하지 못했습니다." }
} else {
    $Python = (Get-Command python -ErrorAction Stop).Source
    if (-not (Test-Path $VenvPath)) { & $Python -m venv $VenvPath }
    & (Join-Path $VenvPath "Scripts\python.exe") -m pip install --upgrade pip
    if ($LASTEXITCODE -ne 0) { throw "pip를 업데이트하지 못했습니다." }
    & (Join-Path $VenvPath "Scripts\python.exe") -m pip install -r (Join-Path $SkillRoot "requirements.lock")
    if ($LASTEXITCODE -ne 0) { throw "Python 의존성을 설치하지 못했습니다." }
}

& $VenvPython (Join-Path $SkillRoot "scripts\whiteboard.py") doctor
if ($LASTEXITCODE -ne 0) { throw "환경 진단을 통과하지 못했습니다." }
