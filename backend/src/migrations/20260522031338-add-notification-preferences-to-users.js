"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "notifEmail", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "notifBrowser", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "notifStockAlert", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "preferredLanguage", {
      type: Sequelize.STRING,
      defaultValue: "vi",
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "preferredTheme", {
      type: Sequelize.STRING,
      defaultValue: "light",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "notifEmail");
    await queryInterface.removeColumn("Users", "notifBrowser");
    await queryInterface.removeColumn("Users", "notifStockAlert");
    await queryInterface.removeColumn("Users", "preferredLanguage");
    await queryInterface.removeColumn("Users", "preferredTheme");
  },
};
