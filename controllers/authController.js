const mongoose = require('mongoose');
const User = require('../models/User');

// In-memory storage for demo purposes when MongoDB is not available
let demoUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@hostel.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    fullName: 'Admin User',
    role: 'admin'
  }
];

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Fallback to in-memory storage
      const existingUser = demoUsers.find(u => u.email === email || u.username === username);
      
      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
        });
      }

      // Create new demo user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = {
        id: (demoUsers.length + 1).toString(),
        username,
        email,
        password: hashedPassword,
        fullName,
        role: 'user'
      };
      
      demoUsers.push(newUser);

      res.status(201).json({
        message: 'User registered successfully (Demo Mode)',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role
        }
      });
      return;
    }

    // MongoDB is connected, use normal flow
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Fallback to in-memory storage
      const user = demoUsers.find(u => u.username === username || u.email === username);
      
      if (!user) {
        return res.status(401).json({
          message: 'Invalid username or password'
        });
      }

      // Compare password
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid username or password'
        });
      }

      res.json({
        message: 'Login successful (Demo Mode)',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });
      return;
    }

    // MongoDB is connected, use normal flow
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Account is deactivated'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
