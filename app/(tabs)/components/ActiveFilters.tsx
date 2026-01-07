import { Colors } from '@/constants/theme';
import { Filter, X } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Filters {
  productType: string[];
  brand: string[];
  consoleLine: string[];
  condition: string[];
  priceRange: { min: number; max: number };
  rating: number;
  searchQuery?: string;
}

interface ActiveFiltersProps {
  filters: Filters;
  onRemoveFilter: (filterType: string, value?: string) => void;
}

export function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  const activeFilters: { type: string; label: string; value?: string }[] = [];

  // Collect all active filters
  filters.productType.forEach((type) => {
    activeFilters.push({ type: "productType", label: type, value: type });
  });

  filters.brand.forEach((brand) => {
    activeFilters.push({ type: "brand", label: brand, value: brand });
  });

  filters.consoleLine.forEach((line) => {
    activeFilters.push({ type: "consoleLine", label: line, value: line });
  });

  filters.condition.forEach((condition) => {
    activeFilters.push({ type: "condition", label: condition, value: condition });
  });

  if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
    activeFilters.push({
      type: "priceRange",
      label: `$${filters.priceRange.min} - $${filters.priceRange.max}`
    });
  }

  if (filters.rating > 0) {
    activeFilters.push({
      type: "rating",
      label: `${filters.rating}+ ⭐`
    });
  }

  if (filters.searchQuery) {
    activeFilters.push({
      type: "searchQuery",
      label: `"${filters.searchQuery}"`
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Filter size={18} color={Colors.light.primary} />
          <Text style={styles.title}>Active filters</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{activeFilters.length}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.clearAllButton}
          onPress={() => onRemoveFilter("all")}
        >
          <Text style={styles.clearAllText}>Clear all</Text>
          <X size={16} color={Colors.light.destructive} />
        </TouchableOpacity>
      </View>

      {/* Filter Tags */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tagsContainer}
        contentContainerStyle={styles.tagsContent}
      >
        {activeFilters.map((filter, index) => (
          <View key={`${filter.type}-${index}`} style={styles.tag}>
            <Text style={styles.tagLabel}>{filter.label}</Text>
            <TouchableOpacity
              onPress={() => onRemoveFilter(filter.type, filter.value)}
              style={styles.tagClose}
            >
              <X size={14} color={Colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  countBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primaryForeground,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.destructive,
  },
  tagsContainer: {
    maxHeight: 120,
  },
  tagsContent: {
    gap: 8,
    paddingRight: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.muted,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: 8,
  },
  tagLabel: {
    fontSize: 14,
    color: Colors.light.text,
    marginRight: 6,
  },
  tagClose: {
    padding: 2,
  },
});

// Optional: Add a smooth animation for showing/hiding
// You can use Animated from react-native for better UX
