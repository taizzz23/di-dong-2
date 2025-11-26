import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet 
} from 'react-native';
import { X } from "lucide-react-native";
import { Filters } from "./FilterPanel";
import { Colors } from '@/constants/theme';

interface ActiveFiltersProps {
  filters: Filters;
  onRemoveFilter: (filterType: string, value?: string) => void;
}

export function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  const activeFilters: { type: string; label: string; value?: string }[] = [];

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
      label: `${filters.rating}+ Stars`
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.label}>Active filters:</Text>
        {activeFilters.map((filter, index) => (
          <TouchableOpacity
            key={`${filter.type}-${filter.value || filter.label}-${index}`}
            onPress={() => onRemoveFilter(filter.type, filter.value)}
            style={styles.filterChip}
          >
            <Text style={styles.filterText}>{filter.label}</Text>
            <X size={12} color={Colors.light.primary} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => onRemoveFilter("all")}
          style={styles.clearAllButton}
        >
          <Text style={styles.clearAllText}>Clear all</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 12,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginRight: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  clearAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
});