import { Colors } from '@/constants/theme';
import { ChevronRight, DollarSign, SlidersHorizontal, Star, X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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
  const [showPriceInput, setShowPriceInput] = useState(false);

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

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const newPriceRange = { ...localFilters.priceRange };
    
    if (type === 'min') {
      // Đảm bảo min không vượt quá max
      newPriceRange.min = Math.min(value, localFilters.priceRange.max - 1);
    } else {
      // Đảm bảo max không nhỏ hơn min
      newPriceRange.max = Math.max(value, localFilters.priceRange.min + 1);
    }
    
    setLocalFilters({ ...localFilters, priceRange: newPriceRange });
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
  };

  const getActiveFilterCount = () => {
    let count = 0;
    count += localFilters.productType.length;
    count += localFilters.brand.length;
    count += localFilters.consoleLine.length;
    count += localFilters.condition.length;
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 1000) count++;
    if (localFilters.rating > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Format price với comma separator
  const formatPrice = (price: number) => {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
          <View style={styles.headerLeft}>
            <SlidersHorizontal size={22} color={Colors.light.primary} />
            <View>
              <Text style={styles.headerTitle}>Filters</Text>
              {activeFilterCount > 0 && (
                <Text style={styles.headerSubtitle}>{activeFilterCount} active filters</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close filters"
          >
            <X size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Price Range */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={18} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Price Range</Text>
            </View>
            
            <TouchableOpacity
              onPress={() => setShowPriceInput(!showPriceInput)}
              style={styles.priceRangeButton}
            >
              <View style={styles.priceDisplay}>
                <Text style={styles.priceValue}>${formatPrice(localFilters.priceRange.min)}</Text>
                <View style={styles.priceSeparator} />
                <Text style={styles.priceValue}>${formatPrice(localFilters.priceRange.max)}</Text>
              </View>
              <ChevronRight 
                size={20} 
                color={Colors.light.mutedForeground}
                style={{ transform: [{ rotate: showPriceInput ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>
            
            {showPriceInput && (
              <View style={styles.priceInputContainer}>
                <View style={styles.priceInputGroup}>
                  <Text style={styles.priceInputLabel}>Min Price</Text>
                  <View style={styles.priceInputRow}>
                    <Text style={styles.priceSymbol}>$</Text>
                    <View style={styles.priceInputButtons}>
                      <TouchableOpacity
                        onPress={() => handlePriceRangeChange('min', Math.max(0, localFilters.priceRange.min - 10))}
                        style={styles.priceButton}
                      >
                        <Text style={styles.priceButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.priceInputValue}>{localFilters.priceRange.min}</Text>
                      <TouchableOpacity
                        onPress={() => handlePriceRangeChange('min', Math.min(localFilters.priceRange.max - 1, localFilters.priceRange.min + 10))}
                        style={styles.priceButton}
                      >
                        <Text style={styles.priceButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={styles.priceInputGroup}>
                  <Text style={styles.priceInputLabel}>Max Price</Text>
                  <View style={styles.priceInputRow}>
                    <Text style={styles.priceSymbol}>$</Text>
                    <View style={styles.priceInputButtons}>
                      <TouchableOpacity
                        onPress={() => handlePriceRangeChange('max', Math.max(localFilters.priceRange.min + 1, localFilters.priceRange.max - 10))}
                        style={styles.priceButton}
                      >
                        <Text style={styles.priceButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.priceInputValue}>{localFilters.priceRange.max}</Text>
                      <TouchableOpacity
                        onPress={() => handlePriceRangeChange('max', Math.min(1000, localFilters.priceRange.max + 10))}
                        style={styles.priceButton}
                      >
                        <Text style={styles.priceButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={18} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
            </View>
            
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
                  {rating > 0 && (
                    <Star 
                      size={14} 
                      color={localFilters.rating === rating ? Colors.light.primaryForeground : Colors.light.mutedForeground}
                      fill={localFilters.rating === rating ? Colors.light.primaryForeground : 'transparent'}
                    />
                  )}
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

          {/* Product Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Type</Text>
            <View style={styles.optionsGrid}>
              {PRODUCT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleToggleArrayFilter("productType", type)}
                  style={[
                    styles.filterChip,
                    localFilters.productType.includes(type) && styles.filterChipSelected
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    localFilters.productType.includes(type) && styles.filterChipTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Brand */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brand</Text>
            <View style={styles.optionsGrid}>
              {BRANDS.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  onPress={() => handleToggleArrayFilter("brand", brand)}
                  style={[
                    styles.filterChip,
                    localFilters.brand.includes(brand) && styles.filterChipSelected
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    localFilters.brand.includes(brand) && styles.filterChipTextSelected
                  ]}>
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Console Line */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Console Line</Text>
            <View style={styles.optionsGrid}>
              {CONSOLE_LINES.map((line) => (
                <TouchableOpacity
                  key={line}
                  onPress={() => handleToggleArrayFilter("consoleLine", line)}
                  style={[
                    styles.filterChip,
                    localFilters.consoleLine.includes(line) && styles.filterChipSelected
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    localFilters.consoleLine.includes(line) && styles.filterChipTextSelected
                  ]}>
                    {line}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Condition */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={styles.optionsGrid}>
              {CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  onPress={() => handleToggleArrayFilter("condition", condition)}
                  style={[
                    styles.filterChip,
                    localFilters.condition.includes(condition) && styles.filterChipSelected
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    localFilters.condition.includes(condition) && styles.filterChipTextSelected
                  ]}>
                    {condition}
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
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleApplyFilters}
            style={styles.applyButton}
          >
            <Text style={styles.applyButtonText}>
              Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  priceRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.muted,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    minWidth: 80,
    textAlign: 'center',
  },
  priceSeparator: {
    width: 40,
    height: 2,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
  priceInputContainer: {
    backgroundColor: Colors.light.muted,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  priceInputGroup: {
    marginBottom: 16,
  },
  priceInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 12,
  },
  priceInputButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    flex: 1,
  },
  priceButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.muted,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  priceInputValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    minWidth: 70,
    justifyContent: 'center',
  },
  ratingButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  ratingButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
  },
  ratingButtonTextSelected: {
    color: Colors.light.primaryForeground,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  filterChipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: Colors.light.primaryForeground,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
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
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primaryForeground,
  },
});