const express = require("express");
const router = express.Router();
const inventoryController = require("../controller/inventoryController");
const { verifyToken, checkRole } = require("../middleware/middleware");

router.post("/create", verifyToken, checkRole(["admin", "dev"]), inventoryController.createLog);
router.put("/edit/:id", verifyToken, checkRole(["admin", "dev"]), inventoryController.adjustInventory);
router.delete("/delete/:id", verifyToken, checkRole(["admin", "dev"]), inventoryController.deleteLog);
router.get("/logs", verifyToken, inventoryController.getLogs);
router.get("/low-stock", verifyToken, inventoryController.getLowStockItems);

module.exports = router;
