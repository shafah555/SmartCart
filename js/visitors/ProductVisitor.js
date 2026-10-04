/* VISITOR (abstract) – JavaScript has no method overloading,
   so visit(Book) becomes visitBook(book), and so on. */
class ProductVisitor {
  constructor() { this.results = []; }
  visitBook(book) { throw new Error('visitBook not implemented'); }
  visitElectronics(electronics) { throw new Error('visitElectronics not implemented'); }
  visitClothing(clothing) { throw new Error('visitClothing not implemented'); }
  visitGrocery(grocery) { throw new Error('visitGrocery not implemented'); }
  get title() { return 'Result'; }
  toHTML() { throw new Error('toHTML not implemented'); }
}
