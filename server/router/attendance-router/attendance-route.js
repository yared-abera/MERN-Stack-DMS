const express = require("express");
const { AddAttendance, fetchNotification, getAbsentStudents } = require('../../controller/attendance/attendanceController');

const route = express.Router();

route.post("/add", AddAttendance);
// route.get("/get/:sex",fetchFeedBack)
route.get("/getNotification", fetchNotification);
route.get("/getAbsent", getAbsentStudents);

module.exports = route;
