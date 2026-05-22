import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchExportReceipts,
  createExportReceipt,
  updateExportReceipt,
  deleteExportReceipt,
} from "../../API/exportReceiptsApi/exportReceiptsApi";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";
import ExportExcel from "../common/ExportExcel";
import ExportPDF from "../common/ExportPDF";

// Common Components
import Button from "../common/Button";
import Input from "../common/Input";
import Card from "../common/Card";
import Table from "../common/Table";
import Badge from "../common/Badge";
import Modal from "../common/Modal";

export default function ExportReceiptsTable() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const selectedReceiptIdRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    userId: "",
    export_date: "",
    reason: "",
    note: "",
    userName: "",
    userEmail: "",
    userRole: "",
  });
  const currentUser = useSelector((state) => state.user.currentUser);

  const [details, setDetails] = useState([{ productId: "", quantity: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const editIdRef = useRef(null);

  const loadData = useCallback(
    (page = currentPage, search = searchQuery) => {
      setLoading(true);
      fetchExportReceipts({
        page,
        limit: itemsPerPage,
        search,
      })
        .then((res) => {
          if (res.data.success) {
            setReceipts(res.data.receipts || []);
            setTotalPages(res.data.totalPages || 1);
            setCurrentPage(res.data.currentPage || 1);
          }
        })
        .catch(() => {
          toast.error("Lỗi tải dữ liệu!");
        })
        .finally(() => setLoading(false));
    },
    [currentPage, searchQuery, itemsPerPage],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDetailChange = (index, field, value) => {
    setDetails((prev) => {
      const newDetails = [...prev];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return newDetails;
    });
  };

  const addDetail = () =>
    setDetails((prev) => [...prev, { productId: "", quantity: "" }]);
  const removeDetail = (index) =>
    setDetails((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, exportDetailData: details };
    const action = isEditing
      ? updateExportReceipt(editIdRef.current, payload)
      : createExportReceipt(payload);

    action
      .then(() => {
        loadData();
        closeModal();
        toast.success(
          isEditing
            ? "Cập nhật phiếu xuất thành công!"
            : "Thêm phiếu xuất thành công!",
        );
      })
      .catch(() => toast.error("Đã có lỗi xảy ra!"));
  };

  const openModal = () => {
    setIsModalOpen(true);

    if (!isEditing && currentUser) {
      setForm((prev) => ({
        ...prev,
        userId: currentUser.id || "",
        userName: `${currentUser.firstName || ""} ${
          currentUser.lastName || ""
        }`.trim(),
        userEmail: currentUser.email || "",
        userRole: currentUser.role || "",
        export_date: new Date().toISOString().split("T")[0],
      }));
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setForm({
      userId: "",
      userName: "",
      userEmail: "",
      userRole: "",
      export_date: "",
      reason: "",
      note: "",
    });
    setDetails([{ productId: "", quantity: "" }]);
    setIsEditing(false);
    editIdRef.current = null;
  };

  const handleEdit = (receipt) => {
    setForm({
      userId: receipt.userId,
      export_date: receipt.export_date?.split("T")[0],
      reason: receipt.reason,
      note: receipt.note,
      userName: receipt.userData?.firstName || "",
      userRole: receipt.userData?.role || "",
    });
    setDetails(
      receipt.exportDetailData?.map((d) => ({
        productId: d.productId,
        quantity: d.quantity,
      })) || [{ productId: "", quantity: "" }],
    );
    editIdRef.current = receipt.id;
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Mã",
      key: "id",
      className: "w-16 text-center font-bold text-primary",
    },
    {
      title: "Người xuất",
      key: "userData",
      render: (_, r) => (
        <div className="flex flex-col">
          <span className="font-semibold text-textPrimary">
            {r.userData?.firstName || "N/A"}
          </span>
          <span className="text-[10px] text-text-tertiary font-bold uppercase">
            {r.userData?.role}
          </span>
        </div>
      ),
    },
    {
      title: "Ngày xuất",
      key: "export_date",
      render: (date) => (
        <span className="text-textSecondary">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Lý do",
      key: "reason",
      className: "max-w-[150px] truncate",
    },
    {
      title: "Sản phẩm",
      key: "exportDetailData",
      render: (details) => (
        <div className="flex flex-wrap gap-1">
          {details?.slice(0, 2).map((d, i) => (
            <Badge key={d.productId || i} variant="info" size="sm">
              {d.StockProductData?.name || d.productId} (x{d.quantity})
            </Badge>
          ))}
          {details?.length > 2 && (
            <Badge variant="neutral" size="sm">
              +{details.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      className: "text-right",
      render: (_, r) => (
        <div className="flex justify-end gap-x-1 scale-90 origin-right">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
            onClick={() => handleEdit(r)}
            title="Chỉnh sửa"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            variant="ghost"
            size="icon"
            className="text-error hover:bg-error/10"
            onClick={() => {
              if (currentUser.role !== "admin") {
                toast.warning("Chỉ Admin mới có quyền xóa!");
                return;
              }
              selectedReceiptIdRef.current = r.id;
              setIsDeleteModalOpen(true);
            }}
            title="Xóa"
          >
            <FiTrash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary tracking-tighter">
            DANH SÁCH PHIẾU XUẤT
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ExportPDF
            data={receipts}
            fileName="Danh_sach_phieu_xuat"
            title="Danh sách phiếu xuất kho"
            columns={[
              { key: 'id', header: 'Ma phieu' },
              { key: 'export_date', header: 'Ngay xuat' },
              { key: 'userData.firstName', header: 'Nguoi xuat' },
              { key: 'reason', header: 'Ly do' },
              { key: 'note', header: 'Ghi chu' },
            ]}
          />
          <ExportExcel
            data={receipts}
            allData={receipts}
            fileName="Danh_sach_phieu_xuat"
            sheetName="PhieuXuat"
            columns={[
              { key: 'id', header: 'Mã phiếu' },
              { key: 'export_date', header: 'Ngày xuất' },
              { key: 'userData.firstName', header: 'Người xuất' },
              { key: 'reason', header: 'Lý do' },
              { key: 'note', header: 'Ghi chú' },
            ]}
          />
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm kiếm lý do, ghi chú…"
              value={searchQuery}
              onChange={handleSearchChange}
              leftIcon={
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
          <Button onClick={openModal} variant="primary" leftIcon={<FiPlus />}>
            Thêm mới
          </Button>
        </div>
      </div>

      <Card noPadding>
        <Table
          columns={columns}
          data={receipts}
          loading={loading}
          emptyMessage="Không tìm thấy phiếu xuất nào"
        />
        <div className="px-6 py-4 flex justify-center">
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
        onConfirm={() => {
          deleteExportReceipt(selectedReceiptIdRef.current)
            .then(() => {
              loadData();
              toast.success("Xóa phiếu xuất thành công!");
            })
            .catch(() => toast.error("Xóa phiếu xuất thất bại!"));
          setIsDeleteModalOpen(false);
        }}
        title="Xác nhận xóa phiếu xuất"
        message="Bạn có chắc chắn muốn xóa phiếu xuất này? Tất cả chi tiết liên quan cũng sẽ bị xóa."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "Cập nhật phiếu xuất kho" : "Khởi tạo phiếu xuất mới"}
        size="lg"
        footer={
          <div className="flex justify-between items-center w-full">
             <div className="flex flex-col">
              <span className="text-[9px] font-semibold text-text-tertiary uppercase tracking-widest">Danh mục hàng</span>
              <span className="text-xl font-semibold text-primary tracking-tighter">
                {details.length} Mặt hàng
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={closeModal} className="h-11 px-6">Hủy</Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                className="h-11 px-8 shadow-primary/30"
              >
                {isEditing ? "Lưu thay đổi" : "Xuất kho"}
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2.5 mb-1 px-1">
              <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-[10px] font-semibold text-text-primary uppercase tracking-[0.2em]">Thông tin chung</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg-subtle/30 p-6 rounded-[1.5rem] border border-border/40 shadow-inner-sm">
              <Input
                label="Ngày xuất"
                type="date"
                name="export_date"
                value={form.export_date}
                onChange={handleChange}
                required
                className="bg-white h-10"
              />
              <Input
                label="Lý do xuất"
                name="reason"
                placeholder="Bán lẻ, Trả hàng…"
                value={form.reason}
                onChange={handleChange}
                required
                className="bg-white h-10"
              />
              <Input
                label="Nhân viên"
                value={form.userName}
                disabled
                containerClassName="col-span-2"
                className="bg-bg-subtle/50 opacity-70 h-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-x-2.5">
                <div className="size-7 rounded-lg bg-error/10 flex items-center justify-center text-error">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="text-[10px] font-semibold text-text-primary uppercase tracking-[0.2em]">Danh mục hàng xuất</h4>
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={addDetail}
                leftIcon={<FiPlus className="stroke-[3px]" />}
                className="rounded-xl border-dashed px-4"
              >
                Thêm dòng
              </Button>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar border border-border/40 rounded-[1.5rem] p-4 flex flex-col gap-y-3 bg-white shadow-soft-xl">
              {details.map((d, i) => (
                <div key={d.productId || i} className="flex gap-3 items-end p-3 bg-bg-subtle/20 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-300">
                  <div className="flex-1">
                    <Input
                      label={i === 0 ? "Mã sản phẩm" : ""}
                      type="number"
                      placeholder="ID"
                      value={d.productId}
                      min={1}
                      onChange={(e) =>
                        handleDetailChange(i, "productId", e.target.value)
                      }
                      required
                      className="bg-white h-9"
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label={i === 0 ? "Số lượng" : ""}
                      type="number"
                      placeholder="0"
                      value={d.quantity}
                      min={1}
                      onChange={(e) =>
                        handleDetailChange(i, "quantity", e.target.value)
                      }
                      required
                      className="bg-white h-9"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-error/40 hover:text-error hover:bg-error/10 mb-0.5 rounded-lg"
                    onClick={() => removeDetail(i)}
                  >
                    <FiTrash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="px-1">
            <Input
              label="Ghi chú"
              name="note"
              placeholder="Nhập ghi chú thêm…"
              value={form.note}
              onChange={handleChange}
              className="bg-bg-subtle/20 h-10"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
