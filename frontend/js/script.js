/* ============================================
   MAHESWARI INDUSTRIES - JavaScript
   ============================================ */

// Storage Keys
const PRODUCTS_KEY = 'mi_products_v2';
const MESSAGES_KEY = 'mi_messages_v2';
const USERS_KEY = 'mi_users_v2';
const SESSION_KEY = 'mi_session_v2';
const WISHLIST_KEY = 'mi_wishlist_v2';
const CART_KEY = 'mi_cart_v2';
const GALLERY_KEY = 'mi_gallery_v2';

const API_URL = "http://localhost:5000";

// Helper Functions
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const load = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
};
const setSession = (obj) => {
  obj.timestamp = Date.now();
  save(SESSION_KEY, obj);
};
const getSession = () => {
  const sess = load(SESSION_KEY);
  if (!sess) return null;

  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  if (sess.timestamp && (now - sess.timestamp) > thirtyMinutes) {
    localStorage.removeItem(SESSION_KEY);
    // Force a UI update if we are on a page that needs auth
    if (typeof checkSession === 'function') setTimeout(checkSession, 0);

    // Redirect admins if session expires
    if (window.location.pathname.includes('admin.html')) {
      window.location.href = 'index.html';
    }
    return null;
  }

  // Optionally update timestamp to sliding window (inactivity timeout)
  sess.timestamp = now;
  save(SESSION_KEY, sess);
  return sess;
};
const clearSession = () => localStorage.removeItem(SESSION_KEY);
const nextId = (list) => list?.length ? Math.max(...list.map(i => i.id || 0)) + 1 : 1;
const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

