import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../API/products/productsApi";
import { createOrder } from "../../API/orders/ordersApi";
import { createCustomer } from "../../API/customer/customerApi";

import OrderStep1 from "./OrderStep1";
import OrderStep2 from "./OrderStep2";
import OrderStep3 from "./OrderStep3";
import { toast } from "react-toastify";

function OrderWizard({ onOrderCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [categories, setCategories] = useState([]);

  const [orderData, setOrderData] = useState({
    products: [],
    customer: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    shipping: { address: "", lat: null, lng: null },
    payment: "cash",
  });

  const updateProductQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newProducts = [...orderData.products];
    newProducts[index].quantity = newQuantity;
    setOrderData((prev) => ({
      ...prev,
      products: newProducts,
    }));
  };

  const addProductToOrder = (product) => {
    const existingProductIndex = orderData.products.findIndex(
      (item) => item.productId === product.id
    );

    if (existingProductIndex >= 0) {
      updateProductQuantity(
        existingProductIndex,
        orderData.products[existingProductIndex].quantity + 1
      );
    } else {
      setOrderData((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            stock: product.stock,
          },
        ],
      }));
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res= await getAllProducts();
        const data = res?.products || [];
        setProducts(data);  
        setCategories([...new Set(data.map((p) => p.category))]);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);
  const handleSubmit = async () => {
  let customerId = orderData.customer.id || null;
    if (!customerId) {
  try {
    const customerRes = await createCustomer({
      name: orderData.customer.name,
      email: orderData.customer.email,
      phoneNumber: orderData.customer.phone,
      address: orderData.shipping.address,
      city: orderData.shipping.city || "",
      status: "active",
      lat:orderData.shipping.lat,
      lng:orderData.shipping.lng,
    });
    if (customerRes?.data?.errCode === 0) {
      customerId = customerRes.data.customer?.id || customerRes.data.data?.id;
    } else {
      toast.error("Tạo khách hàng thất bại!");
      return;
    }
  } catch {
    toast.error("Tạo khách hàng thất bại!");
    return;
  }
  }


  const subtotal = orderData.products.reduce(
    (sum, item) =>
      sum +
      (parseInt(String(item.price).replace(/\D/g, "")) || 0) * item.quantity,
    0
  );
  const shippingFee = 30000;
  const total = subtotal + shippingFee;
  const payload = {
  customerId,
  customerName: orderData.customer.name,
  customerEmail: orderData.customer.email,
  customerPhone: orderData.customer.phone,
  shippingAddress: orderData.shipping.address,
  shippingLat: orderData.shipping.lat,
  shippingLng: orderData.shipping.lng,

  paymentMethod: orderData.payment,
  status: "pending",
  total,
  subtotal,
  shippingFee,
  items: orderData.products.map((p) => ({
    productId: p.productId,
    name: p.name,
    price: Number(String(p.price).replace(/\D/g, "")),
    quantity: p.quantity,
  })),
  };
  try {
  await createOrder(payload);
  toast.success("Đơn hàng đã được tạo thành công!");
  setCurrentStep(1);
    setOrderData({
      products: [],
      customer: { name: "", phone: "" , email: "" , address: "" },
      shipping: { address: "", lat: null, lng: null },
      payment: "cash",
    });
  if (onOrderCreated) onOrderCreated();
  } catch {
  toast.error("Tạo đơn hàng thất bại!");
  }
  };

  return (
    <div className="bg-card shadow-card rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-textPrimary">
            Tạo đơn hàng mới
          </h3>
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full ${
                    currentStep >= step ? "gradient-bg" : "bg-border"
                  } flex items-center justify-center ${
                    currentStep >= step ? "text-white" : "text-textSecondary"
                  } font-bold`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-12 ${
                      currentStep > step ? "bg-primary" : "bg-border"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <OrderStep1
            products={products}
            isLoadingProducts={isLoadingProducts}
            categories={categories}
            orderData={orderData}
            setOrderData={setOrderData}
            setCurrentStep={setCurrentStep}
            addProductToOrder={addProductToOrder}
          />
        )}
        {currentStep === 2 && (
          <OrderStep2
            orderData={orderData}
            setOrderData={setOrderData}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 3 && (
          <OrderStep3
            orderData={orderData}
            setOrderData={setOrderData}
            setCurrentStep={setCurrentStep}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default OrderWizard;
