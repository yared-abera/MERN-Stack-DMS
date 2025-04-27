const express = require('express');
const { registerDorm, updateDormStatus, checkDormExists, getIssueGroupDorm, getDormStatistics } = require('../../controller/dormController/index');
const router = express.Router();
const { authMiddleware } = require('../../controller/auth-controller/index');
 
 
// PATCH: Add dorm to existing block's floor
router.patch('/:blockId/floors/:floorNumber/dorms', authMiddleware, registerDorm);
router.patch('/:blockId/floors/:floorNumber/dorms/:dormNumber/status',   updateDormStatus);
router.get('/getIssueDorms', getIssueGroupDorm);
// GET: Check if a dorm exists
router.get('/:blockId/floors/:floorNumber/dorms/:dormNumber', authMiddleware, checkDormExists);
// GET: Get dorm statistics
router.get('/statistics', authMiddleware, getDormStatistics);

module.exports = router;