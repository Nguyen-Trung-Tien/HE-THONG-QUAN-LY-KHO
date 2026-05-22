import React, { useState, useMemo } from "react";

// Common Components
import Button from '../common/Button';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import Badge from '../common/Badge';
import Card from '../common/Card';

const ShipperList = ({
  shippers = [],
  orders = [],
  onAddShipper,
  onDeleteShipper,
  onEditShipper,
  onFocusShipper,
  loading,
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(shippers.length / itemsPerPage) || 1;

  const currentShippers = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return shippers.slice(start, start + itemsPerPage);
  }, [shippers, page, itemsPerPage]);

  const getStatusText = (status) => {
    return status === "delivering" ? "Đang giao" : "Sẵn sàng";
  };

  const getCurrentOrderInfo = (shipper) => {
    if (shipper.status === "delivering" && shipper.currentOrderId) {
      const order = orders.find((o) => o.id === shipper.currentOrderId);
      return order ? `#${order.orderNumber}` : `#${shipper.currentOrderId}`;
    }
    return "Không có";
  };

  const columns = [
    {
      title: 'Shipper',
      key: 'name',
      render: (name, row) => (
        <div className="flex items-center">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center mr-2.5 shrink-0 border border-primary/20 shadow-sm">
            <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-black text-text-primary tracking-tight leading-tight">{name}</div>
            <div className="text-[10px] text-text-tertiary font-bold tracking-tighter">{row.phoneNumber}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (status) => (
        <Badge variant={status === "delivering" ? "accent" : "success"} size="sm">
          {getStatusText(status)}
        </Badge>
      )
    },
    {
      title: 'Đơn hàng',
      key: 'currentOrder',
      render: (_, row) => <span className="text-[10px] font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10">{getCurrentOrderInfo(row)}</span>
    },
    {
      title: 'Vị trí',
      key: 'address',
      render: (address) => (
        <div className="flex items-start gap-1 max-w-[150px] whitespace-normal break-words text-[10px] text-text-secondary font-medium leading-tight">
          <svg className="size-3 text-text-tertiary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{address || "N/A"}</span>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      className: 'text-right',
      render: (_, shipper) => (
        <div className="flex justify-end gap-x-0.5 scale-90 origin-right">
          <Button 
            variant="ghost" size="icon" className="text-info hover:bg-info/10 transition-colors"
            onClick={() => onFocusShipper(shipper.id)}
            title="Xem vị trí"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </Button>
          <Button 
            variant="ghost" size="icon" className="text-primary hover:bg-primary/10 transition-all"
            onClick={() => onEditShipper(shipper)}
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
            variant="ghost" size="icon" className="text-error hover:bg-error/10 transition-colors"
            onClick={() => onDeleteShipper(shipper.id)}
            title="Xóa"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card 
      title="Đội ngũ shipper"
      noPadding
      className="shadow-soft-xl border-border/50"
      extra={
        <Button 
          variant="primary" 
          size="md" 
          onClick={onAddShipper}
          leftIcon={<svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
        >
          Thêm Shipper
        </Button>
      }
    >
      <div className="overflow-hidden">
        <Table 
          columns={columns} 
          data={currentShippers} 
          loading={loading} 
        />
      </div>

      <div className="p-4 border-t border-border/40 flex justify-center">
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      </div>
    </Card>
  );
};

export default ShipperList;