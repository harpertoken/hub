import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} />;
      case 'dark':
        return <Moon size={16} />;
      default: // 'default' (auto)
        return <Monitor size={16} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default: // 'default' (auto)
        return 'Auto';
    }
  };

  const getNextTheme = () => {
    switch (theme) {
      case 'default':
        return 'Always Light';
      case 'light':
        return 'Always Dark';
      case 'dark':
        return 'Auto (System)';
      default:
        return 'Always Light';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 border border-gray-100 rounded-sm hover:border-gray-200"
      style={{ minWidth: '80px' }}
      title={`Switch to ${getNextTheme()} theme`}
      aria-label={`Current theme: ${getLabel()}. Click to switch to ${getNextTheme()}`}
    >
      {getIcon()}
      <span className="hidden sm:inline" style={{ minWidth: '32px', textAlign: 'left' }}>{getLabel()}</span>
    </button>
  );
};

export default ThemeToggle;
