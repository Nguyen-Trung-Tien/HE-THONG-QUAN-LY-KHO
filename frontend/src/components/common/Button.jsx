import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ref,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white dark:bg-dark-card text-text-primary border border-border/60 dark:border-dark-border/60 hover:bg-bg-subtle dark:hover:bg-white/5 shadow-sm active:scale-95',
    outline: 'bg-transparent text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary/5 active:scale-95',
    ghost: 'bg-transparent text-text-secondary hover:bg-bg-subtle dark:hover:bg-white/5 hover:text-text-primary active:scale-95',
    danger: 'bg-error text-white shadow-xl shadow-error/20 hover:shadow-error/40 hover:-translate-y-0.5 active:translate-y-0',
    success: 'bg-success text-white shadow-xl shadow-success/20 hover:shadow-success/40 hover:-translate-y-0.5 active:translate-y-0',
    info: 'bg-info text-white shadow-xl shadow-info/20 hover:shadow-info/40 hover:-translate-y-0.5 active:translate-y-0',
  };

  const sizes = {
    xs: 'px-3 py-1 text-[10px] font-black rounded-lg',
    sm: 'px-4 py-1.5 text-xs font-black rounded-xl',
    md: 'px-6 py-2.5 text-xs font-black rounded-[1rem]',
    lg: 'px-8 py-3.5 text-sm font-black rounded-[1.25rem]',
    xl: 'px-10 py-4 text-base font-black rounded-[1.5rem]',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-300 outline-none focus:ring-4 focus:ring-current/10 uppercase tracking-tighter disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2.5 size-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2.5 transition-transform group-hover:-translate-x-0.5">{leftIcon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon && (
        <span className="ml-2.5 transition-transform group-hover:translate-x-0.5">{rightIcon}</span>
      )}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;
