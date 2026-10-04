/* CLIENT – local commerce workflows coordinated through product visitors. */
const cart = new ShoppingCart();
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'smartcart-commerce-v1';
let catalog = [];
let orders = [];
let editingId = null;

const FIELDS = {
  Book: [['author', 'Author', 'text'], ['genre', 'Genre', 'text']],
  Electronics: [['brand', 'Brand', 'text'], ['warranty', 'Warranty (months)', 'number']],
  Clothing: [['size', 'Size', 'text'], ['material', 'Material', 'text']],
  Grocery: [['weight', 'Weight (kg)', 'number'], ['perishable', 'Perishable', 'checkbox']],
};
const image = (photo) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=120&q=78`;
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
const STATUS_NEXT = {
  Pending: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

function toast(message, ok = true) {
  const element = $('toast');
  element.textContent = `${ok ? '✓' : '✗'} ${message}`;
  element.className = `show ${ok ? 'ok' : 'bad'}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (element.className = ''), 3000);
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
  const value = Number(raw);
  if (raw === '' || !Number.isFinite(value)) throw new Error(`${label} must be a valid number.`);
  return value;
}

function text(id, label) {
  const value = $(id).value.trim();
  if (!value) throw new Error(`${label} cannot be empty.`);
  return value;
}

function productRecord(product, quantity = product.quantity) {
  const record = {
    type: product.category, id: product.id, name: product.name, price: product.price,
    quantity, imageUrl: product.imageUrl || PRODUCT_IMAGES[product.id] || CATEGORY_IMAGES[product.category],
  };
  if (product.category === 'Book') Object.assign(record, { author: product.author, genre: product.genre });
  if (product.category === 'Electronics') Object.assign(record, { brand: product.brand, warranty: product.warranty });
  if (product.category === 'Clothing') Object.assign(record, { size: product.size, material: product.material });
  if (product.category === 'Grocery') Object.assign(record, { weight: product.weight, perishable: product.perishable });
  return record;
}

function productFromRecord(record) {
  let product;
  switch (record.type) {
    case 'Book': product = new Book(record.id, record.name, record.price, record.quantity, record.author, record.genre); break;
    case 'Electronics': product = new Electronics(record.id, record.name, record.price, record.quantity, record.brand, record.warranty); break;
    case 'Clothing': product = new Clothing(record.id, record.name, record.price, record.quantity, record.size, record.material); break;
    case 'Grocery': product = new Grocery(record.id, record.name, record.price, record.quantity, record.weight, record.perishable); break;
    default: throw new Error('Saved product has an unknown category.');
  }
  product.imageUrl = record.imageUrl || PRODUCT_IMAGES[product.id] || CATEGORY_IMAGES[product.category];
  return product;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      catalog: catalog.map((product) => productRecord(product)),
      cart: cart.products.map((product) => productRecord(product)),
      orders,
    }));
  } catch {
    toast('Browser storage is unavailable; changes will not persist.', false);
  }
}

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.catalog)) return false;
    const restoredCatalog = saved.catalog.map(productFromRecord);
    const restoredCart = (Array.isArray(saved.cart) ? saved.cart : []).map(productFromRecord);
    const restoredOrders = Array.isArray(saved.orders) ? saved.orders : [];
    catalog = restoredCatalog;
    orders = restoredOrders;
    restoredCart.forEach((product) => cart.add(product));
    return true;
  } catch {
    catalog = [];
    orders = [];
    cart.clear();
    return false;
  }
}

