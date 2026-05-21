import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'warm-night' | 'midnight' | 'deep-purple';

// ─── Light (original cream/amber) ────────────────────────────────────────────
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

// ─── Warm Night (dark warm plum — mirrors the light mode's warmth at night) ──
// Research: MD3 + Apple HIG principle — use dark gray-purple, never cold black.
// Keep amber primary (brand identity). Off-white text prevents halation glow.
const WARM_NIGHT = {
    background: '#1E1829',                          // warm dark plum
    backgroundGradient: ['#1E1829', '#261A35'] as const,
    primary: '#E8A87C',                             // amber lightened 8% for dark bg
    primaryDark: '#C8875A',
    text: '#F0E8D8',                                // warm cream-white (12.8:1 contrast)
    surface: '#2C2040',                             // elevated dark plum card surface
    secondary: '#9B8CAE',                           // muted mauve — 4.6:1 contrast
    glassBg: 'rgba(44,32,64,0.60)',
    glassBgStrong: 'rgba(54,41,82,0.78)',
    glassBorder: 'rgba(174,148,210,0.25)',           // lavender edge glow
    glassBorderStrong: 'rgba(174,148,210,0.42)',
    inputBackground: '#2C2040',
    cardBackground: '#2C2040',
    placeholder: '#6B5F80',
    error: '#EF9A9A',
    success: '#7EC8A4',
};

// ─── Midnight (GitHub Dark / Linear style — clean, sharp, professional) ──────
// Deep blue-black base, white text, same amber accent.
// Popular with developers and productivity apps.
const MIDNIGHT = {
    background: '#0D1117',                          // GitHub Dark base
    backgroundGradient: ['#0D1117', '#161B22'] as const,
    primary: '#E8A87C',                             // amber stands out bright on dark
    primaryDark: '#C8875A',
    text: '#E6EDF3',                                // GitHub's own white — tested at scale
    surface: '#161B22',                             // GitHub's card surface
    secondary: '#8B949E',                           // GitHub's secondary text
    glassBg: 'rgba(22,27,34,0.82)',
    glassBgStrong: 'rgba(33,38,45,0.92)',
    glassBorder: 'rgba(48,54,61,0.85)',
    glassBorderStrong: 'rgba(70,80,94,0.95)',
    inputBackground: '#21262D',
    cardBackground: '#161B22',
    placeholder: '#484F58',
    error: '#F85149',
    success: '#3FB950',
};

// ─── Deep Purple (rich purple — bold, immersive, nighttime personality) ───────
// Vibrant purple accent instead of amber for a fully purple experience.
// Inspired by Linear, Notion dark, and Craft dark.
const DEEP_PURPLE = {
    background: '#13111C',                          // deepest plum-black
    backgroundGradient: ['#13111C', '#1D1933'] as const,
    primary: '#B794F4',                             // vibrant soft violet — stands out
    primaryDark: '#9F7AEA',
    text: '#F0EEFF',                                // white with a hint of lavender
    surface: '#1E1A2E',                             // elevated dark violet surface
    secondary: '#9B8EC0',                           // muted purple-grey
    glassBg: 'rgba(45,38,80,0.65)',
    glassBgStrong: 'rgba(58,48,100,0.80)',
    glassBorder: 'rgba(167,139,250,0.28)',           // purple glow border
    glassBorderStrong: 'rgba(167,139,250,0.48)',
    inputBackground: '#252040',
    cardBackground: '#1E1A2E',
    placeholder: '#6B5F8A',
    error: '#FC8181',
    success: '#68D391',
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

const PALETTES: Record<ThemeMode, AppColors> = {
    'light': LIGHT,
    'warm-night': WARM_NIGHT,
    'midnight': MIDNIGHT,
    'deep-purple': DEEP_PURPLE,
};

export const THEME_LABELS: Record<ThemeMode, string> = {
    'light': 'Light',
    'warm-night': 'Warm Night',
    'midnight': 'Midnight',
    'deep-purple': 'Deep Purple',
};

interface ThemeContextValue {
    colors: AppColors;
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void; // legacy — cycles through all modes
}

const ThemeContext = createContext<ThemeContextValue>({
    colors: LIGHT,
    mode: 'light',
    isDark: false,
    setMode: () => {},
    toggleTheme: () => {},
});

const STORAGE_KEY = '@theme_mode';
const MODES: ThemeMode[] = ['light', 'warm-night', 'midnight', 'deep-purple'];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>('light');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(val => {
            if (val && MODES.includes(val as ThemeMode)) setModeState(val as ThemeMode);
        }).catch(() => {});
    }, []);

    const setMode = useCallback((m: ThemeMode) => {
        setModeState(m);
        AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
    }, []);

    // Legacy toggle: just switches between light and warm-night for the Switch component
    const toggleTheme = useCallback(() => {
        setMode(mode === 'light' ? 'warm-night' : 'light');
    }, [mode, setMode]);

    return (
        <ThemeContext.Provider value={{
            colors: PALETTES[mode],
            mode,
            isDark: mode !== 'light',
            setMode,
            toggleTheme,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
