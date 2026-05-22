import React, { useState } from "react";
import CustomerOrderHistory from "./CustomerOrderHistory";

// Common Components
import Button from '../common/Button';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import Card from '../common/Card';

export default function CustomerTable({
  customers,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onEdit,
  onDelete,
  loading,
  page,
  totalPages,
  onPageChange,
}) {
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleShowOrderHistory = (customer) => {
    setSelectedCustomer(customer);
    setShowOrderHistory(true);
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedIds.length === customers.length && customers.length > 0}
          onChange={toggleSelectAll}
          className="accent-primary rounded"
        />
      ),
      key: 'checkbox',
      className: 'w-12',
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelect(row.id)}
          className="accent-primary rounded"
        />
      )
    },
    {
      title: 'Họ và tên',
      key: 'name',
      render: (name) => <span className="text-[11px] font-bold text-text-primary tracking-tight">{name}</span>
    },
    {
      title: 'Email',
      key: 'email',
      className: 'text-[11px] text-text-secondary'
    },
    {
      title: 'Số điện thoại',
      key: 'phoneNumber',
      render: (phone) => <span className="text-[11px]">{phone || "-"}</span>
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      render: (address) => <div className="max-w-[150px] truncate text-[10px] text-text-tertiary font-medium" title={address}>{address || "-"}</div>
    },
    {
      title: 'Đơn hàng',
      key: 'orderCount',
      render: (count, row) => (
        <button
          className="text-primary hover:underline text-[11px] font-black"
          onClick={() => handleShowOrderHistory(row)}
        >
          {count || 0} đơn
        </button>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex justify-end gap-x-0.5 scale-90 origin-right">
          <Button 
            variant="ghost" size="icon" className="text-primary hover:bg-primary/10 transition-all"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa"
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
            onClick={() => onDelete(row)}
            title="Xóa"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card noPadding className="shadow-soft-xl border-border/50">
      <div className="overflow-hidden">
        <Table 
          columns={columns} 
          data={customers} 
          loading={loading} 
          emptyMessage="Không tìm thấy khách hàng nào"
        />
      </div>
      
      <div className="p-4 border-t border-border/40 flex justify-center">
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
          className="mt-0"
        />
      </div>

      {showOrderHistory && selectedCustomer && (
        <CustomerOrderHistory
          customerId={selectedCustomer.id}
          onClose={() => setShowOrderHistory(false)}
        />
      )}
    </Card>
  );
}