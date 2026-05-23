import React, { useState, useEffect } from "react";
import AddressAutocomplete from "../AddressAutocomplete";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

export default function EditShipperForm({ shipper, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    status: "available",
    address: "",
    lat: null,
    lng: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shipper) {
      setFormData({
        name: shipper.name || "",
        phoneNumber: shipper.phoneNumber || "",
        status: shipper.status || "available",
        address: shipper.address || "",
        lat: shipper.lat,
        lng: shipper.lng,
      });
    }
  }, [shipper]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (suggest) => {
    if (suggest?.lat && suggest?.lon) {
      setFormData((prev) => ({
        ...prev,
        address: suggest.display_name,
        lat: parseFloat(suggest.lat),
        lng: parseFloat(suggest.lon),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Cập nhật thông tin Shipper"
      size="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose} className="h-11 px-6">Hủy</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            isLoading={loading}
            className="h-11 px-8 shadow-primary/30"
          >
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Tên nhân viên giao hàng"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleChange}
            required
            containerClassName="col-span-2"
          />

          <Input
            label="Số điện thoại liên hệ"
            name="phoneNumber"
            placeholder="09xx xxx xxx"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
              <span>Trạng thái</span>
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-bg-subtle/30 dark:bg-dark-card border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-xl h-11 px-4 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm transition-all duration-300"
            >
              <option className="dark:bg-dark-card dark:text-text-primary" value="available">Sẵn sàng</option>
              <option className="dark:bg-dark-card dark:text-text-primary" value="delivering">Đang giao hàng</option>
            </select>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1.5">
              <span>Địa chỉ cư trú hiện tại</span>
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, address: value }))
              }
              onSelect={handleSelect}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
