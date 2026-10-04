#include "DiscountVisitor.h"
#include <iostream>
#include "../products/Book.h"
#include "../products/Electronics.h"
#include "../products/Clothing.h"
#include "../products/Grocery.h"

void DiscountVisitor::visit(Book& book) { process(book, kBookRate); }
void DiscountVisitor::visit(Electronics& e) { process(e, kElectronicsRate); }
void DiscountVisitor::visit(Clothing& c) { process(c, kClothingRate); }
void DiscountVisitor::visit(Grocery& g) { process(g, kGroceryRate); }

void DiscountVisitor::process(const Product& p, double rate) {
    last_.unitPrice = p.getPrice();
    last_.quantity = p.getQuantity();
    last_.subtotal = last_.unitPrice * last_.quantity;
    last_.ratePercent = rate;
    last_.discountAmount = last_.subtotal * rate / 100.0;
    last_.finalPrice = last_.subtotal - last_.discountAmount;

    totalSubtotal_ += last_.subtotal;
    totalDiscount_ += last_.discountAmount;
    totalFinal_ += last_.finalPrice;

    if (verbose_) {
        std::cout << pad(p.getId(), 6) << " " << pad(p.getName(), 16) << " "
                  << pad(num(last_.unitPrice), 9, true) << " "
                  << pad(std::to_string(last_.quantity), 4, true) << " "
                  << pad(num(last_.subtotal), 10, true) << " "
                  << pad(num(rate), 6, true) << " "
                  << pad(num(last_.discountAmount), 10, true) << " "
                  << pad(num(last_.finalPrice), 11, true) << "\n";
    }
}

void DiscountVisitor::begin() {
    totalSubtotal_ = totalDiscount_ = totalFinal_ = 0;
    if (!verbose_) return;
    std::cout << "\n" << line('=', 79) << "\n" << center("DISCOUNT CALCULATION (demo rates)", 79) << "\n" << line('=', 79) << "\n";
    std::cout << pad("ID", 6) << " " << pad("Name", 16) << " " << pad("Price", 9, true) << " "
              << pad("Qty", 4, true) << " " << pad("Subtotal", 10, true) << " " << pad("Disc%", 6, true) << " "
              << pad("Discount", 10, true) << " " << pad("Final", 11, true) << "\n" << line('-', 79) << "\n";
}

void DiscountVisitor::end() {
    if (!verbose_) return;
    std::cout << line('-', 79) << "\n"
              << "Total Subtotal : " << num(totalSubtotal_) << "\n"
              << "Total Discount : " << num(totalDiscount_) << "\n"
              << "Total Final    : " << num(totalFinal_) << "\n" << line('=', 79) << "\n";
}
