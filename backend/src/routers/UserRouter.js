const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");
const { verifyToken, checkRole } = require("../middleware/middleware");

router.post("/create-new-user", verifyToken, checkRole(["admin", "dev"]), UserController.handleCreateNewUser);
router.get("/get-all-user", verifyToken, checkRole(["admin", "dev"]), UserController.handleGetAllUsers);
router.post("/login-user", UserController.handleLoginUser);
router.put("/update-user", verifyToken, checkRole(["admin", "dev"]), UserController.handleUpdateUser);
router.put("/change-password", verifyToken, UserController.handleChangePassword);
router.delete("/delete-user", verifyToken, checkRole(["admin", "dev"]), UserController.handleDeleteUser);
router.post("/refresh-token", UserController.handleRefreshToken);
router.post("/logout", UserController.handleLogout);
router.get("/sessions", verifyToken, UserController.getSessions);
router.delete("/sessions/:id", verifyToken, UserController.revokeSession);
router.put("/update-preferences", verifyToken, UserController.handleUpdatePreferences);
module.exports = router;
