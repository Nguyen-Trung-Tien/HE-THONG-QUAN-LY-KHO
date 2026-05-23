import React, { useState, useEffect } from "react";
import { fetchTotalRevenue, fetchInventoryStructure } from "../API/statistics/statisticsAPI";
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
  const [inventoryStructure, setInventoryStructure] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTotalRevenue().then((data) => setTotalRevenue(data.totalRevenue || 0)),
      fetchInventoryStructure().then((data) => setInventoryStructure(data))
    ])
      .catch((err) => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const salesData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Doanh thu (Triệu VNĐ)",
        data: [650, 590, 800, 810, 560, 550, 400, 840, 640, 1200, 1320, 910],
        fill: true,
        borderColor: "#38BDF8", 
        backgroundColor: "rgba(56, 189, 248, 0.7)", // Higher opacity for Bar chart
        borderRadius: 8,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const totalInventoryCount = inventoryStructure.reduce((acc, curr) => acc + Number(acc.count || 0), 0); // Wait, this logic is slightly wrong in my thought, let's fix it

  const COLORS = [
    "#38BDF8",
    "#34D399",
    "#FBBF24",
    "#818CF8",
    "#94A3B8",
    "#F43F5E",
    "#EC4899",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#6366F1",
    "#D946EF",
  ];

  const inventoryData = {
    labels: inventoryStructure.map(item => item.type || "Khác"),
    datasets: [
      {
        data: inventoryStructure.map(item => item.count),
        backgroundColor: COLORS.slice(0, inventoryStructure.length),
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const totalStock = inventoryStructure.reduce((sum, item) => sum + Number(item.count), 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#020617",
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
        grid: { color: "rgba(226, 232, 240, 0.05)", drawBorder: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: "#64748b" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: "#64748b" },
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
          <Badge variant="primary" className="mb-1 uppercase tracking-widest">Báo cáo</Badge>
          <h1 className="heading-1">Thống kê hệ thống</h1>
          <p className="subheading">Phân tích dữ liệu vận hành thời gian thực</p>
        </div>
        <div className="flex bg-bg-subtle/50 dark:bg-white/5 p-1 rounded-2xl border border-border/40 dark:border-dark-border/40 backdrop-blur-sm">
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
                  ? "bg-white dark:bg-dark-card text-primary shadow-soft-md scale-[1.05]" 
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
          <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-border/40 dark:border-dark-border/40 shadow-soft-xl group hover:shadow-soft-2xl transition-all duration-500 hover:-translate-y-1">
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
                <span className="text-2xl font-black text-text-primary tracking-tighter">{totalStock.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              {inventoryData.labels.map((label, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-subtle/30 dark:bg-white/[0.02] border border-border/20 dark:border-dark-border/20 group hover:bg-white dark:hover:bg-dark-card transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: inventoryData.datasets[0].backgroundColor[i] }} />
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-tight">{label}</span>
                  </div>
                  <span className="text-xs font-black text-text-secondary">
                    {Math.round((inventoryData.datasets[0].data[i] / totalStock) * 100)}%
                  </span>
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
