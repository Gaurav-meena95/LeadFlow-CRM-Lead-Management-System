const jwt = require('jsonwebtoken');
const User = require('../modules/auth/model');
const generateTokens = require('../utils/generateToken');

const sec_key = process.env.sec_key;

const verifyUserMiddleware = (req, res, next) => {
    try {
        const Authheader = req.headers.authorization;
        const refreshToken = req.headers['x-refresh-token'];

        if (!Authheader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }


        const [prefix, token] = Authheader.split(' ');
        if (!token) {
            return res.status(401).json({ message: "Token is Absent" });
            
        }
         if (prefix !== 'JWT') {
            return res.status(401).json({ message: "Invalid Token" });
        }
        jwt.verify(token, sec_key, async (err, decode) => {
            if (err && err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    return res.status(401).json({ message: "Refresh Token required" });
                }
                jwt.verify(refreshToken, sec_key, async (err, refreshDecode) => {
                    
                    if (err) {
                        return res.status(401).json({ msg: 'Invalid Refresh Token 2' });
                    }

                    const user = await User.findById(refreshDecode.id);
                    if (!user) {
                         return res.status(401).json({ message: "User not found" });
                    }

                    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
                    
                    res.set('x-access-token', accessToken);
                    res.set('x-refresh-token', newRefreshToken);

                    req.user = user;
                    
                    next();
                });

            } else if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                req.user = await User.findById(decode.id);
                if (!req.user) {
                     return res.status(401).json({ message: "User not found" });
                }
                next();
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { verifyUserMiddleware };
