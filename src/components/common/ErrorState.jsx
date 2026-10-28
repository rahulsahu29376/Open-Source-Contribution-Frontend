import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button.jsx';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this content.',
  onRetry = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-error/20 bg-error-light/30 dark:bg-error/5 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-sm font-bold text-textMain-light dark:text-textMain-dark mb-1">
        {title}
      </h3>

      <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark max-w-sm mb-4">
        {message}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