function createDemoInventory() {
  return [
    new Book('B001', 'Clean Code', 1200, 1, 'Robert C. Martin', 'Programming'),
    new Book('B002', 'The Design of Everyday Things', 950, 8, 'Don Norman', 'Design'),
    new Book('B003', 'Atomic Habits', 720, 2, 'James Clear', 'Personal development'),
    new Electronics('E001', 'Wireless Mouse', 2500, 12, 'Logitech', 12),
    new Electronics('E002', 'Noise-cancelling Headphones', 8900, 5, 'Sony', 24),
    new Electronics('E003', 'USB-C Hub', 3200, 3, 'Anker', 18),
    new Clothing('C001', 'Cotton T-Shirt', 600, 18, 'M', 'Cotton'),
    new Clothing('C002', 'Everyday Hoodie', 1850, 6, 'L', 'Organic cotton'),
    new Clothing('C003', 'Canvas Tote Bag', 420, 2, 'One size', 'Recycled canvas'),
    new Grocery('G001', 'Premium Rice', 150, 25, 1, false),
    new Grocery('G002', 'Ground Coffee', 380, 11, 0.25, false),
    new Grocery('G003', 'Fresh Strawberries', 240, 7, 0.5, true),
  ].map((product) => {
    product.imageUrl = PRODUCT_IMAGES[product.id];
    return product;
  });
}

function readProduct() {
  const type = $('type').value;
  const id = text('id', 'Product ID');
  const name = text('name', 'Product name');
  const price = num('price', 'Price');
  const quantity = num('qty', 'Opening stock');
  const imageUrl = $('imageUrl').value.trim();
  if (price < 0) throw new Error('Price cannot be negative.');
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Opening stock must be a whole number above zero.');
  if (catalog.some((product) => product.id.toLowerCase() === id.toLowerCase() && product.id !== editingId)) throw new Error('Product ID already exists.');
  if (imageUrl) {
    let parsed;
    try { parsed = new URL(imageUrl); } catch { throw new Error('Product photo URL must be valid.'); }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Product photo must use HTTP or HTTPS.');
  }

  let product;
  switch (type) {
    case 'Book': product = new Book(id, name, price, quantity, text('f_author', 'Author'), text('f_genre', 'Genre')); break;
    case 'Electronics': {
      const warranty = num('f_warranty', 'Warranty');
      if (warranty < 0) throw new Error('Warranty cannot be negative.');
      product = new Electronics(id, name, price, quantity, text('f_brand', 'Brand'), warranty);
      break;
    }
    case 'Clothing': product = new Clothing(id, name, price, quantity, text('f_size', 'Size'), text('f_material', 'Material')); break;
    case 'Grocery': {
      const weight = num('f_weight', 'Weight');
      if (weight <= 0) throw new Error('Weight must be above zero.');
      product = new Grocery(id, name, price, quantity, weight, $('f_perishable').checked);
      break;
    }
    default: throw new Error('Select a valid product category.');
  }
  product.imageUrl = imageUrl || CATEGORY_IMAGES[product.category];
  return product;
}

function setImageFallbacks(root) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.src !== img.dataset.fallback) img.src = img.dataset.fallback;
      else img.classList.add('image-unavailable');
    }, { once: true });
  });
}

function renderDashboard() {
  const activeOrders = orders.filter((order) => order.status !== 'Cancelled');
  const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length;
  const stockUnits = catalog.reduce((sum, product) => sum + product.quantity, 0);
  const lowStock = catalog.filter((product) => product.quantity <= 3).length;
  $('metricRevenue').textContent = Utils.money(revenue);
  $('metricOrders').textContent = orders.length;
  $('metricOrderNote').textContent = `${pending} awaiting fulfillment`;
  $('metricProducts').textContent = catalog.length;
  $('metricUnits').textContent = `${stockUnits} units in stock`;
  $('metricLowStock').textContent = lowStock;
}

