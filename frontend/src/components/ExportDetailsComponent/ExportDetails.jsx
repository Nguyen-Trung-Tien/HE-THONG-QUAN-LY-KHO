import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  createExportDetail,
  deleteExportDetail,
  fetchExportDetails,
  updateExportDetail,
} from "../../API/exportDetailsApi/exportDetailsApi";
import { FiPlus, FiTrash2, FiSearch, FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";

// Common Components
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

export default function ExportDetails() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    exportId: "",
    productId: "",
    quantity: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const loadData = useCallback(async (page = currentPage, searchQuery = search) => {
    setLoading(true);
    try {
      const res = await fetchExportDetails({
        page,
        limit: itemsPerPage,
        search: searchQuery,
      });
      if (res.data.success) {
        setData(res.data.details || []);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
      }
    } catch {
      toast.error("Lỗi Server 500");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, itemsPerPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        exportId: Number(form.exportId),
        productId: Number(form.productId),
        quantity: Number(form.quantity),
      };
      if (isEditing) await updateExportDetail(editId, payload);
      else await createExportDetail(payload);
      toast.success("Cập nhật thành công!");
      setForm({ exportId: "", productId: "", quantity: "" });
      setIsEditing(false);
      setEditId(null);
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleEdit = (item) => {
    setForm({
      exportId: item.exportId,
      productId: item.productId,
      quantity: item.quantity,
    });
    setIsEditing(true);
    setEditId(item.id);
    setShowModal(true);
  };

  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalRevenue = data.reduce(
    (sum, item) =>
      sum +
      Number(item.StockProductData?.price || 0) * (item.quantity || 0),
    0
  );

  const columns = useMemo(() => [
    {
      title: 'Phiếu xuất',
      key: 'exportId',
      className: 'w-32 text-center',
      render: (id, row) => (
        <div className="flex flex-col">
          <span className="font-black text-primary uppercase tracking-tighter">#{id}</span>
          <span className="text-[10px] text-text-tertiary font-bold uppercase mt-0.5">
            {row.exportReceiptData?.export_date ? new Date(row.exportReceiptData.export_date).toLocaleDateString("vi-VN") : "—"}
          </span>
        </div>
      )
    },
    {
      title: 'Sản phẩm',
      key: 'StockProductData',
      render: (prod) => (
        <div className="flex items-center gap-x-3">
           <div className="size-8 rounded-lg bg-info/5 flex items-center justify-center text-info/60 shrink-0">
              <FiPackage size={16} />
           </div>
           <div className="flex flex-col">
              <span className="font-bold text-text-primary uppercase tracking-tight line-clamp-1">{prod?.name || "—"}</span>
              <span className="text-[9px] text-text-tertiary uppercase font-black tracking-widest mt-0.5">
                {prod?.type} • {prod?.category}
              </span>
           </div>
        </div>
      )
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      className: 'w-32',
      render: (qty, row) => (
        <span className="font-black text-text-primary tracking-tighter">
          {qty} <span className="text-[10px] text-text-tertiary font-medium uppercase">{row.StockProductData?.unit}</span>
        </span>
      )
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, row) => (
        <span className="font-black text-primary tracking-tighter">
          {(row.quantity * (row.StockProductData?.price || 0)).toLocaleString("vi-VN")}đ
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      className: 'text-right',
      render: (_, r) => (
        <div className="flex justify-end space-x-1 scale-90 origin-right">
          <Button 
            variant="ghost" size="icon" className="text-primary hover:bg-primary/10"
            onClick={() => handleEdit(r)}
            title="Chỉnh sửa"
          >
             <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </Button>
          <Button 
            variant="ghost" size="icon" className="text-error hover:bg-error/10"
            onClick={() => {
              setSelectedDetailId(r.id);
              setIsDeleteModalOpen(true);
            }}
            title="Xóa"
          >
            <FiTrash2 className="size-4" />
          </Button>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Badge variant="primary" className="mb-1">Chi tiết</Badge>
          <h2 className="text-xl font-black text-text-primary tracking-tighter uppercase leading-none">
            Lịch sử chi tiết xuất hàng
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm tên sản phẩm…"
              value={search}
              onChange={handleSearchChange}
              className="h-11"
              leftIcon={<FiSearch size={18} />}
            />
          </div>
          <Button
            onClick={() => {
              setForm({ exportId: "", productId: "", quantity: "" });
              setIsEditing(false);
              setShowModal(true);
            }}
            variant="primary"
            leftIcon={<FiPlus />}
            className="rounded-xl shadow-primary/30 h-11"
          >
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="bg-success/5 dark:bg-success/10 border border-success/20 px-5 py-3 rounded-2xl flex items-center gap-x-3 shadow-inner-sm">
           <div className="size-2 rounded-full bg-success animate-pulse" />
           <span className="text-[10px] font-black text-success uppercase tracking-widest">Tổng SL:</span>
           <span className="text-lg font-black text-text-primary tracking-tighter">{totalQuantity.toLocaleString()}</span>
        </div>
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 px-5 py-3 rounded-2xl flex items-center gap-x-3 shadow-inner-sm">
           <div className="size-2 rounded-full bg-primary animate-pulse" />
           <span className="text-[10px] font-black text-primary uppercase tracking-widest">Tổng giá trị:</span>
           <span className="text-lg font-black text-text-primary tracking-tighter">{totalRevenue.toLocaleString()}đ</span>
        </div>
      </div>

      <Card noPadding className="shadow-soft-xl overflow-hidden border-border/50 dark:border-dark-border/40">
        <Table 
          columns={columns} 
          data={data} 
          loading={loading} 
          emptyMessage="Không có dữ liệu chi tiết xuất"
        />
        <div className="p-6 border-t border-border/40 dark:border-dark-border/40 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          try {
            await deleteExportDetail(selectedDetailId);
            toast.success("Xóa thành công!");
            loadData();
          } catch {
            toast.error("Xóa không thành công!");
          }
          setIsDeleteModalOpen(false);
        }}
        title="Xác nhận xóa chi tiết"
        message="Bạn có chắc chắn muốn xóa chi tiết xuất này? Hành động này không thể hoàn tác."
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? "Cập nhật chi tiết xuất" : "Thêm mới chi tiết xuất"}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)} className="rounded-xl h-11 px-6">Hủy</Button>
            <Button variant="primary" onClick={handleSubmit} className="rounded-xl h-11 px-8 shadow-primary/30">
              {isEditing ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <Input
            label="Mã phiếu xuất"
            type="number"
            placeholder="Nhập ID phiếu xuất"
            value={form.exportId}
            onChange={(e) => setForm({ ...form, exportId: e.target.value })}
            required
          />
          <Input
            label="Mã sản phẩm"
            type="number"
            placeholder="Nhập ID sản phẩm"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            required
          />
          <Input
            label="Số lượng xuất"
            type="number"
            placeholder="Nhập số lượng"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
