/**
 * MongoDB Database Seeder
 * 
 * This script adds test data to the database to demonstrate the backup functionality.
 * Run this script once to populate your database with sample data.
 */

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database configuration
const DB_NAME = 'DMS';
const MONGODB_URI = `mongodb://localhost:27017/${DB_NAME}`;

// Sample data
const users = [
  {
    fName: 'Admin',
    lName: 'User',
    mName: '',
    sex: 'Male',
    phoneNum: '1234567890',
    userName: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date()
  },
  {
    fName: 'Student',
    lName: 'User',
    mName: '',
    sex: 'Female',
    phoneNum: '9876543210',
    userName: 'student',
    email: 'student@example.com',
    role: 'Student',
    status: 'active',
    createdAt: new Date()
  },
  {
    fName: 'Proctor',
    lName: 'Manager',
    mName: '',
    sex: 'Male',
    phoneNum: '5555555555',
    userName: 'proctor',
    email: 'proctor@example.com',
    role: 'Proctor',
    status: 'active',
    createdAt: new Date()
  }
];

const blocks = [
  {
    name: 'Block A',
    blockNumber: 'A1',
    description: 'Male dormitory block',
    totalRooms: 50,
    availableRooms: 20,
    gender: 'Male',
    createdAt: new Date()
  },
  {
    name: 'Block B',
    blockNumber: 'B1',
    description: 'Female dormitory block',
    totalRooms: 50,
    availableRooms: 15,
    gender: 'Female',
    createdAt: new Date()
  }
];

const dorms = [
  {
    dormNumber: 'A101',
    blockId: null, // Will be set after creating blocks
    capacity: 4,
    description: 'Standard dormitory room',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    dormNumber: 'B101',
    blockId: null, // Will be set after creating blocks
    capacity: 4,
    description: 'Standard dormitory room',
    isAvailable: true,
    createdAt: new Date()
  }
];

const students = [
  {
    fName: 'John',
    lName: 'Smith',
    userName: 'john.smith',
    email: 'john.smith@example.com',
    phoneNum: '1231231234',
    gender: 'Male',
    role: 'Student',
    status: 'active',
    IDNumber: 'STU001',
    department: 'Computer Science',
    year: 'Year 2',
    block: null, // Will be set after creating blocks
    dorm: null, // Will be set after creating dorms
    createdAt: new Date()
  },
  {
    fName: 'Jane',
    lName: 'Doe',
    userName: 'jane.doe',
    email: 'jane.doe@example.com',
    phoneNum: '3213214321',
    gender: 'Female',
    role: 'Student',
    status: 'active',
    IDNumber: 'STU002',
    department: 'Mathematics',
    year: 'Year 3',
    block: null, // Will be set after creating blocks
    dorm: null, // Will be set after creating dorms
    createdAt: new Date()
  }
];

const maintenanceIssues = [
  {
    title: 'Broken Window',
    description: 'The window in room A101 is broken and needs to be fixed',
    priority: 'High',
    status: 'Pending',
    reportedBy: null, // Will be set after creating users
    dormNumber: 'A101',
    blockNumber: 'A1',
    createdAt: new Date()
  },
  {
    title: 'Leaky Faucet',
    description: 'The faucet in the bathroom of B101 is leaking',
    priority: 'Medium',
    status: 'In Progress',
    reportedBy: null, // Will be set after creating users
    dormNumber: 'B101',
    blockNumber: 'B1',
    createdAt: new Date()
  }
];