function renderInventory() {
  const query = $('inventorySearch').value.trim().toLowerCase();
  const category = $('inventoryCategory').value;
  const products = catalog.filter((product) => {
    const matchesText = `${product.id} ${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesText && (!category || product.category === category);
  });
  $('inventoryCount').textContent = `${catalog.length} ${catalog.length === 1 ? 'product' : 'products'}`;
  const body = $('inventoryBody');
  if (!products.length) {
    body.innerHTML = `<tr><td colspan="5" class="empty">${catalog.length ? 'No inventory matches this filter.' : 'Your catalog is empty. Add a product or load sample inventory.'}</td></tr>`;
    return;
  }
  body.innerHTML = products.map((product) => {
    const reserved = cart.products.find((item) => item.id === product.id)?.quantity || 0;
    const imageUrl = product.imageUrl || CATEGORY_IMAGES[product.category];
    return `<tr><td><div class="product-cell"><img src="${Utils.esc(imageUrl)}" data-fallback="${Utils.esc(CATEGORY_IMAGES[product.category])}" alt="${Utils.esc(product.name)}" loading="lazy" width="48" height="48"><div><strong>${Utils.esc(product.name)}</strong><small>${Utils.esc(product.id)}</small></div></div></td><td><span class="category-tag">${Utils.esc(product.category)}</span></td><td class="n">${Utils.money(product.price)}</td><td><div class="quantity-control stock-control"><button type="button" data-stock-id="${Utils.esc(product.id)}" data-delta="-1" aria-label="Reduce ${Utils.esc(product.name)} stock" ${product.quantity <= reserved ? 'disabled' : ''}>-</button><span class="stock-value ${product.quantity <= 3 ? 'low-stock' : ''}">${product.quantity}</span><button type="button" data-stock-id="${Utils.esc(product.id)}" data-delta="1" aria-label="Increase ${Utils.esc(product.name)} stock">+</button></div></td><td><div class="inventory-actions"><button type="button" data-edit-product="${Utils.esc(product.id)}" ${reserved ? 'disabled' : ''}>Edit</button><button type="button" data-add-to-cart="${Utils.esc(product.id)}" ${product.quantity <= reserved ? 'disabled' : ''}>Add to order</button><button type="button" class="link" data-delete-product="${Utils.esc(product.id)}" aria-label="Delete ${Utils.esc(product.name)}">Delete</button></div></td></tr>`;
  }).join('');
  setImageFallbacks(body);
}

function invoiceTotals() {
  if (cart.isEmpty()) return { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0, visitor: null };
  const visitor = cart.acceptVisitor(new InvoiceVisitor());
  return visitor.results.reduce((totals, line) => ({
    subtotal: totals.subtotal + line.subtotal,
    discount: totals.discount + line.discount,
    tax: totals.tax + line.tax,
    shipping: totals.shipping + line.shipping,
    total: totals.total + line.total,
    visitor,
  }), { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0, visitor });
}

function renderCart() {
  const products = cart.products;
  const units = products.reduce((sum, product) => sum + product.quantity, 0);
  const subtotal = products.reduce((sum, product) => sum + product.subtotal, 0);
  const query = $('cartSearch').value.trim().toLowerCase();
  const category = $('categoryFilter').value;
  const visibleProducts = products.filter((product) => {
    const matchesText = `${product.id} ${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesText && (!category || product.category === category);
  });
  const sort = $('sortProducts').value;
  if (sort === 'name') visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'price-asc') visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') visibleProducts.sort((a, b) => b.price - a.price);
  $('productCount').textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;
  $('unitCount').textContent = units;
  $('cartValue').textContent = Utils.money(subtotal);
  $('checkoutTotal').textContent = Utils.money(invoiceTotals().total);
  $('btnClearCart').disabled = products.length === 0;
  $('placeOrder').disabled = products.length === 0;

  const body = $('cartBody');
  if (!visibleProducts.length) {
    const message = products.length ? 'No products match these filters.' : 'Your cart is empty. Add products from inventory to start an order.';
    body.innerHTML = `<tr><td colspan="6" class="empty">${message}</td></tr>`;
    return;
  }
  body.innerHTML = visibleProducts.map((product) => {
    const fallback = CATEGORY_IMAGES[product.category];
    const photo = product.imageUrl || PRODUCT_IMAGES[product.id] || fallback;
    return `<tr><td><div class="product-cell"><img src="${Utils.esc(photo)}" data-fallback="${Utils.esc(fallback)}" alt="${Utils.esc(product.name)}" loading="lazy" width="48" height="48"><div><strong>${Utils.esc(product.name)}</strong><small>${Utils.esc(product.id)}</small></div></div></td><td><span class="category-tag">${Utils.esc(product.category)}</span></td><td class="n">${Utils.money(product.price)}</td><td><div class="quantity-control"><button type="button" data-cart-id="${Utils.esc(product.id)}" data-delta="-1" aria-label="Decrease ${Utils.esc(product.name)} quantity" ${product.quantity <= 1 ? 'disabled' : ''}>-</button><span>${product.quantity}</span><button type="button" data-cart-id="${Utils.esc(product.id)}" data-delta="1" aria-label="Increase ${Utils.esc(product.name)} quantity">+</button></div></td><td class="n">${Utils.money(product.subtotal)}</td><td><button type="button" class="link" data-remove-cart="${Utils.esc(product.id)}" aria-label="Remove ${Utils.esc(product.name)}">Remove</button></td></tr>`;
  }).join('');
  setImageFallbacks(body);
}

