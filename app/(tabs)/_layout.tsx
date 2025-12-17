import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';

// Import các components - THÊM WELCOME
import { ForgotPassword } from './components/ForgotPassword';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Welcome } from './components/Welcome';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const auth = useAuth();

  // Hiển thị loading screen
  if (auth.isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.light.background 
      }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // 1. Nếu chưa xem Welcome => Hiển thị Welcome screen
  if (!auth.hasSeenWelcome) {
    return <Welcome onGetStarted={auth.completeWelcome} />;
  }

  // 2. Nếu chưa đăng nhập => Hiển thị auth screens
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

  // 3. Nếu đã xem Welcome và đã đăng nhập => Hiển thị tabs
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