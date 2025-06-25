const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const RefreshToken = require('../models/RefreshToken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'; // keep it secure

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, education, experience, company_name, position, website } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password_hash: hashedPassword, role });

    // Create role-specific profile
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

    res.status(201).json({ message: 'Registration successful', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({ user_id: user._id, token: refreshToken });

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

//refresh token
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Token required' });

  const stored = await RefreshToken.findOne({ token });
  if (!stored) return res.status(403).json({ message: 'Invalid refresh token' });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    stored.token = newRefreshToken;
    await stored.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    res.status(403).json({ message: 'Token expired or invalid' });
  }
};


//logout
exports.logoutUser = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  await RefreshToken.findOneAndDelete({ token });
  res.status(200).json({ message: 'Logged out successfully' });
};
