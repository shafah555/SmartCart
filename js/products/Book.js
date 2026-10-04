/* CONCRETE ELEMENT – Book */
class Book extends Product {
  constructor(id, name, price, quantity, author, genre) {
    super(id, name, price, quantity);
    this.author = author; this.genre = genre;
  }
  get category() { return 'Book'; }
  // Double dispatch: the product tells the visitor which concrete type it is.
  accept(visitor) { return visitor.visitBook(this); }
}
