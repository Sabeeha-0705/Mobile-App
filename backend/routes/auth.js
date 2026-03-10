//backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, getOTPExpiry } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/email');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email for verification
 * @access  Public
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already verified
    const existingUser = await User.findOne({ email, isEmailVerified: true });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered and verified'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry(10); // 10 minutes

    // Find or create user with unverified email
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing unverified user
      user.otp = { code: otp, expiresAt: otpExpiry };
      if (fullName) user.fullName = fullName;
      await user.save();
    } else {
      // Create new user (unverified)
      user = await User.create({
        email,
        fullName: fullName || 'User',
        otp: { code: otp, expiresAt: otpExpiry },
        isEmailVerified: false
      });
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, fullName);
      
      res.json({
        success: true,
        message: 'OTP sent to your email successfully',
        expiresIn: '10 minutes'
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please check email configuration.'
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and mark email as verified
 * @access  Public
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: 'Email already verified',
        isVerified: true
      });
    }

    // Validate OTP
    if (!user.isOTPValid(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.otp = undefined; // Clear OTP
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
      isVerified: true
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed'
    });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Complete registration after email verification
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not found. Please verify your email first.'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    // Check if already has password (already registered)
    if (user.password) {
      return res.status(400).json({
        success: false,
        message: 'User already registered. Please login instead.'
      });
    }

    // Update user with password and role
    user.password = password;
    user.role = role || 'learner';
    if (fullName) user.fullName = fullName;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration completed successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Google authentication (for Expo/Mobile)
 * @access  Public
 */
router.post('/google', async (req, res) => {
  try {
    const { idToken, email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google authentication data'
      });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        email,
        fullName: name || 'Google User',
        googleId,
        isEmailVerified: true,
        role: 'learner' // Default role for Google signup
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

module.exports = router;
