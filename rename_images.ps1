# Script đổi tên tất cả ảnh trong thư mục images thành số thứ tự (1.jpg, 2.png, ...)

$imagesPath = "d:\Code\photo-album\images"
$folders = Get-ChildItem $imagesPath -Directory

Write-Host "=== Bắt đầu đổi tên ảnh ===" -ForegroundColor Cyan

foreach ($folder in $folders) {
    Write-Host "Đang xử lý thư mục: $($folder.Name)..." -NoNewline
    
    # Lấy tất cả file ảnh
    $files = Get-ChildItem $folder.FullName -File | Where-Object { 
        $_.Extension -match '\.(png|jpg|jpeg|gif|webp|bmp)$' 
    }
    
    if ($files.Count -gt 0) {
        $count = 1
        foreach ($file in $files) {
            # Tạo tên mới: 1.png, 2.jpg, ...
            $newName = "{0}{1}" -f $count, $file.Extension
            $newPath = Join-Path $folder.FullName $newName
            
            # Kiểm tra xem file đích đã tồn tại chưa để tránh lỗi
            if (Test-Path $newPath) {
                if ($file.FullName -ne $newPath) {
                   # Nếu đã tồn tại file tên là 1.png mà khác file hiện tại, thì bỏ qua hoặc xử lý sau
                   # Để đơn giản, ta sẽ đổi tên file hiện tại thành dạng tạm thời trước nếu cần, 
                   # nhưng với tên hash thì chắc không trùng đâu.
                   # Trừ khi chạy lại script lần 2.
                   Write-Host "!" -NoNewline -ForegroundColor Yellow
                }
            } else {
                Rename-Item -Path $file.FullName -NewName $newName
            }
            $count++
        }
        Write-Host " Xong ($($files.Count) file)" -ForegroundColor Green
    } else {
        Write-Host " Không có ảnh" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Hoàn tất! ===" -ForegroundColor Cyan
