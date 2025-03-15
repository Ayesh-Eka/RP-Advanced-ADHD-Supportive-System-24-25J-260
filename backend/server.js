const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db'); // Import the database connection
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    const [rows] = await db.execute('SELECT 1'); // Simple query to test the connection
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error Code:', error.code); // MySQL error code
    console.error('Error Message:', error.message); // Detailed error message
    console.error('Stack Trace:', error.stack); // Full stack trace
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Test the database connection when the server starts
  await testDatabaseConnection();
});