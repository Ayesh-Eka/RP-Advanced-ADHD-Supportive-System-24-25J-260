const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process'); // Import spawn to run Python scripts
const db = require('./config/db'); // Import the database connection
require('dotenv').config();
const socialSkillsRoutes = require('./routes/socialSkillsRoutes'); // Import socialSkillsRoutes

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON data

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
app.use('/api/social-skills', socialSkillsRoutes); // Add socialSkillsRoutes



// Prediction endpoint
app.post('/predict', (req, res) => {
  const { text } = req.body; // Expecting text input in the request body

  // Validate input data
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  // Spawn the Python process to run model_api.py with the text input
  const pythonProcess = spawn('python', [
    'model_api.py', // Path to your Python script
    text           // Pass the text to the Python script
  ]);

  // Capture the output from the Python script
  pythonProcess.stdout.on('data', (data) => {
    const prediction = data.toString().trim(); // Clean up the result
    res.json({ prediction }); // Return the prediction as JSON
  });

  // Capture errors from the Python script
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Test the database connection when the server starts
  await testDatabaseConnection();
});
