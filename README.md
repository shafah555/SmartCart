# SmartCart – Visitor Design Pattern (HTML, CSS, JavaScript)

Run: open `index.html` in a browser (no build step, no dependencies).
Publish: push to GitHub, then enable **Settings → Pages → Deploy from branch → main / root**.

| Pattern role | Class |
|---|---|
| Element | `Product` → `Book`, `Electronics`, `Clothing`, `Grocery` |
| Visitor | `ProductVisitor` |
| Concrete Visitors | `DiscountVisitor`, `TaxVisitor`, `ShippingVisitor`, `InvoiceVisitor`, `ProductReportVisitor` |
| Object Structure | `ShoppingCart` |
| Client | `js/main.js` |

Each product's `accept(visitor)` calls `visitor.visitBook(this)` (etc.) — double dispatch.
Because JavaScript has no overloading, `visit(Book&)` is named `visitBook(book)`.
Tax and discount rates are simulated demo values.
