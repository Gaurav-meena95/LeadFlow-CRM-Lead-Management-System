const express = require('express');
const { createVisit, getVisits, updateVisit } = require('./controller');

const router = express.Router();

router.post('/', createVisit);
router.get('/', getVisits);
router.patch('/:id', updateVisit);

module.exports = router;
