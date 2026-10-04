CXX      ?= g++
CXXFLAGS ?= -std=c++17 -Wall -Wextra -O2
SRC      := src/main.cpp $(wildcard src/products/*.cpp) $(wildcard src/visitors/*.cpp) $(wildcard src/cart/*.cpp)

smartcart: $(SRC)
	$(CXX) $(CXXFLAGS) -o $@ $(SRC)

clean:
	rm -f smartcart
