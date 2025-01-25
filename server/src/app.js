// app.js
const express = require('express');
const app = express();
const usersRoutes = require('./routes/users.routes'); // Import user routes
const cors = require('cors');


app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Middleware for logging (optional)
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Use the users routes
app.use('/api/users', usersRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; // Export the app for use in index.js
