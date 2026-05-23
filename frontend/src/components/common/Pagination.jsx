import React from 'react';
import { cn } from '../../utils/cn';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '',
  siblingCount = 1 
}) => {
  if (totalPages <= 1) return null;

  const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const paginationRange = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }
  };

  const pages = paginationRange();

  return (
    <div className={cn("flex items-center justify-center space-x-1 sm:space-x-1.5 mt-4", className)}>
      <button
        onClick={(e) => {
          e.preventDefault();
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        className="p-1.5 sm:p-2 rounded-lg border border-border/60 dark:border-dark-border/40 bg-white dark:bg-dark-card text-text-tertiary hover:bg-primary/5 hover:text-primary hover:border-primary/30 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-dark-card disabled:hover:text-text-tertiary transition-all duration-300 active:scale-90 shadow-sm"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center space-x-1">
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-text-tertiary text-[10px] font-black">
                •••
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-black transition-all duration-300 flex items-center justify-center uppercase tracking-tighter",
                  currentPage === page 
                    ? "bg-primary text-white shadow-md shadow-primary/30 scale-105 z-10" 
                    : "bg-white dark:bg-dark-card border border-border/60 dark:border-dark-border/40 text-text-secondary hover:bg-primary/5 hover:text-primary active:scale-90 shadow-sm"
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          onPageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
        className="p-1.5 sm:p-2 rounded-lg border border-border/60 dark:border-dark-border/40 bg-white dark:bg-dark-card text-text-tertiary hover:bg-primary/5 hover:text-primary hover:border-primary/30 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-dark-card disabled:hover:text-text-tertiary transition-all duration-300 active:scale-90 shadow-sm"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
