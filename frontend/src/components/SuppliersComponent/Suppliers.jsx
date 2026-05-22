import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../API/suppliersApi/suppliersApi";
import { useSelector } from "react-redux";

// Common Components
import Button from '../common/Button';
import Input from '../common/Input';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import ExportExcel from '../common/ExportExcel';
import ExportPDF from '../common/ExportPDF';

function SuppliersPage() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const editIdRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuppliers = useCallback(async () => {
      setLoading(true);
      try {
        const res = await getAllSuppliers({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        });
        setSuppliers(res.suppliers || []);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        toast.error(error.message || "Failed to fetch suppliers");
        setSuppliers([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }, [currentPage, itemsPerPage, searchTerm]);

    useEffect(() => {
      fetchSuppliers();
    }, [fetchSuppliers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateSupplier(editIdRef.current, form);
        toast.success("Cập nhật nhà cung cấp thành công");
      } else {
        await createSupplier(form);
        toast.success("Thêm nhà cung cấp thành công");
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.message || "Thao tác thất bại");
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      name: supplier.name || "",
      phoneNumber: supplier.phoneNumber || "",
      address: supplier.address || "",
      description: supplier.description || "",
    });
    setIsEditing(true);
    editIdRef.current = supplier.id;
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSupplier) return;
    try {
      await deleteSupplier(selectedSupplier.id);
      toast.success("Xóa thành công");
      fetchSuppliers();
    } catch (error) {
      toast.error(error.message || "Xóa thất bại");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
    }
  };

  const confirmDelete = (supplier) => {
    if (currentUser.role !== "admin") {
      toast.warning("Chỉ Admin mới có quyền xóa!");
      return;
    }
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      title: 'Mã',
      key: 'id',
      className: 'w-16 text-center font-bold text-primary',
    },
    {
      title: 'Nhà cung cấp',
      key: 'name',
      render: (name) => <span className="font-bold text-textPrimary">{name}</span>
    },
    {
      title: 'Số điện thoại',
      key: 'phoneNumber',
      render: (phone) => <span className="text-textSecondary font-medium">{phone || "-"}</span>
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      render: (address) => <div className="max-w-xs truncate text-[11px] text-textSecondary" title={address}>{address || "-"}</div>
    },
    {
      title: 'Mô tả',
      key: 'description',
      render: (desc) => <div className="max-w-xs truncate italic text-text-tertiary text-[11px]">{desc || "-"}</div>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      className: 'text-right',
      render: (_, supplier) => (
        <div className="flex justify-end gap-x-1 scale-90 origin-right">
          <Button 
            variant="ghost" size="icon" className="text-primary hover:bg-primary/10"
            onClick={() => handleEdit(supplier)}
            title="Sửa"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
          <Button 
            variant="ghost" size="icon" className="text-error hover:bg-error/10"
            onClick={() => confirmDelete(supplier)}
            title="Xóa"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <Badge variant="primary" className="mb-1">Đối tác</Badge>
          <h1 className="text-xl font-semibold text-text-primary tracking-tighter">
            NHÀ CUNG CẤP
          </h1>
          <p className="text-[10px] text-text-secondary font-semibold">Đối tác và nguồn cung hàng hóa</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <ExportPDF
            data={suppliers}
            allData={suppliers}
            fileName="Danh_sach_nha_cung_cap"
            title="Danh sách các nhà cung cấp"
            columns={[
              { key: 'id', header: 'Ma NCC' },
              { key: 'name', header: 'Ten nha cung cap' },
              { key: 'phoneNumber', header: 'So dien thoai' },
              { key: 'address', header: 'Dia chi' },
              { key: 'description', header: 'Mo ta' },
            ]}
          />
          <ExportExcel
            data={suppliers}
            allData={suppliers}
            fileName="Danh_sach_nha_cung_cap"
            sheetName="NhaCungCap"
            columns={[
              { key: 'id', header: 'Mã NCC' },
              { key: 'name', header: 'Tên nhà cung cấp' },
              { key: 'phoneNumber', header: 'Số điện thoại' },
              { key: 'address', header: 'Địa chỉ' },
              { key: 'description', header: 'Mô tả' },
            ]}
          />
          <Button 
            variant="primary" 
            size="md"
            onClick={() => {
              setForm({ name: "", phoneNumber: "", address: "", description: "" });
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            leftIcon={<svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
          >
            Thêm đối tác
          </Button>
        </div>
      </div>

      <Card className="shadow-soft-xl border-border/50" noPadding>
        <div className="p-4 flex justify-end border-b border-border/40">
          <div className="w-full md:w-64">
            <Input
              placeholder="Tìm nhà cung cấp…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>
        </div>

        <div className="overflow-hidden">
          <Table 
            columns={columns} 
            data={suppliers} 
            loading={loading} 
            emptyMessage="Không có nhà cung cấp nào."
          />
        </div>

        <div className="p-4 border-t border-border/40 flex justify-center">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Cập nhật đối tác" : "Thêm đối tác cung ứng mới"}
        size="md"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="h-11 px-6">Hủy</Button>
            <Button variant="primary" onClick={handleSubmit} className="h-11 px-8 shadow-primary/30">
              {isEditing ? "Lưu thay đổi" : "Thêm đối tác"}
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
          <Input
            label="Tên nhà cung cấp"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Ví dụ: Công ty TNHH MTV…"
            className="h-10"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số điện thoại"
              value={form.phoneNumber}
              onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="09xx xxx xxx"
              className="h-10"
            />
            <Input
              label="Địa chỉ trụ sở"
              value={form.address}
              onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Thành phố, Tỉnh…"
              className="h-10"
            />
          </div>
          <div className="flex flex-col gap-y-1.5">
            <label 
              htmlFor="supplier-description"
              className="text-[10px] font-semibold text-text-tertiary ml-2 uppercase tracking-widest flex items-center gap-x-1"
            >
              <span>Thông tin mô tả</span>
              <div className="size-1 rounded-full bg-primary/40" />
            </label>
            <textarea
              id="supplier-description"
              className="w-full bg-bg-subtle/30 border border-border/50 text-text-primary text-xs rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm transition-all duration-300 min-h-[100px] resize-none"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Thông tin thêm về sản phẩm cung cấp, chính sách chiết khấu…"
            />
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa nhà cung cấp"
        message={`Bạn có chắc muốn xóa nhà cung cấp "${selectedSupplier?.name}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
}

export default SuppliersPage;
