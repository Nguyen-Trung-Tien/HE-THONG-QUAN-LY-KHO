import React, { useState, useEffect, useRef } from "react";
import { fetchTotalRevenue } from "../API/statistics/statisticsAPI";
function Statistics() {
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("sales");
  const [totalRevenue, setTotalRevenue] = useState(0);

  const salesChartRef = useRef(null);
  const inventoryChartRef = useRef(null);
  useEffect(() => {
    fetchTotalRevenue()
      .then((data) => setTotalRevenue(data.totalRevenue))
      .catch(() => setTotalRevenue(0));
    if (activeTab === "sales" && salesChartRef.current) {
      const ctx = salesChartRef.current;
      const canvas = ctx.getContext("2d");
      const width = ctx.clientWidth;
      const height = ctx.clientHeight;
      ctx.width = width;
      ctx.height = height;

      canvas.clearRect(0, 0, width, height);

      const data = [65, 59, 80, 81, 56, 55, 40, 84, 64, 120, 132, 91];
      const labels = [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ];

      const maxValue = Math.max(...data);
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const pointSpacing = chartWidth / (data.length - 1);

      canvas.beginPath();
      canvas.moveTo(padding, padding);
      canvas.lineTo(padding, height - padding);
      canvas.lineTo(width - padding, height - padding);
      canvas.strokeStyle = "#E2E8F0";
      canvas.stroke();

      // Vẽ lưới
      canvas.beginPath();
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        canvas.moveTo(padding, y);
        canvas.lineTo(width - padding, y);
      }
      canvas.strokeStyle = "rgba(226, 232, 240, 0.5)";
      canvas.stroke();

      canvas.beginPath();
      canvas.moveTo(
        padding,
        height - padding - (data[0] / maxValue) * chartHeight
      );
      for (let i = 1; i < data.length; i++) {
        const x = padding + i * pointSpacing;
        const y = height - padding - (data[i] / maxValue) * chartHeight;
        canvas.lineTo(x, y);
      }
      canvas.strokeStyle = "#00BFFF";
      canvas.lineWidth = 3;
      canvas.stroke();

      for (let i = 0; i < data.length; i++) {
        const x = padding + i * pointSpacing;
        const y = height - padding - (data[i] / maxValue) * chartHeight;
        canvas.beginPath();
        canvas.arc(x, y, 5, 0, Math.PI * 2);
        canvas.fillStyle = "#FFFFFF";
        canvas.fill();
        canvas.strokeStyle = "#00BFFF";
        canvas.lineWidth = 2;
        canvas.stroke();
      }

      canvas.fillStyle = "#718096";
      canvas.font = "12px Inter";
      canvas.textAlign = "center";
      for (let i = 0; i < labels.length; i++) {
        const x = padding + i * pointSpacing;
        canvas.fillText(labels[i], x, height - padding + 20);
      }

      canvas.textAlign = "right";
      for (let i = 0; i <= 5; i++) {
        const value = maxValue * (1 - i / 5);
        const y = padding + (chartHeight / 5) * i;
        canvas.fillText(
          Math.round(value).toLocaleString() + "tr",
          padding - 10,
          y + 4
        );
      }
    }

    if (activeTab === "inventory" && inventoryChartRef.current) {
      const ctx = inventoryChartRef.current;
      const canvas = ctx.getContext("2d");
      const width = ctx.clientWidth;
      const height = ctx.clientHeight;
      ctx.width = width;
      ctx.height = height;

      canvas.clearRect(0, 0, width, height);

      const data = [
        { name: "Điện tử", value: 45 },
        { name: "Phụ kiện", value: 25 },
        { name: "Thiết bị đeo", value: 15 },
        { name: "Khác", value: 15 },
      ];
      const colors = ["#00BFFF", "#FFD700", "#FF6B6B", "#4CAF50"];
      const total = data.reduce((sum, item) => sum + item.value, 0);

      const radius = Math.min(width, height) / 3.5;
      const centerX = width / 2;
      const centerY = height / 2 - 40;
      let startAngle = -Math.PI / 2;

      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (2 * Math.PI * data[i].value) / total;
        canvas.beginPath();
        canvas.moveTo(centerX, centerY);
        canvas.arc(
          centerX,
          centerY,
          radius,
          startAngle,
          startAngle + sliceAngle
        );
        canvas.closePath();
        canvas.fillStyle = colors[i];
        canvas.fill();
        startAngle += sliceAngle;
      }

      // Vẽ legend
      const legendStartY = centerY + radius + 40;
      const legendItemHeight = 25;
      canvas.font = "14px Inter";
      for (let i = 0; i < data.length; i++) {
        const y = legendStartY + i * legendItemHeight;
        canvas.fillStyle = colors[i];
        canvas.fillRect(width / 2 - 100, y, 15, 15);
        canvas.fillStyle = "#2D3748";
        canvas.textAlign = "left";
        canvas.fillText(
          `${data[i].name}: ${data[i].value}%`,
          width / 2 - 80,
          y + 12
        );
      }
    }
  }, [timeRange, activeTab]);

  // const topSellingProducts = [
  //   {
  //     id: 1,
  //     name: "Điện thoại X Pro",
  //     category: "Điện tử",
  //     sales: 245,
  //     revenue: "5.635.000.000đ",
  //     growth: "+12.5%",
  //     isPositive: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Laptop Ultra Pro",
  //     category: "Điện tử",
  //     sales: 189,
  //     revenue: "6.615.000.000đ",
  //     growth: "+8.3%",
  //     isPositive: true,
  //   },
  //   {
  //     id: 3,
  //     name: "Tai nghe không dây",
  //     category: "Phụ kiện",
  //     sales: 384,
  //     revenue: "1.152.000.000đ",
  //     growth: "-2.8%",
  //     isPositive: false,
  //   },
  // ];

  // const salesByChannel = [
  //   {
  //     channel: "Website",
  //     percentage: 45,
  //     value: "560.250.000đ",
  //     color: "bg-blue-500",
  //   },
  //   {
  //     channel: "Cửa hàng",
  //     percentage: 30,
  //     value: "373.500.000đ",
  //     color: "bg-green-500",
  //   },
  //   {
  //     channel: "Đại lý",
  //     percentage: 15,
  //     value: "186.750.000đ",
  //     color: "bg-yellow-500",
  //   },
  //   {
  //     channel: "Sàn TMĐT",
  //     percentage: 10,
  //     value: "124.500.000đ",
  //     color: "bg-red-500",
  //   },
  // ];

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold text-textPrimary mb-6">Thống Kê</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "sales"
                ? "gradient-bg text-white"
                : "bg-gray-100 text-textSecondary hover:bg-gray-200"
            } transition-colors`}
          >
            Doanh số
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "inventory"
                ? "gradient-bg text-white"
                : "bg-gray-100 text-textSecondary hover:bg-gray-200"
            } transition-colors`}
          >
            Tồn kho
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "customers"
                ? "gradient-bg text-white"
                : "bg-gray-100 text-textSecondary hover:bg-gray-200"
            } transition-colors`}
          >
            Khách hàng
          </button>
        </div>

        <div className="flex space-x-2"></div>
      </div>

      <div>
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card shadow-card rounded-lg p-6 hover:shadow-hover transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-green-500">
                    +12.5%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-textPrimary">
                  Tổng doanh thu
                </h3>
                <p className="text-2xl font-bold gradient-text">
                  {totalRevenue.toLocaleString("vi-VN") + "đ"}
                </p>
              </div>
            </div>

            <div className="bg-card shadow-card rounded-lg p-6">
              <h3 className="text-lg font-bold text-textPrimary mb-4">
                Biểu đồ doanh thu theo {timeRange}
              </h3>

              <canvas
                ref={salesChartRef}
                style={{ width: "100%", height: "400px" }}
              ></canvas>
            </div>

            {/* <div className="bg-card shadow-card rounded-lg p-6">
              <h3 className="text-lg font-bold text-textPrimary mb-4">
                Sản phẩm bán chạy nhất
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">Sản phẩm</th>
                      <th className="p-2">Doanh số</th>
                      <th className="p-2">Doanh thu</th>
                      <th className="p-2">Tăng trưởng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2 font-medium">{product.name}</td>
                        <td className="p-2">{product.sales}</td>
                        <td className="p-2">{product.revenue}</td>
                        <td
                          className={`p-2 font-semibold ${
                            product.isPositive
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {product.growth}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="bg-card shadow-card rounded-lg p-6">
            <h3 className="text-lg font-bold text-textPrimary mb-4">
              Tỷ lệ tồn kho theo danh mục
            </h3>

            <canvas
              ref={inventoryChartRef}
              style={{ width: "100%", height: "400px" }}
            ></canvas>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="bg-card shadow-card rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-textPrimary">
              Thống kê khách hàng
            </h3>
            <p className="text-textSecondary mt-2">
              Nội dung cho thống kê khách hàng sẽ được hiển thị ở đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
