/* CLIENT – builds the UI, creates products and applies visitors to the cart. */
const cart = new ShoppingCart();
const $ = (id) => document.getElementById(id);

const FIELDS = {
  Book: [['author', 'Author', 'text'], ['genre', 'Genre', 'text']],
  Electronics: [['brand', 'Brand', 'text'], ['warranty', 'Warranty (months)', 'number']],
  Clothing: [['size', 'Size', 'text'], ['material', 'Material', 'text']],
  Grocery: [['weight', 'Weight (kg)', 'number'], ['perishable', 'Perishable', 'checkbox']],
};
const image = (photo) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=96&q=78`;
const CATEGORY_IMAGES = {
  Book: image('photo-1512820790803-83ca734da794'),
  Electronics: image('photo-1527864550417-7fd91fc51a46'),
  Clothing: image('photo-1521572163474-6864f9cf17ab'),
  Grocery: image('photo-1464965911861-746a04b4bca6'),
};
const PRODUCT_IMAGES = {
  B001: image('photo-1544947950-fa07a98d237f'),
  B002: image('photo-1512820790803-83ca734da794'),
  B003: image('photo-1495446815901-a7297e633e8d'),
  E001: image('photo-1527864550417-7fd91fc51a46'),
  E002: image('photo-1505740420928-5e560c06d30e'),
  E003: image('photo-1525547719571-a2d4ac8945e2'),
  C001: image('photo-1521572163474-6864f9cf17ab'),
  C002: image('photo-1556821840-3a63f95609a7'),
  C003: image('photo-1553062407-98eeb64c6a62'),
  G001: image('photo-1586201375761-83865001e31c'),
  G002: image('photo-1442512595331-e89e73853f31'),
  G003: image('photo-1464965911861-746a04b4bca6'),
};

function toast(msg, ok = true) {
  const t = $('toast');
  t.textContent = (ok ? '✓ ' : '✗ ') + msg;
  t.className = 'show ' + (ok ? 'ok' : 'bad');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.className = ''), 3000);
}

function renderExtraFields() {
  const type = $('type').value;
  $('extra').innerHTML = FIELDS[type].map(([key, label, kind]) =>
    kind === 'checkbox'
      ? `<label class="check"><input type="checkbox" id="f_${key}"> ${label}</label>`
      : `<label>${label}<input id="f_${key}" type="${kind}" ${kind === 'number' ? 'step="any" min="0"' : ''}></label>`).join('');
}

function num(id, label) {
  const raw = $(id).value.trim();
  const n = Number(raw);
  if (raw === '' || Number.isNaN(n)) throw new Error(`${label} must be a valid number.`);
  return n;
}
function text(id, label) {
  const v = $(id).value.trim();
  if (!v) throw new Error(`${label} cannot be empty.`);
  return v;
}

function readProduct() {
  const type = $('type').value;
  const id = text('id', 'Product ID');
  const name = text('name', 'Product name');
  const price = num('price', 'Price');
  const qty = num('qty', 'Quantity');
  if (price < 0) throw new Error('Price cannot be negative.');
  if (!Number.isInteger(qty) || qty <= 0) throw new Error('Quantity must be a whole number above zero.');
  if (cart.has(id)) throw new Error('Product ID already exists.');
  switch (type) {
    case 'Book': return new Book(id, name, price, qty, text('f_author', 'Author'), text('f_genre', 'Genre'));
    case 'Electronics': {
      const w = num('f_warranty', 'Warranty');
      if (w < 0) throw new Error('Warranty cannot be negative.');
      return new Electronics(id, name, price, qty, text('f_brand', 'Brand'), w);
    }
    case 'Clothing': return new Clothing(id, name, price, qty, text('f_size', 'Size'), text('f_material', 'Material'));
    case 'Grocery': {
      const w = num('f_weight', 'Weight');
      if (w <= 0) throw new Error('Weight must be above zero.');
      return new Grocery(id, name, price, qty, w, $('f_perishable').checked);
    }
  }
}

function renderCart() {
  const body = $('cartBody');
  const products = cart.products;
  const units = products.reduce((sum, product) => sum + product.quantity, 0);
  const value = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  $('productCount').textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;
  $('unitCount').textContent = units;
  $('cartValue').textContent = Utils.money(value);
  $('btnClearCart').disabled = products.length === 0;

  const query = $('cartSearch').value.trim().toLowerCase();
  const category = $('categoryFilter').value;
  const visibleProducts = products.filter((product) => {
    const matchesQuery = `${product.id} ${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesQuery && (!category || product.category === category);
  });
  const sort = $('sortProducts').value;
  if (sort === 'name') visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'price-asc') visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') visibleProducts.sort((a, b) => b.price - a.price);

  if (!visibleProducts.length) {
    const message = products.length ? 'No products match these filters.' : 'Your cart is empty. Add an item or load the demo inventory.';
    body.innerHTML = `<tr><td colspan="6" class="empty">${message}</td></tr>`;
    return;
  }
  body.innerHTML = visibleProducts.map((p) => {
    const fallback = CATEGORY_IMAGES[p.category];
    return `<tr><td><div class="product-cell"><img src="${PRODUCT_IMAGES[p.id] || fallback}" data-fallback="${fallback}" alt="" loading="lazy" width="48" height="48"><div><strong>${Utils.esc(p.name)}</strong><small>${Utils.esc(p.id)}</small></div></div></td><td><span class="category-tag">${p.category}</span></td><td class="n">${Utils.money(p.price)}</td><td><div class="quantity-control"><button type="button" data-quantity-action data-id="${Utils.esc(p.id)}" data-delta="-1" aria-label="Decrease ${Utils.esc(p.name)} quantity" ${p.quantity <= 1 ? 'disabled' : ''}>-</button><span>${p.quantity}</span><button type="button" data-quantity-action data-id="${Utils.esc(p.id)}" data-delta="1" aria-label="Increase ${Utils.esc(p.name)} quantity">+</button></div></td><td class="n">${Utils.money(p.subtotal)}</td><td><button class="link" data-remove="${Utils.esc(p.id)}" aria-label="Remove ${Utils.esc(p.name)}">Remove</button></td></tr>`;
  }).join('');
  body.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => { img.src = img.dataset.fallback; }, { once: true });
  });
}

