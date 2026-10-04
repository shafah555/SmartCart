#pragma once
#include <cstddef>
#include <iomanip>
#include <sstream>
#include <string>

class Book;
class Electronics;
class Clothing;
class Grocery;

// VISITOR (abstract)
class ProductVisitor {
public:
    virtual ~ProductVisitor() = default;

    virtual void visit(Book& book) = 0;
    virtual void visit(Electronics& electronics) = 0;
    virtual void visit(Clothing& clothing) = 0;
    virtual void visit(Grocery& grocery) = 0;

    // Optional hooks called by the client before/after visiting the whole cart.
    virtual void begin() {}
    virtual void end() {}

protected:
    // Small formatting helpers shared by all concrete visitors.
    static std::string num(double v) {
        std::ostringstream o;
        o << std::fixed << std::setprecision(2) << v;
        return o.str();
    }
    static std::string pad(const std::string& s, std::size_t w, bool right = false) {
        std::string t = s.size() > w ? s.substr(0, w) : s;
        if (t.size() < w) {
            std::string sp(w - t.size(), ' ');
            t = right ? sp + t : t + sp;
        }
        return t;
    }
    static std::string line(char c, std::size_t n = 45) { return std::string(n, c); }
    static std::string center(const std::string& s, std::size_t w = 45) {
        if (s.size() >= w) return s;
        return std::string((w - s.size()) / 2, ' ') + s;
    }
};
