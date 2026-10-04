#pragma once
#include "Product.h"

class Electronics : public Product {
public:
    Electronics(std::string id, std::string name, double price, int quantity,
                std::string brand, int warrantyMonths);
    void accept(ProductVisitor& visitor) override;
    std::string getCategory() const override;
    const std::string& getBrand() const { return brand_; }
    int getWarranty() const { return warrantyMonths_; }
private:
    std::string brand_;
    int warrantyMonths_;
};
