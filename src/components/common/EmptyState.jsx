import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is nothing here yet. Try adjusting your filters or completing activities to populate this area.',
  actionLabel = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-surface-borderLight dark:border-surface-borderDark bg-surface-light/50 dark:bg-surface-cardDark/40 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