function renderOrders() {
  const query = $('orderSearch').value.trim().toLowerCase();
  const status = $('orderStatusFilter').value;
  const visibleOrders = orders.filter((order) => {
    const matchesText = `${order.id} ${order.customer.name} ${order.customer.email}`.toLowerCase().includes(query);
    return matchesText && (!status || order.status === status);
  });
  $('ordersCount').textContent = `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`;
  const body = $('ordersBody');
  if (!visibleOrders.length) {
    body.innerHTML = `<tr><td colspan="6" class="empty">${orders.length ? 'No orders match this filter.' : 'Completed checkouts will appear here.'}</td></tr>`;
    return;
  }
  body.innerHTML = visibleOrders.map((order) => {
    const unitCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const nextStatuses = STATUS_NEXT[order.status] || [];
    const options = [order.status, ...nextStatuses].map((value) => `<option${value === order.status ? ' selected' : ''}>${value}</option>`).join('');
    return `<tr><td><strong>${Utils.esc(order.id)}</strong><small>${Utils.esc(order.payment)}</small></td><td>${Utils.esc(new Date(order.date).toLocaleDateString())}</td><td><strong>${Utils.esc(order.customer.name)}</strong><small>${Utils.esc(order.customer.email)}</small></td><td>${unitCount} units</td><td class="n">${Utils.money(order.total)}</td><td><select class="status-select status-${order.status.toLowerCase()}" data-order-status="${Utils.esc(order.id)}" aria-label="Status for ${Utils.esc(order.id)}">${options}</select></td></tr>`;
  }).join('');
}

function renderAll() {
  renderDashboard();
  renderInventory();
  renderCart();
  renderOrders();
}

function addToCart(id) {
  const product = catalog.find((item) => item.id === id);
  if (!product) throw new Error('Product is no longer in the catalog.');
  const line = cart.products.find((item) => item.id === id);
  if ((line?.quantity || 0) >= product.quantity) throw new Error('There is no more stock available for this product.');
  if (line) cart.adjustQuantity(id, 1);
  else cart.add(productFromRecord(productRecord(product, 1)));
}

function loadDemo() {
  const demo = createDemoInventory();
  let added = 0;
  demo.forEach((product) => {
    if (!catalog.some((item) => item.id.toLowerCase() === product.id.toLowerCase())) {
      catalog.push(product);
      added++;
    }
  });
  saveState();
  renderAll();
  toast(added ? `${added} sample products added to inventory.` : 'Sample inventory is already loaded.', added > 0);
}

function resetProductForm() {
  $('addForm').reset();
  $('id').disabled = false;
  $('productSubmit').textContent = 'Add product';
  $('cancelEdit').hidden = true;
  editingId = null;
  renderExtraFields();
}

