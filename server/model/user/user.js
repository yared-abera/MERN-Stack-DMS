const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fName: { type: String, required: true },
    mName: { type: String, required: true },
    lName: { type: String, required: true },
    gender: { type: String, required: true },
    phoneNum: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    email:  {type:String ,unique: true},
    password: { type: String, required: true },
    role: { type: String,   required: true },
    address:{type:String,default:'wolkite'}
},{ timestamps: true });

 module.exports=mongoose.model("User",userSchema)