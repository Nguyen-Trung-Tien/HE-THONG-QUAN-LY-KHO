import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  footer 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  const isSmall = size === 'xs' || size === 'sm';

  const modalContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-text-primary/60 backdrop-blur-[8px] animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={cn(
          "bg-white rounded-[2.5rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] w-full z-10 flex flex-col max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-white/40",
          sizes[size]
        )}
      >
        {/* Header */}
        <div className={cn(
          "border-b border-border/40 flex items-center justify-between bg-gradient-to-r from-white via-white to-primary/5 sticky top-0 z-20",
          isSmall ? "px-6 py-5" : "px-10 py-7"
        )}>
          <div className="space-y-1">
            <h3 className={cn(
              "font-black text-text-primary tracking-tighter uppercase leading-none",
              isSmall ? "text-base" : "text-xl"
            )}>
              {title}
            </h3>
            <div className={cn("h-1 bg-primary rounded-full", isSmall ? "w-8" : "w-12")} />
          </div>
          <button 
            onClick={onClose}
            className="group p-2 rounded-2xl bg-bg-subtle/50 hover:bg-error/10 text-text-tertiary hover:text-error transition-all duration-300 active:scale-90"
          >
            <svg className={cn("transition-transform group-hover:rotate-90 duration-300", isSmall ? "w-4 h-4" : "w-5 h-5")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={cn(
          "overflow-y-auto flex-1 custom-scrollbar scroll-smooth",
          isSmall ? "p-6" : "p-10"
        )}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={cn(
            "border-t border-border/40 bg-gray-50/50 backdrop-blur-sm sticky bottom-0 z-20",
            isSmall ? "px-6 py-5" : "px-10 py-7"
          )}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
