import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet 
} from 'react-native';
import { Plus, Star } from "lucide-react-native";
import { Colors } from '@/constants/theme';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  stock: number;
  type: string;
  consoleLine: string;
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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onProductClick(product)}
        style={styles.productContent}
        activeOpacity={0.7}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.topRow}>
            <Text style={styles.brand}>{product.brand}</Text>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
          </View>
          
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} fill={Colors.light.chart1} color={Colors.light.chart1} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.location}>• {product.location}</Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.stock}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => onAddToCart(product)}
          disabled={product.stock === 0}
          style={[
            styles.addButton,
            product.stock === 0 && styles.disabledButton
          ]}
        >
          <Plus size={20} color={
            product.stock === 0 ? Colors.light.mutedForeground : Colors.light.primaryForeground
          } />
          <Text style={[
            styles.buttonText,
            product.stock === 0 && styles.disabledButtonText
          ]}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    marginBottom: 16,
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
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  conditionBadge: {
    backgroundColor: Colors.light.muted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  location: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  stock: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: Colors.light.muted,
  },
  buttonText: {
    color: Colors.light.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: Colors.light.mutedForeground,
  },
});