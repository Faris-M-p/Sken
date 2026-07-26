# Convert the tall Hero PNG into mobile-friendly AVIF + WebP.
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File .\convert-hero.ps1
#
# Prefers: magick (ImageMagick) → ffmpeg → npx sharp-cli

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'landing after video.png'
$out  = Join-Path $root 'assets\img'

if (-not (Test-Path -LiteralPath $src)) {
    Write-Host "MISSING source: $src" -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $out | Out-Null
$webp = Join-Path $out 'hero.webp'
$avif = Join-Path $out 'hero.avif'
$png  = Join-Path $out 'hero.png'

Write-Host "Source: $src ($([math]::Round((Get-Item -LiteralPath $src).Length/1KB)) KB)"

function Convert-WithMagick {
    magick "$src" -strip -resize "1600x>" -quality 78 "$webp"
    magick "$src" -strip -resize "1600x>" -quality 55 "$avif"
    magick "$src" -strip -resize "1600x>" -quality 82 "$png"
}

function Convert-WithFfmpeg {
    ffmpeg -y -i "$src" -vf "scale='min(1600,iw)':-2" -c:v libwebp -quality 78 "$webp" 2>$null
    ffmpeg -y -i "$src" -vf "scale='min(1600,iw)':-2" -c:v libaom-av1 -crf 35 -still-picture 1 "$avif" 2>$null
    Copy-Item -LiteralPath $src -Destination $png -Force
}

$ok = $false
if (Get-Command magick -ErrorAction SilentlyContinue) {
    Write-Host "Using ImageMagick..." -ForegroundColor Cyan
    Convert-WithMagick
    $ok = $true
} elseif (Get-Command ffmpeg -ErrorAction SilentlyContinue) {
    Write-Host "Using ffmpeg..." -ForegroundColor Cyan
    Convert-WithFfmpeg
    $ok = $true
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "Using npx sharp-cli..." -ForegroundColor Cyan
    npx --yes sharp-cli -i "$src" -o "$webp" resize 1600 --webp
    npx --yes sharp-cli -i "$src" -o "$avif" resize 1600 --avif
    Copy-Item -LiteralPath $src -Destination $png -Force
    $ok = $true
} else {
    Write-Host "No converter found. Copying PNG only — install ImageMagick or ffmpeg for AVIF/WebP." -ForegroundColor Yellow
    Copy-Item -LiteralPath $src -Destination $png -Force
}

Get-ChildItem -LiteralPath $out -Filter 'hero.*' | ForEach-Object {
    Write-Host ("  {0,-12} {1} KB" -f $_.Name, [math]::Round($_.Length/1KB))
}

Write-Host "`nDone. Refresh the site — it prefers hero.avif → hero.webp → PNG." -ForegroundColor Green
