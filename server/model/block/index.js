 const mongoose = require('mongoose');
 
const DormSchema = new mongoose.Schema({
  dormNumber: { type: Number, required: true },
  capacity: { type: Number, required: true },
  dormStatus: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance','partial'],
    default: 'available'
  },
  floor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true
  },
  block: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
    required: true
  }
});

// Separate Floor Schema
const FloorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  floorStatus: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance','partial' ],
    default: 'available'
  },
  floorCapacity: { type: Number, required: true },
  block: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
    required: true
  },
  dorms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dorm'
  }]
});

// Main Block Schema
const BlockSchema = new mongoose.Schema({
  blockNum: { type: Number, required: true, unique: true },
  location: { 
    type: String, 
    enum: ['girls_Campus', 'boys_Campus', 'Other'],
   
  },
  totalCapacity: { type: Number, required: true },
  availableRoom: { type: Number, required: true },
  isFull: { type: Boolean, default: false },
  floors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor'
  }],
  isSelectedForImpaired: { type: Boolean, default: false },
  isSelectedForSpecial: { type: Boolean, default: false },
  description: String
}, { timestamps: true });

// Indexes
BlockSchema.index({ blockNum: 1 }, { unique: true });
DormSchema.index({ dormNumber: 1, block: 1 }, { unique: true });
FloorSchema.index({ floorNumber: 1, block: 1 }, { unique: true });

module.exports = {
  Block: mongoose.model('Block', BlockSchema),
  Floor: mongoose.model('Floor', FloorSchema),
  Dorm: mongoose.model('Dorm', DormSchema)
};