import React, { useEffect, useState } from 'react';

/**
 * LogoComponent - Dynamically switches between light and dark mode logos
 * @param {Object} props - Component props
 * @param {string} props.className - CSS classes to apply to the logo
 * @param {string} props.alt - Alt text for the logo
 * @returns {JSX.Element} Logo component that adapts to theme
 */
const LogoComponent = ({ className = '', alt = 'Tolerable Logo' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Function to check current theme
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const isDark = htmlElement.classList.contains('theme-dark') || 
                     (htmlElement.classList.contains('theme-default') && 
                      window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkMode(isDark);
    };

    // Initial check
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => checkTheme();
    mediaQuery.addEventListener('change', handleMediaChange);

    // Cleanup
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Choose the appropriate logo based on theme
  const logoSrc = isDarkMode 
    ? '/assets/tolerable-brand/tolerable-logo-dark.svg'
    : '/assets/tolerable-brand/tolerable-logo-light.svg';

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`tolerable-logo ${className}`}
    />
  );
};

export default LogoComponent;
