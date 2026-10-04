/* ELEMENT (abstract) – every product must implement accept(visitor). */
class Product {
  #id; #name; #price; #quantity;
  constructor(id, name, price, quantity) {
    if (new.target === Product) throw new Error('Product is abstract.');
    this.#id = id; this.#name = name; this.#price = price; this.#quantity = quantity;
  }
  get id() { return this.#id; }
  get name() { return this.#name; }
  get price() { return this.#price; }
  get quantity() { return this.#quantity; }
  get subtotal() { return this.#price * this.#quantity; }
  get category() { throw new Error('category not implemented'); }
  accept(visitor) { throw new Error('accept() not implemented'); }
}
