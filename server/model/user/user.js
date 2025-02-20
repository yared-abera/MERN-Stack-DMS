const mongose = require("mongoose");

const UserSchema = new mongose.Schema({
  Fname: String,
  Mname: String,
  Lname: String,
  email: String,
  userName: String,
  phoneNum: String,
  password: String,
  sex: String,
  role: String,
});

module.exports = mongose.model("User", UserSchema);
