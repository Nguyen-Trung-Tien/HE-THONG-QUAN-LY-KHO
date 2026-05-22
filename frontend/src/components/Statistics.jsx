import React, { useState, useEffect } from "react";
import { fetchTotalRevenue } from "../API/statistics/statisticsAPI";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import Card from "./common/Card";
import Badge from "./common/Badge";
import { FiTrendingUp, FiBox, FiUsers, FiDollarSign, FiCalendar } from "react-icons/fi";
import { cn } from "../utils/cn";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Statistics = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTotalRevenue()
      .then((data) => setTotalRevenue(data.totalRevenue || 0))
      .catch(() => setTotalRevenue(0))
      .finally(() => setLoading(false));
  }, []);

  const salesData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Doanh thu (Triệu VNĐ)",
        data: [650, 590, 800, 810, 560, 550, 400, 840, 640, 1200, 1320, 910],
        fill: true,
        borderColor: "#00BFFF",
        backgroundColor: "rgba(0, 191, 255, 0.05)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const inventoryData = {
    labels: ["Điện tử", "Lương thực", "Gia dụng", "May mặc", "Khác"],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "#00BFFF",
          "#10B981",
          "#F59E0B",
          "#6366F1",
          "#94A3B8",
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        titleFont: { size: 10, weight: 'black' },
        bodyFont: { size: 12, weight: 'bold' },
        cornerRadius: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(226, 232, 240, 0.5)", drawBorder: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: "#94a3b8" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: "#94a3b8" },
      },
    },
  };

  const stats = [
    { label: "Tổng doanh thu", value: `${totalRevenue.toLocaleString()}đ`, icon: <FiDollarSign />, color: "text-primary", bg: "bg-primary/10", trend: "+12.5%" },
    { label: "Sản phẩm xuất kho", value: "2,450", icon: <FiBox />, color: "text-success", bg: "bg-success/10", trend: "+8.2%" },
    { label: "Khách hàng mới", value: "128", icon: <FiUsers />, color: "text-info", bg: "bg-info/10", trend: "+24%" },
    { label: "Hiệu suất vận hành", value: "98.5%", icon: <FiTrendingUp />, color: "text-warning", bg: "bg-warning/10", trend: "+1.2%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-1">Báo cáo</Badge>
          <h1 className="text-xl font-black text-text-primary tracking-tighter uppercase leading-none">Thống kê hệ thống</h1>
          <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider mt-1">Phân tích dữ liệu vận hành thời gian thực</p>
        </div>
        <div className="flex bg-bg-subtle/50 p-1 rounded-2xl border border-border/40 backdrop-blur-sm">
          {[
            { id: 'sales', label: 'Doanh số', icon: <FiDollarSign /> },
            { id: 'inventory', label: 'Tồn kho', icon: <FiBox /> },
            { id: 'customers', label: 'Khách hàng', icon: <FiUsers /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-white text-primary shadow-soft-md scale-[1.05]" 
                  : "text-text-tertiary hover:text-text-primary"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-border/40 shadow-soft-xl group hover:shadow-soft-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <Badge variant="success" className="bg-success/5 text-success border-success/10">{stat.trend}</Badge>
            </div>
            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-text-primary tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <Card title="Biểu đồ tăng trưởng" extra={<FiCalendar className="text-primary" />}>
            <div className="h-[400px] w-full pt-4">
              {activeTab === 'sales' ? (
                <Line data={salesData} options={chartOptions} />
              ) : activeTab === 'inventory' ? (
                <Bar data={salesData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center opacity-30">
                  <p className="text-xs font-black uppercase tracking-widest text-center">Dữ liệu khách hàng đang được xử lý...</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Side Chart / Legend */}
        <div className="relative h-full">
          <Card title="Cơ cấu hàng hóa" className="h-full">
            <div className="h-[280px] w-full flex items-center justify-center py-6 relative">
              <Doughnut 
                data={inventoryData} 
                options={{
                  ...chartOptions,
                  cutout: '75%',
                  plugins: { legend: { display: false } }
                }} 
              />
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Tổng kho</span>
                <span className="text-2xl font-black text-text-primary tracking-tighter">8,540</span>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              {inventoryData.labels.map((label, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-subtle/30 border border-border/20 group hover:bg-white transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: inventoryData.datasets[0].backgroundColor[i] }} />
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-tight">{label}</span>
                  </div>
                  <span className="text-xs font-black text-text-secondary">{inventoryData.datasets[0].data[i]}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
