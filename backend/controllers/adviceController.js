// controllers/adviceController.js
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getAdvice = async (req, res) => {
  const { score, responses } = req.body;

  const messages = [
    {
      role: 'system',
      content:
        'You are a helpful educational assistant for children with ADHD. Give personalized, encouraging advice based on their social skill assessment. Advice need to limit 50-70 words',
    },
    {
      role: 'user',
      content: `A student got a score of ${score} out of 5 in a social skills quiz. Here are their responses:\n${responses
        .map(
          (r, i) =>
            `Q${i + 1}: ${r.question}\nA: ${r.response} (${
              r.isPositive ? 'Positive' : 'Negative'
            })`
        )
        .join('\n')}\n\nGive a short and motivating paragraph of advice tailored to this performance.`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
    });

    const advice = completion.choices[0].message.content;
    res.json({ advice });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Error getting advice' });
  }
};

module.exports = { getAdvice };
