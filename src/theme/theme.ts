import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';
import { COLORS } from '../constants/colors';

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
};
