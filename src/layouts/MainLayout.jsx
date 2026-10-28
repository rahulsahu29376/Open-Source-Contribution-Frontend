import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { AiAssistantModal } from '../components/common/AiAssistantModal.jsx';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AiAssistantModal />
    </div>
  );
};
