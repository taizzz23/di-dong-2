import { Colors } from '@/constants/theme';
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
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
  onClearCart?: () => void;
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

  const successColor = Colors.light.chart1 || '#10B981';

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Cart Empty", "Your cart is empty.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);

        const ids = items.map(i => i.id);
        if (onClearCart) onClearCart();
        else ids.forEach(id => onRemoveItem(id));

        onBack();
      }, 2000);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <>
        <StatusBar hidden />
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <CheckCircle size={80} color={successColor} />
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successText}>Your order has been placed</Text>
            <Text style={[styles.successAmount, { color: successColor }]}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </>
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
            </ScrollView>

            <View style={styles.checkoutContainer}>
              <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>Checkout</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1 },
  cartCountBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  cartCountText: { color: '#fff' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { marginBottom: 16 },
  emptyTitle: { fontSize: 18, marginBottom: 12 },
  continueShoppingButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
  },
  continueShoppingText: { color: '#fff' },

  scrollContent: { padding: 16, paddingBottom: 160 },
  cartItem: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemRow: { flexDirection: 'row', gap: 12 },
  image: { width: 80, height: 80, borderRadius: 8 },
  brand: { color: Colors.light.mutedForeground },
  name: { fontWeight: '600' },
  price: { marginTop: 4 },

  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  quantityText: { fontWeight: '600' },
  itemTotal: { fontWeight: '600' },

  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  totalText: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: { color: '#fff', fontWeight: '700' },

  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  successTitle: { fontSize: 22, fontWeight: '700', marginTop: 16 },
  successText: { marginTop: 8 },
  successAmount: { fontSize: 28, fontWeight: '700', marginTop: 12 },
});
