const express = require("express");
const router = express.Router();
const stockController = require("../controller/stockController");
const { verifyToken, checkRole } = require("../middleware/middleware");

router.get("/expiry-alerts", verifyToken, stockController.getExpiryAlerts);
router.get("/low-stock", verifyToken, stockController.getLowOrOutOfStock);
router.get("/", verifyToken, stockController.getAllStocks);
router.get("/:id", verifyToken, stockController.getStockById);
router.put("/:id", verifyToken, checkRole(["admin", "dev"]), stockController.updateStock);
router.delete("/:id", verifyToken, checkRole(["admin", "dev"]), stockController.deleteStock);

module.exports = router;

