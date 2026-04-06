const products = [
  {
    id: 1,
    name: "Aqua Harmony Bracelet",
    price: 20,
    image: "bracelet1.jpeg",
    description: "A turquoise and gold beaded bracelet with fresh, ocean-inspired look-simple, elegant, and perfect for any outfit.",
    category: "beaded"
  },
  {
    id: 2,
    name: "Cocoa Sands Bracelet",
    price: 20,
    image: "bracelet2.jpeg",
    description: "An earthy mix of neutral beads with a natural rustic feel-simple and versatile.",
    category: "beaded"
  },
  {
    id: 3,
    name: "Golden Solstice Bracelet",
    price: 20,
    image: "bracelet3.jpeg",
    description: "Sun-kissed beads with a radiant golden charm for an effortlessly warm, boho glow.",
    category: "charm"
  },
  {
    id: 4,
    name: "Stone Whisper Bracelet",
    price: 20,
    image: "bracelet4.jpeg",
    description: "Cool-toned natural stones accented with dark spacers for a sleek, balanced, and effortlessly modern look.
      ",
    category: "wrap"
  },
  {
    id: 5,
    name: "Faith & Grace Bracelet",
    price: 20,
    image: "bracelet5.jpeg",
    description: "Soft neutral beads paired with a delicate cross charm, symbolizing faith, grace, and everyday elegance.",
    category: "charm"
  },
  {
    id: 6,
    name: "Friendship Knot Bracelet",
    price: 20,
    image: "bracelet6.jpeg",
    description: "Classic friendship bracelet with a colorful knotted design.",
    category: "wrap"
  }
];

/**
 * Build the HTML for a single product card.
 * @param {Object} product
 * @returns {string} HTML string
 */
function createProductCard(product) {
  return `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpeg'">
      <h3>${product.name}</h3>
      <p class="description">${product.description}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    </article>
  `;
}

/**
 * Render a list of products into the given container element.
 * @param {HTMLElement} container
 * @param {Array} list - array of product objects to render
 */
function renderProducts(container, list) {
  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#7a5c50;padding:30px 0;">No products found.</p>';
    return;
  }
  container.innerHTML = list.map(createProductCard).join('');
}
