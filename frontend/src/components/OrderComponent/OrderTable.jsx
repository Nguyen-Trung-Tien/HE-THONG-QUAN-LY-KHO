import React, { useState, useMemo, useRef } from "react";
import OrderDetail from "./OrderDetail";
import { deleteOrder } from "../../API/orders/ordersApi";
import { toast } from "react-toastify";

// Common Components
import Button from '../common/Button';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import Badge from '../common/Badge';
import Card from '../common/Card';
import ConfirmModal from '../common/ConfirmModal';
import ExportExcel from '../common/ExportExcel';
import ExportPDF from '../common/ExportPDF';

const statusMap = {
  pending: {
    text: "Chờ xác nhận",
    variant: "warning",
  },
  finding_shipper: {
    text: "Tìm shipper",
    variant: "info",
  },
  shipping: {
    text: "Đang giao",
    variant: "accent",
  },
  delivered: {
    text: "Đã giao",
    variant: "success",
  },
  cancelled: {
    text: "Đã hủy",
    variant: "error",
  },
};

const OrderTable = ({ orders, loading, onCreateOrder, onOrderChanged }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderToDeleteRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [orders, currentPage]);

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderToDeleteRef.current);
      toast.success("Xóa đơn hàng thành công");
      setIsDeleteModalOpen(false);
      onOrderChanged();
    } catch (error) {
      console.error("Delete order error:", error);
      toast.error("Không thể xóa đơn hàng");
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      key: 'orderNumber',
      render: (val) => <span className="text-[11px] font-black text-text-primary tracking-tighter">{val}</span>
    },
    {
      title: 'Khách hàng',
      key: 'customerName',
      className: 'text-[11px] font-bold truncate max-w-[120px]'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (status) => {
        const info = statusMap[status] || { text: status, variant: 'neutral' };
        return <Badge variant={info.variant} size="sm">{info.text}</Badge>;
      }
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      render: (val) => <span className="text-[11px] font-black text-primary">{val?.toLocaleString()}đ</span>
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (date) => <span className="text-text-tertiary text-[10px] font-bold uppercase">{new Date(date).toLocaleDateString("vi-VN")}</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      className: 'text-right',
      render: (_, order) => (
        <div className="flex justify-end gap-x-0.5 scale-90 origin-right">
          <Button 
            variant="ghost" size="icon" className="text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setSelectedOrder(order)}
            title="Xem chi tiết"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </Button>
          <Button 
            variant="ghost" size="icon" className="text-error hover:bg-error/10 transition-colors"
            onClick={() => {
              orderToDeleteRef.current = order.id;
              setIsDeleteModalOpen(true);
            }}
            title="Xóa"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <Card 
        title={`Đơn hàng gần đây`}
        extra={
          <div className="flex items-center gap-x-3">
             <ExportPDF
                data={orders}
                fileName="Danh_sach_don_hang"
                title="Báo cáo danh sách đơn hàng"
                columns={[
                  { key: 'orderNumber', header: 'Ma don' },
                  { key: 'customerName', header: 'Khach hang' },
                  { key: 'status', header: 'Trang thai' },
                  { key: 'total', header: 'Tong tien' },
                  { key: 'createdAt', header: 'Ngay tao' },
                ]}
             />
             <ExportExcel
                data={orders}
                allData={orders}
                fileName="Danh_sach_don_hang"
                sheetName="DonHang"                columns={[
                  { key: 'orderNumber', header: 'Mã đơn' },
                  { key: 'customerName', header: 'Khách hàng' },
                  { key: 'status', header: 'Trạng thái' },
                  { key: 'total', header: 'Tổng tiền' },
                  { key: 'createdAt', header: 'Ngày tạo' },
                ]}
             />
             <Badge variant="neutral" size="sm" className="bg-bg-subtle">{orders.length} mục</Badge>
             <Button 
                variant="primary" 
                size="md" 
                onClick={onCreateOrder}
                leftIcon={<svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
              >
                Tạo đơn
              </Button>
          </div>
        }
        noPadding
      >
        <div className="overflow-hidden">
          <Table 
            columns={columns} 
            data={paginatedOrders} 
            loading={loading} 
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOrder}
        title="Xác nhận xóa đơn hàng"
        message="Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác."
      />

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};
export default OrderTable;
