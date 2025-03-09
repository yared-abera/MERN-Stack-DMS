const Block = require("../../model/block/index");
const User = require("../../model/user/user");

// controllers/blockController.js
const getProctorBlocks = async (req, res, next) => {
  try {
    const proctorId  =req.user.id // From auth middleware
    
    // Find all blocks where the proctor is assigned
    const blocks = await Block.find({ assignedProctors:  proctorId })
      .select("blockNum location floors.floorNumber");
    console.log("blocks", blocks);
    res.json({ 
      success: true,
      data: blocks 
    });
  } catch (err) {
    next(err);
  }
};

const getAvailableProctors = async (req, res) => {
  try {
    // Find proctors not assigned to any block
    const assignedProctors = await Block.distinct('assignedProctors');
          
    if (!assignedProctors) {
      return res.status(404).json({
        success: false,
        message: "No assigned proctors found"
      });
    }
    const availableProctors = await User.find({
      _id: { $nin: assignedProctors },
      role: 'proctor'
    }).select('fName lName email');
     
    res.status(200).json({
      success: true,
      data: availableProctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching proctors",
      error: error.message
    });
  }
};

const registerBlock = async (req, res) => {
  try {
    const {
      blockNum,
      foundIn,
      isSelectedForSpecialStud,
      floors,
      totalFloors,
      proctorId
    } = req.body; 
    
    const newBlock = new Block({
      blockNum,
      location: foundIn,
      isSelectedForSpecialStud,
      floors: [floors],
      totalFloors,
      assignedProctors: proctorId
    });

    await newBlock.save();
    
    res.status(200).json({
      success: true,
      message: "Block Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "register Block Failed",
      error: error.message
    });
  }
};

module.exports = { registerBlock, getProctorBlocks, getAvailableProctors };