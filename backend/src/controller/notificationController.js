const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;
    const data = await notificationService.getNotifications(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationService.markAsRead(id);
    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await notificationService.createNotification(req.body);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(id);
    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  create,
  deleteNotification,
};
