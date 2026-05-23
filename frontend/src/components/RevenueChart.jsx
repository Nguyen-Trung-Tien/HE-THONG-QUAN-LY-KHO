import React, { useEffect, useRef, useState } from "react";
import { fetchRevenueByPeriod } from "../API/statistics/statisticsAPI";
import Badge from "./common/Badge.jsx";
import { cn } from "../utils/cn";

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

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState("year");
  const chartRef = useRef(null);
  const [revenueData, setRevenueData] = useState([]);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

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
      const isDarkMode = document.documentElement.classList.contains('dark');
      const canvas = chartRef.current;
      const ctx = canvas.getContext("2d");

      // Sync sizes
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const data = revenueData.length
        ? revenueData.map((item) => Number(item.revenue) || 0)
        : [10, 59, 80, 81, 56, 55, 40, 84, 64, 120, 132, 91];
      const labels = revenueData.length
        ? revenueData.map((item) => {
            const m = item.period.split("-")[1];
            return "T" + Number(m);
          })
        : ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

      const maxValue = niceNumber(Math.max(...data, 1));
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const pointSpacing = chartWidth / (data.length - 1);

      ctx.clearRect(0, 0, width, height);

      // Grid Colors
      const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(226, 232, 240, 0.5)";
      const textColor = isDarkMode ? "#94A3B8" : "#718096";
      const primaryColor = "#38BDF8";

      // Draw Axis
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.strokeStyle = gridColor;
      ctx.stroke();

      // Horizontal Grid
      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
      }
      ctx.strokeStyle = gridColor;
      ctx.stroke();

      // Area Fill
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      for (let i = 0; i < data.length; i++) {
        const x = padding + i * pointSpacing;
        const y = height - padding - (data[i] / maxValue) * chartHeight;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width - padding, height - padding);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, "rgba(56, 189, 248, 0.1)");
      gradient.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line chart
      ctx.beginPath();
      ctx.moveTo(padding, height - padding - (data[0] / maxValue) * chartHeight);
      for (let i = 1; i < data.length; i++) {
        const x = padding + i * pointSpacing;
        const y = height - padding - (data[i] / maxValue) * chartHeight;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.stroke();

      // Dots
      for (let i = 0; i < data.length; i++) {
        const x = padding + i * pointSpacing;
        const y = height - padding - (data[i] / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode ? "#0F172A" : "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Labels X
      ctx.fillStyle = textColor;
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "center";
      for (let i = 0; i < labels.length; i++) {
        const x = padding + i * pointSpacing;
        ctx.fillText(labels[i], x, height - padding + 20);
      }

      // Labels Y
      ctx.textAlign = "right";
      for (let i = 0; i <= 5; i++) {
        const value = maxValue * (1 - i / 5);
        const y = padding + (chartHeight / 5) * i;
        const valueTrieu = value / 1_000_000;

        ctx.fillText(
          valueTrieu >= 1
            ? valueTrieu.toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + "tr"
            : Math.round(value / 1_000).toLocaleString("vi-VN") + "k",
          padding - 10,
          y + 4
        );
      }
    }
  }, [timeRange, revenueData, isDark]);

  return (
    <div className="bg-white dark:bg-dark-card shadow-soft-xl rounded-[2.5rem] border border-border/40 dark:border-dark-border/40 p-8 mb-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <Badge variant="primary" className="mb-1">Tài chính</Badge>
           <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">
             Doanh thu theo tháng
           </h3>
        </div>
        <div className="flex bg-bg-subtle dark:bg-white/5 p-1 rounded-2xl border border-border/40 dark:border-dark-border/40 backdrop-blur-sm">
          <button
            onClick={() => setTimeRange("year")}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              timeRange === "year"
                ? "bg-white dark:bg-dark-card text-primary shadow-soft-md scale-[1.05]"
                : "text-text-tertiary hover:text-text-primary"
            )}
          >
            Năm nay
          </button>
          <button
            onClick={() => setTimeRange("lastYear")}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              timeRange === "lastYear"
                ? "bg-white dark:bg-dark-card text-primary shadow-soft-md scale-[1.05]"
                : "text-text-tertiary hover:text-text-primary"
            )}
          >
            Năm trước
          </button>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <canvas
          ref={chartRef}
          className="w-full h-full"
        ></canvas>
      </div>
    </div>
  );
};

export default RevenueChart;
