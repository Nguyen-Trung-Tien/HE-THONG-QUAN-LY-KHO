const express = require("express");
const router = express.Router();
const pinController = require("../controller/pinController");
const { verifyToken } = require("../middleware/middleware");

router.post("/set", verifyToken, pinController.setPin);
router.post("/verify", verifyToken, pinController.verifyPin);
router.post("/disable", verifyToken, pinController.disablePin);
router.post("/verify-login", pinController.verifyLoginPIN);

module.exports = router;
