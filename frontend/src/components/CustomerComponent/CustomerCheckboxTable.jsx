import React from "react";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import Card from "../common/Card";
import Button from "../common/Button";
import { cn } from "../../utils/cn";

export default function CustomerCheckboxTable({
  customers = [],
  selectedIds = [],
  setSelectedIds,
  handleEdit,
  handleDeleteMultiple,
  loading,
}) {
  // Toggle single checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === (customers?.length || 0)) setSelectedIds([]);
    else setSelectedIds(customers.map((c) => c.id));
  };

  return (
    <Card 
      title={`Danh sách khách hàng (${customers?.length || 0})`}
      extra={
        <Button
          variant="danger"
          size="sm"
          disabled={selectedIds.length === 0}
          onClick={() => handleDeleteMultiple(selectedIds)}
          className="rounded-xl shadow-error/20 px-6"
          leftIcon={<FiTrash2 />}
        >
          Xóa đã chọn ({selectedIds.length})
        </Button>
      }
      className="shadow-soft-xl"
      noPadding
    >
      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-bg-subtle/50 dark:from-white/[0.01] to-white dark:to-dark-card sticky top-0 z-10">
              <th className="px-8 py-5 border-b border-border/30 dark:border-dark-border/40 w-10">
                <input
                  type="checkbox"
                  className="size-4 rounded-md border-border/50 dark:border-dark-border/60 bg-white dark:bg-white/5 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  checked={
                    selectedIds.length === (customers?.length || 0) &&
                    (customers?.length || 0) > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              {["Họ tên", "Email", "Thao tác"].map((h, i) => (
                <th key={i} className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-widest border-b border-border/30 dark:border-dark-border/40">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 dark:divide-dark-border/40">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center opacity-30">
                  <p className="text-xs font-black uppercase tracking-widest">Đang tải dữ liệu...</p>
                </td>
              </tr>
            ) : (customers?.length || 0) === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center opacity-30">
                  <FiTrash2 size={48} className="mx-auto mb-3" />
                  <p className="text-xs font-black uppercase tracking-widest">Chưa có khách hàng nào</p>
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="group hover:bg-primary/[0.02] dark:hover:bg-white/[0.01] transition-all">
                  <td className="px-8 py-5">
                    <input
                      type="checkbox"
                      className="size-4 rounded-md border-border/50 dark:border-dark-border/60 bg-white dark:bg-white/5 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                     <p className="text-xs font-black text-text-primary uppercase tracking-tight group-hover:text-primary transition-colors">{c.name}</p>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                     <p className="text-xs font-bold text-text-secondary">{c.email}</p>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex gap-x-2">
                       <Button 
                        variant="ghost" 
                        size="xs" 
                        onClick={() => handleEdit(c)}
                        className="text-primary hover:bg-primary/10 rounded-lg px-3"
                        leftIcon={<FiEdit3 />}
                       >
                         Sửa
                       </Button>
                       <Button 
                        variant="ghost" 
                        size="xs" 
                        onClick={() => handleDeleteMultiple([c.id])}
                        className="text-error/60 hover:text-error hover:bg-error/10 rounded-lg px-3"
                        leftIcon={<FiTrash2 />}
                       >
                         Xóa
                       </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
