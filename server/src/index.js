// index.js
require('dotenv').config(); // Load environment variables
const app = require('./app'); // Import the app from app.js
const port = 3000; // Use the port from the environment or default to 3000

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
