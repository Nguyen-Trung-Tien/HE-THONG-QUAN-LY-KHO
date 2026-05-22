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
    <div className={cn("w-full flex flex-col gap-y-2", containerClassName)}>
      {label && (
        <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-[0.15em] flex items-center gap-x-1.5">
          <span>{label}</span>
          <div className="size-1 rounded-full bg-primary/40" />
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-all duration-300 group-focus-within:text-primary scale-90 group-focus-within:scale-100">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-bg-subtle/30 border border-border/50 text-text-primary text-xs rounded-2xl py-3.5 px-5 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 placeholder:text-text-tertiary/60 font-bold disabled:bg-bg-subtle disabled:opacity-50 disabled:cursor-not-allowed shadow-inner-sm hover:border-border',
            leftIcon && 'pl-12',
            rightIcon && 'pr-12',
            error && 'border-error/50 focus:border-error focus:ring-error/5 bg-error/[0.02]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-all duration-300 group-focus-within:text-primary scale-90 group-focus-within:scale-100">
            {rightIcon}
          </div>
        )}
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
