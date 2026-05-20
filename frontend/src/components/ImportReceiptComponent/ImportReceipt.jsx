import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getAllImportReceipts,
  createImportReceipt,
  updateImportReceipt,
  deleteImportReceipt,
} from "../../API/importReceiptApi/importReceiptApi";
import { getManySupplier } from "../../API/suppliersApi/suppliersApi";
import { getStockProduct } from "../../API/stock/stockAPI";
import { useLocation } from "react-router-dom";
import ReceiptTable from "./ReceiptTable";
import ReceiptFormModal from "./ReceiptFormModal";

// Common Components
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import ConfirmModal from '../common/ConfirmModal';

const CURRENCY_UNIT = "VND";

import Pagination from "../common/Pagination";

export default function ImportReceipt() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [receipts, setReceipts] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  const [receiptFormData, setReceiptFormData] = useState({
    id: null,
    supplierData: null,
    import_date: "",
    note: "",
    details: [],
    userId: null,
    userName: "",
    userEmail: "",
    userRole: "",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openForm) setShowReceiptForm(true);
  }, [location.state]);

  const fetchReceipts = async (page = currentPage, search = searchQuery) => {
    setLoading(true);
    try {
      const res = await getAllImportReceipts({
        page,
        limit: itemsPerPage,
        search,
      });
      if (res.success) {
        setReceipts(res.receipts || []);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.currentPage || 1);
      }
    } catch (e) {
      toast.error("Lỗi khi tải dữ liệu phiếu nhập");
    } finally {
      setLoading(false);
    }
  };

  const fetchStockProducts = async () => {
    try {
      const stocks = await getStockProduct();
      const products = stocks.map((item) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        stock: item.stock,
        price: Number(item.price) || 0,
        type: item.type,
        status: item.status,
        warehouseAddress: item.warehouseAddress,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
      }));
      setProductOptions(products);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await getManySupplier();
      setSupplierOptions([...new Map(data.map((s) => [s.name, s])).values()]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReceipts();
    fetchSuppliers();
    fetchStockProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchReceipts(1, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchReceipts(page, searchQuery);
  };

  const handleReceiptDelete = async () => {
    try {
      await deleteImportReceipt(selectedReceiptId);
      toast.success("Xóa phiếu nhập thành công!");
      fetchReceipts();
    } catch (e) {
      toast.error(`Xóa phiếu nhập thất bại`);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedReceiptId(null);
    }
  };

  const openReceiptForm = (receipt = null) => {
    if (!currentUser || !currentUser.id) {
      toast.warning("Vui lòng đăng nhập lại!");
      return;
    }

    if (receipt) {
      setReceiptFormData({
        id: receipt.id,
        supplierData: receipt.supplierData || null,
        import_date: receipt.import_date?.split("T")[0] || "",
        note: receipt.note || "",
        details:
          receipt.importDetailData?.map((item) => ({
            productId: item.productId || "",
            StockProductData: item.StockProductData || { name: "", unit: "" },
            quantity: item.quantity || 1,
            price: item.price || 0,
          })) || [],
        userId: receipt.userId || currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userEmail: currentUser.email,
      });
    } else {
      setReceiptFormData({
        id: null,
        supplierData: null,
        import_date: new Date().toISOString().split("T")[0],
        note: "",
        details: [
          {
            productId: "",
            StockProductData: { name: "", unit: "" },
            quantity: 1,
            price: 0,
          },
        ],
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userEmail: currentUser.email,
        userRole: currentUser.role,
      });
    }

    setShowReceiptForm(true);
  };

  const handleFormChange = (field, value) => {
    if (field === "userId") value = value ? Number(value) : null;
    
    if (field === "supplierData") {
      setReceiptFormData((prev) => {
        const updatedDetails = prev.details.map((d) => {
          if (value && d.StockProductData?.supplierId && d.StockProductData.supplierId !== value.id) {
            return {
              ...d,
              productId: "",
              StockProductData: { name: "", unit: "" },
              price: 0,
            };
          }
          return d;
        });
        return { ...prev, [field]: value, details: updatedDetails };
      });
      return;
    }
    setReceiptFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailChange = (index, fieldOrObject, value) => {
    setReceiptFormData((prev) => {
      const newDetails = [...prev.details];
      let updatedDetail = { ...newDetails[index] };

      if (typeof fieldOrObject === "object") {
        updatedDetail = { ...updatedDetail, ...fieldOrObject };
      } else {
        updatedDetail[fieldOrObject] = value;
      }
      
      let newSupplierData = prev.supplierData;
      const productId = updatedDetail.productId;
      if (productId) {
        const product = updatedDetail.StockProductData || productOptions.find(p => p.id === productId);
        if (product?.supplierId && (!newSupplierData || newSupplierData.id !== product.supplierId)) {
          const autoSupplier = supplierOptions.find(s => s.id === product.supplierId);
          if (autoSupplier) {
            newSupplierData = autoSupplier;
          }
        }
      }

      newDetails[index] = updatedDetail;
      return { ...prev, details: newDetails, supplierData: newSupplierData };
    });
  };

  const addReceiptDetail = () =>
    setReceiptFormData({
      ...receiptFormData,
      details: [
        ...receiptFormData.details,
        {
          productId: "",
          StockProductData: { name: "", unit: "" },
          quantity: 1,
          price: 0,
        },
      ],
    });

  const removeReceiptDetail = (index) => {
    const newDetails = [...receiptFormData.details];
    newDetails.splice(index, 1);
    setReceiptFormData({ ...receiptFormData, details: newDetails });
  };

  const handleReceiptSubmit = async (e) => {
    if (e) e.preventDefault();
    setFormLoading(true);

    const { supplierData, import_date, userId, details, note } = receiptFormData;

    if (!supplierData?.id || !import_date || !userId || details.length === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      setFormLoading(false);
      return;
    }

    const payload = {
      supplierId: supplierData.id,
      userId,
      import_date,
      note,
      details: details.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      if (receiptFormData.id) {
        await updateImportReceipt(receiptFormData.id, payload);
        toast.success("Cập nhật thành công!");
      } else {
        await createImportReceipt(payload);
        toast.success("Tạo phiếu nhập thành công!");
      }
      setShowReceiptForm(false);
      fetchReceipts();
    } catch (e) {
      toast.error(`Lỗi khi lưu phiếu nhập`);
    } finally {
      setFormLoading(false);
    }
  };

  const calculateTotalCost = (details) =>
    `${details
      .reduce((sum, r) => sum + r.quantity * r.price, 0)
      .toLocaleString("vi-VN")} ${CURRENCY_UNIT}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-textPrimary uppercase tracking-wide">
            Danh sách phiếu nhập
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm kiếm phiếu nhập..."
              value={searchQuery}
              onChange={handleSearchChange}
              icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>
          <Button
            onClick={() => openReceiptForm()}
            variant="gradient"
            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
          >
            Tạo phiếu mới
          </Button>
        </div>
      </div>

      <Card noPadding>
        <ReceiptTable
          receipts={receipts}
          handleEdit={openReceiptForm}
          handleDelete={(id) => {
            if (currentUser.role !== "admin") {
              toast.warning("Chỉ Admin mới có quyền xóa!");
              return;
            }
            setSelectedReceiptId(id);
            setIsDeleteModalOpen(true);
          }}
          CURRENCY_UNIT={CURRENCY_UNIT}
          loading={loading}
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
        onConfirm={handleReceiptDelete}
        title="Xác nhận xóa phiếu nhập"
        message="Bạn có chắc chắn muốn xóa phiếu nhập này? Tất cả chi tiết liên quan cũng sẽ bị xóa."
      />

      <ReceiptFormModal
        show={showReceiptForm}
        onClose={() => setShowReceiptForm(false)}
        formData={receiptFormData}
        handleFormChange={handleFormChange}
        handleDetailChange={handleDetailChange}
        addReceiptDetail={addReceiptDetail}
        removeReceiptDetail={removeReceiptDetail}
        handleSubmit={handleReceiptSubmit}
        formLoading={formLoading}
        supplierOptions={supplierOptions}
        productOptions={
          receiptFormData.supplierData
            ? productOptions.filter(
                (p) =>
                  !p.supplierId ||
                  String(p.supplierId) === String(receiptFormData.supplierData.id)
              )
            : productOptions
        }
        calculateTotalCost={calculateTotalCost}
        CURRENCY_UNIT={CURRENCY_UNIT}
      />
    </div>
  );
}
