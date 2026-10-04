/* CONCRETE VISITOR – combines the other visitors via double dispatch. */
class InvoiceVisitor extends ProductVisitor {
  get title() { return 'Invoice'; }
  visitBook(p) { return this.#line(p); }
  visitElectronics(p) { return this.#line(p); }
  visitClothing(p) { return this.#line(p); }
  visitGrocery(p) { return this.#line(p); }
  #line(p) {
    const d = p.accept(new DiscountVisitor());
    const t = p.accept(new TaxVisitor(true));
    const s = p.accept(new ShippingVisitor());
    const r = { id: p.id, name: p.name, category: p.category, quantity: p.quantity, price: p.price,
      subtotal: p.subtotal, discount: d.amount, tax: t.amount, shipping: s.cost,
      total: p.subtotal - d.amount + t.amount + s.cost };
    this.results.push(r);
    return r;
  }
  toHTML() {
    const body = this.results.map((r) => `<div class="invoice"><h4>SMARTCART INVOICE</h4>
<pre>ID:         ${Utils.esc(r.id)}
Product:    ${Utils.esc(r.name)}
Category:   ${r.category}
Quantity:   ${r.quantity}
Unit Price: ${Utils.money(r.price)}

Subtotal:   ${Utils.money(r.subtotal)}
Discount:   ${Utils.money(r.discount)}
Tax:        ${Utils.money(r.tax)}
Shipping:   ${Utils.money(r.shipping)}
-----------------------------
Grand Total: ${Utils.money(r.total)}</pre></div>`).join('');
    const grand = this.results.reduce((s, r) => s + r.total, 0);
    return `<div class="invoices">${body}</div><p class="grand">Cart grand total: <b>${Utils.money(grand)}</b></p>`;
  }
}
