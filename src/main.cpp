// SmartCart - E-Commerce Product Management & Analysis System
// main.cpp is the CLIENT of the Visitor pattern: it builds visitors and
// hands them to the ShoppingCart (object structure).

#include <cmath>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>

#include "cart/ShoppingCart.h"
#include "products/Book.h"
#include "products/Clothing.h"
#include "products/Electronics.h"
#include "products/Grocery.h"
#include "visitors/DiscountVisitor.h"
#include "visitors/InvoiceVisitor.h"
#include "visitors/ProductReportVisitor.h"
#include "visitors/ShippingVisitor.h"
#include "visitors/TaxVisitor.h"

namespace {

// Thrown when stdin is closed (Ctrl+D / end of piped input) so the program can exit cleanly.
class InputClosed : public std::runtime_error {
public:
    InputClosed() : std::runtime_error("Input stream closed") {}
};

// ---------- Input helpers ----------
std::string trim(const std::string& s) {
    const auto b = s.find_first_not_of(" \t\r\n");
    if (b == std::string::npos) return "";
    const auto e = s.find_last_not_of(" \t\r\n");
    return s.substr(b, e - b + 1);
}

std::string readLine(const std::string& prompt) {
    std::cout << prompt;
    std::string s;
    if (!std::getline(std::cin, s)) throw InputClosed();
    return trim(s);
}

std::string readText(const std::string& prompt, const std::string& label) {
    while (true) {
        std::string s = readLine(prompt);
        if (!s.empty()) return s;
        std::cout << "✗ " << label << " cannot be empty.\n";
    }
}

bool parseInt(const std::string& s, int& out) {
    try {
        std::size_t pos = 0;
        int v = std::stoi(s, &pos);
        if (pos != s.size()) return false;
        out = v;
        return true;
    } catch (const std::exception&) {
        return false;
    }
}

bool parseDouble(const std::string& s, double& out) {
    try {
        std::size_t pos = 0;
        double v = std::stod(s, &pos);
        if (pos != s.size() || !std::isfinite(v)) return false;
        out = v;
        return true;
    } catch (const std::exception&) {
        return false;
    }
}

double readNumber(const std::string& prompt) {
    while (true) {
        double v = 0;
        if (parseDouble(readLine(prompt), v)) return v;
        std::cout << "✗ Invalid numeric input. Please try again.\n";
    }
}

int readInteger(const std::string& prompt) {
    while (true) {
        int v = 0;
        if (parseInt(readLine(prompt), v)) return v;
        std::cout << "✗ Invalid numeric input. Please enter a whole number.\n";
    }
}

double readPrice() {
    while (true) {
        double v = readNumber("Enter Price: ");
        if (v >= 0) return v;
        std::cout << "✗ Price cannot be negative.\n";
    }
}

int readQuantity() {
    while (true) {
        int v = readInteger("Enter Quantity: ");
        if (v > 0) return v;
        std::cout << "✗ Quantity must be greater than zero.\n";
    }
}

int readWarranty() {
    while (true) {
        int v = readInteger("Enter Warranty (months): ");
        if (v >= 0) return v;
        std::cout << "✗ Warranty cannot be negative.\n";
    }
}

double readWeight() {
    while (true) {
        double v = readNumber("Enter Weight per unit (kg): ");
        if (v > 0) return v;
        std::cout << "✗ Weight must be greater than zero.\n";
    }
}

bool readYesNo(const std::string& prompt) {
    while (true) {
        std::string s = readLine(prompt);
        if (s == "y" || s == "Y" || s == "yes" || s == "Yes") return true;
        if (s == "n" || s == "N" || s == "no" || s == "No") return false;
        std::cout << "✗ Please answer y or n.\n";
    }
}

// ---------- Product entry ----------
struct BasicInfo {
    std::string id, name;
    double price;
    int quantity;
};

BasicInfo readBasicInfo(const ShoppingCart& cart) {
    BasicInfo info;
    while (true) {
        info.id = readText("Enter Product ID: ", "Product ID");
        if (!cart.hasProduct(info.id)) break;
        std::cout << "✗ Product ID already exists.\n";
    }
    info.name = readText("Enter Product Name: ", "Product name");
    info.price = readPrice();
    info.quantity = readQuantity();
    return info;
}

void addBook(ShoppingCart& cart) {
    std::cout << "\n--- Add Book ---\n";
    BasicInfo b = readBasicInfo(cart);
    std::string author = readText("Enter Author: ", "Author");
    std::string genre = readText("Enter Genre: ", "Genre");
    cart.addProduct(std::make_unique<Book>(b.id, b.name, b.price, b.quantity, author, genre));
    std::cout << "✓ Product added successfully.\n";
}

void addElectronics(ShoppingCart& cart) {
    std::cout << "\n--- Add Electronics ---\n";
    BasicInfo b = readBasicInfo(cart);
    std::string brand = readText("Enter Brand: ", "Brand");
    int warranty = readWarranty();
    cart.addProduct(std::make_unique<Electronics>(b.id, b.name, b.price, b.quantity, brand, warranty));
    std::cout << "✓ Product added successfully.\n";
}

void addClothing(ShoppingCart& cart) {
    std::cout << "\n--- Add Clothing ---\n";
    BasicInfo b = readBasicInfo(cart);
    std::string size = readText("Enter Size: ", "Size");
    std::string material = readText("Enter Material: ", "Material");
    cart.addProduct(std::make_unique<Clothing>(b.id, b.name, b.price, b.quantity, size, material));
    std::cout << "✓ Product added successfully.\n";
}

void addGrocery(ShoppingCart& cart) {
    std::cout << "\n--- Add Grocery ---\n";
    BasicInfo b = readBasicInfo(cart);
    double weight = readWeight();
    bool perishable = readYesNo("Is it perishable? (y/n): ");
    cart.addProduct(std::make_unique<Grocery>(b.id, b.name, b.price, b.quantity, weight, perishable));
    std::cout << "✓ Product added successfully.\n";
}

void removeProduct(ShoppingCart& cart) {
    if (cart.isEmpty()) {
        std::cout << "✗ Cart is empty. Nothing to remove.\n";
        return;
    }
    cart.viewProducts();
    std::string id = readText("Enter Product ID to remove: ", "Product ID");
    if (cart.removeProduct(id))
        std::cout << "✓ Product removed successfully.\n";
    else
        std::cout << "✗ Product ID not found.\n";
}

void loadDemo(ShoppingCart& cart) {
    int added = 0;
    auto tryAdd = [&](std::unique_ptr<Product> p) {
        if (cart.hasProduct(p->getId())) {
            std::cout << "  (skipped " << p->getId() << " - already in cart)\n";
            return;
        }
        cart.addProduct(std::move(p));
        ++added;
    };
    tryAdd(std::make_unique<Book>("B001", "Clean Code", 1200.0, 1, "Robert C. Martin", "Software Engineering"));
    tryAdd(std::make_unique<Electronics>("E001", "Wireless Mouse", 2500.0, 2, "Logitech", 12));
    tryAdd(std::make_unique<Clothing>("C001", "Cotton T-Shirt", 800.0, 3, "M", "Cotton"));
    tryAdd(std::make_unique<Grocery>("G001", "Premium Rice", 650.0, 2, 5.0, false));
    std::cout << "✓ Demo products loaded (" << added << " added).\n";
}

// ---------- Visitor helpers (client code) ----------
void runVisitor(ShoppingCart& cart, ProductVisitor& visitor) {
    visitor.begin();
    cart.acceptVisitor(visitor);   // the Visitor pattern in action
    visitor.end();
}

bool requireProducts(const ShoppingCart& cart) {
    if (!cart.isEmpty()) return true;
    std::cout << "✗ Cart is empty. Add products or load demo products first.\n";
    return false;
}

void completeAnalysis(ShoppingCart& cart) {
    std::cout << "\n################ COMPLETE ANALYSIS ################\n";
    std::cout << "\n[1/5] DiscountVisitor";
    DiscountVisitor discount;
    runVisitor(cart, discount);

    std::cout << "\n[2/5] TaxVisitor";
    TaxVisitor tax;
    runVisitor(cart, tax);

    std::cout << "\n[3/5] ShippingVisitor";
    ShippingVisitor shipping;
    runVisitor(cart, shipping);

    std::cout << "\n[4/5] InvoiceVisitor";
    InvoiceVisitor invoice;
    runVisitor(cart, invoice);

    std::cout << "\n[5/5] ProductReportVisitor";
    ProductReportVisitor report;
    runVisitor(cart, report);

    std::cout << "\n✓ Complete analysis finished. 5 visitors ran on the same cart.\n";
}

void printMenu() {
    std::cout << "\n================================================\n"
              << "                 SMARTCART\n"
              << "       E-Commerce Product Management\n"
              << "================================================\n\n"
              << " 1. Add Book\n"
              << " 2. Add Electronics\n"
              << " 3. Add Clothing\n"
              << " 4. Add Grocery\n\n"
              << " 5. View All Products\n"
              << " 6. Remove Product\n\n"
              << " 7. Calculate Discounts\n"
              << " 8. Calculate Taxes\n"
              << " 9. Calculate Shipping\n"
              << "10. Generate Invoice\n"
              << "11. Generate Product Report\n\n"
              << "12. Run Complete Analysis\n"
              << "13. Load Demo Products\n\n"
              << " 0. Exit\n\n";
}

}  // namespace

