import React, { useState } from "react";
import {
  updateOrder,
  findNearestShipper,
  deleteOrder,
} from "../../API/orders/ordersApi";
import { updateShipperStatus } from "../../API/shipper/shipperApi";
import OrderDetail from "./OrderDetail";
import { FiClock, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";

// Common Components
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { cn } from '../../utils/cn';

const WAREHOUSE_LAT = 10.8657;
const WAREHOUSE_LNG = 106.619;

const STATUS_FLOW = ["pending", "finding_shipper", "shipping", "delivered"];

const ORDER_STATUS = {
  pending: {
    variant: "warning",
    text: "Chờ xác nhận",
    description: "Đơn hàng đã được tiếp nhận",
  },
  finding_shipper: {
    variant: "info",
    text: "Tìm shipper...",
    description: "Hệ thống đang tìm shipper",
  },
  shipping: {
    variant: "accent",
    text: "Đang giao",
    description: "Đơn hàng đang trên đường giao",
  },
  delivered: {
    variant: "success",
    text: "Đã giao hàng",
    description: "Đã giao thành công",
  },
};

const OrderStatus = ({ orders, loading, onOrderChanged }) => {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const handleCancelOrder = async () => {
    try {
      if (orderToCancel.shipperId) {
        await updateShipperStatus(orderToCancel.shipperId, {
          status: "available",
          currentOrderId: null,
          address: orderToCancel.shippingAddress,
          lat: orderToCancel.shippingLat,
          lng: orderToCancel.shippingLng,
        });
      }
      await deleteOrder(orderToCancel.id);
      if (onOrderChanged) onOrderChanged();
      toast.success("Đã hủy đơn hàng #" + orderToCancel.orderNumber);
    } catch {
      toast.error("Có lỗi khi hủy đơn hàng");
    } finally {
      setIsDeleteModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const handleFindShipper = async (order) => {
    try {
      toast.info("Đang tìm shipper cho đơn #" + order.orderNumber);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await updateOrder(order.id, { status: "finding_shipper" });
      const nearestShipper = await findNearestShipper(WAREHOUSE_LAT, WAREHOUSE_LNG);

      if (nearestShipper) {
        await Promise.all([
          updateOrder(order.id, {
            status: "shipping",
            shippedAt: new Date().toISOString(),
            shipperId: nearestShipper.id,
          }),
          updateShipperStatus(nearestShipper.id, {
            status: "delivering",
            currentOrderId: order.id,
            address: "Kho hàng",
            lat: WAREHOUSE_LAT,
            lng: WAREHOUSE_LNG,
          }),
        ]);
        toast.success(`Đã gán shipper ${nearestShipper.name} cho đơn #${order.orderNumber}`);
        if (onOrderChanged) onOrderChanged();
      } else {
        await updateOrder(order.id, { status: "pending" });
        toast.warning("Không tìm thấy shipper nào sẵn sàng.");
        if (onOrderChanged) onOrderChanged();
      }
    } catch {
      toast.error("Có lỗi khi tìm shipper");
      await updateOrder(order.id, { status: "pending" });
      if (onOrderChanged) onOrderChanged();
    }
  };

  const handleConfirmDelivery = async (order) => {
    try {
      await Promise.all([
        updateOrder(order.id, { status: "delivered", deliveredAt: new Date().toISOString() }),
        order.shipperId && updateShipperStatus(order.shipperId, {
          status: "available",
          currentOrderId: null,
          address: order.shippingAddress,
          lat: order.shippingLat,
          lng: order.shippingLng,
        }),
      ]);
      toast.success(`Đã giao hàng thành công đơn #${order.orderNumber}`);
      if (onOrderChanged) onOrderChanged();
    } catch {
      toast.error("Lỗi xác nhận giao hàng");
    }
  };

  const renderShipperInfo = (order) => {
    if (!order.shipperId || !order.shipper) return null;
    return (
      <div className="mt-2 p-2 bg-bg-subtle dark:bg-white/5 rounded-lg border border-border/40 dark:border-dark-border/40 transition-colors">
        <div className="flex items-center text-[11px] font-bold">
          <span className="text-text-tertiary mr-2 uppercase tracking-tighter">Shipper:</span>
          <span className="text-primary mr-2">{order.shipper.name}</span>
          <span className="text-text-secondary">{order.shipper.phoneNumber}</span>
        </div>
      </div>
    );
  };

  const renderActionButtons = (order) => {
    const canCancel = ["pending", "finding_shipper"].includes(order.status);
    return (
      <>
        {order.status === "pending" && (
          <Button size="sm" onClick={() => handleFindShipper(order)} className="text-[11px] rounded-xl h-9 px-4">Tìm shipper</Button>
        )}
        {order.status === "shipping" && (
          <Button size="sm" variant="success" onClick={() => handleConfirmDelivery(order)} className="text-[11px] rounded-xl h-9 px-4">Xác nhận giao</Button>
        )}
        {canCancel && (
          <Button size="sm" variant="danger" onClick={() => { setOrderToCancel(order); setIsDeleteModalOpen(true); }} className="text-[11px] rounded-xl h-9 px-4">Hủy đơn</Button>
        )}
      </>
    );
  };

  const renderTimeline = (order) => {
    const steps = ["pending", "finding_shipper", "shipping", "delivered"];
    const currentIndex = steps.indexOf(order.status);
    return (
      <div className="relative mt-4 mb-2">
        <div className="flex items-start">
          <div className="flex flex-col items-center mr-3 pt-1">
            {steps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              return (
                <React.Fragment key={step}>
                  <div className={cn("w-3 h-3 rounded-full border-2 transition-all duration-500", isCompleted ? "bg-primary border-primary shadow-sm shadow-primary/30" : "bg-white dark:bg-dark-card border-border dark:border-dark-border")}></div>
                  {index < steps.length - 1 && (
                    <div className={cn("w-0.5 h-8 my-0.5 transition-all duration-500", isCompleted ? "bg-primary" : "bg-border dark:bg-dark-border/60")}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="flex-1 space-y-4">
            {steps.map((step) => {
              const stepInfo = ORDER_STATUS[step] || {};
              const isActive = steps.indexOf(step) <= currentIndex;
              return (
                <div key={step} className="h-8 flex flex-col justify-center">
                  <h5 className={cn("text-[11px] font-black leading-tight tracking-tight uppercase transition-colors", isActive ? "text-primary" : "text-text-tertiary")}>
                    {stepInfo.text || step}
                  </h5>
                  <p className="text-[10px] text-text-tertiary font-bold truncate opacity-70 italic">{stepInfo.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const filteredOrders =
    filter === "all"
      ? orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled")
      : orders.filter((o) => o.status === filter && o.status !== "delivered" && o.status !== "cancelled");

  return (
    <Card 
      title="Tiến trình đơn hàng"
      noPadding
      className="shadow-soft-xl border-border/50 dark:border-dark-border/40"
      extra={
        <div className="flex bg-bg-subtle dark:bg-white/5 p-1 rounded-2xl border border-border/40 dark:border-dark-border/40 backdrop-blur-sm scale-90 origin-right transition-all">
            {["all", ...STATUS_FLOW].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black rounded-xl transition-all duration-300 whitespace-nowrap uppercase tracking-widest",
                  filter === status 
                    ? "bg-white dark:bg-dark-card text-primary shadow-soft-md scale-[1.05]" 
                    : "text-text-tertiary hover:text-text-primary"
                )}
              >
                {status === "all" ? "Tất cả" : ORDER_STATUS[status]?.text || status}
              </button>
            ))}
        </div>
      }
    >
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Đang cập nhật tiến trình...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
             <FiClock size={64} className="mb-4" />
             <p className="text-xs font-black uppercase tracking-widest">Hiện tại không có đơn hàng cần xử lý</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredOrders.map((order) => {
              const statusInfo = ORDER_STATUS[order.status] || { variant: "neutral", text: "Không xác định", description: "" };
              return (
                <div key={order.id} className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-border/50 dark:border-dark-border/40 p-6 hover:shadow-soft-2xl transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-x-3">
                        <h4 className="text-sm font-black text-text-primary uppercase tracking-tighter">#{order.orderNumber}</h4>
                        <Badge variant={statusInfo.variant} size="sm" className="uppercase tracking-widest">{statusInfo.text}</Badge>
                      </div>
                      <div className="flex items-center text-[10px] text-text-tertiary font-bold uppercase tracking-wider">
                         <FiCalendar className="mr-1.5 text-primary/60" /> {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary tracking-tighter leading-none">{order.total?.toLocaleString()}đ</p>
                      <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-1.5 italic">{order.items?.length || 0} sản phẩm</p>
                    </div>
                  </div>

                  <div className="bg-bg-subtle/30 dark:bg-white/[0.01] rounded-3xl p-5 border border-border/30 dark:border-dark-border/30 relative z-10 transition-colors">
                     {renderTimeline(order)}
                     {renderShipperInfo(order)}
                  </div>

                  <div className="flex justify-end items-center gap-x-2 mt-6 pt-5 border-t border-border/30 dark:border-dark-border/30 relative z-10">
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest h-9 px-5 rounded-xl" onClick={() => setSelectedOrder(order)}>Chi tiết</Button>
                    {renderActionButtons(order)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleCancelOrder}
        title="Xác nhận hủy"
        message={`Hủy đơn #${orderToCancel?.orderNumber}?`}
        confirmText="Hủy đơn"
      />
    </Card>
  );
};
export default OrderStatus;
