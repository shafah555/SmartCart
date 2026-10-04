#include "Clothing.h"
#include "../visitors/ProductVisitor.h"

Clothing::Clothing(std::string id, std::string name, double price, int quantity,
                   std::string size, std::string material)
    : Product(std::move(id), std::move(name), price, quantity),
      size_(std::move(size)), material_(std::move(material)) {
    requireText(size_, "Size");
    requireText(material_, "Material");
}
void Clothing::accept(ProductVisitor& visitor) { visitor.visit(*this); }
std::string Clothing::getCategory() const { return "Clothing"; }
