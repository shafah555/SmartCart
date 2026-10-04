#pragma once
#include "Product.h"

class Book : public Product {
public:
    Book(std::string id, std::string name, double price, int quantity,
         std::string author, std::string genre);
    void accept(ProductVisitor& visitor) override;
    std::string getCategory() const override;
    const std::string& getAuthor() const { return author_; }
    const std::string& getGenre() const { return genre_; }
private:
    std::string author_;
    std::string genre_;
};
