const express = require('express');
const { signup, login, refreshToken, me, updateMe } = require('./controller');
const { verifyUserMiddleware } = require('./middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', verifyUserMiddleware, me);
router.patch('/me', verifyUserMiddleware, updateMe);

module.exports = router;
