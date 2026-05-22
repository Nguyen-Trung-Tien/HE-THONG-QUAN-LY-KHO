import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { cn } from '../../utils/cn';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận xóa', 
  message = 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.',
  confirmText = 'Xác nhận',
  cancelText = 'Quay lại',
  variant = 'danger'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xs"
      footer={
        <div className="flex gap-3 w-full">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 text-text-secondary bg-bg-subtle hover:bg-border/40 font-bold h-10 rounded-xl"
            size="sm"
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 font-black h-10 rounded-xl shadow-lg shadow-current/20 active:scale-95 transition-all"
            size="sm"
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center py-1">
        <div className={cn(
          "size-16 rounded-[1.5rem] flex items-center justify-center mb-6 relative",
          variant === 'danger' ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
        )}>
          <div className={cn(
            "absolute inset-0 rounded-[1.5rem] animate-ping opacity-20 duration-1000",
            variant === 'danger' ? "bg-error" : "bg-primary"
          )} />
          {variant === 'danger' ? (
            <svg className="size-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="size-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2 tracking-tighter uppercase leading-tight">
          {title}
        </h3>
        <p className="text-xs text-text-secondary font-medium leading-relaxed px-1">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