// Seed Data
(function initData() {
  if (!load(PRODUCTS_KEY)) {
    const categories = [
      { c: 'Living', s: 'Sofas', ss: ['Fabric Sofas', 'Wooden Sofas', 'L-Shaped Sofas', 'Sofa Cum Beds', 'Recliners'], kw: 'sofa' },
      { c: 'Living', s: 'Seating', ss: ['Lounge Chairs', 'Accent Chairs', 'Rocking Chairs', 'Bean Bags'], kw: 'chair' },
      { c: 'Living', s: 'Tables', ss: ['Coffee Tables', 'Side Tables', 'Nesting Tables', 'Console Tables'], kw: 'table' },
      { c: 'Bedroom', s: 'Beds', ss: ['King Size Beds', 'Queen Size Beds', 'Single Beds', 'Bunk Beds'], kw: 'bed' },
      { c: 'Bedroom', s: 'Storage', ss: ['Wardrobes', 'Chest of Drawers', 'Dressing Tables'], kw: 'closet' },
      { c: 'Bedroom', s: 'Mattresses', ss: ['Memory Foam', 'Spring Mattress'], kw: 'mattress' },
      { c: 'Dining', s: 'Dining Sets', ss: ['4 Seater', '6 Seater', '8 Seater'], kw: 'dining' },
      { c: 'Dining', s: 'Dining Furniture', ss: ['Dining Tables', 'Dining Chairs', 'Bar Stools'], kw: 'diningfurniture' },
      { c: 'Dining', s: 'Kitchen', ss: ['Kitchen Cabinets', 'Crockery Units'], kw: 'kitchen' },
      { c: 'Storage', s: 'Living Storage', ss: ['TV Units', 'Bookshelves', 'Shoe Racks'], kw: 'shelves' },
      { c: 'Storage', s: 'Cabinets', ss: ['Sideboards', 'Bar Cabinets'], kw: 'cabinet' },
      { c: 'Study', s: 'Work', ss: ['Desks', 'Chairs'], kw: 'office' }
    ];



    const unsplashIds = {
      'Sofas': ['1555041469-a586c61ea9bc', '1493663284031-b7e3aefcae8e', '1583847268964-b28dc2f51ac9', '1540518614846-7eded433c457', '1550254421-4603972a9497'],
      'Seating': ['1592078615290-033ee584e267', '1586023492125-27b2c045efd7', '1567538096630-e0c55bd6374c', '1581539250439-c96689b516dd', '1519947486511-16199f57d722'],
      'Tables': ['1533090481720-856c6e3c1fdc', '1594620302200-9a762244a156', '1572973413229-7977468160db', '1611269154421-4e27233ac5c7', '1532372320572-cda25653a26d'],
      'Beds': ['1505693416388-ac5ce068fe85', '1616627781431-23b776ec441f', '1632349389531-1557da0e0266', '1505693395921-87470d11f69b', '1522771739844-6a9f6d5f14af'],
      'Storage': ['1595428774223-ef52624120d2', '1616627781431-23b776ec441f', '1556228578-0021b12b504d', '1603511029875-9e623485703f', '1556228448-617811d52942'],
      'Mattresses': ['1631049307264-da0ec9d70304', '1631049521074-954eff3929f0', '1631049307289-4da0ec9d70304', '1631049307123-da0ec9d70304', '1631049307456-da0ec9d70304'],
      'Dining Sets': ['1560448205-4d9b3e6bb6db', '1617806118233-18e1de247200', '1615066390971-03e4e1c36ddf', '1604578762246-41134e37f9cc', '1617806118233-18e1de247200'],
      'Dining Furniture': ['1592078615290-033ee584e267', '1503602642458-232111445657', '1592078615291-033ee584e267', '1503602642459-232111445657', '1592078615292-033ee584e267'],
      'Kitchen': ['1556912172-34356a441ed7', '1556911228-36c1f7055012', '1556912173-34356a441ed7', '1556911229-36c1f7055012', '1556912174-34356a441ed7'],
      'Living Storage': ['1594620302200-9a762244a156', '1594620302201-9a762244a156', '1594620302202-9a762244a156', '1594620302203-9a762244a156', '1594620302204-9a762244a156'],
      'Cabinets': ['1595428774223-ef52624120d2', '1595428774224-ef52624120d2', '1595428774225-ef52624120d2', '1595428774226-ef52624120d2', '1595428774227-ef52624120d2'],
      'Work': ['1518455027359-f3f8164ba6bd', '1518455027360-f3f8164ba6bd', '1518455027361-f3f8164ba6bd', '1518455027362-f3f8164ba6bd', '1518455027363-f3f8164ba6bd'],
      'Floor': ['1507473885765-e6ed057f782c', '1507473885766-e6ed057f782c', '1507473885767-e6ed057f782c', '1507473885768-e6ed057f782c', '1507473885769-e6ed057f782c'],
      'Ceiling': ['1506161492572-c2453957f86d', '1506161492573-c2453957f86d', '1506161492574-c2453957f86d', '1506161492575-c2453957f86d', '1506161492576-c2453957f86d'],
      'Wall': ['1507473885765-e6ed057f782c', '1507473885766-e6ed057f782c', '1507473885767-e6ed057f782c', '1507473885768-e6ed057f782c', '1507473885769-e6ed057f782c'],
      'default': ['1524758631624-e2822e304c36', '1555041469-a586c61ea9bc', '1505693416388-ac5ce068fe85']
    };

    const products = [];
    let pId = 1;

    categories.forEach(cat => {
      cat.ss.forEach(ss => {
        const imgBank = unsplashIds[cat.s] || unsplashIds['default'];
        for (let i = 0; i < 5; i++) {
          const imgId = imgBank[i % imgBank.length];
          products.push({
            id: pId++,
            title: `Premium ${ss} Style ${i + 1}`,
            category: cat.c,
            subcategory: cat.s,
            subSubcategory: ss,
            price: 15000 + (i * 2000),
            originalPrice: 20000 + (i * 3000),
            img: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=800&q=80`,
            desc: `High-quality ${ss} specifically designed for modern comfort.`,
            rating: 0,
            reviews: 0,
            isNew: i === 0,
            isSale: i === 1,
            sizes: ['Standard']
          });
        }
      });
    });

    save(PRODUCTS_KEY, products);
  }


  if (!load(USERS_KEY)) {
    const users = [
      { id: 1, username: 'admin', email: 'admin@maheswari.com', password: 'Admin123', name: 'Administrator', phone: '9999999999', city: 'Coimbatore', isAdmin: true, createdAt: new Date().toISOString() },
      { id: 2, username: 'user', email: 'user@example.com', password: 'User123', name: 'Demo User', phone: '9876543210', city: 'Chennai', isAdmin: false, createdAt: new Date().toISOString() }
    ];
    save(USERS_KEY, users);
  }

  if (!load(MESSAGES_KEY)) save(MESSAGES_KEY, []);
  if (!load(WISHLIST_KEY)) save(WISHLIST_KEY, []);
  if (!load(CART_KEY)) save(CART_KEY, []);
  if (!load(GALLERY_KEY)) save(GALLERY_KEY, []);
})();

// ============================================
// ADMIN PRODUCT MANAGEMENT
// ============================================
function addProduct(e) {
  e.preventDefault();

  const title = document.getElementById('prodTitle').value.trim();
  const category = document.getElementById('prodCat').value;
  const fileInput = document.getElementById('prodImg');

  if (!title || !category) {
    showNotification('Please fill all required fields', 'error');
    return;
  }

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const products = load(PRODUCTS_KEY) || [];
      const newProduct = {
        id: nextId(products),
        title,
        category,
        img: event.target.result,
        desc: title,
        rating: 0,
        reviews: 0,
        isNew: true,
        isSale: true,
        createdAt: new Date().toISOString()
      };

      products.push(newProduct);
      save(PRODUCTS_KEY, products);

      // Reset form
      document.getElementById('addProductForm')?.reset();
      closeAddProductModal();

      showNotification('Product added successfully!');

      // Refresh admin dashboard if function exists
      if (typeof renderAdminDashboard === 'function') {
        renderAdminDashboard();
      }
    };

    reader.readAsDataURL(file);
  } else {
    showNotification('Please select an image', 'error');
  }
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    let products = load(PRODUCTS_KEY) || [];
    products = products.filter(p => p.id !== id);
    save(PRODUCTS_KEY, products);

    // Also remove from cart if present
    let cart = load(CART_KEY) || [];
    cart = cart.filter(item => item.id !== id);
    save(CART_KEY, cart);

    // Also remove from wishlist if present
    let wishlist = load(WISHLIST_KEY) || [];
    wishlist = wishlist.filter(itemId => itemId !== id);
    save(WISHLIST_KEY, wishlist);

    showNotification('Product deleted successfully!');

    // Refresh displays
    if (typeof renderAdminDashboard === 'function') {
      renderAdminDashboard();
    }
    renderProducts();
    updateCartCount();
    updateWishlistCount();
  }
}

function deleteMessage(id) {
  if (confirm('Are you sure you want to delete this message?')) {
    let messages = load(MESSAGES_KEY) || [];
    messages = messages.filter(m => m.id !== id);
    save(MESSAGES_KEY, messages);

    showNotification('Message deleted successfully!');

    if (typeof renderAdminDashboard === 'function') {
      renderAdminDashboard();
    }
  }
}

function updateMessageStatus(id, status) {
  let messages = load(MESSAGES_KEY) || [];
  const message = messages.find(m => m.id === id);

  if (message) {
    message.status = status;
    save(MESSAGES_KEY, messages);
    showNotification(`Message marked as ${status}`);

    if (typeof renderAdminMessages === 'function') {
      renderAdminMessages();
    }
  }
}

// ============================================
// HERO SLIDER
// ============================================
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');

function goToSlide(index) {
  slides[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.classList.remove('active');

  currentSlide = index;
  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;

  slides[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('active');
}

function changeSlide(direction) {
  goToSlide(currentSlide + direction);
}

// Auto slide
setInterval(() => changeSlide(1), 5000);

// ============================================
// PRODUCTS
// ============================================
let currentProducts = [];
let currentCategory = '';
let currentSubcategory = '';

async function loadSubcategories(category) {
  const container = document.getElementById('subCategoryChips');
  if (!container) return;

  if (!category) {
    container.innerHTML = '<span class="no-subcategory">Select a category to see subcategories</span>';
    return;
  }

  container.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i></span>';

  try {
    const res = await fetch(`${API_URL}/subcategories/${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const subcats = await res.json();

    if (!subcats || subcats.length === 0) {
      container.innerHTML = '<span class="no-subcategory">No subcategories found for this category</span>';
      return;
    }

    let html = `<span class="filter-chip ${!currentSubcategory ? 'active' : ''}" onclick="selectSubcategory('')">All</span>`;
    subcats.forEach(sc => {
      html += `<span class="filter-chip ${currentSubcategory === sc ? 'active' : ''}" onclick="selectSubcategory('${sc}')">${sc}</span>`;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error("Fetch Error (Subcategories):", err);
    container.innerHTML = '<span class="no-subcategory">Could not load subcategories. Please try again later.</span>';
  }
}

function selectSubcategory(sc) {
  currentSubcategory = sc;
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.classList.toggle('active', chip.textContent === (sc || 'All'));
  });
  applyFilters();
}

function applyFilters() {
  const maxPrice = document.getElementById('maxPriceRange')?.value;
  const sortBy = document.getElementById('sortProducts')?.value;

  if (document.getElementById('priceDisplay')) {
    const formatted = maxPrice >= 100000 ? '₹1,00,000+' : `₹${parseInt(maxPrice).toLocaleString()}`;
    document.getElementById('priceDisplay').textContent = formatted;
  }

  renderProducts(currentCategory, currentSubcategory, '', '', {
    minPrice: 0,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    sort: sortBy
  });
}

function clearFilters() {
  currentSubcategory = '';
  const priceRange = document.getElementById('maxPriceRange');
  const sortSelect = document.getElementById('sortProducts');

  if (priceRange) priceRange.value = 100000;
  if (sortSelect) sortSelect.value = 'default';

  const priceDisplay = document.getElementById('priceDisplay');
  if (priceDisplay) priceDisplay.textContent = '₹1,00,000+';

  loadSubcategories(currentCategory);
  applyFilters();
}

async function loadDynamicCategories() {
  try {
    // Fetch categories from API
    let categories = [];
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        categories = await res.json();
      }
    } catch (e) {
      console.warn("Failed to fetch categories from API");
    }

    // If API fails, extract from products
    if (categories.length === 0) {
      let products = [];
      try {
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) products = await res.json();
      } catch (e) {
        console.warn("Failed to fetch products for categories");
      }

      // Fallback to local storage if server returns empty
      if (products.length === 0) {
        products = load(PRODUCTS_KEY) || [];
      }

      // Extract unique categories from products
      const catSet = new Set();
      products.forEach(p => {
        if (p.category) catSet.add(p.category);
      });
      categories = Array.from(catSet);
    }

    // Sort categories with predefined order
    const catOrder = ['Living', 'Bedroom', 'Dining', 'Storage', 'Seating', 'Study'];
    categories.sort((a, b) => {
      const aIndex = catOrder.indexOf(a);
      const bIndex = catOrder.indexOf(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    // Build navbar
    await buildNavbar(categories);

    // Generate category tabs
    const tabContainer = document.querySelector('.category-tabs');
    if (tabContainer) {
      let tabsHTML = '<button class="tab-btn active" data-category="" onclick="filterProducts(\'\')">All</button>';

      categories.forEach(cat => {
        const displayName = cat === 'Living' ? 'Living Room' : cat;
        tabsHTML += `<button class="tab-btn" data-category="${cat}" onclick="filterProducts('${cat}')">${displayName}</button>`;
      });

      tabContainer.innerHTML = tabsHTML;
    }

    // Store categories for use in other places
    window.availableCategories = categories;
  } catch (err) {
    console.error("Error loading dynamic categories:", err);
  }
}

async function buildNavbar(categories) {
  const navList = document.querySelector('.nav-list');
  if (!navList) return;

  try {
    // Fetch all products to get subcategories
    const res = await fetch(`${API_URL}/products`);
    const products = res.ok ? await res.json() : [];

    let navHTML = '';

    for (const category of categories) {
      // Get subcategories for this category
      let subcategories = [];
      const categoryProducts = products.filter(p => p.category === category);
      const subSet = new Set();
      categoryProducts.forEach(p => {
        if (p.subcategory) subSet.add(p.subcategory);
      });
      subcategories = Array.from(subSet).sort();

      // Get icon for category
      const icons = {
        'Living': 'fas fa-couch',
        'Bedroom': 'fas fa-bed',
        'Dining': 'fas fa-utensils',
        'Storage': 'fas fa-archive',
        'Seating': 'fas fa-chair',
        'Study': 'fas fa-laptop',
        'Hospitals': 'fas fa-hospital',
        'School/College': 'fas fa-university'
      };
      const icon = icons[category] || 'fas fa-box';

      // Build dropdown/mega menu only for these categories
      const noDropdownCategories = ['Study', 'Hospital', 'School / College'];
      const hasSubcategories = subcategories.length > 0 && !noDropdownCategories.includes(category);

      if (hasSubcategories) {
        navHTML += `
          <li class="nav-item has-mega">
            <a href="#"><i class="${icon}"></i> ${category} <i class="fas fa-chevron-down"></i></a>
            <div class="mega-menu">
        `;

        // Create mega columns for subcategories
        subcategories.slice(0, 3).forEach(subcategory => {
          navHTML += `
              <div class="mega-column">
                <h4>${subcategory}</h4>
          `;

          // Get 3-4 sub-subcategories for each subcategory
          const subProducts = categoryProducts.filter(p => p.subcategory === subcategory);
          const subSubSet = new Set();
          subProducts.forEach(p => {
            if (p.subSubcategory) subSubSet.add(p.subSubcategory);
          });
          const subSubs = Array.from(subSubSet).slice(0, 4);

          subSubs.forEach(subSub => {
            const safeSubSub = subSub.replace(/'/g, "\\'");
            navHTML += `
                <a href="#collections" onclick="filterByCategory('${category}', '${subcategory}', '${safeSubSub}', event)">${subSub}</a>
            `;
          });

          navHTML += `
              </div>
          `;
        });

        // Add promo column
        const promoImages = {
          'Living': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=60',
          'Bedroom': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=60',
          'Dining': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=60',
          'Storage': 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=400&q=60'
        };

        const promoImage = promoImages[category] || promoImages['Living'];
        navHTML += `
              <div class="mega-column mega-promo">
                <img src="${promoImage}" alt="${category}">
                <h4>New Arrivals</h4>
                <p>${category} Collections</p>
              </div>
            </div>
          </li>
        `;
      } else {
        // Simple link for categories without subcategories
        navHTML += `
          <li class="nav-item">
            <a href="#collections" onclick="filterByCategory('${category}', event)"><i class="${icon}"></i> ${category}</a>
          </li>
        `;
      }
    }

    // Add Sale item at the end
    navHTML += `
      <li class="nav-item sale-item">
        <a href="#" style="color: #ef4444; font-weight: bold;"><i class="fas fa-percentage"></i> SALE</a>
      </li>
    `;

    navList.innerHTML = navHTML;
  } catch (err) {
    console.error("Error building navbar:", err);
  }
}

async function renderProducts(category = '', subcategory = '', subSubcategory = '', searchText = '', filters = {}) {
  const container = document.getElementById('productGrid');
  if (!container) return;

  container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';

  try {
    let products = [];
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      products = await res.json();
      // Only update local storage if we got real data
      if (products && products.length > 0) {
        save(PRODUCTS_KEY, products);
      }
    } catch (e) {
      console.warn("Fetch Error (Products):", e);
      products = load(PRODUCTS_KEY) || [];
    }

    container.innerHTML = '';

    currentProducts = products;

    let filtered = products.filter(p => {
      const pCat = p.category || '';
      const pSubCat = p.subcategory || '';
      const pSubSubCat = p.subSubcategory || '';
      const pTitle = p.title || '';
      const pDesc = p.desc || '';

      const matchesCat = category ? pCat.toLowerCase().trim() === category.toLowerCase().trim() : true;
      const matchesSubCat = subcategory ? pSubCat.toLowerCase().trim() === subcategory.toLowerCase().trim() : true;
      const matchesSubSubCat = subSubcategory ? pSubSubCat.toLowerCase().trim() === subSubcategory.toLowerCase().trim() : true;

      const matchesSearch = searchText ?
        pTitle.toLowerCase().startsWith(searchText.toLowerCase()) ||
        pDesc.toLowerCase().startsWith(searchText.toLowerCase()) ||
        pCat.toLowerCase().startsWith(searchText.toLowerCase()) ||
        pSubCat.toLowerCase().startsWith(searchText.toLowerCase()) ||
        pSubSubCat.toLowerCase().startsWith(searchText.toLowerCase()) : true;

      const matchesMinPrice = filters.minPrice ? (p.price || 0) >= filters.minPrice : true;
      const matchesMaxPrice = filters.maxPrice ? (p.price || 0) <= filters.maxPrice : true;

      return matchesCat && matchesSubCat && matchesSubSubCat && matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    // Apply Sorting
    if (filters.sort && filters.sort !== 'default') {
      filtered.sort((a, b) => {
        if (filters.sort === 'price-low') return (a.price || 0) - (b.price || 0);
        if (filters.sort === 'price-high') return (b.price || 0) - (a.price || 0);
        if (filters.sort === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (filters.sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0;
      });
    }

    // Limit to 2 products per category if viewing "All" with no search text
    if (!category && !searchText) {
      const limited = [];
      const catCounts = {};
      filtered.forEach(p => {
        const cat = p.category || 'Other';
        if (!catCounts[cat]) catCounts[cat] = 0;
        if (catCounts[cat] < 2) {
          limited.push(p);
          catCounts[cat]++;
        }
      });
      filtered = limited;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="cart-empty" style="grid-column: 1/-1;">
          <i class="fas fa-search"></i>
          <h3>No products found</h3>
          <p>Try a different category or search term</p>
        </div>
      `;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      // Support both Base64 and URLs
      let imgSrc = 'https://via.placeholder.com/300x250?text=No+Image';
      if (p.img) {
        imgSrc = p.img.startsWith('http') || p.img.startsWith('data:') ? p.img : `data:image/jpeg;base64,${p.img}`;
      }

      card.innerHTML = `
        <div class="product-image" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor: pointer;">
          <img src="${imgSrc}" alt="${p.title}">
          <div class="product-badges">
            ${p.isSale ? `<span class="badge badge-sale">SALE</span>` : ''}
            ${p.isNew ? `<span class="badge badge-new">NEW</span>` : ''}
            ${p.status === 'Out-of-stock' ? `<span class="badge badge-outofstock" style="background: #fee2e2; color: #dc2626;">OUT OF STOCK</span>` : `<span class="badge badge-instock" style="background: #dcfce7; color: #16a34a;">IN STOCK</span>`}
          </div>
          <div class="product-actions">
            <button class="action-btn" onclick="event.stopPropagation(); addToWishlist('${p.id}')" title="Add to Wishlist">
              <i class="fas fa-heart"></i>
            </button>
            <button class="action-btn" onclick="event.stopPropagation(); sendProductMail('${p.id}')" title="Send Email">
              <i class="fas fa-envelope"></i>
            </button>
          </div>
          <button class="quick-add" onclick="event.stopPropagation(); addToCart('${p.id}')" ${p.status === 'Out-of-stock' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            <i class="fas fa-shopping-cart"></i> ${p.status === 'Out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title"><a href="product-detail.html?id=${p.id}">${p.title}</a></h3>
          <p class="product-desc">${p.desc || ''}</p>
          ${p.sizes && p.sizes.length > 0 ? `
          <div class="product-sizes">
            ${p.sizes.map(size => `<span class="size-chip">${size}</span>`).join('')}
          </div>` : ''}
          <div class="product-rating">
            <div class="stars">
               ${generateStars(p.rating || 0)}
            </div>
            <span>(${p.reviews || 0} Reviews)</span>
          </div>
          <div class="product-price" style="display: flex; align-items: center; gap: 10px;">
            <span class="current-price">₹${(p.price || 0).toLocaleString()}</span>
            ${p.originalPrice ? `<span class="original-price" style="text-decoration: line-through; color: var(--text-light); font-size: 0.9rem;">₹${p.originalPrice.toLocaleString()}</span>` : ''}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error rendering products:", err);
    container.innerHTML = '<div style="grid-column: 1/-1; color: var(--danger);">An error occurred while loading products.</div>';
  }
}


function generateStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (hasHalf) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  return stars;
}

function filterProducts(category) {
  currentCategory = category;
  currentSubcategory = ''; // Reset subcategory when switching main category

  // Clear search input if switching categories via tabs
  const headerSearch = document.getElementById('headerSearch');
  if (headerSearch) headerSearch.value = '';

  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  // Load subcategories for this category
  loadSubcategories(category);

  renderProducts(category);
}

function filterByCategory(category, subcategory = '', subSubcategory = '', e) {
  // Handle optional arguments and event object
  if (typeof subcategory !== 'string') {
    e = subcategory;
    subcategory = '';
  }
  if (typeof subSubcategory !== 'string') {
    e = subSubcategory;
    subSubcategory = '';
  }
  if (e && e.preventDefault) e.preventDefault();

  const mainCategories = ['Living', 'Bedroom', 'Dining', 'Storage', 'Study', 'Hospital', 'School / College'];

  let searchVal = '';
  let categoryVal = '';

  if (mainCategories.includes(category)) {
    categoryVal = category;
    // Clear search input if switching to a main category
    const headerSearch = document.getElementById('headerSearch');
    if (headerSearch) headerSearch.value = '';
  } else {
    searchVal = category;
    // Update search input to show what is being searched
    const headerSearch = document.getElementById('headerSearch');
    if (headerSearch) headerSearch.value = category;
  }

  currentCategory = categoryVal;

  // Scroll to products section with a small offset for better visibility
  const collectionsSection = document.getElementById('collections');
  if (collectionsSection) {
    const offset = 80; // Offset for sticky header
    const top = collectionsSection.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Update tabs and render
  setTimeout(() => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === categoryVal);
    });

    // Load subcategories for the selected category
    loadSubcategories(categoryVal);

    renderProducts(categoryVal, subcategory, subSubcategory, searchVal);
  }, 500);
}

// ============================================
// CART
// ============================================
async function addToCart(id) {
  const sess = getSession();
  if (!sess) {
    showNotification('Please login to add items to cart', 'error');
    openAuth('login');
    return;
  }

  // Check if product is in stock
  const allProducts = load(PRODUCTS_KEY) || [];
  const product = allProducts.find(p => p.id.toString() === id.toString());

  if (product && product.status === 'Out-of-stock') {
    showNotification('This product is currently out of stock', 'error');
    return;
  }

  let cart = load(CART_KEY) || [];
  const existing = cart.find(x => x.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  save(CART_KEY, cart);
  updateCartCount();
  showNotification('Added to cart!');

  // Sync with backend if logged in
  if (sess) {
    await syncCartWithBackend(sess.id, cart);
  }
}

async function syncCartWithBackend(userId, cart) {
  try {
    const backendCart = cart.map(item => ({ productId: item.id, qty: item.qty }));
    await fetch(`${API_URL}/users/${userId}/cart`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: backendCart })
    });
  } catch (err) {
    console.error("Cart sync failed", err);
  }
}

async function syncWishlistWithBackend(userId, wishlist) {
  try {
    await fetch(`${API_URL}/users/${userId}/wishlist`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wishlist })
    });
  } catch (err) {
    console.error("Wishlist sync failed", err);
  }
}

function updateCartCount() {
  const cart = load(CART_KEY) || [];
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;
}

async function renderCart() {
  const cart = load(CART_KEY) || [];
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (!container) return;
  container.innerHTML = '<div style="text-align: center; padding: 1rem;"><i class="fas fa-spinner fa-spin"></i></div>';

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
      </div>
    `;
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  try {
    let allProducts = [];
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) allProducts = await res.json();
    } catch (e) {
      console.warn("Cart API fetch failed, using local data");
    }

    if (allProducts.length === 0) {
      allProducts = load(PRODUCTS_KEY) || [];
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const p = allProducts.find(x => x.id.toString() === item.id.toString());
      if (!p) return;

      const subtotal = p.price * item.qty;
      total += subtotal;
      const isOutOfStock = p.status === 'Out-of-stock';
      const statusColor = isOutOfStock ? '#fee2e2' : '#dcfce7';
      const statusTextColor = isOutOfStock ? '#dc2626' : '#16a34a';

      const el = document.createElement('div');
      el.className = 'cart-item';
      el.style.opacity = isOutOfStock ? '0.7' : '1';
      let imgSrc = 'https://via.placeholder.com/80x80';
      if (p.img) {
        imgSrc = p.img.startsWith('http') || p.img.startsWith('data:') ? p.img : `data:image/jpeg;base64,${p.img}`;
      }
      el.innerHTML = `
        <img src="${imgSrc}" alt="${p.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${p.title}</div>
          <div class="cart-item-price">₹${p.price.toLocaleString()}</div>
          <div style="margin-bottom: 0.5rem;">
            <span class="badge" style="background: ${statusColor}; color: ${statusTextColor}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500;">${p.status || 'In-stock'}</span>
          </div>
          <div class="cart-controls">
            <button type="button" class="qty-btn" onclick="updateCartQty('${item.id}', -1)" ${isOutOfStock ? 'disabled' : ''}><i class="fas fa-minus"></i></button>
            <span>${item.qty}</span>
            <button type="button" class="qty-btn" onclick="updateCartQty('${item.id}', 1)" ${isOutOfStock ? 'disabled' : ''}><i class="fas fa-plus"></i></button>
            <button type="button" class="qty-btn" onclick="removeFromCart('${item.id}')" style="margin-left: auto; color: #e74c3c;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(el);
    });

    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
  } catch (err) {
    console.error("Cart error:", err);
    container.innerHTML = '<div>Error loading cart details</div>';
  }
}

async function updateCartQty(id, change) {
  let cart = load(CART_KEY) || [];
  const item = cart.find(x => x.id === id);

  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(x => x.id !== id);
    }
    save(CART_KEY, cart);
    renderCart();
    updateCartCount();

    const sess = getSession();
    if (sess) {
      await syncCartWithBackend(sess.id, cart);
    }
  }
}

async function removeFromCart(id) {
  let cart = load(CART_KEY) || [];
  cart = cart.filter(x => x.id !== id);
  save(CART_KEY, cart);
  renderCart();
  updateCartCount();
  showNotification('Item removed from cart');

  const sess = getSession();
  if (sess) {
    await syncCartWithBackend(sess.id, cart);
  }
}

function openCart() {
  window.location.href = 'cart.html';
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
}

// ============================================
// WISHLIST
// ============================================
async function addToWishlist(id) {
  const sess = getSession();
  if (!sess) {
    showNotification('Please login to add items to wishlist', 'error');
    openAuth('login');
    return;
  }
  let wishlist = load(WISHLIST_KEY) || [];

  if (!wishlist.includes(id)) {
    wishlist.push(id);
    save(WISHLIST_KEY, wishlist);
    showNotification('Added to wishlist!');
  } else {
    wishlist = wishlist.filter(x => x !== id);
    save(WISHLIST_KEY, wishlist);
    showNotification('Removed from wishlist');
  }

  updateWishlistCount();

  // Sync with backend if logged in
  if (sess) {
    await syncWishlistWithBackend(sess.id, wishlist);
  }
}

function updateWishlistCount() {
  const wishlist = load(WISHLIST_KEY) || [];
  const badge = document.getElementById('wishlistCount');
  if (badge) badge.textContent = wishlist.length;
}

function toggleWishlist() {
  const drawer = document.getElementById('wishlistDrawer');
  const overlay = document.getElementById('wishlistOverlay');

  if (drawer?.classList.contains('open')) {
    drawer.classList.remove('open');
    overlay?.classList.remove('open');
  } else {
    renderWishlist();
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    if (document.getElementById('cartDrawer')?.classList.contains('open')) closeCart();
  }
}

async function renderWishlist() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;

  const wishlist = load(WISHLIST_KEY) || [];

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <i class="fas fa-heart" style="font-size: 3rem; color: #eee; margin-bottom: 1rem;"></i>
        <p style="color: #999;">Your wishlist is empty</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

  try {
    let allProducts = [];
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) allProducts = await res.json();
    } catch (e) {
      console.warn("Wishlist API fetch failed, using local data");
    }

    if (allProducts.length === 0) {
      allProducts = load(PRODUCTS_KEY) || [];
    }

    container.innerHTML = '';
    wishlist.forEach(id => {
      const p = allProducts.find(x => x.id.toString() === id.toString());
      if (!p) return;

      let imgSrc = 'https://via.placeholder.com/80x80';
      if (p.img) {
        imgSrc = p.img.startsWith('http') || p.img.startsWith('data:') ? p.img : `data:image/jpeg;base64,${p.img}`;
      }

      const el = document.createElement('div');
      el.className = 'cart-item'; // Reuse cart-item styles
      el.innerHTML = `
        <img src="${imgSrc}" alt="${p.title}">
        <div class="cart-item-details">
          <h4>${p.title}</h4>
          <p>₹${p.price.toLocaleString()}</p>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button class="btn btn-sm btn-primary" onclick="addToCart('${p.id}'); toggleWishlist();" style="padding: 4px 8px; font-size: 0.75rem;">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="addToWishlist('${p.id}'); renderWishlist();" style="padding: 4px 8px; font-size: 0.75rem;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    console.error("Wishlist error:", err);
    container.innerHTML = '<div>Error loading wishlist</div>';
  }
}

// ============================================
// EMAIL FUNCTIONALITY
// ============================================
function sendProductMail(id) {
  const sess = getSession();
  if (!sess) {
    showNotification('Please login to send product mail', 'error');
    openAuth('login');
    return;
  }
  const p = currentProducts.find(x => x.id == id);
  if (!p) {
    showNotification('Product details not found', 'error');
    return;
  }

  const subject = encodeURIComponent(`Inquiry for ${p.title} - Sri Maheswari Industries`);
  const priceText = p.price ? `₹${p.price.toLocaleString()}` : 'Price on request';

  const body = encodeURIComponent(
    `Hello Sri Maheswari Industries,\n\nI am interested in the following product:\n\n` +
    `Product: ${p.title}\n` +
    `Category: ${p.category}\n` +
    `Price: ${priceText}\n` +
    `Description: ${p.desc || 'N/A'}\n\n` +
    `Please provide more information about this product.\n\nThank you!`
  );

  window.location.href = `mailto:hello@maheswari.com?subject=${subject}&body=${body}`;
}

// ============================================
// MODALS
// ============================================
function openEnquireModal(id) {
  const product = (load(PRODUCTS_KEY) || []).find(x => x.id === id);
  if (!product) return;

  document.getElementById('enquireProductId').value = id;
  document.getElementById('enquireProductName').textContent = product.title;
  document.getElementById('enquireModal')?.classList.add('open');
}

function closeEnquireModal() {
  document.getElementById('enquireModal')?.classList.remove('open');
  document.getElementById('enquireForm')?.reset();
}

async function submitEnquiry(e) {
  e.preventDefault();

  const productId = document.getElementById('enquireProductId').value;
  const name = document.getElementById('enquireName').value;
  const email = document.getElementById('enquireEmail').value;
  const phone = document.getElementById('enquirePhone').value;
  const body = document.getElementById('enquireMessage').value;

  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, name, email, phone, body })
    });

    if (res.ok) {
      closeEnquireModal();
      showNotification('Enquiry sent! We will contact you soon.');
    } else {
      showNotification('Error sending enquiry', 'error');
    }
  } catch (err) {
    showNotification('Server error', 'error');
  }
}

// ============================================
// AUTH
// ============================================
function openAuth(mode = 'login') {
  document.getElementById('authMode').value = mode;
  switchAuthTab(mode);
  document.getElementById('authModal')?.classList.add('open');
}

function closeAuth() {
  document.getElementById('authModal')?.classList.remove('open');
  document.getElementById('authForm')?.reset();
  clearAuthErrors();
}

function switchAuthTab(mode) {
  document.getElementById('authMode').value = mode;
  document.getElementById('authForm')?.reset();

  // Update tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.toggle('active', tab.textContent.toLowerCase().includes(mode));
  });

  // Toggle fields
  const loginFields = document.getElementById('loginFields');
  const registerFields = document.getElementById('registerFields');
  const submitBtn = document.getElementById('authSubmit');

  if (mode === 'register') {
    loginFields?.classList.add('hidden');
    registerFields?.classList.remove('hidden');
    if (submitBtn) submitBtn.textContent = 'Create Account';
  } else {
    loginFields?.classList.remove('hidden');
    registerFields?.classList.add('hidden');
    if (submitBtn) submitBtn.textContent = 'Sign In';
  }

  clearAuthErrors();
}

function clearAuthErrors() {
  document.querySelectorAll('.error-text').forEach(el => {
    el.style.display = 'none';
    el.textContent = '';
  });
}

async function handleAuth(e) {
  e.preventDefault();
  clearAuthErrors();

  const mode = document.getElementById('authMode').value;

  if (mode === 'login') {
    const email = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;

    if (!email || !password) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.status === "success") {
        setSession({
          id: data.user_id,
          name: data.name || 'User',
          role: data.role,
          isAdmin: data.role === 'admin'
        });

        // Load user's cart and wishlist from backend
        if (data.cart) {
          const mappedCart = data.cart.map(item => ({ id: item.productId, qty: item.qty }));
          save(CART_KEY, mappedCart);
        }
        if (data.wishlist) {
          save(WISHLIST_KEY, data.wishlist);
        }

        closeAuth();
        checkSession();
        updateCartCount();
        updateWishlistCount();
        showNotification(`Welcome back!`);
      } else {
        document.getElementById('loginPassError').textContent = data.message || 'Invalid credentials';
        document.getElementById('loginPassError').style.display = 'block';
      }
    } catch (err) {
      showNotification('Server Error', 'error');
    }
  } else {
    // Register
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const city = document.getElementById('regCity').value.trim();
    const password = document.getElementById('regPass').value;
    const passConfirm = document.getElementById('regPassConfirm').value;

    if (!name || !email || !phone || !city || !password) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    if (password !== passConfirm) {
      document.getElementById('regPassConfirmError').textContent = 'Passwords do not match';
      document.getElementById('regPassConfirmError').style.display = 'block';
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: 'user' })
      });
      const data = await res.json();

      if (res.ok) {
        showNotification(`Welcome ${name}! Account created. Please login.`);
        switchAuthTab('login');
      } else {
        showNotification(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showNotification('Server Error', 'error');
    }
  }
}

function handleLogout() {
  fetch(`${API_URL}/logout`, { method: "POST" })
    .finally(() => {
      clearSession();
      save(CART_KEY, []);
      save(WISHLIST_KEY, []);
      checkSession();
      updateCartCount();
      updateWishlistCount();
      showNotification('Logged out successfully');
      window.location.href = 'index.html';
    });
}

// Admin Auth
function openAdminAuth() {
  document.getElementById('adminAuthModal')?.classList.add('open');
}

function closeAdminAuth() {
  document.getElementById('adminAuthModal')?.classList.remove('open');
  document.getElementById('adminAuthForm')?.reset();
}

async function handleAdminAuth(e) {
  e.preventDefault();

  const email = document.getElementById('adminUser').value.trim();
  const password = document.getElementById('adminPass').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.status === "success" && data.role === "admin") {
      setSession({
        id: data.user_id,
        name: data.name || 'Admin',
        role: data.role,
        isAdmin: true
      });
      closeAdminAuth();
      checkSession();
      showNotification(`Welcome Admin!`);
      window.location.href = 'admin.html';
    } else {
      showNotification('Invalid admin credentials', 'error');
    }
  } catch (err) {
    showNotification('Server Error', 'error');
  }
}

function checkSession() {
  const sess = getSession();
  const userDisplay = document.getElementById('userDisplayName');
  const adminLink = document.getElementById('adminDashboardLink');
  const loginBtn = document.getElementById('loginDropdownBtn');
  const signupBtn = document.getElementById('signupDropdownBtn');
  const logoutBtn = document.getElementById('logoutDropdownBtn');
  const trackBtn = document.getElementById('trackOrderDropdownBtn');
  const adminLoginBtn = document.getElementById('adminLoginDropdownBtn');
  const mobileAdminLoginBtn = document.getElementById('mobileAdminBtn');
  const mobileTrackBtn = document.getElementById('mobileTrackOrderBtn');

  if (sess) {
    if (userDisplay) userDisplay.textContent = sess.name.split(' ')[0];
    if (sess.isAdmin && adminLink) adminLink.classList.remove('hidden');
    if (loginBtn) loginBtn.classList.add('hidden');
    if (signupBtn) signupBtn.classList.add('hidden');
    if (trackBtn) trackBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (mobileTrackBtn) mobileTrackBtn.classList.remove('hidden');
    
    // Hide Admin Login if already logged in as admin
    if (sess.isAdmin && adminLoginBtn) adminLoginBtn.classList.add('hidden');
    if (sess.isAdmin && mobileAdminLoginBtn) mobileAdminLoginBtn.classList.add('hidden');

    // Fetch latest cart/wishlist to stay in sync
    fetch(`${API_URL}/users/${sess.id}`)
      .then(res => res.json())
      .then(user => {
        if (user.cart) {
          const mappedCart = user.cart.map(item => ({ id: item.productId, qty: item.qty }));
          save(CART_KEY, mappedCart);
          updateCartCount();
        }
        if (user.wishlist) {
          save(WISHLIST_KEY, user.wishlist);
          updateWishlistCount();
        }
      })
      .catch(err => console.error("Session sync failed", err));
  } else {
    if (userDisplay) userDisplay.textContent = 'Account';
    if (adminLink) adminLink.classList.add('hidden');
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (signupBtn) signupBtn.classList.remove('hidden');
    if (trackBtn) trackBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (mobileTrackBtn) mobileTrackBtn.classList.add('hidden');
    if (adminLoginBtn) adminLoginBtn.classList.remove('hidden');
    if (mobileAdminLoginBtn) mobileAdminLoginBtn.classList.remove('hidden');
  }
}

// ============================================
// MOBILE NAV
// ============================================
function openMobileNav() {
  document.getElementById('mobileNav')?.classList.add('active');
  document.getElementById('mobileNavOverlay')?.classList.add('active');
}

function closeMobileNav() {
  document.getElementById('mobileNav')?.classList.remove('active');
  document.getElementById('mobileNavOverlay')?.classList.remove('active');
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'success') {
  // Remove existing
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#27AE60' : '#E74C3C'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ============================================
// BACK TO TOP
// ============================================
function handleScroll() {
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
}

// ============================================
// SALE TIMER
// ============================================
function updateSaleTimer() {
  const timer = document.getElementById('saleTimer');
  if (!timer) return;

  // Set sale end date (2 days from now for demo)
  const now = new Date();
  const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const diff = endDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  timer.textContent = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ============================================
// SEARCH
// ============================================
function initSearch() {
  const headerSearch = document.getElementById('headerSearch');
  const searchBtn = document.querySelector('.search-btn');

  const executeSearch = () => {
    const val = headerSearch.value.trim();
    // Scroll to products section with offset
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
      const offset = 80;
      const top = collectionsSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(() => renderProducts('', '', '', val), 500);
  };

  if (headerSearch) {
    headerSearch.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') executeSearch();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', executeSearch);
  }
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        phone: form.querySelector('input[type="tel"]')?.value || '',
        body: form.querySelector('textarea').value
      };

      try {
        const res = await fetch(`${API_URL}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          form.reset();
          showNotification('Message sent! We will get back to you soon.');
        } else {
          showNotification('Error sending message', 'error');
        }
      } catch (err) {
        showNotification('Server error', 'error');
      }
    });
  }
}

