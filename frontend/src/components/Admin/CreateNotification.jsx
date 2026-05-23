import React, { useState } from "react";
import { createNotification } from "../../API/notificationApi";
import { toast } from "react-toastify";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { FiSend, FiAlertCircle, FiInfo, FiPackage, FiCheckCircle } from "react-icons/fi";

const CreateNotification = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    userId: "", 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        userId: formData.userId === "" ? null : parseInt(formData.userId),
      };
      await createNotification(data);
      toast.success("Tạo thông báo thành công");
      setFormData({ title: "", message: "", type: "info", userId: "" });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tạo thông báo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="primary" className="mb-1">Admin Only</Badge>
          <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center space-x-2">
            <FiSend className="text-primary" />
            <span>Tạo thông báo hệ thống</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
                <span>Loại thông báo</span>
                <div className="w-1 h-1 rounded-full bg-primary/40" />
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-bg-subtle/30 dark:bg-dark-card border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl h-12 px-4 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm transition-all appearance-none"
                >
                  <option className="dark:bg-dark-card dark:text-text-primary" value="info">Thông tin (Info)</option>
                  <option className="dark:bg-dark-card dark:text-text-primary" value="alert">Cảnh báo (Alert)</option>
                  <option className="dark:bg-dark-card dark:text-text-primary" value="stock">Kho hàng (Stock)</option>
                  <option className="dark:bg-dark-card dark:text-text-primary" value="order">Đơn hàng (Order)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                  {formData.type === 'info' && <FiInfo />}
                  {formData.type === 'alert' && <FiAlertCircle />}
                  {formData.type === 'stock' && <FiPackage />}
                  {formData.type === 'order' && <FiCheckCircle />}
                </div>
              </div>
            </div>

            <Input
              label="Gửi đến User ID (để trống = tất cả)"
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Ví dụ: 1"
            />
          </div>

          <Input
            label="Tiêu đề thông báo"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề..."
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
              <span>Nội dung chi tiết</span>
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập nội dung thông báo..."
              className="w-full bg-bg-subtle/30 dark:bg-dark-card border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl p-5 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 placeholder:text-text-tertiary/60 font-bold shadow-inner-sm"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              className="h-12 px-10"
              leftIcon={<FiSend />}
            >
              Gửi thông báo ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;
