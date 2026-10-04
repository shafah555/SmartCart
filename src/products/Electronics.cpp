#include "Electronics.h"
#include "../visitors/ProductVisitor.h"

Electronics::Electronics(std::string id, std::string name, double price, int quantity,
                         std::string brand, int warrantyMonths)
    : Product(std::move(id), std::move(name), price, quantity),
      brand_(std::move(brand)), warrantyMonths_(warrantyMonths) {
    requireText(brand_, "Brand");
    if (warrantyMonths_ < 0) throw std::invalid_argument("Warranty cannot be negative.");
}
void Electronics::accept(ProductVisitor& visitor) { visitor.visit(*this); }
std::string Electronics::getCategory() const { return "Electronics"; }
