#pragma once
#include "ProductVisitor.h"
#include "DiscountVisitor.h"
#include "TaxVisitor.h"
#include "ShippingVisitor.h"

// CONCRETE VISITOR - invoice generation.
// It reuses the other visitors (silently) to obtain discount, tax and shipping.
class InvoiceVisitor : public ProductVisitor {
public:
    InvoiceVisitor() : discount_(false), tax_(false), shipping_(false) {}
    void visit(Book& book) override;
    void visit(Electronics& electronics) override;
    void visit(Clothing& clothing) override;
    void visit(Grocery& grocery) override;
    void begin() override;
    void end() override;

private:
    void issue(Product& p);
    DiscountVisitor discount_;
    TaxVisitor tax_;
    ShippingVisitor shipping_;
    double sumSubtotal_ = 0, sumDiscount_ = 0, sumTax_ = 0, sumShipping_ = 0, sumGrand_ = 0;
    int items_ = 0;
};
