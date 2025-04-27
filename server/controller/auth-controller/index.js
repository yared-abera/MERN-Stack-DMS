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
 
    // Check if user exists
    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist, please first register",
      });
    }

    // Check if user is deactivated
    if (foundUser.status === 'inactive') {
      return res.status(401).json({
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
      return res.status(401).json({
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
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie with proper settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
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
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login. Please try again.",
    });
  }
};

// const UserAccount = async (req, res) => {
//   try {
//     const {
//       fName,
//       lName,
//       mName,
//       phoneNum,
//       email,
//       password,
//       role,
//       gender,
//       userName,
//     } = req.body;
//     console.log(req.body);

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       fName,
//       mName,
//       lName,
//       sex: gender,
//       phoneNum,
//       userName,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     await newUser.save();
//     res.status(200).json({
//       success: true,
//       message: "Successfully Added",
//     });

//     console.log("User created successfully")
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({
//       success: false,
//       message: "Server error, please try again later.",
//       error: error.message, // Optionally include the error message
//     });
//   }
// };


 
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


    const existingUserByUserName = await User.findOne({ userName });
    if (existingUserByUserName) {
      console.log(`Attempted to create user with existing username: ${userName}`);
      return res.status(409).json({ // Use 409 Conflict for duplicate resource
        success: false,
        message: "Username already exists. Please choose a different username.",
      });
    }

    // 2. Check if a user with the same email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
       console.log(`Attempted to create user with existing email: ${email}`);
      return res.status(409).json({ // Use 409 Conflict for duplicate resource
        success: false,
        message: "Email address already exists. Please use a different email.",
      });
    }

    console.log(existingUserByEmail,existingUserByUserName)

    // --- If checks pass, proceed with user creation ---

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

    console.log(`User "${userName}" created successfully`); // Log success
    res.status(200).json({
      success: true,
      message: "User account created successfully",
    });

  } catch (error) {
    console.error("Error creating user account:", error); // Log the error for debugging
    // Check if the error is a Mongoose duplicate key error (E11000)
    if (error.code === 11000) {
         // Although we have checks above, this is a fallback for race conditions
         const field = Object.keys(error.keyValue)[0];
         const value = error.keyValue[field];
         return res.status(409).json({
             success: false,
             message: `A user with that ${field} (${value}) already exists.`,
             error: error.message,
         });
     }
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message, // Include the error message for debugging on the client side
    });
  }
};

 

const LogOut = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      path: '/',
      expires: new Date(0)
    });

    return res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token found",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (tokenError) {
      // Clear the invalid token
      res.cookie("token", "", {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        path: '/',
        expires: new Date(0)
      });

      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again.",
        });
      }
      
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

module.exports = { UserAccount, logInUser, LogOut, authMiddleware };
