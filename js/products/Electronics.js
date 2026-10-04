/* CONCRETE ELEMENT – Electronics */
class Electronics extends Product {
  constructor(id, name, price, quantity, brand, warranty) {
    super(id, name, price, quantity);
    this.brand = brand; this.warranty = warranty;
  }
  get category() { return 'Electronics'; }
  // Double dispatch: the product tells the visitor which concrete type it is.
  accept(visitor) { return visitor.visitElectronics(this); }
}
