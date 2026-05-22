import React, { useEffect, useState, useCallback } from "react";
import { getInventoryLogs } from "../../API/inventory/inventoryAPI";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInventoryLogs(filterType ? { type: filterType } : {});
      setLogs(data || []);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử hoạt động:", error);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getTypeLabel = (type) => {
    switch (type) {
      case "IMPORT":
      case "import":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Nhập kho</span>;
      case "EXPORT":
      case "export":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Xuất kho</span>;
      case "ADJUST":
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Điều chỉnh</span>;
      case "create":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Tạo mới</span>;
      case "update":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Cập nhật</span>;
      case "delete":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Xóa</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{type}</span>;
    }
  };

  return (
    <div className="bg-card shadow-card rounded-lg overflow-hidden mt-8">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-textPrimary">Lịch sử hoạt động (Audit Logs)</h2>
          <div className="flex space-x-2">
            <select
              className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tất cả thao tác</option>
              <option value="IMPORT">Nhập kho</option>
              <option value="EXPORT">Xuất kho</option>
              <option value="ADJUST">Điều chỉnh</option>
            </select>
            <button
              onClick={fetchLogs}
              className="px-3 py-2 bg-gray-100 text-textSecondary rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-textSecondary">Đang tải lịch sử...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-textSecondary">Không có dữ liệu lịch sử hoạt động.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Thao tác</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Mã SP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Số lượng thay đổi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Người thực hiện</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeLabel(log.change_type)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {log.stock?.productId || log.stockId}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={log.quantity > 0 ? "text-green-600 font-bold" : log.quantity < 0 ? "text-red-600 font-bold" : "text-gray-600"}>
                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ID: {log.userId || "Hệ thống"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.note}>
                      {log.note || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;
