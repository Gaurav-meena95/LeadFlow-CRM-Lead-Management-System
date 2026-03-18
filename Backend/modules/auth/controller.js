const { validationInput } = require('../../utils/utils');
const User = require('./model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, shopName, email, phone, password, role } = req.body;
    const value = validationInput({ name, email, phone, password, role });
    if (value) return res.status(403).json({ message: `Check missing value ${value}` });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid Email Address' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }
    if (!/(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain one special character' });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, shopName: shopName || 'LeadFlow', email, phone, password: hashed, role });

    return res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const value = validationInput({ email, password, role });
    if (value) return res.status(403).json({ message: `Check missing value ${value}` });

    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ message: 'User not found or check role' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.sec_key,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.sec_key,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ message: 'Login successful', user, token, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.body.token || req.headers['x-refresh-token'];
    if (!token) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(token, process.env.sec_key);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.sec_key,
      { expiresIn: '1h' }
    );
    const newRefreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.sec_key,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (phone) {
      if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: 'Phone must be 10 digits' });
      user.phone = phone;
    }
    if (password) {
      if (!/(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
        return res.status(400).json({ message: 'Password must be 8+ chars with a special character' });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    return res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { signup, login, refreshToken, me, updateMe, getUsers };
