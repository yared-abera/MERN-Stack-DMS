const SearchHistory = require("../../model/user/recentSearchedUser");
const User = require("../../model/user/user");
const Student = require("../../model/student/student");

const addSearchHistory = async (req, res) => {
  const { userName, role } = req.body;

  console.log(userName, role, "userName, role");

  try {
    const userRole = role === "Student" ? Student : User;
    const userData = await userRole.findOne({ userName });
    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    let searchUser;
    const existingSearchHistory = await SearchHistory.findOne({ userId: userData._id, role });
    if (existingSearchHistory) {
      existingSearchHistory.timestamp = new Date();
      await existingSearchHistory.save();
      searchUser = existingSearchHistory;
    } else {
      searchUser = new SearchHistory({ userId: userData._id, role });
      await searchUser.save();
    }

    // Populate the user data based on the role
    let history;
    if (role === "Student") {
      history = await SearchHistory.findById(searchUser._id)
        .populate({
          path: "userId",
          model: "Student",
          select: "userName role Fname Lname Mname email sex phoneNum"
        })
        .lean();
    } else {
      history = await SearchHistory.findById(searchUser._id)
        .populate({
          path: "userId",
          model: "User",
          select: "userName role fName lName mName email sex phoneNum"
        })
        .lean();
    }
    
    console.log(history, "history");

    res.status(201).json({
      success: true,
      message: "Search history added successfully",
      data: history,
    });
  } catch (error) {
    console.error("Error adding search history:", error);
    res.status(500).json({ message: "Error adding search history" });
  }
};

const getSearchHistory = async (req, res) => {
  const { role } = req.params;

  // 1) Validate role
  if (!["Student", "User"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be "Student" or "User".',
    });
  }

  try {
    // 2) Get the most recent search history entries for the specified role
    let history;
    
    // Find the 5 most recent search history entries for the specified role
    const searchEntries = await SearchHistory.find({ role })
      .sort({ timestamp: -1 })
      .limit(5);
    
    // Populate the user data for each entry based on the role
    if (role === "Student") {
      history = await Promise.all(
        searchEntries.map(async (entry) => {
          return await SearchHistory.findById(entry._id)
            .populate({
              path: "userId",
              model: "Student",
              select: "userName role Fname Lname Mname email sex phoneNum"
            })
            .lean();
        })
      );
    } else {
      history = await Promise.all(
        searchEntries.map(async (entry) => {
          return await SearchHistory.findById(entry._id)
            .populate({
              path: "userId",
              model: "User",
              select: "userName role fName lName mName email sex phoneNum"
            })
            .lean();
        })
      );
    }

    console.log(history, "history");

    // 4) Send back
    return res.status(200).json({
      success: true,
      message: "Search history fetched successfully",
      data: history,
    });
  } catch (err) {
    console.error("getSearchHistory error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching search history",
    });
  }
};

module.exports = { addSearchHistory, getSearchHistory };