import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Navbar } from '../components/navigation/Navbar.jsx';
import { Sidebar } from '../components/navigation/Sidebar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { AiAssistantModal } from '../components/common/AiAssistantModal.jsx';
import { Loader2 } from 'lucide-react';

export const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
      <AiAssistantModal />
    </div>
  );
};
