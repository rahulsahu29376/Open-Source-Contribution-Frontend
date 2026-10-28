import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'glass-panel border-white/20 dark:border-white/10 shadow-xl'
          : 'bg-white dark:bg-surface-cardDark border-surface-borderLight dark:border-surface-borderDark shadow-sm'
      } ${
        hover ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
