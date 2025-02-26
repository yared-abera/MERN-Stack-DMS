const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
    blockNum: { type: Number,required: true },
    capacity:{type:Number},
    foundIn:{type:String,enum:["maleArea","femaleArea"]},
    status:{type:String,enum: ["Available", "Occupied"],default:"Available"},
    totalRoom:{type:Number,min:1} ,
    availableRoom:{type:Number } ,
    isSelectedForSpecialStud:{type:Boolean,default:false } ,
    isSelectedForDisableStud:{type:Boolean,default:false } ,
});


module.exports = mongoose.model("Block", blockSchema);
