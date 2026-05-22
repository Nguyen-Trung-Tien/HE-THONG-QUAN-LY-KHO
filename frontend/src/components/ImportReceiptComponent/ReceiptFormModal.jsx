import React from "react";
import { FiPlus } from "react-icons/fi";
import ReceiptDetailRow from "./ReceiptDetailRow";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

export default function ReceiptFormModal({
  show,
  onClose,
  formData,
  handleFormChange,
  handleDetailChange,
  addReceiptDetail,
  removeReceiptDetail,
  handleSubmit,
  formLoading,
  supplierOptions,
  productOptions,
  calculateTotalCost,
  CURRENCY_UNIT,
}) {
  if (!show) return null;

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      title={formData.id ? "Cập nhật phiếu nhập" : "Khởi tạo phiếu nhập mới"}
      size="lg"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Tổng giá trị phiếu</span>
            <span className="text-xl font-black text-primary tracking-tighter">
              {calculateTotalCost(formData.details)}
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} disabled={formLoading} className="h-11 px-6">Hủy</Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              isLoading={formLoading}
              className="h-11 px-8 shadow-primary/30"
            >
              {formData.id ? "Lưu thay đổi" : "Nhập kho"}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Thông tin chung */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 mb-1 px-1">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Thông tin vận hành</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-bg-subtle/30 p-6 rounded-[1.5rem] border border-border/40 shadow-inner-sm">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
                <span>Nhà cung cấp</span>
                <div className="w-1 h-1 rounded-full bg-primary/40" />
              </label>
              <select
                value={formData.supplierData?.id || ""}
                onChange={(e) => {
                  const selected = supplierOptions.find(
                    (s) => s.id === parseInt(e.target.value)
                  );
                  handleFormChange("supplierData", selected || null);
                }}
                className="w-full bg-white border border-border/50 text-text-primary text-xs rounded-xl h-10 px-4 outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-sm disabled:opacity-50"
                disabled={formLoading || supplierOptions.length === 0}
              >
                <option value="">
                  {supplierOptions.length === 0
                    ? "N/A"
                    : "-- Chọn NCC --"}
                </option>
                {supplierOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Ngày lập"
              type="date"
              value={formData.import_date}
              onChange={(e) => handleFormChange("import_date", e.target.value)}
              disabled={formLoading}
              className="bg-white h-10"
            />

            <Input
              label="Nhân viên"
              value={formData.userEmail || ""}
              disabled
              className="bg-bg-subtle/50 opacity-70 h-10"
            />
          </div>
        </div>

        {/* Section 2: Danh sách hàng hóa */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-1 px-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center text-success">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Danh mục hàng nhập</h4>
            </div>
            <Button 
              variant="outline" 
              size="xs" 
              onClick={addReceiptDetail}
              disabled={formLoading || productOptions.length === 0}
              leftIcon={<FiPlus className="stroke-[3px]" />}
              className="rounded-xl border-dashed px-4"
            >
              Thêm dòng
            </Button>
          </div>
          
          <div className="min-h-[150px] max-h-72 overflow-y-auto custom-scrollbar border border-border/40 rounded-[1.5rem] p-4 space-y-3 bg-white shadow-soft-xl">
            {formData.details.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest">Danh sách trống</p>
              </div>
            ) : (
              formData.details.map((d, i) => (
                <ReceiptDetailRow
                  key={`detail-${d.productId || "empty"}-${i}`}
                  detail={d}
                  index={i}
                  productOptions={productOptions}
                  handleDetailChange={handleDetailChange}
                  removeReceiptDetail={removeReceiptDetail}
                  formLoading={formLoading}
                  CURRENCY_UNIT={CURRENCY_UNIT}
                />
              ))
            )}
          </div>
        </div>

        <div className="px-1">
          <Input
            label="Ghi chú"
            value={formData.note}
            onChange={(e) => handleFormChange("note", e.target.value)}
            placeholder="Ghi chú nghiệp vụ..."
            disabled={formLoading}
            className="bg-bg-subtle/20 h-10"
          />
        </div>
      </form>
    </Modal>
  );
}
