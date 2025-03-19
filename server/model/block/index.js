const mongoose = require("mongoose");

// Dorm Schema (nested under floors)
const dormSchema = new mongoose.Schema({
  dormNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  studentsAllocated: { type: Number, default: 0 },
  dormStatus: { 
    type: String, 
    enum: ["Available", "Full"], 
    default: "Available" 
  },
  totalAvailable: { type: Number, default: 0 } // Persisted
});

// Auto-update totalAvailable and dormStatus
dormSchema.pre("save", function(next) {
  this.totalAvailable = this.capacity - this.studentsAllocated;
  this.dormStatus = this.totalAvailable > 0 ? "Available" : "Full";
  next();
});
  
 // Floor Schema (nested under blocks)
 const floorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  floorStatus: { 
    type: String, 
    enum: ["Available", "Unavailable"], 
    default: "Available" 
  },
  totalAvailable: { type: Number, default: 0 }, // Persisted
  dorms: [dormSchema]
});

// Auto-update floor's totalAvailable and status
floorSchema.pre("save", function(next) {
  this.totalAvailable = this.dorms.reduce(
    (sum, dorm) => sum + dorm.totalAvailable, 
    0
  );
  this.floorStatus = this.totalAvailable > 0 ? "Available" : "Unavailable";
  next();
});

// Auto-update floor's totalAvailable and status
floorSchema.pre("save", function(next) {
  this.totalAvailable = this.dorms.reduce(
    (sum, dorm) => sum + dorm.totalAvailable, 
    0
  );
  this.floorStatus = this.totalAvailable > 0 ? "Available" : "Full";
  next();
});

// Virtual: Total available beds on the floor
floorSchema.virtual("available").get(function() {
  return this.dorms.reduce((sum, dorm) => sum + dorm.available, 0);
});

// Auto-update floorStatus when dorms change
floorSchema.pre("save", function(next) {
  const totalAvailable = this.dorms.reduce((sum, dorm) => sum + dorm.available, 0);
  this.floorStatus = totalAvailable > 0 ? "Available" : "Unavailable";
  next();
});
  

// Block Schema (created by proctor managers)
  const blockSchema = new mongoose.Schema({
    blockNum: { type: Number, required: true, unique: true },
    location: { 
      type: String, 
      enum: ["maleArea", "femaleArea"], 
      required: true 
    },
    floors: [floorSchema],
    isSelectedForSpecial: { type: Boolean, default: false },
    status: { type: String, default: "Available" },
    totalAvailable: { type: Number, default: 0 }, // Persisted
    totalFloors: { type: Number },
    assignedProctors: [{     
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
  });

 blockSchema.index({ assignedProctors: 1 });
  
  // Auto-update block's totalAvailable and status
  blockSchema.pre("save", function(next) {
    this.totalAvailable = this.floors.reduce(
      (total, floor) => total + floor.totalAvailable, 
      0
    );
    this.status = this.totalAvailable > 0 ? "Available" : "Full";
    next();
  });
  
  module.exports = mongoose.model("Block", blockSchema);
{/**const mongoose = require("mongoose");

// ----- Dorm Schema (Embedded in Floor) -----
const dormSchema = new mongoose.Schema({
  dormNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  studentsAllocated: { type: Number, default: 0 },
  dormStatus: { 
    type: String, 
    enum: ["Available", "Full"], 
    default: "Available" 
  },
  totalAvailable: { type: Number, default: 0 } // Calculated field
});

// Auto-update totalAvailable and dormStatus before saving a dorm
dormSchema.pre("save", function(next) {
  this.totalAvailable = this.capacity - this.studentsAllocated;
  this.dormStatus = this.totalAvailable > 0 ? "Available" : "Full";
  next();
});

// ----- Floor Schema (Embedded in Block) -----
const floorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  floorStatus: { 
    type: String, 
    enum: ["Available", "Unavailable"], 
    default: "Available" 
  },
  totalAvailable: { type: Number, default: 0 }, // Calculated from dorms
  dorms: [dormSchema]
});

// Pre-save hook for floor: calculate total available beds and set status
floorSchema.pre("save", function(next) {
  this.totalAvailable = this.dorms.reduce(
    (sum, dorm) => sum + dorm.totalAvailable, 
    0
  );
  this.floorStatus = this.totalAvailable > 0 ? "Available" : "Unavailable";
  next();
});

// ----- Block Schema -----
const blockSchema = new mongoose.Schema({
  blockNum: { type: Number, required: true, unique: true },
  location: { 
    type: String, 
    enum: ["maleArea", "femaleArea"], 
    required: true 
  },
  floors: [floorSchema],
  isSelectedForSpecial: { type: Boolean, default: false },
  status: { type: String, default: "Available" },
  totalAvailable: { type: Number, default: 0 }, // Calculated from floors
  totalFloors: { type: Number },
  assignedProctors: [{     
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
});

// Create an index on assignedProctors for performance if needed
blockSchema.index({ assignedProctors: 1 });

// Pre-save hook for block: calculate overall availability and update status
blockSchema.pre("save", function(next) {
  this.totalAvailable = this.floors.reduce(
    (total, floor) => total + floor.totalAvailable, 
    0
  );
  this.status = this.totalAvailable > 0 ? "Available" : "Full";
  next();
});

const Block = mongoose.model("Block", blockSchema);
 */}