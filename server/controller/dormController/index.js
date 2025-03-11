const Block = require('../../model/block/index');
const { isValidObjectId } = require('mongoose');

const registerDorm = async (req, res) => {
  try {
    const { blockId, floorNumber } = req.params;
    const { dormNumber, capacity } = req.body;

    // Validate ObjectId
    if (!isValidObjectId(blockId)) {
      return res.status(400).json({ error: "Invalid block ID format" });
    }

    // Validate required fields
    if (!dormNumber || !capacity) {
      return res.status(400).json({ error: "Dorm number and capacity are required" });
    }

    // Check if floor exists and has dorms array
    const block = await Block.findById(blockId);
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    const floorIndex = block.floors.findIndex(f => f.floorNumber === Number(floorNumber));
    if (floorIndex === -1) {
      return res.status(404).json({ error: "Floor not found in block" });
    }

    // Check for duplicate dorm
    const dormExists = block.floors[floorIndex].dorms.some(d => 
      d.dormNumber === Number(dormNumber)
    );
    if (dormExists) {
      return res.status(409).json({ error: "Dorm number already exists" });
    }

    // Add dorm to the floor
    block.floors[floorIndex].dorms.push({
      dormNumber: Number(dormNumber),
      capacity: Number(capacity),
      studentsAllocated: 0,
      dormStatus: "Available",
      totalAvailable: Number(capacity)
    });

    // Save the updated block
    await block.save();

    res.status(200).json({
      success: true,
      data: block.floors[floorIndex].dorms.slice(-1)[0]
    });

  } catch (err) {
    console.error("Server error:", err); // Log the full error
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = { registerDorm };