import React, { useState, useEffect, useCallback } from "react";
import AddressAutocomplete from "../AddressAutocomplete";
import { fetchAllCustomers } from "../../API/customer/customerApi";
import { FiX, FiSearch, FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import { cn } from "../../utils/cn";

function OrderStep2({ orderData, setOrderData, setCurrentStep }) {
  const [customerOption, setCustomerOption] = useState("new");
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      const res = await fetchAllCustomers(1, 1000, searchTerm);
      if (res?.data?.errCode === 0) {
        setCustomers(res.data.customers || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (customerOption === "existing") {
      fetchCustomers();
    }
  }, [customerOption, fetchCustomers]);

  const handleCustomerChange = (e) => {
    setOrderData({
      ...orderData,
      customer: {
        ...orderData.customer,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSelectExistingCustomer = (customer) => {
    setOrderData({
      ...orderData,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phoneNumber,
        address: customer.address,
        lat: customer.lat,
        lng: customer.lng,
      },
      shipping: {
        ...orderData.shipping,
        address: customer.address,
        lat: customer.lat,     
      lng: customer.lng,
      },
    });
    setShowCustomerModal(false);
  };

  const handleAddressSelect = (selectedAddress) => {
    setOrderData({
      ...orderData,
      shipping: {
        ...orderData.shipping,
        address: selectedAddress.display_name,
        lat: selectedAddress.lat,
        lng: selectedAddress.lon,
        ...(selectedAddress.address && {
          city:
            selectedAddress.address.city || selectedAddress.address.town || "",
          postalCode: selectedAddress.address.postcode || "",
          country: selectedAddress.address.country || "Việt Nam",
        }),
      },
    });
  };

  const handleAddressChange = (value) => {
    setOrderData({
      ...orderData,
      shipping: {
        ...orderData.shipping,
        address: value,
      },
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <h4 className="text-md font-black text-text-primary uppercase tracking-tight mb-4">
            Thông tin khách hàng
          </h4>

          <div className="flex mb-4 border-b border-border/40 dark:border-dark-border/40">
            <button
              className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                customerOption === "new"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
              onClick={() => setCustomerOption("new")}
            >
              Khách hàng mới
            </button>
            <button
              className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                customerOption === "existing"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
              onClick={() => setCustomerOption("existing")}
            >
              Khách hàng cũ
            </button>
          </div>

          {customerOption === "existing" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2 ml-2">
                  Chọn khách hàng
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowCustomerModal(true)}
                    className="w-full px-5 py-3.5 rounded-2xl border border-border/50 dark:border-dark-border/60 bg-bg-subtle/30 dark:bg-dark-card text-text-primary dark:text-text-primary text-xs outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                  />
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center bg-bg-subtle/50 dark:bg-white/5 rounded-r-2xl border-l border-border/40 dark:border-dark-border/40 text-text-tertiary"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                {orderData.customer.id && orderData.customer.name && (
                  <div className="mt-3 p-4 bg-bg-subtle/40 dark:bg-white/[0.01] rounded-2xl border border-primary/20 dark:border-primary/10 shadow-inner-sm">
                    <p className="text-xs font-black text-primary uppercase tracking-tight">{orderData.customer.name}</p>
                    <p className="text-[10px] text-text-secondary font-bold mt-1">
                      {orderData.customer.phone}
                    </p>
                    <p className="text-[10px] text-text-secondary font-bold">
                      {orderData.customer.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Tên khách hàng *"
                name="name"
                value={orderData.customer.name}
                onChange={handleCustomerChange}
                placeholder="Nguyễn Văn A"
              />
              <Input
                label="Email khách hàng *"
                type="email"
                name="email"
                value={orderData.customer.email}
                onChange={handleCustomerChange}
                placeholder="example@gmail.com"
              />
              <Input
                label="Số điện thoại *"
                type="tel"
                name="phone"
                value={orderData.customer.phone}
                onChange={handleCustomerChange}
                placeholder="09xx xxx xxx"
              />
            </div>
          )}
        </div>

        <div>
          <h4 className="text-md font-black text-text-primary uppercase tracking-tight mb-4">
            Địa chỉ giao hàng
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2 ml-2">
                Địa chỉ giao hàng *
              </label>
              <AddressAutocomplete
                value={orderData.shipping.address}
                onChange={handleAddressChange}
                onSelect={handleAddressSelect}
              />

              <input
                type="hidden"
                name="lat"
                value={orderData.shipping.lat || ""}
              />
              <input
                type="hidden"
                name="lng"
                value={orderData.shipping.lng || ""}
              />
            </div>
          </div>
        </div>
      </div>

      {showCustomerModal && (
        <Modal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          title="Chọn khách hàng"
          size="md"
        >
            <div className="space-y-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Tìm theo tên hoặc số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-error transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                </div>
                <Button
                  onClick={fetchCustomers}
                  className="h-11 px-6 rounded-2xl"
                  isLoading={isLoadingCustomers}
                >
                  Tìm kiếm
                </Button>
              </div>

              {isLoadingCustomers ? (
                <div className="text-center py-12 opacity-30">
                   <FiRefreshCw className="animate-spin size-8 mx-auto mb-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Đang tải...</p>
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-12 opacity-30">
                  <FiSearch className="size-8 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {searchTerm ? "Không tìm thấy khách hàng" : "Nhập thông tin để tìm kiếm"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-4 rounded-xl border border-border/40 dark:border-dark-border/40 bg-bg-subtle/20 dark:bg-white/[0.01] hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group"
                      onClick={() => handleSelectExistingCustomer(customer)}
                    >
                      <p className="text-xs font-black text-text-primary uppercase tracking-tight group-hover:text-primary transition-colors">{customer.name}</p>
                      <div className="flex items-center gap-x-3 mt-1 text-[10px] text-text-tertiary font-bold">
                        <span>{customer.phoneNumber}</span>
                        <div className="size-1 rounded-full bg-border" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </Modal>
      )}

      <div className="flex justify-between pt-8 border-t border-border/40 dark:border-dark-border/40">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(1)}
          leftIcon={<FiArrowLeft />}
          className="rounded-2xl h-12"
        >
          Quay lại
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          disabled={
            !orderData.customer.name ||
            !orderData.customer.phone ||
            !orderData.shipping.address
          }
          className="rounded-2xl h-12 px-10"
        >
          Bước tiếp theo
        </Button>
      </div>
    </div>
  );
}

export default OrderStep2;
