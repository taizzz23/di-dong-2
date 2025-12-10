import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  StyleSheet,
  Switch
} from 'react-native';
import { X, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { Colors } from '@/constants/theme';

export interface Filters {
  productType: string[];
  brand: string[];
  consoleLine: string[];
  condition: string[];
  priceRange: { min: number; max: number };
  rating: number;
  searchQuery: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose: () => void;
}

const PRODUCT_TYPES = ["Console", "Game", "Accessory", "Replacement Parts"];
const BRANDS = ["Sony", "Microsoft", "Nintendo", "Other"];
const CONSOLE_LINES = ["PS5", "PS4", "Xbox Series X/S", "Xbox One", "Nintendo Switch"];
const CONDITIONS = ["New", "Like New", "Good", "Pre-owned"];

export function FilterPanel({ filters, onFiltersChange, onClose }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleToggleArrayFilter = (
    key: keyof Pick<Filters, "productType" | "brand" | "consoleLine" | "condition">,
    value: string
  ) => {
    const currentValues = localFilters[key];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    setLocalFilters({ ...localFilters, [key]: newValues });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: Filters = {
      productType: [],
      brand: [],
      consoleLine: [],
      condition: [],
      priceRange: { min: 0, max: 1000 },
      rating: 0,
      searchQuery: localFilters.searchQuery
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <SlidersHorizontal size={20} color={Colors.light.text} />
            <Text style={styles.headerTitle}>Filters</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close filters"
          >
            <X size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {/* Product Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Type</Text>
            <View style={styles.optionsContainer}>
              {PRODUCT_TYPES.map((type) => (
                <View key={type} style={styles.optionRow}>
                  <Switch
                    value={localFilters.productType.includes(type)}
                    onValueChange={() => handleToggleArrayFilter("productType", type)}
                    trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                    thumbColor={Colors.light.background}
                  />
                  <Text style={styles.optionText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Brand */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brand</Text>
            <View style={styles.optionsContainer}>
              {BRANDS.map((brand) => (
                <View key={brand} style={styles.optionRow}>
                  <Switch
                    value={localFilters.brand.includes(brand)}
                    onValueChange={() => handleToggleArrayFilter("brand", brand)}
                    trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                    thumbColor={Colors.light.background}
                  />
                  <Text style={styles.optionText}>{brand}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Console Line */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Console Line</Text>
            <View style={styles.optionsContainer}>
              {CONSOLE_LINES.map((line) => (
                <View key={line} style={styles.optionRow}>
                  <Switch
                    value={localFilters.consoleLine.includes(line)}
                    onValueChange={() => handleToggleArrayFilter("consoleLine", line)}
                    trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                    thumbColor={Colors.light.background}
                  />
                  <Text style={styles.optionText}>{line}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Condition */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={styles.optionsContainer}>
              {CONDITIONS.map((condition) => (
                <View key={condition} style={styles.optionRow}>
                  <Switch
                    value={localFilters.condition.includes(condition)}
                    onValueChange={() => handleToggleArrayFilter("condition", condition)}
                    trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                    thumbColor={Colors.light.background}
                  />
                  <Text style={styles.optionText}>{condition}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Price Range: ${localFilters.priceRange.min} - ${localFilters.priceRange.max}
            </Text>
            <View style={styles.priceInputs}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Min: ${localFilters.priceRange.min}</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValue}>0</Text>
                  {/* React Native không có Slider built-in, sử dụng từ @react-native-community/slider nếu cần */}
                  <Text style={styles.sliderValue}>1000</Text>
                </View>
              </View>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Max: ${localFilters.priceRange.max}</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValue}>0</Text>
                  <Text style={styles.sliderValue}>1000</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.ratingContainer}>
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => setLocalFilters({ ...localFilters, rating })}
                  style={[
                    styles.ratingButton,
                    localFilters.rating === rating && styles.ratingButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.ratingButtonText,
                    localFilters.rating === rating && styles.ratingButtonTextSelected
                  ]}>
                    {rating === 0 ? "All" : `${rating}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleResetFilters}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApplyFilters}
            style={styles.applyButton}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  priceInputs: {
    gap: 16,
  },
  priceInput: {
    gap: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  ratingButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  ratingButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  ratingButtonTextSelected: {
    color: Colors.light.primaryForeground,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primaryForeground,
  },
});