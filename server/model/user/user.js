const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fName: { type: String, required: true },
    mName: { type: String, required: true },
    lName: { type: String, required: true },
    sex: { type: String, required: true },
    phoneNum: { type: String, required: true, },
    userName: { type: String, required: true, unique: true },
    email:  {type:String ,unique: true},
    password: { type: String, required: true },
    role: { type: String,   required: true },
    address:{type:String,default:'wolkite'},
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '' },
    country: { type: String, default: 'Ethiopia' },
    city: { type: String, default: '' },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        telegram: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    }
},{ timestamps: true });

 module.exports=mongoose.model("User",userSchema)