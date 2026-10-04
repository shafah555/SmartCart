#pragma once
#include <string>
#include "ProductVisitor.h"
#include "../products/Product.h"

struct ShippingResult {
    double cost = 0;
    std::string rule;
};

// CONCRETE VISITOR - shipping cost calculation.
//   Book        : 60 + 5 per extra item
//   Electronics : 120 flat per product line (insured handling)
//   Clothing    : 80 + 10 per extra item
//   Grocery     : 100 + 5 per kg of total weight
class ShippingVisitor : public ProductVisitor {
public:
    explicit ShippingVisitor(bool verbose = true) : verbose_(verbose) {}
    void visit(Book& book) override;
    void visit(Electronics& electronics) override;
    void visit(Clothing& clothing) override;
    void visit(Grocery& grocery) override;
    void begin() override;
    void end() override;
    const ShippingResult& lastResult() const { return last_; }

private:
    void record(const Product& p, double cost, const std::string& rule);
    bool verbose_;
    ShippingResult last_;
    double total_ = 0;
};
