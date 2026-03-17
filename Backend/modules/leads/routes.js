const express = require('express');
const { createLead, getLeads, updateLead } = require('./controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createLead)
    .get(protect, getLeads);

router.route('/:id')
    .patch(protect, updateLead);

module.exports = router;
