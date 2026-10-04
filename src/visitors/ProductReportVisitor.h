#pragma once
#include <string>
#include "ProductVisitor.h"
#include "../products/Product.h"

// CONCRETE VISITOR - readable product report.
class ProductReportVisitor : public ProductVisitor {
public:
    void visit(Book& book) override;
    void visit(Electronics& electronics) override;
    void visit(Clothing& clothing) override;
    void visit(Grocery& grocery) override;
    void begin() override;
    void end() override;

private:
    static void field(const std::string& label, const std::string& value);
    void common(const Product& p);
    int count_ = 0;
};
