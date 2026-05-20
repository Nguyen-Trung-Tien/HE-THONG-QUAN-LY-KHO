import React from "react";
import { useEffect, useRef, useState } from "react";
import { fetchRevenueByPeriod } from "../API/statistics/statisticsAPI";
function niceNumber(value) {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;

  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;

  return niceFraction * Math.pow(10, exponent);
}
function RevenueChart() {
  const [timeRange, setTimeRange] = useState("year");
  const chartRef = useRef(null);
  const [revenueData, setRevenueData] = useState([]);
  useEffect(() => {
    let mounted = true;
    fetchRevenueByPeriod(timeRange).then((data) => {
      if (mounted) setRevenueData(data);
    });
    return () => {
      mounted = false;
    };
  }, [timeRange]);
  useEffect(() => {
    if (chartRef.current) {
      const canvas = chartRef.current;
      const ctx = canvas.getContext("2d");

      // đồng bộ kích thước thật
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const width = canvas.width;
      const height = canvas.height;
      const data = revenueData.length
        ? revenueData.map((item) => Number(item.revenue) || 0)
        : [10, 59, 80, 81, 56, 55, 40, 84, 64, 120, 132, 91];
      const labels = revenueData.length
        ? revenueData.map((item) => {
            // Hiển thị "T1", "T2", ... từ period "2024-01"
            const m = item.period.split("-")[1];
            return "T" + Number(m);
          })
        : [
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

      const maxValue = niceNumber(Math.max(...data, 1));
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const pointSpacing = chartWidth / (data.length - 1);
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Vẽ trục
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.strokeStyle = "#E2E8F0";
      ctx.stroke();

      // Lưới ngang
      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
      }
      ctx.strokeStyle = "rgba(226, 232, 240, 0.5)";
      ctx.stroke();

      // Line chart
      ctx.beginPath();
      ctx.moveTo(
        padding,
        height - padding - (data[0] / maxValue) * chartHeight
      );
      for (let i = 1; i < data.length; i++) {
        const x = padding + i * pointSpacing;
        const y = height - padding - (data[i] / maxValue) * chartHeight;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#00BFFF";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Chấm tròn
      for (let i = 0; i < data.length; i++) {
        const x = padding + i * pointSpacing;
        const y = height - padding - (data[i] / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#00BFFF";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Nhãn tháng
      ctx.fillStyle = "#718096";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      for (let i = 0; i < labels.length; i++) {
        const x = padding + i * pointSpacing;
        ctx.fillText(labels[i], x, height - padding + 20);
      }

      // Nhãn trục Y
      ctx.textAlign = "right";
      for (let i = 0; i <= 5; i++) {
        const value = maxValue * (1 - i / 5);
        const y = padding + (chartHeight / 5) * i;
        const valueTrieu = value / 1_000_000;

        ctx.fillText(
          valueTrieu >= 1
            ? valueTrieu.toLocaleString("vi-VN", { maximumFractionDigits: 1 }) +
                "tr"
            : Math.round(value / 1_000).toLocaleString("vi-VN") + "k",
          padding - 10,
          y + 4
        );
      }
    }
  }, [timeRange, revenueData]);

  return (
    <div className="bg-card shadow-card rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-textPrimary">
          Doanh thu theo tháng
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("year")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "year"
                ? "gradient-bg text-white"
                : "bg-gray-100 text-textSecondary hover:bg-gray-200"
            } transition-colors`}
          >
            Năm nay
          </button>
          <button
            onClick={() => setTimeRange("lastYear")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "lastYear"
                ? "gradient-bg text-white"
                : "bg-gray-100 text-textSecondary hover:bg-gray-200"
            } transition-colors`}
          >
            Năm trước
          </button>
        </div>
      </div>
      <div className="h-80">
        <canvas
          ref={chartRef}
          style={{ width: "100%", height: "100%" }}
        ></canvas>
      </div>
    </div>
  );
}

export default RevenueChart;
