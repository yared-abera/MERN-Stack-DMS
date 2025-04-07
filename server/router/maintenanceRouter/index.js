// router/maintenanceRouter/index.js
const express = require("express");
const {
  SubmitMaintenanceIssue,
  fetchAllMaintenanceIssueForDean,
  fetchAllMaintenanceIssueForManager,
  fetchPendingStatusMaintenanceIssue,
  fetchAllMaintenanceIssueByStatus,
  fetchMaintenanceIssueForUser,
  VerificationOFIssue
} = require("../../controller/maintenanceIssue/maintenaceIssueController");
const router = express.Router();

router.post("/add", SubmitMaintenanceIssue);
router.get("/getAll", fetchAllMaintenanceIssueForDean);
router.get("/get/:gender", fetchAllMaintenanceIssueForManager);
router.get("/getOne/:id/:Model", fetchMaintenanceIssueForUser);
router.get("/getPendingStatus/:status/:id", fetchPendingStatusMaintenanceIssue);
router.get("/getByStatus/:gender/:selectedStatus", fetchAllMaintenanceIssueByStatus);
router.put("/verify",VerificationOFIssue);
module.exports = router;
 