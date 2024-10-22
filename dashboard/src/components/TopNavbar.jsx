import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import {
  Home, Dumbbell, Apple, MessageCircle, 
  Book, User, ShoppingBag, ChevronLeft,
  Moon, Sun, Menu, X, Bell
} from 'lucide-react';

// Reusable animation for icons
const IconAnimation = ({ children }) => (
  <div className="relative">
    <div className="transform transition-transform duration-200 group-hover:scale-90">
      {children}
    </div>
    <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-200" />
  </div>
);

// Top Navigation
const TopNavbar = () => {
  const { clientData } = useAuth();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const showBackButton = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 safe-area-top
      transition-all duration-300
      ${isScrolled ? 'backdrop-blur-lg' : 'backdrop-blur-none'}
    `}>
      <div className={`
        transition-colors duration-300
        ${isScrolled 
          ? 'bg-white/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-transparent'}
      `}>
        <div className="max-w-5xl mx-auto h-[var(--header-height)] px-4">
          <div className="flex items-center justify-between h-full">
            {/* Left Section */}
            <div className="flex items-center">
              {showBackButton ? (
                <Link 
                  to="/"
                  className="group flex items-center space-x-2 text-gray-600 dark:text-gray-300 
                           hover:text-brand dark:hover:text-brand"
                >
                  <IconAnimation>
                    <ChevronLeft className="w-5 h-5" />
                  </IconAnimation>
                  <span className="text-sm font-medium">Back</span>
                </Link>
              ) : (
                <Link 
                  to="/" 
                  className="relative group"
                >
                  <span className="text-xl font-bold bg-clip-text text-transparent 
                                 bg-gradient-to-r from-brand to-brand-600
                                 hover:from-brand-600 hover:to-brand">
                    byShujaa
                  </span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand/20 to-brand-600/20 
                                opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                </Link>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="nav-button group"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <IconAnimation>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </IconAnimation>
              </button>

              {/* Notifications */}
              <button className="nav-button group relative">
                <IconAnimation>
                  <Bell className="w-5 h-5" />
                </IconAnimation>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white 
                                 text-xs font-medium rounded-full flex items-center justify-center
                                 animate-bounce">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Store */}
              <Link 
                to="/store" 
                className="nav-button group"
                aria-label="Store"
              >
                <IconAnimation>
                  <ShoppingBag className="w-5 h-5" />
                </IconAnimation>
              </Link>
              
              {/* Profile */}
              <Link 
                to="/profile" 
                className="relative group"
                aria-label="Profile"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden transform transition-transform 
                             duration-200 group-hover:scale-105 group-active:scale-95">
                  {clientData?.image ? (
                    <img 
                      src={clientData.image} 
                      alt={clientData.client_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center 
                                 bg-gradient-to-br from-brand/10 to-brand-600/10 
                                 text-brand group-hover:from-brand/20 group-hover:to-brand-600/20">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-brand/20 to-brand-600/20 
                             opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar