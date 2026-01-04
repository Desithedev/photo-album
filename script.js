// Stock photos - will be loaded from local images folder
let stockPhotos = [];
let categories = [];

// Define categories based on user's actual folders
const categoryConfig = [
    { folder: 'Chùa-An-Dưỡng', name: 'Chùa An Dưỡng', icon: '🛕', color: '#FF6347' },
    { folder: 'Chùa-Long-Sơn', name: 'Chùa Long Sơn', icon: '⛩️', color: '#FFD700' },
    { folder: 'Chùa-Nghĩa-Sơn', name: 'Chùa Nghĩa Sơn', icon: '🏛️', color: '#FF8C00' },
    { folder: 'Chùa-Vĩnh-Thái', name: 'Chùa Vĩnh Thái', icon: '🕌', color: '#FF4500' },
    { folder: 'Chợ', name: 'Chợ', icon: '🏪', color: '#32CD32' },
    { folder: 'Dáng-Couple', name: 'Dáng Couple', icon: '💑', color: '#FF69B4' },
    { folder: 'Dáng-Thùy-Mị', name: 'Dáng Thùy Mị', icon: '👗', color: '#FF1493' },
    { folder: 'Dáng-sang', name: 'Dáng Sang', icon: '✨', color: '#9370DB' },
    { folder: 'Hòn-Chồng', name: 'Hòn Chồng', icon: '🏖️', color: '#1E90FF' },
];

