/* CONCRETE VISITOR – demo discount rates (simulated). */
class DiscountVisitor extends ProductVisitor {
  static RATES = { Book: 10, Electronics: 15, Clothing: 20, Grocery: 5 };
  get title() { return 'Discount Calculation'; }
  visitBook(p) { return this.#calc(p); }
  visitElectronics(p) { return this.#calc(p); }
  visitClothing(p) { return this.#calc(p); }
  visitGrocery(p) { return this.#calc(p); }
  #calc(p) {
    const percent = DiscountVisitor.RATES[p.category];
    const amount = p.subtotal * percent / 100;
    const r = { id: p.id, name: p.name, price: p.price, quantity: p.quantity,
      subtotal: p.subtotal, percent, amount, final: p.subtotal - amount };
    this.results.push(r);
    return r;
  }
  toHTML() {
    const rows = this.results.map((r) => `<tr><td>${Utils.esc(r.name)}</td><td class="n">${Utils.money(r.price)}</td><td class="n">${r.quantity}</td><td class="n">${Utils.money(r.subtotal)}</td><td class="n">${r.percent}%</td><td class="n">${Utils.money(r.amount)}</td><td class="n"><b>${Utils.money(r.final)}</b></td></tr>`).join('');
    return `<table><thead><tr><th>Product</th><th>Original price</th><th>Qty</th><th>Subtotal</th><th>Discount %</th><th>Discount</th><th>Final price</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
}
