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
    <div className="bg-blue-50 mb-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-6">
        Sản phẩm bán chạy
      </h1>
      <div className="bg-card shadow-card rounded-lg p-6">
        <div className="flex justify-end mb-6">
          {/* <button className="text-primary hover:text-accent transition-colors text-sm font-medium">
            Xem tất cả
          </button> */}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {products.slice(0, 4).map((product) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-textPrimary">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    {product.totalQuantity} chiếc
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    {formatCurrency(product.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.totalRevenue - product.prevRevenue >= 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
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
