const express = require("express");
const router = express.Router();
const backupController = require("../controller/backupController");
const { verifyToken, checkRole } = require("../middleware/middleware");

router.get("/check-connection", verifyToken, checkRole(["admin", "dev"]), backupController.checkConnection);
router.get("/export-sql", verifyToken, checkRole(["admin", "dev"]), backupController.exportSQL);
router.post("/create", verifyToken, checkRole(["admin", "dev"]), backupController.createBackup);

module.exports = router;
