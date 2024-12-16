const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const crypto = require('crypto');
const { sendOtpEmail } = require("../service/emailOTP");
let otpStore = {};
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
exports.otpSend = async (req, res) => {
  const { email, name } = req.body;
  const otp = crypto.randomInt(100000, 999999);
  otpStore[email] = { otp, expires: Date.now() + 600000 };
  try {
    await sendOtpEmail(email, name, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }
  
}
exports.otpVerify = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];
    if (storedOtp && storedOtp.otp === parseInt(otp) && Date.now() < storedOtp.expires) {
        delete otpStore[email];
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
}