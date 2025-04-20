const express = require("express");
const {
  fetchAllUser,
  fetchOneUser,
  UpdateUser,
  ChangePassword,
  deleteUser,
  searchUsers
} = require("../../controller/user/userController");

const route = express.Router();

route.get("/getAll", fetchAllUser);
route.get("/getOne/:id", fetchOneUser);
route.put("/update/:id", UpdateUser);
route.put("/password/:id", ChangePassword);
route.delete("/delete/:id", deleteUser);

route.get("/search", searchUsers);

module.exports = route;