// Seed function
async function seedDatabase() {
  let client;
  
  try {
    console.log(`Connecting to MongoDB database: ${DB_NAME}...`);
    client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    const db = client.db(DB_NAME);
    
    // Check existing collections to avoid duplicating data
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Existing collections:', collectionNames.join(', ') || 'None');
    
    // Create collections if they don't exist
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('Created users collection');
    }
    
    if (!collectionNames.includes('blocks')) {
      await db.createCollection('blocks');
      console.log('Created blocks collection');
    }
    
    if (!collectionNames.includes('dorms')) {
      await db.createCollection('dorms');
      console.log('Created dorms collection');
    }
    
    if (!collectionNames.includes('students')) {
      await db.createCollection('students');
      console.log('Created students collection');
    }
    
    if (!collectionNames.includes('maintenance')) {
      await db.createCollection('maintenance');
      console.log('Created maintenance collection');
    }
    
    // Seed users
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    
    if (userCount === 0) {
      console.log('Seeding users...');
      
      // Hash passwords for users
      const salt = await bcrypt.genSalt(10);
      const usersWithHashedPasswords = await Promise.all(users.map(async user => {
        const hashedPassword = await bcrypt.hash('password123', salt);
        return { ...user, password: hashedPassword };
      }));
      
      await usersCollection.insertMany(usersWithHashedPasswords);
      console.log(`Added ${usersWithHashedPasswords.length} users`);
    } else {
      console.log(`Users collection already has ${userCount} documents, skipping`);
    }
    
    // Seed blocks
    const blocksCollection = db.collection('blocks');
    const blockCount = await blocksCollection.countDocuments();
    
    if (blockCount === 0) {
      console.log('Seeding blocks...');
      const result = await blocksCollection.insertMany(blocks);
      console.log(`Added ${result.insertedCount} blocks`);
      
      // Update block IDs in dorms
      const blockDocs = await blocksCollection.find().toArray();
      dorms[0].blockId = blockDocs[0]._id;
      dorms[1].blockId = blockDocs[1]._id;
      
      // Update block IDs in students
      students[0].block = blockDocs[0]._id;
      students[1].block = blockDocs[1]._id;
    } else {
      console.log(`Blocks collection already has ${blockCount} documents, skipping`);
      
      // Get block IDs for reference
      const blockDocs = await blocksCollection.find().toArray();
      if (blockDocs.length >= 2) {
        dorms[0].blockId = blockDocs[0]._id;
        dorms[1].blockId = blockDocs[1]._id;
        
        students[0].block = blockDocs[0]._id;
        students[1].block = blockDocs[1]._id;
      }
    }
    
    // Seed dorms
    const dormsCollection = db.collection('dorms');
    const dormCount = await dormsCollection.countDocuments();
    
    if (dormCount === 0) {
      console.log('Seeding dorms...');
      const result = await dormsCollection.insertMany(dorms);
      console.log(`Added ${result.insertedCount} dorms`);
      
      // Update dorm IDs in students
      const dormDocs = await dormsCollection.find().toArray();
      students[0].dorm = dormDocs[0]._id;
      students[1].dorm = dormDocs[1]._id;
    } else {
      console.log(`Dorms collection already has ${dormCount} documents, skipping`);
      
      // Get dorm IDs for reference
      const dormDocs = await dormsCollection.find().toArray();
      if (dormDocs.length >= 2) {
        students[0].dorm = dormDocs[0]._id;
        students[1].dorm = dormDocs[1]._id;
      }
    }
    
    // Seed students
    const studentsCollection = db.collection('students');
    const studentCount = await studentsCollection.countDocuments();
    
    if (studentCount === 0) {
      console.log('Seeding students...');
      
      // Hash passwords for students
      const salt = await bcrypt.genSalt(10);
      const studentsWithHashedPasswords = await Promise.all(students.map(async student => {
        const hashedPassword = await bcrypt.hash('password123', salt);
        return { ...student, password: hashedPassword };
      }));
      
      const result = await studentsCollection.insertMany(studentsWithHashedPasswords);
      console.log(`Added ${result.insertedCount} students`);
      
      // Update student IDs in maintenance issues
      const studentDocs = await studentsCollection.find().toArray();
      maintenanceIssues[0].reportedBy = studentDocs[0]._id;
      maintenanceIssues[1].reportedBy = studentDocs[1]._id;
    } else {
      console.log(`Students collection already has ${studentCount} documents, skipping`);
      
      // Get student IDs for reference
      const studentDocs = await studentsCollection.find().toArray();
      if (studentDocs.length >= 2) {
        maintenanceIssues[0].reportedBy = studentDocs[0]._id;
        maintenanceIssues[1].reportedBy = studentDocs[1]._id;
      }
    }
    
    // Seed maintenance issues
    const maintenanceCollection = db.collection('maintenance');
    const maintenanceCount = await maintenanceCollection.countDocuments();
    
    if (maintenanceCount === 0) {
      console.log('Seeding maintenance issues...');
      const result = await maintenanceCollection.insertMany(maintenanceIssues);
      console.log(`Added ${result.insertedCount} maintenance issues`);
    } else {
      console.log(`Maintenance collection already has ${maintenanceCount} documents, skipping`);
    }
    
    console.log('Database seeding completed successfully!');
    console.log('You can now use the backup system to backup and restore your database.');
    console.log('Sample admin login:');
    console.log('Username: admin');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the seed function
seedDatabase(); 