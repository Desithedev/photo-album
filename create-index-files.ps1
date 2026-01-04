# Script tự động tạo index.json cho tất cả thư mục ảnh

$imagesPath = "d:\Code\photo-album\images"
$folders = Get-ChildItem $imagesPath -Directory

Write-Host "=== Tạo index.json cho các thư mục ảnh ===" -ForegroundColor Cyan
Write-Host ""

foreach ($folder in $folders) {
    Write-Host "Đang xử lý: $($folder.Name)..." -NoNewline
    
    # Lấy tất cả file ảnh
    $imageExtensions = @('*.png', '*.jpg', '*.jpeg', '*.gif', '*.webp', '*.bmp', '*.svg')
    $files = @()
    
    foreach ($ext in $imageExtensions) {
        $files += Get-ChildItem -Path $folder.FullName -Filter $ext -File | Select-Object -ExpandProperty Name
    }
    
    if ($files.Count -gt 0) {
        # Tạo JSON
        $json = $files | ConvertTo-Json
        
        # Lưu file
        $indexPath = Join-Path $folder.FullName "index.json"
        $json | Out-File -FilePath $indexPath -Encoding UTF8
        
        Write-Host " OK - Đã tạo với $($files.Count) ảnh" -ForegroundColor Green
    } else {
        Write-Host " SKIP - Không có ảnh" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Hoàn tất! ===" -ForegroundColor Cyan
Write-Host "Bây giờ bạn có thể mở index.html trong trình duyệt để xem ảnh." -ForegroundColor Green
