import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Theme options: 'default' (auto), 'light', 'dark'
  const [theme, setTheme] = useState('default');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('tolerable-theme');
    if (savedTheme && ['default', 'light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    // Determine the actual theme to apply
    const actualTheme = theme === 'default' ? systemTheme : theme;

    // Remove existing theme classes
    document.documentElement.classList.remove('theme-default', 'theme-light', 'theme-dark');

    // Add current theme class (use actual theme for styling)
    document.documentElement.classList.add(`theme-${actualTheme}`);

    // Save to localStorage (save user preference, not system theme)
    localStorage.setItem('tolerable-theme', theme);

    // Apply CSS custom properties based on actual theme
    const root = document.documentElement;

    switch (actualTheme) {
      case 'light':
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f9f9f9');
        root.style.setProperty('--text-primary', '#000000');
        root.style.setProperty('--text-secondary', '#666666');
        root.style.setProperty('--border-color', '#e5e5e5');
        root.style.setProperty('--accent-color', '#0066cc');
        break;
      case 'dark':
        root.style.setProperty('--bg-primary', '#1a1a1a');
        root.style.setProperty('--bg-secondary', '#2a2a2a');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#cccccc');
        root.style.setProperty('--border-color', '#404040');
        root.style.setProperty('--accent-color', '#4da6ff');
        break;
    }
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    const themes = ['default', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const setSpecificTheme = (newTheme) => {
    if (['default', 'light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const actualTheme = theme === 'default' ? systemTheme : theme;

  const value = {
    theme,
    actualTheme,
    systemTheme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDefault: theme === 'default',
    isLight: theme === 'light',
    isDark: theme === 'dark',
    isActuallyLight: actualTheme === 'light',
    isActuallyDark: actualTheme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
