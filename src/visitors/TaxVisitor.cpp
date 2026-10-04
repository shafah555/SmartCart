#include "TaxVisitor.h"
#include <iostream>
#include "../products/Book.h"
#include "../products/Electronics.h"
#include "../products/Clothing.h"
#include "../products/Grocery.h"

void TaxVisitor::visit(Book& book) { process(book, kBookRate); }
void TaxVisitor::visit(Electronics& e) { process(e, kElectronicsRate); }
void TaxVisitor::visit(Clothing& c) { process(c, kClothingRate); }
void TaxVisitor::visit(Grocery& g) { process(g, kGroceryRate); }

void TaxVisitor::process(const Product& p, double rate) {
    last_.subtotal = hasOverride_ ? override_ : p.getPrice() * p.getQuantity();
    last_.ratePercent = rate;
    last_.taxAmount = last_.subtotal * rate / 100.0;
    last_.finalAmount = last_.subtotal + last_.taxAmount;

    totalBase_ += last_.subtotal;
    totalTax_ += last_.taxAmount;
    totalFinal_ += last_.finalAmount;

    if (verbose_) {
        std::cout << pad(p.getId(), 6) << " " << pad(p.getName(), 20) << " "
                  << pad(num(last_.subtotal), 12, true) << " "
                  << pad(num(rate), 7, true) << " "
                  << pad(num(last_.taxAmount), 12, true) << " "
                  << pad(num(last_.finalAmount), 13, true) << "\n";
    }
}

void TaxVisitor::begin() {
    totalBase_ = totalTax_ = totalFinal_ = 0;
    if (!verbose_) return;
    std::cout << "\n" << line('=', 75) << "\n" << center("TAX CALCULATION (simulated demo rates)", 75) << "\n" << line('=', 75) << "\n";
    std::cout << pad("ID", 6) << " " << pad("Name", 20) << " " << pad("Subtotal", 12, true) << " "
              << pad("Tax%", 7, true) << " " << pad("Tax", 12, true) << " " << pad("Final", 13, true)
              << "\n" << line('-', 75) << "\n";
}

void TaxVisitor::end() {
    if (!verbose_) return;
    std::cout << line('-', 75) << "\n"
              << "Total Subtotal : " << num(totalBase_) << "\n"
              << "Total Tax      : " << num(totalTax_) << "\n"
              << "Total Amount   : " << num(totalFinal_) << "\n"
              << "Note: tax rates are simulated for educational purposes only.\n" << line('=', 75) << "\n";
}
