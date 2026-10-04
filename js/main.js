/* CLIENT – builds the UI, creates products and applies visitors to the cart. */
const cart = new ShoppingCart();
const $ = (id) => document.getElementById(id);

const FIELDS = {
  Book: [['author', 'Author', 'text'], ['genre', 'Genre', 'text']],
  Electronics: [['brand', 'Brand', 'text'], ['warranty', 'Warranty (months)', 'number']],
  Clothing: [['size', 'Size', 'text'], ['material', 'Material', 'text']],
  Grocery: [['weight', 'Weight (kg)', 'number'], ['perishable', 'Perishable', 'checkbox']],
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
  if (cart.isEmpty()) {
    body.innerHTML = '<tr><td colspan="6" class="empty">The cart is empty. Add a product or load the demo products.</td></tr>';
    return;
  }
  body.innerHTML = cart.products.map((p) => `<tr><td>${Utils.esc(p.id)}</td><td>${Utils.esc(p.name)}</td><td>${p.category}</td><td class="n">${Utils.money(p.price)}</td><td class="n">${p.quantity}</td><td><button class="link" data-remove="${Utils.esc(p.id)}">Remove</button></td></tr>`).join('');
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
    new Electronics('E001', 'Wireless Mouse', 2500, 2, 'Logitech', 12),
    new Clothing('C001', 'Cotton T-Shirt', 600, 3, 'M', 'Cotton'),
    new Grocery('G001', 'Premium Rice', 150, 5, 1, false),
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
  const id = e.target.dataset.remove;
  if (!id) return;
  try { cart.remove(id); renderCart(); toast('Product removed.'); } catch (err) { toast(err.message, false); }
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
