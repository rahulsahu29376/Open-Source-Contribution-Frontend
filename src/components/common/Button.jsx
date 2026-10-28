import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary-hover text-white shadow-md shadow-secondary/20 focus:ring-secondary',
    outline: 'border border-surface-borderLight dark:border-surface-borderDark text-textMain-light dark:text-textMain-dark hover:bg-surface-light dark:hover:bg-surface-cardDark focus:ring-primary',
    ghost: 'text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-primary',
    danger: 'bg-error hover:bg-red-600 text-white shadow-md shadow-error/20 focus:ring-error',
    success: 'bg-success hover:bg-green-600 text-white shadow-md shadow-success/20 focus:ring-success',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
