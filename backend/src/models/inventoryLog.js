"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InventoryLog extends Model {

    static associate(models) {
      
      InventoryLog.belongsTo(models.Stock, {
        foreignKey: "stockId",
        as: "stock"
      });

      InventoryLog.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      });
    }
  }

  InventoryLog.init(
    {
      stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Stocks",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      change_type: {
        type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE", "IMPORT", "EXPORT", "ADJUST"),
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      qtyBefore: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      qtyAfter: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "InventoryLog",
      tableName: "InventoryLog", // Match migration table name
      timestamps: true
    }
  );

  return InventoryLog;
};
