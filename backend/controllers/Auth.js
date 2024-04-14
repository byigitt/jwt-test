import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

import User from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(401).json({ status: "fail", message: "Unauthorized" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ status: "success", message: "Login successful", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please fill in all fields" });
    }

    if (password != confirmPassword) {
      return res
        .status(400)
        .json({ status: "fail", message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters",
      });
    }

    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ status: "fail", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: "success",
      message: "Registered successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const me = async (req, res) => {
  try {
    res.status(200).json({ status: "success", user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.password_reset_token = resetPasswordToken;
    user.password_reset_expires = Date.now() + 3600000;

    await user.save();

    res.status(200).json({ status: "success", resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, passwordConfirm } = req.body;
    const user = await User.findOne({
      password_reset_token: token,
      password_reset_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid or expired token" });
    }

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ status: "fail", message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.password_reset_token = null;

    await user.save();

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export default {
  authenticateUser,
  login,
  register,
  me,
  forgotPassword,
  resetPassword,
};
