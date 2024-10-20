const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Store user information in the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};

// Middleware to check if the user is not authenticated
const isNotAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        return res.status(403).json({ success: false, message: 'Access denied. Already authenticated.' });
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports = { isAuthenticated, isNotAuthenticated };
