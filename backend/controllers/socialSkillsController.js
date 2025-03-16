const axios = require('axios');
const { spawn } = require('child_process');
const SocialSkillsQuestion = require('../models/SocialSkillsQuestion');  // Ensure correct path to the model

// Fetch 5 random questions
const getRandomQuestions = async (req, res) => {
  try {
    // Ensure you're getting the correct number of questions from the model
    const questions = await SocialSkillsQuestion.getRandomQuestions();
    
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// Check user response using the Python model
const checkResponse = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    // Spawn the Python process to run model_api.py with the text input
    const pythonProcess = spawn('python', [
      'model_api.py', // Path to your Python script
      text           // Pass the text to the Python script
    ]);

    let prediction = '';

    // Capture the output from the Python script
    pythonProcess.stdout.on('data', (data) => {
      prediction += data.toString().trim(); // Concatenate all output data
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    // Ensure the response is only sent once, once the python process finishes
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: `Python script exited with code ${code}` });
      }

      if (!prediction) {
        return res.status(500).json({ error: 'No prediction returned from the Python model' });
      }

      // Check if prediction is positive or negative
      const isPositive = prediction.toLowerCase() === 'positive';

      // Return the result to the frontend
      res.json({ isPositive });
    });

  } catch (error) {
    console.error('Error checking response:', error.message);
    res.status(500).json({ error: 'Failed to check response' });
  }
};

module.exports = { getRandomQuestions, checkResponse };
