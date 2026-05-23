import { useEffect, useState } from "react";
import { editProduct } from "../../API/products/productsApi";
import { getManySupplier } from "../../API/suppliersApi/suppliersApi";
import { toast } from "react-toastify";
import Input from "../common/Input";
import Button from "../common/Button";

const EditProduct = ({ productData, onSuccess }) => {
  const id = productData?.id;
  const [preview, setPreview] = useState("");
  const [editing, setEditing] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    status: "Còn hàng",
    supplierId: "",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getManySupplier();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (productData) {
      setForm({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        description: productData.description,
        status: productData.status,
        image: productData.image,
        supplierId: productData.supplierId || "",
      });
      setPreview(productData.image);
    }
  }, [productData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setEditing(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("status", form.status);
      formData.append("supplierId", form.supplierId);

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const data = await editProduct(id, formData);

      if (data.success) {
        toast.success(data.message);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload - Compact Center */}
        <div className="flex flex-col items-center">
          <div className="group relative size-32">
            <label htmlFor="edit-product-image" className="cursor-pointer block h-full">
              <div className="h-full rounded-3xl border-2 border-dashed border-border/60 bg-bg-subtle/30 overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:bg-white shadow-inner-sm">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-y-1 p-2 text-center">
                    <svg className="size-6 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[8px] font-black text-text-tertiary uppercase tracking-tighter">Chọn ảnh</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                  <svg className="size-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <input type="file" id="edit-product-image" onChange={handleImageChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Form Fields - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
          <Input
            label="Tên sản phẩm"
            containerClassName="col-span-2"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nhập tên sản phẩm"
            className="h-11"
          />
          
          <Input
            label="Danh mục"
            value={form.category}
            onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Nhập loại…"
            className="h-11"
          />

          <Input
            label="Giá niêm yết (đ)"
            type="number"
            value={form.price}
            onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0"
            className="h-11"
          />

          <div className="space-y-1.5">
            <label htmlFor="edit-product-status" className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center gap-x-1 cursor-pointer">
              <span>Trạng thái</span>
              <div className="size-1 rounded-full bg-primary/40" />
            </label>
            <select
              id="edit-product-status"
              value={form.status}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl h-11 px-4 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm"
            >
              <option value="Còn hàng" className="dark:bg-dark-card">Còn hàng</option>
              <option value="Hết hàng" className="dark:bg-dark-card">Hết hàng</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-product-supplier" className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center gap-x-1 cursor-pointer">
              <span>Nhà cung cấp</span>
              <div className="size-1 rounded-full bg-primary/40" />
            </label>
            <select
              id="edit-product-supplier"
              value={form.supplierId}
              onChange={(e) => setForm(prev => ({ ...prev, supplierId: e.target.value }))}
              className="w-full bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl h-11 px-4 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm"
            >
              <option value="" className="dark:bg-dark-card">-- Chọn nhà cung cấp --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="dark:bg-dark-card">{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label htmlFor="edit-product-description" className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center gap-x-1 cursor-pointer">
              <span>Mô tả ngắn</span>
              <div className="size-1 rounded-full bg-primary/40" />
            </label>
            <textarea
              id="edit-product-description"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows="2"
              className="w-full bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl py-3 px-4 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm resize-none"
              placeholder="Nhập ghi chú sản phẩm…"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 text-xs"
            isLoading={editing}
          >
            {editing ? "Đang lưu…" : "Cập nhật sản phẩm"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
