const express = require('express');
const { signup, login, getMe, refreshToken } = require('./controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

module.exports = router;
