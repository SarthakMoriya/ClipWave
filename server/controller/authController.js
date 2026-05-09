const bcrypt = require('bcryptjs');
const User = require('../model/authModel');
const { generateToken } = require('../config/jwt');
const { sendResetEmail } = require('../utils/emailService');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password', code: 400 });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long', code: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered. Please login instead.', code: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = await User.create(name, email, hashedPassword);

    res.status(201).json({ 
      message: 'Account created successfully! You can now login.', 
      code: 201, 
      userId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error during signup', code: 500 });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', code: 400 });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email', code: 404 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.', code: 401 });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({ 
      message: 'Login successful', 
      code: 200, 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error during login', code: 500 });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide your registered email', code: 400 });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email', code: 404 });
    }

    // Generate a 6-digit reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 3600000; // 1 hour expiry

    await User.updateResetToken(email, resetToken, expiry);

    // Send the actual email
    try {
      await sendResetEmail(email, resetToken);
      res.json({ 
        message: 'Password reset code sent to your email', 
        code: 200 
      });
    } catch (emailError) {
      console.error("Email send failed, falling back to response code for debug:", emailError);
      // For local testing if email fails, we can still provide the code
      res.status(500).json({ 
        message: 'Account found but failed to send email. Check server logs.', 
        code: 500,
        debug_token: resetToken // KEEP THIS ONLY FOR TESTING
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing forgot password request', code: 500 });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Email, token, and new password are required', code: 400 });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Invalid request', code: 404 });
    }

    if (user.reset_token !== token || Date.now() > user.reset_token_expiry) {
      return res.status(400).json({ message: 'Invalid or expired reset token', code: 400 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updatePassword(email, hashedPassword);

    res.json({ message: 'Password has been reset successfully', code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password', code: 500 });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword };