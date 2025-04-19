const express = require("express");
const {AddAttendance,fetchNotification }=require('../../controller/attendance/attendanceController')
 
const route = express.Router();

route.post("/add",AddAttendance);
// route.get("/get/:sex",fetchFeedBack)
route.get("/getNotification",fetchNotification)

module.exports = route;
