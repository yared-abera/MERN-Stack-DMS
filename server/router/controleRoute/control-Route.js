const express = require("express");
const {AddControlIssue,fetchAllControleIssues,UpdateControlIssueSatus}=require('../../controller/issueController/issueControle-Controller')
 
const route = express.Router();

route.post("/add",AddControlIssue);
route.put("/update",UpdateControlIssueSatus);
// route.get("/getForStud/:id",fetchFeedBackForStud)
route.get("/get",fetchAllControleIssues)
module.exports = route;
