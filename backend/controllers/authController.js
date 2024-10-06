const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const newUser = new User({ name, username, email, password });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ success: true, token, userId: newUser._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({
          $or: [{ email: email }, { username: email }],
      });
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
      });
      res.status(200).json({ success: true, token, userId: user._id });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};