// Photo Album App Logic

// Global State
let stockPhotos = [];
let categories = [];
let photos = [];
let currentViewerIndex = 0;
let selectedStockPhotos = new Set();
let currentCategory = 'all';

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
const categoryFilters = document.getElementById('categoryFilters');

// Category Configuration - Based on user's folder structure
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
    { folder: 'other', name: 'Khác', icon: '📷', color: '#808080' }
];

// --- Initialization ---

async function init() {
    console.log('Initializing Photo Album App...');

    // Load local images from folders
    const data = await loadLocalImages();
    stockPhotos = data.images;
    categories = data.categories;

    console.log(`Loaded ${stockPhotos.length} images across ${categories.length} categories.`);

    // Render initial UI
    renderCategoryFilters();
    renderStockGallery();
    updateUI();
}

// Start the app
init();

// --- Image Loading Logic ---

async function loadLocalImages() {
    const imageFolder = './images/';
    const loadedImages = [];
    const loadedCategories = [];
    let imageId = 1;

    // Helper: Filenames to try if index.json is missing
    const getCommonFilenames = () => {
        const names = [];
        const extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        // Try numbers 1 to 50
        for (let i = 1; i <= 50; i++) {
            extensions.forEach(ext => names.push(`${i}.${ext}`));
            extensions.forEach(ext => names.push(`image${i}.${ext}`));
        }
        return names;
    };

    // Iterate through each configured category
    for (const category of categoryConfig) {
        let imageFiles = [];
        const categoryImages = [];

        // 1. Try to load index.json (best method)
        try {
            const indexResponse = await fetch(`${imageFolder}${category.folder}/index.json`);
            if (indexResponse.ok) {
                imageFiles = await indexResponse.json();
            }
        } catch (e) {
            // checking failed, continue to fallback
        }

        // 2. Fallback: Try checking for common filenames if index.json failed
        if (!imageFiles || imageFiles.length === 0) {
            const potentialNames = getCommonFilenames();
            // We can't batch check easily without 404s, but we'll try a few confident ones 
            // or just rely on the ones we find. 
            // In a real static site without directory listing, this is trial and error.
            // But since we renamed images to 1.png etc, this is very effective now!

            // We will check them in parallel batches to speed it up
            const checkPromises = potentialNames.slice(0, 30).map(name =>
                checkImageExists(`${imageFolder}${category.folder}/${name}`).then(exists => exists ? name : null)
            );

            const results = await Promise.all(checkPromises);
            imageFiles = results.filter(name => name !== null);
        }

        // 3. Process found images
        for (const filename of imageFiles) {
            const url = `${imageFolder}${category.folder}/${filename}`;
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

        if (categoryImages.length > 0) {
            loadedCategories.push({
                ...category,
                images: categoryImages,
                count: categoryImages.length
            });
        }
    }

    // 4. Fallback if ABSOLUTELY no images found (e.g. fresh clone)
    if (loadedImages.length === 0) {
        return {
            images: [
                { id: 9991, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop', name: 'Example Mountain', category: 'Chùa-Long-Sơn', categoryName: 'Chùa Long Sơn', categoryIcon: '⛩️' },
                { id: 9992, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop', name: 'Example Beach', category: 'Hòn-Chồng', categoryName: 'Hòn Chồng', categoryIcon: '🏖️' }
            ],
            categories: [
                { folder: 'Chùa-Long-Sơn', name: 'Chùa Long Sơn', icon: '⛩️', count: 1 },
                { folder: 'Hòn-Chồng', name: 'Hòn Chồng', icon: '🏖️', count: 1 }
            ]
        };
    }

    return {
        images: loadedImages,
        categories: loadedCategories
    };
}

function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}


// --- Event Listeners & UI Handlers ---

// Upload / File Input
selectBtn.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('click', (e) => {
    if (e.target === uploadArea || e.target.closest('.upload-content')) fileInput.click();
});
fileInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));

// Drag & Drop Upload
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
});

// App Actions
const saveAlbumBtn = document.getElementById('saveAlbumBtn');
saveAlbumBtn.addEventListener('click', saveAlbum);

const exportAlbumBtn = document.getElementById('exportAlbumBtn');
exportAlbumBtn.addEventListener('click', exportAlbum);

clearAllBtn.addEventListener('click', clearAllPhotos);
viewAlbumBtn.addEventListener('click', openAlbumViewer);
modalClose.addEventListener('click', closeAlbumViewer);
modalOverlay.addEventListener('click', closeAlbumViewer);
prevBtn.addEventListener('click', showPreviousImage);
nextBtn.addEventListener('click', showNextImage);

// Keyboard
document.addEventListener('keydown', (e) => {
    if (albumModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') showPreviousImage();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'Escape') closeAlbumViewer();
    }
});

// --- Album Management Button Logic ---

