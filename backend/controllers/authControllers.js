const User = require('../models/user');
const ethers = require('ethers');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ walletAddress: user.walletAddress }, JWT_SECRET, { expiresIn: '1d' });
};

// Login or Register a user using their wallet address
module.exports.loginOrRegisterUser = async (req, res) => {
    const { walletAddress, signature } = req.body;
    const message = `Logging in to LearnLedger with wallet: ${walletAddress}`;
    console.log('Wallet Address:', walletAddress);
    console.log('Signature:', signature);

    try {
        // Verify the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'Signature verification failed' });
        }

        // Check if the user exists
        let user = await User.findOne({ walletAddress });

        // If user doesn't exist, create a new one
        if (!user) {
            user = new User({ walletAddress });
            await user.save();
        }

        // Generate JWT
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: user ? 'Login successful' : 'Signup successful',
            token,
            expiresIn: 86400, // 1 day in seconds
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};