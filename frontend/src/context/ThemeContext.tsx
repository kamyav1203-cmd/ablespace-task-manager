'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ColorMode = 'amber' | 'blue' | 'pink';

interface ThemeContextType {
  theme: Theme;
  colorMode: ColorMode;
  toggleTheme: (newTheme?: Theme) => void;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColorMode = localStorage.getItem('colorMode') as ColorMode;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    if (savedColorMode) {
      setColorModeState(savedColorMode);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply appropriate class
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    // Apply color mode class
    const root = window.document.documentElement;
    root.classList.remove('color-amber', 'color-blue', 'color-pink');
    root.classList.add(`color-${colorMode}`);
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode, mounted]);

  const toggleTheme = (newTheme?: Theme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
  };

  // Avoid flash of unthemed content by not rendering until mounted (or render layout default)
  return (
    <ThemeContext.Provider value={{ theme, colorMode, toggleTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
