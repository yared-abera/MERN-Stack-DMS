const express = require('express');
const router = express.Router();
const { registerDorm, updateDormStatus } = require('../controller/dormController');

// ... existing routes ...

// Update dorm status
router.patch('/:blockId/floors/:floorNumber/dorms/:dormNumber/status', updateDormStatus);

module.exports = router; 