function saveAlbum() {
    if (photos.length === 0) {
        alert('Album đang trống! Hãy thêm ảnh trước khi lưu.');
        return;
    }

    const albumName = prompt('Đặt tên cho Album của bạn:', `Album ${new Date().toLocaleDateString()}`);
    if (!albumName) return;

    try {
        const savedAlbums = JSON.parse(localStorage.getItem('savedAlbums') || '[]');

        // Remove old if overwriting
        const index = savedAlbums.findIndex(a => a.name === albumName);
        if (index !== -1) {
            if (!confirm(`Album "${albumName}" đã tồn tại. Bạn có muốn ghi đè không?`)) return;
            savedAlbums.splice(index, 1);
        }

        const albumData = {
            name: albumName,
            date: new Date().toISOString(),
            count: photos.length,
            items: photos.map(p => ({
                isStock: p.isStock || false,
                stockId: p.stockId,
                url: p.url,
                name: p.name,
                category: p.category
            }))
        };

        savedAlbums.push(albumData);
        localStorage.setItem('savedAlbums', JSON.stringify(savedAlbums));
        updateSavedAlbumsList();
        alert('✅ Đã lưu Album thành công vào trình duyệt!');
    } catch (e) {
        if (confirm('❌ Lỗi lưu trữ trình duyệt (có thể do quá đầy). Bạn có muốn TẢI VỀ máy không?')) {
            exportAlbum();
        }
        console.error(e);
    }
}

