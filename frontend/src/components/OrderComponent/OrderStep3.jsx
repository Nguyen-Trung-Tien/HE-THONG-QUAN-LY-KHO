import React, { useState } from "react";
import QRCode from "react-qr-code";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Input from "../common/Input";
import { FiCheckCircle, FiShoppingCart, FiCreditCard, FiArrowLeft, FiPrinter } from "react-icons/fi";

function OrderStep3({ orderData, setOrderData, setCurrentStep, handleSubmit, currentUser }) {
  const [cashReceived, setCashReceived] = useState(0);

  const subtotal = orderData.products.reduce(
    (sum, item) =>
      sum +
      (parseInt(String(item.price).replace(/\D/g, "")) || 0) * item.quantity,
    0
  );
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const canSubmit = () => {
    if (orderData.payment === "cash" && cashReceived < total) return false;
    return true;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Summary */}
        <div className="space-y-6">
          <Card title="Xác nhận thông tin" extra={<FiCheckCircle className="text-success" />}>
             <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-bg-subtle/30 dark:bg-white/[0.01] border border-border/40 dark:border-dark-border/40 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                      <FiShoppingCart size={64} />
                   </div>
                   <h5 className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3">Thông tin nhận hàng</h5>
                   <p className="text-sm font-black text-text-primary uppercase tracking-tight">{orderData.customer.name}</p>
                   <p className="text-xs text-text-secondary font-bold mt-1">{orderData.customer.phone}</p>
                   <p className="text-xs text-text-tertiary font-medium italic mt-2 leading-relaxed">
                     {orderData.shipping.address}
                   </p>
                </div>

                <div className="p-5 rounded-2xl bg-bg-subtle/30 dark:bg-white/[0.01] border border-border/40 dark:border-dark-border/40">
                   <h5 className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-4">Phương thức thanh toán</h5>
                   <div className="flex gap-4">
                      {['cash', 'transfer'].map(method => (
                        <button
                          key={method}
                          onClick={() => setOrderData({ ...orderData, payment: method })}
                          className={`flex-1 flex flex-col items-center gap-y-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                            orderData.payment === method 
                              ? "border-primary bg-primary/5 text-primary" 
                              : "border-border/40 dark:border-dark-border/40 text-text-tertiary grayscale hover:grayscale-0 hover:border-primary/30"
                          }`}
                        >
                           <FiCreditCard size={24} />
                           <span className="text-[10px] font-black uppercase tracking-widest">{method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {orderData.payment === "cash" && (
                   <div className="animate-in fade-in zoom-in-95 duration-300">
                      <Input
                        label="Tiền khách đưa *"
                        type="number"
                        placeholder="0"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(Number(e.target.value))}
                        className="text-xl font-black text-primary tracking-tighter h-14"
                        rightIcon={<span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">VND</span>}
                      />
                      {cashReceived > total && (
                        <div className="mt-3 p-3 rounded-xl bg-success/5 border border-success/20 flex justify-between items-center">
                           <span className="text-[10px] font-black text-success uppercase tracking-widest">Tiền thối lại</span>
                           <span className="text-sm font-black text-success tracking-tighter">{(cashReceived - total).toLocaleString()}đ</span>
                        </div>
                      )}
                   </div>
                )}
             </div>
          </Card>
        </div>

        {/* Right Side: Total */}
        <div className="space-y-6">
           <Card title="Tổng kết chi phí" className="bg-gradient-to-br from-white to-primary/[0.02] dark:from-dark-card dark:to-primary/[0.05]">
              <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold text-text-secondary uppercase tracking-tight">
                    <span>Tổng tiền hàng</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-text-secondary uppercase tracking-tight">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString()}đ</span>
                 </div>
                 <div className="h-px bg-border/40 dark:bg-dark-border/40 my-2" />
                 <div className="flex justify-between items-center py-2">
                    <span className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Tổng cộng</span>
                    <span className="text-3xl font-black text-primary tracking-tighter animate-pulse">{total.toLocaleString()}đ</span>
                 </div>
              </div>

              <div className="mt-8 flex flex-col items-center p-6 bg-white dark:bg-dark-bg/40 rounded-3xl border border-border/30 dark:border-dark-border/40 shadow-inner-sm">
                 <div className="p-3 bg-white rounded-2xl shadow-sm border border-border/20">
                    <QRCode value={JSON.stringify({o: orderData.customer.name, t: total})} size={120} />
                 </div>
                 <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-4 flex items-center">
                    <FiPrinter className="mr-2" /> Quét mã để xác nhận nhanh
                 </p>
              </div>
           </Card>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-border/40 dark:border-dark-border/40">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(2)}
          leftIcon={<FiArrowLeft />}
          className="rounded-2xl h-12 px-8"
        >
          Quay lại
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="rounded-2xl h-12 px-12 shadow-primary/30 text-base"
          variant="primary"
          rightIcon={<FiCheckCircle />}
        >
          Hoàn tất đơn hàng
        </Button>
      </div>
    </div>
  );
}

export default OrderStep3;
