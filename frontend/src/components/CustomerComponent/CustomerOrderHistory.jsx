import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../API/orders/ordersApi";
import OrderDetail from "../OrderComponent/OrderDetail";

import Badge from "../common/Badge";
import Card from "../common/Card";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { FiClock, FiPackage, FiSearch } from "react-icons/fi";

function CustomerOrderHistory({ customerId, onClose }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await getAllOrders();
      setOrders(allOrders.filter((o) => o.customerId === customerId));
    };
    fetchOrders();
  }, [customerId]);

  const STATUS_MAP = {
    pending: { text: "Chờ xác nhận", variant: "warning" },
    finding_shipper: { text: "Đang tìm shipper", variant: "info" },
    shipping: { text: "Đang giao", variant: "primary" },
    delivered: { text: "Đã giao", variant: "success" },
    cancelled: { text: "Đã hủy", variant: "error" },
  };

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Lịch sử đơn hàng"
      size="lg"
    >
        <div className="flex-1 overflow-auto custom-scrollbar pr-2">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
              <FiPackage size={64} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">Khách hàng chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = STATUS_MAP[order.status] || { 
                  text: order.status, 
                  variant: "neutral" 
                };
                
                return (
                  <div 
                    key={order.id} 
                    className="grid grid-cols-12 gap-4 p-5 rounded-2xl border border-border/40 dark:border-dark-border/40 bg-bg-subtle/30 dark:bg-white/[0.01] hover:bg-white dark:hover:bg-dark-card transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="col-span-12 sm:col-span-3 flex items-center space-x-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner-sm">
                        <FiPackage />
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-primary uppercase tracking-tighter">#{order.orderNumber}</p>
                        <p className="text-[10px] text-text-tertiary font-bold flex items-center">
                          <FiClock className="mr-1" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3 flex items-center">
                      <Badge variant={status.variant} size="sm">
                        {status.text}
                      </Badge>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3 flex items-center text-right sm:text-left">
                      <p className="text-sm font-black text-text-primary tracking-tight">
                        {order.total?.toLocaleString()}đ
                      </p>
                    </div>
                    
                    <div className="col-span-12 sm:col-span-3 flex items-center justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        leftIcon={<FiSearch />}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
    </Modal>
  );
}

export default CustomerOrderHistory;