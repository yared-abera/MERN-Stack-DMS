const User = require("../../model/user/user");
 
const bcrypt=require('bcryptjs')

const UserAccount = async (req, res) => {
  try {
    const { Fname, Lname, Mname, phoneNum, email, password, role, sex, userName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      Fname,
      Mname,
      Lname,
      email,
      userName,
      phoneNum,
      password: hashedPassword,
      sex,
      role,
    });

  
    await newUser.save()
    res.status(200).json({
      success: true,
      message: 'Successfully Added',
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.',
      error: error.message, // Optionally include the error message
    });
  }
};

const LogIn =async ()=>{

}


module.exports={UserAccount,LogIn}