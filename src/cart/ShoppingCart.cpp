#include "ShoppingCart.h"
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <stdexcept>

void ShoppingCart::addProduct(std::unique_ptr<Product> product) {
    if (!product) throw std::invalid_argument("Cannot add a null product.");
    if (hasProduct(product->getId())) throw std::invalid_argument("Product ID already exists.");
    products_.push_back(std::move(product));
}

bool ShoppingCart::removeProduct(const std::string& id) {
    auto it = std::find_if(products_.begin(), products_.end(),
                           [&](const std::unique_ptr<Product>& p) { return p->getId() == id; });
    if (it == products_.end()) return false;
    products_.erase(it);
    return true;
}

bool ShoppingCart::hasProduct(const std::string& id) const {
    return std::any_of(products_.begin(), products_.end(),
                       [&](const std::unique_ptr<Product>& p) { return p->getId() == id; });
}

void ShoppingCart::viewProducts() const {
    const std::string bar(70, '=');
    std::cout << "\n" << bar << "\n                         PRODUCTS IN CART\n" << bar << "\n";
    std::cout << std::left << std::setw(8) << "ID" << std::setw(22) << "Name" << std::setw(14) << "Category"
              << std::right << std::setw(12) << "Price" << std::setw(6) << "Qty" << "\n"
              << std::string(70, '-') << "\n";
    for (const auto& p : products_) {
        std::ostringstream price;
        price << std::fixed << std::setprecision(2) << p->getPrice();
        std::string name = p->getName().size() > 20 ? p->getName().substr(0, 20) : p->getName();
        std::cout << std::left << std::setw(8) << p->getId() << std::setw(22) << name
                  << std::setw(14) << p->getCategory() << std::right << std::setw(12) << price.str()
                  << std::setw(6) << p->getQuantity() << "\n";
    }
    std::cout << std::string(70, '-') << "\nTotal products: " << products_.size() << "\n" << bar << "\n";
}
