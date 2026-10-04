#include "Book.h"
#include "../visitors/ProductVisitor.h"

Book::Book(std::string id, std::string name, double price, int quantity,
           std::string author, std::string genre)
    : Product(std::move(id), std::move(name), price, quantity),
      author_(std::move(author)), genre_(std::move(genre)) {
    requireText(author_, "Author");
    requireText(genre_, "Genre");
}
void Book::accept(ProductVisitor& visitor) { visitor.visit(*this); }  // second half of double dispatch
std::string Book::getCategory() const { return "Book"; }
