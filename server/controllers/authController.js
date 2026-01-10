import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Registration attempt:', { username, email }); // Debug log

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email, and password' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ 
          message: 'Email already registered' 
        });
      }
      if (userExists.username === username) {
        return res.status(400).json({ 
          message: 'Username already taken' 
        });
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    console.log('User created successfully:', user._id); // Debug log

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error); // Full error log
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join('. ') 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message // Send error message for debugging
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Send response
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      message: 'Server error fetching user data' 
    });
  }
};