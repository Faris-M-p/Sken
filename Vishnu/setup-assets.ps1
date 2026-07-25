# ------------------------------------------------------------
#  Copies the three supplied assets into the folders the site
#  expects. Run once from the project root:
#      powershell -ExecutionPolicy Bypass -File .\setup-assets.ps1
# ------------------------------------------------------------

$root  = Split-Path -Parent $MyInvocation.MyCommand.Path
$imgIn = "C:\Users\faris\.cursor\projects\d-Faris-Work-Area-Sken-Vishnu\assets"

$imgOut = Join-Path $root 'assets\img'
$vidOut = Join-Path $root 'assets\video'
$galOut = Join-Path $root 'assets\img\gallery'

New-Item -ItemType Directory -Force -Path $imgOut, $vidOut, $galOut | Out-Null

function Copy-First($pattern, $destination, $label) {
    $hit = Get-ChildItem -Path $imgIn -Filter $pattern -File -ErrorAction SilentlyContinue |
           Select-Object -First 1
    if ($hit) {
        Copy-Item -LiteralPath $hit.FullName -Destination $destination -Force
        Write-Host "  OK   $label  ->  $destination" -ForegroundColor Green
    } else {
        Write-Host "  MISS $label  (no file matching '$pattern' in $imgIn)" -ForegroundColor Yellow
    }
}

Write-Host "`nImages" -ForegroundColor Cyan
Copy-First '*cover_entry*.png'         (Join-Path $imgOut 'cover.png')      'Landing cover'
Copy-First '*landing_after_video*.png' (Join-Path $imgOut 'hero.png')       'Hero background'
Copy-First '*WhatsApp*.png'            (Join-Path $imgOut 'invitation-card.png') 'Printed card (reference)'

Write-Host "`nVideo" -ForegroundColor Cyan
$video = Get-ChildItem -LiteralPath $root -Filter '*.mp4' -File -ErrorAction SilentlyContinue |
         Select-Object -First 1
if ($video) {
    Copy-Item -LiteralPath $video.FullName -Destination (Join-Path $vidOut 'invitation-reveal.mp4') -Force
    Write-Host "  OK   $($video.Name)  ->  assets\video\invitation-reveal.mp4" -ForegroundColor Green
} else {
    Write-Host "  MISS no .mp4 found in the project root" -ForegroundColor Yellow
}

Write-Host "`nDone. Serve the folder and open it in a browser:" -ForegroundColor Cyan
Write-Host "  python -m http.server 8080     (then http://localhost:8080)`n"
