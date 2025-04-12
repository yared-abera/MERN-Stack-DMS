const Student = require("../../model/student/student");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const Block = require("../../model/block/index");
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
      const oldBlockNum   = existingStudent.blockNum;
      const oldDormId     = existingStudent.dormId;
      const oldSex        = existingStudent.sex;
      const newBlockNum   = updates.blockNum || oldBlockNum;
      const newDormId     = updates.dormId   || oldDormId;
      const newSex        = updates.sex      || oldSex;

      const oldBlockLoc = oldSex === "Male"   ? "maleArea"   : "femaleArea";
      const newBlockLoc = newSex === "Male"   ? "maleArea"   : "femaleArea";

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

    // 2) Fetch the student so we know their block/dorm/sex
    const student = await Student.findById(id);
    if (!student) {
      return res.json({
        success: false,
        message: "Student not found",
      });
    }

    const { blockNum, dormId, sex } = student;
    const blockLocation = sex === "Male" ? "maleArea" : "femaleArea";

    // 3) Load the block document
    const block = await Block.findOne({ blockNum, location: blockLocation });
    if (!block) {
      return res.json({
        success: false,
        message: "Block not found for this student",
      });
    }

    // 4) Find the dorm inside any floor and decrement its counter
    let dormFound = false;
    for (const floor of block.floors) {
      const dorm = floor.dorms.find(
        (d) => d.dormNumber.toString() === dormId.toString()
      );
      if (dorm) {
        dormFound = true;
        // Never go below zero
        dorm.studentsAllocated = Math.max(0, dorm.studentsAllocated - 1);
        break;
      }
    }

    if (!dormFound) {
      return res.json({
        success: false,
        message: "Dorm not found in the specified block",
      });
    }

    // 5) Persist the updated block
    await block.save();

    // 6) Finally, delete the student record
    const deleted = await Student.findByIdAndDelete(id);
    // (we already know it existed, so `deleted` should be truthy)

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deleted,
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
    console.log(studentData,'studentData')
    const deletedStudents = [];
    const failedStudents = [];

    if (studentData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No student to delete'
      });
    }

    // Process students sequentially to avoid race conditions
    for (const studentItem of studentData) {
      try {
        // Find the student by ID
        const student = await Student.findById(studentItem._id);
        if (!student) {
          failedStudents.push(studentItem._id);
          continue;
        }

        const { blockNum, dormId, sex } = student;
        const blockLocation = sex === "Male" ? "maleArea" : "femaleArea";

        // Load the block document
        const block = await Block.findOne({ blockNum, location: blockLocation });
        if (!block) {
          failedStudents.push(studentItem._id);
          continue;
        }

        // Find the dorm inside any floor and decrement its counter
        let dormFound = false;
        for (const floor of block.floors) {
          const dorm = floor.dorms.find(
            (d) => d.dormNumber.toString() === dormId.toString()
          );
          if (dorm) {
            dormFound = true;
            // Never go below zero
            dorm.studentsAllocated = Math.max(0, dorm.studentsAllocated - 1);
            break;
          }
        }

        if (!dormFound) {
          failedStudents.push(studentItem._id);
          continue;
        }

        // Persist the updated block
        await block.save();

        // Finally, delete the student record
        const deleted = await Student.findByIdAndDelete(studentItem._id);
        if (deleted) {
          deletedStudents.push(deleted);
        } else {
          failedStudents.push(studentItem._id);
        }
      } catch (error) {
        // If any individual student deletion fails, add to failed list and continue
        failedStudents.push(studentItem._id);
        console.error(`Error deleting student ${studentItem._id}:`, error);
      }
    }

    // Return the final response after processing all students
    return res.status(200).json({
      success: true,
      message: 'Student deletion process completed',
      data: {
        deletedStudents,
        failedStudents
      }
    });
  } catch (error) {
    console.error('Error in DeleteAllStudent:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting students',
      error: error.message
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
};
