import React, { useState, useMemo } from "react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { FiPlus, FiTrash2, FiSearch, FiPackage, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { cn } from "../../utils/cn";

function OrderStep1({
  products,
  isLoadingProducts,
  categories,
  orderData,
  setOrderData,
  setCurrentStep,
  addProductToOrder,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filter, setFilter] = useState("Tất cả");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchStatus =
        filter === "Tất cả" ||
        (filter === "Còn hàng" && product.status === "Còn hàng") ||
        (filter === "Hết hàng" && product.status === "Hết hàng");

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, filter]);

  const updateProductQuantity = (index, newQuantity) => {
    let quantity = Number(newQuantity);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    if (quantity > orderData.products[index].stock) {
      quantity = orderData.products[index].stock;
    }

    setOrderData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index].quantity = quantity;
      return { ...prev, products: updatedProducts };
    });
  };

  const removeProductFromOrder = (index) => {
    setOrderData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts.splice(index, 1);
      return { ...prev, products: updatedProducts };
    });
  };

  const parsePrice = (priceString) => {
    if (typeof priceString !== "string") return Number(priceString) || 0;
    return Number(priceString.replace(/\./g, "").replace("đ", "").trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <label
            htmlFor="categoryFilter"
            className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-2"
          >
            Danh mục
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-border/50 dark:border-dark-border/40 rounded-xl bg-white dark:bg-dark-card text-xs font-bold text-text-primary dark:text-text-primary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
          >
            <option className="dark:bg-dark-card dark:text-text-primary" value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option className="dark:bg-dark-card dark:text-text-primary" key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-grow max-w-lg">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border/50 dark:border-dark-border/60 bg-bg-subtle/30 dark:bg-dark-card text-text-primary dark:text-text-primary text-xs outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold shadow-inner-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-tertiary">
            <FiSearch size={18} />
          </div>
        </div>

        <div className="flex bg-bg-subtle dark:bg-white/5 p-1 rounded-2xl border border-border/40 dark:border-dark-border/40 backdrop-blur-sm">
          {["Tất cả", "Còn hàng", "Hết hàng"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                filter === f
                  ? "bg-white dark:bg-dark-card text-primary shadow-soft-md scale-[1.05]"
                  : "text-text-tertiary hover:text-text-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoadingProducts ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
          <FiRefreshCw className="animate-spin size-10 mb-4" />
          <p className="text-xs font-black uppercase tracking-widest">Đang tải danh sách sản phẩm...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card shadow-soft-xl rounded-[2rem] border border-border/40 dark:border-dark-border/40 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-bg-subtle/50 dark:from-white/[0.01] to-white dark:to-dark-card">
                  {["Tên sản phẩm", "Danh mục", "Giá", "Trạng thái", "Hành động"].map((header, i) => (
                    <th key={i} className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-widest border-b border-border/30 dark:border-dark-border/40">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 dark:divide-dark-border/40">
                {filteredProducts.map((product) => {
                  const isInOrder = orderData.products.some(
                    (item) => item.productId === product.id
                  );
                  return (
                    <tr key={product.id} className="group hover:bg-primary/5 dark:hover:bg-white/[0.02] transition-all duration-300">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-xs font-black text-text-primary uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <Badge variant="neutral" size="sm">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-xs font-black text-primary tracking-tighter">
                          {product.price.toLocaleString("vi-VN")}đ
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <Badge variant={product.status === "Còn hàng" ? "success" : "error"} size="sm">
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                        <button
                          onClick={() => addProductToOrder(product)}
                          disabled={product.status === "Hết hàng" || isInOrder}
                          className={cn(
                            "size-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm mx-auto",
                            isInOrder
                              ? "bg-success text-white scale-110 shadow-success/20 cursor-not-allowed"
                              : product.status === "Hết hàng"
                              ? "bg-bg-subtle dark:bg-white/5 text-text-tertiary cursor-not-allowed opacity-50"
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 active:scale-90"
                          )}
                          title={isInOrder ? "Đã thêm" : "Thêm vào đơn"}
                        >
                          {isInOrder ? <FiCheckCircle size={18} /> : <FiPlus size={18} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {orderData.products.length > 0 && (
        <div className="mt-12 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center space-x-3">
             <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FiPackage />
             </div>
             <h4 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">
                Sản phẩm đã chọn ({orderData.products.length})
             </h4>
          </div>

          <div className="bg-white dark:bg-dark-card shadow-soft-2xl rounded-[2.5rem] border border-border/40 dark:border-dark-border/40 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-subtle/30 dark:bg-white/[0.01]">
                    {["Tên sản phẩm", "Đơn giá", "Số lượng", "Thành tiền", "Hành động"].map((h, i) => (
                       <th key={i} className={cn(
                         "px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-widest border-b border-border/30 dark:border-dark-border/40",
                         i > 0 && "text-center"
                       )}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 dark:divide-dark-border/40">
                  {orderData.products.map((item, index) => (
                    <tr key={item.productId} className="group hover:bg-primary/[0.02] dark:hover:bg-white/[0.01] transition-all">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-xs font-black text-text-primary uppercase tracking-tight">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center whitespace-nowrap text-xs font-bold text-text-secondary">
                        {item.price.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-8 py-6 text-center whitespace-nowrap">
                        <div className="inline-flex items-center bg-bg-subtle dark:bg-white/5 p-1 rounded-xl border border-border/40 dark:border-dark-border/40">
                          <button
                            onClick={() => updateProductQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="size-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-card hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed font-black"
                          >
                            -
                          </button>
                          <input
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => updateProductQuantity(index, Number(e.target.value))}
                            className="w-12 text-center bg-transparent text-xs font-black text-text-primary outline-none"
                          />
                          <button
                            onClick={() => updateProductQuantity(index, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="size-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-card hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed font-black"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center whitespace-nowrap font-black text-primary text-sm tracking-tighter">
                        {(parsePrice(item.price) * item.quantity).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-8 py-6 text-center whitespace-nowrap">
                        <button
                          onClick={() => removeProductFromOrder(index)}
                          className="size-9 rounded-xl bg-error/5 text-error hover:bg-error hover:text-white transition-all duration-300 flex items-center justify-center mx-auto group/btn"
                        >
                          <FiTrash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-y-6 pt-4">
            <div className="flex items-center space-x-4 bg-primary/5 dark:bg-primary/10 px-8 py-5 rounded-[2rem] border border-primary/20 shadow-sm">
                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Tổng tạm tính</span>
                <span className="text-2xl font-black text-primary tracking-tighter">
                  {orderData.products.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0).toLocaleString("vi-VN")}đ
                </span>
            </div>
            
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={orderData.products.length === 0}
              className="h-14 px-12 rounded-[1.5rem] shadow-primary/30 text-sm"
              rightIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>}
            >
              Bước tiếp theo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderStep1;
