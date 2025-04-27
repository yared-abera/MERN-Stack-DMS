const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n===== MongoDB Tools Installation Check =====');

// Try to find mongodump in common installation locations for Windows
const findMongoDBToolsPath = () => {
  console.log('\nSearching for MongoDB tools in common installation paths...');
  
  const possiblePaths = [
    // Windows common paths
    'C:\\Program Files\\MongoDB\\Tools\\bin',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin',
    'C:\\Program Files\\MongoDB\\Server\\5.0\\bin',
    'C:\\Program Files\\MongoDB\\Server\\4.4\\bin',
    'C:\\Program Files\\MongoDB\\Database Tools\\bin',
    // MongoDB installation paths using environment variables
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Server', '6.0', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Server', '5.0', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Server', '4.4', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Tools', 'bin'),
    path.join(process.env.ProgramFiles || '', 'MongoDB', 'Database Tools', 'bin'),
  ];

  for (const dirPath of possiblePaths) {
    const mongodumpPath = path.join(dirPath, 'mongodump.exe');
    const mongorestorePath = path.join(dirPath, 'mongorestore.exe');
    
    if (fs.existsSync(mongodumpPath) && fs.existsSync(mongorestorePath)) {
      console.log(`✅ MongoDB tools found at: ${dirPath}`);
      return dirPath;
    }
  }
  
  console.log('❌ MongoDB tools not found in common installation paths');
  return null;
};

const mongoToolsPath = findMongoDBToolsPath();

// Check mongodump in PATH
console.log('\nChecking if MongoDB tools are available in system PATH...');
exec('mongodump --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ mongodump is not installed or not in system PATH');
    
    if (mongoToolsPath) {
      console.log('\n=== SOLUTION (Method 1): Add MongoDB tools to your PATH ===');
      console.log(`1. The MongoDB tools were found at: ${mongoToolsPath}`);
      console.log('2. Add this path to your system PATH environment variable:');
      console.log('   a. Right-click on "This PC" or "My Computer" and select "Properties"');
      console.log('   b. Click on "Advanced system settings"');
      console.log('   c. Click on "Environment Variables"');
      console.log('   d. Under "System variables", find and select the "Path" variable, then click "Edit"');
      console.log(`   e. Click "New" and add: ${mongoToolsPath}`);
      console.log('   f. Click "OK" on all dialogs to save');
      console.log('   g. Restart your terminal/command prompt');
    } else {
      console.log('\n=== SOLUTION (Method 2): Install MongoDB Database Tools ===');
      console.log('1. Download MongoDB Database Tools from: https://www.mongodb.com/try/download/database-tools');
      console.log('2. Select your operating system (Windows) and download the MSI installer');
      console.log('3. Run the installer and follow the installation steps');
      console.log('4. During installation, make sure to select the option to add to PATH');
      console.log('5. After installation, restart your terminal/command prompt');
    }
    
    console.log('\n=== ALTERNATIVE SOLUTION ===');
    console.log('The system will attempt to use a direct database backup approach that does not require');
    console.log('MongoDB tools, but installing the tools is recommended for better backup functionality.');
  } else {
    console.log('✅ mongodump is installed and available in PATH:');
    console.log(stdout.trim());
  }
});

// Check mongorestore
exec('mongorestore --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ mongorestore is not installed or not in PATH');
  } else {
    console.log('✅ mongorestore is installed and available in PATH:');
    console.log(stdout.trim());
  }
});

console.log('\n=== Important Note ===');
console.log('The backup system has been designed to work even without MongoDB tools installed.');
console.log('However, using the MongoDB tools is recommended for better performance and compatibility.');
console.log('If you cannot install the tools, the system will use a direct database backup method.\n'); 