int main() {
    ShoppingCart cart;
    try {
        while (true) {
            printMenu();
            int choice = -1;
            if (!parseInt(readLine("Enter your choice: "), choice)) {
                std::cout << "✗ Invalid input. Please enter a number from the menu.\n";
                continue;
            }
            if (choice == 0) break;

            try {
                switch (choice) {
                    case 1: addBook(cart); break;
                    case 2: addElectronics(cart); break;
                    case 3: addClothing(cart); break;
                    case 4: addGrocery(cart); break;
                    case 5:
                        if (cart.isEmpty()) std::cout << "✗ Cart is empty.\n";
                        else cart.viewProducts();
                        break;
                    case 6: removeProduct(cart); break;
                    case 7:
                        if (requireProducts(cart)) {
                            DiscountVisitor v;
                            runVisitor(cart, v);
                            std::cout << "✓ Discount calculation completed.\n";
                        }
                        break;
                    case 8:
                        if (requireProducts(cart)) {
                            TaxVisitor v;
                            runVisitor(cart, v);
                            std::cout << "✓ Tax calculation completed.\n";
                        }
                        break;
                    case 9:
                        if (requireProducts(cart)) {
                            ShippingVisitor v;
                            runVisitor(cart, v);
                            std::cout << "✓ Shipping calculation completed.\n";
                        }
                        break;
                    case 10:
                        if (requireProducts(cart)) {
                            InvoiceVisitor v;
                            runVisitor(cart, v);
                            std::cout << "✓ Invoice generated successfully.\n";
                        }
                        break;
                    case 11:
                        if (requireProducts(cart)) {
                            ProductReportVisitor v;
                            runVisitor(cart, v);
                            std::cout << "✓ Product report generated successfully.\n";
                        }
                        break;
                    case 12:
                        if (requireProducts(cart)) completeAnalysis(cart);
                        break;
                    case 13: loadDemo(cart); break;
                    default: std::cout << "✗ Invalid choice. Please select 0-13.\n";
                }
            } catch (const InputClosed&) {
                throw;
            } catch (const std::exception& ex) {
                std::cout << "✗ " << ex.what() << "\n";
            }
        }
    } catch (const InputClosed&) {
        std::cout << "\n";
    }
    std::cout << "\nThank you for using SmartCart. Goodbye!\n";
    return 0;
}
