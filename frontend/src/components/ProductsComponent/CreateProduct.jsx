import { useState, useEffect } from "react";
import { createProduct } from "../../API/products/productsApi";
import { getManySupplier } from "../../API/suppliersApi/suppliersApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Input from "../common/Input";
import Button from "../common/Button";

const CreateProduct = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Còn hàng");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [adding, setAdding] = useState(false);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setAdding(true);

      if (
        !name ||
        !category ||
        !price ||
        !unit ||
        !description ||
        !status ||
        !image
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      const stock = 0;
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("unit", unit);
      formData.append("stock", stock);
      formData.append("price", String(price));
      formData.append("status", status);
      formData.append("image", image);
      formData.append("supplierId", supplierId);

      const data = await createProduct(formData);

      if (data.success) {
        toast.success(data.message);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/products");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload - Compact Center */}
        <div className="flex flex-col items-center">
          <div className="group relative w-32 h-32">
            <label htmlFor="create-product-image" className="cursor-pointer block h-full">
              <div className="h-full rounded-3xl border-2 border-dashed border-border/60 dark:border-dark-border/40 bg-bg-subtle/30 dark:bg-dark-card/40 overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:bg-white dark:group-hover:bg-dark-card shadow-inner-sm">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-1 p-2 text-center">
                    <svg className="w-6 h-6 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[8px] font-black text-text-tertiary uppercase tracking-tighter">Chọn ảnh</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <input type="file" id="create-product-image" onChange={handleImageChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Form Fields - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
          <Input
            label="Tên sản phẩm"
            containerClassName="col-span-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Gạo ST25"
            className="h-11"
          />
          
          <Input
            label="Danh mục"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Nhập loại..."
            className="h-11"
          />

          <Input
            label="Đơn vị tính"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Kg, Thùng..."
            className="h-11"
          />

          <Input
            label="Giá bán (đ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="h-11"
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
              <span>Trạng thái</span>
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl h-11 px-4 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm"
            >
              <option value="Còn hàng" className="dark:bg-dark-card">Còn hàng</option>
              <option value="Hết hàng" className="dark:bg-dark-card">Hết hàng</option>
            </select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
              <span>Nhà cung cấp</span>
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl h-11 px-4 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm"
            >
              <option value="" className="dark:bg-dark-card">-- Chọn nhà cung cấp --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="dark:bg-dark-card">{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
              <span>Mô tả ngắn</span>
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="w-full bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/40 text-text-primary text-xs rounded-2xl py-3 px-4 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm resize-none"
              placeholder="Nhập ghi chú sản phẩm..."
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 text-xs"
            isLoading={adding}
          >
            {adding ? "Đang xử lý..." : "Lưu sản phẩm"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
