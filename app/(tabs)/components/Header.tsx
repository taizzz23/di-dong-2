// app/Header.tsx
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { 
  LogOut, 
  Search, 
  ShoppingCart, 
  SlidersHorizontal, 
  User,
  Lock 
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { auth } from 'firebase/firebaseConfig';
import { authService } from './../../services/authService';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  userName?: string;
  onLogout?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onPasswordChange?: () => void;
}

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Component riêng cho modal đổi mật khẩu
function ChangePasswordModal({ visible, onClose, onSuccess }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'old password is required';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'new password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'password must be at least 6 characters long';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const result = await authService.changePassword({
        currentPassword,
        newPassword
      });

      if (result.success) {
        Alert.alert(
          'success',
          result.message || 'password changed successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                onClose();
                onSuccess?.();
                resetForm();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'error',
          result.error || 'cant change pass.'
        );
      }
    } catch (error) {
      Alert.alert(
        'error',
        'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <View style={styles.modalContentContainer}>
            <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalHeader}>
                  <Lock size={24} color={Colors.light.primary} />
                  <Text style={styles.modalTitle}>Đổi Mật Khẩu</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mật khẩu hiện tại</Text>
                    <TextInput
                      style={[styles.input, errors.currentPassword && styles.inputError]}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Enter current password"
                      placeholderTextColor={Colors.light.mutedForeground}
                      secureTextEntry
                      editable={!isLoading}
                    />
                    {errors.currentPassword ? (
                      <Text style={styles.errorText}>{errors.currentPassword}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mật khẩu mới</Text>
                    <TextInput
                      style={[styles.input, errors.newPassword && styles.inputError]}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password (at least 6 characters)"
                      placeholderTextColor={Colors.light.mutedForeground}
                      secureTextEntry
                      editable={!isLoading}
                    />
                    {errors.newPassword ? (
                      <Text style={styles.errorText}>{errors.newPassword}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
                    <TextInput
                      style={[styles.input, errors.confirmPassword && styles.inputError]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Enter new password confirmation"
                      placeholderTextColor={Colors.light.mutedForeground}
                      secureTextEntry
                      editable={!isLoading}
                    />
                    {errors.confirmPassword ? (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    ) : null}
                  </View>

                  <View style={styles.noteContainer}>
                    <Text style={styles.noteText}>
                      ⚠️ Enter new password (at least 6 characters)
                    </Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleClose}
                      disabled={isLoading}
                    >
                      <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.button, styles.submitButton]}
                      onPress={handleChangePassword}
                      disabled={isLoading}
                    >
                      <Text style={styles.submitButtonText}>
                        {isLoading ? 'Processing...' : 'Change Password'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </Pressable>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function Header({ 
  cartCount, 
  onCartClick, 
  userName, 
  onLogout,
  searchQuery,
  onSearchChange,
  onFilterClick,
  onPasswordChange
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
  };

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    onPasswordChange?.();
    Alert.alert(
      'Success',
      'Password has been changed. Please log in again with the new password.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Có thể đăng xuất ngay sau khi đổi mật khẩu để bảo mật
            // onLogout?.();
          }
        }
      ]
    );
  };

  return (
    <>
      <StatusBar hidden />

      <View style={styles.header}>
        <View style={styles.container}>
          <View style={styles.topRow}>
            <Text style={styles.title}>ConsoleMart</Text>

            <View style={styles.iconsContainer}>
              <TouchableOpacity
                onPress={onCartClick}
                style={styles.iconButton}
              >
                <ShoppingCart size={24} color={Colors.light.text} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {userName && onLogout && (
                <View>
                  <TouchableOpacity
                    onPress={() => setShowUserMenu(true)}
                    style={styles.iconButton}
                  >
                    <User size={24} color={Colors.light.text} />
                  </TouchableOpacity>

                  <Modal
                    visible={showUserMenu}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowUserMenu(false)}
                  >
                    <Pressable
                      style={styles.userMenuOverlay}
                      onPress={() => setShowUserMenu(false)}
                    >
                      <View style={styles.userMenu}>
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{userName}</Text>
                          <Text style={styles.userEmail}>
                            {auth.currentUser?.email}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => {
                            setShowUserMenu(false);
                            setShowChangePassword(true);
                          }}
                        >
                          <Lock size={16} color={Colors.light.text} />
                          <Text style={styles.menuText}>change password</Text>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={handleLogout}
                        >
                          <LogOut size={16} color={Colors.light.destructive} />
                          <Text style={[styles.menuText, styles.logoutText]}>logout</Text>
                        </TouchableOpacity>
                      </View>
                    </Pressable>
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
            >
              <SlidersHorizontal size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingTop: 0,
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
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  badgeText: {
    color: Colors.light.primaryForeground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  userMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  userMenu: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    minWidth: 200,
    overflow: 'hidden',
  },
  userInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.secondary,
  },
  userName: {
    color: Colors.light.text,
    fontWeight: '600',
    fontSize: 16,
  },
  userEmail: {
    color: Colors.light.mutedForeground,
    fontSize: 14,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  menuText: {
    color: Colors.light.text,
    fontSize: 15,
  },
  logoutText: {
    color: Colors.light.destructive,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: 12,
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
    borderRadius: 12,
    backgroundColor: Colors.light.inputBackground,
  },
  searchIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    color: Colors.light.text,
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Styles cho modal đổi mật khẩu
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    width: '100%',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.light.text,
    lineHeight: 28,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.inputBackground,
  },
  inputError: {
    borderColor: Colors.light.destructive,
  },
  errorText: {
    color: Colors.light.destructive,
    fontSize: 14,
    marginTop: 4,
  },
  noteContainer: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  noteText: {
    color: Colors.light.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light.secondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
  },
  submitButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
});