const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { MongoClient } = require('mongodb');

// Create backup directory if it doesn't exist
const backupDir = path.join(__dirname, '../../uploads/backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// MongoDB connection string
const mongoUri = "mongodb://localhost:27017/";
const dbName = 'DMS';

// Try to find mongodump path in common installation locations
const findMongoDBToolsPath = () => {
  const possiblePaths = [
    // Windows common paths
    'C:\\Program Files\\MongoDB\\Tools\\bin',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin',
    'C:\\Program Files\\MongoDB\\Server\\5.0\\bin',
    'C:\\Program Files\\MongoDB\\Server\\4.4\\bin',
    'C:\\Program Files\\MongoDB\\Database Tools\\bin',
    // MongoDB installation paths
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Server', '6.0', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Server', '5.0', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Server', '4.4', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Tools', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Database Tools', 'bin'),
    // Add more common paths as needed
  ];

  for (const dirPath of possiblePaths) {
    const mongodumpPath = path.join(dirPath, 'mongodump.exe');
    const mongorestorePath = path.join(dirPath, 'mongorestore.exe');
    
    if (fs.existsSync(mongodumpPath) && fs.existsSync(mongorestorePath)) {
      return dirPath;
    }
  }
  
  return null; // Not found in common paths
};

const mongoToolsPath = findMongoDBToolsPath();
console.log('MongoDB Tools Path:', mongoToolsPath || 'Not found in common paths, will try system PATH');

// Admin role check middleware function
const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }
};

/**
 * Create a database backup
 */
const createBackup = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }

  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFilePath = path.join(backupDir, `backup-${timestamp}.gz`);

    // Try to create a backup with mongodump if available
    if (mongoToolsPath) {
      // Use absolute path for mongodump
      const mongodumpPath = path.join(mongoToolsPath, 'mongodump.exe');
      const cmd = `"${mongodumpPath}" --db=${dbName} --archive="${backupFilePath}" --gzip`;
      await execPromise(cmd);
    } else {
      // Fallback to direct MongoDB backup if mongodump is not found
      const jsonBackupPath = path.join(backupDir, `backup-${timestamp}.json`);
      await createDirectMongoBackup(jsonBackupPath);
    }

    // List all backups to include in response
    const backups = await listBackups();

    res.status(200).json({
      success: true,
      message: "Database backup created successfully",
      backups: backups
    });
  } catch (error) {
    console.error("Error creating backup:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating backup",
      error: error.message
    });
  }
};

/**
 * Direct MongoDB backup without mongodump
 */
const createDirectMongoBackup = async (backupFilePath) => {
  console.log(`Creating direct MongoDB backup to ${backupFilePath}`);
  const client = new MongoClient(mongoUri);
  
  try {
    console.log(`Connecting to MongoDB database: ${dbName}...`);
    await client.connect();
    console.log("Connected to MongoDB successfully");
    
    const db = client.db(dbName);
    
    // Get all collections
    console.log("Fetching collections...");
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections`);
    
    // Create backup object
    const backup = {};
    
    // Add metadata
    backup._metadata = {
      createdAt: new Date().toISOString(),
      dbName: dbName,
      collectionsCount: collections.length,
      backupType: 'direct',
      version: '1.0'
    };
    
    // Empty database handling
    if (collections.length === 0) {
      console.log("No collections found - creating empty backup with metadata");
      backup._metadata.isEmpty = true;
      backup._metadata.message = "Database exists but contains no collections. This is normal for a new installation.";
      
      // Write backup to file
      console.log(`Writing metadata-only backup to ${backupFilePath}`);
      fs.writeFileSync(backupFilePath, JSON.stringify(backup, null, 2));
      console.log(`Empty backup with metadata successfully written to ${backupFilePath}`);
      
      return {
        success: true,
        collections: 0,
        documents: 0,
        isEmpty: true
      };
    }
    
    // For each collection, fetch all documents
    let totalDocuments = 0;
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Processing collection: ${collectionName}`);
      
      try {
        // Get documents from the collection with a reasonable batch size
        const documents = await db.collection(collectionName).find({})
          .limit(10000) // Limit to avoid memory issues with very large collections
          .toArray();
        
        console.log(`Retrieved ${documents.length} documents from ${collectionName}`);
        totalDocuments += documents.length;
        
        // Store collection data in backup object
        backup[collectionName] = documents;
      } catch (err) {
        console.error(`Error processing collection ${collectionName}:`, err);
        // Continue with other collections if one fails
        backup[collectionName] = [];
        backup._metadata.errors = backup._metadata.errors || [];
        backup._metadata.errors.push({
          collection: collectionName,
          error: err.message
        });
      }
    }
    
    // Update metadata with document count
    backup._metadata.documentsCount = totalDocuments;
    
    // Write backup to file
    console.log(`Writing backup with ${collections.length} collections and ${totalDocuments} documents to ${backupFilePath}`);
    fs.writeFileSync(backupFilePath, JSON.stringify(backup, null, 2));
    console.log(`Backup successfully written to ${backupFilePath}`);
    
    return {
      success: true,
      collections: collections.length,
      documents: totalDocuments
    };
  } catch (error) {
    console.error("Error in direct MongoDB backup:", error);
    throw error;
  } finally {
    console.log("Closing MongoDB connection");
    await client.close();
  }
};

/**
 * Get list of all available backups
 */
const getBackups = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }

  try {
    const backups = await listBackups();
    
    res.status(200).json({
      success: true,
      count: backups.length,
      data: backups
    });
  } catch (error) {
    console.error("Error fetching backups:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching backups",
      error: error.message
    });
  }
};

/**
 * Restore database from a backup file
 */
const restoreBackup = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }

  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Backup filename is required!"
      });
    }

    const backupFilePath = path.join(backupDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({
        success: false,
        message: "Backup file not found!"
      });
    }

    // Try to restore using mongorestore if available
    if (mongoToolsPath && filename.endsWith('.gz')) {
      // Use absolute path for mongorestore
      const mongorestorePath = path.join(mongoToolsPath, 'mongorestore.exe');
      const cmd = `"${mongorestorePath}" --db=${dbName} --archive="${backupFilePath}" --gzip --drop`;
      await execPromise(cmd);
    } else {
      // Fallback to direct MongoDB restore
      await restoreDirectMongoBackup(backupFilePath);
    }

    res.status(200).json({
      success: true,
      message: "Database restored successfully from backup"
    });
  } catch (error) {
    console.error("Error restoring backup:", error);
    res.status(500).json({
      success: false,
      message: "Server error while restoring backup",
      error: error.message
    });
  }
};

/**
 * Direct MongoDB restore without mongorestore
 */
const restoreDirectMongoBackup = async (backupFilePath) => {
  console.log(`Restoring from direct MongoDB backup: ${backupFilePath}`);
  
  // Check file extension
  if (backupFilePath.endsWith('.gz')) {
    throw new Error("Cannot restore .gz backup without mongorestore. Please install MongoDB Tools.");
  }
  
  const client = new MongoClient(mongoUri);
  try {
    console.log(`Connecting to MongoDB database: ${dbName}...`);
    await client.connect();
    console.log("Connected to MongoDB successfully");
    
    const db = client.db(dbName);
    
    // Read backup file
    console.log("Reading backup file...");
    const backupContent = fs.readFileSync(backupFilePath, 'utf8');
    const backup = JSON.parse(backupContent);
    
    // Check for metadata
    if (backup._metadata) {
      console.log(`Backup metadata found: created at ${backup._metadata.createdAt}`);
      
      // Check if it's an empty backup
      if (backup._metadata.isEmpty) {
        console.log("This is an empty backup (database with no collections)");
        console.log("No restoration needed for empty database backup");
        return;
      }
    }
    
    // Filter out metadata from collections to restore
    const collections = Object.keys(backup).filter(key => key !== '_metadata');
    console.log(`Found ${collections.length} collections in backup`);
    
    for (const collectionName of collections) {
      console.log(`Restoring collection: ${collectionName}`);
      
      // Drop existing collection
      try {
        console.log(`Dropping existing collection: ${collectionName}`);
        await db.collection(collectionName).drop();
      } catch (err) {
        // Collection might not exist, proceed
        console.log(`Collection ${collectionName} does not exist or cannot be dropped`);
      }
      
      // Insert documents if there are any
      const documents = backup[collectionName];
      console.log(`Inserting ${documents.length} documents into ${collectionName}`);
      
      if (documents.length > 0) {
        try {
          await db.collection(collectionName).insertMany(documents);
          console.log(`Successfully restored ${documents.length} documents to ${collectionName}`);
        } catch (err) {
          console.error(`Error inserting documents into ${collectionName}:`, err);
        }
      }
    }
    
    console.log("Database restore completed successfully");
  } finally {
    console.log("Closing MongoDB connection");
    await client.close();
  }
};

/**
 * Delete a backup file
 */
const deleteBackup = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }

  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Backup filename is required!"
      });
    }

    const backupFilePath = path.join(backupDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({
        success: false,
        message: "Backup file not found!"
      });
    }

    // Delete the backup file
    fs.unlinkSync(backupFilePath);

    // Get updated list of backups
    const backups = await listBackups();

    res.status(200).json({
      success: true,
      message: "Backup deleted successfully",
      data: backups
    });
  } catch (error) {
    console.error("Error deleting backup:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting backup",
      error: error.message
    });
  }
};

/**
 * Download a backup file
 */
const downloadBackup = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }

  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Backup filename is required!"
      });
    }

    const backupFilePath = path.join(backupDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({
        success: false,
        message: "Backup file not found!"
      });
    }

    res.download(backupFilePath);
  } catch (error) {
    console.error("Error downloading backup:", error);
    res.status(500).json({
      success: false,
      message: "Server error while downloading backup",
      error: error.message
    });
  }
};

/**
 * Helper function to list all backups
 */
