const Block = require('../../model/block/index');
const { isValidObjectId } = require('mongoose');
const Dorm = require('../../model/dorm');

const registerDorm = async (req, res) => {
  try {
    const { blockId, floorNumber } = req.params;
    const { dormNumber, capacity } = req.body;

    // Validate ObjectId
    if (!isValidObjectId(blockId)) {
      return res.status(400).json({ error: "Invalid block ID format" });
    }

    // Find existing block
    const block = await Block.findById(blockId);
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    // Find target floor
    const floor = block.floors.find(f => f.floorNumber === Number(floorNumber));
    if (!floor) {
      return res.status(404).json({ error: "Floor not found in block" });
    }

    // Check for duplicate dorm
    if (floor.dorms.some(d => d.dormNumber === Number(dormNumber))) {
      return res.status(409).json({ error: "Dorm number already exists" });
    }

    // Add new dorm
    floor.dorms.push({
      dormNumber: Number(dormNumber),
      capacity: Number(capacity),
      studentsAllocated: 0,
      dormStatus: "Available",
      totalAvailable: Number(capacity)
    });

    await block.save();
    
    res.status(200).json({
      success: true,
      data: floor.dorms[floor.dorms.length - 1]
    });

  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};


module.exports = {registerDorm}  
 
 
 