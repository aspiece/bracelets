/* ===== Cart Logic ===== */

const CART_KEY = 'bracelet_cart';

/**
 * Load cart from localStorage.
 * @returns {Array} array of cart items {id, name, price, image, quantity}
 */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage.
 * @param {Array} cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Add a product to the cart (or increment quantity if already present).
 * @param {number} productId
 */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = loadCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`"${product.name}" added to cart!`);
}

/**
 * Remove a product entirely from the cart.
 * @param {number} productId
 */
function removeFromCart(productId) {
  let cart = loadCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
}

/**
 * Change the quantity of an item in the cart.
 * @param {number} productId
 * @param {number} delta - amount to change quantity by (+1 or -1)
 */
function changeQuantity(productId, delta) {
  const cart = loadCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
  updateCartCount();
}

/**
 * Update the cart item counter badge in the navigation.
 */
function updateCartCount() {
  const cart = loadCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  badge.textContent = total;
  if (total > 0) {
    badge.classList.add('visible');
  } else {
    badge.classList.remove('visible');
  }
}

/**
 * Show a brief toast notification.
 * @param {string} message
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/**
 * Render the full cart page (cart.html).
 * Expects elements: #cart-items-container, #cart-total, #cart-subtotal, #cart-item-count
 */
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  const cart = loadCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty.</p>
        <a href="shop.html" class="btn">Browse Bracelets</a>
      </div>
    `;
    document.getElementById('cart-summary-box').style.display = 'none';
    return;
  }

  document.getElementById('cart-summary-box').style.display = '';
  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="item-price">$${item.price.toFixed(2)} each</p>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="adjustQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="adjustQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div>
        <p style="font-weight:bold;color:#6b3f2a;">$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-item-count');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (countEl) countEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
}

/**
 * Wrapper called from cart page buttons.
 */
function adjustQty(productId, delta) {
  changeQuantity(productId, delta);
  renderCartPage();
  updateCartCount();
}

/**
 * Wrapper called from cart page remove button.
 */
function removeItem(productId) {
  removeFromCart(productId);
  renderCartPage();
  updateCartCount();
}

/* ===== Attach event listeners on page load ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Update badge on every page
  updateCartCount();

  // Shop / Home page: attach Add to Cart listeners
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const id = parseInt(e.target.dataset.id, 10);
      addToCart(id);
    }
  });

  // Cart page rendering
  renderCartPage();

  // Shop page: search & filter
  const searchInput = document.getElementById('search-input');
  const filterSelect = document.getElementById('filter-select');
  const grid = document.getElementById('product-grid');

  if (grid && typeof products !== 'undefined') {
    const applyFilters = () => {
      const query = searchInput ? searchInput.value.toLowerCase() : '';
      const category = filterSelect ? filterSelect.value : 'all';
      const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(query) ||
                              p.description.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || p.category === category;
        return matchesSearch && matchesCategory;
      });
      renderProducts(grid, filtered);
    };

    // Initial render
    renderProducts(grid, products);

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterSelect) filterSelect.addEventListener('change', applyFilters);
  }

  // Home page: render featured products (first 4)
  const featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid && typeof products !== 'undefined') {
    renderProducts(featuredGrid, products.slice(0, 4));
  }

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showToast('Thank you for your order! 🎉 (This is a demo.)');
      saveCart([]);
      setTimeout(() => {
        renderCartPage();
        updateCartCount();
      }, 500);
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent! We\'ll be in touch soon.');
      contactForm.reset();
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
