import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { useTranslation } from "../i18n/useTranslation";

// Common Components
import Card from './common/Card';
import Badge from './common/Badge';
import { cn } from '../utils/cn';

function Dashboard() {
  const { t } = useTranslation();
  const userRole = useSelector((state) => state.user.role);
  const isAdminOrDev = userRole === "admin" || userRole === "dev";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">Smart WMS v3.0</Badge>
          <h1 className="text-2xl font-black text-text-primary dark:text-dark-text-primary tracking-tighter uppercase">
            {t('dashboard')}
          </h1>
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 font-semibold italic opacity-80">
            Smart Warehouse Management System
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black text-text-secondary dark:text-dark-text-tertiary bg-white/70 dark:bg-dark-card/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-border/50 dark:border-white/5 transition-all hover:scale-105">
          <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="tracking-tight uppercase">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockAlert />
        <ExpiryAlert />
      </div>

      <DashboardCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isAdminOrDev && (
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
        )}
        <div className={cn("space-y-6", !isAdminOrDev && "lg:col-span-3")}>
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  const isAdminOrDev = userRole === "admin" || userRole === "dev";

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
    isAdminOrDev && {
      title: t('total_revenue'),
      value: totalRevenue.toLocaleString("vi-VN") + "đ",
      change: "12.5%",
      isPositive: true,
      variant: "primary",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: "/",
    },
    {
      title: t('orders'),
      value: allOrders,
      change: "8.2%",
      isPositive: true,
      variant: "success",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      path: "/orders",
    },
    {
      title: t('inventory'),
      value: allStock,
      change: "2.4%",
      isPositive: false,
      variant: "warning",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      path: "/inventory",
    },
    {
      title: t('customers'),
      value: allCustomers,
      change: "15.3%",
      isPositive: true,
      variant: "accent",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: "/customer",
    },
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          onClick={() => navigate(stat.path)}
          className="group cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95"
        >
          <div className={cn(
            "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20",
            stat.variant === 'primary' && "bg-primary",
            stat.variant === 'success' && "bg-success",
            stat.variant === 'warning' && "bg-warning",
            stat.variant === 'accent' && "bg-accent",
          )}></div>
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-6 text-white scale-90",
              stat.variant === 'primary' && "bg-primary shadow-primary/30",
              stat.variant === 'success' && "bg-success shadow-success/30",
              stat.variant === 'warning' && "bg-warning shadow-warning/30",
              stat.variant === 'accent' && "bg-accent shadow-accent/30",
            )}>
              {stat.icon}
            </div>
            <Badge 
              variant={stat.isPositive ? "success" : "error"} 
              size="sm"
            >
              {stat.isPositive ? '+' : '-'}{stat.change}
            </Badge>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-[0.15em] mb-1">
              {stat.title}
            </h3>
            <p className="text-xl font-black text-text-primary dark:text-dark-text-primary tracking-tighter truncate leading-none">
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Dashboard;
