const express = require('express');
const { getDashboard, getAgentStats } = require('./controller');

const router = express.Router();

router.get('/', getDashboard);
router.get('/agents', getAgentStats);

module.exports = router;
