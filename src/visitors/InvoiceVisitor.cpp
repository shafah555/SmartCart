#include "InvoiceVisitor.h"
#include <iostream>
#include "../products/Book.h"
#include "../products/Electronics.h"
#include "../products/Clothing.h"
#include "../products/Grocery.h"

void InvoiceVisitor::visit(Book& book) { issue(book); }
void InvoiceVisitor::visit(Electronics& e) { issue(e); }
void InvoiceVisitor::visit(Clothing& c) { issue(c); }
void InvoiceVisitor::visit(Grocery& g) { issue(g); }

void InvoiceVisitor::issue(Product& p) {
    // Nested double dispatch: the product accepts the helper visitors.
    p.accept(discount_);
    p.accept(shipping_);
    const double subtotal = discount_.lastResult().subtotal;
    const double discount = discount_.lastResult().discountAmount;

    tax_.setTaxableOverride(subtotal - discount);  // tax is charged on the discounted amount
    p.accept(tax_);
    const double tax = tax_.lastResult().taxAmount;
    const double shipping = shipping_.lastResult().cost;
    const double grand = subtotal - discount + tax + shipping;

    sumSubtotal_ += subtotal;
    sumDiscount_ += discount;
    sumTax_ += tax;
    sumShipping_ += shipping;
    sumGrand_ += grand;
    ++items_;

    std::cout << "Product ID : " << p.getId() << "\n"
              << "Product    : " << p.getName() << "\n"
              << "Category   : " << p.getCategory() << "\n"
              << "Quantity   : " << p.getQuantity() << "\n"
              << "Unit Price : " << num(p.getPrice()) << "\n\n"
              << "Subtotal   : " << num(subtotal) << "\n"
              << "Discount   : " << num(discount) << "\n"
              << "Tax        : " << num(tax) << "\n"
              << "Shipping   : " << num(shipping) << "\n"
              << line('-') << "\n"
              << "Item Total : " << num(grand) << "\n\n";
}

void InvoiceVisitor::begin() {
    sumSubtotal_ = sumDiscount_ = sumTax_ = sumShipping_ = sumGrand_ = 0;
    items_ = 0;
    std::cout << "\n" << line('=') << "\n" << center("SMARTCART INVOICE") << "\n" << line('=') << "\n\n";
}

void InvoiceVisitor::end() {
    std::cout << line('=') << "\n"
              << "Items          : " << items_ << "\n"
              << "Subtotal       : " << num(sumSubtotal_) << "\n"
              << "Discount       : " << num(sumDiscount_) << "\n"
              << "Tax            : " << num(sumTax_) << "\n"
              << "Shipping       : " << num(sumShipping_) << "\n"
              << line('-') << "\n"
              << "Grand Total    : " << num(sumGrand_) << "\n"
              << line('=') << "\n";
}
