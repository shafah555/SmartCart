#include "ProductReportVisitor.h"
#include <iostream>
#include "../products/Book.h"
#include "../products/Electronics.h"
#include "../products/Clothing.h"
#include "../products/Grocery.h"

void ProductReportVisitor::field(const std::string& label, const std::string& value) {
    std::cout << pad(label, 10) << ": " << value << "\n";
}

void ProductReportVisitor::common(const Product& p) {
    ++count_;
    field("ID", p.getId());
    field("Name", p.getName());
    field("Category", p.getCategory());
    field("Price", num(p.getPrice()));
    field("Quantity", std::to_string(p.getQuantity()));
}

void ProductReportVisitor::visit(Book& b) {
    common(b);
    field("Author", b.getAuthor());
    field("Genre", b.getGenre());
    std::cout << line('-') << "\n";
}
void ProductReportVisitor::visit(Electronics& e) {
    common(e);
    field("Brand", e.getBrand());
    field("Warranty", std::to_string(e.getWarranty()) + " months");
    std::cout << line('-') << "\n";
}
void ProductReportVisitor::visit(Clothing& c) {
    common(c);
    field("Size", c.getSize());
    field("Material", c.getMaterial());
    std::cout << line('-') << "\n";
}
void ProductReportVisitor::visit(Grocery& g) {
    common(g);
    field("Weight", num(g.getWeight()) + " kg");
    field("Perishable", g.isPerishable() ? "Yes" : "No");
    std::cout << line('-') << "\n";
}

void ProductReportVisitor::begin() {
    count_ = 0;
    std::cout << "\n" << line('=') << "\n" << center("SMARTCART PRODUCT REPORT") << "\n" << line('=') << "\n\n";
}
void ProductReportVisitor::end() {
    std::cout << "Total products: " << count_ << "\n" << line('=') << "\n";
}
