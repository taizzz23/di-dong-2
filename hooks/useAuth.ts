import { useState } from "react";

interface User {
  name: string;
  email: string;
}

// ✅ THÊM "forgot-password" vào type AuthView
type AuthView = "login" | "register" | "forgot-password";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Simulate login - in a real app, this would call an API
    setUser({ name: email.split("@")[0], email });
    setIsAuthenticated(true);
  };

  const register = (name: string, email: string, password: string) => {
    // Simulate registration - in a real app, this would call an API
    setUser({ name, email });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchToLogin = () => setAuthView("login");
  const switchToRegister = () => setAuthView("register");
  
  // ✅ THÊM FUNCTION NÀY
  const switchToForgotPassword = () => setAuthView("forgot-password");

  return {
    isAuthenticated,
    authView,
    user,
    login,
    register,
    logout,
    switchToLogin,
    switchToRegister,
    switchToForgotPassword, // ✅ XUẤT RA
  };
}