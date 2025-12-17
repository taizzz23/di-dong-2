/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#030213';
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#030213',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#717182',
    tabIconDefault: '#717182',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    cardForeground: '#030213',
    popover: '#ffffff',
    popoverForeground: '#030213',
    primary: '#030213',
    primaryForeground: '#ffffff',
    secondary: '#f3f3f5',
    secondaryForeground: '#030213',
    muted: '#ececf0',
    mutedForeground: '#717182',
    accent: '#e9ebef',
    accentForeground: '#030213',
    destructive: '#d4183d',
    destructiveForeground: '#ffffff',
    border: 'rgba(0, 0, 0, 0.1)',
    input: 'transparent',
    inputBackground: '#f3f3f5',
    switchBackground: '#cbced4',
    ring: '#b4b4b4',
    chart1: '#d97706',
    chart2: '#059669',
    chart3: '#4f46e5',
    chart4: '#dc2626',
    chart5: '#7c3aed',
    sidebar: '#fafafa',
    sidebarForeground: '#030213',
    sidebarPrimary: '#030213',
    sidebarPrimaryForeground: '#fafafa',
    sidebarAccent: '#f5f5f5',
    sidebarAccentForeground: '#333333',
    sidebarBorder: '#e5e5e5',
    sidebarRing: '#b4b4b4',
  },
  dark: {
    text: '#fafafa',
    background: '#111827',
    tint: tintColorDark,
    icon: '#9ca3af',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorDark,
    card: '#111827',
    cardForeground: '#fafafa',
    popover: '#111827',
    popoverForeground: '#fafafa',
    primary: '#fafafa',
    primaryForeground: '#111827',
    secondary: '#374151',
    secondaryForeground: '#fafafa',
    muted: '#374151',
    mutedForeground: '#9ca3af',
    accent: '#374151',
    accentForeground: '#fafafa',
    destructive: '#991b1b',
    destructiveForeground: '#fca5a5',
    border: '#374151',
    input: '#374151',
    inputBackground: '#1f2937',
    switchBackground: '#4b5563',
    ring: '#6b7280',
    chart1: '#4f46e5',
    chart2: '#059669',
    chart3: '#d97706',
    chart4: '#7c3aed',
    chart5: '#dc2626',
    sidebar: '#1f2937',
    sidebarForeground: '#fafafa',
    sidebarPrimary: '#4f46e5',
    sidebarPrimaryForeground: '#fafafa',
    sidebarAccent: '#374151',
    sidebarAccentForeground: '#fafafa',
    sidebarBorder: '#374151',
    sidebarRing: '#6b7280',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Thêm các spacing và radius constants
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const Radius = {
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
};