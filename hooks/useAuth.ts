// hooks/useAuth.ts - PHIÊN BẢN HOÀN CHỈNH
import { getCurrentUser, logoutUser, loginUser as firebaseLogin, registerUser as firebaseRegister } from '@/firebase/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type User = {
  uid: string;
  email: string;
  name: string;
  photoURL?: string | null;
};

export type AuthView = 'login' | 'register' | 'forgot-password' | 'home';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        
        // 1. Kiểm tra welcome
        const seenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
        console.log('🔍 Check welcome status:', seenWelcome);
        
        if (seenWelcome === 'true') {
          setHasSeenWelcome(true);
        } else {
          setHasSeenWelcome(false);
        }
        
        // 2. Kiểm tra Firebase Auth
        const firebaseUser = getCurrentUser();
        
        if (firebaseUser) {
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL || undefined,
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          setAuthView('home');
          console.log('✅ User already logged in:', userData.email);
        }
      } catch (error) {
        console.error('❌ Error checking auth state:', error);
        setHasSeenWelcome(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const completeWelcome = async () => {
    try {
      console.log('🎯 Marking welcome as seen');
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      setHasSeenWelcome(true);
      setAuthView('login');
    } catch (error) {
      console.error('❌ Error completing welcome:', error);
    }
  };

  // 👈 SỬA HÀM NÀY: nhận email, password thay vì User object
  const login = async (email: string, password: string) => {
    try {
      console.log('🔥 [useAuth] login called for:', email);
      
      // 1. Login với Firebase
      const firebaseUser = await firebaseLogin(email, password);
      
      // 2. Tạo user data
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        name: firebaseUser.displayName || email.split('@')[0],
        photoURL: firebaseUser.photoURL || undefined,
      };
      
      // 3. Update state
      setUser(userData);
      setIsAuthenticated(true);
      setAuthView('home');
      
      // 4. Lưu vào AsyncStorage
      try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (storageError) {
        console.error('❌ Error saving user to storage:', storageError);
      }
      
      console.log('✅ [useAuth] User authenticated successfully');
      
    } catch (error) {
      console.error('❌ [useAuth] Login error:', error);
      throw error; // Throw error để Login component bắt
    }
  };

  // 👈 SỬA HÀM NÀY: nhận name, email, password
  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('🔥 [useAuth] register called for:', email);
      
      // 1. Register với Firebase
      const user = await firebaseRegister(email, password, name);
      
      // 2. Tạo user data
      const userData: User = {
        uid: user.uid,
        email: user.email || email,
        name: name,
        photoURL: null,
      };
      
      // 3. Update state
      setUser(userData);
      setIsAuthenticated(true);
      setAuthView('home');
      
      // 4. Lưu vào AsyncStorage
      try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (storageError) {
        console.error('❌ Error saving user to storage:', storageError);
      }
      
      console.log('✅ [useAuth] User registered and logged in');
      
    } catch (error) {
      console.error('❌ [useAuth] Registration error:', error);
      throw error; // Throw error để Register component bắt
    }
  };

  const logout = async () => {
    console.log('🔥 [useAuth] logout called');
    
    try {
      await logoutUser();
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
      setIsAuthenticated(false);
      setAuthView('login');
      console.log('✅ [useAuth] User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  const switchToLogin = () => {
    console.log('🔄 Switching to login view');
    setAuthView('login');
  };

  const switchToRegister = () => {
    console.log('🔄 Switching to register view');
    setAuthView('register');
  };

  const switchToForgotPassword = () => {
    console.log('🔄 Switching to forgot password view');
    setAuthView('forgot-password');
  };

  return {
    isAuthenticated,
    user,
    authView,
    isLoading,
    hasSeenWelcome,
    login,
    logout,
    register,
    completeWelcome,
    switchToLogin,
    switchToRegister,
    switchToForgotPassword,
  };
}