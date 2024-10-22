import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';
import SetupWizard from './SetupWizard';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-brand/5 to-brand/10 dark:from-gray-900 dark:to-gray-800">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-brand/10 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

// Lazy load pages
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Profile = React.lazy(() => import('../pages/Profile'));
const WorkoutPlans = React.lazy(() => import('../pages/WorkoutPlans'));
const FoodPlans = React.lazy(() => import('../pages/FoodPlans'));
const Chat = React.lazy(() => import('../pages/Chat'));
const Resources = React.lazy(() => import('../pages/Resources'));
const Store = React.lazy(() => import('../pages/Store'));

const needsSetup = (clientData) => {
  if (!clientData?.client) return false;
  
  const requiredFields = [
    'client_name',
    'date_of_birth',
    'gender',
    'height',
    'weight_goal',
    'workout_preference',
    'workout_split',
    'goal',
    'meal_split'
  ];

  const missingFields = requiredFields.some(field => !clientData.client[field]);
  const missingWeight = !clientData.client.weight_log || clientData.client.weight_log.length === 0;

  return missingFields || missingWeight;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, clientData } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (needsSetup(clientData)) {
    return <SetupWizard />;
  }

  return children;
};

const Layout = ({ children }) => {
  const { isAuthenticated, clientData } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isInSetup = clientData && needsSetup(clientData);

  // Don't show navigation on login or during setup
  if (!isAuthenticated || isLoginPage || isInSetup) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-[var(--app-height)] bg-gradient-to-b from-brand/5 to-brand/10 dark:from-gray-900 dark:to-gray-800">
      <TopNavbar />
      <main className="flex-1 overflow-y-auto pt-[var(--header-height)] pb-[var(--footer-height)]">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <BottomNavbar />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Layout>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workout-plans" 
            element={
              <ProtectedRoute>
                <WorkoutPlans />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/food-plans" 
            element={
              <ProtectedRoute>
                <FoodPlans />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/store" 
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            } 
          />

          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Suspense>
  );
};

export default AppRoutes;