// router/maintenanceRouter/index.js
const express = require("express");
const { SubmitMaintenanceIssue,fetchAllMaintenanceIssue } = require("../../controller/maintenanceIssue/maintenaceIssueController");
const router = express.Router();

 

router.post('/add',SubmitMaintenanceIssue)
router.get('/get',fetchAllMaintenanceIssue)
module.exports = router;