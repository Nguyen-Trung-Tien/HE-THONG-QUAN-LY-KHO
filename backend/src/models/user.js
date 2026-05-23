"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.ImportReceipts, {
        foreignKey: "userId",
        as: "importReceiptData",
      });
      User.hasMany(models.Session, {
        foreignKey: "userId",
        as: "sessions",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      role: DataTypes.STRING,
      status: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.TEXT("long"),
      refresh_token: DataTypes.TEXT,
      is2FAEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      twoFactorSecret: DataTypes.STRING,
      securityPin: DataTypes.STRING,
      isPinEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notifEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      notifBrowser: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      notifStockAlert: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      preferredTheme: {
        type: DataTypes.STRING,
        defaultValue: "light",
      },
      systemName: {
        type: DataTypes.STRING,
        defaultValue: "Smart WMS Pro",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );
  return User;
};
