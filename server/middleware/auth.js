const jwt = require("jsonwebtoken");
const checkUserStatus = require("./checkUserStatus");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check user status
    await checkUserStatus(req, res, next);
  } catch (error) {
    // Log the specific JWT error for debugging
    console.error("JWT Verification Error:", error.message); 
    
    let message = "Token verification failed. Please log in again.";
    if (error.name === 'TokenExpiredError') {
      message = "Your session has expired. Please log in again.";
    } else if (error.name === 'JsonWebTokenError') {
      message = "Invalid token. Please log in again.";
    }
    
    res.status(401).json({
      success: false,
      message: message // Use the more specific message
    });
  }
};

module.exports = auth; 