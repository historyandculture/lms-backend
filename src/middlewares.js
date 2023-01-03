const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');
const { getUserByEmail } = require('./services/user');


var tokenLimiter = RateLimit({
    windowMs: 1000 * 60,
    max: 10,
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: 'Unavailable.'
        });
    },
});

var apiLimiter = RateLimit({
    windowMs: 1000 * 60,
    max: 100,
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: 'Unavailable.',
        });
    },
});
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403);
    }
    try {
        req.decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET)
        return next();
    }
    catch (error) {
        if (error.name === 'TokenExpireError') {
            return res.status(419).json({
                code: 419,
                message: 'Token Expired.'
            });
        }
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized.'
        });
    }
};

function verifyPermission(requiredPermissionLevel) {
    return (req, res, next) => {
        const email = req.decoded.email
        const user = getUserByEmail(email);
        if (!user) {
            return res.status(403).json({
                code: 403,
                message: 'No Permission.'
            });
        }
        var permissionLevel = user.permissionLevel
        if (permissionLevel === 0 && user.id === req.params.id) permissionLevel++;
        if (permissionLevel < requiredPermissionLevel) {
            return res.status(403).json({
                code: 403,
                message: 'No Permission.'
            });
        }
        return next();
    }
}


module.exports = {
    verifyToken,
    verifyPermission,
    tokenLimiter,
    apiLimiter
}