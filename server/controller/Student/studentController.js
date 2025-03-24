const Student = require("../../model/student/student");
 const bcryptjs=require('bcryptjs')
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
    

    // Check if username or email already exists
    const existingStudentByUsername = await Student.findOne({ userName });
    if (existingStudentByUsername) {
      return res.json({
        success: false,
        message: 'Username already exists.',
      });
    }

  
  const salt = await bcryptjs.genSalt(10);
    const hashedPassword=await bcryptjs.hash(password,salt)
    

    const newStudent = new Student({
      Fname,
      Mname,
      Lname,
      email,
      userName,
      phoneNum,
      password:hashedPassword ,
      sex,
      batch,
      isSpecial,
      disabilityStatus:isDisable,
      address,
      stream,
      studCategory,
      department,
      collage,
      blockNum:block,
      dormId:dorm,
      role,
    });
    
    await newStudent.save();
    res.status(201).json({ // Use 201 for successful resource creation
      success: true,
      message: 'Student Added Successfully',
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
    const {id}=req.params;
    console.log(id,"id in single user")
  
    const student = await Student.findById(id);
    if(!student){
      return  res.json({
        success: false,
        message:'user Not found',
      });
    }

    console.log(student)
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

module.exports = { InsertStudent,fetchAllStudent,fetchSingleStudent };
