/* OBJECT STRUCTURE – holds products and lets a visitor walk through them. */
class ShoppingCart {
  #products = [];
  add(product) {
    if (this.has(product.id)) throw new Error('Product ID already exists.');
    this.#products.push(product);
  }
  has(id) { return this.#products.some((p) => p.id.toLowerCase() === id.toLowerCase()); }
  remove(id) {
    const i = this.#products.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());
    if (i < 0) throw new Error('Product ID not found.');
    this.#products.splice(i, 1);
  }
  adjustQuantity(id, amount) {
    const product = this.#products.find((p) => p.id.toLowerCase() === id.toLowerCase());
    if (!product) throw new Error('Product ID not found.');
    product.setQuantity(product.quantity + amount);
  }
  clear() { this.#products.length = 0; }
  get products() { return [...this.#products]; }
  isEmpty() { return this.#products.length === 0; }
  acceptVisitor(visitor) {
    visitor.results = [];
    for (const product of this.#products) product.accept(visitor);
    return visitor;
  }
}