function run(visitors, message) {
  if (cart.isEmpty()) return toast('The cart is empty. Add products first.', false);
  $('output').innerHTML = visitors.map((v) => {
    cart.acceptVisitor(v);
    return `<section class="result"><h3>${v.title}</h3>${v.toHTML()}</section>`;
  }).join('');
  $('output').scrollIntoView({ behavior: 'smooth', block: 'start' });
  toast(message);
}

function loadDemo() {
  const demo = [
    new Book('B001', 'Clean Code', 1200, 1, 'Robert C. Martin', 'Programming'),
    new Book('B002', 'The Design of Everyday Things', 950, 2, 'Don Norman', 'Design'),
    new Book('B003', 'Atomic Habits', 720, 1, 'James Clear', 'Personal development'),
    new Electronics('E001', 'Wireless Mouse', 2500, 2, 'Logitech', 12),
    new Electronics('E002', 'Noise-cancelling Headphones', 8900, 1, 'Sony', 24),
    new Electronics('E003', 'USB-C Hub', 3200, 2, 'Anker', 18),
    new Clothing('C001', 'Cotton T-Shirt', 600, 3, 'M', 'Cotton'),
    new Clothing('C002', 'Everyday Hoodie', 1850, 1, 'L', 'Organic cotton'),
    new Clothing('C003', 'Canvas Tote Bag', 420, 2, 'One size', 'Recycled canvas'),
    new Grocery('G001', 'Premium Rice', 150, 5, 1, false),
    new Grocery('G002', 'Ground Coffee', 380, 2, 0.25, false),
    new Grocery('G003', 'Fresh Strawberries', 240, 1, 0.5, true),
  ];
  let added = 0;
  demo.forEach((p) => { if (!cart.has(p.id)) { cart.add(p); added++; } });
  renderCart();
  added ? toast('Demo products loaded.') : toast('Demo products are already in the cart.', false);
}

$('type').addEventListener('change', renderExtraFields);
$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    cart.add(readProduct());
    e.target.reset();
    renderExtraFields();
    renderCart();
    toast('Product added successfully.');
  } catch (err) { toast(err.message, false); }
});
$('cartBody').addEventListener('click', (e) => {
  const quantityButton = e.target.closest('[data-quantity-action]');
  if (quantityButton) {
    try {
      cart.adjustQuantity(quantityButton.dataset.id, Number(quantityButton.dataset.delta));
      renderCart();
      toast('Quantity updated.');
    } catch (err) { toast(err.message, false); }
    return;
  }
  const id = e.target.dataset.remove;
  if (!id) return;
  try { cart.remove(id); renderCart(); toast('Product removed.'); } catch (err) { toast(err.message, false); }
});
$('cartSearch').addEventListener('input', renderCart);
$('categoryFilter').addEventListener('change', renderCart);
$('sortProducts').addEventListener('change', renderCart);
$('btnClearCart').addEventListener('click', () => {
  cart.clear();
  renderCart();
  toast('Cart cleared.');
});
$('demo').onclick = loadDemo;
$('btnDiscount').onclick = () => run([new DiscountVisitor()], 'Discount calculation completed.');
$('btnTax').onclick = () => run([new TaxVisitor()], 'Tax calculation completed.');
$('btnShipping').onclick = () => run([new ShippingVisitor()], 'Shipping calculation completed.');
$('btnInvoice').onclick = () => run([new InvoiceVisitor()], 'Invoice generated successfully.');
$('btnReport').onclick = () => run([new ProductReportVisitor()], 'Product report generated.');
$('btnAll').onclick = () => run([new DiscountVisitor(), new TaxVisitor(), new ShippingVisitor(), new InvoiceVisitor(), new ProductReportVisitor()], 'Complete analysis finished.');

renderExtraFields();
renderCart();
