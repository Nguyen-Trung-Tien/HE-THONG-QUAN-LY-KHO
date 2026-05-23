const db = require("../models");
const { Op } = require("sequelize");
const createOrder = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingLat,
      shippingLng,
      paymentMethod,
      status,
      total,
      shipperId,
      items,
      subtotal,
      shippingFee,
    } = req.body;

    const order = await db.Order.create(
      {
        orderNumber:
          "DH-" + ((await db.Order.count()) + 1).toString().padStart(3, "0"),
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingLat,
        shippingLng,
        paymentMethod,
        status,
        total,
        shipperId,
        subtotal,
        shippingFee,
      },
      { transaction: t }
    );
    if (order.customerId) {
      await db.Customers.increment("orderCount", {
        by: 1,
        where: { id: order.customerId },
        transaction: t,
      });
    }
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const stockRecord = await db.Stock.findOne({
          where: { id: item.productId, deleted: false },
          transaction: t,
        });
        if (!stockRecord) {
          await t.rollback();
          return res.status(400).json({
            message: `Không tìm thấy tồn kho cho sản phẩm ID ${item.productId}`,
          });
        }
        if (stockRecord.stock < item.quantity) {
          await t.rollback();
          return res.status(400).json({
            message: `Số lượng tồn kho không đủ cho sản phẩm ${stockRecord.name}`,
          });
        }
        const oldQuantity = stockRecord.stock;
        await stockRecord.decrement("stock", {
          by: item.quantity,
          transaction: t,
        });

        await db.InventoryLog.create(
          {
            stockId: stockRecord.id,
            userId: null, // Orders are usually placed by customers, but we could link a system user if needed
            change_type: "EXPORT",
            quantity: -item.quantity,
            qtyBefore: oldQuantity,
            qtyAfter: oldQuantity - item.quantity,
            note: `Xuất hàng cho đơn hàng #${order.orderNumber}`,
          },
          { transaction: t }
        );

        await db.OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    res.status(201).json({ message: "Order created", data: order });
  } catch (err) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.OrderItem,
          as: "items",
        },
        { model: db.Shipper, as: "shipper" },
        { model: db.Customers, as: "customer" },
      ],
    });

    const plainOrders = orders.map((order) => order.get({ plain: true }));

    res.json(plainOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, shipperId } = req.body;
    const [updated] = await db.Order.update(
      { status, shipperId },
      { where: { id } }
    );
    if (updated) {
      const updatedOrder = await db.Order.findByPk(id);
      res.status(200).json({ message: "Order updated", data: updatedOrder });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update order", error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const deleted = await db.Order.destroy({ where: { id } });
    if (deleted) {
      if (order.customerId) {
        await db.Customers.decrement("orderCount", {
          by: 1,
          where: { id: order.customerId },
        });
      }
      res.json({ message: "Order deleted" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const findNearestShipper = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Missing latitude or longitude" });
    }

    const shippers = await db.Shipper.findAll({
      where: {
        status: "available",
        lat: { [Op.ne]: null },
        lng: { [Op.ne]: null },
      },
    });

    if (shippers.length === 0) {
      return res.status(404).json({ message: "No available shipper found" });
    }

    let nearestShipper = null;
    let minDistance = Infinity;

    for (const shipper of shippers) {
      const distance = Math.sqrt(
        Math.pow(shipper.lat - lat, 2) + Math.pow(shipper.lng - lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestShipper = shipper;
      }
    }

    if (!nearestShipper) {
      return res.status(404).json({ message: "No shipper found" });
    }

    return res.status(200).json(nearestShipper);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  findNearestShipper,
};
