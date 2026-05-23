import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ 
  children, 
  className, 
  variant = 'neutral',
  size = 'md'
}) => {
  const variants = {
    neutral: 'bg-bg-subtle dark:bg-white/5 text-text-tertiary border-border/50 dark:border-dark-border/40',
    primary: 'bg-primary/10 text-primary border-primary/30 shadow-sm shadow-primary/5',
    success: 'bg-success/10 text-success border-success/30 shadow-sm shadow-success/5',
    error: 'bg-error/10 text-error border-error/30 shadow-sm shadow-error/5',
    warning: 'bg-warning/10 text-warning border-warning/30 shadow-sm shadow-warning/5',
    info: 'bg-info/10 text-info border-info/30 shadow-sm shadow-info/5',
    accent: 'bg-accent/10 text-amber-600 dark:text-accent border-accent/30 shadow-sm shadow-accent/5',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.15em] rounded-lg',
    md: 'px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] rounded-xl',
    lg: 'px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-2xl',
  };

  return (
    <span className={cn(
      'inline-flex items-center justify-center border transition-all duration-300 hover:scale-105',
      variants[variant],
      sizes[size],
      className
    )}>
      <div className={cn("w-1 h-1 rounded-full mr-1.5 opacity-60", 
        variant === 'success' ? 'bg-success' : 
        variant === 'error' ? 'bg-error' : 
        variant === 'warning' ? 'bg-warning' : 
        variant === 'primary' ? 'bg-primary' : 'bg-current'
      )} />
      {children}
    </span>
  );
};

export default Badge;
