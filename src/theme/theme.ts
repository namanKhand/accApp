import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

const fontConfig = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400'
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500'
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700'
  }
};

export const palette = {
  primary: '#C46B3B',
  secondary: '#6B7A8F',
  background: '#FAF5EF',
  surface: '#FFFFFF',
  success: '#3FA34D',
  warning: '#E8B23A',
  danger: '#C94F4F',
  text: '#1F1F1F',
  muted: '#6F6F6F'
};

export const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    surface: palette.surface,
    outline: '#E2E8F0',
    error: palette.danger,
    onPrimary: '#FFFFFF'
  },
  fonts: configureFonts({ config: fontConfig })
};
