import os
import json
from pathlib import Path

# Đường dẫn đến thư mục images
images_dir = Path(r"d:\Code\photo-album\images")

# Các định dạng ảnh được hỗ trợ
image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}

# Duyệt qua tất cả các thư mục con
for folder in images_dir.iterdir():
    if folder.is_dir():
        # Lấy tất cả file ảnh trong thư mục
        image_files = []
        for file in folder.iterdir():
            if file.is_file() and file.suffix.lower() in image_extensions:
                image_files.append(file.name)
        
        # Sắp xếp theo tên
        image_files.sort()
        
        # Tạo file index.json
        if image_files:
            index_file = folder / 'index.json'
            with open(index_file, 'w', encoding='utf-8') as f:
                json.dump(image_files, f, ensure_ascii=False, indent=2)
            
            print(f"✓ Created {index_file} with {len(image_files)} images")
        else:
            print(f"✗ No images found in {folder.name}")

print("\n✅ Done! All index.json files created.")
