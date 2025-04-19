const Block = require('../../model/block/index');
const { isValidObjectId } = require('mongoose');

const registerDorm = async (req, res) => {
  try {
    const { blockId, floorNumber } = req.params;
    const { dormNumber, capacity } = req.body;
    
    console.log('Registering dorm:', { blockId, floorNumber, dormNumber, capacity });
    
    // Validate ObjectId
    if (!isValidObjectId(blockId)) {
      return res.status(400).json({ error: "Invalid block ID format" });
    }

    // Validate required fields
    if (!dormNumber || !capacity) {
      return res.status(400).json({ error: "Dorm number and capacity are required" });
    }

    // Check if dorm already exists
    const block = await Block.findOne({ 
      _id: blockId,
      'floors.floorNumber': Number(floorNumber),
      'floors.dorms.dormNumber': dormNumber
    });

    if (block) {
      return res.status(400).json({ error: `Dorm ${dormNumber} already exists on floor ${floorNumber}` });
    }

    // First, add the new dorm
    const result = await Block.findOneAndUpdate(
      { 
        _id: blockId,
        'floors.floorNumber': Number(floorNumber)
      },
      {
        $push: {
          'floors.$.dorms': {
            dormNumber: dormNumber,
            capacity: Number(capacity),
            studentsAllocated: 0,
            dormStatus: "Available",
            totalAvailable: Number(capacity)
          }
        }
      },
      { 
        new: true
      }
    );

    if (!result) {
      return res.status(404).json({ error: "Block or floor not found" });
    }

    // Get the updated floor
    const floor = result.floors.find(f => f.floorNumber === Number(floorNumber));
    
    // Calculate floor capacity and available
    const floorCapacity = floor.dorms.reduce((sum, dorm) => sum + dorm.capacity, 0);
    const floorAvailable = floor.dorms.reduce((sum, dorm) => sum + (dorm.capacity - dorm.studentsAllocated), 0);

    // Update floor values
    await Block.updateOne(
      { 
        _id: blockId,
        'floors.floorNumber': Number(floorNumber)
      },
      {
        $set: {
          'floors.$.floorCapacity': floorCapacity,
          'floors.$.totalAvailable': floorAvailable,
          'floors.$.floorStatus': floorAvailable > 0 ? "Available" : "Unavailable"
        }
      }
    );

    // Get updated block for final calculations
    const updatedBlock = await Block.findById(blockId);
    
    // Calculate block totals
    const blockTotalCapacity = updatedBlock.floors.reduce((sum, floor) => sum + (floor.floorCapacity || 0), 0);
    const blockTotalAvailable = updatedBlock.floors.reduce((sum, floor) => sum + (floor.totalAvailable || 0), 0);

    // Update block values
    const finalBlock = await Block.findByIdAndUpdate(
      blockId,
      {
        $set: {
          totalCapacity: blockTotalCapacity,
          totalAvailable: blockTotalAvailable,
          status: blockTotalAvailable > 0 ? "Available" : "Full"
        }
      },
      { new: true }
    );

    // Get the newly added dorm for response
    const finalFloor = finalBlock.floors.find(f => f.floorNumber === Number(floorNumber));
    const newDorm = finalFloor.dorms[finalFloor.dorms.length - 1];

    res.status(200).json({
      success: true,
      data: newDorm
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
      return res.status(400).json({ error: "Invalid block ID format" });
    }

    if (!status || !['Available', 'Under Maintenance', 'Used By Other People'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await Block.findOneAndUpdate(
      {
        _id: blockId,
        'floors.floorNumber': Number(floorNumber),
        'floors.dorms.dormNumber': dormNumber
      },
      {
        $set: {
          'floors.$.dorms.$[dorm].dormStatus': status
        }
      },
      {
        arrayFilters: [{ 'dorm.dormNumber': dormNumber }],
        new: true
      }
    );

    if (!result) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    // Find the updated dorm
    const floor = result.floors.find(f => f.floorNumber === Number(floorNumber));
    const updatedDorm = floor.dorms.find(d => d.dormNumber === dormNumber);

    res.status(200).json({
      success: true,
      data: updatedDorm
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

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
      'floors.floorNumber': Number(floorNumber),
      'floors.dorms.dormNumber': dormNumber
    });

    res.status(200).json({
      exists: !!block
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = { registerDorm, updateDormStatus, checkDormExists };