// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <TopNavbar />
      <main className="pb-16 pt-16"> {/* Padding for both navbars */}
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default Layout;
