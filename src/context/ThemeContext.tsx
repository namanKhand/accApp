import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIGHT = {
    background: '#FDF3E0',
    backgroundGradient: ['#FDF3E0', '#F5E4C4'] as const,
    primary: '#DFA878',
    primaryDark: '#C8875A',
    text: '#4A3B32',
    surface: '#FFFFFF',
    secondary: '#C4B5A8',
    glassBg: 'rgba(255,255,255,0.52)',
    glassBgStrong: 'rgba(255,255,255,0.64)',
    glassBorder: 'rgba(255,255,255,0.70)',
    glassBorderStrong: 'rgba(255,255,255,0.85)',
    inputBackground: '#FFFFFF',
    cardBackground: '#FFFFFF',
    placeholder: '#C4B5A8',
    error: '#B00020',
    success: '#4CAF50',
};

const DARK = {
    background: '#1A1410',
    backgroundGradient: ['#1A1410', '#2A1F16'] as const,
    primary: '#DFA878',
    primaryDark: '#C8875A',
    text: '#F0E6D8',
    surface: '#2C2318',
    secondary: '#8A7A70',
    glassBg: 'rgba(60,40,20,0.60)',
    glassBgStrong: 'rgba(70,50,30,0.75)',
    glassBorder: 'rgba(255,255,255,0.14)',
    glassBorderStrong: 'rgba(255,255,255,0.22)',
    inputBackground: '#2C2318',
    cardBackground: '#2C2318',
    placeholder: '#8A7A70',
    error: '#CF6679',
    success: '#66BB6A',
};

export type AppColors = {
    background: string;
    backgroundGradient: readonly [string, string];
    primary: string;
    primaryDark: string;
    text: string;
    surface: string;
    secondary: string;
    glassBg: string;
    glassBgStrong: string;
    glassBorder: string;
    glassBorderStrong: string;
    inputBackground: string;
    cardBackground: string;
    placeholder: string;
    error: string;
    success: string;
};

interface ThemeContextValue {
    colors: AppColors;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    colors: LIGHT,
    isDark: false,
    toggleTheme: () => {},
});

const STORAGE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(val => {
            if (val === 'dark') setIsDark(true);
        }).catch(() => {});
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const next = !prev;
            AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light').catch(() => {});
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ colors: isDark ? DARK : LIGHT, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
