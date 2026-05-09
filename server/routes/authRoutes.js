const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword } = require('../controller/authController');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Forgot Password route
router.post('/forgot-password', forgotPassword);

// Reset Password route
router.post('/reset-password', resetPassword);

module.exports = router;