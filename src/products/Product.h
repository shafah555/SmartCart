#pragma once
#include <cmath>
#include <stdexcept>
#include <string>

class ProductVisitor;  // forward declaration

// ELEMENT (abstract) - every product accepts a visitor.
class Product {
public:
    Product(std::string id, std::string name, double price, int quantity)
        : id_(std::move(id)), name_(std::move(name)), price_(price), quantity_(quantity) {
        requireText(id_, "Product ID");
        requireText(name_, "Product name");
        if (!std::isfinite(price_) || price_ < 0) throw std::invalid_argument("Price cannot be negative.");
        if (quantity_ <= 0) throw std::invalid_argument("Quantity must be greater than zero.");
    }
    virtual ~Product() = default;

    // First half of double dispatch.
    virtual void accept(ProductVisitor& visitor) = 0;
    virtual std::string getCategory() const = 0;

    const std::string& getId() const { return id_; }
    const std::string& getName() const { return name_; }
    double getPrice() const { return price_; }
    int getQuantity() const { return quantity_; }

protected:
    static void requireText(const std::string& value, const std::string& field) {
        if (value.find_first_not_of(" \t\r\n") == std::string::npos)
            throw std::invalid_argument(field + " cannot be empty.");
    }

private:
    std::string id_;
    std::string name_;
    double price_;
    int quantity_;
};
