import React, { useState, useCallback,useEffect } from "react";
import { getAllOrders } from "../../API/orders/ordersApi";
import OrderTable from "./OrderTable";
import OrderStatus from "./OrderStatus";
import OrderWizard from "./OrderWizard";
import Badge from "../common/Badge";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderChanged = () => {
    fetchOrders();
  };

  return (
    <div className='space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500'>
      <div>
        <Badge variant="primary" className="mb-1">Giao dịch</Badge>
        <h1 className='text-xl font-black text-text-primary tracking-tighter'>
          Quản lý đơn hàng
        </h1>
        <p className="text-[10px] text-text-secondary font-semibold">Theo dõi và xử lý các đơn hàng</p>
      </div>

      {!showWizard && (
        <OrderTable
          orders={orders}
          loading={loading}
          onCreateOrder={() => setShowWizard(true)}
          onOrderChanged={handleOrderChanged}
        />
      )}
      {showWizard && (
        <OrderWizard
          onOrderCreated={() => {
            setShowWizard(false);
            fetchOrders();
          }}
        />
      )}

      <OrderStatus
        orders={orders}
        loading={loading}
        onOrderChanged={handleOrderChanged}
      />
    </div>
  );
}

export default Orders;