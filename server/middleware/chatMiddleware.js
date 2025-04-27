const jwt = require('jsonwebtoken');
const User = require('../model/user/user');


const chatMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.cookies.token; // Corrected to req.cookies
 
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for chat'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!user.status || user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      role: user.role,
      userName: user.userName
    };

    next();
  } catch (error) {
    console.error('Chat middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = chatMiddleware; 