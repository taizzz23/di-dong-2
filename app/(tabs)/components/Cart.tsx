import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react-native";
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

// Import OnlinePayment
import { OnlinePayment } from "./OnlinePayment";

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
  onClearCart?: () => void;
}

export function Cart({ 
  items, 
  onBack, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart 
}: CartProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOnlinePayment, setShowOnlinePayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    paymentId: string;
    method: string;
  } | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const successColor = Colors.light.chart1 || '#10B981';

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Cart Empty", "Your cart is empty.");
      return;
    }

    // Mở thẳng trang OnlinePayment
    setShowOnlinePayment(true);
  };

  // Hàm xử lý khi thanh toán online thành công
  const handleOnlinePaymentSuccess = (paymentId: string, method: string) => {
    console.log(`Payment successful: ${paymentId} via ${method}`);
    
    // Lưu thông tin thanh toán
    setPaymentSuccessData({ paymentId, method });
    
    // Đóng modal thanh toán
    setShowOnlinePayment(false);
    
    // Hiển thị thông báo thành công
    setShowSuccess(true);
    
    // Sau 2 giây, clear cart và quay về
    setTimeout(() => {
      setShowSuccess(false);
      
      // Clear cart
      const ids = items.map(i => i.id);
      if (onClearCart) onClearCart();
      else ids.forEach(id => onRemoveItem(id));
      
      // Quay về màn hình trước
      onBack();
    }, 2000);
  };

  // Hàm xử lý khi hủy thanh toán online
  const handleOnlinePaymentCancel = () => {
    setShowOnlinePayment(false);
    // Không cần alert, người dùng tự biết đã hủy
  };

  if (showSuccess) {
    return (
      <>
        <StatusBar hidden />
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>🎉 Order Placed!</Text>
            <Text style={styles.successText}>Thank you for your purchase</Text>
            
            {paymentSuccessData && (
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentDetailText}>
                  Payment ID: {paymentSuccessData.paymentId}
                </Text>
                <Text style={styles.paymentDetailText}>
                  Method: {paymentSuccessData.method.toUpperCase()}
                </Text>
              </View>
            )}
            
            <Text style={[styles.successAmount, { color: successColor }]}>
              ${total.toFixed(2)}
            </Text>
          
          </View>
        </View>
      </>
    );
  }

  // Hiển thị Online Payment Modal
  if (showOnlinePayment) {
    return (
      <OnlinePayment
        amount={total}
        onSuccess={handleOnlinePaymentSuccess}
        onCancel={handleOnlinePaymentCancel}
        orderId={`ORD-${Date.now()}-${items.length}`}
      />
    );
  }

  return (
    <>
      <StatusBar hidden />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
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
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <ShoppingCart size={48} color={Colors.light.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <TouchableOpacity onPress={onBack} style={styles.continueShoppingButton}>
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Cart Items */}
              {items.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemRow}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.brand}>{item.brand}</Text>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
                      <Trash2 size={20} color={Colors.light.destructive} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.quantityRow}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Order Summary */}
              <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                
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
                
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Payment Info Note */}
              <View style={styles.noteSection}>
                <Text style={styles.noteText}>
                  💳 Youll select payment method on the next screen
                </Text>
              </View>
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.checkoutContainer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabelBottom}>Total:</Text>
                <Text style={styles.totalValueBottom}>${total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>
                  Proceed to Payment
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: { padding: 8 },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    flex: 1,
    marginLeft: 8,
  },
  cartCountBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  cartCountText: { 
    color: '#fff', 
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: { 
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: { 
    fontSize: 18, 
    marginBottom: 12,
    color: Colors.light.mutedForeground,
  },
  continueShoppingButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  continueShoppingText: { 
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 180,
  },
  cartItem: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  itemRow: { 
    flexDirection: 'row', 
    gap: 12,
    alignItems: 'flex-start',
  },
  image: { 
    width: 80, 
    height: 80, 
    borderRadius: 8,
    backgroundColor: Colors.light.muted,
  },
  brand: { 
    color: Colors.light.mutedForeground,
    fontSize: 12,
    marginBottom: 2,
  },
  name: { 
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  price: { 
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: Colors.light.muted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quantityText: { 
    fontWeight: '600',
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotal: { 
    fontWeight: '700',
    fontSize: 18,
    color: Colors.light.text,
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  noteSection: {
    backgroundColor: '#F59E0B10',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F59E0B30',
  },
  noteText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  demoNoteText: {
    fontSize: 12,
    color: '#F59E0B',
    textAlign: 'center',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabelBottom: {
    fontSize: 18,
    color: Colors.light.mutedForeground,
  },
  totalValueBottom: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContainer: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  successTitle: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 12,
    textAlign: 'center',
    color: '#10B981',
  },
  successText: { 
    fontSize: 16,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    marginBottom: 16,
  },
  paymentDetails: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.light.secondary,
    borderRadius: 8,
    width: '100%',
  },
  paymentDetailText: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    marginBottom: 4,
  },
  successAmount: { 
    fontSize: 32, 
    fontWeight: '700', 
    marginTop: 8,
  },
  demoNote: {
    marginTop: 16,
    fontSize: 12,
    color: '#F59E0B',
    fontStyle: 'italic',
  },
});