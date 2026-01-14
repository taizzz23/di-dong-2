// app/(tabs)/index.tsx
import { Colors } from '@/constants/theme';
import { loginUser } from '@/firebase/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Filter } from 'lucide-react-native';
import { Product, getProducts } from "../../firebase/productApi";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useFilters } from "../../hooks/useFilters";
import { useModal } from "../../hooks/useModal";
import { useNavigation } from "../../hooks/useNavigation";

// SỬA LẠI CÁC IMPORT - KHÔNG CÓ THƯ MỤC components/
import { ActiveFilters } from "./components/ActiveFilters";
import { Cart } from "./components/Cart";
import { FilterPanel } from "./components/FilterPanel";
import { ForgotPassword } from "./components/ForgotPassword";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { Register } from "./components/Register";
import { Welcome } from "./components/Welcome";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [isCheckingWelcome, setIsCheckingWelcome] = useState(true);
  const [isStatusBarHidden, setIsStatusBarHidden] = useState(false);
  
  // Thêm ref để theo dõi trạng thái đã clear cart chưa
  const hasClearedCartRef = useRef(false);

  const auth = useAuth();
  const cart = useCart();
  const navigation = useNavigation();
  const filterModal = useModal();

  // Kiểm tra xem user đã xem Welcome chưa
  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        setIsCheckingWelcome(true);
        const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
        console.log('🔍 Check welcome status:', hasSeenWelcome);
        
        if (hasSeenWelcome === 'true') {
          setShowWelcome(false);
        } else {
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('❌ Error checking welcome status:', error);
        setShowWelcome(false);
      } finally {
        setIsCheckingWelcome(false);
      }
    };

    checkFirstTime();
  }, []);

  // 🎯 CHỈ ẨN STATUS BAR KHI ĐANG Ở MÀN HÌNH HOME CHÍNH
  useEffect(() => {
    // Chỉ ẩn khi:
    // 1. Đã đăng nhập
    // 2. Không còn loading
    // 3. Đã xem welcome
    // 4. Đang ở view "home" (không phải product detail hay cart)
    if (auth.isAuthenticated && 
        !loadingProducts && 
        showWelcome === false &&
        navigation.view === "home") {
      console.log("📱 Hiding Status Bar on Home screen");
      setIsStatusBarHidden(true);
    } else {
      // Trong các trường hợp khác, hiện Status Bar
      console.log("📱 Showing Status Bar");
      setIsStatusBarHidden(false);
    }
  }, [auth.isAuthenticated, loadingProducts, showWelcome, navigation.view]);

  // Load products từ Firebase
  useEffect(() => {
    if (showWelcome === false && auth.isAuthenticated) {
      const loadProducts = async () => {
        try {
          console.log("📦 Loading products from Firebase...");
          const data = await getProducts();
          console.log(`✅ Loaded ${data.length} products`);
          setProducts(data);
        } catch (error) {
          console.error("❌ Error loading products:", error);
          setProducts([]);
          Alert.alert("Lỗi", "Không thể tải sản phẩm. Vui lòng thử lại.");
        } finally {
          setLoadingProducts(false);
        }
      };

      loadProducts();
    }
  }, [showWelcome, auth.isAuthenticated]);

  // Xử lý khi user bấm "Bắt đầu" từ Welcome screen
  const handleGetStarted = async () => {
    try {
      console.log('🎯 User clicked Get Started from Welcome');
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      setShowWelcome(false);
      console.log('✅ Welcome screen hidden, showing login...');
    } catch (error) {
      console.error('❌ Error saving welcome status:', error);
      setShowWelcome(false);
    }
  };

  // Xử lý login với Firebase
  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      console.log("🟢 [Index] Starting Firebase login for:", email);
      
      const firebaseUser = await loginUser(email, password);
      console.log("✅ [Index] Firebase login successful:", firebaseUser.uid);
      
      console.log("🔄 [Index] Calling auth.login with email and password");
      await auth.login(email, password);
      
      console.log("🎉 [Index] Login process completed!");
      
    } catch (error: any) {
      console.error("🔴 [Index] Login error:", error);
      throw error;
    }
  };

  // Xử lý register với Firebase
  const handleRegister = async (name: string, email: string, password: string): Promise<void> => {
    try {
      console.log("🟢 [Index] Starting Firebase registration for:", email);
      
      console.log("🔄 [Index] Calling auth.register with name, email, password");
      await auth.register(name, email, password);
      
      console.log("🎉 [Index] Registration process completed!");
      
    } catch (error: any) {
      console.error("🔴 [Index] Registration error:", error);
      throw error;
    }
  };

  const filterState = useFilters(products);

  // SỬA LỖI: Clear cart khi logout - chỉ chạy một lần
  useEffect(() => {
    // Reset ref khi đăng nhập lại
    if (auth.isAuthenticated) {
      hasClearedCartRef.current = false;
      return;
    }

    // Chỉ clear cart một lần khi logout
    if (!hasClearedCartRef.current) {
      console.log("🛒 Clearing cart due to logout");
      cart.clearCart();
      hasClearedCartRef.current = true;
    }
  }, [auth.isAuthenticated, cart.clearCart]); // Sử dụng cart.clearCart thay vì cart

  // Hiển thị loading khi đang kiểm tra welcome
  if (isCheckingWelcome) {
    return (
      <View style={styles.center}>
        <StatusBar hidden={false} />
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  // Hiển thị Welcome screen nếu chưa xem
  if (showWelcome === true) {
    console.log('👋 Rendering Welcome screen');
    return (
      <>
        <StatusBar hidden={false} />
        <Welcome onGetStarted={handleGetStarted} />
      </>
    );
  }

  // Hiển thị loading khi kiểm tra auth
  if (auth.isLoading) {
    return (
      <View style={styles.center}>
        <StatusBar hidden={false} />
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Đang kiểm tra đăng nhập...</Text>
      </View>
    );
  }

  // Hiển thị màn hình auth nếu chưa đăng nhập
  if (!auth.isAuthenticated) {
    console.log("🔐 Rendering auth view:", auth.authView);
    
    if (auth.authView === "login") {
      return (
        <>
          <StatusBar hidden={false} />
          <Login
            onLogin={handleLogin}
            onNavigateToRegister={auth.switchToRegister}
            onNavigateToForgotPassword={auth.switchToForgotPassword}
          />
        </>
      );
    }

    if (auth.authView === "register") {
      return (
        <>
          <StatusBar hidden={false} />
          <Register
            onRegister={handleRegister}
            onNavigateToLogin={auth.switchToLogin}
          />
        </>
      );
    }

    if (auth.authView === "forgot-password") {
      return (
        <>
          <StatusBar hidden={false} />
          <ForgotPassword
            onBackToLogin={auth.switchToLogin}
          />
        </>
      );
    }
  }

  // Hiển thị loading products
  if (loadingProducts) {
    return (
      <View style={styles.center}>
        <StatusBar hidden={isStatusBarHidden} />
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  // Hiển thị app chính sau khi đã đăng nhập
  console.log("🏠 Rendering main app for user:", auth.user?.email);

  return (
    <>
      <StatusBar hidden={isStatusBarHidden} />
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

            <ScrollView 
              style={styles.main}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Results Header với Filter Button */}
              <View style={styles.resultsHeader}>
                <Text style={styles.title}>
                  {filterState.filteredProducts.length} sản phẩm được tìm thấy
                </Text>
                
                <TouchableOpacity
                  onPress={filterModal.open}
                  style={styles.filterButton}
                >
                  <Filter size={18} color={Colors.light.primary} />
                  <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
              </View>

              {filterState.filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
                  <Text style={styles.emptySubtext}>
                    Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
                  </Text>
                </View>
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
            onClearCart={cart.clearCart}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.light.background 
  },
  main: { 
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  title: { 
    fontSize: 16, 
    fontWeight: "600",
    color: Colors.light.text 
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.muted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  productsGrid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: Colors.light.background
  },
  loadingText: { 
    marginTop: 10,
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});