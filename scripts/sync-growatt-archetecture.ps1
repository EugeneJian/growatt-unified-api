param(
  [string]$Token = $env:SHOWDOC_TOKEN,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (-not $Token) {
  throw "Missing ShowDoc token. Set SHOWDOC_TOKEN or pass -Token."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir

Push-Location $repoRoot
try {
  $env:SHOWDOC_TOKEN = $Token

  $args = @("scripts/sync-showdoc-project.mjs", "--project-dir", "Growatt-Archetecture")
  if ($DryRun) {
    $args += "--dry-run"
  }

  node @args
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}
