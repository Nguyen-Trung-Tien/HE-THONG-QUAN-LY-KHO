import React, { useEffect, useState } from "react";
import { fetchDeadstockReport } from "../API/statistics/statisticsAPI";
import { useNavigate } from "react-router-dom";
import Card from "./common/Card";
import Badge from "./common/Badge";
import Button from "./common/Button";
import { FiAlertCircle, FiClock, FiArrowRight, FiPackage } from "react-icons/fi";
import { cn } from "../utils/cn";

function DeadstockReport() {
  const [deadstockItems, setDeadstockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchDeadstockReport(months);
        setDeadstockItems(data || []);
      } catch (error) {
        console.error("Lỗi khi tải báo cáo hàng tồn lâu ngày:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [months]);

  return (
    <Card 
      title="Hàng tồn kho lâu ngày (Deadstock)" 
      className="mb-8 shadow-soft-xl"
      extra={
        <div className="flex items-center space-x-3 scale-90 sm:scale-100">
            <span className="hidden sm:inline text-[9px] font-black text-text-tertiary uppercase tracking-widest">Thời gian:</span>
            <select
              className="bg-bg-subtle dark:bg-white/5 border border-border/40 dark:border-dark-border/40 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-inner-sm"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            >
              <option value={1}>1 tháng qua</option>
              <option value={3}>3 tháng qua</option>
              <option value={6}>6 tháng qua</option>
              <option value={12}>1 năm qua</option>
            </select>
        </div>
      }
      noPadding
    >
      <div className="p-0">
        <div className="px-8 py-4 bg-bg-subtle/20 dark:bg-white/[0.01] border-b border-border/40 dark:border-dark-border/40">
           <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Danh sách sản phẩm không có giao dịch xuất hàng trong {months} tháng qua</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Đang phân tích dữ liệu...</p>
          </div>
        ) : deadstockItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 rounded-[2rem] bg-success/10 flex items-center justify-center text-success mb-4 shadow-inner-sm">
               <FiPackage size={32} />
            </div>
            <p className="text-xs font-black text-text-primary uppercase tracking-widest">Tuyệt vời! Hệ thống ổn định</p>
            <p className="text-[10px] text-text-tertiary font-bold mt-1 uppercase">Không có sản phẩm nào bị tồn kho quá {months} tháng.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-bg-subtle/50 dark:from-white/[0.01] to-white dark:to-dark-card">
                    {["Sản phẩm", "Mã SP", "Tồn kho", "Giá trị ước tính", "Hành động"].map((h, i) => (
                      <th key={i} className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-widest border-b border-border/30 dark:border-dark-border/40">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 dark:divide-dark-border/40">
                  {deadstockItems.slice(0, 5).map((item) => (
                    <tr key={item.id} className="group hover:bg-error/5 dark:hover:bg-error/10 transition-all duration-300">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-xs font-black text-text-primary uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">#{item.productId || item.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="error" size="sm" className="font-black">{item.stock}</Badge>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-black text-primary tracking-tighter">
                          {((item.stock || 0) * (Number(item.price) || 0)).toLocaleString("vi-VN")}đ
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <Button 
                          variant="ghost" 
                          size="xs"
                          className="rounded-lg text-primary hover:bg-primary/10"
                          onClick={() => navigate('/inventory')}
                          rightIcon={<FiArrowRight />}
                        >
                          Xử lý
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {deadstockItems.length > 5 && (
              <div className="p-6 border-t border-border/40 dark:border-dark-border/40 text-center">
                <button
                  onClick={() => navigate('/inventory')}
                  className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-accent transition-colors flex items-center justify-center mx-auto group"
                >
                  Xem tất cả {deadstockItems.length} sản phẩm 
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

export default DeadstockReport;
