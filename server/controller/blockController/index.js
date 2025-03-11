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

    // Validate required fields
    if (!blockNum || !proctorId) {
      return res.status(400).json({
        success: false,
        message: "Block number and proctor ID are required"
      });
    }

    // Convert string boolean to actual boolean
    const isSpecial = isSelectedForSpecialStud === 'true';

    // Create new block with proper data types
    const newBlock = new Block({
      blockNum,
      location: foundIn,
      isSelectedForSpecialStud: isSpecial,
      floors: floors, // Remove array wrapper since floors is already an array
      totalFloors: Number(totalFloors),
      assignedProctors: [proctorId] // Wrap in array if schema expects array
    });

    // Validate floors structure
    if (!Array.isArray(newBlock.floors)) {
      return res.status(400).json({
        success: false,
        message: "Floors must be an array"
      });
    }

    await newBlock.save();
    
    res.status(201).json({ // 201 for resource creation
      success: true,
      message: "Block registered successfully",
      block: newBlock // Return created block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Block registration failed",
      error: error.message
    });
  }
};

module.exports = { registerBlock, getProctorBlocks, getAvailableProctors };