// Load images from the images folder organized by categories
async function loadLocalImages() {
    const imageFolder = './images/';
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

    // Common image filenames to try
    const commonFilenames = [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
        '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png',
        'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg',
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg',
    ];

    const loadedImages = [];
    const loadedCategories = [];
    let imageId = 1;

    // Try to load images from each category folder
    for (const category of categoryConfig) {
        const categoryImages = [];

        for (const filename of commonFilenames) {
            const url = `${imageFolder}${category.folder}/${filename}`;
            const exists = await checkImageExists(url);

            if (exists) {
                const photo = {
                    id: imageId++,
                    url: url,
                    name: filename,
                    category: category.folder,
                    categoryName: category.name,
                    categoryIcon: category.icon
                };
                categoryImages.push(photo);
                loadedImages.push(photo);
            }
        }

        // If category has images, add it to the categories list
        if (categoryImages.length > 0) {
            loadedCategories.push({
                ...category,
                images: categoryImages,
                count: categoryImages.length
            });
        }
    }

    // If no images found in category folders, try root images folder
    if (loadedImages.length === 0) {
        for (const filename of commonFilenames) {
            const url = imageFolder + filename;
            const exists = await checkImageExists(url);

            if (exists) {
                loadedImages.push({
                    id: imageId++,
                    url: url,
                    name: filename,
                    category: 'other',
                    categoryName: 'Khác',
                    categoryIcon: '📷'
                });
            }
        }
    }

    // If still no images found, use fallback Unsplash images
    if (loadedImages.length === 0) {
        return {
            images: [
                { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop', name: 'Mountain Landscape', category: 'mountains', categoryName: 'Núi', categoryIcon: '⛰️' },
                { id: 2, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop', name: 'Forest Path', category: 'forest', categoryName: 'Rừng', categoryIcon: '🌲' },
                { id: 3, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop', name: 'Sunset Sky', category: 'sunset', categoryName: 'Hoàng hôn', categoryIcon: '🌅' },
                { id: 4, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop', name: 'Beach Paradise', category: 'beach', categoryName: 'Biển', categoryIcon: '🏖️' },
                { id: 5, url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop', name: 'City Lights', category: 'city', categoryName: 'Thành phố', categoryIcon: '🏙️' },
                { id: 6, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=800&fit=crop', name: 'Starry Night', category: 'night', categoryName: 'Đêm', categoryIcon: '🌙' },
            ],
            categories: [
                { folder: 'mountains', name: 'Núi', icon: '⛰️', count: 1 },
                { folder: 'forest', name: 'Rừng', icon: '🌲', count: 1 },
                { folder: 'sunset', name: 'Hoàng hôn', icon: '🌅', count: 1 },
                { folder: 'beach', name: 'Biển', icon: '🏖️', count: 1 },
                { folder: 'city', name: 'Thành phố', icon: '🏙️', count: 1 },
                { folder: 'night', name: 'Đêm', icon: '🌙', count: 1 },
            ]
        };
    }

    return {
        images: loadedImages,
        categories: loadedCategories
    };
}

// Check if an image exists
function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// State management
let photos = [];
let currentViewerIndex = 0;
let selectedStockPhotos = new Set();
let currentCategory = 'all'; // 'all' or specific category folder name

// DOM Elements
const stockGallery = document.getElementById('stockGallery');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const selectBtn = document.getElementById('selectBtn');
const photoCounter = document.getElementById('photoCounter');
const photoCount = document.getElementById('photoCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const viewAlbumBtn = document.getElementById('viewAlbumBtn');
const photosGrid = document.getElementById('photosGrid');
const gridContainer = document.getElementById('gridContainer');
const albumModal = document.getElementById('albumModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const viewerImage = document.getElementById('viewerImage');
const imageCounter = document.getElementById('imageCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const viewerThumbnails = document.getElementById('viewerThumbnails');

// Event Listeners
selectBtn.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('click', (e) => {
    if (e.target === uploadArea || e.target.closest('.upload-content')) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', handleFileSelect);

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleFiles(files);
});

clearAllBtn.addEventListener('click', clearAllPhotos);
viewAlbumBtn.addEventListener('click', openAlbumViewer);
modalClose.addEventListener('click', closeAlbumViewer);
modalOverlay.addEventListener('click', closeAlbumViewer);
prevBtn.addEventListener('click', showPreviousImage);
nextBtn.addEventListener('click', showNextImage);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (albumModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') showPreviousImage();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'Escape') closeAlbumViewer();
    }
});

// Functions
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

function handleFiles(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photo = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    url: e.target.result,
                    file: file
                };
                photos.push(photo);
                updateUI();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateUI() {
    // Update counter
    photoCount.textContent = photos.length;

    if (photos.length > 0) {
        photoCounter.style.display = 'block';
        photosGrid.style.display = 'block';
        renderPhotos();
    } else {
        photoCounter.style.display = 'none';
        photosGrid.style.display = 'none';
    }
}

function renderPhotos() {
    gridContainer.innerHTML = '';

    photos.forEach((photo, index) => {
        const card = createPhotoCard(photo, index);
        gridContainer.appendChild(card);
    });

    // Add drag and drop for reordering
    addDragAndDropHandlers();
}

function createPhotoCard(photo, index) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.draggable = true;
    card.dataset.id = photo.id;

    card.innerHTML = `
        <div class="photo-image-container">
            <img src="${photo.url}" alt="${photo.name}" class="photo-image">
            <div class="photo-overlay"></div>
            <div class="photo-actions">
                <button class="action-btn delete-btn" onclick="deletePhoto(${photo.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            <div class="photo-index">#${index + 1}</div>
        </div>
        <div class="photo-info">
            <div class="photo-name" title="${photo.name}">${photo.name}</div>
        </div>
    `;

    return card;
}

function deletePhoto(id) {
    const photo = photos.find(p => p.id === id);
    if (photo && photo.isStock) {
        selectedStockPhotos.delete(photo.stockId);
        renderStockGallery();
    }
    photos = photos.filter(photo => photo.id !== id);
    updateUI();
}

function clearAllPhotos() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả ảnh?')) {
        photos = [];
        selectedStockPhotos.clear();
        renderStockGallery();
        updateUI();
        fileInput.value = '';
    }
}

// Drag and Drop for reordering
let draggedElement = null;

function addDragAndDropHandlers() {
    const cards = document.querySelectorAll('.photo-card');

    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(gridContainer, e.clientY);
    if (afterElement == null) {
        gridContainer.appendChild(draggedElement);
    } else {
        gridContainer.insertBefore(draggedElement, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();

    // Update photos array based on new order
    const cards = Array.from(gridContainer.querySelectorAll('.photo-card'));
    const newPhotos = cards.map(card => {
        const id = parseFloat(card.dataset.id);
        return photos.find(photo => photo.id === id);
    });

    photos = newPhotos;
    updateUI();
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedElement = null;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.photo-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Album Viewer
function openAlbumViewer() {
    if (photos.length === 0) return;

    currentViewerIndex = 0;
    albumModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    renderViewer();
    renderThumbnails();
}

function closeAlbumViewer() {
    albumModal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderViewer() {
    if (photos.length === 0) return;

    const photo = photos[currentViewerIndex];
    viewerImage.src = photo.url;
    imageCounter.textContent = `${currentViewerIndex + 1} / ${photos.length}`;

    // Update navigation buttons
    prevBtn.disabled = currentViewerIndex === 0;
    nextBtn.disabled = currentViewerIndex === photos.length - 1;

    // Update active thumbnail
    updateActiveThumbnail();
}

function renderThumbnails() {
    viewerThumbnails.innerHTML = '';

    photos.forEach((photo, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === currentViewerIndex) {
            thumbnail.classList.add('active');
        }

        thumbnail.innerHTML = `<img src="${photo.url}" alt="${photo.name}">`;
        thumbnail.addEventListener('click', () => {
            currentViewerIndex = index;
            renderViewer();
        });

        viewerThumbnails.appendChild(thumbnail);
    });
}

function updateActiveThumbnail() {
    const thumbnails = viewerThumbnails.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentViewerIndex) {
            thumb.classList.add('active');
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            thumb.classList.remove('active');
        }
    });
}

function showPreviousImage() {
    if (currentViewerIndex > 0) {
        currentViewerIndex--;
        renderViewer();
    }
}

function showNextImage() {
    if (currentViewerIndex < photos.length - 1) {
        currentViewerIndex++;
        renderViewer();
    }
}

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

viewerImage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

viewerImage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPreviousImage();
        }
    }
}

// Stock Gallery Functions
function renderStockGallery() {
    stockGallery.innerHTML = '';

    // Filter photos by current category
    const filteredPhotos = currentCategory === 'all'
        ? stockPhotos
        : stockPhotos.filter(photo => photo.category === currentCategory);

    if (filteredPhotos.length === 0) {
        stockGallery.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p style="font-size: 1.2rem;">📷 Chưa có ảnh trong danh mục này</p>
                <p style="margin-top: 0.5rem;">Hãy thêm ảnh vào thư mục images/${currentCategory}/</p>
            </div>
        `;
        return;
    }

    filteredPhotos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'stock-photo-item';
        item.dataset.stockId = photo.id;

        if (selectedStockPhotos.has(photo.id)) {
            item.classList.add('selected');
        }

        item.innerHTML = `
            <img src="${photo.url}" alt="${photo.name}" loading="lazy">
            <div class="stock-photo-checkbox">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="photo-category-badge">
                <span class="badge-icon">${photo.categoryIcon}</span>
                <span class="badge-text">${photo.categoryName}</span>
            </div>
        `;

        item.addEventListener('click', () => toggleStockPhoto(photo));
        stockGallery.appendChild(item);
    });
}

function renderCategoryFilters() {
    const categoryFilters = document.getElementById('categoryFilters');
    const allButton = categoryFilters.querySelector('[data-category="all"]');

    // Update "All" count
    document.getElementById('count-all').textContent = stockPhotos.length;

    // Clear existing category tabs (except "All")
    const existingTabs = categoryFilters.querySelectorAll('.category-tab:not([data-category="all"])');
    existingTabs.forEach(tab => tab.remove());

    // Add category tabs
    categories.forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'category-tab';
        tab.dataset.category = category.folder;

        tab.innerHTML = `
            <span class="category-icon">${category.icon}</span>
            <span class="category-name">${category.name}</span>
            <span class="category-count">${category.count}</span>
        `;

        tab.addEventListener('click', () => {
            currentCategory = category.folder;
            updateCategoryTabs();
            renderStockGallery();
        });

        categoryFilters.appendChild(tab);
    });

    // Add click handler for "All" button
    allButton.addEventListener('click', () => {
        currentCategory = 'all';
        updateCategoryTabs();
        renderStockGallery();
    });
}

function updateCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        if (tab.dataset.category === currentCategory) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function toggleStockPhoto(stockPhoto) {
    if (selectedStockPhotos.has(stockPhoto.id)) {
        // Remove from selection
        selectedStockPhotos.delete(stockPhoto.id);
        photos = photos.filter(p => p.stockId !== stockPhoto.id);
    } else {
        // Add to selection
        selectedStockPhotos.add(stockPhoto.id);
        const photo = {
            id: Date.now() + Math.random(),
            stockId: stockPhoto.id,
            name: stockPhoto.name,
            url: stockPhoto.url,
            isStock: true
        };
        photos.push(photo);
    }

    renderStockGallery();
    updateUI();
}

// Initialize
async function init() {
    // Load images from local folder
    const data = await loadLocalImages();
    stockPhotos = data.images;
    categories = data.categories;

    console.log(`Loaded ${stockPhotos.length} images from ${categories.length} categories`);

    renderCategoryFilters();
    renderStockGallery();
    console.log('Photo Album App initialized');
}

// Start the app
init();
