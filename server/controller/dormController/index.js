// controllers/dormController.js
const Block = require('../models/Block');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors');

const registerDorm = async (req, res, next) => {
  try {
    
    const { blockNum, floorNumber, dormNumber, capacity } = req.body;
    
    const proctorId = req.user.id; // From auth middleware
    // Validate input
    if (!blockNum || !floorNumber || !dormNumber || !capacity) {
      
      throw new BadRequestError('All fields are required');
    
    }

    // Find the block
    const block = await Block.findOne({ blockNum });
    if (!block) {
      throw new NotFoundError('Block not found');
    }

    // Check proctor authorization
    if (!block.assignedProctors.includes(proctorId)) {
      throw new UnauthorizedError('Not authorized for this block');
    }

    // Find the floor
    const floor = block.floors.find(f => f.floorNumber === Number(floorNumber));
    if (!floor) {
      throw new NotFoundError('Floor not found in block');
    }

    // Check for existing dorm number
    if (floor.dorms.some(d => d.dormNumber === dormNumber)) {
      throw new ConflictError('Dorm number already exists on this floor');
    }

    // Create new dorm
    const newDorm = {
      dormNumber,
      capacity,
      studentsAllocated: 0,
      dormStatus: 'Available',
      totalAvailable: capacity
    };

    floor.dorms.push(newDorm);
    await block.save();

    res.status(201).json({
      success: true,
      data: newDorm
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { registerDorm };