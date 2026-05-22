const UserService = require("../services/userService");
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const handleCreateNewUser = async (req, res) => {
  const message = await UserService.createNewUser(req.body);
  return res.status(200).json(message);
};

const UAParser = require("ua-parser-js");

const handleLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"];
    const ip = req.ip || req.connection.remoteAddress;

    if (!email || !password) {
      return res.status(400).json({
        errCode: 1,
        message: "Vui lòng nhập đầy đủ email và mật khẩu!",
      });
    }

    const userData = await UserService.handleLoginUser(email, password);

    if (userData.errCode !== 0) {
      return res.status(401).json({
        errCode: userData.errCode,
        message: userData.errMessage,
      });
    }

    // Check for 2FA or PIN
    if (userData.user.is2FAEnabled) {
      return res.status(200).json({
        errCode: 0,
        requires2FA: true,
        email: userData.user.email,
        message: "Yêu cầu mã xác thực 2 lớp",
      });
    }

    if (userData.user.isPinEnabled) {
      return res.status(200).json({
        errCode: 0,
        requiresPIN: true,
        email: userData.user.email,
        message: "Yêu cầu mã PIN bảo mật",
      });
    }

    const access_token = jwt.sign(
      {
        id: userData.user.id,
        role: userData.user.role,
        isAdmin: userData.user.role === "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refresh_token = jwt.sign(
      {
        id: userData.user.id,
        role: userData.user.role,
        isAdmin: userData.user.role === "admin",
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Record session
    const parser = new UAParser(userAgent);
    const device = `${parser.getBrowser().name} / ${parser.getOS().name}`;

    await db.Session.create({
      userId: userData.user.id,
      refreshToken: refresh_token,
      device: device,
      ipAddress: ip,
      location: "Vietnam",
      lastActive: new Date(),
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      errCode: 0,
      message: "Đăng nhập thành công",
      user: userData.user,
      access_token: access_token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống",
    });
  }
};

const handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
      users: [],
    });
  }
  let users = await UserService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

const handleUpdateUser = async (req, res) => {
  try {
    let data = req.body;
    let message = await UserService.UpdateUserData(data);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Error", e);
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter!",
      });
    }
    let message = await UserService.DeleteUserData(req.body.id);
    return res.status(200).json(message);
  } catch (e) {
    console.log("User not found!", e);
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return res.status(401).json({
        errCode: 1,
        message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
      });
    }

    const session = await db.Session.findOne({ where: { refreshToken: refresh_token } });
    if (!session) {
      return res.status(403).json({
        errCode: 2,
        message: "Phiên làm việc không hợp lệ"
      });
    }

    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await db.User.findByPk(decoded.id);

      if (!user || user.id !== session.userId) {
        return res.status(403).json({
          errCode: 3,
          message: "Xác thực token thất bại"
        });
      }

      const newAccessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          isAdmin: user.role === "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          isAdmin: user.role === "admin",
        },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      await session.update({
        refreshToken: newRefreshToken,
        lastActive: new Date()
      });

      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        errCode: 0,
        access_token: newAccessToken,
      });
    } catch (err) {
      await db.Session.destroy({ where: { refreshToken: refresh_token } });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(403).json({
        errCode: 4,
        message: "Token hết hạn. Vui lòng đăng nhập lại."
      });
    }
  } catch (err) {
    console.error("Error in handleRefreshToken:", err);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống"
    });
  }
};

const handleLogout = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (refresh_token) {
      await db.Session.destroy({ where: { refreshToken: refresh_token } });
    }

    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      errCode: 0,
      message: "Đăng xuất thành công"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống",
      error
    });
  }
};

const handleChangePassword = async (req, res) => {
  try {
    const data = req.body;
    const message = await UserService.changePassword(data);
    return res.status(200).json(message);
  } catch (e) {
    console.error("Error in handleChangePassword:", e);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống",
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await db.Session.findAll({
      where: { userId },
      order: [["lastActive", "DESC"]],
    });

    const refresh_token = req.cookies.refresh_token;

    const formattedSessions = sessions.map(s => ({
      id: s.id,
      device: s.device,
      location: s.location,
      ipAddress: s.ipAddress,
      time: s.lastActive,
      current: s.refreshToken === refresh_token
    }));

    return res.status(200).json({ success: true, data: formattedSessions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách phiên" });
  }
};

const revokeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await db.Session.findOne({ where: { id, userId } });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await session.destroy();
    return res.status(200).json({ success: true, message: "Đã đăng xuất thiết bị" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi khi đăng xuất thiết bị" });
  }
};

const handleUpdatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notifEmail, notifBrowser, notifStockAlert, preferredLanguage, preferredTheme, systemName } = req.body;

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ errCode: 1, message: "User not found" });
    }

    await user.update({
      notifEmail,
      notifBrowser,
      notifStockAlert,
      preferredLanguage,
      preferredTheme,
      systemName,
    });

    return res.status(200).json({
      errCode: 0,
      message: "Cập nhật cấu hình thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống",
    });
  }
};

module.exports = {
  handleCreateNewUser,
  handleGetAllUsers,
  handleLoginUser,
  handleUpdateUser,
  handleDeleteUser,
  handleRefreshToken,
  handleLogout,
  handleChangePassword,
  getSessions,
  revokeSession,
  handleUpdatePreferences,
};
