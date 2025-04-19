const FeedBack = require("../../model/feedback/index");
const Student = require("../../model/student/student");
 const mongoose=require('mongoose');

const AddFeedBack = async (req, res) => {
  try {
    const { userName, description, sex } = req.body;

    // Validate required fields
    if (!userName || !sex) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // Find student
    const user = await Student.findOne({ userName });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create feedback
    const newfeedBack = new FeedBack({
      userId: user._id,
      sex: sex,
      description, // Corrected spelling
    });

    await newfeedBack.save();

    // Corrected response object
    res.status(200).json({
      success: true,
      message: "Feedback added successfully",
      data: newfeedBack,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

const fetchFeedBack = async (req, res) => {
  const { sex } = req.params;

  try {
    const getFeedBack = await FeedBack.find({ sex: sex }).populate({
      path: "userId",
      model: "Student",
      select: "userName role Fname Lname Mname email sex phoneNum blockNum dormId", // Fixed 'Fame' to 'Fname'
    });

    // Send response with data
    res.status(200).json({
      success: true,
      message: "Feedback retrieved successfully",
      data: getFeedBack,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

const fetchFeedBackForStud = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('Fetching feedback for ID:', id); // Use logger in production

    // 1. Check if ID exists
    if (!id) {
      return res.status(400).json({ // <-- Use res object and status 400
        success: false,
        message: "ID Parameter is required",
      });
    }

    // 2. Validate ID format (Example for MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ // <-- Use res object and status 400
          success: false,
          message: "Invalid ID format",
      });
    }

    // 3. Perform the query
    const getFeedBack = await FeedBack.find({ userId: id }).populate({
      path: "userId",
      model: "Student", // Ensure 'Student' model is registered with Mongoose
      select: "userName role Fname Lname Mname email sex phoneNum",
    });

    // console.log('Feedback found:', getFeedBack); // Use logger in production
console.log(getFeedBack)
    // 4. Send success response
    res.status(200).json({
      success: true,
      data: getFeedBack, // This will be an empty array if no feedback is found
    });

  } catch (error) {
    console.error("Error fetching feedback:", error); // Keep detailed server log
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      // Avoid sending raw error messages to the client in production for security
      // error: error.message, // Maybe only include this in development mode
    });
  }

}


const fetchAllFeedBack = async (req, res) => {
  try {
    
   

    // 3. Perform the query
    const getFeedBack = await FeedBack.find().populate({
      path: "userId",
      model: "Student", // Ensure 'Student' model is registered with Mongoose
      select: "userName role Fname Lname Mname email sex phoneNum",
    });

    // console.log('Feedback found:', getFeedBack); // Use logger in production
console.log(getFeedBack)
    // 4. Send success response
    res.status(200).json({
      success: true,
      data: getFeedBack, // This will be an empty array if no feedback is found
    });

  } catch (error) {
    console.error("Error fetching feedback:", error); // Keep detailed server log
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      // Avoid sending raw error messages to the client in production for security
      // error: error.message, // Maybe only include this in development mode
    });
  }

}

module.exports = { fetchFeedBack, AddFeedBack, fetchFeedBackForStud,fetchAllFeedBack };
