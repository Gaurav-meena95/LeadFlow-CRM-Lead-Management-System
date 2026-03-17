const User = require('./model');
const generateTokens = require('../../utils/generateToken');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, phone, password, role });
        const tokens = generateTokens(user);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            ...tokens
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { identifier, password, role } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
            role
        });
        if (user && (await user.matchPassword(password))) {
            const tokens = generateTokens(user);
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                ...tokens
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials or role' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'No refresh token' });
        const decoded = jwt.verify(token, process.env.sec_key);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Invalid token' });
        const tokens = generateTokens(user);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

module.exports = { signup, login, getMe, refreshToken };
