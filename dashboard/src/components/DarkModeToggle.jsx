// src/components/DarkModeToggle.jsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const DarkModeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full
                 bg-gray-100 dark:bg-gray-800
                 text-gray-600 dark:text-gray-300
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-all duration-200 press-effect"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 animate-fade-in" />
      ) : (
        <Moon className="w-5 h-5 animate-fade-in" />
      )}
    </button>
  );
};

export default DarkModeToggle;