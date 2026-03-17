const express = require('express');
const { createVisit, getVisits } = require('./controller');
const { verifyUserMiddleware } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyUserMiddleware, createVisit);
router.get('/', verifyUserMiddleware, getVisits);

module.exports = router;
