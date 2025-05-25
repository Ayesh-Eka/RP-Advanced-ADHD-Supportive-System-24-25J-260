// backend/routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Handle chat messages
router.post('/chat', chatController.handleChatMessage);

module.exports = router;