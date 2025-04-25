const express = require("express");
const { getSearchHistory,addSearchHistory } = require("../../controller/recentlySearchedUser/recent_serachedUser-controller");

const route = express.Router();

route.post("/add",addSearchHistory);
route.get("/SearchStudent/:role/:id",getSearchHistory)
 

module.exports = route;
