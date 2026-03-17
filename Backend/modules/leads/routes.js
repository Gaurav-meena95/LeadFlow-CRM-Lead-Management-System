const express = require('express');
const { createLead, getLeads, updateLead } = require('./controller');
const { verifyUserMiddleware } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyUserMiddleware, createLead);
router.get('/', verifyUserMiddleware, getLeads);
router.patch('/:id', verifyUserMiddleware, updateLead);

module.exports = router;
