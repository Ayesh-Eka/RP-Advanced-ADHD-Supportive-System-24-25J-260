const axios = require('axios');
const { spawn } = require('child_process');
const SocialSkillsQuestion = require('../models/SocialSkillsQuestion');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Fetch 5 random questions
const getRandomQuestions = async (req, res) => {
  try {
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

// Classify using both Python model and OpenAI
const checkResponse = async (req, res) => {
  const { text, question } = req.body;

  if (!text || !question) {
    return res.status(400).json({ error: 'Text and question are required' });
  }

  try {
    // 1. Run the Python model
    const pythonProcess = spawn('python', [
      'social-skills-model/model_api.py',
      text
    ]);

    let prediction = '';

    pythonProcess.stdout.on('data', (data) => {
      prediction += data.toString().trim();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: `Python script exited with code ${code}` });
      }

      if (!prediction) {
        return res.status(500).json({ error: 'No prediction returned from the Python model' });
      }

      const modelPrediction = prediction.toLowerCase();

      // 2. Send to OpenAI to validate or enhance the prediction
      try {
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a classifier that outputs only "Positive" or "Negative" based on a child\'s answer to a social skills question.'
              },
              {
                role: 'user',
                content: `Question: ${question}\nAnswer: ${text}\nModel Prediction: ${modelPrediction}\n\nClassify the answer as Positive or Negative only.`
              }
            ],
            temperature: 0.0,
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const openaiClassification = openaiResponse.data.choices[0].message.content.trim().toLowerCase();
        const finalClassification = openaiClassification.includes('positive') ? 'positive' : 'negative';

        res.json({
          modelPrediction,
          openaiClassification: finalClassification,
          isPositive: finalClassification === 'positive'
        });

      } catch (err) {
        console.error('OpenAI API error:', err.message);
        return res.status(500).json({ error: 'Failed to get classification from OpenAI' });
      }
    });
  } catch (error) {
    console.error('Error checking response:', error.message);
    res.status(500).json({ error: 'Failed to check response' });
  }
};

module.exports = { getRandomQuestions, checkResponse };
