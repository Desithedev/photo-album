# 📸 Album Ảnh - Photo Album Web App

Ứng dụng web tạo album ảnh đẹp mắt với giao diện hiện đại.

## ✨ Tính năng

### 🖼️ Thư viện ảnh có sẵn
- Tự động load ảnh từ thư mục `images/`
- Chọn/bỏ chọn ảnh bằng cách click
- Hiệu ứng đẹp mắt khi chọn ảnh

### 📤 Tải ảnh lên
- Kéo thả ảnh vào vùng upload
- Chọn nhiều ảnh cùng lúc
- Hỗ trợ các định dạng: JPG, PNG, GIF, WEBP, BMP, SVG

### 🎨 Quản lý Album
- Sắp xếp lại thứ tự ảnh bằng kéo thả
- Xóa từng ảnh hoặc xóa tất cả
- Xem album dưới dạng slideshow

### 🎬 Xem Album
- Chế độ xem toàn màn hình
- Điều hướng bằng phím mũi tên
- Vuốt trái/phải trên mobile
- Thumbnail navigation

## 🚀 Cách sử dụng

### 1. Thêm ảnh vào thư viện theo danh mục

Ứng dụng hỗ trợ phân loại ảnh theo địa điểm/chủ đề. Copy ảnh vào các thư mục tương ứng:

```
photo-album/
├── images/
│   ├── mountains/      # ⛰️ Ảnh núi
│   │   ├── 1.jpg
│   │   ├── 2.jpg
│   │   └── ...
│   ├── beach/          # 🏖️ Ảnh biển
│   │   ├── 1.jpg
│   │   └── ...
│   ├── forest/         # 🌲 Ảnh rừng
│   ├── city/           # 🏙️ Ảnh thành phố
│   ├── countryside/    # 🌾 Ảnh nông thôn
│   ├── sunset/         # 🌅 Ảnh hoàng hôn
│   ├── night/          # 🌙 Ảnh đêm
│   ├── animals/        # 🦁 Ảnh động vật
│   ├── flowers/        # 🌸 Ảnh hoa
│   ├── food/           # 🍜 Ảnh ẩm thực
│   ├── travel/         # ✈️ Ảnh du lịch
│   └── other/          # 📷 Ảnh khác
├── index.html
├── style.css
└── script.js
```

**Đặt tên file:** Sử dụng các mẫu sau để tự động nhận diện:
- `1.jpg`, `2.jpg`, `3.jpg`, ... `10.jpg`
- `1.png`, `2.png`, `3.png`, ... `10.png`
- `image1.jpg`, `image2.jpg`, ... `image10.jpg`
- `photo1.jpg`, `photo2.jpg`, ... `photo10.jpg`

### 2. Mở trang web

Mở file `index.html` trong trình duyệt:
- Double click vào file `index.html`
- Hoặc kéo thả file vào trình duyệt
- Hoặc dùng Live Server trong VS Code

### 3. Tạo album

1. **Lọc theo danh mục** - Click vào các tab danh mục (Núi, Biển, Rừng, v.v.) để xem ảnh theo chủ đề
2. **Chọn ảnh từ thư viện** - Click vào ảnh trong phần "Thư Viện Ảnh Có Sẵn"
3. **HOẶC tải ảnh lên** - Kéo thả hoặc chọn ảnh từ máy tính
4. **Sắp xếp** - Kéo thả để thay đổi thứ tự ảnh
5. **Xem album** - Nhấn nút "Xem Album" để xem slideshow

## 🎨 Giao diện

- **Dark Mode** - Giao diện tối hiện đại
- **Glassmorphism** - Hiệu ứng kính mờ đẹp mắt
- **Smooth Animations** - Chuyển động mượt mà
- **Responsive** - Tương thích mọi thiết bị

## 📁 Cấu trúc thư mục

```
photo-album/
├── images/           # Thư mục chứa ảnh của bạn
│   └── .gitkeep     # File giữ chỗ
├── index.html       # Trang chính
├── style.css        # Giao diện
├── script.js        # Chức năng
└── README.md        # Hướng dẫn
```

## 💡 Tips

- Ảnh sẽ tự động resize để phù hợp với giao diện
- Dùng phím `←` `→` để điều hướng trong album viewer
- Nhấn `ESC` để đóng album viewer
- Trên mobile, vuốt trái/phải để xem ảnh tiếp theo/trước đó

## 🔧 Yêu cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Không cần cài đặt thêm gì

---

**Tạo bởi Antigravity AI** 🚀
