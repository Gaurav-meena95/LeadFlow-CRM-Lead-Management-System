const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.sec_key,
        { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.sec_key,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

module.exports = generateTokens;
