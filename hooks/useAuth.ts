import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}

// ✅ THÊM "forgot-password" vào type AuthView
type AuthView = "login" | "register" | "forgot-password";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false); // ✅ THÊM TRẠNG THÁI NÀY
  const [authView, setAuthView] = useState<AuthView>("login");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ THÊM LOADING STATE

  // Load trạng thái từ AsyncStorage khi app khởi động
  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const seenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
      const savedAuth = await AsyncStorage.getItem('isAuthenticated');
      const savedUser = await AsyncStorage.getItem('user');

      if (seenWelcome === 'true') {
        setHasSeenWelcome(true);
      }

      if (savedAuth === 'true' && savedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading app state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeWelcome = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      setHasSeenWelcome(true);
    } catch (error) {
      console.error('Error saving welcome state:', error);
    }
  };

  const login = async (email: string, password: string) => {
    // Simulate login
    const userData = { name: email.split("@")[0], email };
    setUser(userData);
    setIsAuthenticated(true);
    
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate registration
    const userData = { name, email };
    setUser(userData);
    setIsAuthenticated(true);
    
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving register state:', error);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    
    try {
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing login state:', error);
    }
  };

  const switchToLogin = () => setAuthView("login");
  const switchToRegister = () => setAuthView("register");
  
  // ✅ THÊM FUNCTION NÀY
  const switchToForgotPassword = () => setAuthView("forgot-password");

  return {
    isAuthenticated,
    hasSeenWelcome, // ✅ XUẤT RA
    authView,
    user,
    isLoading, // ✅ XUẤT RA
    login,
    register,
    logout,
    switchToLogin,
    switchToRegister,
    switchToForgotPassword, // ✅ XUẤT RA
    completeWelcome, // ✅ XUẤT RA
  };
}