import { Colors } from '@/constants/theme';
import { ArrowLeft, Cpu, MapPin, Minus, Package, Plus, ShieldCheck, Star } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Product } from "./ProductCard";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  // ✅ SAFE HANDLING FOR ALL VALUES
  const safeRating = product.rating || 0;
  const safeBrand = product.brand || 'Unknown Brand';
  const safeCondition = product.condition || 'New';
  const safeName = product.name || 'Unnamed Product';
  const safeLocation = product.location || 'Unknown Location';
  const safePrice = product.price || 0;
  const safeStock = product.stock || 0;
  const safeImage = product.image || 'https://via.placeholder.com/400';
  const safeType = product.type || 'Console';
  const safeConsoleLine = product.consoleLine || 'Standard';

  const handleIncrement = () => {
    if (quantity < safeStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Tính toán giá tổng
  const totalPrice = safePrice * quantity;
  
  // Tạo mô tả động dựa trên thông tin sản phẩm
  const generateDescription = () => {
    return `Experience premium gaming with the ${safeBrand} ${safeName} (${safeConsoleLine} Edition). This ${safeCondition.toLowerCase()} ${safeType.toLowerCase()} features high-performance components and delivers stunning graphics for immersive gameplay. Perfect for gamers seeking quality and reliability.`;
  };

  // Tạo features dựa trên thông tin sản phẩm
  const generateFeatures = () => {
    const baseFeatures = [
      `${safeCondition} Condition - Fully tested`,
      `${safeConsoleLine} Edition`,
      `${safeType} - Latest generation`,
      "HDMI 2.1 & 4K/120Hz support",
      "Fast SSD storage",
      "Wireless controller included"
    ];
    
    // Thêm tính năng dựa trên rating
    if (safeRating >= 4.5) {
      baseFeatures.push("Premium quality assurance");
    }
    
    if (safeStock > 10) {
      baseFeatures.push("Ready to ship immediately");
    }
    
    return baseFeatures;
  };

  const features = generateFeatures();

  // Sử dụng màu thay thế nếu không có success/warning
  const successColor = Colors.light.chart1 || '#10B981'; // Green color
  const warningColor = Colors.light.chart3 || '#F59E0B'; // Yellow/Orange color
  const destructiveColor = Colors.light.destructive || '#EF4444'; // Red color

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: safeImage }}
            style={styles.image}
            resizeMode="cover"
            defaultSource={{ uri: 'https://via.placeholder.com/400' }}
          />
          {safeCondition === 'New' && (
            <View style={[styles.newBadge, { backgroundColor: successColor }]}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          {/* Brand và Condition */}
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{safeBrand}</Text>
            <View style={[
              styles.conditionBadge,
              safeCondition === 'New' 
                ? { backgroundColor: successColor + '20', borderColor: successColor }
                : { backgroundColor: warningColor + '20', borderColor: warningColor }
            ]}>
              <Text style={[
                styles.conditionText,
                safeCondition === 'New' 
                  ? { color: successColor }
                  : { color: warningColor }
              ]}>
                {safeCondition}
              </Text>
            </View>
          </View>
          
          <Text style={styles.name}>{safeName}</Text>
          <Text style={styles.consoleLine}>{safeConsoleLine} Edition</Text>
          
          {/* Rating và Location */}
          <View style={styles.infoRow}>
            <View style={styles.ratingContainer}>
              <Star size={18} fill={Colors.light.chart1} color={Colors.light.chart1} />
              <Text style={styles.rating}>
                {safeRating.toFixed(1)} ({Math.floor(safeRating * 20)} reviews)
              </Text>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={Colors.light.mutedForeground} />
              <Text style={styles.location}>{safeLocation}</Text>
            </View>
          </View>
          
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${safePrice.toFixed(2)}</Text>
            <Text style={styles.type}>{safeType}</Text>
          </View>

          {/* Product Specifications */}
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Cpu size={20} color={Colors.light.primary} />
              <View>
                <Text style={styles.specLabel}>Type</Text>
                <Text style={styles.specValue}>{safeType}</Text>
              </View>
            </View>
            
            <View style={styles.specItem}>
              <Package size={20} color={Colors.light.primary} />
              <View>
                <Text style={styles.specLabel}>Condition</Text>
                <Text style={styles.specValue}>{safeCondition}</Text>
              </View>
            </View>
            
            <View style={styles.specItem}>
              <ShieldCheck size={20} color={Colors.light.primary} />
              <View>
                <Text style={styles.specLabel}>Warranty</Text>
                <Text style={styles.specValue}>{safeCondition === 'New' ? '12 months' : '3 months'}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {generateDescription()}
            </Text>
          </View>

          {/* Key Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stock Info */}
          <View style={styles.stockContainer}>
            <View style={styles.stockInfo}>
              <Package size={18} color={safeStock > 0 ? successColor : destructiveColor} />
              <Text style={[
                styles.stockText,
                safeStock > 0 ? { color: successColor } : { color: destructiveColor }
              ]}>
                {safeStock > 0 ? `${safeStock} units in stock` : "Out of stock"}
              </Text>
            </View>
            {safeStock > 0 && safeStock < 10 && (
              <Text style={[styles.lowStockWarning, { color: warningColor }]}>
                Low stock - Order soon!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={handleDecrement}
            disabled={quantity <= 1}
            style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
            accessibilityLabel="Decrease quantity"
          >
            <Minus size={20} color={quantity <= 1 ? Colors.light.mutedForeground : Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={handleIncrement}
            disabled={quantity >= safeStock}
            style={[styles.quantityButton, quantity >= safeStock && styles.disabledButton]}
            accessibilityLabel="Increase quantity"
          >
            <Plus size={20} color={quantity >= safeStock ? Colors.light.mutedForeground : Colors.light.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            onAddToCart(product, quantity);
            onBack();
          }}
          disabled={safeStock === 0}
          style={[styles.addToCartButton, safeStock === 0 && styles.disabledButton]}
        >
          <Text style={styles.addToCartText}>
            Add to Cart - ${totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: Colors.light.muted,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    fontWeight: '500',
  },
  conditionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 4,
    lineHeight: 28,
  },
  consoleLine: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  type: {
    fontSize: 14,
    color: Colors.light.primary,
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: Colors.light.muted,
    borderRadius: 12,
    padding: 16,
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specLabel: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
    marginTop: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.light.mutedForeground,
    lineHeight: 22,
  },
  featuresList: {
    marginTop: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  bullet: {
    color: Colors.light.primary,
    fontSize: 16,
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    color: Colors.light.mutedForeground,
    flex: 1,
    lineHeight: 22,
  },
  stockContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.muted,
    borderRadius: 12,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
  },
  lowStockWarning: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.muted,
    borderRadius: 10,
    padding: 8,
    gap: 12,
    minWidth: 120,
    justifyContent: 'space-between',
  },
  quantityButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.light.background,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    minWidth: 32,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: Colors.light.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
});