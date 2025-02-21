const User = require("../../model/user/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserAccount = async (req, res) => {
  try {
    const {
      Fname,
      Lname,
      Mname,
      phoneNum,
      email,
      password,
      role,
      sex,
      userName,
    } = req.body;

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

const logInUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log("The password ", userName, password);

    const checkUser = await User.findOne({ userName });

    // Check if user exists
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist, please first register",
      });
    }

    // Check password match
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
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
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        username: checkUser.userName,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Set cookie and send response
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        email: checkUser.email,
        id: checkUser._id,
        role: checkUser.role,
        userName: checkUser.userName,
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

const LogOut = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "LogOut Successfully",
  });
};
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Corrected to req.cookies
    console.log("token", token);

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized User", // Corrected spelling
      });
    }
    const decode = jwt.verify(token, process.env.CLIENT_SECRET_KEY); // Use environment variable

    console.log(decode, "decode");
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
