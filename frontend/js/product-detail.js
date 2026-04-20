/* ============================================
   MAHESWARI INDUSTRIES - Product Detail JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initProductDetail();
});

async function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    // Load products
    let products = load(PRODUCTS_KEY) || [];

    // Try to fetch from API as well if possible, though load() handles local fallback
    try {
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) {
            const apiProducts = await res.json();
            if (apiProducts.length > 0) products = apiProducts;
        }
    } catch (e) {
        console.warn("API restricted, using local products");
    }

    // IDs can be numbers in local storage but strings in Mongo/API
    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) {
        document.getElementById('productDetailContainer').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 5rem;">
                <i class="fas fa-exclamation-triangle fa-3x" style="color: var(--danger);"></i>
                <h2 style="margin-top: 1rem;">Product Not Found</h2>
                <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top: 1rem;">Back to Shop</button>
            </div>
        `;
        return;
    }

    renderProductDetail(product);
    renderRelatedProducts(product, products);

    // Update global counts & check session
    if (typeof checkSession === 'function') checkSession();
    updateCartCount();
    updateWishlistCount();
}

function renderProductDetail(p) {
    const container = document.getElementById('productDetailContainer');

    let imgSrc = 'https://via.placeholder.com/600x600?text=No+Image';
    if (p.img) {
        imgSrc = p.img.startsWith('http') || p.img.startsWith('data:') ? p.img : `data:image/jpeg;base64,${p.img}`;
    }

    const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image-container">
                <img src="${imgSrc}" id="mainProductImage" alt="${p.title}">
            </div>
        </div>
        
        <div class="product-info-column">
            <span class="category">${p.category}</span>
            <h1>${p.title}</h1>
            
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(p.rating || 0)}
                </div>
                <span>(${p.reviews || 0} Customer Reviews)</span>
            </div>

            <div class="price-wrapper">
                <span class="current-price">₹${(p.price || 0).toLocaleString()}</span>
                ${p.originalPrice ? `<span class="original-price">₹${p.originalPrice.toLocaleString()}</span>` : ''}
                ${discount > 0 ? `<span class="badge badge-sale" style="position: static; padding: 5px 10px;">${discount}% OFF</span>` : ''}
            </div>

            <p class="short-desc">
                ${p.desc || 'Experience unparalleled comfort and style with this premium furniture piece. Handcrafted with the finest materials to ensure durability and aesthetic appeal for your home.'}
            </p>

            ${p.sizes && p.sizes.length > 0 ? `
            <div class="product-options">
                <span class="option-title">Select Size / Variant</span>
                <div class="size-selector">
                    ${p.sizes.map((size, idx) => `
                        <button class="size-btn ${idx === 0 ? 'active' : ''}" onclick="selectSize(this)">${size}</button>
                    `).join('')}
                </div>
            </div>` : ''}

            <div class="action-group">
                <div class="qty-selector">
                    <button type="button" class="qty-btn" onclick="updateQty(-1)"><i class="fas fa-minus"></i></button>
                    <input type="number" id="detailQty" value="1" min="1" class="qty-input" readonly>
                    <button type="button" class="qty-btn" onclick="updateQty(1)"><i class="fas fa-plus"></i></button>
                </div>
                <button type="button" class="btn btn-primary btn-add-cart" onclick="handleAddDetailToCart('${p.id}')" ${p.status === 'Out-of-stock' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${p.status === 'Out-of-stock' ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
                <button type="button" class="action-btn" onclick="addToWishlist('${p.id}')" style="width: 50px; height: 50px; border-radius: 8px; border: 1px solid #ddd;">
                    <i class="fas fa-heart"></i>
                </button>
            </div>

            <div class="product-meta">
                <div class="meta-item">
                    <span class="meta-label">Availability:</span>
                    <span class="meta-value" style="color: ${p.status === 'Out-of-stock' ? '#dc2626' : '#27ae60'}; font-weight: 600;">${p.status === 'Out-of-stock' ? 'Out of Stock' : 'In Stock'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">SKU:</span>
                    <span class="meta-value">MI-${p.id.toString().padStart(4, '0')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Shipping:</span>
                    <span class="meta-value">Free Delivery & Installation</span>
                </div>
            </div>

            <div class="rating-submission-box" style="margin-top: 2rem; padding: 1.5rem; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee;">
                <h4 style="margin-bottom: 0.5rem; color: var(--primary);">Rate this Product</h4>
                <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 1rem;">Share your experience with others</p>
                <div id="ratingForm">
                    <div class="interactive-stars" id="starInputs" style="display: flex; gap: 8px; margin-bottom: 0.5rem; font-size: 1.5rem; color: #ddd;">
                        <i class="far fa-star star-input" data-value="1" style="cursor: pointer;" onmouseover="highlightStars(1)" onmouseout="resetStars()" onclick="handleRatingClick('${p.id}', 1)"></i>
                        <i class="far fa-star star-input" data-value="2" style="cursor: pointer;" onmouseover="highlightStars(2)" onmouseout="resetStars()" onclick="handleRatingClick('${p.id}', 2)"></i>
                        <i class="far fa-star star-input" data-value="3" style="cursor: pointer;" onmouseover="highlightStars(3)" onmouseout="resetStars()" onclick="handleRatingClick('${p.id}', 3)"></i>
                        <i class="far fa-star star-input" data-value="4" style="cursor: pointer;" onmouseover="highlightStars(4)" onmouseout="resetStars()" onclick="handleRatingClick('${p.id}', 4)"></i>
                        <i class="far fa-star star-input" data-value="5" style="cursor: pointer;" onmouseover="highlightStars(5)" onmouseout="resetStars()" onclick="handleRatingClick('${p.id}', 5)"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function highlightStars(count) {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, idx) => {
        if (idx < count) {
            star.classList.replace('far', 'fas');
            star.style.color = '#ffc107';
        } else {
            star.classList.replace('fas', 'far');
            star.style.color = '#ddd';
        }
    });
}

function resetStars() {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach(star => {
        star.classList.replace('fas', 'far');
        star.style.color = '#ddd';
    });
}

function handleRatingClick(productId, rating) {
    if (confirm(`Do you want to rate this product ${rating} stars?`)) {
        submitRating(productId, rating);
    }
}

async function submitRating(productId, rating) {
    const sess = getSession();
    if (!sess) {
        showNotification('Please login to rate this product', 'error');
        if (typeof openAuth === 'function') openAuth('login');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${productId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating })
        });

        if (response.ok) {
            const data = await response.json();
            showNotification('Thank you for your rating!');
            
            // Update the UI
            const starsContainer = document.querySelector('.product-rating .stars');
            const reviewsCountHtml = document.querySelector('.product-rating span');
            
            if (starsContainer) starsContainer.innerHTML = generateStars(data.rating);
            if (reviewsCountHtml) reviewsCountHtml.textContent = `(${data.reviews} Customer Reviews)`;
            
            // Update local storage so it persists when navigating back
            let products = load(PRODUCTS_KEY) || [];
            const pIdx = products.findIndex(p => p.id.toString() === productId.toString());
            if (pIdx !== -1) {
                products[pIdx].rating = data.rating;
                products[pIdx].reviews = data.reviews;
                save(PRODUCTS_KEY, products);
            }

            // Hide the rating form or show a thank you message
            const ratingForm = document.getElementById('ratingForm');
            if (ratingForm) {
                ratingForm.innerHTML = `<p style="color: var(--success); font-weight: 600; margin-top: 0.5rem;"><i class="fas fa-check-circle"></i> Your rating of ${rating} stars has been submitted!</p>`;
            }
        } else {
            const error = await response.json();
            showNotification(error.message || 'Failed to submit rating', 'error');
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
        showNotification('An error occurred. Please try again.', 'error');
    }
}


function selectSize(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function updateQty(change) {
    const input = document.getElementById('detailQty');
    let val = parseInt(input.value) + change;
    if (val < 1) val = 1;
    input.value = val;
}

function handleAddDetailToCart(id) {
    // Check if product is in stock
    const allProducts = load(PRODUCTS_KEY) || [];
    const product = allProducts.find(p => p.id.toString() === id.toString());
    
    if (product && product.status === 'Out-of-stock') {
        showNotification('This product is currently out of stock', 'error');
        return;
    }

    const qty = parseInt(document.getElementById('detailQty').value);
    for (let i = 0; i < qty; i++) {
        addToCart(id.toString());
    }
}

function renderRelatedProducts(currentProduct, allProducts) {
    const container = document.getElementById('suggestedProductsGrid');
    if (!container) return;

    // Filter products of same category, excluding current one
    let related = allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);

    // If not enough in same category, add some from others
    if (related.length < 4) {
        const others = allProducts.filter(p => p.category !== currentProduct.category && p.id !== currentProduct.id);
        related = [...related, ...others].slice(0, 4);
    } else {
        // Shuffle and pick 4
        related = related.sort(() => 0.5 - Math.random()).slice(0, 4);
    }

    container.innerHTML = '';

    related.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

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
                </div>
                <button class="quick-add" onclick="event.stopPropagation(); addToCart('${p.id}')" ${p.status === 'Out-of-stock' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${p.status === 'Out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <h3 class="product-title"><a href="product-detail.html?id=${p.id}">${p.title}</a></h3>
                <div class="product-price">
                    <span class="current-price">₹${(p.price || 0).toLocaleString()}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
