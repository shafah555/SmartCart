#include "Grocery.h"
#include "../visitors/ProductVisitor.h"

Grocery::Grocery(std::string id, std::string name, double price, int quantity,
                 double weightKg, bool perishable)
    : Product(std::move(id), std::move(name), price, quantity),
      weightKg_(weightKg), perishable_(perishable) {
    if (!std::isfinite(weightKg_) || weightKg_ <= 0) throw std::invalid_argument("Weight must be greater than zero.");
}
void Grocery::accept(ProductVisitor& visitor) { visitor.visit(*this); }
std::string Grocery::getCategory() const { return "Grocery"; }
