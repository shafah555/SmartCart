#pragma once
#include <memory>
#include <string>
#include <vector>
#include "../products/Product.h"
#include "../visitors/ProductVisitor.h"

// OBJECT STRUCTURE - holds the products and lets a visitor traverse them.
class ShoppingCart {
public:
    void addProduct(std::unique_ptr<Product> product);   // throws on null / duplicate ID
    bool removeProduct(const std::string& id);
    bool hasProduct(const std::string& id) const;
    bool isEmpty() const { return products_.empty(); }
    std::size_t size() const { return products_.size(); }
    void viewProducts() const;

    void acceptVisitor(ProductVisitor& visitor) {
        for (auto& product : products_)
            product->accept(visitor);
    }

private:
    std::vector<std::unique_ptr<Product>> products_;
};
