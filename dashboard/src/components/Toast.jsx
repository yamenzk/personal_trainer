import React, { createContext, useContext, useCallback, useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info, 
  X,
  ArrowRight 
} from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const colors = {
  success: {
    background: 'bg-green-50 dark:bg-green-900/30',
    border: 'border-l-green-500',
    text: 'text-green-800 dark:text-green-200',
    icon: 'text-green-500',
    progress: 'bg-green-500'
  },
  error: {
    background: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-l-red-500',
    text: 'text-red-800 dark:text-red-200',
    icon: 'text-red-500',
    progress: 'bg-red-500'
  },
  warning: {
    background: 'bg-yellow-50 dark:bg-yellow-900/30',
    border: 'border-l-yellow-500',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-500'
  },
  info: {
    background: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-l-blue-500',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'text-blue-500',
    progress: 'bg-blue-500'
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Keeping the original API
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setToasts(current => {
      // Check for duplicate messages
      const isDuplicate = current.some(toast => toast.message === message);
      if (isDuplicate) return current;
      
      return [...current, { id, message, type }];
    });

    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div 
        className="fixed bottom-20 inset-x-0 z-50 pointer-events-none px-4"
        aria-live="polite"
      >
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
          {toasts.map(toast => {
            const Icon = icons[toast.type];
            const color = colors[toast.type];

            return (
              <div
                key={toast.id}
                role="alert"
                className="w-full pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <div className={`
                  relative overflow-hidden
                  flex items-center gap-3 px-4 py-3
                  rounded-xl border-l-4 shadow-lg
                  backdrop-blur-lg
                  ${color.background}
                  ${color.border}
                  group
                `}>
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 p-0.5 rounded-full
                    transition-transform duration-200
                    group-hover:scale-110
                    ${color.icon}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Message */}
                  <p className={`flex-1 text-sm font-medium ${color.text}`}>
                    {toast.message}
                  </p>

                  {/* Close Button */}
                  <button
                    onClick={() => removeToast(toast.id)}
                    className={`
                      p-1 rounded-lg opacity-60 
                      hover:opacity-100 active:scale-95
                      transition-all duration-200
                      ${color.text}
                    `}
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Animated Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5 dark:bg-white/5">
                    <div 
                      className={`
                        h-full ${color.progress} 
                        animate-progress-line
                      `}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};