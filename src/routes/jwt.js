const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { verifyToken, tokenLimiter } = require('../middlewares');
const { getUserByEmail } = require('../services/user');

const router = express.Router();

router.post('/login', tokenLimiter, async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(400).json({
                code: 400,
                message: 'Email and Password are missing.',
            });
        }
        const user = await getUserByEmail(email)
        console.log(user)
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: 'Email or Password is incorrect.',
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: 'Email or Password is incorrect.',
            });
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            issuer: 'iosif'
        });

        return res
            .status(200)
            .json({
                token: `Bearer ${token}`,
            });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
        });
    }
});


router.post('/logout', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(403);
        }
        jwt.destroy(token.slice(7));
        return res
            .status(200)
            .json({
                message: 'Logout Success',
            });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
        });
    }
});

router.get('/verifyToken', verifyToken, (req, res) => {
    res.json(req.decoded);
});

module.exports = router;