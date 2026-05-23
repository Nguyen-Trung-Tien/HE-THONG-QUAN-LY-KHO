import React from "react";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import { FiUser, FiMapPin, FiTruck, FiPackage, FiCreditCard, FiClock } from "react-icons/fi";
import { cn } from "../../utils/cn";

const STATUS_MAP = {
  pending: { text: "Chờ xác nhận", variant: "warning" },       
  finding_shipper: { text: "Đang tìm shipper", variant: "info" },
  shipping: { text: "Đang giao", variant: "primary" },        
  delivered: { text: "Đã giao", variant: "success" },           
  cancelled: { text: "Đã hủy", variant: "error" },                 
};

function OrderDetail({ order, onClose }) {
  const statusInfo = STATUS_MAP[order.status] || { text: order.status, variant: "neutral" };
  const subtotal =
    order.subtotal && order.subtotal > 0
      ? order.subtotal
      : Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0)
      : 0;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Chi tiết đơn hàng #${order.orderNumber}`}
      size="md"
    >
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-bg-subtle/30 dark:bg-white/[0.01] border border-border/40 dark:border-dark-border/40">
             <div className="flex items-center gap-x-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner-sm">
                  <FiClock />
                </div>
                <div>
                   <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Thời gian đặt</p>
                   <p className="text-xs font-bold text-text-primary">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>
             </div>
             <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-4 rounded-2xl bg-bg-subtle/20 dark:bg-white/[0.01] border border-border/30 dark:border-dark-border/40">
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2 flex items-center gap-x-2">
                   <FiUser className="text-primary" /> Khách hàng
                </p>
                <p className="text-xs font-black text-text-primary uppercase tracking-tight">{order.customerName}</p>
             </div>
             <div className="p-4 rounded-2xl bg-bg-subtle/20 dark:bg-white/[0.01] border border-border/30 dark:border-dark-border/40">
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2 flex items-center gap-x-2">
                   <FiTruck className="text-success" /> Shipper
                </p>
                <p className="text-xs font-black text-text-primary uppercase tracking-tight">{order.shipper?.name || "Chưa gán"}</p>
             </div>
          </div>

          <div className="p-5 rounded-[1.5rem] bg-bg-subtle/20 dark:bg-white/[0.01] border border-border/30 dark:border-dark-border/40">
             <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-x-2">
                <FiMapPin className="text-error" /> Địa chỉ giao hàng
             </p>
             <p className="text-xs font-medium text-text-secondary leading-relaxed italic">{order.shippingAddress}</p>
          </div>

          <div className="space-y-3">
             <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] px-2">Danh sách sản phẩm</h3>
             <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark-card border border-border/20 dark:border-dark-border/40 shadow-sm group hover:border-primary/30 transition-all">
                     <div className="flex items-center gap-x-3">
                        <div className="size-8 rounded-lg bg-bg-subtle dark:bg-white/5 flex items-center justify-center text-text-tertiary group-hover:text-primary transition-colors">
                           <FiPackage />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-text-primary uppercase tracking-tight">{item.name}</p>
                           <p className="text-[10px] text-text-tertiary font-bold">SL: {item.quantity}</p>
                        </div>
                     </div>
                     <p className="text-xs font-black text-text-primary tracking-tighter">{Number(item.price).toLocaleString()}đ</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 dark:border-primary/5 space-y-3">
             <div className="flex justify-between text-xs font-bold text-text-secondary">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()}đ</span>
             </div>
             <div className="flex justify-between text-xs font-bold text-text-secondary">
                <span>Phí vận chuyển</span>
                <span>{order.shippingFee?.toLocaleString()}đ</span>
             </div>
             <div className="h-px bg-border/40 dark:bg-dark-border/40 my-1" />
             <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-x-2 text-primary">
                   <FiCreditCard />
                   <span className="text-xs font-black uppercase tracking-widest">Tổng cộng</span>
                </div>
                <span className="text-xl font-black text-primary tracking-tighter">{order.total?.toLocaleString()}đ</span>
             </div>
          </div>
        </div>
    </Modal>
  );
}

export default OrderDetail;
