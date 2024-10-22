import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(true); // Default to true for dark mode

  useEffect(() => {
    // Check if user has a stored preference
    const stored = localStorage.getItem('theme');
    if (stored) {
      setDarkMode(stored === 'dark');
    }
    
    // Apply theme
    applyTheme(stored ? stored === 'dark' : true);
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return {
    darkMode,
    toggleTheme
  };
};