import React from 'react';
import { cn } from '../../utils/cn';

const Table = ({ 
  columns, 
  data, 
  loading, 
  emptyMessage = 'Không có dữ liệu',
  rowKey = 'id'
}) => {
  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-border/50 dark:border-white/5 bg-white dark:bg-dark-card shadow-soft-xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-bg-subtle/50 dark:from-white/[0.02] to-white dark:to-dark-card">
              {columns.map((column, index) => (
                <th 
                  key={column.key || index}
                  className={cn(
                    "px-8 py-6 text-[10px] font-semibold text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-[0.2em] border-b border-border/30 dark:border-white/5",
                    column.className
                  )}
                >
                  <div className="flex items-center gap-x-2">
                    <span>{column.title}</span>
                    <div className="size-1 rounded-full bg-primary/30" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 dark:divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-row-${i}`} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={`skeleton-cell-${j}`} className="px-8 py-6">
                      <div className="h-3 bg-bg-subtle dark:bg-white/5 rounded-full w-full opacity-50" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-8 py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-y-3 opacity-40">
                    <svg className="size-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v7m18 0a2 2 0 01-2 2H4a2 2 0 01-2-2m18 0l-2 2m-2-2l-2 2m-2-2l-2 2m-2-2l-2 2m-2-2l-2 2m-2-2l-2 2m-2-2l-2 2" />
                    </svg>
                    <p className="text-xs font-semibold uppercase tracking-widest">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={row[rowKey] || rowIndex} 
                  className="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 cursor-default relative"
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={cn(
                        "px-8 py-6 text-xs font-bold text-text-primary dark:text-dark-text-primary transition-all duration-300 group-hover:translate-x-0.5",
                        column.className
                      )}
                    >
                      {/* Left highlight indicator */}
                      {colIndex === 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                      )}
                      {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
