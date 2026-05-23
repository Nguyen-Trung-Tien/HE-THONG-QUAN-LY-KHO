import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({ 
  className, 
  type = 'text', 
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName,
  ref,
  ...props 
}) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 w-full', containerClassName)}>
      {label && (
        <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
          <span>{label}</span>
          <div className="w-1 h-1 rounded-full bg-primary/40" />
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors duration-300">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/60 text-text-primary text-xs rounded-2xl py-3.5 px-5 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 placeholder:text-text-tertiary/60 font-bold disabled:bg-bg-subtle/50 dark:disabled:bg-white/[0.01] disabled:text-text-tertiary disabled:cursor-not-allowed shadow-inner-sm hover:border-border dark:hover:border-dark-border',
            leftIcon && 'pl-12',
            rightIcon && 'pr-12',
            error && 'border-error/50 focus:border-error focus:ring-error/5 bg-error/[0.02]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary">
            {rightIcon}
          </div>
        )}
        
        {/* Subtle glow effect on focus */}
        <div className="absolute -inset-1 bg-primary/20 rounded-[1.8rem] blur-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-500 pointer-events-none -z-10" />
      </div>
      {error && (
        <p className="text-[10px] font-black text-error ml-2 animate-in fade-in slide-in-from-top-1 duration-300 uppercase tracking-tight">
          {error}
        </p>
      )}
    </div>
  );
};

Input.displayName = 'Input';

export default Input;
