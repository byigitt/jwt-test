import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "success", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ status: "success", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export default {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
};
