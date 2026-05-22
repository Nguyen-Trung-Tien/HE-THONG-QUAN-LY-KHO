const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UAParser = require("ua-parser-js");
dotenv.config();

const setPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.user.id;

    if (!pin || pin.length !== 6) {
      return res.status(400).json({ message: "Mã PIN phải có 6 chữ số" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPin = bcrypt.hashSync(pin, salt);

    await db.User.update(
      { 
        securityPin: hashedPin,
        isPinEnabled: true 
      },
      { where: { id: userId } }
    );

    return res.status(200).json({ success: true, message: "Thiết lập mã PIN thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống khi thiết lập PIN" });
  }
};

const verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.user.id;

    const user = await db.User.findByPk(userId);
    if (!user || !user.securityPin) {
      return res.status(400).json({ message: "Chưa thiết lập mã PIN" });
    }

    const isValid = bcrypt.compareSync(pin, user.securityPin);

    if (isValid) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: "Mã PIN không chính xác" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống khi xác thực PIN" });
  }
};

const disablePin = async (req, res) => {
  try {
    const userId = req.user.id;
    await db.User.update(
      { 
        securityPin: null,
        isPinEnabled: false 
      },
      { where: { id: userId } }
    );
    return res.status(200).json({ success: true, message: "Đã hủy kích hoạt mã PIN" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

const verifyLoginPIN = async (req, res) => {
    try {
        const { email, pin } = req.body;
        const userAgent = req.headers["user-agent"];
        const ip = req.ip || req.connection.remoteAddress;

        const user = await db.User.findOne({ where: { email } });

        if (!user || !user.isPinEnabled) {
            return res.status(400).json({ message: "Chưa thiết lập mã PIN" });
        }

        const isValid = bcrypt.compareSync(pin, user.securityPin);

        if (isValid) {
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
            delete userData.securityPin;

            return res.status(200).json({
                errCode: 0,
                success: true,
                message: "Đăng nhập thành công",
                user: userData,
                access_token: access_token,
            });
        } else {
            return res.status(400).json({ success: false, message: "Mã PIN không chính xác" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

module.exports = {
  setPin,
  verifyPin,
  disablePin,
  verifyLoginPIN
};
