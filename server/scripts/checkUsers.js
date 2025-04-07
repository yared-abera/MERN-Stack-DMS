const mongoose = require('mongoose');
const User = require('../model/user/user');
const Student = require('../model/student/student');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DMS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Check users in the database
const checkUsers = async () => {
  try {
    // Check regular users
    const users = await User.find({});
    console.log('Regular Users:');
    console.log(users.map(user => ({
      userName: user.userName,
      role: user.role,
      email: user.email
    })));

    // Check students
    const students = await Student.find({});
    console.log('\nStudent Users:');
    console.log(students.map(student => ({
      userName: student.userName,
      role: student.role,
      email: student.email
    })));

    console.log(`\nTotal Users: ${users.length + students.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUsers(); 