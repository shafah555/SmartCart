/* CONCRETE VISITOR – base fee per product line, plus a small
   quantity surcharge (grocery uses total weight instead). */
class ShippingVisitor extends ProductVisitor {
  get title() { return 'Shipping Cost'; }
  visitBook(p) { return this.#save(p, 60 + 10 * (p.quantity - 1), '60 + 10 per extra copy'); }
  visitElectronics(p) { return this.#save(p, 120, 'flat 120 per line'); }
  visitClothing(p) { return this.#save(p, 80 + 15 * (p.quantity - 1), '80 + 15 per extra item'); }
  visitGrocery(p) {
    const kg = p.weight * p.quantity;
    return this.#save(p, 100 + 5 * kg, `100 + 5 per kg (${kg} kg)`);
  }
  #save(p, cost, rule) {
    const r = { id: p.id, name: p.name, category: p.category, quantity: p.quantity, rule, cost };
    this.results.push(r);
    return r;
  }
  toHTML() {
    const rows = this.results.map((r) => `<tr><td>${Utils.esc(r.name)}</td><td>${r.category}</td><td class="n">${r.quantity}</td><td>${r.rule}</td><td class="n"><b>${Utils.money(r.cost)}</b></td></tr>`).join('');
    const total = this.results.reduce((s, r) => s + r.cost, 0);
    return `<table><thead><tr><th>Product</th><th>Category</th><th>Qty</th><th>Rule</th><th>Shipping</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="4">Total shipping</td><td class="n">${Utils.money(total)}</td></tr></tfoot></table>`;
  }
}
