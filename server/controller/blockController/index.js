const Block = require("../../model/block/index");
const User = require("../../model/user/user");

// controllers/blockController.js
const getProctorBlocks = async (req, res, next) => {
  try {
    const proctorId = req.user.id; // From auth middleware

    // Find all blocks where the proctor is assigned
    const blocks = await Block.find({ assignedProctors: proctorId }) 
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
    // Find all unique proctor IDs that are assigned to ANY block
    const assignedProctorIds = await Block.distinct("assignedProctors");

    // Log the list of IDs that are considered 'assigned'
    console.log("Proctor IDs currently assigned to any block:", assignedProctorIds.map(id => id.toString()));

    // Find users with the role "proctor" whose IDs are NOT in the list of assigned IDs
    const availableProctors = await User.find({
      _id: { $nin: assignedProctorIds },
      role: "proctor",
    }).select("fName lName email sex");

    // Log the found available proctors
    console.log(`Found ${availableProctors.length} available proctors. Details:`, availableProctors.map(p => `${p.fName} ${p.lName} (${p._id})`));

    // Return the list of available proctors.
    // A 200 status with an empty 'data' array is appropriate if no proctors are available.
    res.status(200).json({
      success: true,
      data: availableProctors,
    });
  } catch (error) {
    console.error("Error fetching available proctors:", error); // Log the error
    res.status(500).json({
      success: false,
      message: "Error fetching proctors",
      error: error.message, // Include error message for debugging
    });
  }
};

// Don't forget to export the function if needed elsewhere
// module.exports = { getAvailableProctors };
// const getAvailableProctors = async (req, res) => {
//   try {
//     // Find proctors not assigned to any block
//     const assignedProctors = await Block.distinct("assignedProctors");

//     if (!assignedProctors) {
//       return res.status(404).json({
//         success: false,
//         message: "No assigned proctors found",
//       });
//     }
//     const availableProctors = await User.find({
//       _id: { $nin: assignedProctors },
//       role: "proctor",
//     }).select("fName lName email gender");

//     res.status(200).json({
//       success: true,
//       data: availableProctors,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching proctors",
//       error: error.message,
//     });
//   }
// };
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

 
const getALLBlocks = async (req, res) => {
  try {
    const allBlocks = await Block.find()
      // first populate the block‑level refs
      .populate('registerBy', 'fName mName LName userName gender email role')
      .populate('assignedProctors','fName mName LName userName gender email role')
      // then populate each dorm’s registerBy via floors → dorms
      .populate({
        path: 'floors.dorms',
        populate: {
          path: 'registerBy',
          model: 'User',
          select: 'fName mName LName userName gender email role'
        }
      });

    res.status(200).json({ success: true, data: allBlocks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "get All blocks failed",
      error: error.message,
    });
  }
};


module.exports = {
  registerBlock,
  getProctorBlocks,
  getAvailableProctors,
  getAvailableBlocks,
  UpdateBlock,
  getALLBlocks
};
