import React, { useState } from "react";
import {
  updateOrder,
  findNearestShipper,
  deleteOrder,
} from "../../API/orders/ordersApi";
import { updateShipperStatus } from "../../API/shipper/shipperApi";
import OrderDetail from "./OrderDetail";
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
      <div className="mt-2 p-2 bg-bg-subtle rounded-lg border border-border/40">
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
          <Button size="sm" onClick={() => handleFindShipper(order)} className="text-[11px]">Tìm shipper</Button>
        )}
        {order.status === "shipping" && (
          <Button size="sm" variant="success" onClick={() => handleConfirmDelivery(order)} className="text-[11px]">Xác nhận giao</Button>
        )}
        {canCancel && (
          <Button size="sm" variant="danger" onClick={() => { setOrderToCancel(order); setIsDeleteModalOpen(true); }} className="text-[11px]">Hủy đơn</Button>
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
                  <div className={cn("w-3 h-3 rounded-full border-2", isCompleted ? "bg-primary border-primary" : "bg-white border-border")}></div>
                  {index < steps.length - 1 && (
                    <div className={cn("w-0.5 h-8 my-0.5", isCompleted ? "bg-primary" : "bg-border")}></div>
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
                  <h5 className={cn("text-[11px] font-black leading-tight tracking-tight", isActive ? "text-primary" : "text-text-tertiary")}>
                    {stepInfo.text || step}
                  </h5>
                  <p className="text-[10px] text-text-tertiary truncate">{stepInfo.description}</p>
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
      className="shadow-soft-xl border-border/50"
      extra={
        <div className="flex bg-bg-subtle p-0.5 rounded-lg border border-border/50 scale-90">
            {["all", ...STATUS_FLOW].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-3 py-1 text-[10px] font-black rounded-md transition-all whitespace-nowrap",
                  filter === status ? "bg-white text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {status === "all" ? "Tất cả" : ORDER_STATUS[status]?.text || status}
              </button>
            ))}
        </div>
      }
    >
      <div className="p-5">
        {loading ? (
          <div className="text-center py-8 text-[11px] font-bold text-text-tertiary uppercase tracking-widest animate-pulse">Đang tải dữ liệu...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Không có đơn hàng xử lý</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
              const statusInfo = ORDER_STATUS[order.status] || { variant: "neutral", text: "Không xác định", description: "" };
              return (
                <div key={order.id} className="bg-white rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-black text-text-primary tracking-tighter">#{order.orderNumber}</h4>
                        <Badge variant={statusInfo.variant} size="sm">{statusInfo.text}</Badge>
                      </div>
                      <p className="text-[10px] text-text-tertiary font-bold mt-1 uppercase">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-primary">{order.total?.toLocaleString()}đ</p>
                      <p className="text-[10px] text-text-tertiary font-medium">{order.items?.length || 0} món</p>
                    </div>
                  </div>
                  <div className="bg-bg-subtle/50 rounded-lg p-3 border border-border/30">
                     {renderTimeline(order)}
                     {renderShipperInfo(order)}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-border/30">
                    <Button variant="ghost" size="sm" className="text-[11px]" onClick={() => setSelectedOrder(order)}>Chi tiết</Button>
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
