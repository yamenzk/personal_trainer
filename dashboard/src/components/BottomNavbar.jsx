import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Dumbbell, Apple, MessageCircle, 
  Book
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

// Bottom Navigation
const BottomNavbar = () => {
  const location = useLocation();
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [direction, setDirection] = useState('none');

  useEffect(() => {
    // Determine animation direction based on navigation order
    const paths = ['/', '/workout-plans', '/food-plans', '/chat', '/resources'];
    const prevIndex = paths.indexOf(prevPathname);
    const currentIndex = paths.indexOf(location.pathname);
    
    if (prevIndex !== currentIndex) {
      setDirection(prevIndex < currentIndex ? 'right' : 'left');
      setPrevPathname(location.pathname);
    }
  }, [location.pathname, prevPathname]);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/workout-plans', icon: Dumbbell, label: 'Workouts' },
    { to: '/food-plans', icon: Apple, label: 'Meals' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/resources', icon: Book, label: 'Resources' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-5xl mx-auto h-[var(--footer-height)] px-4">
          <div className="flex items-center justify-between h-full">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex-1 group"
                >
                  <div className="flex flex-col items-center">
                    <div className={`
                      relative p-2 rounded-xl transition-all duration-200 
                      group-hover:bg-brand/10
                      ${isActive ? 'text-brand' : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      <item.icon className="w-5 h-5" />
                      {isActive && (
                        <div className={`
                          absolute inset-0 bg-brand/10 rounded-xl
                          animate-in fade-in duration-300
                          ${direction === 'right' ? 'slide-in-from-left' : 'slide-in-from-right'}
                        `} />
                      )}
                    </div>
                    <span className={`
                      text-xs transition-colors duration-200
                      ${isActive ? 'text-brand font-medium' : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar