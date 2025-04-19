const User = require("../../model/user/user");
const bcrypt = require('bcryptjs');
const fetchAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy, role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select("-password")
      .sort(sortBy || "-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const fetchOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching single user:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is missing
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required!",
      });
    }

    const formData = req.body;

    // Update the user directly using id and formData as the update object
    const updatedUser = await User.findByIdAndUpdate(id, formData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is missing
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required!",
      });
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const pass = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      pass.currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.json({
        success: false,
        message: "Password Not Match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass.newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

module.exports = { fetchAllUser, fetchOneUser, UpdateUser, ChangePassword, deleteUser };
