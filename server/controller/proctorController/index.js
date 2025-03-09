const Block = require("../../model/block/index");
const assignProctorToBlock = async (req, res, next) => {
    try {
      const { blockNum, proctorIds } = req.body; // Now accepts an array of IDs
      
      // Authorization check for proctor manager
      if (req.user.role !== 'proctor_manager') {
        throw new UnauthorizedError('Only proctor managers can assign blocks');
      }
  
      // Validate input
      if (!blockNum || !proctorIds?.length) {
        throw new BadRequestError('Block number and proctor IDs are required');
      }
  
      const block = await Block.findOneAndUpdate(
        { blockNum },
        { $addToSet: { assignedProctors: { $each: proctorIds } } }, // Add multiple IDs
        { new: true }
      );
  
      if (!block) {
        throw new NotFoundError('Block not found');
      }
  
      res.json({ success: true, data: block });
    } catch (err) {
      next(err);
    }
  };


  // Remove proctors from a block
const removeProctorsFromBlock = async (req, res, next) => {
    try {
      const { blockNum, proctorIds } = req.body;
      
      if (req.user.role !== 'proctor_manager') {
        throw new UnauthorizedError('Only proctor managers can modify assignments');
      }
  
      const block = await Block.findOneAndUpdate(
        { blockNum },
        { $pull: { assignedProctors: { $in: proctorIds } } },
        { new: true }
      );
  
      if (!block) {
        throw new NotFoundError('Block not found');
      }
  
      res.json({ success: true, data: block });
    } catch (err) {
      next(err);
    }
  };

  module.exports={assignProctorToBlock,removeProctorsFromBlock}