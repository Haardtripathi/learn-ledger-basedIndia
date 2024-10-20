// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

// POST: Register new user

// POST: Login user
router.post('/login', authControllers.loginOrRegisterUser);

module.exports = router;
