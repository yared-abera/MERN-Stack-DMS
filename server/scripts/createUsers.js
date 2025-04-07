const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/user/user');
const Student = require('../model/student/student');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DMS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Create users for each role
const createUsers = async () => {
  try {
    // Clear existing users (optional)
    // await User.deleteMany({});
    // await Student.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234', salt);

    // Check if users already exist
    const existingAdmin = await User.findOne({ userName: 'admin' });
    const existingDean = await User.findOne({ userName: 'dean' });
    const existingProctorManager = await User.findOne({ userName: 'proctormanager' });
    const existingProctor = await User.findOne({ userName: 'proctor' });
    const existingStudent = await Student.findOne({ userName: 'student' });

    // Create admin user if not exists
    if (!existingAdmin) {
      const adminUser = new User({
        fName: 'Admin',
        mName: 'User',
        lName: 'Admin',
        sex: 'male',
        phoneNum: '1234567890',
        userName: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created');
    } else {
      // Update password for existing admin
      await User.updateOne({ userName: 'admin' }, { password: hashedPassword });
      console.log('Admin user password updated');
    }

    // Create student dean user if not exists
    if (!existingDean) {
      const deanUser = new User({
        fName: 'Dean',
        mName: 'User',
        lName: 'Dean',
        sex: 'male',
        phoneNum: '1234567891',
        userName: 'dean',
        email: 'dean@example.com',
        password: hashedPassword,
        role: 'studentDean'
      });
      await deanUser.save();
      console.log('Dean user created');
    } else {
      // Update password for existing dean
      await User.updateOne({ userName: 'dean' }, { password: hashedPassword });
      console.log('Dean user password updated');
    }

    // Create proctor manager user if not exists
    if (!existingProctorManager) {
      const proctorManagerUser = new User({
        fName: 'Proctor',
        mName: 'Manager',
        lName: 'User',
        sex: 'male',
        phoneNum: '1234567892',
        userName: 'proctormanager',
        email: 'proctormanager@example.com',
        password: hashedPassword,
        role: 'proctorManager'
      });
      await proctorManagerUser.save();
      console.log('Proctor Manager user created');
    } else {
      // Update password for existing proctor manager
      await User.updateOne({ userName: 'proctormanager' }, { password: hashedPassword });
      console.log('Proctor Manager user password updated');
    }

    // Create proctor user if not exists
    if (!existingProctor) {
      const proctorUser = new User({
        fName: 'Proctor',
        mName: 'User',
        lName: 'Proctor',
        sex: 'male',
        phoneNum: '1234567893',
        userName: 'proctor',
        email: 'proctor@example.com',
        password: hashedPassword,
        role: 'proctor'
      });
      await proctorUser.save();
      console.log('Proctor user created');
    } else {
      // Update password for existing proctor
      await User.updateOne({ userName: 'proctor' }, { password: hashedPassword });
      console.log('Proctor user password updated');
    }

    // Create student user if not exists
    if (!existingStudent) {
      const studentUser = new Student({
        Fname: 'Student',
        Mname: 'User',
        Lname: 'Student',
        email: 'student@example.com',
        userName: 'student',
        phoneNum: '1234567894',
        password: hashedPassword,
        sex: 'male',
        batch: 2023,
        stream: 'Computer Science',
        studCategory: 'Regular',
        department: 'Computer Science',
        role: 'student'
      });
      await studentUser.save();
      console.log('Student user created');
    } else {
      // Update password for existing student
      await Student.updateOne({ userName: 'student' }, { password: hashedPassword });
      console.log('Student user password updated');
    }

    console.log('All users checked/created/updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createUsers(); 