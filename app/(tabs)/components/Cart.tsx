import { Colors } from '@/constants/theme';
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart?: () => void; // 👈 Thêm prop mới để xóa toàn bộ giỏ hàng
}

export function Cart({ 
  items, 
  onBack, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart 
}: CartProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Sử dụng màu thay thế nếu không có success
  const successColor = Colors.light.chart1 || '#10B981'; // Green color

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert("Cart Empty", "Your cart is empty. Add some items before checkout.");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Show success message for 1.5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        
        // Tạo danh sách ID của tất cả items
        const itemIds = items.map(item => item.id);
        
        // Hiển thị thông báo thành công
        Alert.alert(
          "🎉 Order Successful!",
          `Your order has been placed successfully.\nTotal: $${total.toFixed(2)}`,
          [
            {
              text: "Continue Shopping",
              onPress: () => {
                // Xóa toàn bộ giỏ hàng
                if (onClearCart) {
                  onClearCart(); // Sử dụng onClearCart nếu có
                } else {
                  // Fallback: xóa từng item
                  itemIds.forEach(id => onRemoveItem(id));
                }
                
                // Chuyển về trang chủ sau delay nhỏ
                setTimeout(() => {
                  onBack();
                }, 300);
              }
            }
          ]
        );
        
        // Tự động xử lý sau 3 giây nếu user không bấm
        setTimeout(() => {
          if (onClearCart) {
            onClearCart();
          } else {
            itemIds.forEach(id => onRemoveItem(id));
          }
          setTimeout(() => {
            onBack();
          }, 300);
        }, 3000);
      }, 1500);
    }, 2000);
  };

  // Show success overlay
  if (showSuccess) {
    return (
      <View style={styles.successOverlay}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={80} color={successColor} />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successText}>
            Your order has been processed successfully
          </Text>
          <Text style={[styles.successAmount, { color: successColor }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            disabled={isProcessing}
          >
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          {items.length > 0 && (
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{items.length}</Text>
            </View>
          )}
        </View>
      </View>

      {items.length === 0 ? (
        // Empty Cart State
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <ShoppingCart size={48} color={Colors.light.mutedForeground} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDescription}>
            Add some consoles to get started!
          </Text>
          <TouchableOpacity
            onPress={onBack}
            style={styles.continueShoppingButton}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Cart with Items
        <View style={styles.content}>
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.cartSummary}>
              {items.length} item{items.length !== 1 ? 's' : ''} in cart
            </Text>
            
            <View style={styles.itemsContainer}>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemRow}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.brand}>{item.brand}</Text>
                      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => onRemoveItem(item.id)}
                      style={styles.removeButton}
                      accessibilityLabel="Remove item"
                      disabled={isProcessing}
                    >
                      <Trash2 size={20} color={Colors.light.destructive} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.quantityRow}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isProcessing}
                        style={[styles.quantityButton, (item.quantity <= 1 || isProcessing) && styles.disabledButton]}
                        accessibilityLabel="Decrease quantity"
                      >
                        <Minus size={16} color={item.quantity <= 1 ? Colors.light.mutedForeground : Colors.light.text} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                        accessibilityLabel="Increase quantity"
                        disabled={isProcessing}
                      >
                        <Plus size={16} color={Colors.light.text} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Checkout Footer */}
          <View style={styles.checkoutContainer}>
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.checkoutButton, isProcessing && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Text style={styles.checkoutButtonText}>Processing...</Text>
              ) : (
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onBack}
              style={styles.continueShoppingLink}
              disabled={isProcessing}
            >
              <Text style={styles.continueShoppingLinkText}>← Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  cartCountBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  cartCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primaryForeground,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: Colors.light.muted,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: Colors.light.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 220,
  },
  cartSummary: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  itemsContainer: {
    padding: 16,
    gap: 12,
  },
  cartItem: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.light.muted,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.muted,
    borderRadius: 10,
    padding: 6,
    gap: 12,
  },
  quantityButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.light.background,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    minWidth: 32,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summary: {
    gap: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkoutButtonDisabled: {
    backgroundColor: Colors.light.mutedForeground,
    opacity: 0.7,
  },
  checkoutButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 16,
    fontWeight: '700',
  },
  continueShoppingLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  continueShoppingLinkText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  // Success Overlay Styles
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    marginBottom: 16,
    textAlign: 'center',
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
});