import { Colors } from '@/constants/theme';
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function Login({ 
  onLogin, 
  onNavigateToRegister, 
  onNavigateToForgotPassword 
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string;
    firebase?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    console.log("🟢 [Login] Starting handleSubmit...");
    setIsLoading(true);
    setErrors({});

    try {
      console.log("🟢 [Login] Calling onLogin callback...");
      await onLogin(email, password);
      
      console.log("✅ [Login] onLogin completed successfully");
      // KHÔNG cần Alert ở đây vì auth sẽ tự chuyển trang

    } catch (error: any) {
      console.error("🔴 [Login] Error in handleSubmit:", error);
      
      let errorMessage = error.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      
      setErrors(prev => ({ ...prev, firebase: errorMessage }));
      
      // Hiển thị Alert lỗi
      Alert.alert("Lỗi đăng nhập", errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.title}>welcome</Text>
        <Text style={styles.subtitle}>login to shop</Text>
      </View>

      {/* Hiển thị lỗi Firebase nếu có */}
      {errors.firebase && (
        <View style={styles.firebaseErrorContainer}>
          <Text style={styles.firebaseErrorText}>{errors.firebase}</Text>
        </View>
      )}

      <View style={styles.form}>
        {/* Email Field */}
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

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
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

        {/* Dòng chứa "Nhớ tài khoản" và "Quên mật khẩu" */}
        <View style={styles.rememberForgotRow}>
          {/* Nút Nhớ tài khoản */}
          <TouchableOpacity 
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <View style={styles.rememberMeContent}>
              {/* Checkbox */}
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
          </TouchableOpacity>

          {/* Quên mật khẩu */}
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={onNavigateToForgotPassword}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Đăng Nhập */}
        <TouchableOpacity 
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.signInButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dont have an account?{" "}
            <Text 
              style={styles.signUpLink}
              onPress={onNavigateToRegister}
            >
              Click here to register
            </Text>
          </Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
  },
  // Form
  form: {
    width: '100%',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: Colors.light.inputBackground,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeButton: {
    padding: 14,
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
    fontWeight: '500',
  },
  // Dòng chứa "Nhớ tài khoản" và "Quên mật khẩu"
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  // Nút Nhớ tài khoản
  rememberMeContainer: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  rememberMeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Checkbox
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  checkIcon: {
    color: Colors.light.primaryForeground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberMeText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '500',
  },
  // Quên mật khẩu
  forgotPasswordContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  // Nút Đăng Nhập
  signInButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButtonDisabled: {
    backgroundColor: Colors.light.muted,
    opacity: 0.7,
  },
  signInButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: Colors.light.mutedForeground,
    fontSize: 14,
    textAlign: 'center',
  },
  signUpLink: {
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
});