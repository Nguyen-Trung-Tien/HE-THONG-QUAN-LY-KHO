import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import {
  deleteImportDetail,
  getAllImportDetails,
} from "../../API/importDetailApi/importDetailApi";
import { useSelector } from "react-redux";

// Common Components
import Button from '../common/Button';
import Table from '../common/Table';
import Card from '../common/Card';
import ConfirmModal from '../common/ConfirmModal';

import Pagination from "../common/Pagination";
import Input from "../common/Input";

export default function ImportDetails() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const fetchData = useCallback(async (page = currentPage, search = searchQuery) => {
    try {
      setLoading(true);
      const res = await getAllImportDetails({
        page,
        limit: itemsPerPage,
        search,
      });
      if (res.data.success) {
        setDetails(res.data.details || []);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
      } else {
        setDetails([]);
        toast.error("Không lấy được dữ liệu");
      }
    } catch {
      toast.error("Lỗi kết nối server");
      setDetails([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async () => {
    try {
      await deleteImportDetail(selectedId);
      toast.success("Xóa thành công");
      fetchData();
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedId(null);
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Mã phiếu',
      key: 'importId',
      className: 'w-24 text-center font-bold text-primary',
    },
    {
      title: 'Sản phẩm',
      key: 'StockProductData',
      render: (data) => <span className="font-semibold text-textPrimary">{data?.name || "-"}</span>
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (qty, row) => <span className="font-medium">{qty} {row.StockProductData?.unit}</span>
    },
    {
      title: 'Đơn giá',
      key: 'price',
      render: (price) => <span>{Number(price).toLocaleString("vi-VN")} VND</span>
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, row) => <span className="font-bold text-primary">{(row.quantity * row.price).toLocaleString("vi-VN")} VND</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      className: 'text-right',
      render: (_, item) => (
        <div className="flex justify-end space-x-1 scale-90 origin-right">
          <Button 
            variant="ghost" size="icon" className="text-error hover:bg-error/10"
            onClick={() => {
              if (currentUser.role !== "admin") {
                toast.warning("Chỉ Admin mới có quyền xóa!");
                return;
              }
              setSelectedId(item.id);
              setIsDeleteModalOpen(true);
            }}
            title="Xóa"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </Button>
        </div>
      )
    }
  ], [currentUser, setSelectedId, setIsDeleteModalOpen]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tighter uppercase">
            Chi tiết các lần nhập hàng
          </h2>
        </div>
        <div className="w-full sm:w-80">
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchQuery}
            onChange={handleSearchChange}
            leftIcon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />
        </div>
      </div>

      <Card noPadding>
        <Table 
          columns={columns} 
          data={details} 
          loading={loading} 
          emptyMessage="Không có dữ liệu chi tiết nào"
        />
        <div className="px-6 pb-6">
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
        onConfirm={handleDelete}
        title="Xác nhận xóa chi tiết"
        message="Bạn có chắc chắn muốn xóa chi tiết nhập hàng này? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
