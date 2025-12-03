import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';
import { COLORS } from '../constants/colors';

const fontConfig = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  }
};

export const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    outline: COLORS.secondary,
    error: COLORS.error,
    onPrimary: COLORS.surface,
    onSurface: COLORS.text,
    onBackground: COLORS.text,
  },
  fonts: configureFonts({ config: fontConfig })
};
