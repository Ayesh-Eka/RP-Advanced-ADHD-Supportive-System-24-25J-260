// backend/models/SocialSkillsQuestion.js
const db = require('../config/db');

class SocialSkillsQuestion {
  static async getRandomQuestions(limit = 5) {
    const [questions] = await db.execute(
      'SELECT * FROM social_skills_questions ORDER BY RAND() LIMIT ?',
      [limit]
    );
    return questions;
  }
}

module.exports = SocialSkillsQuestion;