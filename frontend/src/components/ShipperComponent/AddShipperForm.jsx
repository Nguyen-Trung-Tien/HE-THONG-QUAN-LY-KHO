import React, { useState } from "react";
import { toast } from "react-toastify";
import AddressAutocomplete from "../AddressAutocomplete";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

export default function AddShipperForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    status: "available",
    address: "",
  });
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (suggest) => {
    if (suggest?.lat && suggest?.lon) {
      setFormData((prev) => ({ ...prev, address: suggest.display_name }));
      setCoords({ lat: parseFloat(suggest.lat), lng: parseFloat(suggest.lon) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên shipper");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error(
        "Số điện thoại không hợp lệ. Vui lòng nhập 10 số, bắt đầu bằng 0 hoặc +84."
      );
      return;
    }

    if (!coords) {
      toast.error("Vui lòng chọn một địa chỉ hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        lat: coords.lat,
        lng: coords.lng,
      };

      if (onSubmit) {
        await onSubmit(payload);
      }
    } catch (err) {
      console.error("Lỗi khi submit form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Thêm Shipper mới"
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
            Thêm shipper
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
              className="w-full bg-bg-subtle/30 border border-border/50 text-text-primary text-xs rounded-xl h-11 px-4 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm transition-all duration-300"
            >
              <option value="available">Sẵn sàng</option>
              <option value="delivering">Đang giao hàng</option>
            </select>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1.5">
              <span>Địa chỉ thường trú</span>
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
