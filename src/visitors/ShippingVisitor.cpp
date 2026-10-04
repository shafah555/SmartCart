#include "ShippingVisitor.h"
#include <iostream>
#include "../products/Book.h"
#include "../products/Electronics.h"
#include "../products/Clothing.h"
#include "../products/Grocery.h"

void ShippingVisitor::visit(Book& book) {
    record(book, 60.0 + 5.0 * (book.getQuantity() - 1), "60 + 5/extra item");
}
void ShippingVisitor::visit(Electronics& e) {
    record(e, 120.0, "120 flat");
}
void ShippingVisitor::visit(Clothing& c) {
    record(c, 80.0 + 10.0 * (c.getQuantity() - 1), "80 + 10/extra item");
}
void ShippingVisitor::visit(Grocery& g) {
    double totalWeight = g.getWeight() * g.getQuantity();
    record(g, 100.0 + 5.0 * totalWeight, "100 + 5/kg (" + num(totalWeight) + "kg)");
}

void ShippingVisitor::record(const Product& p, double cost, const std::string& rule) {
    last_.cost = cost;
    last_.rule = rule;
    total_ += cost;
    if (verbose_) {
        std::cout << pad(p.getId(), 6) << " " << pad(p.getName(), 20) << " "
                  << pad(p.getCategory(), 12) << " " << pad(std::to_string(p.getQuantity()), 4, true) << " "
                  << pad(rule, 24) << " " << pad(num(cost), 10, true) << "\n";
    }
}

void ShippingVisitor::begin() {
    total_ = 0;
    if (!verbose_) return;
    std::cout << "\n" << line('=', 82) << "\n" << center("SHIPPING COST CALCULATION", 82) << "\n" << line('=', 82) << "\n";
    std::cout << pad("ID", 6) << " " << pad("Name", 20) << " " << pad("Category", 12) << " " << pad("Qty", 4, true) << " "
              << pad("Rule", 24) << " " << pad("Shipping", 10, true) << "\n" << line('-', 82) << "\n";
}

void ShippingVisitor::end() {
    if (!verbose_) return;
    std::cout << line('-', 82) << "\nTotal Shipping : " << num(total_) << "\n" << line('=', 82) << "\n";
}
