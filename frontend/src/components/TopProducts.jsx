import React, { useEffect, useState } from "react";
import { fetchTopSellingProducts } from "../API/statistics/statisticsAPI";

function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopProducts = async () => {
      try {
        const data = await fetchTopSellingProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
      } finally {
        setLoading(false);
      }
    };

    getTopProducts();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const calcGrowth = (currentRevenue, prevRevenue) => {
    if (prevRevenue === 0) return "+100%";
    const growth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
    return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="bg-bg-light/30 dark:bg-transparent mb-8 rounded-[2rem] p-1">
      <h1 className="text-xl font-black text-text-primary mb-6 tracking-tighter uppercase">
        Sản phẩm bán chạy
      </h1>
      <div className="bg-white dark:bg-dark-card shadow-soft-xl rounded-[2rem] border border-border/40 dark:border-dark-border/40 p-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-border/40 dark:divide-dark-border/40">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                  Đã bán
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                  Doanh thu
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                  Tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 dark:divide-dark-border/20">
              {products.slice(0, 4).map((product) => (
                <tr key={product.productId} className="hover:bg-bg-subtle/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-bold text-text-primary uppercase tracking-tight">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-text-secondary">
                    {product.totalQuantity} <span className="text-[10px] opacity-60">chiếc</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-primary">
                    {formatCurrency(product.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${
                        product.totalRevenue - product.prevRevenue >= 0
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-error/10 text-error border border-error/20"
                      }`}
                    >
                      {calcGrowth(
                        Number(product.totalRevenue),
                        Number(product.prevRevenue)
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopProducts;