const listBackups = async () => {
  const files = fs.readdirSync(backupDir);
  return files
    .filter(file => file.startsWith('backup-'))
    .map(file => {
      const stats = fs.statSync(path.join(backupDir, file));
      
      // Try to read metadata for JSON backups
      let metadata = null;
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(backupDir, file), 'utf8');
          const data = JSON.parse(content);
          if (data._metadata) {
            metadata = data._metadata;
          }
        } catch (err) {
          // Ignore errors reading metadata
        }
      }
      
      return {
        filename: file,
        size: stats.size,
        createdAt: stats.birthtime,
        metadata: metadata
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt); // Sort newest first
};

/**
 * Schedule automated backups (can be called from server startup)
 */
let isBackupScheduled = false; // Flag to prevent multiple schedules

const scheduleAutomatedBackups = () => {
  // Prevent multiple scheduling
  if (isBackupScheduled) {
    console.log('Automated backup already scheduled, skipping...');
    return;
  }

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const runDailyBackup = async () => {
    try {
      // Get the last backup time from existing backups
      const backups = await listBackups();
    const now = new Date();
      let nextBackupTime;

      if (backups.length > 0) {
        // Get the most recent backup time and add 24 hours
        const lastBackupTime = new Date(backups[0].createdAt);
        nextBackupTime = new Date(lastBackupTime.getTime() + TWENTY_FOUR_HOURS);
        
        // If the calculated next backup time is in the past, schedule for 24 hours from now
        if (nextBackupTime < now) {
          nextBackupTime = new Date(now.getTime() + TWENTY_FOUR_HOURS);
        }
      } else {
        // If no previous backups, schedule for 24 hours from now
        nextBackupTime = new Date(now.getTime() + TWENTY_FOUR_HOURS);
      }
    
      // Calculate time until next backup
      const timeUntilBackup = nextBackupTime - now;
    
      console.log(`Next backup scheduled for: ${nextBackupTime.toLocaleString()}`);
    console.log(`Next backup will run in ${Math.floor(timeUntilBackup / 3600000)} hours and ${Math.floor((timeUntilBackup % 3600000) / 60000)} minutes`);
    
      // Schedule the next backup
      setTimeout(async () => {
      console.log(`Running automated backup at ${new Date().toISOString()}`);
        try {
          const result = await createAutomatedBackup();
          console.log('Automated backup completed successfully');
          console.log('Backup details:', result);
        } catch (err) {
          console.error('Automated backup failed:', err);
        }
        // Schedule next backup regardless of success/failure
          runDailyBackup();
    }, timeUntilBackup);
    } catch (error) {
      console.error('Error in backup scheduling:', error);
      // If there's an error, retry scheduling in 1 hour
      setTimeout(runDailyBackup, 60 * 60 * 1000);
    }
  };

  // Start the backup schedule
        runDailyBackup();
  isBackupScheduled = true;
};

/**
 * Create an automated backup without HTTP response
 */
const createAutomatedBackup = async () => {
  try {
    // Format date for more readable filename: YYYY-MM-DD_HH-MM-SS
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const backupFileName = `backup-${formattedDate}_time-${formattedTime}`;
    let backupResult = {};
    
    // Try to create a backup with mongodump if available
    if (mongoToolsPath) {
      // Use absolute path for mongodump
      const mongodumpPath = path.join(mongoToolsPath, 'mongodump.exe');
      const backupFilePathGz = path.join(backupDir, `${backupFileName}.gz`);
      const cmd = `"${mongodumpPath}" --db=${dbName} --archive="${backupFilePathGz}" --gzip`;
      await execPromise(cmd);
      
      const stats = fs.statSync(backupFilePathGz);
      backupResult = {
        method: 'mongodump',
        path: backupFilePathGz,
        size: stats.size
      };
    } else {
      // Fallback to direct MongoDB backup
      const backupFilePath = path.join(backupDir, `${backupFileName}.json`);
      const result = await createDirectMongoBackup(backupFilePath);
      
      const stats = fs.statSync(backupFilePath);
      backupResult = {
        method: 'direct',
        path: backupFilePath,
        size: stats.size,
        collections: result.collections,
        documents: result.documents,
        isEmpty: result.isEmpty
      };
    }
    
    // Cleanup old backups (keep only last 10)
    const backups = await listBackups();
    if (backups.length > 10) {
      console.log(`Cleaning up old backups. Keeping the 10 most recent out of ${backups.length} total.`);
      const oldBackups = backups.slice(10);
      for (const backup of oldBackups) {
        console.log(`Deleting old backup: ${backup.filename}`);
        fs.unlinkSync(path.join(backupDir, backup.filename));
      }
    }
    
    return {
      success: true,
      ...backupResult
    };
  } catch (error) {
    console.error("Error creating automated backup:", error);
    throw error;
  }
};

module.exports = {
  createBackup,
  getBackups,
  restoreBackup,
  deleteBackup,
  downloadBackup,
  scheduleAutomatedBackups
}; 