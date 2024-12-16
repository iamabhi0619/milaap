const express = require('express');
const { register, login, otpSend, otpVerify } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp-send', otpSend);
router.post('/otp-verify', otpVerify)

module.exports = router;