function exportAlbum() {
    if (photos.length === 0) return;

    const albumName = prompt('Đặt tên file để tải về:', `My-Photo-Album-${Date.now()}`);
    if (!albumName) return;

    const albumData = {
        name: albumName,
        createdAt: new Date().toISOString(),
        startSlideshow: true, // Marker to auto-start if possible
        items: photos.map(p => ({
            url: p.url,
            name: p.name,
            category: p.category
        }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(albumData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", albumName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Add import functionality? Maybe later. For now local users can just save json to keep safe.


function updateSavedAlbumsList() {
    const container = document.getElementById('savedAlbumsContainer');
    const list = document.getElementById('savedAlbumsList');
    const savedAlbums = JSON.parse(localStorage.getItem('savedAlbums') || '[]');

    if (savedAlbums.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';

    savedAlbums.forEach(album => {
        const date = new Date(album.date).toLocaleDateString();
        const card = document.createElement('div');
        card.className = 'saved-album-card';
        card.innerHTML = `
            <div class="saved-album-name">${album.name}</div>
            <div class="saved-album-info">
                <span>📷 ${album.count} ảnh</span> • 
                <span>📅 ${date}</span>
            </div>
            <button class="delete-album-btn" onclick="deleteAlbum('${album.name}', event)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-album-btn')) {
                loadAlbum(album);
            }
        });

        list.appendChild(card);
    });
}

function loadAlbum(album) {
    if (photos.length > 0) {
        if (!confirm('Bạn có muốn mở album này không? Album hiện tại sẽ bị xóa.')) return;
    }

    // Clear current
    photos = [];
    selectedStockPhotos.clear();

    // Reconstruct photos array
    album.items.forEach(item => {
        // If it's a stock photo, make sure we mark it selected
        if (item.isStock && item.stockId) {
            selectedStockPhotos.add(item.stockId);
        }

        photos.push({
            id: Date.now() + Math.random(),
            stockId: item.stockId,
            name: item.name,
            url: item.url,
            isStock: item.isStock,
            category: item.category
        });
    });

    renderStockGallery(); // Retrieve stock selection UI
    updateUI();

    // Scroll to album view
    document.getElementById('photoCounter').scrollIntoView({ behavior: 'smooth' });
}

// Global scope for HTML button
window.deleteAlbum = function (albumName, event) {
    event.stopPropagation();
    if (!confirm(`Bạn có chắc muốn xóa album "${albumName}" không?`)) return;

    const savedAlbums = JSON.parse(localStorage.getItem('savedAlbums') || '[]');
    const newAlbums = savedAlbums.filter(a => a.name !== albumName);
    localStorage.setItem('savedAlbums', JSON.stringify(newAlbums));
    updateSavedAlbumsList();
}

// Initial check
updateSavedAlbumsList();


// Category filtering
function renderCategoryFilters() {
    // Keep 'All' button and clear others
    const allBtn = categoryFilters.querySelector('[data-category="all"]');
    categoryFilters.innerHTML = '';
    categoryFilters.appendChild(allBtn);

    // Update 'All' count
    document.getElementById('count-all').textContent = stockPhotos.length;
    allBtn.onclick = () => setCategory('all');

    // Add buttons for each loaded category
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-tab';
        btn.dataset.category = cat.folder;
        if (currentCategory === cat.folder) btn.classList.add('active');

        btn.innerHTML = `
            <span class="category-icon">${cat.icon}</span>
            <span class="category-name">${cat.name}</span>
            <span class="category-count">${cat.count}</span>
        `;
        btn.onclick = () => setCategory(cat.folder);
        categoryFilters.appendChild(btn);
    });
}

function setCategory(category) {
    currentCategory = category;

    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        if (tab.dataset.category === category) tab.classList.add('active');
        else tab.classList.remove('active');
    });

    renderStockGallery();
}


function renderStockGallery() {
    stockGallery.innerHTML = '';

    const validPhotos = currentCategory === 'all'
        ? stockPhotos
        : stockPhotos.filter(p => p.category === currentCategory);

    if (validPhotos.length === 0) {
        stockGallery.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:#888;">Không có ảnh trong danh mục này</div>`;
        return;
    }

    validPhotos.forEach(photo => {
        const el = document.createElement('div');
        el.className = 'stock-photo-item';
        if (selectedStockPhotos.has(photo.id)) el.classList.add('selected');

        el.innerHTML = `
            <img src="${photo.url}" alt="${photo.name}" loading="lazy">
            <div class="stock-photo-checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            <div class="photo-category-badge">
                <span class="badge-icon">${photo.categoryIcon}</span>
                <span class="badge-text">${photo.categoryName}</span>
            </div>
        `;
        el.onclick = () => toggleStockPhoto(photo);
        stockGallery.appendChild(el);
    });
}

function toggleStockPhoto(photo) {
    if (selectedStockPhotos.has(photo.id)) {
        selectedStockPhotos.delete(photo.id);
        photos = photos.filter(p => p.stockId !== photo.id);
    } else {
        selectedStockPhotos.add(photo.id);
        photos.push({
            id: Date.now() + Math.random(),
            stockId: photo.id,
            name: photo.name,
            url: photo.url,
            isStock: true
        });
    }
    renderStockGallery();
    updateUI();
}


// --- Main Photo Management (Uploaded + Selected) ---

function handleFiles(files) {
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            photos.push({
                id: Date.now() + Math.random(),
                name: file.name,
                url: e.target.result,
                file: file
            });
            updateUI();
        };
        reader.readAsDataURL(file);
    });
}

function updateUI() {
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
        const item = document.createElement('div');
        item.className = 'photo-card';
        item.draggable = true;
        item.dataset.id = photo.id;
        item.innerHTML = `
            <div class="photo-image-container">
                <img src="${photo.url}" alt="${photo.name}" class="photo-image">
                <div class="photo-overlay"></div>
                <div class="photo-actions">
                    <button class="action-btn delete-btn" onclick="deleteLocalPhoto(${photo.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <div class="photo-index">#${index + 1}</div>
            </div>
        `;

        // Drag events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);

        gridContainer.appendChild(item);
    });
}

// Ensure global scope access for HTML onclick
window.deleteLocalPhoto = function (id) {
    const photo = photos.find(p => p.id === id);
    if (photo && photo.isStock) {
        selectedStockPhotos.delete(photo.stockId);
        renderStockGallery();
    }
    photos = photos.filter(p => p.id !== id);
    updateUI();
}

function clearAllPhotos() {
    if (confirm('Xóa tất cả ảnh?')) {
        photos = [];
        selectedStockPhotos.clear();
        renderStockGallery();
        updateUI();
        fileInput.value = '';
    }
}


// --- Drag & Drop Reordering ---

let draggedItem = null;
function handleDragStart() { draggedItem = this; this.classList.add('dragging'); }
function handleDragEnd() { this.classList.remove('dragging'); draggedItem = null; }
function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(gridContainer, e.clientY);
    if (afterElement == null) gridContainer.appendChild(draggedItem);
    else gridContainer.insertBefore(draggedItem, afterElement);
}
function handleDrop(e) {
    e.preventDefault();
    const newOrder = Array.from(gridContainer.children).map(c => photos.find(p => p.id == c.dataset.id));
    photos = newOrder;
    updateUI();
}
function getDragAfterElement(container, y) {
    return [...container.querySelectorAll('.photo-card:not(.dragging)')].reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return (offset < 0 && offset > closest.offset) ? { offset: offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// --- Album Viewer ---

function openAlbumViewer() {
    if (photos.length === 0) return;
    currentViewerIndex = 0;
    albumModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateViewer();
}

function closeAlbumViewer() {
    albumModal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateViewer() {
    const photo = photos[currentViewerIndex];
    viewerImage.src = photo.url;
    imageCounter.textContent = `${currentViewerIndex + 1} / ${photos.length}`;
    prevBtn.disabled = currentViewerIndex === 0;
    nextBtn.disabled = currentViewerIndex === photos.length - 1;

    // Thumbs
    viewerThumbnails.innerHTML = '';
    photos.forEach((p, i) => {
        const img = document.createElement('img');
        img.src = p.url;
        if (i === currentViewerIndex) {
            img.classList.add('active');
            img.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        img.onclick = () => { currentViewerIndex = i; updateViewer(); };
        viewerThumbnails.appendChild(img);
    });
}

function showPreviousImage() { if (currentViewerIndex > 0) { currentViewerIndex--; updateViewer(); } }
function showNextImage() { if (currentViewerIndex < photos.length - 1) { currentViewerIndex++; updateViewer(); } }
