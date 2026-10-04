#pragma once
#include "Product.h"

class Grocery : public Product {
public:
    Grocery(std::string id, std::string name, double price, int quantity,
            double weightKg, bool perishable);
    void accept(ProductVisitor& visitor) override;
    std::string getCategory() const override;
    double getWeight() const { return weightKg_; }  // kg per unit
    bool isPerishable() const { return perishable_; }
private:
    double weightKg_;
    bool perishable_;
};
