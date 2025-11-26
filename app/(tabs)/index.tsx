import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Header } from "./components/Header";
import { ProductCard, Product } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { FilterPanel } from "./components/FilterPanel";
import { ActiveFilters } from "./components/ActiveFilters";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useFilters } from "../../hooks/useFilters";
import { useNavigation } from "../../hooks/useNavigation";
import { useModal } from "../../hooks/useModal";
import { useEffect } from "react";
import { Colors } from '@/constants/theme';

export default function App() {
  // ✅ PRODUCTS được di chuyển vào trong component
  const PRODUCTS: Product[] = [
    {
      id: "1",
      name: "PlayStation 5",
      price: 499.99,
      brand: "Sony",
      type: "Console",
      consoleLine: "PS5",
      condition: "New",
      location: "New York, NY",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1622979138084-c03ae28968ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5c3RhdGlvbiUyMDUlMjBjb25zb2xlfGVufDF8fHx8MTc2NDA4MzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 12
    },
    {
      id: "2",
      name: "Xbox Series X",
      price: 499.99,
      brand: "Microsoft",
      type: "Console",
      consoleLine: "Xbox Series X/S",
      condition: "New",
      location: "Los Angeles, CA",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1604586362294-e6a98fb96401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4Ym94JTIwc2VyaWVzJTIwY29uc29sZXxlbnwxfHx8fDE3NjQwNzM2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 8
    },
    {
      id: "3",
      name: "Nintendo Switch OLED",
      price: 349.99,
      brand: "Nintendo",
      type: "Console",
      consoleLine: "Nintendo Switch",
      condition: "New",
      location: "Chicago, IL",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1676261233849-0755de764396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaW50ZW5kbyUyMHN3aXRjaCUyMGNvbnNvbGV8ZW58MXx8fHwxNzY0MDczNjY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 15
    },
    {
      id: "4",
      name: "PlayStation 5 Digital",
      price: 399.99,
      brand: "Sony",
      type: "Console",
      consoleLine: "PS5",
      condition: "New",
      location: "Miami, FL",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1622979138084-c03ae28968ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5c3RhdGlvbiUyMDUlMjBjb25zb2xlfGVufDF8fHx8MTc2NDA4MzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 10
    },
    {
      id: "5",
      name: "Xbox Series S",
      price: 299.99,
      brand: "Microsoft",
      type: "Console",
      consoleLine: "Xbox Series X/S",
      condition: "New",
      location: "Seattle, WA",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1604586362294-e6a98fb96401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4Ym94JTIwc2VyaWVzJTIwY29uc29sZXxlbnwxfHx8fDE3NjQwNzM2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 20
    },
    {
      id: "6",
      name: "DualSense Controller",
      price: 69.99,
      brand: "Sony",
      type: "Accessory",
      consoleLine: "PS5",
      condition: "New",
      location: "Boston, MA",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1611138290962-2c550ffd4002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyfGVufDF8fHx8MTc2NDEzOTQ5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 25
    },
    {
      id: "7",
      name: "The Last of Us Part II",
      price: 39.99,
      brand: "Sony",
      type: "Game",
      consoleLine: "PS4",
      condition: "Like New",
      location: "Austin, TX",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1543622748-5ee7237e8565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBkaXNjfGVufDF8fHx8MTc2NDA3MzY2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 30
    },
    {
      id: "8",
      name: "Halo Infinite",
      price: 49.99,
      brand: "Microsoft",
      type: "Game",
      consoleLine: "Xbox Series X/S",
      condition: "New",
      location: "Dallas, TX",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1543622748-5ee7237e8565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBkaXNjfGVufDF8fHx8MTc2NDA3MzY2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 18
    },
    {
      id: "9",
      name: "Gaming Headset Pro",
      price: 89.99,
      brand: "Other",
      type: "Accessory",
      consoleLine: "PS5",
      condition: "New",
      location: "San Francisco, CA",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1640823127518-65e1ad563576?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkc2V0JTIwZ2FtaW5nfGVufDF8fHx8MTc2NDE0NDc3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 15
    },
    {
      id: "10",
      name: "RGB Gaming Keyboard",
      price: 129.99,
      brand: "Other",
      type: "Accessory",
      consoleLine: "Xbox Series X/S",
      condition: "New",
      location: "Denver, CO",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjQwNjkyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 12
    },
    {
      id: "11",
      name: "HDMI Cable 2.1",
      price: 19.99,
      brand: "Other",
      type: "Replacement Parts",
      consoleLine: "PS5",
      condition: "New",
      location: "Portland, OR",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1613230891342-8830910888f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zb2xlJTIwY2FibGVzfGVufDF8fHx8MTc2NDE0NDc3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 40
    },
    {
      id: "12",
      name: "PS4 Console",
      price: 249.99,
      brand: "Sony",
      type: "Console",
      consoleLine: "PS4",
      condition: "Pre-owned",
      location: "Atlanta, GA",
      rating: 4.1,
      image: "https://images.unsplash.com/photo-1622979138084-c03ae28968ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5c3RhdGlvbiUyMDUlMjBjb25zb2xlfGVufDF8fHx8MTc2NDA4MzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 7
    },
    {
      id: "13",
      name: "Xbox One X",
      price: 299.99,
      brand: "Microsoft",
      type: "Console",
      consoleLine: "Xbox One",
      condition: "Good",
      location: "Phoenix, AZ",
      rating: 3.9,
      image: "https://images.unsplash.com/photo-1604586362294-e6a98fb96401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHh4Ym94JTIwc2VyaWVzJTIwY29uc29sZXxlbnwxfHx8fDE3NjQwNzM2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 5
    },
    {
      id: "14",
      name: "Controller Charging Dock",
      price: 29.99,
      brand: "Sony",
      type: "Accessory",
      consoleLine: "PS5",
      condition: "New",
      location: "Philadelphia, PA",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1611138290962-2c550ffd4002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyfGVufDF8fHx8MTc2NDEzOTQ5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 22
    },
    {
      id: "15",
      name: "Replacement Power Cable",
      price: 14.99,
      brand: "Microsoft",
      type: "Replacement Parts",
      consoleLine: "Xbox Series X/S",
      condition: "New",
      location: "Houston, TX",
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1613230891342-8830910888f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zb2xlJTIwY2FibGVzfGVufDF8fHx8MTc2NDE0NDc3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stock: 35
    }
  ];

  // Custom hooks - ✅ Bây giờ PRODUCTS đã được định nghĩa
  const auth = useAuth();
  const cart = useCart();
  const filterState = useFilters(PRODUCTS);
  const navigation = useNavigation();
  const filterModal = useModal();

  // Clear cart on logout
  useEffect(() => {
    if (!auth.isAuthenticated) {
      cart.clearCart();
    }
  }, [auth.isAuthenticated]);

  // Authentication screens
  if (!auth.isAuthenticated) {
    if (auth.authView === "login") {
      return (
        <Login
          onLogin={auth.login}
          onNavigateToRegister={auth.switchToRegister}
        />
      );
    } else {
      return (
        <Register
          onRegister={auth.register}
          onNavigateToLogin={auth.switchToLogin}
        />
      );
    }
  }

  // Main app
  return (
    <View style={styles.container}>
      {navigation.view === "home" && (
        <>
          <Header
            cartCount={cart.cartCount}
            onCartClick={navigation.goToCart}
            userName={auth.user?.name}
            onLogout={auth.logout}
            searchQuery={filterState.filters.searchQuery}
            onSearchChange={filterState.updateSearchQuery}
            onFilterClick={filterModal.open}
          />
          <ActiveFilters
            filters={filterState.filters}
            onRemoveFilter={filterState.removeFilter}
          />
          <ScrollView style={styles.main}>
            <View style={styles.headerSection}>
              <Text style={styles.title}>
                {filterState.filteredProducts.length} Products Found
              </Text>
              <Text style={styles.subtitle}>
                Browse gaming consoles, games, accessories & more
              </Text>
            </View>

            {filterState.filteredProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No products found matching your filters
                </Text>
                <TouchableOpacity
                  onPress={() => filterState.removeFilter("all")}
                >
                  <Text style={styles.clearButton}>Clear all filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.productsGrid}>
                {filterState.filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={cart.addToCart}
                    onProductClick={navigation.goToProduct}
                  />
                ))} 
              </View>
            )}
          </ScrollView>
        </>
      )}

      {navigation.view === "product" && navigation.selectedProduct && (
        <ProductDetail
          product={navigation.selectedProduct}
          onBack={navigation.goToHome}
          onAddToCart={cart.addToCart}
        />
      )}

      {navigation.view === "cart" && (
        <Cart
          items={cart.cartItems}
          onBack={navigation.goToHome}
          onUpdateQuantity={cart.updateQuantity}
          onRemoveItem={cart.removeItem}
        />
      )}

      {filterModal.isOpen && (
        <FilterPanel
          filters={filterState.filters}
          onFiltersChange={filterState.setFilters}
          onClose={filterModal.close}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  main: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: Colors.light.mutedForeground,
    marginBottom: 16,
  },
  clearButton: {
    color: Colors.light.primary,
  },
  productsGrid: {
    gap: 16,
  },
});