import React, { useEffect, useState } from "react";
import { getExpiryAlerts } from "../API/stock/stockAPI";
import { useNavigate } from "react-router-dom";

function ExpiryAlert() {
  const [alerts, setAlerts] = useState({ expiring: [], expired: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getExpiryAlerts(30);
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching expiry alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return null;
  if (alerts.expiring.length === 0 && alerts.expired.length === 0) return null;

  return (
    <div className="mb-8 bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-bold text-orange-700 dark:text-orange-400">Cảnh báo hạn sử dụng!</h2>
        </div>
        <button 
          onClick={() => navigate('/stock')}
          className="text-sm font-medium text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 underline"
        >
          Xem kho hàng
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.expired.slice(0, 3).map((item) => (
          <div key={`expired-${item.id}`} className="bg-white dark:bg-dark-card p-3 rounded shadow-sm border border-red-200 dark:border-red-900/30 flex justify-between items-center">
            <div>
              <p className="font-semibold text-text-primary">{item.product?.name || 'Sản phẩm'}</p>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">Lô: {item.batchNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">Đã Hết Hạn</p>
              <p className="text-xs text-text-tertiary">{new Date(item.expiryDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {alerts.expiring.slice(0, 3).map((item) => (
          <div key={`expiring-${item.id}`} className="bg-white dark:bg-dark-card p-3 rounded shadow-sm border border-orange-200 dark:border-orange-900/30 flex justify-between items-center">
            <div>
              <p className="font-semibold text-text-primary">{item.product?.name || 'Sản phẩm'}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Lô: {item.batchNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">SL: {item.quantity}</p>
              <p className="text-xs text-text-tertiary">HSD: {new Date(item.expiryDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      {alerts.expired.length + alerts.expiring.length > 6 && (
        <p className="text-xs text-orange-500 dark:text-orange-400 mt-2 italic">* Và nhiều lô hàng khác cần chú ý...</p>
      )}
    </div>
  );
}

export default ExpiryAlert;
