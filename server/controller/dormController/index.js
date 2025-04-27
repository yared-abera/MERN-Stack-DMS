const Block = require("../../model/block/index");
const { isValidObjectId } = require("mongoose");

const registerDorm = async (req, res) => {
  try {
    const { blockId, floorNumber } = req.params;
    const { dormNumber, capacity, status, description, registerBy } = req.body;

    console.log("Registering dorm:", {
      blockId,
      floorNumber,
      dormNumber,
      capacity,
      status
    });

    // Validate ObjectId
    if (!isValidObjectId(blockId)) {
      return res.status(400).json({ error: "Invalid block ID format" });
    }

    // Validate required fields
    if (!dormNumber || !capacity) {
      return res
        .status(400)
        .json({ error: "Dorm number and capacity are required" });
    }

    // Check if dorm already exists
    const block = await Block.findOne({
      _id: blockId,
      "floors.floorNumber": Number(floorNumber),
      "floors.dorms.dormNumber": dormNumber,
    });

    if (block) {
      return res
        .status(400)
        .json({
          error: `Dorm ${dormNumber} already exists on floor ${floorNumber}`,
        });
    }

    // First, add the new dorm
    const result = await Block.findOneAndUpdate(
      {
        _id: blockId,
        "floors.floorNumber": Number(floorNumber),
      },
      {
        $push: {
          "floors.$.dorms": {
            dormNumber: dormNumber,
            capacity: Number(capacity),
            studentsAllocated: 0,
            dormStatus: status,
            description: description || "No description provided",
            registerBy: registerBy,
            totalAvailable: Number(capacity),
          },
        },
      },
      {
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({ error: "Block or floor not found" });
    }

    // Get the updated floor
    const floor = result.floors.find(
      (f) => f.floorNumber === Number(floorNumber)
    );

    // Calculate floor capacity and available
    const floorCapacity = floor.dorms.reduce(
      (sum, dorm) => sum + dorm.capacity,
      0
    );
    const floorAvailable = floor.dorms.reduce(
      (sum, dorm) => sum + (dorm.capacity - dorm.studentsAllocated),
      0
    );

    // Update floor values
    await Block.updateOne(
      {
        _id: blockId,
        "floors.floorNumber": Number(floorNumber),
      },
      {
        $set: {
          "floors.$.floorCapacity": floorCapacity,
          "floors.$.totalAvailable": floorAvailable,
          "floors.$.floorStatus":
            floorAvailable > 0 ? "Available" : "Unavailable",
        },
      }
    );

    // Get updated block for final calculations
    const updatedBlock = await Block.findById(blockId);

    // Calculate block totals
    const blockTotalCapacity = updatedBlock.floors.reduce(
      (sum, floor) => sum + (floor.floorCapacity || 0),
      0
    );
    const blockTotalAvailable = updatedBlock.floors.reduce(
      (sum, floor) => sum + (floor.totalAvailable || 0),
      0
    );

    // Update block values
    const finalBlock = await Block.findByIdAndUpdate(
      blockId,
      {
        $set: {
          totalCapacity: blockTotalCapacity,
          totalAvailable: blockTotalAvailable,
          status: blockTotalAvailable > 0 ? "Available" : "Full",
        },
      },
      { new: true }
    );

    // Get the newly added dorm for response
    const finalFloor = finalBlock.floors.find(
      (f) => f.floorNumber === Number(floorNumber)
    );
    const newDorm = finalFloor.dorms[finalFloor.dorms.length - 1];

    res.status(200).json({
      success: true,
      data: newDorm,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const updateDormStatus = async (req, res) => {
  try {
    const { blockId, floorNumber, dormNumber } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(blockId)) {
      return res.json({ error: "Invalid block ID format" });
    }

    if (
      !status ||
      !["Available", "Full", "MaintenanceIssue", "UnAvailable"].includes(status)
    ) {
      return res.json({ error: "Invalid status value" });
    }

    const result = await Block.findOneAndUpdate(
      {
        _id: blockId,
        "floors.floorNumber": Number(floorNumber),
        "floors.dorms.dormNumber": dormNumber,
      },
      {
        $set: {
          "floors.$.dorms.$[dorm].dormStatus": status,
        },
      },
      {
        arrayFilters: [{ "dorm.dormNumber": dormNumber }],
        new: true,
      }
    );

    if (!result) {
      return res.json({ error: "Dorm not found" });
    }

    // Find the updated dorm
    const floor = result.floors.find(
      (f) => f.floorNumber === Number(floorNumber)
    );
    const updatedDorm = floor.dorms.find((d) => d.dormNumber === dormNumber);

    res.status(200).json({
      success: true,
      data: updatedDorm,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
 
const getIssueGroupDorm = async (req, res) => {
  try {
    const blocksWithIssueDorms = await Block.aggregate([
      {
        $match: {
          "floors.dorms.dormStatus": "MaintenanceIssue"
        }
      },
      {
        $addFields: {
          floors: {
            $map: {
              input: "$floors",
              as: "floor",
              in: {
                $mergeObjects: [
                  "$$floor",
                  {
                    dorms: {
                      $filter: {
                        input: "$$floor.dorms",
                        as: "dorm",
                        cond: {
                          $eq: ["$$dorm.dormStatus", "MaintenanceIssue"]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          floors: {
            $filter: {
              input: "$floors",
              as: "floor",
              cond: { $gt: [{ $size: "$$floor.dorms" }, 0] }
            }
          }
        }
      },
      {
        $match: {
          "floors.dorms": { $exists: true, $not: { $size: 0 } }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "floors.dorms.registerBy",
          foreignField: "_id",
          as: "dormRegisters"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedProctors",
          foreignField: "_id",
          as: "proctors"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "registerBy",
          foreignField: "_id",
          as: "blockRegister"
        }
      },
      {
        $project: {
          blockNum: 1,
          location: 1,
          floors: 1,
          status: 1,
          "dormRegisters.fName": 1,
          "dormRegisters.LName": 1,
          "proctors.fName": 1,
          "proctors.LName": 1,
          "blockRegister.fName": 1,
          "blockRegister.LName": 1
        }
      }
    ]);

    if (!blocksWithIssueDorms.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No dorms with maintenance issues found"
      });
    }

    res.status(200).json({
      success: true,
      data: blocksWithIssueDorms
    });

  } catch (err) {
    console.error("Error in getIssueGroupDorm:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};
// const getIssueGroupDorm = async (req, res) => {
//   try {
//     const blocksWithIssueDorms = await Block.aggregate([
//       {
//         // Stage 1: Find blocks that contain at least one dorm with "MaintenanceIssue" status
//         $match: {
//           "floors.dorms.dormStatus": "MaintenanceIssue",
//         },
//       },
//       {
//         // Stage 2: Reshape the document to filter the nested dorms array
//         $addFields: {
//           floors: {
//             $map: { // Iterate over each floor in the 'floors' array
//               input: "$floors",
//               as: "floor",
//               in: { // Create a new floor object
//                 // Keep the original floor fields
//                 _id: "$$floor._id", // Important to keep the ID for potential sub-populations later
//                 floorNumber: "$$floor.floorNumber",
//                 floorCapacity: "$$floor.floorCapacity",
//                 floorStatus: "$$floor.floorStatus",
//                 totalAvailable: "$$floor.totalAvailable",
//                 // Replace the 'dorms' array with a filtered version
//                 dorms: {
//                   $filter: { // Filter the dorms array within the current floor
//                     input: "$$floor.dorms",
//                     as: "dorm",
//                     // Condition to keep the dorm: status is "MaintenanceIssue"
//                     cond: {
//                       $eq: ["$$dorm.dormStatus", "MaintenanceIssue"],
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       // Optional Stage (if you want to remove floors that ended up with an empty dorms array after filtering):
//       // {
//       //    $match: {
//       //        "floors.dorms": { $ne: [] } // This will only keep floors that still have dorms after the filter
//       //        // Note: This might require more complex reshaping if you need to remove the entire floor document
//       //        // If keeping the floor with an empty 'dorms' array is okay, skip this stage.
//       //    }
//       // },
//       {
//           // Optional Stage: Project to include only necessary block fields
//           // Add or remove fields as needed from the top-level block document
//           $project: {
//               _id: 1, // Keep the Block ID
//               blockNum: 1,
//               location: 1,
//               floors: 1, // Keep the processed floors array
//               isSelectedForSpecial: 1,
//               status: 1, // Note: Block status might be inaccurate after filtering nested dorms
//               totalAvailable: 1, // Note: These aggregate fields might be inaccurate
//               totalCapacity: 1,    // after filtering nested dorms. Recalculate if needed.
//               totalFloors: 1,
//               assignedProctors: 1, // Keep proctor IDs
//               registerBy: 1, // Keep registerBy ID
//               registerDate: 1,
//           }
//       },
//        {
//            // Execute lean() here to return plain JavaScript objects from aggregation
//            // This is efficient before populating
//            $addFields: { __isLean: true } // Mongoose hint for populate
//        }
//     ])
//     .exec(); // Execute the aggregation pipeline

//     // Mongoose populate works on the results of aggregate.
//     // Use Model.populate(results, options) for this.
//     // Populate the 'registerBy' field on the filtered dorms
//     const populatedBlocks = await Block.populate(blocksWithIssueDorms, {
//       path: "floors.dorms.registerBy",
//       model: "User", // Specify the model
//       select: "fName mName LName userName gender email role", // Select specific user fields
//     });

//      // Populate the 'assignedProctors' field on the Block (if needed)
//     await Block.populate(populatedBlocks, {
//        path: 'assignedProctors',
//        model: 'User',
//        select: "fName mName LName userName gender email role", // Select specific user fields
//     });

//      // Populate the 'registerBy' field on the Block (if needed)
//      await Block.populate(populatedBlocks, {
//        path: 'registerBy',
//        model: 'User',
//        select: "fName mName LName userName gender email role", // Select specific user fields
//     });


//     if (!populatedBlocks || populatedBlocks.length === 0) {
//       console.log("No blocks found with dorms having MaintenanceIssue");
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: "No dorms with 'MaintenanceIssue' status found.",
//       });
//     }

//     console.log(
//       `Found ${populatedBlocks.length} blocks containing dorms with MaintenanceIssue`
//     );
//     res.status(200).json({
//       success: true,
//       data: populatedBlocks,
//     });
//   } catch (err) {
//     console.error("Server error in getIssueGroupDorm:", err);
//     res.status(500).json({ error: "Server error: " + err.message });
//   }
// };

// Check if a dorm exists
const checkDormExists = async (req, res) => {
  try {
    const { blockId, floorNumber, dormNumber } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(blockId)) {
      return res.status(400).json({ error: "Invalid block ID format" });
    }

    // Find the block and check if the dorm exists
    const block = await Block.findOne({
      _id: blockId,
      "floors.floorNumber": Number(floorNumber),
      "floors.dorms.dormNumber": dormNumber,
    });

    res.status(200).json({
      exists: !!block,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const getDormStatistics = async (req, res) => {
  try {
    const blocks = await Block.find({});
    
    // Initialize statistics
    const statistics = {
      totalDorms: 0,
      availableDorms: 0,
      maintenanceDorms: 0,
      usedDorms: 0,
      totalCapacity: 0,
      totalOccupied: 0,
      occupancyRate: 0,
      maintenanceRate: 0
    };

    // Calculate statistics
    blocks.forEach(block => {
      block.floors.forEach(floor => {
        floor.dorms.forEach(dorm => {
          statistics.totalDorms++;
          statistics.totalCapacity += dorm.capacity;
          statistics.totalOccupied += dorm.studentsAllocated;

          switch (dorm.dormStatus) {
            case 'Available':
              statistics.availableDorms++;
              break;
            case 'MaintenanceIssue':
              statistics.maintenanceDorms++;
              break;
            case 'UnAvailable':
              statistics.usedDorms++;
              break;
          }
        });
      });
    });

    // Calculate rates
    statistics.occupancyRate = statistics.totalDorms > 0 
      ? ((statistics.totalOccupied / statistics.totalCapacity) * 100).toFixed(1)
      : 0;
    
    statistics.maintenanceRate = statistics.totalDorms > 0
      ? ((statistics.maintenanceDorms / statistics.totalDorms) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = {
  registerDorm,
  updateDormStatus,
  checkDormExists,
  getIssueGroupDorm,
  getDormStatistics
};
