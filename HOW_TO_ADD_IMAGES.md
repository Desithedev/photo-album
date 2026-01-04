# Hướng dẫn tạo file index.json cho mỗi thư mục ảnh

Để trang web có thể load ảnh của bạn, bạn cần tạo file `index.json` trong mỗi thư mục ảnh.

## Cách 1: Tự động (PowerShell)

Mở PowerShell và chạy lệnh sau:

```powershell
cd "d:\Code\photo-album"

$folders = Get-ChildItem "images" -Directory

foreach ($folder in $folders) {
    $files = Get-ChildItem $folder.FullName -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg|gif|webp|bmp)$' } | Select-Object -ExpandProperty Name
    
    if ($files.Count -gt 0) {
        $json = $files | ConvertTo-Json
        $json | Out-File -FilePath "$($folder.FullName)\index.json" -Encoding UTF8
        Write-Host "✓ Created index.json for $($folder.Name) with $($files.Count) files"
    }
}
```

## Cách 2: Thủ công

Tạo file `index.json` trong mỗi thư mục với nội dung là danh sách tên file ảnh:

```json
[
  "file1.png",
  "file2.png",
  "file3.jpg"
]
```

## Ví dụ

File `images/Chùa-Long-Sơn/index.json` đã được tạo sẵn làm mẫu.

Sau khi tạo xong, refresh lại trang web để xem ảnh!
