import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RevenueChart from "./RevenueChart";
import TopProducts from "./TopProducts";
import LowStockAlert from "./LowStockAlert";
import ExpiryAlert from "./ExpiryAlert";
import DeadstockReport from "./DeadstockReport";
import {
  fetchTotalRevenue,
  fetchAllOrders,
  fetchAllStock,
  fetchAllCustomers,
} from "../API/statistics/statisticsAPI";

// Common Components
import Card from './common/Card';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Tổng quan</h1>
          <p className="text-textSecondary mt-1">Chào mừng bạn quay trở lại! Đây là tóm tắt hoạt động của kho.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-textSecondary bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockAlert />
        <ExpiryAlert />
      </div>

      <DashboardCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="space-y-6">
           <TopProducts />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DeadstockReport />
      </div>
    </div>
  );
}

function DashboardCards() {
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [allOrders, setAllOrders] = useState(0);
  const [allStock, setAllStock] = useState(0);
  const [allCustomers, setAllCustomers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rev, ord, stoc, cust] = await Promise.all([
          fetchTotalRevenue(),
          fetchAllOrders(),
          fetchAllStock(),
          fetchAllCustomers()
        ]);
        setTotalRevenue(rev.totalRevenue || 0);
        setAllOrders(ord || 0);
        setAllStock(stoc || 0);
        setAllCustomers(cust || 0);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: totalRevenue.toLocaleString("vi-VN") + "đ",
      change: "+12.5%",
      isPositive: true,
      color: "blue",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: "/",
    },
    {
      title: "Đơn hàng",
      value: allOrders,
      change: "+8.2%",
      isPositive: true,
      color: "green",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      path: "/orders",
    },
    {
      title: "Sản phẩm tồn kho",
      value: allStock,
      change: "-2.4%",
      isPositive: false,
      color: "orange",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      path: "/inventory",
    },
    {
      title: "Khách hàng mới",
      value: allCustomers,
      change: "+15.3%",
      isPositive: true,
      color: "purple",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: "/customer",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          onClick={() => navigate(stat.path)}
          className="group bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative"
        >
          <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-500 bg-current`} style={{ color: stat.isPositive ? '#10B981' : '#EF4444' }}></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 
              ${index === 0 ? 'bg-blue-500 shadow-blue-200' : ''}
              ${index === 1 ? 'bg-green-500 shadow-green-200' : ''}
              ${index === 2 ? 'bg-orange-500 shadow-orange-200' : ''}
              ${index === 3 ? 'bg-purple-500 shadow-purple-200' : ''}
              text-white`}>
              {stat.icon}
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {stat.isPositive ? (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              ) : (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              )}
              {stat.change}
            </div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider">
              {stat.title}
            </h3>
            <p className="text-2xl font-black text-textPrimary mt-1 truncate">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
