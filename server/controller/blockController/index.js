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
    }).select("fName lName email gender");

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
      foundIn, // Assuming this maps to 'location' in the schema
      isSelectedForSpecialStud,
      floors, // Assuming this is an array of floor details
      totalFloors,
      selectedProctorIds, // Assuming this is an array of proctor IDs
    } = req.body;

    // --- Validation ---
    // Validate required fields
    // Corrected: Check for selectedProctorIds instead of proctorId
    if (!blockNum || !selectedProctorIds || selectedProctorIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Block number and at least one proctor ID are required.",
      });
    }

    // Validate floors structure if floors are expected
    if (floors && !Array.isArray(floors)) {
       return res.status(400).json({
         success: false,
         message: "Floors must be an array.",
       });
     }


    // --- Data Processing ---
    // Convert string boolean to actual boolean (robust check)
    const isSpecial = isSelectedForSpecialStud === true || isSelectedForSpecialStud === "true";

    // Ensure totalFloors is a number
    const parsedTotalFloors = Number(totalFloors);
    if (isNaN(parsedTotalFloors)) {
         return res.status(400).json({
            success: false,
            message: "Total floors must be a number.",
         });
    }


    // --- Create and Save Block ---
    // Assuming Block is your Mongoose model
    const newBlock = new Block({
      blockNum,
      location: foundIn, // Map foundIn to location
      isSelectedForSpecialStud: isSpecial,
      floors: floors || [], // Use provided floors array or an empty array if none
      totalFloors: parsedTotalFloors,
      assignedProctors: selectedProctorIds, // Assuming schema expects an array of IDs
    });

    // Mongoose will handle further schema validation during save
    await newBlock.save();

    // --- Success Response ---
    res.status(201).json({ // 201 Created is more appropriate for resource creation
      success: true,
      message: "Block registered successfully.",
      block: newBlock, // Return the created block object
    });

  } catch (error) {
    // --- Error Handling ---
    console.error("Error registering block:", error); // Log the error on the server side

    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: "Validation error(s): " + messages.join(', '),
            error: error.message,
        });
    }

    res.status(500).json({
      success: false,
      message: "Block registration failed.",
      error: error.message, // Provide the specific error message
    });
  }
};
// const registerBlock = async (req, res) => {
//   try {
//     const {
//       blockNum,
//       foundIn,
//       isSelectedForSpecialStud,
//       floors,
//       totalFloors,
//       proctorId,
//     } = req.body;

//     // Validate required fields
//     if (!blockNum || !proctorId) {
//       return res.status(400).json({
//         success: false,
//         message: "Block number and proctor ID are required",
//       });
//     }

//     // Convert string boolean to actual boolean
//     const isSpecial = isSelectedForSpecialStud === "true";

//     // Create new block with proper data types
//     const newBlock = new Block({
//       blockNum,
//       location: foundIn,
//       isSelectedForSpecialStud: isSpecial,
//       floors: floors, // Remove array wrapper since floors is already an array
//       totalFloors: Number(totalFloors),
//       assignedProctors: [proctorId], // Wrap in array if schema expects array
//     });

//     // Validate floors structure
//     if (!Array.isArray(newBlock.floors)) {
//       return res.status(400).json({
//         success: false,
//         message: "Floors must be an array",
//       });
//     }

//     await newBlock.save();

//     res.status(200).json({
//       // 201 for resource creation
//       success: true,
//       message: "Block registered successfully",
//       block: newBlock, // Return created block
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Block registration failed",
//       error: error.message,
//     });
//   }
// };
const getAvailableBlocks = async (req, res) => {
  try {
    // Find blocks where block status is "Available"
    const allAvailableBlocks = await Block.find({ status: "Available" });
    
    // For each block, filter its floors to include only those with floorStatus "Available"
    const updatedBlocks = allAvailableBlocks.map((block) => {
      const availableFloors = block.floors.filter(
        (floor) => floor.floorStatus === "Available"
      );
      // Return a new block object with filtered floors.
      return { ...block.toObject(), floors: availableFloors };
    });
    
    res.status(200).json({
      success: true,
      data: updatedBlocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get available block failed",
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
