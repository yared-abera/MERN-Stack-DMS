const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    type:        { type: String, enum: ['ABSENCE_WARNING'], default: 'ABSENCE_WARNING' },
    block:{type:Number,required:true},
    count:       { type: Number, required: true },
    threshold:   { type: Number, required: true },
    message:{type:String, required:true},
    sentAt:      { type: Date, default: () => new Date() },
    read:        { type: Boolean, default: false }
  });
  
  module.exports = mongoose.model('Notification', notificationSchema);
  
  