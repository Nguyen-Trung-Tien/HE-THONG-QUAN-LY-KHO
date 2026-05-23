import React, { useMemo } from "react";
import Card from "../common/Card";
import { cn } from "../../utils/cn";

const InventoryStatusCard = ({ inventoryItems }) => {
  const stats = useMemo(() => {
    const total = (inventoryItems || []).length;
    if (total === 0) {
      return { inStockPercent: 0, lowStockPercent: 0, outOfStockPercent: 0, total: 0 };
    }

    const inStock = inventoryItems.filter((item) => item.stock > 10).length;
    const lowStock = inventoryItems.filter(
      (item) => item.stock > 0 && item.stock <= 10
    ).length;
    const outOfStock = inventoryItems.filter((item) => item.stock === 0).length;

    return {
      inStockPercent: Math.round((inStock / total) * 100),
      lowStockPercent: Math.round((lowStock / total) * 100),
      outOfStockPercent: Math.round((outOfStock / total) * 100),
      total,
    };
  }, [inventoryItems]);

  return (
    <Card title="Tình trạng tồn kho" className="h-full shadow-soft-xl">
        <div className="h-64 flex items-center justify-center relative">
          <div className="relative w-48 h-48">
            {/* Chart SVG */}
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              {/* background ring */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-border/20 dark:text-white/5"
              />
              {/* in stock */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeDasharray={`${stats.inStockPercent}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* low stock */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="3.5"
                strokeDasharray={`${stats.lowStockPercent}, 100`}
                strokeDashoffset={`-${stats.inStockPercent}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* out of stock */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F87171"
                strokeWidth="3.5"
                strokeDasharray={`${stats.outOfStockPercent}, 100`}
                strokeDashoffset={`-${stats.inStockPercent + stats.lowStockPercent}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* inner center info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-text-primary tracking-tighter">{stats.total}</span>
              <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Sản phẩm</span>
            </div>
          </div>
        </div>

        {/* Legend / Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Còn hàng', percent: stats.inStockPercent, color: 'bg-primary', lightColor: 'text-primary' },
            { label: 'Sắp hết', percent: stats.lowStockPercent, color: 'bg-warning', lightColor: 'text-warning' },
            { label: 'Hết hàng', percent: stats.outOfStockPercent, color: 'bg-error', lightColor: 'text-error' },
          ].map((item, i) => (
            <div key={i} className="text-center p-3 bg-bg-subtle/50 dark:bg-white/[0.01] rounded-2xl border border-border/40 dark:border-dark-border/40 group hover:border-primary/20 transition-all">
              <div className={cn("text-sm font-black tracking-tighter mb-1", item.lightColor)}>
                {item.percent}%
              </div>
              <div className="flex items-center justify-center gap-x-1.5">
                <div className={cn("size-1.5 rounded-full", item.color)} />
                <span className="text-[8px] font-black text-text-tertiary uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
    </Card>
  );
};

export default InventoryStatusCard;
