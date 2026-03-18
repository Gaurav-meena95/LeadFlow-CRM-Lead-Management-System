const express = require('express');
const { createPublicLead, createLead, getLeads, updateLead, addMessage, getFollowUps } = require('./controller');
const { verifyUserMiddleware } = require('../auth/middleware');
const { isManagerOrAdmin } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/public', createPublicLead);
router.get('/followups', verifyUserMiddleware, getFollowUps);
router.post('/', verifyUserMiddleware, isManagerOrAdmin, createLead);
router.get('/', verifyUserMiddleware, getLeads);
router.patch('/:id', verifyUserMiddleware, updateLead);
router.post('/:id/message', verifyUserMiddleware, addMessage);

module.exports = router;
