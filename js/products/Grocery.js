/* CONCRETE ELEMENT – Grocery */
class Grocery extends Product {
  constructor(id, name, price, quantity, weight, perishable) {
    super(id, name, price, quantity);
    this.weight = weight; this.perishable = perishable;
  }
  get category() { return 'Grocery'; }
  // Double dispatch: the product tells the visitor which concrete type it is.
  accept(visitor) { return visitor.visitGrocery(this); }
}
