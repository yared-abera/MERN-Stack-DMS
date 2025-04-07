const User = require("../model/user/user");

const checkUserStatus = async (req, res, next) => {
  try {
    // Get user ID from the token
    const userId = req.user.id;

    // Find the user and check their status
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is inactive
    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact the administrator."
      });
    }

    // If user is active, proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Error checking user status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = checkUserStatus; 