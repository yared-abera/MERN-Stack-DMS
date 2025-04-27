const Student = require("../../model/student/student");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const Block = require("../../model/block/index");
const SearchHistory = require("../../model/user/recentSearchedUser");
const Control = require("../../model/control/control-Model");
const FeedBack=require('../../model/feedback/index')
const bcrypt = require("bcryptjs");
const InsertStudent = async (req, res) => {
  try {
    const {
      Fname,
      Mname,
      Lname,
      email,
      userName,
      phoneNum,
      password,
      sex,
      batch,
      isSpecial,
      isDisable,
      address,
      stream,
      studCategory,
      department,
      collage,
      block,
      dorm,
      role,
    } = req.body;

    const stud = req.body;
    console.log(stud, "stud");

    // Check if username or email already exists
    const existingStudentByUsername = await Student.findOne({ userName });
    if (existingStudentByUsername) {
      return res.json({
        success: false,
        message: "Username already exists.",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newStudent = new Student({
      Fname,
      Mname,
      Lname,
      email,
      userName,
      phoneNum,
      password: hashedPassword,
      sex,
      batch,
      isSpecial,
      disabilityStatus: isDisable,
      address,
      stream,
      studCategory,
      department,
      collage,
      blockNum: block,
      dormId: dorm,
      role,
    });

    await newStudent.save();
    res.status(201).json({
      // Use 201 for successful resource creation
      success: true,
      message: "Student Added Successfully",
      data: newStudent, // Optionally return the newly created student data
    });
  } catch (error) {
    console.error("Error inserting student:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later on inserting student.",
      error: error.message,
    });
  }
};

const fetchAllStudent = async (req, res) => {
  try {
    const allStudents = await Student.find();
    res.status(200).json({
      success: true,
      data: allStudents,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const fetchSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.json({
        success: false,
        message: "user Not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching single students:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validate the student ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // 2) Load the existing student
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.json({
        success: false,
        message: "Student not found",
      });
    }

    // 3) Build an `updates` object from only the provided fields
    const updatableFields = [
      "Fname",
      "Mname",
      "Lname",
      "blockNum",
      "dormId",
      "sex",
      "studCategory",
      "userName",
    ];
    const updates = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 4) If no valid fields were sent, bail out
    if (Object.keys(updates).length === 0) {
      return res.json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    // 5) Detect whether block or dorm is actually changing
    const blockChanging =
      "blockNum" in updates &&
      updates.blockNum.toString() !== existingStudent.blockNum.toString();
    const dormChanging =
      "dormId" in updates &&
      updates.dormId.toString() !== existingStudent.dormId.toString();

    if (blockChanging || dormChanging) {
      //
      // A) Compute old vs. new values & locations
      //
      const oldBlockNum = existingStudent.blockNum;
      const oldDormId = existingStudent.dormId;
      const oldSex = existingStudent.sex;
      const newBlockNum = updates.blockNum || oldBlockNum;
      const newDormId = updates.dormId || oldDormId;
      const newSex = updates.sex || oldSex;

      const oldBlockLoc = oldSex === "Male" ? "maleArea" : "femaleArea";
      const newBlockLoc = newSex === "Male" ? "maleArea" : "femaleArea";

      //
      // B) Load & adjust the OLD block/dorm (decrement)
      //
      const oldBlock = await Block.findOne({
        blockNum: oldBlockNum,
        location: oldBlockLoc,
      });
      if (oldBlock) {
        for (const floor of oldBlock.floors) {
          const d = floor.dorms.find(
            (d) => d.dormNumber.toString() === oldDormId.toString()
          );
          if (d) {
            d.studentsAllocated = Math.max(0, d.studentsAllocated - 1);
            break;
          }
        }
        await oldBlock.save();
      }

      //
      // C) Load & verify the NEW block/dorm (availability + increment)
      //
      const newBlock = await Block.findOne({
        blockNum: newBlockNum,
        location: newBlockLoc,
      });
      if (!newBlock) {
        return res.json({
          success: false,
          message: "Target block not found or not available for this sex",
        });
      }

      // find the dorm subdoc by _id
      const newDorm = newBlock.floors
        .flatMap((f) => f.dorms)
        .find((d) => d.dormNumber.toString() === newDormId.toString());

      if (!newDorm) {
        return res.json({
          success: false,
          message: "Target dorm not found in the specified block",
        });
      }

      if (newDorm.status !== "Available") {
        return res.json({
          success: false,
          message: "Target dorm is full, no space available",
        });
      }

      newDorm.studentsAllocated++;
      await newBlock.save();
    }

    //
    // 6) Finally, update the student record
    //
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};




 
// const updateByStudent = async (req, res) => {
//   const { id } = req.params;
  
//   const formData = req.body;
  
//   try {
//     console.log(id, "id from student update by proctor");
//     console.log(formData, "formData from  student update by proctor");
   
//    // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid student ID format",
//       });
//     }

  
//     // Find and update the student with proper update syntax
//     const updatedStudent = await Student.findByIdAndUpdate(
//       {_id:id},
//       { ...formData }, // Spread the form data into the update object
//       { new: true, runValidators: true } // Options: return updated doc and run validators
//     );

//     // Handle case where student not found
//     if (!updatedStudent) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     // Send successful response
//     res.status(200).json({
//       success: true,
//       message: 'Student updated successfully',
//       data: updatedStudent
//     });

//   } catch (error) {
//     // Handle different error types
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: "Validation Error",
//         error: error.message
//       });
//     }

//     // Handle server errors
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };
const updateByStudent = async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  try {
    console.log(id, "id from student update by proctor");
    console.log(formData, "formData from student update by proctor");

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    // Find and update the student correctly
    const updatedStudent = await Student.findByIdAndUpdate(
      id,            // ✅ Fixed here
      { $set: { ...formData } }, // Spread the form data into the update object
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const DeleteStudent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1) Validate the student ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid student ID",
//       });
//     }

//     // 2) Fetch the student so we know their block/dorm/sex
//     const student = await Student.findById(id);
//     if (!student) {
//       return res.json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     const { blockNum, dormId, sex } = student;
//     const blockLocation = sex === "Male" ? "maleArea" : "femaleArea";

//     // 3) Load the block document
//     const block = await Block.findOne({ blockNum, location: blockLocation });
//     if (!block) {
//       return res.json({
//         success: false,
//         message: "Block not found for this student",
//       });
//     }

//     // 4) Find the dorm inside any floor and decrement its counter
//     let dormFound = false;
//     for (const floor of block.floors) {
//       const dorm = floor.dorms.find(
//         (d) => d.dormNumber.toString() === dormId.toString()
//       );
//       if (dorm) {
//         dormFound = true;
//         // Never go below zero
//         dorm.studentsAllocated = Math.max(0, dorm.studentsAllocated - 1);
//         break;
//       }
//     }

//     if (!dormFound) {
//       return res.json({
//         success: false,
//         message: "Dorm not found in the specified block",
//       });
//     }

//     // 5) Persist the updated block
//     await block.save();

//     // 6) Delete the student record from the recently searched student
//     const deletedRecentlySearchedStudent = await SearchHistory.findOne({
//       userId: id,
//       role: "Student",
//     });
//     if (deletedRecentlySearchedStudent) {
//       await deletedRecentlySearchedStudent.findByIdAndDelete(
//         deletedRecentlySearchedStudent._id
//       );
//     }

//     const deletedControl = await Control.findOne({
//       student: id,
//     });
//     if (deletedControl) {
//       await deletedControl.findByIdAndDelete(deletedControl._id);
//     }


//     const deletedFeedBack = await FeedBack.findOne({
//       userId: id,
//     });
//     if (deletedFeedBack) {
//       await deletedFeedBack.findByIdAndDelete(deletedControl._id);
    
//     // 6) Finally, delete the student record
//     const deleted = await Student.findByIdAndDelete(id);
//     // (we already know it existed, so `deleted` should be truthy)

//     return res.status(200).json({
//       success: true,
//       message: "Student deleted successfully",
//       data: deleted,
//     });
//   }
//  } catch (error) {
//     console.error("Error deleting student:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error, please try again later.",
//     });
//   }
// }

const DeleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validate the student ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // 2) Fetch the student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const { blockNum, dormId, sex } = student;
    const blockLocation = sex === "Male" ? "maleArea" : "femaleArea";

    // 3) Find the block
    const block = await Block.findOne({ blockNum, location: blockLocation });
    if (!block) {
      return res.status(404).json({
        success: false,
        message: "Block not found for this student",
      });
    }

    // 4) Update dorm allocation
    let dormFound = false;
    for (const floor of block.floors) {
      const dorm = floor.dorms.find(
        (d) => d.dormNumber.toString() === dormId.toString()
      );
      if (dorm) {
        dormFound = true;
        dorm.studentsAllocated = Math.max(0, dorm.studentsAllocated - 1);
        break;
      }
    }

    if (!dormFound) {
      return res.status(404).json({
        success: false,
        message: "Dorm not found in the specified block",
      });
    }

    // 5) Save block changes
    await block.save();

    // 6) Delete related records
    // Delete from SearchHistory
    await SearchHistory.findOneAndDelete({
      userId: id,
      role: "Student",
    });

    // Delete from Control
    await Control.findOneAndDelete({
      student: id,
    });

    // Delete from FeedBack
    await FeedBack.findOneAndDelete({
      userId: id,
    });

    // 7) Delete the student
    const deletedStudent = await Student.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
    
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};
 
 


const DeleteAllStudent = async (req, res) => {
  try {
    const studentData = req.body;
    if (!Array.isArray(studentData) || studentData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No student to delete",
      });
    }

    const deletedStudents = [];
    const failedStudents = [];

    for (const studentItem of studentData) {
      try {
        const student = await Student.findById(studentItem._id);
        if (!student) {
          failedStudents.push(studentItem._id);
          continue;
        }

        // 1) Decrement the dorm count
        const { blockNum, dormId, sex } = student;
        const blockLocation = sex === "Male" ? "maleArea" : "femaleArea";
        const block = await Block.findOne({
          blockNum,
          location: blockLocation,
        });
        if (!block) {
          failedStudents.push(studentItem._id);
          continue;
        }
        let dormFound = false;
        for (const floor of block.floors) {
          const dorm = floor.dorms.find(
            (d) => d.dormNumber.toString() === dormId.toString()
          );
          if (dorm) {
            dormFound = true;
            dorm.studentsAllocated = Math.max(0, dorm.studentsAllocated - 1);
            break;
          }
        }
        if (!dormFound) {
          failedStudents.push(studentItem._id);
          continue;
        }
        await block.save();

        // 2) Remove all search‑history entries for this student
        await SearchHistory.deleteMany({
          userId: student._id,
          role: "Student",
        });

        await Control.deleteMany({
          student: student._id,
        });

        await FeedBack.deleteMany({
          userId: student._id,
        });

        // 3) Finally delete the student
        const deleted = await Student.findByIdAndDelete(student._id);
        if (deleted) {
          deletedStudents.push(deleted);
        } else {
          failedStudents.push(studentItem._id);
        }
      } catch (err) {
        console.error(`Error deleting student ${studentItem._id}:`, err);
        failedStudents.push(studentItem._id);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Student deletion process completed",
      data: { deletedStudents, failedStudents },
    });
  } catch (error) {
    console.error("Error in DeleteAllStudent:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting students",
      error: error.message,
    });
  }
};

const fetchStuentForProctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        message: "Proctor ID is required",
      });
    }
    console.log(id, "id");
    // Find the block assigned to the proctor using the $in operator
    const getBlock = await Block.findOne({ assignedProctors: { $in: [id] } });

    if (!getBlock) {
      return res.status(404).json({
        success: false,
        message: "Block not found for this proctor",
      });
    }

    // Assuming your Student schema has a 'blockNum' field that corresponds to the Block's blockNum
    const students = await Student.find({ blockNum: getBlock.blockNum });

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students for proctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching students",
      error: error.message,
    });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const pass = req.body;

    const user = await Student.findById(id);

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

module.exports = {
  InsertStudent,
  fetchAllStudent,
  fetchSingleStudent,
  updateStudent,
  DeleteStudent,
  DeleteAllStudent,
  fetchStuentForProctor,
  updateByStudent,
  ChangePassword,
};