function beginProductEdit(id) {
  const product = catalog.find((item) => item.id === id);
  if (!product) return toast('Product is no longer in the catalog.', false);
  if (cart.has(id)) return toast('Remove this product from the current order before editing it.', false);
  editingId = id;
  $('type').value = product.category;
  renderExtraFields();
  $('id').value = product.id;
  $('id').disabled = true;
  $('name').value = product.name;
  $('price').value = product.price;
  $('qty').value = product.quantity;
  $('imageUrl').value = product.imageUrl || '';
  if (product.category === 'Book') {
    $('f_author').value = product.author;
    $('f_genre').value = product.genre;
  }
  if (product.category === 'Electronics') {
    $('f_brand').value = product.brand;
    $('f_warranty').value = product.warranty;
  }
  if (product.category === 'Clothing') {
    $('f_size').value = product.size;
    $('f_material').value = product.material;
  }
  if (product.category === 'Grocery') {
    $('f_weight').value = product.weight;
    $('f_perishable').checked = product.perishable;
  }
  $('productSubmit').textContent = 'Save changes';
  $('cancelEdit').hidden = false;
  $('name').focus({ preventScroll: true });
}

function run(visitors, message) {
  if (cart.isEmpty()) return toast('Add products to the order before running analysis.', false);
  $('output').innerHTML = visitors.map((visitor) => {
    cart.acceptVisitor(visitor);
    return `<section class="result"><h3>${Utils.esc(visitor.title)}</h3>${visitor.toHTML()}</section>`;
  }).join('');
  $('output').scrollIntoView({ behavior: 'smooth', block: 'start' });
  toast(message);
}

function placeOrder(event) {
  event.preventDefault();
  if (cart.isEmpty()) return toast('Add products to the order before checkout.', false);
  try {
    const lines = cart.products;
    lines.forEach((line) => {
      const stock = catalog.find((product) => product.id === line.id);
      if (!stock || line.quantity > stock.quantity) throw new Error(`${line.name} no longer has enough stock.`);
    });
    const totals = invoiceTotals();
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      customer: {
        name: text('customerName', 'Customer name'),
        email: text('customerEmail', 'Email address'),
        address: text('customerAddress', 'Delivery address'),
      },
      payment: $('paymentMethod').value,
      status: 'Processing',
      items: lines.map((product) => productRecord(product)),
      ...Object.fromEntries(['subtotal', 'discount', 'tax', 'shipping', 'total'].map((key) => [key, totals[key]])),
    };
    lines.forEach((line) => {
      const stock = catalog.find((product) => product.id === line.id);
      stock.setStock(stock.quantity - line.quantity);
    });
    orders.unshift(order);
    if (totals.visitor) {
      $('output').innerHTML = `<section class="result"><h3>Order ${Utils.esc(order.id)} invoice</h3>${totals.visitor.toHTML()}</section>`;
    }
    cart.clear();
    $('checkoutForm').reset();
    saveState();
    renderAll();
    toast(`Order ${order.id} placed successfully.`);
  } catch (error) {
    toast(error.message, false);
  }
}

function changeOrderStatus(event) {
  const select = event.target.closest('[data-order-status]');
  if (!select) return;
  const order = orders.find((item) => item.id === select.dataset.orderStatus);
  if (!order) return;
  const nextStatus = select.value;
  if (!(STATUS_NEXT[order.status] || []).includes(nextStatus)) {
    toast('That order status transition is not available.', false);
    renderOrders();
    return;
  }
  if (nextStatus === 'Cancelled') {
    order.items.forEach((item) => {
      const stock = catalog.find((product) => product.id === item.id);
      if (stock) stock.setStock(stock.quantity + item.quantity);
    });
  }
  order.status = nextStatus;
  saveState();
  renderAll();
  toast(`Order ${order.id} marked ${nextStatus.toLowerCase()}.`);
}

