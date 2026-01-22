/**
 * CAMPUS EATS - CALABAR
 * Final Optimized Application Script
 */

// 1. State Management
let appData = { categories: [], vendors: [] };
let currentTheme = 'light';
let selectedCategory = 'all';
let cart = [];

// 2. Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();
    await loadData();
    
    // Initial UI Render
    renderCategories();
    renderVendors();
    updateVendorsTitle();
    
    setupEventListeners();
    loadCartFromStorage();
    
    // Expose functions to window for HTML onclick attributes
    window.updateQuantity = updateQuantity;
    window.addToCart = addToCart;
});

// 3. Data Management
async function loadData() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        appData = await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        const grid = document.getElementById('vendors-grid');
        if (grid) grid.innerHTML = `<p style="text-align:center; padding:2rem;">Unable to load menu. Please check your connection.</p>`;
    }
}

// 4. Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.body.className = `${currentTheme}-theme`;
    updateThemeIcons();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = `${currentTheme}-theme`;
    localStorage.setItem('theme', currentTheme);
    updateThemeIcons();
}

function updateThemeIcons() {
    const moonIcon = document.getElementById('theme-icon-moon');
    const sunIcon = document.getElementById('theme-icon-sun');
    if (!moonIcon || !sunIcon) return;

    if (currentTheme === 'light') {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    } else {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }
}

// 5. Event Listeners
function setupEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderVendors(e.target.value.toLowerCase());
        });
    }

    const menuButton = document.getElementById('menu-button');
    const menuDropdown = document.getElementById('menu-dropdown');
    if (menuButton && menuDropdown) {
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menuDropdown.classList.toggle('show');
        });
        document.addEventListener('click', () => menuDropdown.classList.remove('show'));
    }

    document.getElementById('cart-button').addEventListener('click', openCart);
    document.getElementById('cart-close').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('place-order').addEventListener('click', placeOrder);
}

// 6. Rendering Logic
function renderCategories() {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;
    
    categoriesList.innerHTML = '';
    appData.categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = `category-btn ${selectedCategory === category.id ? 'active' : ''}`;
        button.style.animationDelay = `${index * 0.05}s`;
        button.innerHTML = `
            <span class="category-emoji">${category.emoji}</span>
            <span>${category.name}</span>
        `;
        button.addEventListener('click', () => {
            selectedCategory = category.id;
            renderCategories();
            renderVendors();
            updateVendorsTitle();
        });
        categoriesList.appendChild(button);
    });
}

function renderVendors(searchTerm = '') {
    const vendorsGrid = document.getElementById('vendors-grid');
    if (!vendorsGrid) return;
    vendorsGrid.innerHTML = '';
    
    appData.vendors.forEach((vendor, vendorIndex) => {
        const filteredFoods = vendor.foods.filter(food => {
            const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
            const matchesSearch = food.name.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        if (filteredFoods.length > 0) {
            vendorsGrid.appendChild(createVendorCard(vendor, filteredFoods, vendorIndex));
        }
    });
}

function createVendorCard(vendor, foods, vendorIndex) {
    const card = document.createElement('div');
    card.className = 'vendor-card';
    card.style.animationDelay = `${vendorIndex * 0.1}s`;
    
    card.innerHTML = `
        <div class="vendor-image-container">
            <img src="${vendor.image}" alt="${vendor.name}" class="vendor-image">
            <div class="vendor-gradient"></div>
            <div class="vendor-rating">⭐ ${vendor.rating}</div>
            <div class="vendor-info">
                <h3 class="vendor-name">${vendor.name}</h3>
                <div class="vendor-delivery">🕒 ${vendor.deliveryTime}</div>
            </div>
        </div>
        <div class="vendor-foods">
            <div class="food-items">
                ${foods.map((food) => {
                    const foodJSON = JSON.stringify(food).replace(/"/g, '&quot;');
                    return `
                    <div class="food-item">
                        <img src="${food.image}" class="food-image" alt="${food.name}">
                        <div class="food-details">
                            <p class="food-name">${food.name}</p>
                            <p class="food-price">₦${food.price}</p>
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${foodJSON}, {name: '${vendor.name}'})">
                            ＋
                        </button>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
    return card;
}

function updateVendorsTitle() {
    const title = document.getElementById('vendors-title');
    if (!title) return;
    
    if (selectedCategory === 'all') {
        title.textContent = 'Popular Right Now 🔥';
    } else {
        const cat = appData.categories.find(c => c.id === selectedCategory);
        title.textContent = cat ? `${cat.emoji} ${cat.name}` : 'Menu';
    }
}

// 7. Cart Logic
function addToCart(food, vendor) {
    const existingItem = cart.find(item => item.id === food.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...food, vendorName: vendor.name, quantity: 1 });
    }
    updateCart();
    saveCartToStorage();
    
    const cartBtn = document.getElementById('cart-button');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = totalItems;
    cartCount.classList.toggle('hidden', totalItems === 0);

    if (cart.length === 0) {
        document.getElementById('cart-empty').classList.remove('hidden');
        document.getElementById('cart-footer').classList.add('hidden');
        cartItemsContainer.innerHTML = '';
    } else {
        document.getElementById('cart-empty').classList.add('hidden');
        document.getElementById('cart-footer').classList.remove('hidden');
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-vendor">${item.vendorName}</p>
                    <p class="cart-item-price">₦${item.price * item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
        `).join('');

        document.getElementById('cart-total').textContent = `₦${subtotal + 200}`;
    }
}

function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    } else {
        const item = cart.find(item => item.id === id);
        if (item) item.quantity = newQuantity;
    }
    updateCart();
    saveCartToStorage();
}

// 8. Storage & UI State
function saveCartToStorage() { localStorage.setItem('cart', JSON.stringify(cart)); }
function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) { cart = JSON.parse(saved); updateCart(); }
}

function openCart() { 
    document.getElementById('cart-sidebar').classList.add('show'); 
    document.getElementById('cart-overlay').classList.add('show'); 
    document.body.style.overflow = 'hidden';
}

function closeCart() { 
    document.getElementById('cart-sidebar').classList.remove('show'); 
    document.getElementById('cart-overlay').classList.remove('show'); 
    document.body.style.overflow = '';
}

function clearCart() { if(confirm('Clear your cart?')) { cart = []; updateCart(); saveCartToStorage(); } }
function placeOrder() { alert('Order Received! Your food will arrive at Malabor shortly!'); cart = []; updateCart(); saveCartToStorage(); closeCart(); }