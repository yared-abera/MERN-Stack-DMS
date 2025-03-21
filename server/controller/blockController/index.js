const Block = require("../../model/block/index");
const User = require("../../model/user/user");

// controllers/blockController.js
const getProctorBlocks = async (req, res, next) => {
  try {
    const proctorId = req.user.id; // From auth middleware

    // Find all blocks where the proctor is assigned
    const blocks = await Block.find({ assignedProctors: proctorId }).select(
      "blockNum location floors.floorNumber"
    );
    console.log("blocks", blocks);
    res.json({
      success: true,
      data: blocks,
    });
  } catch (err) {
    next(err);
  }
};

const getAvailableProctors = async (req, res) => {
  try {
    // Find proctors not assigned to any block
    const assignedProctors = await Block.distinct("assignedProctors");

    if (!assignedProctors) {
      return res.status(404).json({
        success: false,
        message: "No assigned proctors found",
      });
    }
    const availableProctors = await User.find({
      _id: { $nin: assignedProctors },
      role: "proctor",
    }).select("fName lName email");

    res.status(200).json({
      success: true,
      data: availableProctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching proctors",
      error: error.message,
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
      proctorId,
    } = req.body;

    // Validate required fields
    if (!blockNum || !proctorId) {
      return res.status(400).json({
        success: false,
        message: "Block number and proctor ID are required",
      });
    }

    // Convert string boolean to actual boolean
    const isSpecial = isSelectedForSpecialStud === "true";

    // Create new block with proper data types
    const newBlock = new Block({
      blockNum,
      location: foundIn,
      isSelectedForSpecialStud: isSpecial,
      floors: floors, // Remove array wrapper since floors is already an array
      totalFloors: Number(totalFloors),
      assignedProctors: [proctorId], // Wrap in array if schema expects array
    });

    // Validate floors structure
    if (!Array.isArray(newBlock.floors)) {
      return res.status(400).json({
        success: false,
        message: "Floors must be an array",
      });
    }

    await newBlock.save();

    res.status(200).json({
      // 201 for resource creation
      success: true,
      message: "Block registered successfully",
      block: newBlock, // Return created block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Block registration failed",
      error: error.message,
    });
  }
};
const getAvailableBlocks = async (req, res) => {
  try {
    const allAvailableBlocks = await Block.find({ status: "Available" });
 
    res.status(200).json({
      success: true,
      data: allAvailableBlocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "get Available block failed",
      error: error.message,
    });
  }
};

const UpdateBlock = async (req, res) => {
  try {
    const incomingBlock = req.body;

    // Find the existing block by ID
    const existingBlock = await Block.findById(incomingBlock._id);
    if (!existingBlock) {
      return res.status(404).json({
        success: false,
        message: "Block not found",
      });
    }

    // Iterate through each floor in the incoming block
    incomingBlock.floors.forEach((incomingFloor) => {
      // Find the corresponding floor in the existing block
      const existingFloor = existingBlock.floors.id(incomingFloor._id);
      if (!existingFloor) return;

      // Iterate through each dorm in the incoming floor
      incomingFloor.dorms.forEach((incomingDorm) => {
        // Find the corresponding dorm in the existing floor's dorms
        const existingDorm = existingFloor.dorms.id(incomingDorm._id);
        if (existingDorm) {
          // Update studentsAllocated
          existingDorm.studentsAllocated = incomingDorm.studentsAllocated;

          // Update dormStatus based on capacity
          existingDorm.dormStatus =
            existingDorm.studentsAllocated >= existingDorm.capacity
              ? "Full"
              : "Available";
        }
      });

      // Recalculate floor's totalAvailable
      existingFloor.totalAvailable = existingFloor.dorms.reduce(
        (sum, dorm) => sum + (dorm.capacity - dorm.studentsAllocated),
        0
      );
    });

    // Recalculate block's totalAvailable
    existingBlock.totalAvailable = existingBlock.floors.reduce(
      (sum, floor) => sum + floor.totalAvailable,
      0
    );

    // Save the updated block
    await existingBlock.save();

    res.status(200).json({
      success: true,
      message: "Block updated successfully",
      data: existingBlock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update block failed",
      error: error.message,
    });
  }
};

const getALLBlocks=async(req,res)=>{
  try {
    const AllBlock=await Block.find()
    res.status(200).json({
      success: true,
      data: AllBlock,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "get All block failed",
      error: error.message,
    });
  }
}

module.exports = {
  registerBlock,
  getProctorBlocks,
  getAvailableProctors,
  getAvailableBlocks,
  UpdateBlock,
  getALLBlocks
};
