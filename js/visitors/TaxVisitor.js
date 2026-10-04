/* CONCRETE VISITOR – simulated tax rates (educational only).
   afterDiscount=true taxes the discounted amount (used by the invoice). */
class TaxVisitor extends ProductVisitor {
  static RATES = { Book: 5, Electronics: 15, Clothing: 10, Grocery: 2 };
  constructor(afterDiscount = false) { super(); this.afterDiscount = afterDiscount; }
  get title() { return 'Tax Calculation (simulated rates)'; }
  visitBook(p) { return this.#calc(p); }
  visitElectronics(p) { return this.#calc(p); }
  visitClothing(p) { return this.#calc(p); }
  visitGrocery(p) { return this.#calc(p); }
  #calc(p) {
    const percent = TaxVisitor.RATES[p.category];
    const discount = this.afterDiscount ? p.subtotal * DiscountVisitor.RATES[p.category] / 100 : 0;
    const base = p.subtotal - discount;
    const amount = base * percent / 100;
    const r = { id: p.id, name: p.name, subtotal: p.subtotal, percent, amount, final: base + amount };
    this.results.push(r);
    return r;
  }
  toHTML() {
    const rows = this.results.map((r) => `<tr><td>${Utils.esc(r.name)}</td><td class="n">${Utils.money(r.subtotal)}</td><td class="n">${r.percent}%</td><td class="n">${Utils.money(r.amount)}</td><td class="n"><b>${Utils.money(r.final)}</b></td></tr>`).join('');
    return `<table><thead><tr><th>Product</th><th>Subtotal</th><th>Tax %</th><th>Tax</th><th>Final amount</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
}
