import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-4xl font-extrabold text-primary font-mono mb-2">404</span>
      <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark mb-2">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark max-w-sm mb-6">
        The branch or page you navigated to doesn't exist. Let's get you back on the main branch!
      </p>
      <Link to="/">
        <Button leftIcon={<Home className="w-4 h-4" />}>
          Return to Home
        </Button>
      </Link>
    </div>
  );
};
