import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Fonts } from '@/constants/theme';

// Tạo custom themes từ Colors của bạn
const CustomLightTheme = {
  dark: false,
  colors: {
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.destructive,
  },
  fonts: {
    regular: {
      fontFamily: Fonts.sans as string,
      fontWeight: '400' as '400',
    },
    medium: {
      fontFamily: Fonts.sans as string,
      fontWeight: '500' as '500',
    },
    bold: {
      fontFamily: Fonts.sans as string,
      fontWeight: 'bold' as 'bold',
    },
    heavy: {
      fontFamily: Fonts.sans as string,
      fontWeight: '900' as '900',
    },
  },
};

const CustomDarkTheme = {
  dark: true,
  colors: {
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.destructive,
  },
  fonts: {
    regular: {
      fontFamily: Fonts.sans as string,
      fontWeight: '400' as '400',
    },
    medium: {
      fontFamily: Fonts.sans as string,
      fontWeight: '500' as '500',
    },
    bold: {
      fontFamily: Fonts.sans as string,
      fontWeight: 'bold' as 'bold',
    },
    heavy: {
      fontFamily: Fonts.sans as string,
      fontWeight: '900' as '900',
    },
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}