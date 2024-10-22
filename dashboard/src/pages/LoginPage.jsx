import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import {
  Dumbbell,
  ArrowRight,
  Loader,
  Sparkles,
  UserCircle,
  Lock,
  CheckCircle
} from 'lucide-react';

const LoginPage = () => {
  const [membershipId, setMembershipId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastLoginId, setLastLoginId] = useState('');
  const [showSuccessState, setShowSuccessState] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsAnimated(true);
      const lastId = localStorage.getItem('lastLoginId');
      if (lastId) setLastLoginId(lastId);
      const input = document.getElementById('membership-input');
      if (input) input.focus();
    };
    sequence();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!membershipId.trim()) {
      handleError('Please enter your membership ID');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(membershipId);
      if (success) {
        localStorage.setItem('lastLoginId', membershipId);
        setShowSuccessState(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/', { replace: true });
      } else {
        handleError('Invalid membership ID');
      }
    } catch (error) {
      handleError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (message) => {
    setHasError(true);
    addToast(message, 'error');
    const input = document.getElementById('membership-input');
    input.classList.add('animate-shake');
    setTimeout(() => {
      input.classList.remove('animate-shake');
      setHasError(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-0 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-48 left-48 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className={`
        relative min-h-screen flex items-center justify-center p-4
        transform transition-all duration-700 ease-out
        ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}>
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title Section */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
                <Dumbbell className="h-12 w-12 text-brand animate-float" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-brand animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your membership ID to access your training dashboard
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand/50 via-blue-500/50 to-green-500/50 rounded-2xl blur group-hover:blur-md transition-all duration-300" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-1">
                  <div className="relative">
                    <input
                      id="membership-input"
                      type="text"
                      value={membershipId}
                      onChange={(e) => setMembershipId(e.target.value)}
                      className={`
                        w-full px-6 py-4 bg-transparent
                        text-gray-900 dark:text-white text-lg
                        rounded-xl border-2 transition-all duration-300
                        focus:outline-none focus:ring-0
                        ${hasError 
                          ? 'border-red-500' 
                          : 'border-gray-200 dark:border-gray-700 focus:border-brand'}
                      `}
                      placeholder="Enter membership ID"
                      disabled={isLoading || showSuccessState}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {showSuccessState ? (
                        <CheckCircle className="w-6 h-6 text-green-500 animate-bounce-in" />
                      ) : isLoading ? (
                        <Loader className="w-6 h-6 text-brand animate-spin" />
                      ) : (
                        <Lock className={`
                          w-6 h-6 transition-colors duration-300
                          ${membershipId ? 'text-brand' : 'text-gray-400'}
                        `} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {lastLoginId && !membershipId && (
                <button
                  type="button"
                  onClick={() => setMembershipId(lastLoginId)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3
                           text-gray-600 dark:text-gray-400 
                           hover:text-brand dark:hover:text-brand
                           bg-white/50 dark:bg-gray-800/50 
                           rounded-xl transition-all duration-300
                           hover:bg-white dark:hover:bg-gray-800"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Use previous login ID</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading || showSuccessState}
                className={`
                  w-full px-6 py-4 rounded-xl
                  bg-gradient-to-r from-brand via-brand to-brand-600
                  hover:from-brand-600 hover:to-brand
                  text-white font-medium text-lg
                  transform transition-all duration-300
                  hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${showSuccessState ? 'bg-green-500' : ''}
                `}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{showSuccessState ? 'Success!' : 'Continue'}</span>
                  {!showSuccessState && <ArrowRight className="w-5 h-5" />}
                </span>
              </button>
            </form>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact your trainer or visit our{' '}
            <a href="#" className="text-brand hover:text-brand-600">support center</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;