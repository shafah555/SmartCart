/* CONCRETE VISITOR – readable details per product type. */
class ProductReportVisitor extends ProductVisitor {
  get title() { return 'Product Report'; }
  visitBook(p) { return this.#add(p, { Author: p.author, Genre: p.genre }); }
  visitElectronics(p) { return this.#add(p, { Brand: p.brand, Warranty: `${p.warranty} months` }); }
  visitClothing(p) { return this.#add(p, { Size: p.size, Material: p.material }); }
  visitGrocery(p) { return this.#add(p, { Weight: `${p.weight} kg`, Perishable: p.perishable ? 'Yes' : 'No' }); }
  #add(p, extra) {
    const r = { ID: p.id, Name: p.name, Category: p.category, Price: Utils.money(p.price), Quantity: p.quantity, ...extra };
    this.results.push(r);
    return r;
  }
  toHTML() {
    return `<div class="reports">` + this.results.map((r) => `<dl>${Object.entries(r).map(([k, v]) => `<dt>${k}</dt><dd>${Utils.esc(v)}</dd>`).join('')}</dl>`).join('') + `</div>`;
  }
}
