import { Colors } from '@/constants/theme';
import { Plus, Star } from "lucide-react-native";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  stock: number;
  type: string;
  consoleLine?: string;
  condition: string;
  location: string;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  // ✅ SAFE HANDLING FOR ALL POTENTIAL UNDEFINED VALUES
  const safeRating = product.rating || 0;
  const safeBrand = product.brand || 'Unknown Brand';
  const safeCondition = product.condition || 'New';
  const safeName = product.name || 'Unnamed Product';
  const safeLocation = product.location || 'Unknown Location';
  const safePrice = product.price || 0;
  const safeStock = product.stock || 0;
  const safeImage = product.image || 'https://via.placeholder.com/300';
  
  // ✅ CHECK IF PRICE IS VALID NUMBER
  const formattedPrice = typeof safePrice === 'number' && !isNaN(safePrice) 
    ? safePrice.toFixed(2) 
    : '0.00';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onProductClick(product)}
        style={styles.productContent}
        activeOpacity={0.7}
      >
        {/* Product Image with fallback */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: safeImage }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.topRow}>
            <Text style={styles.brand} numberOfLines={1}>{safeBrand}</Text>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{safeCondition}</Text>
            </View>
          </View>
          
          <Text style={styles.name} numberOfLines={2}>{safeName}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={14} fill={Colors.light.chart1} color={Colors.light.chart1} />
            {/* ✅ SAFE RATING */}
            <Text style={styles.rating}>{safeRating.toFixed(1)}</Text>
            <Text style={styles.location} numberOfLines={1}>• {safeLocation}</Text>
          </View>

          <View style={styles.bottomRow}>
            {/* ✅ SAFE PRICE */}
            <Text style={styles.price}>${formattedPrice}</Text>
            <Text style={styles.stock} numberOfLines={1}>
              {safeStock > 0 ? `${safeStock} in stock` : "Out of stock"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => onAddToCart(product)}
          disabled={safeStock === 0}
          style={[
            styles.addButton,
            safeStock === 0 && styles.disabledButton
          ]}
        >
          <Plus size={18} color={
            safeStock === 0 ? Colors.light.mutedForeground : Colors.light.primaryForeground
          } />
          <Text style={[
            styles.buttonText,
            safeStock === 0 && styles.disabledButtonText
          ]}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    marginBottom: 16,
    width: CARD_WIDTH, // 👈 Fixed width
    flexShrink: 1,
  },
  productContent: {
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: Colors.light.muted,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 12, // 👈 Reduced padding
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12, // 👈 Smaller font
    color: Colors.light.mutedForeground,
    flex: 1,
    marginRight: 8,
  },
  conditionBadge: {
    backgroundColor: Colors.light.muted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conditionText: {
    fontSize: 10, // 👈 Smaller font
    color: Colors.light.mutedForeground,
    fontWeight: '500',
  },
  name: {
    fontSize: 14, // 👈 Smaller font
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: 12, // 👈 Smaller font
    color: Colors.light.text,
    fontWeight: '500',
  },
  location: {
    fontSize: 12, // 👈 Smaller font
    color: Colors.light.mutedForeground,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: 16, // 👈 Adjusted size
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  stock: {
    fontSize: 11, // 👈 Smaller font
    color: Colors.light.mutedForeground,
    textAlign: 'right',
    flexShrink: 1,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingVertical: 8, // 👈 Reduced padding
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: Colors.light.muted,
  },
  buttonText: {
    color: Colors.light.primaryForeground,
    fontSize: 14, // 👈 Smaller font
    fontWeight: '600',
  },
  disabledButtonText: {
    color: Colors.light.mutedForeground,
  },
});

// ✅ Optional: Add a simple placeholder component for loading/error states
export function ProductCardSkeleton() {
  return (
    <View style={[styles.container, { opacity: 0.5 }]}>
      <View style={styles.imageContainer} />
      <View style={styles.infoContainer}>
        <View style={[styles.topRow, { marginBottom: 8 }]}>
          <View style={{ width: 60, height: 16, backgroundColor: Colors.light.muted, borderRadius: 4 }} />
          <View style={{ width: 40, height: 16, backgroundColor: Colors.light.muted, borderRadius: 4 }} />
        </View>
        <View style={{ width: '80%', height: 20, backgroundColor: Colors.light.muted, borderRadius: 4, marginBottom: 8 }} />
        <View style={{ width: '60%', height: 16, backgroundColor: Colors.light.muted, borderRadius: 4, marginBottom: 12 }} />
        <View style={styles.bottomRow}>
          <View style={{ width: 80, height: 24, backgroundColor: Colors.light.muted, borderRadius: 4 }} />
          <View style={{ width: 60, height: 16, backgroundColor: Colors.light.muted, borderRadius: 4 }} />
        </View>
      </View>
    </View>
  );
}
