// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FrappeProvider } from 'frappe-react-sdk';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './components/AppRoutes';

const initializeViewport = () => {
  // Set viewport height
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  };

  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => setTimeout(setViewportHeight, 100));
  setViewportHeight();

  return () => {
    window.removeEventListener('resize', setViewportHeight);
    window.removeEventListener('orientationchange', setViewportHeight);
  };
};

const App = () => {
  useEffect(() => {
    // Initialize viewport
    const cleanupViewport = initializeViewport();

    // Initialize theme
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    // Prevent overscroll/bounce in iOS
    const handleTouchMove = (e) => {
      if (e.target === document.body) {
        e.preventDefault();
      }
    };

    document.body.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Cleanup
    return () => {
      cleanupViewport();
      document.body.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <FrappeProvider>
          <AuthProvider>
            <div 
              className={`
                min-h-[var(--app-height)] 
                bg-gray-50 dark:bg-gray-900 
                text-gray-900 dark:text-gray-100 
                antialiased overflow-hidden
                transition-colors duration-200
              `}
            >
              <AppRoutes />
            </div>
          </AuthProvider>
        </FrappeProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;