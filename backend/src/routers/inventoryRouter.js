const express = require("express");
const router = express.Router();
const inventoryController = require("../controller/inventoryController");
const { verifyToken, checkRole } = require("../middleware/middleware");

router.post("/log", verifyToken, checkRole(["admin", "dev"]), inventoryController.createLog);
router.put("/adjust/:id", verifyToken, checkRole(["admin", "dev"]), inventoryController.adjustInventory);
router.get("/logs", verifyToken, inventoryController.getLogs);
router.get("/low-stock", verifyToken, inventoryController.getLowStockItems);

module.exports = router;
