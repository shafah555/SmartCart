#pragma once
#include "Product.h"

class Clothing : public Product {
public:
    Clothing(std::string id, std::string name, double price, int quantity,
             std::string size, std::string material);
    void accept(ProductVisitor& visitor) override;
    std::string getCategory() const override;
    const std::string& getSize() const { return size_; }
    const std::string& getMaterial() const { return material_; }
private:
    std::string size_;
    std::string material_;
};
