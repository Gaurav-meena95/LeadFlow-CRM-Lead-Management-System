const express = require('express');
const { signup, login, getMe, refreshToken } = require('./controller');
const { verifyUserMiddleware } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyUserMiddleware, getMe);
router.post('/refresh', refreshToken);

module.exports = router;
