// router/maintenanceRouter/index.js
const express = require("express");
const { SubmitMaintenanceIssue,fetchAllMaintenanceIssue,fetchMaintenanceIssueForUser } = require("../../controller/maintenanceIssue/maintenaceIssueController");
const router = express.Router();



router.post('/add',SubmitMaintenanceIssue)
router.get('/get',fetchAllMaintenanceIssue)
router.get('/getOne/:userName',fetchMaintenanceIssueForUser)
module.exports = router;