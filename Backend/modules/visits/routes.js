const express = require('express');
const { createVisit, getVisits } = require('./controller');


const router = express.Router();

router.post('/', createVisit);
router.get('/', getVisits);

module.exports = router;
