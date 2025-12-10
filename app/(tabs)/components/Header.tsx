import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  Modal 
} from 'react-native';
import { ShoppingCart, Search, User, LogOut, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { Colors } from '@/constants/theme';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  userName?: string;
  onLogout?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
}

export function Header({ 
  cartCount, 
  onCartClick, 
  userName, 
  onLogout,
  searchQuery,
  onSearchChange,
  onFilterClick
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.title}>ConsoleMart</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              onPress={onCartClick}
              style={styles.iconButton}
              accessibilityLabel="Shopping cart"
            >
              <ShoppingCart size={24} color={Colors.light.text} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            {userName && onLogout && (
              <View style={styles.userMenuContainer}>
                <TouchableOpacity
                  onPress={() => setShowUserMenu(!showUserMenu)}
                  style={styles.iconButton}
                  accessibilityLabel="User menu"
                >
                  <User size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Modal
                  visible={showUserMenu}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setShowUserMenu(false)}
                >
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowUserMenu(false)}
                  >
                    <View style={styles.userMenu}>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userName}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        style={styles.menuItem}
                      >
                        <LogOut size={16} color={Colors.light.text} />
                        <Text style={styles.menuText}>Sign Out</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            )}
          </View>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.light.mutedForeground} style={styles.searchIcon} />
            <TextInput
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={onSearchChange}
              style={styles.searchInput}
              placeholderTextColor={Colors.light.mutedForeground}
            />
          </View>
          <TouchableOpacity
            onPress={onFilterClick}
            style={styles.filterButton}
            accessibilityLabel="Open filters"
          >
            <SlidersHorizontal size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.light.primaryForeground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  userMenuContainer: {
    position: 'relative',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  userMenu: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 160,
  },
  userInfo: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  userName: {
    color: Colors.light.text,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  menuText: {
    color: Colors.light.text,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.inputBackground,
  },
  searchIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 12,
    color: Colors.light.text,
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
});