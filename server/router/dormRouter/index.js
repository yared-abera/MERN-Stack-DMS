const express = require('express');
const { registerDorm, updateDormStatus, checkDormExists } = require('../../controller/dormController/index');
const router = express.Router();
const { authMiddleware } = require('../../controller/auth-controller/index');
 

// PATCH: Add dorm to existing block's floor
router.patch('/:blockId/floors/:floorNumber/dorms', authMiddleware, registerDorm);

// GET: Check if a dorm exists
router.get('/:blockId/floors/:floorNumber/dorms/:dormNumber', authMiddleware, checkDormExists);

module.exports = router;