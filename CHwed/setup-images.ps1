# ============================================================
#  The Covenant — put the artwork in place
#
#  The eleven page illustrations were generated into Cursor's
#  project folder. This copies them into assets/img/ where the
#  site expects to find them.
#
#  Run once, from this folder:
#      powershell -ExecutionPolicy Bypass -File .\setup-images.ps1
# ============================================================

$ErrorActionPreference = 'Stop'

$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$target  = Join-Path $project 'assets\img'

# Cursor stores generated assets alongside the project metadata
$source = Join-Path $env:USERPROFILE '.cursor\projects\d-Faris-Work-Area-Sken-CHwed\assets'

$pages = @(
  'page-01-cover.png',
  'page-02-hero.png',
  'page-03-verse.png',
  'page-04-invitation.png',
  'page-05-countdown.png',
  'page-06-betrothal.png',
  'page-07-wedding.png',
  'page-08-reception.png',
  'page-09-venue.png',
  'page-10-blessings.png',
  'page-11-thankyou.png'
)

if (-not (Test-Path $source)) {
  Write-Host "Could not find the generated artwork at:" -ForegroundColor Yellow
  Write-Host "  $source"
  Write-Host ""
  Write-Host "Copy the eleven page-*.png files into assets\img\ by hand instead."
  exit 1
}

New-Item -ItemType Directory -Force -Path $target | Out-Null

$copied  = 0
$missing = @()

foreach ($page in $pages) {
  $from = Join-Path $source $page
  if (Test-Path $from) {
    Copy-Item $from -Destination (Join-Path $target $page) -Force
    $copied++
    Write-Host "  ok  $page" -ForegroundColor DarkGreen
  } else {
    $missing += $page
    Write-Host "  --  $page (not found)" -ForegroundColor DarkYellow
  }
}

Write-Host ""
Write-Host "$copied of $($pages.Count) illustrations placed in assets\img\" -ForegroundColor Green

if ($missing.Count -gt 0) {
  Write-Host "Still missing: $($missing -join ', ')" -ForegroundColor Yellow
}