$('type').addEventListener('change', renderExtraFields);
$('addForm').addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const product = readProduct();
    if (editingId) {
      const reserved = cart.products.find((item) => item.id === editingId)?.quantity || 0;
      if (product.quantity < reserved) throw new Error('Stock cannot be lower than the quantity in the current order.');
      catalog[catalog.findIndex((item) => item.id === editingId)] = product;
    } else catalog.push(product);
    const wasEditing = Boolean(editingId);
    resetProductForm();
    saveState();
    renderAll();
    toast(wasEditing ? 'Product changes saved.' : 'Product added to inventory.');
  } catch (error) { toast(error.message, false); }
});
$('cancelEdit').addEventListener('click', resetProductForm);
$('inventoryBody').addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add-to-cart]');
  const stockButton = event.target.closest('[data-stock-id]');
  const deleteButton = event.target.closest('[data-delete-product]');
  const editButton = event.target.closest('[data-edit-product]');
  try {
    if (editButton) {
      beginProductEdit(editButton.dataset.editProduct);
      return;
    } else if (addButton) {
      addToCart(addButton.dataset.addToCart);
      toast('Product added to the order.');
    } else if (stockButton) {
      const product = catalog.find((item) => item.id === stockButton.dataset.stockId);
      const reserved = cart.products.find((item) => item.id === stockButton.dataset.stockId)?.quantity || 0;
      const nextStock = product.quantity + Number(stockButton.dataset.delta);
      if (nextStock < reserved) throw new Error('Stock cannot be reduced below the quantity in the current order.');
      product.setStock(nextStock);
      toast('Inventory stock updated.');
    } else if (deleteButton) {
      const id = deleteButton.dataset.deleteProduct;
      if (cart.has(id)) throw new Error('Remove this product from the current order before deleting it.');
      catalog = catalog.filter((product) => product.id !== id);
      toast('Product removed from inventory.');
    } else return;
    saveState();
    renderAll();
  } catch (error) { toast(error.message, false); }
});
$('cartBody').addEventListener('click', (event) => {
  const quantityButton = event.target.closest('[data-cart-id]');
  const removeButton = event.target.closest('[data-remove-cart]');
  try {
    if (quantityButton) {
      const id = quantityButton.dataset.cartId;
      const line = cart.products.find((product) => product.id === id);
      const stock = catalog.find((product) => product.id === id);
      const nextQuantity = line.quantity + Number(quantityButton.dataset.delta);
      if (nextQuantity > stock.quantity) throw new Error('There is no more stock available for this product.');
      cart.adjustQuantity(id, Number(quantityButton.dataset.delta));
    } else if (removeButton) cart.remove(removeButton.dataset.removeCart);
    else return;
    saveState();
    renderAll();
    toast(quantityButton ? 'Order quantity updated.' : 'Product removed from the order.');
  } catch (error) { toast(error.message, false); }
});
$('ordersBody').addEventListener('change', changeOrderStatus);
$('checkoutForm').addEventListener('submit', placeOrder);
$('inventorySearch').addEventListener('input', renderInventory);
$('inventoryCategory').addEventListener('change', renderInventory);
$('cartSearch').addEventListener('input', renderCart);
$('categoryFilter').addEventListener('change', renderCart);
$('sortProducts').addEventListener('change', renderCart);
$('orderSearch').addEventListener('input', renderOrders);
$('orderStatusFilter').addEventListener('change', renderOrders);
$('btnClearCart').addEventListener('click', () => {
  cart.clear();
  saveState();
  renderAll();
  toast('Current order cleared.');
});
$('demo').addEventListener('click', loadDemo);
$('btnDiscount').addEventListener('click', () => run([new DiscountVisitor()], 'Discount analysis complete.'));
$('btnTax').addEventListener('click', () => run([new TaxVisitor()], 'Tax analysis complete.'));
$('btnShipping').addEventListener('click', () => run([new ShippingVisitor()], 'Shipping analysis complete.'));
$('btnInvoice').addEventListener('click', () => run([new InvoiceVisitor()], 'Invoice generated.'));
$('btnReport').addEventListener('click', () => run([new ProductReportVisitor()], 'Product report generated.'));
$('btnAll').addEventListener('click', () => run([new DiscountVisitor(), new TaxVisitor(), new ShippingVisitor(), new InvoiceVisitor(), new ProductReportVisitor()], 'Complete order analysis finished.'));

renderExtraFields();
if (!restoreState()) {
  catalog = createDemoInventory();
  saveState();
}
renderAll();
