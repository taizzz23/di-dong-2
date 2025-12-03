import { Colors } from '@/constants/theme';
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
}

export function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo ở trên cùng - KHÔNG có vòng tròn đen */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Tiêu đề tiếng Việt */}
      <View style={styles.header}>
        <Text style={styles.title}>Chào mừng bạn</Text>
        <Text style={styles.subtitle}>đăng nhập để mua sắm</Text>
      </View>

      <View style={styles.form}>
        {/* Email Field - Giữ tiếng Việt */}
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
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        {/* Password Field - Giữ tiếng Việt */}
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
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
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

        {/* Quên mật khẩu - Tiếng Việt */}
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Nút Đăng Nhập - Tiếng Việt */}
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleSubmit}
        >
          <Text style={styles.signInButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* Footer - Tiếng Việt */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Không có tài khoản ?{" "}
            <Text 
              style={styles.signUpLink}
              onPress={onNavigateToRegister}
            >
              Bấm đây để đăng ký
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
  // Logo Section - ĐƠN GIẢN, không vòng tròn
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120, // Kích thước logo
    height: 120,
    // KHÔNG có background, KHÔNG có border, KHÔNG có shadow
  },
  // Header với tiêu đề tiếng Việt
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
  // Quên mật khẩu - Căn trái như cũ
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
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
  signInButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Footer tiếng Việt
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