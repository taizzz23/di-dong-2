import { Colors } from '@/constants/theme';
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Product, getProducts } from "../../firebase/productApi"; // 👈 IMPORT HÀM GET PRODUCTS

import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useFilters } from "../../hooks/useFilters";
import { useModal } from "../../hooks/useModal";
import { useNavigation } from "../../hooks/useNavigation";
import { ActiveFilters } from "./components/ActiveFilters";
import { Cart } from "./components/Cart";
import { FilterPanel } from "./components/FilterPanel";
import { ForgotPassword } from "./components/ForgotPassword";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { Register } from "./components/Register";

export default function Index() {
  // 🔥 DATA TỪ FIREBASE
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const cart = useCart();
  const navigation = useNavigation();
  const filterModal = useModal();

  // 🔥 LOAD FIREBASE - FIX LỖI
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // ✅ FIX: Gọi hàm getProducts() thay vì setProducts()
        const data = await getProducts(); // Hàm này phải có trong productApi.ts
        setProducts(data);
      } catch (e) {
        console.log("Firebase error:", e);
        setProducts([]); // ✅ Set mảng rỗng nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 🔥 FILTER DÙNG DATA THẬT
  const filterState = useFilters(products);

  // 🔥 FIX LỖI DEPENDENCY: thêm cart.clearCart vào dependencies
  useEffect(() => {
    if (!auth.isAuthenticated) {
      cart.clearCart();
    }
  }, [auth.isAuthenticated, cart.clearCart]); // ✅ Thêm cart.clearCart

  // AUTH
  if (!auth.isAuthenticated) {
    if (auth.authView === "login") {
      return <Login
        onLogin={auth.login}
        onNavigateToRegister={auth.switchToRegister}
        onNavigateToForgotPassword={auth.switchToForgotPassword}
      />;
    }

    if (auth.authView === "register") {
      return <Register
        onRegister={auth.register}
        onNavigateToLogin={auth.switchToLogin}
      />;
    }

    if (auth.authView === "forgot-password") {
      return <ForgotPassword
        onBackToLogin={auth.switchToLogin}
        onResetPassword={(email) => console.log(email)}
      />;
    }
  }

  // LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  // MAIN
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
            <Text style={styles.title}>
              {filterState.filteredProducts.length} Products Found
            </Text>

            {filterState.filteredProducts.length === 0 ? (
              <Text>No products</Text>
            ) : (
              <View style={styles.productsGrid}>
                {filterState.filteredProducts.map(product => (
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
  container: { flex: 1, backgroundColor: Colors.light.background },
  main: { padding: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
  productsGrid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  }
});