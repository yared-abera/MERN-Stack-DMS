const SearchHistory = require("../../model/user/recentSearchedUser");
 
const User = require("../../model/user/user");
const Student = require("../../model/student/student");

const addSearchHistory = async (req, res) => {
  const { userName, role,id } = req.body;

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
    const existingSearchHistory = await SearchHistory.findOne({ userId: userData._id, role, searchedBy:id });
    if (existingSearchHistory) {
      existingSearchHistory.timestamp = new Date();
      await existingSearchHistory.save();
      searchUser = existingSearchHistory;
    } else {
      searchUser = new SearchHistory({ userId: userData._id, role, searchedBy:id });
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

 

// const getSearchHistory = async (req, res) => {
//   const { role, id } = req.params; // id is the ID of the user fetching the history

//   // 1) Validate role (role of the user fetching the history)
//   if (!["Student", "User"].includes(role)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid role. Must be "Student" or "User".',
//     });
//   }

//   try {
//     // 2) Get the most recent search history entries for the specified user (id)
//     // Find the 5 most recent search history entries created by the user with 'id'
//     let query = SearchHistory.find({ searchedBy: id })
//       .sort({ timestamp: -1 })
//       .limit(5);

//     // --- Fix for Issue 1: Apply population directly to the initial query ---
//     // Note: This logic still populates based on the *caller's* role (req.params.role).
//     //       See Potential Issue 2 explanation below.
//     if (role === "Student") {
//       // If the caller is a Student, assume the userId references a Student profile
//       query = query.populate({
//         path: "userId", // Assuming 'userId' is the field referencing the searched user
//         model: "Student", // Populate using the Student model
//         select: "userName role Fname Lname Mname email sex phoneNum" // Select desired fields from Student
//       });
//     } else { // Assuming role is "User" (Proctor/Dean etc.)
//       // If the caller is a User, assume the userId references a User profile
//       query = query.populate({
//         path: "userId", // Assuming 'userId' is the field referencing the searched user
//         model: "User", // Populate using the User model
//         select: "userName role fName lName mName email sex phoneNum" // Select desired fields from User
//       });
//     }

//     // Execute the query and populate
//     const history = await query.lean().exec(); // Use .exec() for proper promise handling, .lean() for plain objects

//     // 4) Send back
//     return res.status(200).json({
//       success: true,
//       message: "Search history fetched successfully",
//       data: history,
//     });
//   } catch (err) {
//     console.error("getSearchHistory error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching search history",
//       error: err.message // Include error message for debugging
//     });
//   }
// };

const getSearchHistory = async (req, res) => {
  const { role, id } = req.params;

  // Validate role
  if (!["Student", "User"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be "Student" or "User".',
    });
  }

  try {
     // 1. First find search history entries with basic info
     const baseQuery = {
      searchedBy: id,
      role: role // Add role filter to only get entries of this type
    };

    // 2. Configure population based on document's role (using refPath)
    const populatedResults = await SearchHistory.find(baseQuery)
      .populate({
        path: 'userId',
        select: role === 'Student' 
          ? 'userName role Fname Lname Mname email sex phoneNum'
          : 'userName role fName lName mName email sex phoneNum'
      })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    console.log(populatedResults, "populatedResults");
    
    return res.status(200).json({
      success: true,
      message: "Search history fetched successfully",
      data: populatedResults,
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