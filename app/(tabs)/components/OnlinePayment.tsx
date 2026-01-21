// app/(tabs)/components/OnlinePayment.tsx
import { Colors } from '@/constants/theme';
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  DollarSign, 
  Lock, 
  Shield, 
  Smartphone, 
  XCircle,
  QrCode,
  Phone
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface OnlinePaymentProps {
  amount: number;
  onSuccess: (paymentId: string, method: string) => void;
  onCancel: () => void;
  orderId?: string;
}

export function OnlinePayment({ 
  amount, 
  onSuccess, 
  onCancel,
  orderId 
}: OnlinePaymentProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error' | 'momo_qr'>('form');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Partial<PaymentDetails>>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'paypal' | 'momo'>('momo');
  const [momoPhone, setMomoPhone] = useState('');
  const [momoError, setMomoError] = useState('');

  // Mã QR MoMo giả lập (chỉ để demo)
  const MOMO_QR_CODE = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MOMO|0399999999|CONSOLEMART|' + amount;

  const PAYMENT_METHODS = [
    {
      id: 'momo',
      title: 'MoMo Wallet',
      description: 'Use MoMo to payment',
      icon: Smartphone,
      color: '#D82D8B',
      subMethods: ['qr', 'app'] // QR code hoặc mở app
    },
    {
      id: 'card',
      title: 'Credit/Debit Card',
      description: 'Visa, MasterCard, JCB',
      icon: CreditCard,
      color: '#3B82F6',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'International payment',
      icon: DollarSign,
      color: '#003087',
    },
  ];

  // Format card number
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  // Format expiry date
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Partial<PaymentDetails> = {};

    const cleanCardNumber = paymentDetails.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentDetails.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }

    if (!/^[0-9]{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate MoMo phone
  const validateMomoPhone = (phone: string) => {
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Simulate payment processing
  const simulatePayment = (method: string) => {
    setStep('processing');
    
    setTimeout(() => {
      // 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setStep('success');
        setTimeout(() => {
          onSuccess(`${method}_${Date.now()}`, method);
        }, 2000);
      } else {
        setStep('error');
      }
    }, 3000);
  };

  // Handle MoMo QR payment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMomoQRPayment = () => {
    if (!validateMomoPhone(momoPhone)) {
      setMomoError('Please enter a valid Vietnamese phone number (10 digits)');
      return;
    }
    
    setMomoError('');
    setStep('momo_qr');
    
    // Simulate scanning QR code
    setTimeout(() => {
      simulatePayment('momo');
    }, 4000);
  };

  // Handle MoMo App payment
  const handleMomoAppPayment = () => {
    Alert.alert(
      'Open MoMo App',
      'Please confirm payment in MoMo app',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'I have paid', 
          onPress: () => {
            simulatePayment('momo');
          }
        }
      ]
    );
  };

  // Handle card payment
  const handleCardPayment = () => {
    if (validateForm()) {
      simulatePayment('card');
    }
  };

  // Handle PayPal payment
  const handlePayPalPayment = () => {
    Alert.alert(
      'Redirect to PayPal',
      'You will be redirected to PayPal for payment',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            simulatePayment('paypal');
          }
        }
      ]
    );
  };

  const handleSubmit = () => {
    switch (selectedPaymentMethod) {
      case 'momo':
        // Hiển thị lựa chọn MoMo
        Alert.alert(
          'MoMo Payment',
          'Choose payment method',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Scan QR Code', 
              onPress: () => setStep('momo_qr')
            },
            { 
              text: 'Open MoMo App', 
              onPress: handleMomoAppPayment
            },
          ]
        );
        break;
      case 'card':
        handleCardPayment();
        break;
      case 'paypal':
        handlePayPalPayment();
        break;
      default:
        Alert.alert('Error', 'Please select a payment method');
    }
  };

  const handleInputChange = (field: keyof PaymentDetails, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setPaymentDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // ========= RENDER FUNCTIONS =========

  const renderPaymentForm = () => (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Payment</Text>
        <View style={styles.secureBadge}>
          <Lock size={14} color="#10B981" />
          <Text style={styles.secureText}>Secure</Text>
        </View>
      </View>

      {/* Amount Display */}
      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        <Text style={styles.vndAmount}>≈ {Math.round(amount * 23000).toLocaleString()} VND</Text>
        {orderId && (
          <Text style={styles.orderId}>Order ID: {orderId}</Text>
        )}
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsSection}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {PAYMENT_METHODS.map(method => {
          const Icon = method.icon;
          const isSelected = selectedPaymentMethod === method.id;
          
          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                isSelected && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod(method.id as any)}
            >
              <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                <Icon size={24} color={method.color} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{method.title}</Text>
                <Text style={styles.paymentDescription}>{method.description}</Text>
                {method.id === 'momo' && isSelected && (
                  <Text style={styles.momoHint}>
                    💡 Demo: Use any 10-digit phone number
                  </Text>
                )}
              </View>
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: method.color }]}>
                  <CheckCircle size={16} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Card Form (only show if card selected) */}
      {selectedPaymentMethod === 'card' && (
        <View style={styles.cardForm}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          
          {/* Card Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={[styles.input, errors.cardNumber && styles.inputError]}
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber}
              onChangeText={(value) => handleInputChange('cardNumber', value)}
              keyboardType="numeric"
              maxLength={19}
            />
            {errors.cardNumber && (
              <Text style={styles.errorText}>{errors.cardNumber}</Text>
            )}
          </View>

          {/* Card Holder */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <TextInput
              style={[styles.input, errors.cardHolder && styles.inputError]}
              placeholder="John Doe"
              value={paymentDetails.cardHolder}
              onChangeText={(value) => handleInputChange('cardHolder', value)}
              autoCapitalize="words"
            />
            {errors.cardHolder && (
              <Text style={styles.errorText}>{errors.cardHolder}</Text>
            )}
          </View>

          {/* Expiry Date and CVV */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={[styles.input, errors.expiryDate && styles.inputError]}
                placeholder="MM/YY"
                value={paymentDetails.expiryDate}
                onChangeText={(value) => handleInputChange('expiryDate', value)}
                keyboardType="numeric"
                maxLength={5}
              />
              {errors.expiryDate && (
                <Text style={styles.errorText}>{errors.expiryDate}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError]}
                placeholder="123"
                value={paymentDetails.cvv}
                onChangeText={(value) => handleInputChange('cvv', value)}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
              {errors.cvv && (
                <Text style={styles.errorText}>{errors.cvv}</Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* MoMo Phone Input (only show if MoMo selected) */}
      {selectedPaymentMethod === 'momo' && step === 'form' && (
        <View style={styles.momoSection}>
          <Text style={styles.sectionTitle}>MoMo Wallet</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <Phone size={20} color={Colors.light.mutedForeground} style={styles.phoneIcon} />
              <TextInput
                style={[styles.input, momoError && styles.inputError]}
                placeholder="0399999999"
                value={momoPhone}
                onChangeText={(value) => {
                  setMomoPhone(value.replace(/[^0-9]/g, '').substring(0, 10));
                  setMomoError('');
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {momoError ? (
              <Text style={styles.errorText}>{momoError}</Text>
            ) : (
              <Text style={styles.hintText}>
                Enter a 10-digit Vietnamese phone number
              </Text>
            )}
          </View>
          
          <View style={styles.momoInfo}>
            <Smartphone size={16} color="#D82D8B" />
            <Text style={styles.momoInfoText}>
              Please enter a valid phone number
            </Text>
          </View>
        </View>
      )}

      {/* Security Info */}
      <View style={styles.securityInfo}>
        <Shield size={20} color="#10B981" />
        <Text style={styles.securityText}>
          Maximum security. If there are any issues, please contact customer support
        </Text>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={handleSubmit}
        activeOpacity={0.9}
      >
        <Text style={styles.payButtonText}>
          Pay ${amount.toFixed(2)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderMomoQR = () => (
    <View style={styles.centerContainer}>
      <View style={styles.qrHeader}>
        <TouchableOpacity onPress={() => setStep('form')} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MoMo QR Payment</Text>
      </View>
      
      <View style={styles.qrContainer}>
        <QrCode size={60} color="#D82D8B" style={styles.qrIcon} />
        <Text style={styles.qrTitle}>Scan QR Code with MoMo App</Text>
        
        {/* QR Code Image (demo) */}
        <Image 
          source={{ uri: MOMO_QR_CODE }}
          style={styles.qrImage}
          resizeMode="contain"
        />
        
        <Text style={styles.qrAmount}>Amount: {Math.round(amount * 23000).toLocaleString()} VND</Text>
        <Text style={styles.qrOrderId}>Order: {orderId || 'DEMO_ORDER'}</Text>
        
        <View style={styles.qrInstructions}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instruction}>1. Open MoMo app</Text>
          <Text style={styles.instruction}>2. Tap Scan QR Code</Text>
          <Text style={styles.instruction}>3. Point camera at this QR code</Text>
          <Text style={styles.instruction}>4. Confirm payment</Text>
        </View>
        
        <ActivityIndicator size="large" color="#D82D8B" style={styles.qrLoading} />
        <Text style={styles.qrProcessing}>Waiting for payment confirmation...</Text>
        
        <TouchableOpacity
          style={styles.simulateButton}
          onPress={() => simulatePayment('momo')}
        >
          <Text style={styles.simulateButtonText}>Simulate Successful Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProcessing = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
      <Text style={styles.processingTitle}>Processing Payment</Text>
      <Text style={styles.processingText}>
        Please wait while we process your {selectedPaymentMethod} payment...
      </Text>
      <Text style={styles.amountProcessing}>${amount.toFixed(2)}</Text>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.centerContainer}>
      <View style={styles.successIconContainer}>
        <CheckCircle size={80} color="#10B981" />
      </View>
      <Text style={styles.successTitle}>Payment Successful!</Text>
      <Text style={styles.successMessage}>
        Your {selectedPaymentMethod === 'momo' ? 'MoMo' : selectedPaymentMethod} payment of ${amount.toFixed(2)} has been processed.
      </Text>
      {orderId && (
        <Text style={styles.orderReference}>
          Order ID: {orderId}
        </Text>
      )}
      <Text style={styles.successNote}>
        This is a demo transaction. No actual money was transferred.
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <View style={styles.errorIconContainer}>
        <XCircle size={80} color="#EF4444" />
      </View>
      <Text style={styles.errorTitle}>Payment Failed</Text>
      <Text style={styles.errorMessage}>
        We couldnt process your payment. Please try again or use another payment method.
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => setStep('form')}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelAfterError}
        onPress={onCancel}
      >
        <Text style={styles.cancelAfterErrorText}>Cancel Payment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        {step === 'form' && renderPaymentForm()}
        {step === 'momo_qr' && renderMomoQR()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
        {step === 'error' && renderError()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    color: Colors.light.text,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  secureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  amountSection: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  vndAmount: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginTop: 4,
  },
  orderId: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
    marginTop: 8,
  },
  paymentMethodsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.text,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
  },
  paymentDescription: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
  },
  momoHint: {
    fontSize: 11,
    color: '#D82D8B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardForm: {
    padding: 16,
    paddingTop: 0,
  },
  momoSection: {
    padding: 16,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    color: Colors.light.mutedForeground,
    marginTop: 4,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
  },
  momoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#D82D8B10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D82D8B30',
  },
  momoInfoText: {
    fontSize: 12,
    color: '#D82D8B',
    flex: 1,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#F59E0B10',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B30',
  },
  securityText: {
    fontSize: 12,
    color: '#F59E0B',
    flex: 1,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: Colors.light.primary,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 16,
  },
  cancelButtonText: {
    color: Colors.light.mutedForeground,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 24,
  },
  qrIcon: {
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: Colors.light.text,
    textAlign: 'center',
  },
  qrImage: {
    width: 250,
    height: 250,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
  },
  qrAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  qrOrderId: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 32,
  },
  qrInstructions: {
    backgroundColor: Colors.light.secondary,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.text,
  },
  instruction: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 8,
    marginLeft: 8,
  },
  qrLoading: {
    marginVertical: 16,
  },
  qrProcessing: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 24,
    textAlign: 'center',
  },
  simulateButton: {
    backgroundColor: '#D82D8B',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
  },
  simulateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    color: Colors.light.text,
  },
  processingText: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    marginBottom: 24,
  },
  amountProcessing: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#10B981',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  orderReference: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 24,
    textAlign: 'center',
  },
  successNote: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelAfterError: {
    padding: 16,
  },
  cancelAfterErrorText: {
    color: Colors.light.mutedForeground,
    fontSize: 14,
  },
});