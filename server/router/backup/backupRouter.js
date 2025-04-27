const express = require('express');
const router = express.Router();
const { 
  createBackup, 
  getBackups, 
  restoreBackup, 
  deleteBackup, 
  downloadBackup 
} = require('../../controller/backup/backupController');

// Import authentication middleware
const { authMiddleware } = require('../../controller/auth-controller/index');

// Create a new backup - admin only
router.post(
  '/', 
  authMiddleware,
  createBackup
);

// Get all backups - admin only
router.get(
  '/', 
  authMiddleware,
  getBackups
);

// Restore database from backup - admin only
router.post(
  '/restore/:filename', 
  authMiddleware, 
  restoreBackup
);

// Download a backup file - admin only
router.get(
  '/download/:filename', 
  authMiddleware,
  downloadBackup
);

// Delete a backup - admin only
router.delete(
  '/:filename', 
  authMiddleware,
  deleteBackup
);

module.exports = router; 