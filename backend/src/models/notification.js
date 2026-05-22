"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    static associate(models) {
      Notifications.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userData",
      });
    }
  }
  Notifications.init(
    {
      type: DataTypes.STRING, // 'stock', 'order', 'alert', 'info'
      title: DataTypes.STRING,
      message: DataTypes.TEXT,
      userId: DataTypes.INTEGER, // Specific user or NULL for all
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notifications",
    }
  );
  return Notifications;
};
