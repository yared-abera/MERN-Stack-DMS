const express = require("express");
const {fetchFeedBack, AddFeedBack,fetchFeedBackForStud,fetchAllFeedBack}=require('../../controller/feadBack/feedBack-Controller')
 
const route = express.Router();

route.post("/add",AddFeedBack);
route.get("/get/:sex",fetchFeedBack)
route.get("/getForStud/:id",fetchFeedBackForStud)
route.get("/getAll",fetchAllFeedBack)
module.exports = route;
