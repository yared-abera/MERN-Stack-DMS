const User = require("../../model/user/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Student = require("../../model/student/student");

const logInUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const userModels = [User, Student];

    console.log(userName,password)

    let foundUser = null;

    for (const model of userModels) {
      const findUser = await model.findOne({ userName });
      if (findUser) {
        foundUser = findUser;
        break;
      } 
    }

    //const foundUser = await User.findOne({ userName });

    // Check if user exists
    if (!foundUser) {
      return res.json({
        success: false,
        message: "User doesn't exist, please first register",
      });
    }

    // Check if user is deactivated
    if (foundUser.status === 'inactive') {
      return res.json({
        success: false,
        message: "Your account has been deactivated. Please contact the administrator for assistance.",
      });
    }

    // Check password match
    const checkPasswordMatch = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role,
        userName: foundUser.userName,
        sex: foundUser.sex,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Set cookie and send response
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role,
        userName: foundUser.userName,
        sex: foundUser.sex,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const UserAccount = async (req, res) => {
  try {
    const {
      fName,
      lName,
      mName,
      phoneNum,
      email,
      password,
      role,
      gender,
      userName,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fName,
      mName,
      lName,
      sex: gender,
      phoneNum,
      userName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Successfully Added",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message, // Optionally include the error message
    });
  }
};
const LogOut = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "LogOut Successfully",
  });
};
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Corrected to req.cookies
console.log(token,"token");
    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized User", // Corrected spelling
      });
    }
    const decode = jwt.verify(token, process.env.CLIENT_SECRET_KEY); // Use environment variable

    req.user = decode;
    next();
  } catch (e) {
    console.error("Token verification failed:"); // Log the error for debugging
    return res.status(401).json({
      success: false,
      message: "Unauthorized User", // Corrected spelling
    });
  }
};

module.exports = { UserAccount, logInUser, LogOut, authMiddleware };
