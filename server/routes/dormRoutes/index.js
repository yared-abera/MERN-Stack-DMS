const express = require('express');
const router = express.Router();
const { registerDorm, updateDormStatus, getIssueGroupDorm, getDormStatistics } = require('../../controller/dormController');

// ... existing routes ...

router.get('/statistics', getDormStatistics);

// ... existing routes ...

module.exports = router; 