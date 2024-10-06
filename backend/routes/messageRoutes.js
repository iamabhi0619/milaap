const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { allMessages, sendMessage } = require('../controllers/messageControllers');

const router = express.Router();


router.get('/:chatId',protect, allMessages);
router.post("/", protect, sendMessage);

// router.post('/login', login);

module.exports = router;