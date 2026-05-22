const express = require("express");
const router = express.Router();
const twoFactorController = require("../controller/twoFactorController");
const { verifyToken } = require("../middleware/middleware");

router.post("/setup", verifyToken, twoFactorController.setup2FA);
router.post("/verify", verifyToken, twoFactorController.verifyAndEnable2FA);
router.post("/disable", verifyToken, twoFactorController.disable2FA);
router.post("/verify-login", twoFactorController.verifyLogin2FA);

module.exports = router;