// ============================================
// NEWSLETTER
// ============================================
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      form.reset();
      showNotification('Thank you for subscribing! Use code WELCOME10 for 10% off.');
    });
  }
}

// ============================================
// GALLERY
// ============================================
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Loading gallery...</div>';

  try {
    const res = await fetch(`${API_URL}/images`);
    const images = await res.json();

    if (images.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-light);">Gallery is currently empty.</div>';
      return;
    }

    grid.innerHTML = '';
    images.forEach(imgObj => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const imgData = imgObj.image;
      const imgSrc = (imgData.startsWith('http') || imgData.startsWith('data:')) ? imgData : `data:image/jpeg;base64,${imgData}`;
      item.innerHTML = `<img src="${imgSrc}" alt="Craftsmanship Gallery">`;
      grid.appendChild(item);
    });
  } catch (err) {
    console.error("Gallery load failed:", err);
    grid.innerHTML = '<div style="grid-column: 1/-1; color: var(--danger); text-align: center;">Failed to load gallery images.</div>';
  }
}

// ============================================
// CHECKOUT
// ============================================
function openCheckout() {
  const sess = getSession();
  if (!sess) {
    showNotification('Please login to continue checkout', 'error');
    openAuth('login');
    return;
  }

  const cart = load(CART_KEY) || [];
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'error');
    return;
  }

  // Pre-fill shipping info if possible (from user name)
  document.getElementById('shipName').value = sess.name || '';

  closeCart();
  renderCheckoutSummary();
  document.getElementById('checkoutModal')?.classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutModal')?.classList.remove('open');
  document.getElementById('checkoutForm')?.reset();
}

