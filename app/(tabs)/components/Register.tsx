import { Colors } from '@/constants/theme';
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onNavigateToLogin: () => void;
}

export function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    firebase?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    } else if (name.length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    console.log("🟢 [Register] Starting handleRegister...");
    setIsLoading(true);
    setErrors({});

    try {
      console.log("🟢 [Register] Calling onRegister callback...");
      await onRegister(name, email, password);
      
      console.log("✅ [Register] onRegister completed successfully");
      // KHÔNG cần Alert ở đây vì auth sẽ tự chuyển trang

    } catch (error: any) {
      console.error("🔴 [Register] Error in handleRegister:", error);
      
      let errorMessage = error.message || "Đăng ký thất bại. Vui lòng thử lại.";
      
      setErrors(prev => ({ ...prev, firebase: errorMessage }));
      
      // Hiển thị Alert lỗi
      Alert.alert("Lỗi đăng ký", errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onNavigateToLogin}
          style={styles.backButton}
          accessibilityLabel="Go back"
          disabled={isLoading}
        >
          <ArrowLeft size={24} color={Colors.light.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Đăng ký để bắt đầu mua sắm</Text>
        </View>

        {errors.firebase && (
          <View style={styles.firebaseErrorContainer}>
            <Text style={styles.firebaseErrorText}>{errors.firebase}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Nguyễn Văn A"
              placeholderTextColor={Colors.light.mutedForeground}
              autoCapitalize="words"
              editable={!isLoading}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.light.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Ít nhất 6 ký tự"
                placeholderTextColor={Colors.light.mutedForeground}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={20} color={Colors.light.mutedForeground} />
                ) : (
                  <Eye size={20} color={Colors.light.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={Colors.light.mutedForeground}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={Colors.light.mutedForeground} />
                ) : (
                  <Eye size={20} color={Colors.light.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.light.primaryForeground} />
            ) : (
              <Text style={styles.registerButtonText}>Tạo tài khoản</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Đã có tài khoản?{" "}
              <Text 
                style={styles.signInLink}
                onPress={onNavigateToLogin}
              >
                Đăng nhập
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.inputBackground,
  },
  inputError: {
    borderColor: Colors.light.destructive,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.inputBackground,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeButton: {
    padding: 12,
  },
  errorText: {
    color: Colors.light.destructive,
    fontSize: 14,
    marginTop: 4,
  },
  firebaseErrorContainer: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderWidth: 1,
    borderColor: Colors.light.destructive,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  firebaseErrorText: {
    color: Colors.light.destructive,
    fontSize: 14,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.light.muted,
    opacity: 0.7,
  },
  registerButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: Colors.light.mutedForeground,
    fontSize: 14,
  },
  signInLink: {
    color: Colors.light.primary,
    fontWeight: '500',
  },
});