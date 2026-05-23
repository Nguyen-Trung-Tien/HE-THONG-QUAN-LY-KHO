const db = require("../models/index");

const getAllExportReceipts = async ({ page, limit, search }) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    const { Op } = require("sequelize");
    where[Op.or] = [
      { reason: { [Op.like]: `%${search}%` } },
      { note: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await db.ExportReceipts.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      { model: db.User, as: "userData" },
      {
        model: db.ExportDetails,
        as: "exportDetailData",
        include: [{ model: db.Stock, as: "StockProductData" }],
      },
    ],
    distinct: true,
    order: [["export_date", "DESC"], ["id", "DESC"]],
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    receipts: rows,
  };
};

const getExportReceiptById = async (id) => {
  const receipt = await db.ExportReceipts.findByPk(id, {
    include: [
      { model: db.User, as: "userData" },
      {
        model: db.ExportDetails,
        as: "exportDetailData",
        include: [{ model: db.Stock, as: "StockProductData" }],
      },
    ],
  });
  if (!receipt) throw new Error("Export receipt not found");
  return receipt;
};

const createExportReceipt = async (data) => {
  const { exportDetailData, ...receiptData } = data;
  const t = await db.sequelize.transaction();

  try {
    const receipt = await db.ExportReceipts.create(receiptData, { transaction: t });

    if (exportDetailData && exportDetailData.length > 0) {
      for (const d of exportDetailData) {
        const stock = await db.Stock.findByPk(d.productId, { transaction: t });
        if (!stock) throw new Error(`Stock with ID ${d.productId} not found`);
        if (stock.stock < d.quantity) throw new Error(`Insufficient stock for product ${stock.name}`);

        const oldQuantity = stock.stock;
        await stock.decrement("stock", { by: d.quantity, transaction: t });

        await db.ExportDetails.create({
          exportId: receipt.id,
          productId: d.productId,
          quantity: d.quantity,
        }, { transaction: t });

        await db.InventoryLog.create({
          stockId: stock.id,
          userId: receiptData.userId || null,
          change_type: "EXPORT",
          quantity: -d.quantity,
          qtyBefore: oldQuantity,
          qtyAfter: oldQuantity - d.quantity,
          note: `Xuất hàng từ phiếu #${receipt.id}`,
        }, { transaction: t });
      }
    }

    await t.commit();
    return await getExportReceiptById(receipt.id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const updateExportReceipt = async (id, data) => {
  const { exportDetailData, ...receiptData } = data;
  const t = await db.sequelize.transaction();

  try {
    const receipt = await db.ExportReceipts.findByPk(id, { transaction: t });
    if (!receipt) throw new Error("Export receipt not found");

    // 1. Revert old stock levels
    const oldDetails = await db.ExportDetails.findAll({
      where: { exportId: id },
      transaction: t,
    });

    for (const oldItem of oldDetails) {
      const stock = await db.Stock.findByPk(oldItem.productId, { transaction: t });
      if (stock) {
        await stock.increment("stock", { by: Number(oldItem.quantity), transaction: t });
      }
    }

    // 2. Update receipt info
    await receipt.update(receiptData, { transaction: t });

    // 3. Replace details and apply new stock levels
    await db.ExportDetails.destroy({ where: { exportId: id }, transaction: t });

    if (exportDetailData && exportDetailData.length > 0) {
      for (const d of exportDetailData) {
        const stock = await db.Stock.findByPk(d.productId, { transaction: t });
        if (!stock) throw new Error(`Stock with ID ${d.productId} not found`);
        
        const oldQuantity = stock.stock;
        if (oldQuantity < d.quantity) throw new Error(`Insufficient stock for product ${stock.name}`);

        await stock.decrement("stock", { by: d.quantity, transaction: t });

        await db.ExportDetails.create({
          exportId: id,
          productId: d.productId,
          quantity: d.quantity,
        }, { transaction: t });

        await db.InventoryLog.create({
          stockId: stock.id,
          userId: receiptData.userId || null,
          change_type: "EXPORT",
          quantity: -d.quantity,
          qtyBefore: oldQuantity,
          qtyAfter: oldQuantity - d.quantity,
          note: `Cập nhật phiếu xuất #${id}`,
        }, { transaction: t });
      }
    }

    await t.commit();
    return await getExportReceiptById(id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const deleteExportReceipt = async (id) => {
  const t = await db.sequelize.transaction();
  try {
    const receipt = await db.ExportReceipts.findByPk(id, { transaction: t });
    if (!receipt) throw new Error("Export receipt not found");

    // Revert stock before deleting
    const details = await db.ExportDetails.findAll({
      where: { exportId: id },
      transaction: t,
    });

    for (const item of details) {
      const stock = await db.Stock.findByPk(item.productId, { transaction: t });
      if (stock) {
        await stock.increment("stock", { by: Number(item.quantity), transaction: t });
      }
    }

    await db.ExportDetails.destroy({ where: { exportId: id }, transaction: t });
    await receipt.destroy({ transaction: t });
    
    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

module.exports = {
  getAllExportReceipts,
  getExportReceiptById,
  createExportReceipt,
  updateExportReceipt,
  deleteExportReceipt,
};
