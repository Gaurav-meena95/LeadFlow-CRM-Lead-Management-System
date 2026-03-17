const express = require('express');
const { createVisit, getVisits } = require('./controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createVisit)
    .get(protect, getVisits);

module.exports = router;
