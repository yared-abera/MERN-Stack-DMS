const express = require('express');
const { registerDorm } = require('../../controller/dormController/index');
const router = express.Router();
const { authMiddleware } = require('../../controller/auth-controller/index');
 

// PATCH: Add dorm to existing block's floor
router.patch('/:blockId/floors/:floorNumber/dorms', authMiddleware, registerDorm);

 

module.exports = router;