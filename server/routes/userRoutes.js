const express = require('express');
const { ForgotPassword, ResetPassword } = require('../controllers/userController');

const router = express.Router();

// Password reset routes
router.post('/forgot-password', ForgotPassword);
router.post('/reset/:id/:token', ResetPassword);

module.exports = router; 