# SmartCart – E-Commerce Product Management & Analysis System

A console application written in C++17 that demonstrates the **Visitor Design Pattern**.

| Role | Class |
|---|---|
| Element | `Product` (`Book`, `Electronics`, `Clothing`, `Grocery`) |
| Visitor | `ProductVisitor` |
| Concrete Visitors | `DiscountVisitor`, `TaxVisitor`, `ShippingVisitor`, `InvoiceVisitor`, `ProductReportVisitor` |
| Object Structure | `ShoppingCart` |
| Client | `main.cpp` |

## Build and run

Requires a C++17 compiler (g++, clang++ or MSVC).

**Linux / macOS**

    g++ -std=c++17 -o smartcart src/main.cpp src/products/*.cpp src/visitors/*.cpp src/cart/*.cpp
    ./smartcart

**Windows (MinGW g++)**

    g++ -std=c++17 -o smartcart.exe src/main.cpp src/products/Book.cpp src/products/Electronics.cpp src/products/Clothing.cpp src/products/Grocery.cpp src/visitors/DiscountVisitor.cpp src/visitors/TaxVisitor.cpp src/visitors/ShippingVisitor.cpp src/visitors/InvoiceVisitor.cpp src/visitors/ProductReportVisitor.cpp src/cart/ShoppingCart.cpp
    smartcart.exe

**Using make**

    make
    ./smartcart

## Quick demo

1. Choose `13` (Load Demo Products)
2. Choose `12` (Run Complete Analysis)

All five visitors run on the same cart.
