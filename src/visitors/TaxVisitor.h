#pragma once
#include "ProductVisitor.h"
#include "../products/Product.h"

struct TaxResult {
    double subtotal = 0, ratePercent = 0, taxAmount = 0, finalAmount = 0;
};

// CONCRETE VISITOR - tax calculation. Rates are SIMULATED, for education only.
class TaxVisitor : public ProductVisitor {
public:
    explicit TaxVisitor(bool verbose = true) : verbose_(verbose) {}
    void visit(Book& book) override;
    void visit(Electronics& electronics) override;
    void visit(Clothing& clothing) override;
    void visit(Grocery& grocery) override;
    void begin() override;
    void end() override;
    const TaxResult& lastResult() const { return last_; }

    // Lets the invoice tax an amount other than the raw subtotal (e.g. after discount).
    void setTaxableOverride(double amount) { override_ = amount; hasOverride_ = true; }
    void clearTaxableOverride() { hasOverride_ = false; }

private:
    void process(const Product& p, double ratePercent);
    bool verbose_;
    bool hasOverride_ = false;
    double override_ = 0;
    TaxResult last_;
    double totalBase_ = 0, totalTax_ = 0, totalFinal_ = 0;
    static constexpr double kBookRate = 5.0;
    static constexpr double kElectronicsRate = 15.0;
    static constexpr double kClothingRate = 10.0;
    static constexpr double kGroceryRate = 2.0;
};
