const db = require("../models");

const getNotifications = async (userId) => {
  try {
    const { Op } = require("sequelize");
    const parsedUserId = userId ? parseInt(userId) : null;

    const where = {
      [Op.or]: [{ userId: null }],
    };

    if (parsedUserId) {
      where[Op.or].push({ userId: parsedUserId });
    }

    return await db.Notifications.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
  } catch (err) {
    throw err;
  }
};

const markAsRead = async (id) => {
  try {
    return await db.Notifications.update({ read: true }, { where: { id } });
  } catch (err) {
    throw err;
  }
};

const createNotification = async (data) => {
  try {
    return await db.Notifications.create(data);
  } catch (err) {
    throw err;
  }
};

const deleteNotification = async (id) => {
  try {
    return await db.Notifications.destroy({ where: { id } });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
};
