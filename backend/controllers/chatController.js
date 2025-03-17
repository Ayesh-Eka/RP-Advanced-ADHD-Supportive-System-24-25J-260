// backend/controllers/chatController.js
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add your OpenAI API key to .env
});

// Handle chat messages
const handleChatMessage = async (req, res) => {
  const { message } = req.body;

  try {
    // Send the message to OpenAI with specific instructions
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use GPT-3.5 Turbo
      messages: [
        {
          role: 'system',
          content:
            'You are a professional assistant specialized in ADHD. Provide detailed, accurate, and professional information about ADHD only. Do not discuss any other topics. If the user asks about something unrelated to ADHD, politely redirect the conversation back to ADHD.',
        },
        { role: 'user', content: message },
      ],
    });

    // Extract the assistant's reply
    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to process your message' });
  }
};

module.exports = { handleChatMessage };