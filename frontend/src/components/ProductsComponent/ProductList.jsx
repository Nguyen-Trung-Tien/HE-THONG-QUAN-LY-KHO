import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllProducts, deleteProduct } from "../../API/products/productsApi";
import { toast } from "react-toastify";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import ProductDetail from "./ProductDetail";
import { useSelector } from "react-redux";

// Common Components
import Button from "../common/Button";
import Input from "../common/Input";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import Badge from "../common/Badge";
import Card from "../common/Card";
import Modal from "../common/Modal";
import ConfirmModal from "../common/ConfirmModal";
import ExportExcel from "../common/ExportExcel";
import ExportPDF from "../common/ExportPDF";
import { cn } from "../../utils/cn";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const userRole = useSelector((state) => state.user.role);
  const isAdminOrDev = userRole === "admin" || userRole === "dev";

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(page, 10);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      toast.success("Xóa thành công");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => filter === "Tất cả" || p.status === filter)
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, filter, search]);

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => (page - 1) * 10 + index + 1,
      className: "w-12 text-center text-[11px]",
    },
    {
      title: "Sản phẩm",
      key: "name",
      render: (name, row) => (
        <div className="flex items-center gap-x-2">
          <div className="size-8 rounded-lg bg-bg-subtle dark:bg-white/5 overflow-hidden flex-shrink-0 border border-border/50 dark:border-white/10 shadow-sm">
            {row.image ? (
              <img src={row.image} alt={name} className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center text-text-tertiary scale-75">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <span className="font-bold text-text-primary text-[11px] tracking-tight truncate max-w-[150px] uppercase">{name}</span>
        </div>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      className: "text-[11px] text-text-secondary uppercase font-semibold",
    },
    {
      title: "Giá",
      key: "price",
      render: (price) => <span className="font-black text-primary text-[11px]">{Number(price).toLocaleString()} đ</span>,
    },
    {
      title: "Tồn kho",
      key: "stock",
      render: (stock, row) => (
        <span className={cn("text-[11px] font-bold", stock < 10 ? "text-error font-black" : "text-text-primary")}>
          {stock} <span className="text-[10px] text-text-tertiary font-medium">{row.unit}</span>
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (status) => (
        <Badge variant={status === "Còn hàng" ? "success" : "error"} size="sm">
          {status}
        </Badge>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      className: "text-right",
      render: (_, product) => (
        <div className="flex justify-end gap-x-0.5 scale-90 origin-right">
          <Button
            variant="ghost"
            size="icon"
            className="text-info hover:bg-info/10"
            onClick={() => { setSelectedProduct(product); setIsDetailModalOpen(true); }}
            title="Xem chi tiết"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
          {isAdminOrDev && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10"
                onClick={() => { setSelectedProduct(product); setIsEditModalOpen(true); }}
                title="Chỉnh sửa"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-error hover:bg-error/10"
                onClick={() => { setSelectedProduct(product); setIsDeleteModalOpen(true); }}
                title="Xóa"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <Badge variant="primary" className="mb-1 uppercase tracking-widest">Tồn kho</Badge>
          <h1 className="heading-1">
            Sản phẩm
          </h1>
          <p className="subheading">Quản lý danh mục hàng hóa hệ thống</p>
        </div>
        <div className="flex flex-wrap gap-2 scale-90 sm:scale-100 origin-right relative z-50">
          <ExportPDF
            data={products}
            fileName="Danh_sach_san_pham"
            title="Danh sách danh mục hàng hóa"
            columns={[
              { key: 'id', header: 'Ma SP' },
              { key: 'name', header: 'Ten san pham' },
              { key: 'category', header: 'Danh muc' },
              { key: 'price', header: 'Gia ban' },
              { key: 'stock', header: 'Ton kho' },
              { key: 'unit', header: 'Don vi' },
              { key: 'status', header: 'Trang thai' },
            ]}
          />
          <ExportExcel
            data={products}
            allData={products}
            fileName="Danh_sach_san_pham"
            sheetName="SanPham"
            columns={[
              { key: 'id', header: 'Mã SP' },
              { key: 'name', header: 'Tên sản phẩm' },
              { key: 'category', header: 'Danh mục' },
              { key: 'price', header: 'Giá bán' },
              { key: 'stock', header: 'Tồn kho' },
              { key: 'unit', header: 'Đơn vị' },
              { key: 'status', header: 'Trạng thái' },
            ]}
          />
          {isAdminOrDev && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
            >
              Thêm mới
            </Button>
          )}
        </div>
      </div>

      <Card className="shadow-soft-xl border-border/50 dark:border-dark-border/40" noPadding>
        <div className="p-4 flex flex-col md:flex-row items-center gap-3 justify-between border-b border-border/40 dark:border-dark-border/40">
          <div className="flex bg-bg-subtle dark:bg-white/5 p-0.5 rounded-lg w-full md:w-auto border border-border/50 dark:border-dark-border/60">
            {["Tất cả", "Còn hàng", "Hết hàng"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "flex-1 md:flex-none px-4 py-1 text-[10px] font-black rounded-md transition-all duration-300 uppercase tracking-tighter",
                  filter === tab ? "bg-white dark:bg-dark-card text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-full md:w-64">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Tìm sản phẩm…"
              className="h-9 text-[11px]"
              leftIcon={<svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>}
            />
          </div>
        </div>

        <div className="overflow-hidden">
          <Table columns={columns} data={filteredProducts} loading={loading} />
        </div>

        <div className="p-4 border-t border-border/40 dark:border-dark-border/40 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Thêm sản phẩm mới" size="md">
        <CreateProduct onSuccess={() => { setIsCreateModalOpen(false); fetchProduct(); }} />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh sửa sản phẩm" size="md">
        <EditProduct productData={selectedProduct} onSuccess={() => { setIsEditModalOpen(false); fetchProduct(); }} />
      </Modal>
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Chi tiết sản phẩm" size="md">
        <ProductDetail productData={selectedProduct} />
      </Modal>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Xóa sản phẩm "${selectedProduct?.name}"?`}
      />
    </div>
  );
};

export default ProductList;
