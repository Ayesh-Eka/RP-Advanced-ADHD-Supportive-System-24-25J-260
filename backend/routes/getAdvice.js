// routes/getAdvice.js
const express = require('express');
const router = express.Router();
const { getAdvice } = require('../controllers/adviceController');

router.post('/get-advice', getAdvice);

module.exports = router;
