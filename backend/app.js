const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./config/db');

const app = express();
app.use(cors({ origin: 'http://localhost:3006' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/', userRoutes); // This line ensures that userRoutes are used

// Error Handling (optional)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));