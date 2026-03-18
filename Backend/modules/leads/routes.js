const express = require('express');
const { createLead, getLeads, updateLead } = require('./controller');


const router = express.Router();
router.post('/', createLead);
router.get('/', getLeads);
router.patch('/:id', updateLead);

module.exports = router;
