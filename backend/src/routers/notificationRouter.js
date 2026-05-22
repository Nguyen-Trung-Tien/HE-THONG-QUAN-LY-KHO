const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");
const { verifyToken, checkRole } = require("../middleware/middleware");

router.get("/get-all", notificationController.getNotifications);
router.put("/mark-as-read/:id", notificationController.markAsRead);
router.post("/create", verifyToken, checkRole(["admin", "dev"]), notificationController.create);
router.delete("/delete/:id", verifyToken, checkRole(["admin", "dev"]), notificationController.deleteNotification);

module.exports = router;
