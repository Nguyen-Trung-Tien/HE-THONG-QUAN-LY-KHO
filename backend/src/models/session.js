"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userData",
      });
    }
  }
  Session.init(
    {
      userId: DataTypes.INTEGER,
      refreshToken: DataTypes.TEXT,
      device: DataTypes.STRING,
      ipAddress: DataTypes.STRING,
      location: DataTypes.STRING,
      lastActive: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Session",
      tableName: "Sessions",
    }
  );
  return Session;
};
