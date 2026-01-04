# 🎉 Photo Album - Deployed!

Ứng dụng Album Ảnh của bạn đã được deploy lên GitHub Pages!

## 🌐 URL Trang Web

**Live Site:** https://desithedev.github.io/photo-album/

## 📦 Repository

**GitHub Repo:** https://github.com/Desithedev/photo-album

## 🚀 Đã Deploy

✅ Code đã được push lên GitHub  
✅ GitHub Pages đã được kích hoạt  
✅ Deploy từ branch `main`  
✅ Site đang được build...

## ⏳ Lưu ý

- Lần deploy đầu tiên có thể mất **2-5 phút** để hoàn tất
- Sau khi deploy xong, bạn có thể truy cập trang web qua URL ở trên
- Mỗi lần bạn push code mới lên GitHub, site sẽ tự động cập nhật

## 📸 Thêm Ảnh

**Lưu ý quan trọng:** Ảnh của bạn KHÔNG được push lên GitHub (do file quá lớn).

Để thêm ảnh vào trang web đã deploy:

### Cách 1: Sử dụng Unsplash (Khuyến nghị)
Trang web sẽ tự động hiển thị ảnh mẫu từ Unsplash nếu không tìm thấy ảnh local.

### Cách 2: Host ảnh ở nơi khác
1. Upload ảnh lên dịch vụ như Imgur, Cloudinary, hoặc Google Photos
2. Cập nhật file `index.json` trong mỗi thư mục với URL ảnh online
3. Push code lên GitHub

### Cách 3: Chạy local
Để xem ảnh của bạn, chạy trang web trên máy tính:
1. Mở file `index.html` trực tiếp trong trình duyệt
2. Hoặc dùng Live Server trong VS Code

## 🔄 Cập Nhật Code

Khi bạn muốn cập nhật code:

```bash
cd d:\Code\photo-album
git add .
git commit -m "Mô tả thay đổi"
git push
```

Site sẽ tự động cập nhật sau vài phút!

## 📝 Cấu Trúc Project

```
photo-album/
├── index.html          # Trang chính
├── style.css           # Giao diện
├── script.js           # Chức năng
├── images/             # Thư mục ảnh (local only)
│   ├── Chùa-Long-Sơn/
│   ├── Dáng-Thùy-Mị/
│   └── ...
├── create-index-files.ps1  # Script tạo index.json
└── README.md           # Hướng dẫn

```

## 🎨 Tính Năng

- ✨ Giao diện dark mode hiện đại
- 📁 Phân loại ảnh theo địa điểm
- 🖼️ Xem album dạng slideshow
- 📱 Responsive trên mọi thiết bị
- ⌨️ Điều hướng bằng phím tắt
- 🎯 Drag & drop để sắp xếp

---

**Tạo bởi Antigravity AI** 🚀
