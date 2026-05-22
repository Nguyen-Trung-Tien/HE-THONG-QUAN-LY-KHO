import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, title, extra, className = '', noPadding = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-dark-card border-border/50 dark:border-white/5 shadow-soft-xl',
    glass: 'bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl border-white/40 dark:border-white/5 shadow-soft-2xl',
    primary: 'bg-primary/[0.03] dark:bg-primary/[0.05] border-primary/20 shadow-sm',
    subtle: 'bg-bg-subtle/30 dark:bg-white/[0.02] border-border/40 dark:border-white/5 shadow-inner-sm',
  };

  return (
    <div className={cn(
      'rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-soft-2xl',
      variants[variant],
      className
    )}>
      {(title || extra) && (
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-border/40 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-bg-subtle/20 dark:from-white/[0.02] to-transparent">
          {title && (
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 bg-primary rounded-full" />
              <h3 className="text-xs sm:text-sm font-black text-text-primary dark:text-dark-text-primary tracking-tighter uppercase">{title}</h3>
            </div>
          )}
          {extra && <div className="flex items-center scale-90 sm:scale-100">{extra}</div>}
        </div>
      )}
      <div className={cn(noPadding ? '' : 'p-5 sm:p-8')}>
        {children}
      </div>
    </div>
  );
};

export default Card;
