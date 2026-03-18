const express = require('express');
const { createPublicLead, createLead, getLeads, updateLead } = require('./controller');
const { verifyUserMiddleware } = require('../auth/middleware');
const { isManagerOrAdmin } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/public', createPublicLead);
router.post('/', verifyUserMiddleware, isManagerOrAdmin, createLead);
router.get('/', verifyUserMiddleware, getLeads);
router.patch('/:id', verifyUserMiddleware, updateLead);

module.exports = router;
