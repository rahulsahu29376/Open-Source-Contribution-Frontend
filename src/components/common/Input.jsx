import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textMain-mutedLight dark:text-textMain-mutedDark">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`w-full rounded-xl border bg-white dark:bg-surface-cardDark text-textMain-light dark:text-textMain-dark text-sm placeholder:text-textMain-mutedLight/70 dark:placeholder:text-textMain-mutedDark/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } py-2.5 ${
            error
              ? 'border-error focus:ring-error'
              : 'border-surface-borderLight dark:border-surface-borderDark'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-error font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">{helperText}</p>
      ) : null}
    </div>
  );
};
