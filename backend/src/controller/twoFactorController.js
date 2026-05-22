const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const db = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const setup2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = speakeasy.generateSecret({
      name: `SmartWMS (${user.email})`,
    });

    await user.update({
      twoFactorSecret: secret.base32,
      is2FAEnabled: false,
    });

    const qrCodeData = await QRCode.toDataURL(secret.otpauth_url);

    return res.status(200).json({
      success: true,
      qrCode: qrCodeData,
      secret: secret.base32,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error setting up 2FA", error: error.message });
  }
};

const verifyAndEnable2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;
    const user = await db.User.findByPk(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA setup not initiated" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      await user.update({ is2FAEnabled: true });
      return res.status(200).json({ success: true, message: "2FA enabled successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying 2FA", error: error.message });
  }
};

const disable2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      is2FAEnabled: false,
      twoFactorSecret: null,
    });

    return res.status(200).json({ success: true, message: "2FA disabled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error disabling 2FA", error: error.message });
  }
};

const UAParser = require("ua-parser-js");

const verifyLogin2FA = async (req, res) => {
    try {
        const { email, token } = req.body;
        const userAgent = req.headers["user-agent"];
        const ip = req.ip || req.connection.remoteAddress;

        const user = await db.User.findOne({ where: { email } });

        if (!user || !user.is2FAEnabled) {
            return res.status(400).json({ message: "2FA not enabled for this user" });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token,
        });

        if (verified) {
            const access_token = jwt.sign(
              {
                id: user.id,
                role: user.role,
                isAdmin: user.role === "admin",
              },
              process.env.JWT_SECRET,
              { expiresIn: "15m" }
            );

            const refresh_token = jwt.sign(
              {
                id: user.id,
                role: user.role,
                isAdmin: user.role === "admin",
              },
              process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );

            // Record session
            const parser = new UAParser(userAgent);
            const device = `${parser.getBrowser().name} / ${parser.getOS().name}`;

            await db.Session.create({
              userId: user.id,
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

            const userData = user.get({ plain: true });
            delete userData.password;
            delete userData.twoFactorSecret;

            return res.status(200).json({
                errCode: 0,
                success: true,
                message: "Đăng nhập thành công",
                user: userData,
                access_token: access_token,
            });
        } else {
            return res.status(400).json({ success: false, message: "Mã xác thực không chính xác" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error verifying login 2FA" });
    }
}

module.exports = {
  setup2FA,
  verifyAndEnable2FA,
  disable2FA,
  verifyLogin2FA
};
