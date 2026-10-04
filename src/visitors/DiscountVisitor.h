#pragma once
#include "ProductVisitor.h"
#include "../products/Product.h"

struct DiscountResult {
    double unitPrice = 0, subtotal = 0, ratePercent = 0, discountAmount = 0, finalPrice = 0;
    int quantity = 0;
};

// CONCRETE VISITOR - discount calculation (demo rates).
class DiscountVisitor : public ProductVisitor {
public:
    explicit DiscountVisitor(bool verbose = true) : verbose_(verbose) {}
    void visit(Book& book) override;
    void visit(Electronics& electronics) override;
    void visit(Clothing& clothing) override;
    void visit(Grocery& grocery) override;
    void begin() override;
    void end() override;
    const DiscountResult& lastResult() const { return last_; }

private:
    void process(const Product& p, double ratePercent);
    bool verbose_;
    DiscountResult last_;
    double totalSubtotal_ = 0, totalDiscount_ = 0, totalFinal_ = 0;
    static constexpr double kBookRate = 10.0;
    static constexpr double kElectronicsRate = 15.0;
    static constexpr double kClothingRate = 20.0;
    static constexpr double kGroceryRate = 5.0;
};
