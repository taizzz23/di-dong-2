// app/ForgotPassword.tsx
import { Colors } from '@/constants/theme';
import { resetPassword } from '@/firebase/authApi'; // Import hàm resetPassword từ authApi
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

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Gọi Firebase resetPassword function
      await resetPassword(email);
      
      setIsSubmitted(true);
      setResendCount(prev => prev + 1);
      
      // Start resend timer (60 seconds)
      setCanResend(false);
      let timer = 60;
      setResendTimer(timer);
      
      const interval = setInterval(() => {
        timer -= 1;
        setResendTimer(timer);
        
        if (timer <= 0) {
          clearInterval(interval);
          setCanResend(true);
        }
      }, 1000);

      // Hiển thị thông báo thành công
      Alert.alert(
        "✅ Email đã được gửi!",
        `Firebase đã gửi email reset mật khẩu đến ${email}. Vui lòng kiểm tra hộp thư (kể cả spam).`,
        [
          { 
            text: "OK", 
            onPress: () => console.log("OK pressed"),
            style: 'default'
          }
        ]
      );
      
    } catch (error: any) {
      console.error("Firebase reset password error:", error);
      
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
      
      // Xử lý Firebase error codes
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "Email không hợp lệ.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Email không tồn tại trong hệ thống.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Chức năng gửi email reset chưa được kích hoạt trong Firebase Console.";
          break;
        default:
          if (error.message.includes('network')) {
            errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
          }
      }
      
      Alert.alert(
        "❌ Lỗi",
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setResendCount(prev => prev + 1);
      
      // Reset timer
      setCanResend(false);
      let timer = 60;
      setResendTimer(timer);
      
      const interval = setInterval(() => {
        timer -= 1;
        setResendTimer(timer);
        
        if (timer <= 0) {
          clearInterval(interval);
          setCanResend(true);
        }
      }, 1000);

      Alert.alert(
        "🔄 Đã gửi lại",
        "Email reset mật khẩu đã được gửi lại thành công."
      );
      
    } catch (error) {
      Alert.alert(
        "❌ Lỗi",
        "Không thể gửi lại email. Vui lòng thử lại sau."
      );
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
      {/* Nút quay lại */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackToLogin}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <Text style={styles.backButtonText}>← Quay lại đăng nhập</Text>
      </TouchableOpacity>

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
        <Text style={styles.title}>Quên Mật Khẩu</Text>
        <Text style={styles.subtitle}>
          {isSubmitted 
            ? `📧 Email đã được gửi đến ${email}`
            : "Nhập email tài khoản của bạn để nhận link đặt lại mật khẩu"
          }
        </Text>
      </View>

      {/* Form */}
      {!isSubmitted ? (
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email đăng ký</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={(value) => {
                setEmail(value.trim());
                if (errors.email) setErrors({});
              }}
              placeholder="your-email@example.com"
              placeholderTextColor={Colors.light.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.light.primaryForeground} />
            ) : (
              <Text style={styles.submitButtonText}>Gửi Link Reset</Text>
            )}
          </TouchableOpacity>

          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>ℹ️ Thông tin email reset:</Text>
            <Text style={styles.noteText}>
              • Email sẽ được gửi từ <Text style={styles.highlight}>noreply@consolemart.firebaseapp.com</Text>
            </Text>
            <Text style={styles.noteText}>
              • Kiểm tra cả hộp thư <Text style={styles.highlight}>Spam/Junk</Text>
            </Text>
            <Text style={styles.noteText}>
              • Link có hiệu lực trong <Text style={styles.highlight}>24 giờ</Text>
            </Text>
            <Text style={styles.noteText}>
              • Click link sẽ mở trang web để reset mật khẩu
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          
          <Text style={styles.successTitle}>Đã gửi thành công!</Text>
          
          <View style={styles.emailDisplay}>
            <Text style={styles.emailLabel}>Gửi đến:</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>
          
          <View style={styles.resendInfo}>
            <Text style={styles.resendCount}>
              Đã gửi: {resendCount} lần
            </Text>
            
            <TouchableOpacity 
              style={[styles.resendButton, (!canResend || isLoading) && styles.resendButtonDisabled]}
              onPress={handleResendEmail}
              disabled={!canResend || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.light.primary} />
              ) : (
                <Text style={styles.resendButtonText}>
                  {canResend ? 'Gửi lại email' : `Chờ ${resendTimer}s để gửi lại`}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Hướng dẫn tiếp theo:</Text>
            <Text style={styles.instruction}>1. Mở email từ Firebase</Text>
            <Text style={styles.instruction}>2. Click "Reset Password" trong email</Text>
            <Text style={styles.instruction}>3. Link sẽ mở trong trình duyệt</Text>
            <Text style={styles.instruction}>4. Tạo mật khẩu mới trên trang web</Text>
            <Text style={styles.instruction}>5. Quay lại app và đăng nhập với mật khẩu mới</Text>
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                setEmail("");
                setIsSubmitted(false);
                setResendCount(0);
                setCanResend(true);
                setResendTimer(0);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Nhập email khác</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={onBackToLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingBottom: 80,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
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
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.muted,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContainer: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  noteText: {
    color: Colors.light.mutedForeground,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },
  highlight: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successIconText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  emailDisplay: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  emailLabel: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 6,
  },
  emailText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  resendInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  resendCount: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  resendButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 10,
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
});