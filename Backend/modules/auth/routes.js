const express = require('express');
const { signup, login, refreshToken, me, updateMe, getUsers } = require('./controller');
const { verifyUserMiddleware } = require('./middleware');
const { isManagerOrAdmin } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', verifyUserMiddleware, me);
router.patch('/me', verifyUserMiddleware, updateMe);
router.get('/users', verifyUserMiddleware, isManagerOrAdmin, getUsers);

module.exports = router;