async function renderCheckoutSummary() {
  const cart = load(CART_KEY) || [];
  const summaryEl = document.getElementById('checkoutSummary');
  if (!summaryEl) return;

  try {
    const res = await fetch(`${API_URL}/products`);
    const allProducts = await res.json();

    let total = 0;
    let html = '<h4 style="margin-bottom: 0.5rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem;">Order Summary</h4>';
    let hasOutOfStock = false;

    cart.forEach(item => {
      const p = allProducts.find(x => x.id === item.id);
      if (!p) return;
      const sub = p.price * item.qty;
      total += sub;
      const isOutOfStock = p.status === 'Out-of-stock';
      if (isOutOfStock) hasOutOfStock = true;

      html += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem; font-size: 0.9rem; ${isOutOfStock ? 'opacity: 0.6; text-decoration: line-through;' : ''}">
          <span>${p.title} x ${item.qty} ${isOutOfStock ? '<span style="color: #dc2626; margin-left: 0.5rem;">(Out of Stock)</span>' : ''}</span>
          <span>₹${sub.toLocaleString()}</span>
        </div>
      `;
    });

    if (hasOutOfStock) {
      html = '<div style="background: #fee2e2; color: #dc2626; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;"><i class="fas fa-exclamation-circle"></i> Some items are out of stock. Please remove them before checkout.</div>' + html;
    }

    html += `
      <div style="border-top: 2px solid #333; margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; font-weight: bold;">
        <span>Grand Total</span>
        <span>₹${total.toLocaleString()}</span>
      </div>
    `;

    summaryEl.innerHTML = html;
    summaryEl.dataset.total = total; // Store total for easy access

    // Disable checkout button if there are out-of-stock items
    const checkoutBtn = document.querySelector('#checkoutForm button[type="submit"]');
    if (checkoutBtn) {
      checkoutBtn.disabled = hasOutOfStock;
      checkoutBtn.style.opacity = hasOutOfStock ? '0.5' : '1';
      checkoutBtn.style.cursor = hasOutOfStock ? 'not-allowed' : 'pointer';
    }
  } catch (err) {
    summaryEl.innerHTML = 'Error loading order summary';
  }
}

async function handleCheckout(e) {
  e.preventDefault();
  const sess = getSession();
  const cart = load(CART_KEY) || [];
  const summaryEl = document.getElementById('checkoutSummary');
  const totalAmount = parseInt(summaryEl.dataset.total);

  try {
    // 1. Fetch detailed product info for items
    const resProducts = await fetch(`${API_URL}/products`);
    const allProducts = await resProducts.json();

    // Check for out-of-stock items
    const outOfStockItems = [];
    cart.forEach(item => {
      const p = allProducts.find(x => x.id === item.id);
      if (p && p.status === 'Out-of-stock') {
        outOfStockItems.push(p.title);
      }
    });

    if (outOfStockItems.length > 0) {
      showNotification(`Cannot checkout: ${outOfStockItems.join(', ')} is/are out of stock. Please remove them from cart.`, 'error');
      return;
    }

    const items = cart.map(item => {
      const p = allProducts.find(x => x.id === item.id);
      return {
        productId: item.id,
        title: p ? p.title : 'Unknown Product',
        price: p ? p.price : 0,
        qty: item.qty
      };
    });

    const body = {
      userId: sess.id,
      items,
      totalAmount,
      shippingAddress: {
        fullName: document.getElementById('shipName').value,
        phone: document.getElementById('shipPhone').value,
        address: document.getElementById('shipAddress').value,
        city: document.getElementById('shipCity').value,
        pincode: document.getElementById('shipPincode').value
      },
      paymentMethod: document.getElementById('paymentMethod').value
    };

    const resOrder = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (resOrder.ok) {
      const data = await resOrder.json();
      showNotification('Successfully placed your order! Thank you for shopping with us.');
      save(CART_KEY, []); // Clear cart locally
      updateCartCount();

      // Auto-refresh cart display if on cart page
      if (typeof renderCart === 'function') {
        await renderCart();
      }

      closeCheckout();

      // Redirect to orders page after 2 seconds to show the new order
      setTimeout(() => {
        window.location.href = 'orders.html';
      }, 2000);
    } else {
      const error = await resOrder.json();
      showNotification(error.message || 'Failed to place order', 'error');
    }
  } catch (err) {
    console.error("Checkout failed:", err);
    showNotification('Server error during checkout', 'error');
  }
}

function togglePaymentNote() {
  const method = document.getElementById('paymentMethod').value;
  const note = document.getElementById('onlinePaymentNote');
  if (note) note.style.display = method === 'Online Payment' ? 'block' : 'none';
}

function openTrackOrder() {
  const sess = getSession();
  if (!sess) {
    showNotification('Please login to track your orders', 'error');
    openAuth('login');
    return;
  }
  window.location.href = 'orders.html';
}

function closeTrackOrder() {
  document.getElementById('trackOrderModal')?.classList.remove('open');
}

let userOrders = [];
async function renderTrackOrder() {
  const sess = getSession();
  const list = document.getElementById('orderTrackingList');
  if (!list) return;

  list.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Loading your orders...</div>';

  try {
    const res = await fetch(`${API_URL}/orders/user/${sess.id}`);
    const orders = await res.json();
    userOrders = orders;

    if (orders.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; color: #eee;"></i>
          <p>You haven't placed any orders yet.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = orders.map((o, index) => {
      const statusColor = getStatusColor(o.status);
      return `
      <div style="background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f5f5; padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
          <div>
            <span style="font-weight: 700; color: #333; text-transform: uppercase;">Order #${o._id ? o._id.substring(o._id.length - 6).toUpperCase() : 'UNKNOWN'}</span>
            <div style="font-size: 0.75rem; color: #999; margin-top: 2px;">${new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <span class="badge" style="background: ${statusColor.bg}; color: ${statusColor.text}; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
            ${o.status.toUpperCase()}
          </span>
        </div>
        <div style="font-size: 0.9rem; color: #555; line-height: 1.6;">
          <div style="display: flex; justify-content: space-between;">
            <span>Amount:</span> <span style="font-weight: 600; color: #333;">₹${o.totalAmount.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Payment:</span> <span style="font-weight: 600; color: #333;">${o.paymentMethod}</span>
          </div>
        </div>
        <div style="margin-top: 0.75rem; background: #f8f9fa; padding: 0.75rem; border-radius: 8px;">
           <div style="font-size: 0.75rem; color: #999; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Items Ordered</div>
           <div style="font-size: 0.85rem; color: #444;">${o.items.map(i => `<a href="product-detail.html?id=${i.productId}" style="color: var(--primary); font-weight: 500; text-decoration: underline;">${i.title}</a> (${i.qty})`).join(', ')}</div>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 8px;">
          <button class="btn btn-sm" onclick="downloadReceiptByIndex(${index})" style="background: #e0f2fe; color: #0ea5e9; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s;">
            <i class="fas fa-file-invoice"></i> Download Receipt
          </button>
        </div>
      </div>
    `}).join('');
  } catch (err) {
    console.error("Tracking error:", err);
    list.innerHTML = '<div style="color: var(--danger); text-align: center; padding: 2rem;">Failed to load orders. Please try again later.</div>';
  }
}

function downloadReceiptByIndex(index) {
  const o = userOrders[index];
  if (o) generateOrderBill(o);
}

function getStatusColor(status) {
  switch (status) {
    case 'pending': return { bg: '#fff7ed', text: '#c2410c' };
    case 'shipped': return { bg: '#e0f2fe', text: '#0369a1' };
    case 'delivered': return { bg: '#dcfce7', text: '#15803d' };
    default: return { bg: '#f3f4f6', text: '#374151' };
  }
}

async function generateOrderBill(o) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(196, 164, 132); // --primary color #c4a484
  doc.text("MAHESWARI INDUSTRIES", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Premium Handcrafted Furniture", 105, 26, { align: "center" });
  doc.text(`Address: S.F.No.89/8B, Sri Krishna Industrial Estate`, 105, 32, { align: "center" });
  doc.text(`Keeranatham Rd, Saravanampatti,`, 105, 38, { align: "center" })
  doc.text(`Coimbatore, Tamil Nadu.`, 105, 44, { align: "center" })
  doc.text(`Phone: +91 70102 66795 | Email: hello@maheswari.com`, 105, 50, { align: "center" });

  doc.setDrawColor(200);
  doc.line(20, 55, 190, 55);

  // Invoice & Shipping Info Section
  doc.setFontSize(11);
  doc.setTextColor(0);

  // Left Column - Invoice Details
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE DETAILS", 20, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Order ID: #${o._id.toUpperCase()}`, 20, 72);
  doc.text(`Date: ${new Date(o.createdAt).toLocaleString()}`, 20, 78);
  doc.text(`Status: ${o.status.toUpperCase()}`, 20, 84);
  doc.text(`Payment: ${o.paymentMethod}`, 20, 90);

  // Right Column - Shipping Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("SHIPPING ADDRESS", 120, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(o.shippingAddress.fullName, 120, 72);

  // Multi-line address handling
  const addressLines = doc.splitTextToSize(o.shippingAddress.address, 70);
  doc.text(addressLines, 120, 78);

  const addressLineCount = Array.isArray(addressLines) ? addressLines.length : 1;
  const cityY = 78 + (addressLineCount * 5);

  doc.text(`${o.shippingAddress.city} - ${o.shippingAddress.pincode}`, 120, cityY);
  doc.text(`Phone: ${o.shippingAddress.phone}`, 120, cityY + 6);

  // Table (Dynamic Start Y)
  const tableStartY = Math.max(105, cityY + 15);

  // Table
  const tableData = o.items.map((item, idx) => [
    idx + 1,
    item.title,
    `Rs. ${item.price.toLocaleString()}`,
    item.qty,
    `Rs. ${(item.price * item.qty).toLocaleString()}`
  ]);

  doc.autoTable({
    startY: tableStartY,
    head: [['S.No', 'Item Description', 'Price', 'Qty', 'Subtotal']],
    body: tableData,
    headStyles: { fillColor: [196, 164, 132], halign: 'center' },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 35, halign: 'right' }
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 20, right: 20 },
    theme: 'striped'
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: Rs. ${o.totalAmount.toLocaleString()}`, 190, finalY, { align: "right" });

  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
  doc.text("Thank you for choosing Maheswari Industries!", 105, finalY + 30, { align: "center" });
  doc.text("This is a computer generated receipt.", 105, finalY + 36, { align: "center" });

  doc.save(`Maheswari_Order_${o._id ? o._id.substring(o._id.length - 6).toUpperCase() : 'Order'}.pdf`);
}

document.addEventListener('DOMContentLoaded', () => {
  // Load dynamic categories into tabs
  loadDynamicCategories();

  // Render products
  renderProducts();

  // Load gallery
  loadGallery();

  // Update counts
  updateCartCount();
  updateWishlistCount();

  // Check session
  checkSession();

  // Init features
  initSearch();
  initContactForm();
  initNewsletter();

  // Cart drawer
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('wishlistOverlay')?.addEventListener('click', toggleWishlist);

  // Mobile nav
  document.getElementById('hamburger')?.addEventListener('click', openMobileNav);
  document.getElementById('mobileNavOverlay')?.addEventListener('click', closeMobileNav);

  // Back to top
  window.addEventListener('scroll', handleScroll);

  // Sale timer
  updateSaleTimer();
  setInterval(updateSaleTimer, 1000);

  // Background Session Check (30 min timeout)
  setInterval(() => {
    getSession();
  }, 60000);

  // Close modals on background click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
});
