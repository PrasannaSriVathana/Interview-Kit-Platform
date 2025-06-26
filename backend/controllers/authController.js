const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const CandidateProfile = require('../models/CandidateProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const RefreshToken = require('../models/RefreshToken');

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, education, experience, company_name, position, website } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password_hash: hashedPassword, role });

    if (role === 'candidate') {
      await CandidateProfile.create({
        user_id: user._id,
        education,
        experience
      });
    } else if (role === 'recruiter') {
      await RecruiterProfile.create({
        user_id: user._id,
        company_name,
        position,
        website
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: { userId: user._id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      data: null
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid credentials',
        data: null
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({ user_id: user._id, token: refreshToken });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      data: null
    });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token required',
      data: null
    });
  }

  const stored = await RefreshToken.findOne({ token });
  if (!stored) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid refresh token',
      data: null
    });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    stored.token = newRefreshToken;
    await stored.save();

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({
      status: 'error',
      message: 'Token expired or invalid',
      data: null
    });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      status: 'error',
      message: 'Token is required',
      data: null
    });
  }

  await RefreshToken.findOneAndDelete({ token });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
    data: null
  });
};
