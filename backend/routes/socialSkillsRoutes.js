const express = require('express');
const socialSkillsController = require('../controllers/socialSkillsController');

const router = express.Router();

// Fetch 5 random questions
router.get('/questions', socialSkillsController.getRandomQuestions);

// Check user response
router.post('/check-response', socialSkillsController.checkResponse);

module.exports = router;
