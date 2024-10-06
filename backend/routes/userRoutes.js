const express = require('express');
const {getUser, getData} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',protect, getData)
router.get('/search',protect, getUser);
// router.post('/login', login);

module.exports = router;