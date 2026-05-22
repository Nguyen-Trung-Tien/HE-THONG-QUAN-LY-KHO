"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("InventoryLog");

    if (!tableInfo.stockId && tableInfo.productId) {
      await queryInterface.renameColumn("InventoryLog", "productId", "stockId");
    }

    if (!tableInfo.qtyBefore) {
      await queryInterface.addColumn("InventoryLog", "qtyBefore", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!tableInfo.qtyAfter) {
      await queryInterface.addColumn("InventoryLog", "qtyAfter", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!tableInfo.note) {
      await queryInterface.addColumn("InventoryLog", "note", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    await queryInterface.changeColumn("InventoryLog", "change_type", {
      type: Sequelize.STRING, // Use STRING to avoid ENUM issues across dialects
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally implement down migration
  },
};
