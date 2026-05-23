const { Op } = require("sequelize");
const db = require("../models");

module.exports = {
  createLog: async (req, res) => {
    const { productId, quantity, note, userId, location } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Thiếu productId hoặc quantity" });
    }

    try {
      let stock = await db.Stock.findOne({ where: { productId } });
      if (!stock) {
        stock = await db.Stock.create({
          productId,
          stock: 0,
          warehouseAddress: location || null,
        });
      }

      const oldQuantity = stock.stock;
      const newQuantity = oldQuantity + quantity;

      if (quantity < 0 && newQuantity < 0) {
        return res
          .status(400)
          .json({ message: "Số lượng tồn không đủ để xuất" });
      }

      await stock.update({ stock: newQuantity, warehouseAddress: location });

      await db.InventoryLog.create({
        stockId: stock.id,
        userId: userId || null,
        change_type: quantity >= 0 ? "IMPORT" : "EXPORT",
        quantity,
        qtyBefore: oldQuantity,
        qtyAfter: newQuantity,
        note,
      });

      return res.status(201).json({
        message: "Cập nhật tồn kho thành công",
        data: { stock, newQuantity },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },

  adjustInventory: async (req, res) => {
    const { id } = req.params;
    const { newQuantity, note, userId } = req.body;
    try {
      const stock = await db.Stock.findByPk(id);
      if (!stock)
        return res.status(404).json({ message: "Không tìm thấy stock" });

      const oldQuantity = stock.stock;
      await stock.update({ stock: newQuantity });

      await db.InventoryLog.create({
        stockId: stock.id,
        userId: userId || null,
        change_type: "ADJUST",
        quantity: newQuantity - oldQuantity,
        qtyBefore: oldQuantity,
        qtyAfter: newQuantity,
        note,
      });

      return res.json({
        message: "Điều chỉnh tồn kho thành công",
        data: stock,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },

  getLogs: async (req, res) => {
    try {
      const { productId, type, from, to, userId } = req.query;
      const where = {};
      if (type) where.change_type = type;
      if (userId) where.userId = userId;
      if (from && to)
        where.createdAt = { [Op.between]: [new Date(from), new Date(to)] };

      const logs = await db.InventoryLog.findAll({
        where,
        include: [
          {
            model: db.Stock,
            as: "stock",
            attributes: ["id", "stock", "productId"],
            include: [
              { model: db.Product, as: "product", attributes: ["id", "name"] },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const result = productId
        ? logs.filter((l) => l.stock && l.stock.productId == productId)
        : logs;

      return res.json(result);
    } catch (err) {
      console.error("Error in getLogs:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy lịch sử hoạt động", error: err.message });
    }
  },

  getLowStockItems: async (req, res) => {
    try {
      const lowStockItems = await db.Stock.findAll({
        where: {
          deleted: false,
          stock: {
            [Op.lte]: db.sequelize.col("Stock.minStock"),
          },
        },
        include: [
          { model: db.Product, as: "product", attributes: ["id", "name"] },
        ],
      });
      return res.json(lowStockItems);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },

  deleteLog: async (req, res) => {
    try {
      const { id } = req.params;
      const log = await db.InventoryLog.findByPk(id);
      if (!log) return res.status(404).json({ message: "Không tìm thấy log" });

      await log.destroy();
      return res.json({ message: "Xóa log thành công" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  },
};
