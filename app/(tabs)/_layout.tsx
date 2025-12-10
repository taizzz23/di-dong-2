// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth'; // ✅ IMPORT useAuth

// Import các auth components từ thư mục components
import { ForgotPassword } from './components/ForgotPassword';
import { Login } from './components/Login';
import { Register } from './components/Register';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const auth = useAuth(); // ✅ LẤY TRẠNG THÁI AUTH

  // NẾU CHƯA ĐĂNG NHẬP: Hiển thị màn hình auth
  if (!auth.isAuthenticated) {
    if (auth.authView === "login") {
      return (
        <Login
          onLogin={auth.login}
          onNavigateToRegister={auth.switchToRegister}
          onNavigateToForgotPassword={auth.switchToForgotPassword}
        />
      );
    } else if (auth.authView === "register") {
      return (
        <Register
          onRegister={auth.register}
          onNavigateToLogin={auth.switchToLogin}
        />
      );
    } else if (auth.authView === "forgot-password") {
      return (
        <ForgotPassword
          onBackToLogin={auth.switchToLogin}
          onResetPassword={(email: string) => {
            console.log("Reset password for:", email);
          }}
        />
      );
    }
  }

  // NẾU ĐÃ ĐĂNG NHẬP: Hiển thị tabs bình thường
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}