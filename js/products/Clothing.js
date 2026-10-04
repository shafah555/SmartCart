/* CONCRETE ELEMENT – Clothing */
class Clothing extends Product {
  constructor(id, name, price, quantity, size, material) {
    super(id, name, price, quantity);
    this.size = size; this.material = material;
  }
  get category() { return 'Clothing'; }
  // Double dispatch: the product tells the visitor which concrete type it is.
  accept(visitor) { return visitor.visitClothing(this); }
}
